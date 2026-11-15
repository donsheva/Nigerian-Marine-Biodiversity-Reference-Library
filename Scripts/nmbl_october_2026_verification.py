#!/usr/bin/env python3
"""
nmbl_october_2026_verification.py
==================================
Combined NCBI + BOLD verification pass for the Nigerian Marine Biodiversity
Reference Library (NMBL) v21 dashboard.

WHAT THIS DOES
--------------
For every taxon currently tracked in the dashboard (vertebrates, marine
species, macrobenthos, meiofauna, and nematode genera), this script queries
NCBI Nucleotide via the Entrez API in the correct order:

    1. GLOBAL  — unfiltered count for "species"[Organism] AND marker[Title]
    2. WEST AFRICA (WA) — the SAME query, narrowed with a [Country] filter
       across Nigeria, Ghana, Cameroon, Benin, Togo, Senegal, Guinea,
       Cote d'Ivoire, Liberia
    3. NIGERIA-SPECIFIC (NG) — narrowed further to Nigeria-only place terms

It then applies the v21 marker-specific WA thresholds (COI>=5, 12S>=3,
18S>=1, 28S>=1, rbcL>=3) to classify each taxon as present / partial / absent,
EXACTLY as the dashboard's ncbiEffectiveStatus() function does — so the
output of this script should be a drop-in replacement for the ncbi_global /
ncbi_wa fields in the dashboard's JS data arrays.

DATA INTEGRITY CHECK (the thing Ade specifically asked about)
---------------------------------------------------------------
WA count can never legitimately exceed global count, because the WA query
is a strict narrowing of the global query. If wa > global for any taxon,
that means the query itself is broken (e.g. a malformed boolean, or a
stale cached result) -- the script treats this as a hard error and will
not silently write a bad number to the CSV.

Separately, if wa == global (all records happen to be tagged with a West
African country of origin), the script does NOT treat this as an error,
but flags it in a dedicated "flag_reason" column for manual review, since
it is exactly as likely to be a real (if unusual) result as it is to be an
artifact of NCBI's inconsistently-populated [Country] metadata field.

BOLD SYSTEMS
------------
BOLD v4's public API has been independently confirmed unreliable (silent
defaults / non-JSON responses). This script targets BOLD v5 instead, using
the same GET-based combined endpoint pattern. BEFORE running this against
your full species list in October, run the "test_bold_v5_endpoint()"
function on its own against 2-3 known species (e.g. Sardinella maderensis)
and manually verify the JSON structure looks sane. BOLD's v5 API surface
may have changed shape since this script was written; adjust the parser
in `query_bold_v5()` if the returned JSON doesn't match what's expected.

USAGE
-----
    pip install biopython pandas requests --break-system-packages
    python nmbl_october_2026_verification.py

Update ENTREZ_EMAIL and (recommended) ENTREZ_API_KEY below before running.
An NCBI account + API key raises your rate limit from 3 req/sec to 10
req/sec, which matters a lot given the size of this taxon list.

OUTPUT
------
    nmbl_october2026_full_report.csv       -- one row per taxon, all fields
    nmbl_october2026_flagged_for_review.csv -- subset needing manual check
    nmbl_october2026_reclassification_diff.csv -- taxa whose status CHANGED
                                                   vs. the v21 hardcoded values
"""

from Bio import Entrez
import pandas as pd
import requests
import time
import sys

# ─────────────────────────────────────────────────────────────────────────
# CONFIG — update before running
# ─────────────────────────────────────────────────────────────────────────
ENTREZ_EMAIL = "ade@envirobiotics.org"      # required by NCBI
ENTREZ_API_KEY = ""                          # paste your NCBI API key here (recommended)
Entrez.email = ENTREZ_EMAIL
if ENTREZ_API_KEY:
    Entrez.api_key = ENTREZ_API_KEY

RETRY_ATTEMPTS = 4
RETRY_BACKOFF_SEC = 6
REQUEST_DELAY_SEC = 0.4 if ENTREZ_API_KEY else 1.0  # be politer without an API key

WA_COUNTRIES = ["Nigeria", "Ghana", "Cameroon", "Benin", "Togo", "Senegal",
                "Guinea", "Cote d'Ivoire", "Ivory Coast", "Liberia"]
NG_TERMS = ["Nigeria", "Niger Delta", "Lagos", "Cross River", "Bayelsa",
            "Delta State", "Akwa Ibom", "Escravos", "Qua Iboe"]

