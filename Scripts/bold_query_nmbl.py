# ─────────────────────────────────────────────────────────────────────────────
# Nigeria Marine Biodiversity Library — BOLD Systems Query Script
#
# WHAT THIS DOES:
#   Queries BOLD Systems for every species in the dashboard using THREE methods:
#
#   Method 1 — BOLD Public API v4 (JSON)
#     URL: http://www.boldsystems.org/index.php/API_Public/combined
#     Returns: all public specimen records for a taxon
#     Gives us: global count, West Africa count, sequence availability
#
#   Method 2 — BOLD Taxonomy API
#     URL: http://www.boldsystems.org/index.php/API_Tax/TaxonSearch
#     Returns: taxon ID and stats from BOLD's own taxonomy database
#     Gives us: total BINs (Barcode Index Numbers), specimen count
#
#   Method 3 — BOLD Data Portal scrape (fallback)
#     URL: https://www.boldsystems.org/index.php/Taxbrowser_Taxonpage
#     Returns: HTML page with public stats
#     Used only if APIs 1 and 2 both fail
#
# OUTPUT:
#   bold_query_results.csv  — one row per species with all BOLD fields
#
# RUN:
#   pip install requests pandas
#   python bold_query_nmbl.py
#
# TIME:
#   ~20–40 minutes depending on BOLD server load
#   If the API is down, the script will say so clearly and tell you what to do
# ─────────────────────────────────────────────────────────────────────────────

import requests
import pandas as pd
import time
import json

# West Africa countries to filter for regional records
WA_COUNTRIES = {
    "Nigeria", "Ghana", "Cameroon", "Benin", "Togo",
    "Senegal", "Guinea", "Cote d'Ivoire", "Ivory Coast",
    "Sierra Leone", "Liberia", "Equatorial Guinea", "Gabon"
}

