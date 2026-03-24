# ncbi_query_v2.py
# Updated to include African manatee and meiofauna taxonomic groups
# Run: python ncbi_query_v2.py

from Bio import Entrez
import pandas as pd
import time

Entrez.email = "your@email.com"   # put your real email here

# ─────────────────────────────────────────────────────────────────
# SECTION 1 — Named species (searched by species name + 12S marker)
# Add or remove species here as needed
# ─────────────────────────────────────────────────────────────────
FISH_AND_VERTEBRATES = [
    # Commercial fish
    ("Ethmalosa fimbriata",          "Fish",     "Bonga shad"),
    ("Sardinella maderensis",        "Fish",     "Madeiran sardinella"),
    ("Pseudotolithus senegalensis",  "Fish",     "Cassava croaker"),
    ("Pseudotolithus elongatus",     "Fish",     "Bobo croaker"),
    ("Cynoglossus senegalensis",     "Fish",     "Senegalese tonguesole"),
    ("Galeoides decadactylus",       "Fish",     "Lesser African threadfin"),
    ("Polydactylus quadrifilis",     "Fish",     "Giant African threadfin"),
    ("Lutjanus agennes",             "Fish",     "African red snapper"),
    ("Arius latiscutatus",           "Fish",     "Rough-head sea catfish"),
    ("Brachydeuterus auritus",       "Fish",     "Bigeye grunt"),
    ("Elops lacerta",                "Fish",     "West African ladyfish"),
    ("Mugil cephalus",               "Fish",     "Flathead mullet"),
    # Elasmobranchs
    ("Rhizoprionodon acutus",        "Elasmobranch", "Milk shark"),
    ("Rhinobatos rhinobatos",        "Elasmobranch", "Guitarfish"),
    ("Carcharhinus leucas",          "Elasmobranch", "Bull shark"),
    ("Sphyrna lewini",               "Elasmobranch", "Scalloped hammerhead"),
    # Marine mammals — NOTE: use COI or 16S for mammals, not 12S
    ("Trichechus senegalensis",      "Mammal",   "African manatee"),
    ("Sousa teuszii",                "Mammal",   "Atlantic humpback dolphin"),
    ("Tursiops truncatus",           "Mammal",   "Bottlenose dolphin"),
    # Sea turtles
    ("Chelonia mydas",               "Turtle",   "Green sea turtle"),
    ("Dermochelys coriacea",         "Turtle",   "Leatherback turtle"),
    ("Lepidochelys olivacea",        "Turtle",   "Olive ridley turtle"),
    # Crustaceans
    ("Penaeus notialis",             "Crustacean", "Southern pink shrimp"),
    ("Callinectes amnicola",         "Crustacean", "Swimming crab"),
    ("Macrobrachium vollenhovenii",  "Crustacean", "African river prawn"),
]

# ─────────────────────────────────────────────────────────────────
# SECTION 2 — Meiofauna groups
# Meiofauna is NOT a single species — it is an ecological size class.
# We query by higher taxonomic group + relevant markers.
# For meiofauna the best marker is 18S rRNA or COI, not 12S.
# ─────────────────────────────────────────────────────────────────
# Format: (taxon_name, group_label, common_name, best_marker)
MEIOFAUNA_GROUPS = [
    ("Nematoda",        "Meiofauna", "Free-living nematodes",    "18S"),
    ("Harpacticoida",   "Meiofauna", "Harpacticoid copepods",    "18S"),
    ("Ostracoda",       "Meiofauna", "Ostracods",                "COI"),
    ("Tardigrada",      "Meiofauna", "Water bears",              "18S"),
    ("Gastrotricha",    "Meiofauna", "Gastrotrichs",             "18S"),
    ("Kinorhyncha",     "Meiofauna", "Mud dragons",              "18S"),
    ("Platyhelminthes", "Meiofauna", "Free-living flatworms",    "18S"),
    ("Foraminifera",    "Meiofauna", "Foraminifera",             "18S"),
]

