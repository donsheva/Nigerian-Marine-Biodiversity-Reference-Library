# ─────────────────────────────────────────────────────────────────────────────
# Nigeria Marine Biodiversity Library — Full Query Script (107 taxa)
# Queries NCBI Nucleotide + WoRMS for every species in the dashboard
#
# STATUS RULES:
#   ncbi_global > 10 AND ncbi_wa > 0  →  "present"
#   ncbi_global > 0                   →  "partial"
#   ncbi_global = 0                   →  "absent"
#
# NOTE: BOLD Systems v4 API was unavailable during previous query (March 2026).
# Re-run this script when BOLD API is restored to get full confirmation.
#
# Run:    python query_all_107_species.py
# Needs:  pip install biopython pandas requests
# Time:   ~25–35 minutes (rate-limited to be polite to NCBI)
# ─────────────────────────────────────────────────────────────────────────────

from Bio import Entrez
import pandas as pd
import requests
import time

Entrez.email = "odedereade@gmail.com"   # ← your NCBI email

WA_COUNTRIES = ["Nigeria", "Ghana", "Cameroon", "Benin", "Togo",
                "Senegal", "Guinea", "Cote d Ivoire", "Gulf of Guinea"]

# ─── ALL 107 TAXA ─────────────────────────────────────────────────────────────
# Format: (scientific_name, group, primary_marker)
TAXA = [
    # FISH — coastal / estuarine
    ("Ethmalosa fimbriata",          "Fish",              "12S"),
    ("Sardinella maderensis",        "Fish",              "12S"),
    ("Sardinella aurita",            "Fish",              "12S"),
    ("Pseudotolithus senegalensis",  "Fish",              "12S"),
    ("Pseudotolithus elongatus",     "Fish",              "12S"),
    ("Cynoglossus senegalensis",     "Fish",              "12S"),
    ("Galeoides decadactylus",       "Fish",              "12S"),
    ("Polydactylus quadrifilis",     "Fish",              "12S"),
    ("Lutjanus agennes",             "Fish",              "12S"),
    ("Arius latiscutatus",           "Fish",              "12S"),
    ("Brachydeuterus auritus",       "Fish",              "12S"),
    ("Pomadasys jubelini",           "Fish",              "12S"),
    ("Elops lacerta",                "Fish",              "12S"),
    ("Drepane africana",             "Fish",              "12S"),
    ("Mugil cephalus",               "Fish",              "12S"),
    ("Chrysichthys nigrodigitatus",  "Fish",              "12S"),

    # ELASMOBRANCHS
    ("Rhizoprionodon acutus",        "Elasmobranch",      "12S"),
    ("Rhinobatos rhinobatos",        "Elasmobranch",      "12S"),
    ("Hypanus marianae",             "Elasmobranch",      "12S"),
    ("Carcharhinus leucas",          "Elasmobranch",      "12S"),
    ("Sphyrna lewini",               "Elasmobranch",      "12S"),

    # CRUSTACEANS (coastal)
    ("Penaeus notialis",             "Crustacean",        "COI"),
    ("Callinectes amnicola",         "Crustacean",        "COI"),
    ("Parapenaeus longirostris",     "Crustacean",        "COI"),
    ("Macrobrachium vollenhovenii",  "Crustacean",        "COI"),

    # COASTAL MAMMALS
    ("Trichechus senegalensis",      "Mammal",            "COI"),
    ("Sousa teuszii",                "Mammal",            "COI"),
    ("Tursiops truncatus",           "Mammal",            "COI"),

    # SEA TURTLES
    ("Chelonia mydas",               "Turtle",            "12S"),
    ("Dermochelys coriacea",         "Turtle",            "12S"),
    ("Lepidochelys olivacea",        "Turtle",            "12S"),

    # MEIOFAUNA / PROTISTS (higher taxa — counts per group)
    ("Harpacticoida",                "Meiofauna",         "18S"),
    ("Ostracoda",                    "Meiofauna",         "COI"),
    ("Tardigrada",                   "Meiofauna",         "18S"),
    ("Gastrotricha",                 "Meiofauna",         "18S"),
    ("Kinorhyncha",                  "Meiofauna",         "18S"),
    ("Foraminifera",                 "Protist",           "18S"),
    ("Ciliophora",                   "Protist",           "18S"),
    ("Bacillariophyta",              "Protist",           "18S"),
    ("Polychaeta",                   "Meiofauna",         "COI"),

    # MACROBENTHOS — GASTROPODS
    ("Tympanotonos fuscatus",        "Gastropod",         "COI"),
    ("Tympanotonos radula",          "Gastropod",         "COI"),
    ("Pachymelania aurita",          "Gastropod",         "COI"),
    ("Pachymelania fusca",           "Gastropod",         "COI"),
    ("Telescopium telescopium",      "Gastropod",         "COI"),
    ("Neritina glabrata",            "Gastropod",         "COI"),
    ("Lanistes varicus",             "Gastropod",         "COI"),

    # MACROBENTHOS — BIVALVES
    ("Crassostrea gasar",            "Bivalve",           "COI"),
    ("Egeria radiata",               "Bivalve",           "COI"),
    ("Senilia senilis",              "Bivalve",           "COI"),
    ("Mytilaster minimus",           "Bivalve",           "COI"),
    ("Corbula trigona",              "Bivalve",           "COI"),
    ("Sphaerium nodicostatum",       "Bivalve",           "COI"),

    # MACROBENTHOS — POLYCHAETES
    ("Capitella capitata",           "Polychaete",        "COI"),
    ("Nereis diversicolor",          "Polychaete",        "COI"),
    ("Perinereis cultrifera",        "Polychaete",        "COI"),
    ("Marphysa sanguinea",           "Polychaete",        "COI"),
    ("Sabella pavonina",             "Polychaete",        "COI"),
    ("Hydroides elegans",            "Polychaete",        "COI"),

    # MACROBENTHOS — CRUSTACEANS
    ("Uca tangeri",                  "Crustacean-macro",  "COI"),
    ("Uca inversa",                  "Crustacean-macro",  "COI"),
    ("Sesarma huzardi",              "Crustacean-macro",  "COI"),
    ("Goniopsis pelii",              "Crustacean-macro",  "COI"),
    ("Cardisoma armatum",            "Crustacean-macro",  "COI"),
    ("Callinectes pallidus",         "Crustacean-macro",  "COI"),

    # MARINE PELAGIC
    ("Thunnus albacares",            "Marine-Pelagic",    "12S"),
    ("Katsuwonus pelamis",           "Marine-Pelagic",    "12S"),
    ("Thunnus obesus",               "Marine-Pelagic",    "12S"),
    ("Xiphias gladius",              "Marine-Pelagic",    "12S"),
    ("Coryphaena hippurus",          "Marine-Pelagic",    "12S"),
    ("Scomber japonicus",            "Marine-Pelagic",    "12S"),
    ("Scomberomorus tritor",         "Marine-Pelagic",    "12S"),
    ("Caranx hippos",                "Marine-Pelagic",    "12S"),
    ("Trichiurus lepturus",          "Marine-Pelagic",    "12S"),

    # MARINE DEMERSAL
    ("Dentex angolensis",            "Marine-Demersal",   "12S"),
    ("Pagellus bellottii",           "Marine-Demersal",   "12S"),
    ("Epinephelus aeneus",           "Marine-Demersal",   "12S"),
    ("Sparus caeruleostictus",       "Marine-Demersal",   "12S"),
    ("Pseudupeneus prayensis",       "Marine-Demersal",   "12S"),
    ("Pteroscion peli",              "Marine-Demersal",   "12S"),
    ("Pomadasys rogerii",            "Marine-Demersal",   "12S"),
    ("Lutjanus goreensis",           "Marine-Demersal",   "12S"),

    # MARINE REEF & HARD SUBSTRATE
    ("Acropora palmata",             "Marine-Reef",       "COI"),
    ("Porites porites",              "Marine-Reef",       "COI"),
    ("Holothuria atra",              "Marine-Reef",       "COI"),
    ("Holothuria scabra",            "Marine-Reef",       "COI"),
    ("Diadema antillarum",           "Marine-Reef",       "COI"),
    ("Echinometra lucunter",         "Marine-Reef",       "COI"),
    ("Ophiura ophiura",              "Marine-Reef",       "COI"),

    # MARINE INVERTEBRATES
    ("Octopus vulgaris",             "Marine-Invertebrate","COI"),
    ("Sepia officinalis",            "Marine-Invertebrate","COI"),
    ("Loligo vulgaris",              "Marine-Invertebrate","COI"),
    ("Charonia variegata",           "Marine-Invertebrate","COI"),
    ("Strombus latus",               "Marine-Invertebrate","COI"),
    ("Murex brandaris",              "Marine-Invertebrate","COI"),
    ("Penaeus kerathurus",           "Marine-Invertebrate","COI"),

    # SEAGRASS & MACROALGAE
    ("Halophila stipulacea",         "Marine-Plants",     "rbcL"),
    ("Thalassia testudinum",         "Marine-Plants",     "rbcL"),
    ("Sargassum natans",             "Marine-Plants",     "rbcL"),
    ("Sargassum fluitans",           "Marine-Plants",     "rbcL"),
    ("Ulva lactuca",                 "Marine-Plants",     "rbcL"),
    ("Gracilaria corticata",         "Marine-Plants",     "rbcL"),

    # OFFSHORE MARINE MAMMALS
    ("Megaptera novaeangliae",       "Marine-Mammal",     "COI"),
    ("Physeter macrocephalus",       "Marine-Mammal",     "COI"),
    ("Stenella frontalis",           "Marine-Mammal",     "COI"),
    ("Balaenoptera brydei",          "Marine-Mammal",     "COI"),
    ("Orcinus orca",                 "Marine-Mammal",     "COI"),
]