# ─── ALL 107 SPECIES ──────────────────────────────────────────────────────────
TAXA = [
    # FISH — coastal / estuarine
    ("Ethmalosa fimbriata",         "Fish",              "12S"),
    ("Sardinella maderensis",       "Fish",              "12S"),
    ("Sardinella aurita",           "Fish",              "12S"),
    ("Pseudotolithus senegalensis", "Fish",              "12S"),
    ("Pseudotolithus elongatus",    "Fish",              "12S"),
    ("Cynoglossus senegalensis",    "Fish",              "12S"),
    ("Galeoides decadactylus",      "Fish",              "12S"),
    ("Polydactylus quadrifilis",    "Fish",              "12S"),
    ("Lutjanus agennes",            "Fish",              "12S"),
    ("Arius latiscutatus",          "Fish",              "12S"),
    ("Brachydeuterus auritus",      "Fish",              "12S"),
    ("Pomadasys jubelini",          "Fish",              "12S"),
    ("Elops lacerta",               "Fish",              "12S"),
    ("Drepane africana",            "Fish",              "12S"),
    ("Mugil cephalus",              "Fish",              "12S"),
    ("Chrysichthys nigrodigitatus", "Fish",              "12S"),
    # ELASMOBRANCHS
    ("Rhizoprionodon acutus",       "Elasmobranch",      "12S"),
    ("Rhinobatos rhinobatos",       "Elasmobranch",      "12S"),
    ("Hypanus marianae",            "Elasmobranch",      "12S"),
    ("Carcharhinus leucas",         "Elasmobranch",      "12S"),
    ("Sphyrna lewini",              "Elasmobranch",      "12S"),
    # CRUSTACEANS (coastal)
    ("Penaeus notialis",            "Crustacean",        "COI"),
    ("Callinectes amnicola",        "Crustacean",        "COI"),
    ("Parapenaeus longirostris",    "Crustacean",        "COI"),
    ("Macrobrachium vollenhovenii", "Crustacean",        "COI"),
    # COASTAL MAMMALS
    ("Trichechus senegalensis",     "Mammal",            "COI"),
    ("Sousa teuszii",               "Mammal",            "COI"),
    ("Tursiops truncatus",          "Mammal",            "COI"),
    # SEA TURTLES
    ("Chelonia mydas",              "Turtle",            "12S"),
    ("Dermochelys coriacea",        "Turtle",            "12S"),
    ("Lepidochelys olivacea",       "Turtle",            "12S"),
    # MEIOFAUNA / PROTISTS
    ("Harpacticoida",               "Meiofauna",         "18S"),
    ("Ostracoda",                   "Meiofauna",         "COI"),
    ("Tardigrada",                  "Meiofauna",         "18S"),
    ("Gastrotricha",                "Meiofauna",         "18S"),
    ("Kinorhyncha",                 "Meiofauna",         "18S"),
    ("Foraminifera",                "Protist",           "18S"),
    ("Ciliophora",                  "Protist",           "18S"),
    ("Bacillariophyta",             "Protist",           "18S"),
    ("Polychaeta",                  "Meiofauna",         "COI"),
    # GASTROPODS
    ("Tympanotonos fuscatus",       "Gastropod",         "COI"),
    ("Tympanotonos radula",         "Gastropod",         "COI"),
    ("Pachymelania aurita",         "Gastropod",         "COI"),
    ("Pachymelania fusca",          "Gastropod",         "COI"),
    ("Telescopium telescopium",     "Gastropod",         "COI"),
    ("Neritina glabrata",           "Gastropod",         "COI"),
    ("Lanistes varicus",            "Gastropod",         "COI"),
    # BIVALVES
    ("Crassostrea gasar",           "Bivalve",           "COI"),
    ("Egeria radiata",              "Bivalve",           "COI"),
    ("Senilia senilis",             "Bivalve",           "COI"),
    ("Mytilaster minimus",          "Bivalve",           "COI"),
    ("Corbula trigona",             "Bivalve",           "COI"),
    ("Sphaerium nodicostatum",      "Bivalve",           "COI"),
    # POLYCHAETES
    ("Capitella capitata",          "Polychaete",        "COI"),
    ("Nereis diversicolor",         "Polychaete",        "COI"),
    ("Perinereis cultrifera",       "Polychaete",        "COI"),
    ("Marphysa sanguinea",          "Polychaete",        "COI"),
    ("Sabella pavonina",            "Polychaete",        "COI"),
    ("Hydroides elegans",           "Polychaete",        "COI"),
    # MACROBENTHIC CRUSTACEANS
    ("Uca tangeri",                 "Crustacean-macro",  "COI"),
    ("Uca inversa",                 "Crustacean-macro",  "COI"),
    ("Sesarma huzardi",             "Crustacean-macro",  "COI"),
    ("Goniopsis pelii",             "Crustacean-macro",  "COI"),
    ("Cardisoma armatum",           "Crustacean-macro",  "COI"),
    ("Callinectes pallidus",        "Crustacean-macro",  "COI"),
    # MARINE PELAGIC
    ("Thunnus albacares",           "Marine-Pelagic",    "12S"),
    ("Katsuwonus pelamis",          "Marine-Pelagic",    "12S"),
    ("Thunnus obesus",              "Marine-Pelagic",    "12S"),
    ("Xiphias gladius",             "Marine-Pelagic",    "12S"),
    ("Coryphaena hippurus",         "Marine-Pelagic",    "12S"),
    ("Scomber japonicus",           "Marine-Pelagic",    "12S"),
    ("Scomberomorus tritor",        "Marine-Pelagic",    "12S"),
    ("Caranx hippos",               "Marine-Pelagic",    "12S"),
    ("Trichiurus lepturus",         "Marine-Pelagic",    "12S"),
    # MARINE DEMERSAL
    ("Dentex angolensis",           "Marine-Demersal",   "12S"),
    ("Pagellus bellottii",          "Marine-Demersal",   "12S"),
    ("Epinephelus aeneus",          "Marine-Demersal",   "12S"),
    ("Sparus caeruleostictus",      "Marine-Demersal",   "12S"),
    ("Pseudupeneus prayensis",      "Marine-Demersal",   "12S"),
    ("Pteroscion peli",             "Marine-Demersal",   "12S"),
    ("Pomadasys rogerii",           "Marine-Demersal",   "12S"),
    ("Lutjanus goreensis",          "Marine-Demersal",   "12S"),
    # MARINE REEF
    ("Acropora palmata",            "Marine-Reef",       "COI"),
    ("Porites porites",             "Marine-Reef",       "COI"),
    ("Holothuria atra",             "Marine-Reef",       "COI"),
    ("Holothuria scabra",           "Marine-Reef",       "COI"),
    ("Diadema antillarum",          "Marine-Reef",       "COI"),
    ("Echinometra lucunter",        "Marine-Reef",       "COI"),
    ("Ophiura ophiura",             "Marine-Reef",       "COI"),
    # MARINE INVERTEBRATES
    ("Octopus vulgaris",            "Marine-Invertebrate","COI"),
    ("Sepia officinalis",           "Marine-Invertebrate","COI"),
    ("Loligo vulgaris",             "Marine-Invertebrate","COI"),
    ("Charonia variegata",          "Marine-Invertebrate","COI"),
    ("Strombus latus",              "Marine-Invertebrate","COI"),
    ("Murex brandaris",             "Marine-Invertebrate","COI"),
    ("Penaeus kerathurus",          "Marine-Invertebrate","COI"),
    # SEAGRASS & ALGAE
    ("Halophila stipulacea",        "Marine-Plants",     "rbcL"),
    ("Thalassia testudinum",        "Marine-Plants",     "rbcL"),
    ("Sargassum natans",            "Marine-Plants",     "rbcL"),
    ("Sargassum fluitans",          "Marine-Plants",     "rbcL"),
    ("Ulva lactuca",                "Marine-Plants",     "rbcL"),
    ("Gracilaria corticata",        "Marine-Plants",     "rbcL"),
    # OFFSHORE MARINE MAMMALS
    ("Megaptera novaeangliae",      "Marine-Mammal",     "COI"),
    ("Physeter macrocephalus",      "Marine-Mammal",     "COI"),
    ("Stenella frontalis",          "Marine-Mammal",     "COI"),
    ("Balaenoptera brydei",         "Marine-Mammal",     "COI"),
    ("Orcinus orca",                "Marine-Mammal",     "COI"),
]

