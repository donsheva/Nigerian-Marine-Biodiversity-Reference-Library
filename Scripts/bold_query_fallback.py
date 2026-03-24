# ─────────────────────────────────────────────────────────────────────────────
# Nigeria Marine Biodiversity Library — BOLD Multi-Fallback Query Script
#
# Tries four BOLD endpoints in order until one works:
#
#   STRATEGY 1 — BOLD v5 portal  (portal.boldsystems.org)
#   STRATEGY 2 — BOLD v5 data    (data.boldsystems.org)
#   STRATEGY 3 — BOLD v4 combined API (boldsystems.org/index.php/API_Public/combined)
#   STRATEGY 4 — BOLD v4 specimen API (boldsystems.org/index.php/API_Public/specimen)
#
# Progress is saved to bold_fallback_progress.json after every species.
# Re-run the script at any time to resume from where it stopped.
#
# OUTPUT: bold_fallback_results.csv
#         columns: species, group, marker, bold_global, bold_wa, bold_status, method_used
#
# RUN:    pip install requests pandas
#         python bold_query_fallback.py
# ─────────────────────────────────────────────────────────────────────────────

import requests
import pandas as pd
import time
import json
import os
import sys
from urllib.parse import quote

# ── Session setup ──────────────────────────────────────────────────────────
SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": (
        "Mozilla/5.0 (compatible; NMBL-GapAnalysis/1.0; "
        "+https://envirobiotics.org; odedereao@niomr.gov.ng)"
    ),
    "Accept": "application/json",
})
TIMEOUT = 30  # seconds per request

WA_COUNTRIES = [
    "Nigeria", "Ghana", "Cameroon", "Benin",
    "Togo", "Senegal", "Guinea",
]

PROGRESS_FILE = "bold_fallback_progress.json"
OUTPUT_FILE   = "bold_fallback_results.csv"

# ── All species ────────────────────────────────────────────────────────────
TAXA = [
    # Coastal / estuarine fish
    ("Ethmalosa fimbriata",          "Fish",          "12S"),
    ("Sardinella maderensis",        "Fish",          "12S"),
    ("Sardinella aurita",            "Fish",          "12S"),
    ("Pseudotolithus senegalensis",  "Fish",          "12S"),
    ("Pseudotolithus elongatus",     "Fish",          "12S"),
    ("Cynoglossus senegalensis",     "Fish",          "12S"),
    ("Galeoides decadactylus",       "Fish",          "12S"),
    ("Polydactylus quadrifilis",     "Fish",          "12S"),
    ("Lutjanus agennes",             "Fish",          "12S"),
    ("Arius latiscutatus",           "Fish",          "12S"),
    ("Brachydeuterus auritus",       "Fish",          "12S"),
    ("Pomadasys jubelini",           "Fish",          "12S"),
    ("Elops lacerta",                "Fish",          "12S"),
    ("Drepane africana",             "Fish",          "12S"),
    ("Mugil cephalus",               "Fish",          "12S"),
    ("Chrysichthys nigrodigitatus",  "Fish",          "12S"),
    # Elasmobranchs
    ("Rhizoprionodon acutus",        "Elasmobranch",  "12S"),
    ("Rhinobatos rhinobatos",        "Elasmobranch",  "12S"),
    ("Hypanus marianae",             "Elasmobranch",  "12S"),
    ("Carcharhinus leucas",          "Elasmobranch",  "12S"),
    ("Sphyrna lewini",               "Elasmobranch",  "12S"),
    # Crustaceans
    ("Penaeus notialis",             "Crustacean",    "COI"),
    ("Callinectes amnicola",         "Crustacean",    "COI"),
    ("Parapenaeus longirostris",     "Crustacean",    "COI"),
    ("Macrobrachium vollenhovenii",  "Crustacean",    "COI"),
    # Mammals
    ("Trichechus senegalensis",      "Mammal",        "COI"),
    ("Sousa teuszii",                "Mammal",        "COI"),
    ("Tursiops truncatus",           "Mammal",        "COI"),
    # Turtles
    ("Chelonia mydas",               "Turtle",        "12S"),
    ("Dermochelys coriacea",         "Turtle",        "12S"),
    ("Lepidochelys olivacea",        "Turtle",        "12S"),
    # Marine pelagic fish
    ("Thunnus albacares",            "Marine-Pelagic","12S"),
    ("Katsuwonus pelamis",           "Marine-Pelagic","12S"),
    ("Thunnus obesus",               "Marine-Pelagic","12S"),
    ("Xiphias gladius",              "Marine-Pelagic","12S"),
    ("Coryphaena hippurus",          "Marine-Pelagic","12S"),
    ("Scomber japonicus",            "Marine-Pelagic","12S"),
    ("Scomberomorus tritor",         "Marine-Pelagic","12S"),
    ("Caranx hippos",                "Marine-Pelagic","12S"),
    ("Trichiurus lepturus",          "Marine-Pelagic","12S"),
    # Marine demersal fish
    ("Dentex angolensis",            "Marine-Demersal","12S"),
    ("Pagellus bellottii",           "Marine-Demersal","12S"),
    ("Epinephelus aeneus",           "Marine-Demersal","12S"),
    ("Sparus caeruleostictus",       "Marine-Demersal","12S"),
    ("Pseudupeneus prayensis",       "Marine-Demersal","12S"),
    ("Pteroscion peli",              "Marine-Demersal","12S"),
    ("Lutjanus goreensis",           "Marine-Demersal","12S"),
    # Marine invertebrates
    ("Octopus vulgaris",             "Marine-Invertebrate","COI"),
    ("Sepia officinalis",            "Marine-Invertebrate","COI"),
    ("Strombus latus",               "Marine-Invertebrate","COI"),
    # Macrobenthos
    ("Tympanotonos fuscatus",        "Gastropod",     "COI"),
    ("Pachymelania aurita",          "Gastropod",     "COI"),
    ("Crassostrea gasar",            "Bivalve",       "COI"),
    ("Egeria radiata",               "Bivalve",       "COI"),
    ("Capitella capitata",           "Polychaete",    "COI"),
    ("Nereis diversicolor",          "Polychaete",    "COI"),
    ("Uca tangeri",                  "Crustacean-macro","COI"),
    ("Sesarma huzardi",              "Crustacean-macro","COI"),
    ("Cardisoma armatum",            "Crustacean-macro","COI"),
    # Offshore mammals
    ("Megaptera novaeangliae",       "Marine-Mammal", "COI"),
    ("Physeter macrocephalus",       "Marine-Mammal", "COI"),
    ("Balaenoptera brydei",          "Marine-Mammal", "COI"),
]

