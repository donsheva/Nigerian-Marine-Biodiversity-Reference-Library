# ─────────────────────────────────────────────────────────────────────────────
# Nigeria Marine Biodiversity Library — Full Database Query Script
# Queries NCBI, BOLD, WoRMS for all dashboard taxa
# Run: python query_all_databases.py
# Requirements: pip install biopython pandas requests
# ─────────────────────────────────────────────────────────────────────────────

from Bio import Entrez
import pandas as pd
import requests
import time
import json

Entrez.email = "your@email.com"

# ─────────────────────────────────────────────────────────────────────────────
# HOW STATUS IS CLASSIFIED:
#
#   NCBI count > 2 AND BOLD count > 2  →  "present"
#   NCBI count > 0 OR  BOLD count > 0  →  "partial"
#   NCBI count = 0 AND BOLD count = 0  →  "absent"
#
# WEST AFRICA FILTER (for partial classification):
#   Even if NCBI count > 2, if WA-specific count = 0 → "partial"
#   This reflects the Nigerian eDNA reality more accurately.
# ─────────────────────────────────────────────────────────────────────────────

WA_COUNTRIES = ["Nigeria", "Ghana", "Cameroon", "Benin", "Togo",
                "Senegal", "Guinea", "Cote d Ivoire"]

NIG_TERMS    = ["Nigeria", "Niger Delta", "Lagos", "Bayelsa", "Delta State",
                "Cross River", "Akwa Ibom"]

# ─── ALL TAXA TO QUERY ────────────────────────────────────────────────────────
# Format: (scientific_name, group, primary_marker, secondary_marker)

TAXA = [
    # FISH — coastal / estuarine
    ("Ethmalosa fimbriata",          "Fish",         "12S",  "COI"),
    ("Sardinella maderensis",        "Fish",         "12S",  "COI"),
    ("Sardinella aurita",            "Fish",         "12S",  "COI"),
    ("Pseudotolithus senegalensis",  "Fish",         "12S",  "COI"),
    ("Pseudotolithus elongatus",     "Fish",         "12S",  "COI"),
    ("Cynoglossus senegalensis",     "Fish",         "12S",  "COI"),
    ("Galeoides decadactylus",       "Fish",         "12S",  "COI"),
    ("Polydactylus quadrifilis",     "Fish",         "12S",  "COI"),
    ("Lutjanus agennes",             "Fish",         "12S",  "COI"),
    ("Arius latiscutatus",           "Fish",         "12S",  "COI"),
    ("Brachydeuterus auritus",       "Fish",         "12S",  "COI"),
    ("Pomadasys jubelini",           "Fish",         "12S",  "COI"),
    ("Elops lacerta",                "Fish",         "12S",  "COI"),
    ("Drepane africana",             "Fish",         "12S",  "COI"),
    ("Mugil cephalus",               "Fish",         "12S",  "COI"),
    ("Chrysichthys nigrodigitatus",  "Fish",         "12S",  "COI"),

    # ELASMOBRANCHS
    ("Rhizoprionodon acutus",        "Elasmobranch", "12S",  "COI"),
    ("Rhinobatos rhinobatos",        "Elasmobranch", "12S",  "COI"),
    ("Hypanus marianae",             "Elasmobranch", "12S",  "COI"),
    ("Carcharhinus leucas",          "Elasmobranch", "12S",  "COI"),
    ("Sphyrna lewini",               "Elasmobranch", "12S",  "COI"),

    # CRUSTACEANS
    ("Penaeus notialis",             "Crustacean",   "COI",  "16S"),
    ("Callinectes amnicola",         "Crustacean",   "COI",  "16S"),
    ("Parapenaeus longirostris",     "Crustacean",   "COI",  "16S"),
    ("Macrobrachium vollenhovenii",  "Crustacean",   "COI",  "16S"),

    # MAMMALS
    ("Trichechus senegalensis",      "Mammal",       "COI",  "16S"),
    ("Sousa teuszii",                "Mammal",       "COI",  "16S"),
    ("Tursiops truncatus",           "Mammal",       "COI",  "16S"),

    # SEA TURTLES
    ("Chelonia mydas",               "Turtle",       "12S",  "COI"),
    ("Dermochelys coriacea",         "Turtle",       "12S",  "COI"),
    ("Lepidochelys olivacea",        "Turtle",       "12S",  "COI"),

    # MARINE — PELAGIC
    ("Thunnus albacares",            "Marine-Pelagic","12S", "COI"),
    ("Katsuwonus pelamis",           "Marine-Pelagic","12S", "COI"),
    ("Scomberomorus tritor",         "Marine-Pelagic","12S", "COI"),
    ("Caranx hippos",                "Marine-Pelagic","12S", "COI"),

    # MARINE — DEMERSAL
    ("Dentex angolensis",            "Marine-Demersal","12S","COI"),
    ("Pagellus bellottii",           "Marine-Demersal","12S","COI"),
    ("Epinephelus aeneus",           "Marine-Demersal","12S","COI"),
    ("Pteroscion peli",              "Marine-Demersal","12S","COI"),
    ("Lutjanus goreensis",           "Marine-Demersal","12S","COI"),

    # MACROBENTHOS — GASTROPODS
    ("Tympanotonos fuscatus",        "Gastropod",    "COI",  "16S"),
    ("Tympanotonos radula",          "Gastropod",    "COI",  "16S"),
    ("Pachymelania aurita",          "Gastropod",    "COI",  "16S"),
    ("Pachymelania fusca",           "Gastropod",    "COI",  "16S"),
    ("Crassostrea gasar",            "Bivalve",      "COI",  "16S"),
    ("Egeria radiata",               "Bivalve",      "COI",  "16S"),
    ("Uca tangeri",                  "Crustacean-macro","COI","16S"),
    ("Sesarma huzardi",              "Crustacean-macro","COI","16S"),
    ("Goniopsis pelii",              "Crustacean-macro","COI","16S"),
    ("Capitella capitata",           "Polychaete",   "COI",  "16S"),
]