# ─────────────────────────────────────────────────────────────────
# HELPER — query with retry
# ─────────────────────────────────────────────────────────────────
def query_ncbi(search_term, db="nucleotide", retries=3):
    for attempt in range(retries):
        try:
            handle = Entrez.esearch(db=db, term=search_term)
            result = Entrez.read(handle)
            handle.close()
            return int(result["Count"])
        except RuntimeError:
            if attempt < retries - 1:
                print(f"    Server error, retrying in 5s...")
                time.sleep(5)
            else:
                return -1
        except Exception as e:
            print(f"    Error: {e}")
            return -1

def classify(count):
    if count == -1: return "error"
    if count == 0:  return "absent"
    if count <= 2:  return "partial"
    return "present"

# ─────────────────────────────────────────────────────────────────
# RUN — Section 1: vertebrates and fish
# ─────────────────────────────────────────────────────────────────
print("=" * 65)
print("SECTION 1 — Fish, vertebrates, crustaceans (marker: 12S)")
print("=" * 65)

records = []
for sp, group, common in FISH_AND_VERTEBRATES:
    # Use COI for mammals (12S less reliable for cetaceans/sirenians)
    if group == "Mammal":
        marker = "COI"
        note   = "(using COI — better for mammals)"
    else:
        marker = "12S"
        note   = ""

    query = f'"{sp}"[Organism] AND {marker}[Title]'
    count = query_ncbi(query)
    status = classify(count)
    flag = "<<< PRIORITY GAP" if status == "absent" else ""
    print(f"  {sp:<45} {count:>5}  [{status}] {flag} {note}")
    records.append({
        "species":    sp,
        "common_name":common,
        "group":      group,
        "marker":     marker,
        "ncbi_count": count,
        "status":     status,
        "section":    "vertebrates",
    })
    time.sleep(0.5)

# ─────────────────────────────────────────────────────────────────
# RUN — Section 2: meiofauna (by taxonomic group, not species)
# ─────────────────────────────────────────────────────────────────
print("\n" + "=" * 65)
print("SECTION 2 — Meiofauna groups (marker: 18S or COI)")
print("  NOTE: These are counts for the whole group globally.")
print("  Low counts = true gap; high counts = sequences exist")
print("  but likely NOT from West Africa specifically.")
print("=" * 65)

# Also check if any records are from West Africa specifically
WA_COUNTRIES = ["Nigeria", "Ghana", "Cameroon", "Benin", "Togo",
                "Cote d'Ivoire", "Guinea", "Senegal"]

for taxon, group, common, marker in MEIOFAUNA_GROUPS:
    # Global count
    q_global = f'"{taxon}"[Organism] AND {marker}[Title]'
    count_global = query_ncbi(q_global)

    # West Africa specific count
    wa_filter = " OR ".join([f'"{c}"[Country]' for c in WA_COUNTRIES])
    q_wa = f'"{taxon}"[Organism] AND {marker}[Title] AND ({wa_filter})'
    count_wa = query_ncbi(q_wa)

    status = classify(count_wa)   # status based on WA records only
    flag = "<<< NO WEST AFRICA RECORDS" if count_wa == 0 else ""
    print(f"  {taxon:<25} global:{count_global:>6}   W.Africa:{count_wa:>5}  {flag}")

    records.append({
        "species":    taxon,
        "common_name":common,
        "group":      group,
        "marker":     marker,
        "ncbi_count": count_wa,   # saving WA count as the relevant figure
        "status":     status,
        "section":    "meiofauna",
        "global_count": count_global,
    })
    time.sleep(0.5)

# ─────────────────────────────────────────────────────────────────
# SAVE
# ─────────────────────────────────────────────────────────────────
df = pd.DataFrame(records)
df.to_csv("ncbi_gap_report_v2.csv", index=False)

print("\n" + "=" * 65)
print("SUMMARY")
print("=" * 65)
print("\nVertebrates/Fish:")
vert = df[df.section == "vertebrates"]
print(vert.groupby("status").size().to_string())

print("\nMeiofauna (West Africa records only):")
meio = df[df.section == "meiofauna"]
print(meio[["species","common_name","ncbi_count","global_count"]].to_string(index=False))

print(f"\nTotal priority gaps (absent): {len(df[df.status == 'absent'])}")
print("\nSaved: ncbi_gap_report_v2.csv")
input("\nPress Enter to close...")