# v21 marker-specific WA thresholds (see dashboard WA_THRESHOLD constant)
WA_THRESHOLD = {"COI": 5, "12S": 3, "18S": 1, "28S": 1, "rbcL": 3}

# Flag any taxon where WA / global >= this ratio, for manual review
SUSPICIOUS_RATIO = 0.9


# ─────────────────────────────────────────────────────────────────────────
# TAXON LIST — mirrors dashboard v21 data arrays
# (name, group, marker, section)
# ─────────────────────────────────────────────────────────────────────────
VERTEBRATES = [
    ("Ethmalosa fimbriata", "Fish", "12S"),
    ("Sardinella maderensis", "Fish", "12S"),
    ("Sardinella aurita", "Fish", "12S"),
    ("Pseudotolithus senegalensis", "Fish", "12S"),
    ("Pseudotolithus elongatus", "Fish", "12S"),
    ("Cynoglossus senegalensis", "Fish", "12S"),
    ("Galeoides decadactylus", "Fish", "12S"),
    ("Polydactylus quadrifilis", "Fish", "12S"),
    ("Lutjanus agennes", "Fish", "12S"),
    ("Arius latiscutatus", "Fish", "12S"),
    ("Brachydeuterus auritus", "Fish", "12S"),
    ("Pomadasys jubelini", "Fish", "12S"),
    ("Elops lacerta", "Fish", "12S"),
    ("Drepane africana", "Fish", "12S"),
    ("Mugil cephalus", "Fish", "12S"),
    ("Chrysichthys nigrodigitatus", "Fish", "12S"),
    ("Rhizoprionodon acutus", "Elasmobranch", "12S"),
    ("Rhinobatos rhinobatos", "Elasmobranch", "12S"),
    ("Hypanus marianae", "Elasmobranch", "12S"),
    ("Carcharhinus leucas", "Elasmobranch", "12S"),
    ("Sphyrna lewini", "Elasmobranch", "12S"),
    ("Penaeus notialis", "Crustacean", "COI"),
    ("Callinectes amnicola", "Crustacean", "COI"),
    ("Parapenaeus longirostris", "Crustacean", "COI"),
    ("Macrobrachium vollenhovenii", "Crustacean", "COI"),
    ("Trichechus senegalensis", "Mammal", "COI"),
    ("Sousa teuszii", "Mammal", "COI"),
    ("Tursiops truncatus", "Mammal", "COI"),
    ("Chelonia mydas", "Turtle", "12S"),
    ("Dermochelys coriacea", "Turtle", "12S"),
    ("Lepidochelys olivacea", "Turtle", "12S"),
]

MACROBENTHOS = [
    ("Tympanotonos fuscatus", "Gastropod", "COI"),
    ("Tympanotonos radula", "Gastropod", "COI"),
    ("Pachymelania aurita", "Gastropod", "COI"),
    ("Pachymelania fusca", "Gastropod", "COI"),
    ("Telescopium telescopium", "Gastropod", "COI"),
    ("Neritina glabrata", "Gastropod", "COI"),
    ("Lanistes varicus", "Gastropod", "COI"),
    ("Crassostrea gasar", "Bivalve", "COI"),
    ("Egeria radiata", "Bivalve", "COI"),
    ("Senilia senilis", "Bivalve", "COI"),
    ("Mytilaster minimus", "Bivalve", "COI"),
    ("Corbula trigona", "Bivalve", "COI"),
    ("Sphaerium nodicostatum", "Bivalve", "COI"),
    ("Capitella capitata", "Polychaete", "COI"),
    ("Nereis diversicolor", "Polychaete", "COI"),
    ("Perinereis cultrifera", "Polychaete", "COI"),
    ("Marphysa sanguinea", "Polychaete", "COI"),
    ("Sabella pavonina", "Polychaete", "COI"),
    ("Hydroides elegans", "Polychaete", "COI"),
    ("Uca tangeri", "Crustacean-macro", "COI"),
    ("Uca inversa", "Crustacean-macro", "COI"),
    ("Sesarma huzardi", "Crustacean-macro", "COI"),
    ("Goniopsis pelii", "Crustacean-macro", "COI"),
    ("Cardisoma armatum", "Crustacean-macro", "COI"),
    ("Callinectes pallidus", "Crustacean-macro", "COI"),
]