# ══════════════════════════════════════════════════════════════════════════════
# STRATEGY 1 — BOLD v5 portal
# ══════════════════════════════════════════════════════════════════════════════

def bold_v5_count(species, geo=None, host="https://portal.boldsystems.org"):
    """Returns int count or None on failure."""
    query = f"tax:{species}"
    if geo:
        query += f";geo:{geo}"
    try:
        # Step 1: preprocessor
        r = SESSION.get(
            f"{host}/api/query/preprocessor",
            params={"query": query},
            timeout=TIMEOUT,
        )
        if r.status_code != 200:
            return None
        triplets = r.json().get("formalTriplets") or r.json().get("triplets")
        if not triplets:
            return None
        formal_q = triplets if isinstance(triplets, str) else ";".join(triplets)

        # Step 2: summary
        r2 = SESSION.get(
            f"{host}/api/summary",
            params={"query": formal_q, "fields": "specimens"},
            timeout=TIMEOUT,
        )
        if r2.status_code != 200:
            return None
        data = r2.json()
        for key in ("specimens", "total", "count", "records"):
            if key in data:
                return int(data[key])
        # Some responses wrap in a list
        if isinstance(data, list) and data:
            for key in ("specimens", "total", "count"):
                if key in data[0]:
                    return int(data[0][key])
        return None
    except Exception:
        return None


def strategy_v5(species, geo=None):
    for host in ["https://portal.boldsystems.org", "https://data.boldsystems.org"]:
        result = bold_v5_count(species, geo, host)
        if result is not None:
            return result, f"v5:{host.split('//')[1]}"
    return None, None


# ══════════════════════════════════════════════════════════════════════════════
# STRATEGY 2 — BOLD v4 combined JSON API
# ══════════════════════════════════════════════════════════════════════════════

V4_BASE = "http://www.boldsystems.org/index.php/API_Public"

def bold_v4_combined_count(species, geo=None):
    """Returns int count or None."""
    params = {"taxon": species, "format": "json"}
    if geo:
        params["geo"] = geo
    try:
        r = SESSION.get(f"{V4_BASE}/combined", params=params, timeout=TIMEOUT)
        if r.status_code != 200 or not r.text.strip():
            return None
        data = r.json()
        recs = data.get("bold_records", {})
        return len(recs)
    except Exception:
        return None


# ══════════════════════════════════════════════════════════════════════════════
# STRATEGY 3 — BOLD v4 specimen API (returns TSV, count lines)
# ══════════════════════════════════════════════════════════════════════════════

def bold_v4_specimen_count(species, geo=None):
    """Returns int count or None."""
    params = {"taxon": species, "format": "tsv"}
    if geo:
        params["geo"] = geo
    try:
        r = SESSION.get(f"{V4_BASE}/specimen", params=params, timeout=TIMEOUT)
        if r.status_code != 200 or not r.text.strip():
            return None
        lines = r.text.strip().split("\n")
        return max(0, len(lines) - 1)   # subtract header row
    except Exception:
        return None


# ══════════════════════════════════════════════════════════════════════════════
# UNIFIED QUERY — tries all strategies
# ══════════════════════════════════════════════════════════════════════════════

def query_bold(species, geo=None):
    """
    Returns (count, method_label).
    count = int  (0 if no records found)
    count = -1   if all methods failed
    """
    # Strategy 1: v5
    count, label = strategy_v5(species, geo)
    if count is not None:
        return count, label

    time.sleep(0.4)

    # Strategy 2: v4 combined JSON
    count = bold_v4_combined_count(species, geo)
    if count is not None:
        return count, "v4_combined"

    time.sleep(0.4)

    # Strategy 3: v4 specimen TSV
    count = bold_v4_specimen_count(species, geo)
    if count is not None:
        return count, "v4_specimen"

    return -1, "all_failed"


