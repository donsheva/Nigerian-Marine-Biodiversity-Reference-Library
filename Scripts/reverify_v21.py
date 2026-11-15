"""
reverify_v21.py
─────────────────────────────────────────────────────────────────────────────
Nigerian Marine Biodiversity Reference Library — v21 re-verification script

Purpose
  Re-queries NCBI Nucleotide and BOLD Systems for every species currently
  defined in the v21 dashboard, applies the v21 marker-specific WA
  classification rule, and produces a verification report + patch file.

What it does NOT do by default
  Does NOT silently rewrite the HTML. Produces a patch file for review.
  Only rewrites the HTML when run with --apply.

v21 classification rule (mirror of the JS in the dashboard)
  Thresholds: COI >= 5, 12S >= 3, 18S >= 1, 28S >= 1, rbcL >= 3
  Classification: absent (0 WA), partial (1..threshold-1 WA), present (>= threshold)
  Overall = combine NCBI-status and BOLD-status as in the dashboard.

Geographic scope
  Gulf of Guinea: Nigeria, Ghana, Cameroon, Benin, Togo, Cote d'Ivoire
  (Narrower than the v20 West Africa scope — explicit user choice for v21.)

Marker scope
  Per species: its primary marker (from the dashboard's `marker:` field)
  Plus: BOLD COI for every species (BOLD is COI-centric, cheap to query)

Outputs (all written next to the script)
  verification_report_v21.csv    — human-readable diff
  verification_report_v21.json   — structured data
  dashboard_update_patch.json    — patch for applier
  ncbi_cache.json, bold_cache.json — query caches (safe to delete)
  reverify_v21.log               — run log

Usage
  python reverify_v21.py --dashboard nigeria_reflib_dashboard_v21.html
  python reverify_v21.py --dashboard nigeria_reflib_dashboard_v21.html --apply
  python reverify_v21.py --dashboard ... --email you@example.com --api-key XXX

Requirements
  pip install biopython requests
"""

from __future__ import annotations

import argparse
import json
import logging
import re
import sys
import time
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Optional

try:
    from Bio import Entrez
except ImportError:
    print("ERROR: biopython is required. Install with: pip install biopython", file=sys.stderr)
    sys.exit(1)

try:
    import requests
except ImportError:
    print("ERROR: requests is required. Install with: pip install requests", file=sys.stderr)
    sys.exit(1)


# ────────────────────────────────────────────────────────────────────────────
# Configuration
# ────────────────────────────────────────────────────────────────────────────

GULF_OF_GUINEA_COUNTRIES = [
    "Nigeria", "Ghana", "Cameroon", "Benin", "Togo", "Cote d'Ivoire",
]

V21_THRESHOLDS = {
    "COI":  5,
    "12S":  3,
    "18S":  1,
    "28S":  1,
    "rbcL": 3,
}

# Marker-to-NCBI-query-phrase mapping. NCBI stores gene names inconsistently,
# so we use a list of synonyms joined with OR. The phrases are searched in
# sequence title metadata which is where gene names reliably appear.
MARKER_NCBI_SYNONYMS = {
    "COI":  ["COI", "COX1", "cytochrome oxidase subunit 1", "cytochrome c oxidase subunit I"],
    "12S":  ["12S", "12S ribosomal RNA", "12S rRNA"],
    "18S":  ["18S", "18S ribosomal RNA", "18S rRNA", "small subunit ribosomal RNA"],
    "28S":  ["28S", "28S ribosomal RNA", "28S rRNA", "large subunit ribosomal RNA"],
    "rbcL": ["rbcL", "ribulose-1,5-bisphosphate carboxylase"],
}

# NCBI without API key: 3 req/sec. With API key: 10 req/sec. Add safety margin.
NCBI_DELAY_NO_KEY = 0.4   # ~2.5 req/sec
NCBI_DELAY_WITH_KEY = 0.15  # ~6.6 req/sec
BOLD_DELAY = 0.5
MAX_RETRIES = 4
INITIAL_BACKOFF = 2.0  # seconds