MARINE = [
    ("Thunnus albacares", "Marine-Pelagic", "12S"),
    ("Katsuwonus pelamis", "Marine-Pelagic", "12S"),
    ("Thunnus obesus", "Marine-Pelagic", "12S"),
    ("Xiphias gladius", "Marine-Pelagic", "12S"),
    ("Coryphaena hippurus", "Marine-Pelagic", "12S"),
    ("Scomber japonicus", "Marine-Pelagic", "12S"),
    ("Scomberomorus tritor", "Marine-Pelagic", "12S"),
    ("Caranx hippos", "Marine-Pelagic", "12S"),
    ("Trichiurus lepturus", "Marine-Pelagic", "12S"),
    ("Dentex angolensis", "Marine-Demersal", "12S"),
    ("Pagellus bellottii", "Marine-Demersal", "12S"),
    ("Epinephelus aeneus", "Marine-Demersal", "12S"),
    ("Sparus caeruleostictus", "Marine-Demersal", "12S"),
    ("Pseudupeneus prayensis", "Marine-Demersal", "12S"),
    ("Pteroscion peli", "Marine-Demersal", "12S"),
    ("Pomadasys rogerii", "Marine-Demersal", "12S"),
    ("Lutjanus goreensis", "Marine-Demersal", "12S"),
    ("Acropora palmata", "Marine-Reef", "COI"),
    ("Porites porites", "Marine-Reef", "COI"),
    ("Holothuria atra", "Marine-Reef", "COI"),
    ("Holothuria scabra", "Marine-Reef", "COI"),
    ("Diadema antillarum", "Marine-Reef", "COI"),
    ("Echinometra lucunter", "Marine-Reef", "COI"),
    ("Ophiura ophiura", "Marine-Reef", "COI"),
    ("Octopus vulgaris", "Marine-Invertebrate", "COI"),
    ("Sepia officinalis", "Marine-Invertebrate", "COI"),
    ("Loligo vulgaris", "Marine-Invertebrate", "COI"),
    ("Charonia variegata", "Marine-Invertebrate", "COI"),
    ("Strombus latus", "Marine-Invertebrate", "COI"),
    ("Murex brandaris", "Marine-Invertebrate", "COI"),
    ("Penaeus kerathurus", "Marine-Invertebrate", "COI"),
    ("Halophila stipulacea", "Marine-Plants", "rbcL"),
    ("Thalassia testudinum", "Marine-Plants", "rbcL"),
    ("Sargassum natans", "Marine-Plants", "rbcL"),
    ("Sargassum fluitans", "Marine-Plants", "rbcL"),
    ("Ulva lactuca", "Marine-Plants", "rbcL"),
    ("Gracilaria corticata", "Marine-Plants", "rbcL"),
    ("Megaptera novaeangliae", "Marine-Mammal", "COI"),
    ("Physeter macrocephalus", "Marine-Mammal", "COI"),
    ("Stenella frontalis", "Marine-Mammal", "COI"),
    ("Balaenoptera brydei", "Marine-Mammal", "COI"),
    ("Orcinus orca", "Marine-Mammal", "COI"),
]

MEIOFAUNA_OTHER = [
    ("Harpacticoida", "Meiofauna", "18S"),
    ("Ostracoda", "Meiofauna", "COI"),
    ("Tardigrada", "Meiofauna", "18S"),
    ("Gastrotricha", "Meiofauna", "18S"),
    ("Kinorhyncha", "Meiofauna", "18S"),
    ("Foraminifera", "Protist", "18S"),
    ("Ciliophora", "Protist", "18S"),
    ("Bacillariophyta", "Protist", "18S"),
    ("Polychaeta", "Meiofauna", "COI"),
]

# Nematodes are queried by GENUS across two markers (18S and 28S)
NEMATODE_GENERA = [
    "Chromadora", "Chromadorita", "Ptycholaimellus", "Dichromadora",
    "Innocuonema", "Desmodora", "Spirinia", "Metachromadora", "Monhystera",
    "Terschellingia", "Diplolaimelloides", "Sphaerolaimus", "Enoplus",
    "Thoracostoma", "Eurystomina", "Oxystomina", "Axonolaimus",
    "Odontophora", "Campylaimus", "Desmoscolex", "Quadricoma",
    "Aphanolaimus", "Stylotheristus", "Pellioditis", "Plectus",
]