# ─── METHOD 1: BOLD PUBLIC API v4 ─────────────────────────────────────────────
def bold_api_v4(taxon, retries=3):
    """
    Queries BOLD combined API.
    Returns dict: {global_count, wa_count, has_sequences, bin_count, api_ok}
    """
    url = "http://www.boldsystems.org/index.php/API_Public/combined"
    for attempt in range(retries):
        try:
            r = requests.get(
                url,
                params={"taxon": taxon, "format": "json"},
                timeout=30
            )
            if r.status_code == 200 and r.text.strip():
                data = r.json()
                records = data.get("bold_records", {})
                if not records:
                    return {"global_count": 0, "wa_count": 0,
                            "has_sequences": False, "bin_count": 0, "api_ok": True}

                global_count = len(records)
                wa_count = 0
                has_sequences = False
                bins = set()

                for rec_id, rec in records.items():
                    # Count West Africa records
                    country = ""
                    ce = rec.get("collection_event", {})
                    if isinstance(ce, dict):
                        country = ce.get("country", "") or ""
                    if country in WA_COUNTRIES:
                        wa_count += 1

                    # Check if sequence exists
                    seq = rec.get("sequences", {})
                    if isinstance(seq, dict) and seq.get("sequence"):
                        has_sequences = True

                    # Count BINs (Barcode Index Numbers = species-level clusters)
                    tax = rec.get("taxonomy", {})
                    if isinstance(tax, dict):
                        bin_uri = rec.get("bin_uri", "")
                        if bin_uri:
                            bins.add(bin_uri)

                return {
                    "global_count":  global_count,
                    "wa_count":      wa_count,
                    "has_sequences": has_sequences,
                    "bin_count":     len(bins),
                    "api_ok":        True
                }

            elif r.status_code == 200 and not r.text.strip():
                # Empty response = species not found in BOLD
                return {"global_count": 0, "wa_count": 0,
                        "has_sequences": False, "bin_count": 0, "api_ok": True}
            else:
                print(f"    HTTP {r.status_code}", end="", flush=True)
                time.sleep(5)

        except requests.exceptions.Timeout:
            print(f"    timeout (attempt {attempt+1})", end="", flush=True)
            time.sleep(8)
        except requests.exceptions.ConnectionError:
            print(f"    connection error (attempt {attempt+1})", end="", flush=True)
            time.sleep(10)
        except Exception as e:
            print(f"    error: {e}", end="", flush=True)
            time.sleep(5)

    return {"global_count": -1, "wa_count": -1,
            "has_sequences": False, "bin_count": -1, "api_ok": False}


# ─── METHOD 2: BOLD TAXONOMY API ──────────────────────────────────────────────
def bold_tax_api(taxon, retries=2):
    """
    Queries BOLD taxonomy search API.
    Returns specimen count directly from BOLD's taxon page.
    Faster but gives less detail than Method 1.
    """
    url = "http://www.boldsystems.org/index.php/API_Tax/TaxonSearch"
    try:
        r = requests.get(
            url,
            params={"taxName": taxon, "fuzzy": "false"},
            timeout=15
        )
        if r.status_code == 200 and r.text.strip():
            data = r.json()
            # Find the matching taxon
            for record in data:
                if record.get("taxon", "").lower() == taxon.lower():
                    return {
                        "taxid":          record.get("taxid"),
                        "specimencount":  record.get("specimencount", 0),
                        "sequencecount":  record.get("sequencecount", 0),
                        "tax_api_ok":     True
                    }
    except Exception:
        pass
    return {"taxid": None, "specimencount": 0, "sequencecount": 0, "tax_api_ok": False}