def bold_wa_count(species):
    """Query across all West African countries, return combined count."""
    total = 0
    method_used = None
    for country in WA_COUNTRIES:
        c, m = query_bold(species, geo=country)
        if c == -1:
            return -1, "all_failed"   # API not working at all
        total += c
        if method_used is None:
            method_used = m
        time.sleep(0.3)
    return total, method_used


# ══════════════════════════════════════════════════════════════════════════════
# CONNECTIVITY TEST
# ══════════════════════════════════════════════════════════════════════════════

def test_connectivity():
    print("\nTesting BOLD API connectivity...")
    test_sp = "Thunnus albacares"

    # v5
    c, label = strategy_v5(test_sp)
    if c is not None:
        print(f"  ✓ BOLD v5 reachable  ({label})  →  {c} records for '{test_sp}'")
        return "v5"

    # v4 combined
    c = bold_v4_combined_count(test_sp)
    if c is not None:
        print(f"  ✓ BOLD v4 combined reachable  →  {c} records for '{test_sp}'")
        return "v4_combined"

    # v4 specimen
    c = bold_v4_specimen_count(test_sp)
    if c is not None:
        print(f"  ✓ BOLD v4 specimen reachable  →  {c} records for '{test_sp}'")
        return "v4_specimen"

    print("  ✗ All BOLD endpoints unreachable.")
    print("\n  Possible causes:")
    print("    1. BOLD is temporarily down — check https://boldsystems.org/about/system-status/")
    print("    2. Your network blocks the BOLD domain")
    print("    3. Try again in a few hours")
    print("\n  Workaround: run the script again later; progress is saved automatically.")
    return None


# ══════════════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════════════

def classify(global_count, wa_count):
    if global_count == -1:
        return "error"
    if global_count == 0:
        return "absent"
    if wa_count > 0:
        return "present"
    return "partial"   # global sequences exist but not from West Africa


def main():
    print("=" * 72)
    print("Nigeria Marine Biodiversity Library")
    print("BOLD Multi-Fallback Query Script")
    print("Strategies: v5 portal → v5 data → v4 combined → v4 specimen")
    print("=" * 72)

    active = test_connectivity()
    if active is None:
        input("\nPress Enter to exit...")
        sys.exit(1)

    print(f"\nUsing strategy: {active} (will fall back automatically if needed)\n")

    # Load progress
    progress = {}
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE) as f:
            progress = json.load(f)
        print(f"Resuming from saved progress ({len(progress)}/{len(TAXA)} done)\n")

    results = list(progress.values())
    done_species = set(progress.keys())

    print(f"{'Species':<42} {'Global':>7} {'WA':>6}  Status       Method")
    print("-" * 80)

    for species, group, marker in TAXA:
        if species in done_species:
            r = progress[species]
            print(f"  {species:<40} {r['bold_global']:>7} {r['bold_wa']:>6}  {r['bold_status']:<12} [resumed]")
            continue

        # Global count
        global_count, method = query_bold(species)
        time.sleep(0.5)

        # WA count (only if global > 0 and API is working)
        if global_count > 0:
            wa_count, _ = bold_wa_count(species)
        elif global_count == 0:
            wa_count = 0
        else:
            wa_count = -1

        status = classify(global_count, wa_count)

        row = {
            "species":      species,
            "group":        group,
            "marker":       marker,
            "bold_global":  global_count,
            "bold_wa":      wa_count,
            "bold_status":  status,
            "method_used":  method,
        }

        print(f"  {species:<40} {global_count:>7} {wa_count:>6}  {status:<12} {method}")

        # Save progress
        progress[species] = row
        with open(PROGRESS_FILE, "w") as f:
            json.dump(progress, f, indent=2)

        results.append(row)
        time.sleep(0.5)

    # Write final CSV
    df = pd.DataFrame(results)
    df.to_csv(OUTPUT_FILE, index=False)

    # Summary
    print("\n" + "=" * 72)
    print("SUMMARY")
    print("=" * 72)
    ok = df[df.bold_global >= 0]
    print(f"\n  Total queried:           {len(df)}")
    print(f"  Absent (0 global):       {len(df[df.bold_global == 0])}")
    print(f"  Partial (global, no WA): {len(df[(df.bold_global > 0) & (df.bold_wa == 0)])}")
    print(f"  Present (WA records):    {len(df[df.bold_wa > 0])}")
    print(f"  Errors (API failed):     {len(df[df.bold_global == -1])}")
    print(f"\n  Methods used: {df.method_used.value_counts().to_dict()}")
    print(f"\nSaved: {OUTPUT_FILE}")
    if os.path.exists(PROGRESS_FILE):
        os.remove(PROGRESS_FILE)
        print(f"Progress file cleaned up.")

    input("\nPress Enter to exit...")


if __name__ == "__main__":
    main()