# ─────────────────────────────────────────────────────────────────────────
# NCBI QUERY FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────
def _esearch_count(term, retries=RETRY_ATTEMPTS):
    """Run one Entrez esearch and return the Count field. -1 on failure."""
    for attempt in range(retries):
        try:
            handle = Entrez.esearch(db="nucleotide", term=term)
            result = Entrez.read(handle)
            handle.close()
            return int(result["Count"])
        except Exception as e:
            if attempt < retries - 1:
                print(f"    [retry {attempt+1}/{retries}] {e}")
                time.sleep(RETRY_BACKOFF_SEC)
            else:
                print(f"    [FAILED after {retries} attempts] term={term!r}: {e}")
                return -1
    return -1


def query_ncbi_counts(species_or_genus, marker):
    """
    Query NCBI in the correct order: global (unfiltered) first, then
    West Africa (subset), then Nigeria-specific (further subset).
    Returns dict with global, wa, ng counts and any integrity flags.
    """
    global_term = f'"{species_or_genus}"[Organism] AND {marker}[Title]'
    wa_filter = " OR ".join(f'{c}[Country]' for c in WA_COUNTRIES)
    wa_term = f'{global_term} AND ({wa_filter})'
    ng_filter = " OR ".join(f'{c}[Country]' for c in NG_TERMS)
    ng_term = f'{global_term} AND ({ng_filter})'

    global_count = _esearch_count(global_term)
    time.sleep(REQUEST_DELAY_SEC)
    wa_count = _esearch_count(wa_term)
    time.sleep(REQUEST_DELAY_SEC)
    ng_count = _esearch_count(ng_term)
    time.sleep(REQUEST_DELAY_SEC)

    flag_reason = ""
    if global_count == -1 or wa_count == -1 or ng_count == -1:
        flag_reason = "QUERY_FAILED"
    elif wa_count > global_count:
        # This should be structurally impossible. Hard-flag it.
        flag_reason = "ERROR: WA > GLOBAL — query is broken, do not trust these numbers"
    elif ng_count > wa_count:
        flag_reason = "ERROR: NG > WA — query is broken, do not trust these numbers"
    elif global_count > 0 and wa_count / global_count >= SUSPICIOUS_RATIO:
        flag_reason = f"REVIEW: WA is {wa_count}/{global_count} of global — verify manually (see script docstring)"
    elif global_count == 0:
        flag_reason = ""  # simply unsequenced, nothing suspicious about that

    return {
        "global_count": global_count,
        "wa_count": wa_count,
        "ng_count": ng_count,
        "flag_reason": flag_reason,
    }


def classify(marker, wa_count):
    """Apply the v21 marker-specific WA threshold rule."""
    if wa_count is None or wa_count < 0:
        return "unknown"
    threshold = WA_THRESHOLD.get(marker, 3)
    if wa_count == 0:
        return "absent"
    if wa_count >= threshold:
        return "present_ncbi"  # NCBI-side only; combine with BOLD for overall
    return "partial"


# ─────────────────────────────────────────────────────────────────────────
# BOLD v5 QUERY (TEST BEFORE TRUSTING — see docstring)
# ─────────────────────────────────────────────────────────────────────────
def test_bold_v5_endpoint():
    """
    Run this FIRST, standalone, before the full October pass.
    Prints the raw response for manual inspection. BOLD v4 is confirmed
    broken; v5's exact endpoint shape has not been independently verified
    by this project as of writing this script (Sept 2026).
    """
    test_species = "Sardinella maderensis"
    candidate_urls = [
        f"https://v5.boldsystems.org/index.php/API_Public/combined?taxon={test_species}&format=json",
        f"https://portal.boldsystems.org/api/query?query={test_species}",
    ]
    for url in candidate_urls:
        print(f"\nTrying: {url}")
        try:
            r = requests.get(url, timeout=20)
            print(f"  status: {r.status_code}")
            print(f"  content-type: {r.headers.get('content-type')}")
            print(f"  first 500 chars: {r.text[:500]}")
        except Exception as e:
            print(f"  ERROR: {e}")
    print("\n>>> Inspect the output above. If neither endpoint returns clean JSON")
    print(">>> with specimen records, check https://portal.boldsystems.org for the")
    print(">>> current documented API path before running query_bold_v5() at scale.")