# ─── NCBI QUERY ──────────────────────────────────────────────────────────────
def ncbi_count(term, retries=3):
    for i in range(retries):
        try:
            h = Entrez.esearch(db="nucleotide", term=term)
            r = Entrez.read(h); h.close()
            return int(r["Count"])
        except:
            time.sleep(5)
    return -1

# ─── BOLD QUERY ──────────────────────────────────────────────────────────────
def bold_count(taxon, geo=None):
    url = "http://www.boldsystems.org/index.php/API_Public/combined"
    params = {"taxon": taxon, "format": "json"}
    if geo:
        params["geo"] = geo
    try:
        r = requests.get(url, params=params, timeout=20)
        if r.status_code == 200 and r.text.strip():
            data = r.json()
            return len(data.get("bold_records", {}))
    except:
        pass
    return -1

# ─── WORMS QUERY (taxonomy validation) ────────────────────────────────────────
def worms_check(name):
    url = f"https://www.marinespecies.org/rest/AphiaRecordsByName/{requests.utils.quote(name)}"
    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            data = r.json()
            if data:
                rec = data[0]
                return {
                    "worms_id":     rec.get("AphiaID"),
                    "valid_name":   rec.get("valid_name"),
                    "status":       rec.get("status"),
                    "iucn_status":  rec.get("iucnredlist_category", "")
                }
    except:
        pass
    return {}

# ─── CLASSIFY STATUS ──────────────────────────────────────────────────────────
def classify(ncbi_global, ncbi_wa, bold_global):
    """
    PRESENT  = strong global coverage in both NCBI and BOLD
    PARTIAL  = exists in one db, or no West Africa records
    ABSENT   = nothing found anywhere
    """
    if ncbi_global == 0 and bold_global == 0:
        return "absent"
    if ncbi_global > 2 and bold_global > 2 and ncbi_wa > 0:
        return "present"
    return "partial"

# ─── RUN QUERIES ──────────────────────────────────────────────────────────────
print("=" * 80)
print("Nigeria Marine Biodiversity Library — Full Database Query")
print("=" * 80)
print(f"\n{'Species':<45} {'NCBI-G':>8} {'NCBI-WA':>8} {'BOLD-G':>7} {'Status':<10} WoRMS-OK")
print("-" * 90)

records = []
wa_filter = " OR ".join(f'"{c}"[Country]' for c in WA_COUNTRIES)

for sp, group, marker1, marker2 in TAXA:
    # NCBI — global count for primary marker
    ncbi_g  = ncbi_count(f'"{sp}"[Organism] AND {marker1}[Title]')
    time.sleep(0.35)

    # NCBI — West Africa count
    ncbi_wa = ncbi_count(f'"{sp}"[Organism] AND {marker1}[Title] AND ({wa_filter})')
    time.sleep(0.35)

    # BOLD — global
    bold_g  = bold_count(sp)
    time.sleep(0.5)

    # WoRMS check
    worms   = worms_check(sp)
    time.sleep(0.3)

    status  = classify(ncbi_g, ncbi_wa, bold_g)
    wok     = "✓" if worms.get("worms_id") else "✗"
    valid   = worms.get("valid_name", "—")
    iucn    = worms.get("iucn_status", "—")

    flag = ""
    if ncbi_g == 0 and bold_g == 0:
        flag = "<<< ABSENT — PRIORITY"
    elif ncbi_wa == 0:
        flag = "  ← no WA records"

    print(f"  {sp:<43} {ncbi_g:>8} {ncbi_wa:>8} {bold_g:>7}  {status:<10} {wok}  {flag}")

    records.append({
        "species":          sp,
        "group":            group,
        "primary_marker":   marker1,
        "ncbi_global":      ncbi_g,
        "ncbi_wa":          ncbi_wa,
        "bold_global":      bold_g,
        "status":           status,
        "worms_valid_name": valid,
        "worms_iucn":       iucn,
        "worms_ok":         bool(worms.get("worms_id"))
    })

# ─── SAVE ────────────────────────────────────────────────────────────────────
df = pd.DataFrame(records)
df.to_csv("nmbl_full_query_results.csv", index=False)

print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)
absent  = df[df.status == "absent"]
partial = df[df.status == "partial"]
present = df[df.status == "present"]
print(f"\n  PRESENT  (detectable globally):  {len(present):>4}")
print(f"  PARTIAL  (partial coverage):     {len(partial):>4}")
print(f"  ABSENT   (zero sequences):       {len(absent):>4}")
print(f"\n  WoRMS name mismatches (check taxonomy):")
bad = df[~df.worms_ok]
for _, r in bad.iterrows():
    print(f"    ✗ {r['species']}")

print("\n  Top priority ABSENT taxa:")
for _, r in absent.iterrows():
    print(f"    {r['species']} ({r['group']}) — {r['primary_marker']}")

print("\nSaved: nmbl_full_query_results.csv")
input("\nPress Enter to close...")