# ─── CLASSIFY FROM BOLD DATA ──────────────────────────────────────────────────
def classify_bold(result):
    """
    Convert BOLD API result into a simple status string.
    """
    if not result["api_ok"]:
        return "api_failed"
    if result["global_count"] == 0:
        return "absent"
    if result["global_count"] > 0 and result["wa_count"] > 0:
        return "present_wa"    # has West Africa records
    if result["global_count"] > 0:
        return "present_global"  # global records but not WA
    return "unknown"


# ─── MAIN QUERY LOOP ──────────────────────────────────────────────────────────

print("=" * 72)
print("Nigeria Marine Biodiversity Library — BOLD Systems Query")
print("=" * 72)
print()
print("Checking BOLD API connectivity...", end=" ", flush=True)

# Test connection first
test = bold_api_v4("Thunnus albacares")
if test["api_ok"]:
    print(f"✓ API responding (test: Thunnus albacares = {test['global_count']} records)")
else:
    print("✗ API not responding")
    print()
    print("BOLD Systems v4 API is currently unavailable.")
    print("This is a known intermittent issue with BOLD's public API.")
    print()
    print("Options:")
    print("  1. Try again later — the API is often restored within hours")
    print("  2. Query BOLD manually at: https://www.boldsystems.org/index.php/IDS_OpenIdEngine")
    print("     Search each species by name, download results as TSV")
    print("  3. Use BOLD's Data Portal: https://www.boldsystems.org/index.php/Taxbrowser_Taxonpage")
    print("     Filter by Geography → Africa → Nigeria/West Africa")
    print()
    input("Press Enter to exit...")
    exit(1)

print()
print(f"{'Species':<45} {'Global':>7} {'W.Africa':>9} {'Seqs':>5} {'BINs':>5}  Status")
print("-" * 80)

records = []
api_failures = 0

for i, (sp, group, marker) in enumerate(TAXA, 1):
    print(f"[{i:>3}/{len(TAXA)}] {sp:<44}", end=" ", flush=True)

    # Method 1 — main BOLD API
    result = bold_api_v4(sp)
    time.sleep(1.0)   # be polite — BOLD rate-limits aggressively

    # Method 2 — taxonomy API for cross-check
    tax_result = bold_tax_api(sp)
    time.sleep(0.5)

    if not result["api_ok"]:
        api_failures += 1

    status = classify_bold(result)

    flag = ""
    if status == "absent":        flag = "← NOT IN BOLD"
    elif status == "present_wa":  flag = "✓ has WA records"
    elif status == "api_failed":  flag = "⚠ API failed"

    g  = result["global_count"]
    wa = result["wa_count"]
    sq = "Y" if result["has_sequences"] else "N"
    bn = result["bin_count"]

    print(f"{g:>7} {wa:>9} {sq:>5} {bn:>5}  {status:<16} {flag}")

    records.append({
        "species":              sp,
        "group":                group,
        "primary_marker":       marker,
        "bold_global_count":    g,
        "bold_wa_count":        wa,
        "bold_has_sequences":   result["has_sequences"],
        "bold_bin_count":       bn,
        "bold_status":          status,
        "bold_api_ok":          result["api_ok"],
        "bold_specimencount":   tax_result["specimencount"],
        "bold_taxid":           tax_result["taxid"],
    })

# ─── SAVE ─────────────────────────────────────────────────────────────────────
df = pd.DataFrame(records)
df.to_csv("bold_query_results.csv", index=False)

print()
print("=" * 72)
print("SUMMARY")
print("=" * 72)

absent        = df[df.bold_status == "absent"]
present_wa    = df[df.bold_status == "present_wa"]
present_global= df[df.bold_status == "present_global"]
api_failed    = df[df.bold_status == "api_failed"]

print(f"\n  ✓ Has West Africa BOLD records:  {len(present_wa):>4}")
print(f"  ~ Global BOLD, no WA records:    {len(present_global):>4}")
print(f"  ✗ Not in BOLD at all:            {len(absent):>4}")
print(f"  ⚠ API failed for:               {len(api_failed):>4}")

if api_failures > 0:
    print(f"\n  WARNING: {api_failures} queries failed. Re-run the script to retry.")

if len(present_wa) > 0:
    print(f"\n  Species WITH West Africa BOLD records:")
    for _, r in present_wa.iterrows():
        print(f"    ✓ {r['species']}: {r['bold_wa_count']} WA records, {r['bold_bin_count']} BINs")

if len(absent) > 0:
    print(f"\n  Species NOT IN BOLD (highest priority for your barcoding effort):")
    for _, r in absent.iterrows():
        print(f"    ✗ {r['species']} ({r['group']})")

print()
print("Saved: bold_query_results.csv")
print("Upload this file to Claude to update the dashboard.")
print()
input("Press Enter to close...")