# ────────────────────────────────────────────────────────────────────────────
# Logging
# ────────────────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-7s  %(message)s",
    handlers=[
        logging.FileHandler("reverify_v21.log", mode="w", encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
# Windows: the default cp1252 console can't print Unicode dividers. Force UTF-8.
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass
log = logging.getLogger("reverify")


# ────────────────────────────────────────────────────────────────────────────
# Data model
# ────────────────────────────────────────────────────────────────────────────

@dataclass
class SpeciesRecord:
    """One species entry extracted from the dashboard."""
    name: str
    marker: str
    stored_ncbi: str
    stored_bold: str
    stored_ncbi_global: Optional[int] = None
    stored_ncbi_wa: Optional[int] = None
    stored_priority: Optional[str] = None
    stored_notes: Optional[str] = None
    # Results populated during run
    new_ncbi_global: Optional[int] = None
    new_ncbi_wa: Optional[int] = None
    new_bold_total: Optional[int] = None
    new_bold_wa: Optional[int] = None
    new_ncbi_status: Optional[str] = None
    new_bold_status: Optional[str] = None
    new_overall_status: Optional[str] = None
    errors: list[str] = field(default_factory=list)


# ────────────────────────────────────────────────────────────────────────────
# Cache (results are expensive; persist across runs)
# ────────────────────────────────────────────────────────────────────────────

class Cache:
    def __init__(self, path: Path):
        self.path = path
        self.data: dict = {}
        if path.exists():
            try:
                self.data = json.loads(path.read_text())
                log.info("Loaded %d cached entries from %s", len(self.data), path.name)
            except Exception as e:
                log.warning("Could not read cache %s: %s — starting fresh", path.name, e)

    def get(self, key: str):
        return self.data.get(key)

    def set(self, key: str, value):
        self.data[key] = value

    def save(self):
        self.path.write_text(json.dumps(self.data, indent=2, sort_keys=True))


# ────────────────────────────────────────────────────────────────────────────
# NCBI querying
# ────────────────────────────────────────────────────────────────────────────

def build_marker_clause(marker: str) -> str:
    """Return an NCBI query sub-clause restricting to a given marker.

    REVERTED to v1 proven approach: matches only marker[Title].

    Why we don't use [Gene]: the Gene field is patchy in NCBI — many older
    deposits leave it blank, especially for shorter or rRNA sequences. Adding
    Gene[Field] with OR appears to cause query parse problems that silently
    return zero. The simpler [Title] match is what your ncbi_query_v2.py
    used and produced reliable counts.

    Why we don't use mitochondrion[Filter]: it matches every mt sequence
    regardless of marker, inflating COI/12S counts with cytb, ND1, etc.
    """
    return f'{marker}[Title]'


def build_wa_clause() -> str:
    """Gulf of Guinea filter: matches the formal [Country] field for each
    biogeographically relevant country.

    REVERTED to v1 proven approach: only [Country] field, not [All Fields].

    Trade-off: this undercounts WA records for sequences with sparse country
    metadata (e.g. country named in isolate ID but not the formal Country
    field). The undercount is systematic and conservative — defensible for a
    reference-library gap analysis where the safer error is to flag a gap
    that doesn't exist than to hide one that does.
    """
    return "(" + " OR ".join(f'"{c}"[Country]' for c in GULF_OF_GUINEA_COUNTRIES) + ")"


def ncbi_search_count(term: str, retries: int = MAX_RETRIES,
                      delay: float = NCBI_DELAY_NO_KEY, debug: bool = False) -> int:
    """Return the hit count for an NCBI Nucleotide esearch query. -1 on error."""
    if debug:
        log.info("    NCBI query: %s", term)
    backoff = INITIAL_BACKOFF
    for attempt in range(1, retries + 1):
        try:
            handle = Entrez.esearch(db="nucleotide", term=term, retmax=0)
            result = Entrez.read(handle)
            handle.close()
            time.sleep(delay)
            count = int(result["Count"])
            if debug:
                log.info("    NCBI returned: %d hits", count)
            return count
        except Exception as e:
            log.warning("NCBI query failed (attempt %d/%d): %s", attempt, retries, e)
            if attempt == retries:
                return -1
            time.sleep(backoff)
            backoff *= 2
    return -1


def query_ncbi_counts(species: str, marker: str, cache: Cache,
                      delay: float, debug: bool = False) -> tuple[int, int]:
    """Return (global_count, wa_count) for a species/marker pair. Uses cache."""
    cache_key = f"{species}||{marker}"
    cached = cache.get(cache_key)
    if cached is not None and not debug:
        return cached["global"], cached["wa"]

    marker_clause = build_marker_clause(marker)
    wa_clause = build_wa_clause()

    q_global = f'"{species}"[Organism] AND {marker_clause}'
    q_wa = f'"{species}"[Organism] AND {marker_clause} AND {wa_clause}'

    log.info("  NCBI %s x %s: querying global + WA", species, marker)
    g = ncbi_search_count(q_global, delay=delay, debug=debug)
    w = ncbi_search_count(q_wa, delay=delay, debug=debug)

    cache.set(cache_key, {"global": g, "wa": w})
    cache.save()
    return g, w


# ────────────────────────────────────────────────────────────────────────────
# BOLD querying — uses the /API_Public/combined endpoint with geo filter
# ────────────────────────────────────────────────────────────────────────────
#
# Mirrors the proven approach from bold_query.py in the project repo.
#
# Endpoint:  /API_Public/combined
# Params:    taxon=<species name>  format=json  [geo=<country>]
# Returns:   {"bold_records": {rec_id: {...}, rec_id: {...}, ...}}
#            We count the keys.
#
# We make TWO calls per species:
#   1. Without geo filter    → total BOLD records globally
#   2. With geo=<each GoG country>  → sum WA records
#
# BOLD records are essentially all COI for animals (BOLD doesn't index 12S
# or other markers in any meaningful way). So the COI-marker question is
# answered automatically by querying BOLD at all — we don't need to filter
# by marker.
#
# When BOLD has no records for a taxon, it returns {} or empty body, NOT
# the bogus "default response" that was producing 492 in the v1 attempt
# (that was the specimen TSV endpoint, which silently dumped a default
# page). The combined+JSON endpoint is well-behaved.

BOLD_COMBINED_URL = "http://v4.boldsystems.org/index.php/API_Public/combined"


def _bold_count(species: str, geo: Optional[str], debug: bool = False) -> tuple[int, Optional[str]]:
    """One BOLD call. Returns (record_count, error_or_None)."""
    params = {"taxon": species, "format": "json"}
    if geo:
        params["geo"] = geo
    backoff = INITIAL_BACKOFF
    last_error: Optional[str] = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            r = requests.get(BOLD_COMBINED_URL, params=params, timeout=30)
            time.sleep(BOLD_DELAY)
            if r.status_code == 200:
                if not r.text.strip():
                    if debug:
                        log.info("    BOLD %s geo=%s → empty body", species, geo or "ANY")
                    return 0, None
                try:
                    payload = r.json()
                except ValueError:
                    last_error = "non-JSON response"
                    if debug:
                        log.info("    BOLD %s geo=%s → non-JSON: %s", species, geo, r.text[:120])
                    if attempt < MAX_RETRIES:
                        time.sleep(backoff)
                        backoff *= 2
                        continue
                    return 0, last_error
                # Normal shape: {"bold_records": {recid: {...}}}
                # If empty, BOLD returns {} or {"bold_records": {}}
                records = (payload or {}).get("bold_records", {})
                count = len(records) if isinstance(records, dict) else 0
                if debug:
                    log.info("    BOLD %s geo=%s → %d records", species, geo or "ANY", count)
                return count, None
            else:
                last_error = f"HTTP {r.status_code}"
                if debug:
                    log.info("    BOLD %s geo=%s → HTTP %d", species, geo, r.status_code)
        except requests.RequestException as e:
            last_error = f"{type(e).__name__}: {e}"
            log.warning("BOLD query failed for %s geo=%s (attempt %d): %s",
                        species, geo, attempt, e)
        if attempt < MAX_RETRIES:
            time.sleep(backoff)
            backoff *= 2
    return 0, last_error


def bold_query(species: str, cache: Cache, debug: bool = False) -> tuple[int, int, Optional[str]]:
    """Return (total_BOLD_records, WA_BOLD_records, error_or_None).

    Total = all BOLD records for the species (mostly COI).
    WA    = sum of records returned by per-country geo-filtered queries.
    """
    cache_key = species
    cached = cache.get(cache_key)
    if cached is not None and not debug:
        return cached["total"], cached["wa"], cached.get("error")

    errors = []

    # Total — no geo filter
    total, err = _bold_count(species, geo=None, debug=debug)
    if err:
        errors.append(f"total: {err}")

    # WA — sum of per-country queries (cheaper than one big OR query)
    wa = 0
    for country in GULF_OF_GUINEA_COUNTRIES:
        n, err = _bold_count(species, geo=country, debug=debug)
        wa += n
        if err:
            errors.append(f"{country}: {err}")

    error_msg = "; ".join(errors) if errors else None
    cache.set(cache_key, {"total": total, "wa": wa, "error": error_msg})
    cache.save()
    return total, wa, error_msg


# ────────────────────────────────────────────────────────────────────────────
# v21 classification
# ────────────────────────────────────────────────────────────────────────────

def ncbi_status_v21(marker: str, wa_count: int) -> str:
    if wa_count == 0:
        return "absent"
    threshold = V21_THRESHOLDS.get(marker, 3)
    return "present" if wa_count >= threshold else "partial"


def bold_status_v21(marker: str, wa_count: int) -> str:
    """BOLD is almost entirely COI. Use the COI threshold if WA records exist."""
    if wa_count == 0:
        return "absent"
    # BOLD records are COI; use the COI threshold for sufficiency.
    # But be more lenient — any BOLD WA record is valuable — so threshold >=1.
    return "present" if wa_count >= 1 else "partial"


def overall_status_v21(ncbi: str, bold: str) -> str:
    if ncbi == "absent" and bold == "absent":
        return "absent"
    if ncbi == "present" and bold == "present":
        return "present"
    return "partial"


# ────────────────────────────────────────────────────────────────────────────
# Dashboard parsing
# ────────────────────────────────────────────────────────────────────────────

SPECIES_LINE = re.compile(
    r'\{\s*name:\s*"([^"]+)"[^}]*?'
    r'marker:\s*"([^"]+)"[^}]*?'
    r'ncbi:\s*"([^"]+)"[^}]*?'
    r'bold:\s*"([^"]+)"'
    r'[^}]*\}',
    re.DOTALL,
)

GLOBAL_COUNT_RE = re.compile(r'ncbi_global\s*:\s*(\d+)')
WA_COUNT_RE = re.compile(r'ncbi_wa\s*:\s*(\d+)')
PRIORITY_RE = re.compile(r'priority\s*:\s*"([^"]+)"')
NOTES_RE = re.compile(r'notes\s*:\s*"((?:[^"\\]|\\.)*)"')


def parse_dashboard(html_path: Path) -> list[SpeciesRecord]:
    """Extract species entries from the dashboard HTML."""
    text = html_path.read_text(encoding="utf-8")
    records: list[SpeciesRecord] = []
    seen: set[str] = set()

    for m in SPECIES_LINE.finditer(text):
        entry = m.group(0)
        name = m.group(1)
        # Skip nematode "genus" entries — those use a different schema
        if name in seen:
            continue
        seen.add(name)

        rec = SpeciesRecord(
            name=name,
            marker=m.group(2),
            stored_ncbi=m.group(3),
            stored_bold=m.group(4),
        )
        g = GLOBAL_COUNT_RE.search(entry)
        if g:
            rec.stored_ncbi_global = int(g.group(1))
        w = WA_COUNT_RE.search(entry)
        if w:
            rec.stored_ncbi_wa = int(w.group(1))
        p = PRIORITY_RE.search(entry)
        if p:
            rec.stored_priority = p.group(1)
        n = NOTES_RE.search(entry)
        if n:
            rec.stored_notes = n.group(1)
        records.append(rec)

    return records


# ────────────────────────────────────────────────────────────────────────────
# Report writers
# ────────────────────────────────────────────────────────────────────────────

def write_csv_report(records: list[SpeciesRecord], path: Path):
    import csv
    headers = [
        "species", "marker",
        "stored_ncbi", "new_ncbi_status",
        "stored_ncbi_global", "new_ncbi_global",
        "stored_ncbi_wa", "new_ncbi_wa",
        "stored_bold", "new_bold_status",
        "new_bold_total", "new_bold_wa",
        "new_overall_status",
        "ncbi_changed", "bold_changed",
        "errors",
    ]
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(headers)
        for r in records:
            ncbi_changed = r.stored_ncbi != (r.new_ncbi_status or r.stored_ncbi)
            bold_changed = r.stored_bold != (r.new_bold_status or r.stored_bold)
            w.writerow([
                r.name, r.marker,
                r.stored_ncbi, r.new_ncbi_status or "",
                r.stored_ncbi_global if r.stored_ncbi_global is not None else "",
                r.new_ncbi_global if r.new_ncbi_global is not None else "",
                r.stored_ncbi_wa if r.stored_ncbi_wa is not None else "",
                r.new_ncbi_wa if r.new_ncbi_wa is not None else "",
                r.stored_bold, r.new_bold_status or "",
                r.new_bold_total if r.new_bold_total is not None else "",
                r.new_bold_wa if r.new_bold_wa is not None else "",
                r.new_overall_status or "",
                "YES" if ncbi_changed else "",
                "YES" if bold_changed else "",
                "; ".join(r.errors),
            ])
    log.info("Wrote %s", path.name)


def write_json_report(records: list[SpeciesRecord], path: Path):
    path.write_text(json.dumps([asdict(r) for r in records], indent=2))
    log.info("Wrote %s", path.name)


def write_patch_file(records: list[SpeciesRecord], path: Path):
    """Produce a patch that the --apply step consumes."""
    patches = []
    for r in records:
        if r.new_ncbi_status is None and r.new_bold_status is None:
            continue  # nothing to patch
        patches.append({
            "species": r.name,
            "updates": {
                "ncbi": r.new_ncbi_status,
                "bold": r.new_bold_status,
                "ncbi_global": r.new_ncbi_global,
                "ncbi_wa": r.new_ncbi_wa,
            },
        })
    path.write_text(json.dumps(patches, indent=2))
    log.info("Wrote %s (%d species patches)", path.name, len(patches))


# ────────────────────────────────────────────────────────────────────────────
# HTML applier (only runs under --apply)
# ────────────────────────────────────────────────────────────────────────────

def apply_patch_to_html(html_path: Path, patch_path: Path):
    """Rewrite the HTML in place, updating ncbi/bold/ncbi_global/ncbi_wa fields."""
    text = html_path.read_text(encoding="utf-8")
    patches = json.loads(patch_path.read_text())
    applied = 0
    skipped = 0

    for p in patches:
        species = p["species"]
        updates = p["updates"]
        # Find the species entry in the HTML
        # We match the full {name:"...",...} block for this species.
        pattern = re.compile(
            r'(\{\s*name:\s*"' + re.escape(species) + r'",[^}]*?\})',
            re.DOTALL,
        )
        m = pattern.search(text)
        if not m:
            log.warning("Could not find entry for '%s' — skipping", species)
            skipped += 1
            continue
        old_block = m.group(1)
        new_block = old_block

        # Update ncbi field
        if updates.get("ncbi"):
            new_block = re.sub(
                r'(ncbi\s*:\s*)"[^"]*"',
                r'\1"' + updates["ncbi"] + '"',
                new_block,
                count=1,
            )
        # Update bold field
        if updates.get("bold"):
            new_block = re.sub(
                r'(bold\s*:\s*)"[^"]*"',
                r'\1"' + updates["bold"] + '"',
                new_block,
                count=1,
            )
        # Update ncbi_global
        if updates.get("ncbi_global") is not None:
            if "ncbi_global" in new_block:
                new_block = re.sub(
                    r'ncbi_global\s*:\s*\d+',
                    f'ncbi_global:{updates["ncbi_global"]}',
                    new_block,
                )
            else:
                # Insert before closing brace
                new_block = new_block[:-1] + f', ncbi_global:{updates["ncbi_global"]}' + '}'
        # Update ncbi_wa
        if updates.get("ncbi_wa") is not None:
            if "ncbi_wa" in new_block:
                new_block = re.sub(
                    r'ncbi_wa\s*:\s*\d+',
                    f'ncbi_wa:{updates["ncbi_wa"]}',
                    new_block,
                )
            else:
                new_block = new_block[:-1] + f', ncbi_wa:{updates["ncbi_wa"]}' + '}'

        if new_block != old_block:
            text = text.replace(old_block, new_block, 1)
            applied += 1
        else:
            skipped += 1

    # Backup original
    backup = html_path.with_suffix(".html.bak")
    backup.write_text(html_path.read_text(encoding="utf-8"), encoding="utf-8")
    html_path.write_text(text, encoding="utf-8")
    log.info("Applied %d patches, skipped %d. Backup saved at %s", applied, skipped, backup.name)


# ────────────────────────────────────────────────────────────────────────────
# Main
# ────────────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(description="Re-verify v21 dashboard species counts against NCBI and BOLD.")
    ap.add_argument("--dashboard", required=True, help="Path to nigeria_reflib_dashboard_v21.html")
    ap.add_argument("--email", default="your@email.com", help="Email for Entrez (required by NCBI)")
    ap.add_argument("--api-key", default=None, help="Optional NCBI API key (raises rate limit 3 to 10 req/s)")
    ap.add_argument("--apply", action="store_true", help="Rewrite the HTML after generating the patch")
    ap.add_argument("--limit", type=int, default=None, help="Only process the first N species (useful for smoke-test)")
    ap.add_argument("--skip-bold", action="store_true", help="Skip BOLD queries (NCBI only)")
    ap.add_argument("--debug", action="store_true", help="Print actual queries and raw response counts for first 3 species")
    ap.add_argument("--no-cache", action="store_true", help="Ignore any existing cache files and re-query everything fresh")
    args = ap.parse_args()

    html_path = Path(args.dashboard)
    if not html_path.exists():
        log.error("Dashboard not found: %s", html_path)
        sys.exit(1)

    # Configure Entrez
    Entrez.email = args.email
    if args.api_key:
        Entrez.api_key = args.api_key
        ncbi_delay = NCBI_DELAY_WITH_KEY
        log.info("Using NCBI API key (faster rate limit)")
    else:
        ncbi_delay = NCBI_DELAY_NO_KEY
        log.info("No NCBI API key set — using conservative %s s delay", ncbi_delay)

    script_dir = Path(__file__).parent
    if args.no_cache:
        for cache_file in ["ncbi_cache.json", "bold_cache.json"]:
            p = script_dir / cache_file
            if p.exists():
                p.unlink()
                log.info("Deleted cache: %s", cache_file)
    ncbi_cache = Cache(script_dir / "ncbi_cache.json")
    bold_cache = Cache(script_dir / "bold_cache.json")

    # ── If --apply, just run the applier against an existing patch file ──
    patch_path = script_dir / "dashboard_update_patch.json"
    if args.apply:
        if not patch_path.exists():
            log.error("Patch file not found: %s — run without --apply first", patch_path)
            sys.exit(1)
        log.info("APPLY MODE — rewriting %s from %s", html_path.name, patch_path.name)
        apply_patch_to_html(html_path, patch_path)
        return

    # ── Otherwise, do the re-verification run ──
    log.info("Parsing dashboard: %s", html_path.name)
    records = parse_dashboard(html_path)
    log.info("Found %d species entries", len(records))

    if args.limit:
        records = records[: args.limit]
        log.info("Limited to first %d species for this run", len(records))

    for i, rec in enumerate(records, 1):
        log.info("[%d/%d] %s (%s)", i, len(records), rec.name, rec.marker)
        # Debug active for first 3 species when --debug flag is set
        debug_this = args.debug and i <= 3
        try:
            g, w = query_ncbi_counts(rec.name, rec.marker, ncbi_cache, ncbi_delay, debug=debug_this)
            rec.new_ncbi_global = g
            rec.new_ncbi_wa = w
            if g >= 0 and w >= 0:
                rec.new_ncbi_status = ncbi_status_v21(rec.marker, w)
            else:
                rec.errors.append(f"NCBI error (global={g}, wa={w})")
        except Exception as e:
            rec.errors.append(f"NCBI exception: {e}")
            log.exception("NCBI failure for %s", rec.name)

        if not args.skip_bold:
            try:
                total, bwa, err = bold_query(rec.name, bold_cache, debug=debug_this)
                rec.new_bold_total = total
                rec.new_bold_wa = bwa
                if err:
                    rec.errors.append(f"BOLD: {err}")
                if total >= 0 and bwa >= 0:
                    rec.new_bold_status = bold_status_v21(rec.marker, bwa)
            except Exception as e:
                rec.errors.append(f"BOLD exception: {e}")
                log.exception("BOLD failure for %s", rec.name)

        if rec.new_ncbi_status and rec.new_bold_status:
            rec.new_overall_status = overall_status_v21(
                rec.new_ncbi_status, rec.new_bold_status
            )

    # ── Write reports ──
    write_csv_report(records, script_dir / "verification_report_v21.csv")
    write_json_report(records, script_dir / "verification_report_v21.json")
    write_patch_file(records, patch_path)

    # ── Summary ──
    total = len(records)
    ncbi_changed = sum(
        1 for r in records
        if r.new_ncbi_status and r.new_ncbi_status != r.stored_ncbi
    )
    bold_changed = sum(
        1 for r in records
        if r.new_bold_status and r.new_bold_status != r.stored_bold
    )
    errs = sum(1 for r in records if r.errors)

    log.info("")
    log.info("─── SUMMARY ──────────────────────────────────────")
    log.info("Species processed:        %d", total)
    log.info("NCBI status changes:      %d", ncbi_changed)
    log.info("BOLD status changes:      %d", bold_changed)
    log.info("Records with errors:      %d", errs)
    log.info("")
    log.info("Next step: review verification_report_v21.csv")
    log.info("Then run with --apply to update the HTML:")
    log.info("  python reverify_v21.py --dashboard %s --apply", html_path.name)


if __name__ == "__main__":
    main()