# ─── HELPERS ──────────────────────────────────────────────────────────────────

def ncbi_count(term, retries=3):
    for attempt in range(retries):
        try:
            h = Entrez.esearch(db="nucleotide", term=term)
            r = Entrez.read(h); h.close()
            return int(r["Count"])
        except Exception as e:
            if attempt < retries - 1:
                print(f"    Retry {attempt+1}/3: {e}")
                time.sleep(6)
            else:
                return -1

def bold_count(taxon, retries=2):
    url = "http://www.boldsystems.org/index.php/API_Public/combined"
    for attempt in range(retries):
        try:
            r = requests.get(url, params={"taxon": taxon, "format": "json"}, timeout=20)
            if r.status_code == 200 and r.text.strip():
                data = r.json()
                return len(data.get("bold_records", {}))
        except Exception:
            time.sleep(3)
    return -1   # API unavailable

def worms_lookup(name):
    try:
        url = f"https://www.marinespecies.org/rest/AphiaRecordsByName/{requests.utils.quote(name)}"
        r = requests.get(url, params={"like": "false", "marine_only": "false"}, timeout=10)
        if r.status_code == 200 and r.json():
            rec = r.json()[0]
            valid = rec.get("valid_name", "")
            return valid, rec.get("status", ""), True
    except Exception:
        pass
    return "", "", False