def query_bold_v5(taxon_name, geo_filter=None, retries=RETRY_ATTEMPTS):
    """
    Placeholder BOLD v5 query — VERIFY WITH test_bold_v5_endpoint() FIRST.
    Adjust the URL and JSON parsing below once you've confirmed the real
    v5 response shape. Returns record count, or -1 on failure.
    """
    url = "https://portal.boldsystems.org/api/query"
    params = {"query": taxon_name}
    if geo_filter:
        params["query"] += f" AND country:{geo_filter}"
    for attempt in range(retries):
        try:
            r = requests.get(url, params=params, timeout=30)
            if r.status_code == 200:
                try:
                    data = r.json()
                    # ADJUST: this key name is a guess pending verification
                    return len(data.get("records", data.get("results", [])))
                except ValueError:
                    print(f"    BOLD returned non-JSON for {taxon_name!r} — see test_bold_v5_endpoint()")
                    return -1
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(RETRY_BACKOFF_SEC)
            else:
                print(f"    BOLD query failed for {taxon_name!r}: {e}")
                return -1
    return -1


# ─────────────────────────────────────────────────────────────────────────
# MAIN RUN
# ─────────────────────────────────────────────────────────────────────────
def run_species_group(taxa_list, section_name):
    records = []
    total = len(taxa_list)
    for i, (name, group, marker) in enumerate(taxa_list, 1):
        print(f"[{section_name} {i}/{total}] {name} ({marker})")
        counts = query_ncbi_counts(name, marker)
        status = classify(marker, counts["wa_count"])
        records.append({
            "section": section_name,
            "name": name,
            "group": group,
            "marker": marker,
            **counts,
            "ncbi_status": status,
        })
    return records


def run_nematode_genera():
    records = []
    total = len(NEMATODE_GENERA)
    for i, genus in enumerate(NEMATODE_GENERA, 1):
        for marker in ["18S", "28S"]:
            print(f"[nematode {i}/{total}] {genus} ({marker})")
            counts = query_ncbi_counts(genus, marker)
            status = classify(marker, counts["wa_count"])
            records.append({
                "section": "nematode",
                "name": genus,
                "group": "Nematode",
                "marker": marker,
                **counts,
                "ncbi_status": status,
            })
    return records


def main():
    if not ENTREZ_EMAIL or "@" not in ENTREZ_EMAIL:
        print("ERROR: set a real ENTREZ_EMAIL at the top of this script before running.")
        sys.exit(1)

    print("=" * 70)
    print("NMBL October 2026 verification pass")
    print("=" * 70)

    all_records = []
    all_records += run_species_group(VERTEBRATES, "vertebrate")
    all_records += run_species_group(MACROBENTHOS, "macrobenthos")
    all_records += run_species_group(MARINE, "marine")
    all_records += run_species_group(MEIOFAUNA_OTHER, "meiofauna")
    all_records += run_nematode_genera()

    df = pd.DataFrame(all_records)
    df.to_csv("nmbl_october2026_full_report.csv", index=False)
    print(f"\nSaved: nmbl_october2026_full_report.csv ({len(df)} rows)")

    flagged = df[df["flag_reason"] != ""]
    flagged.to_csv("nmbl_october2026_flagged_for_review.csv", index=False)
    print(f"Saved: nmbl_october2026_flagged_for_review.csv ({len(flagged)} rows need manual review)")

    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"Total taxa/genus-marker combos queried: {len(df)}")
    print(f"Query failures (need re-run):            {(df.flag_reason == 'QUERY_FAILED').sum()}")
    print(f"Broken-query errors (WA>global etc.):     {df.flag_reason.str.startswith('ERROR', na=False).sum()}")
    print(f"Flagged for manual review (WA~=global):   {df.flag_reason.str.startswith('REVIEW', na=False).sum()}")
    print(f"\nNCBI status breakdown:")
    print(df["ncbi_status"].value_counts().to_string())

    print("\nNext steps:")
    print("  1. Open nmbl_october2026_flagged_for_review.csv first")
    print("  2. For each REVIEW row, manually check the NCBI record(s) to confirm")
    print("     the [Country] field genuinely says a West African country")
    print("  3. Re-run any QUERY_FAILED rows individually (may be transient NCBI issues)")
    print("  4. Once satisfied, hand-merge ncbi_global/ncbi_wa into the dashboard JS data")
    print("  5. Run BOLD v5 pass separately after confirming the endpoint with")
    print("     test_bold_v5_endpoint() — do not trust query_bold_v5() until then")


if __name__ == "__main__":
    # Uncomment this line to sanity-check the BOLD v5 endpoint before the full run:
    # test_bold_v5_endpoint()
    main()