def classify(ncbi_g, ncbi_wa, bold_g):
    """
    present = strong global coverage AND confirmed West Africa records
    partial = some records exist somewhere
    absent  = nothing found anywhere
    """
    if ncbi_g == 0 and (bold_g == 0 or bold_g == -1):
        return "absent"
    if ncbi_g > 10 and ncbi_wa > 0:
        return "present"
    return "partial"

# ─── QUERY ────────────────────────────────────────────────────────────────────

print("=" * 72)
print("Nigeria Marine Biodiversity Library — Full 107-Species Query")
print("=" * 72)
print()

wa_filter = " OR ".join(f'"{c}"[Country]' for c in WA_COUNTRIES)
records = []

for i, (sp, group, marker) in enumerate(TAXA, 1):
    print(f"[{i:>3}/{len(TAXA)}] {sp:<45}", end=" ", flush=True)

    # NCBI global
    ncbi_g  = ncbi_count(f'"{sp}"[Organism] AND {marker}[Title]')
    time.sleep(0.35)

    # NCBI West Africa
    ncbi_wa = ncbi_count(f'"{sp}"[Organism] AND {marker}[Title] AND ({wa_filter})')
    time.sleep(0.35)

    # BOLD (try; may fail)
    bold_g  = bold_count(sp)
    time.sleep(0.5)

    # WoRMS
    worms_valid, worms_status, worms_ok = worms_lookup(sp)
    time.sleep(0.3)

    status = classify(ncbi_g, ncbi_wa, bold_g)

    flag = ""
    if status == "absent":   flag = "<<< ABSENT"
    elif ncbi_wa == 0:       flag = "(no WA records)"

    print(f"NCBI:{ncbi_g:>5} WA:{ncbi_wa:>4} BOLD:{bold_g:>5}  [{status}]  {flag}")

    records.append({
        "species":          sp,
        "group":            group,
        "primary_marker":   marker,
        "ncbi_global":      ncbi_g,
        "ncbi_wa":          ncbi_wa,
        "bold_global":      bold_g,
        "status":           status,
        "worms_valid_name": worms_valid,
        "worms_status":     worms_status,
        "worms_ok":         worms_ok,
    })

# ─── SAVE ─────────────────────────────────────────────────────────────────────
df = pd.DataFrame(records)
df.to_csv("nmbl_full_query_results_v2.csv", index=False)

print()
print("=" * 72)
print("SUMMARY")
print("=" * 72)
print(df.groupby(["group", "status"]).size().to_string())
print()
absent = df[df.status=="absent"]
print(f"Total ABSENT (zero sequences): {len(absent)}")
for _, r in absent.iterrows():
    print(f"  {r['species']} ({r['group']})")

print()
print("Saved: nmbl_full_query_results_v2.csv")
input("\nPress Enter to close...")
