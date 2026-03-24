# ncbi_query.py
# Run: python ncbi_query.py

from Bio import Entrez
import pandas as pd
import time

Entrez.email = "odedereade@email.com"   # put your real email here

SPECIES = [
    "Ethmalosa fimbriata",
    "Sardinella maderensis",
    "Pseudotolithus senegalensis",
    "Pseudotolithus elongatus",
    "Cynoglossus senegalensis",
    "Galeoides decadactylus",
    "Polydactylus quadrifilis",
    "Lutjanus agennes",
    "Arius latiscutatus",
    "Brachydeuterus auritus",
    "Elops lacerta",
    "Rhizoprionodon acutus",
    "Rhinobatos rhinobatos",
    "Hypanus marianae",
    "Penaeus notialis",
    "Callinectes amnicola",
    "Trichechus senegalensis",
    "Sousa teuszii",
]

def query_ncbi(species, retries=3):
    """Query NCBI with automatic retry on server errors."""
    for attempt in range(retries):
        try:
            query = f'"{species}"[Organism] AND 12S[Title]'
            handle = Entrez.esearch(db="nucleotide", term=query)
            result = Entrez.read(handle)
            handle.close()
            return int(result["Count"])
        except RuntimeError as e:
            if attempt < retries - 1:
                print(f"  Server error for {species}, retrying in 5s...")
                time.sleep(5)
            else:
                print(f"  Failed after {retries} attempts: {e}")
                return -1
        except Exception as e:
            print(f"  Unexpected error for {species}: {e}")
            return -1

print("Querying NCBI for 12S sequences...\n")
records = []

for sp in SPECIES:
    count = query_ncbi(sp)
    if count == -1:
        status = "error"
    elif count == 0:
        status = "absent"
    elif count <= 2:
        status = "partial"
    else:
        status = "present"

    marker = "<<< PRIORITY GAP" if status == "absent" else ""
    print(f"  {sp:<45} {count:>4} sequences   [{status}] {marker}")
    records.append({
        "species":        sp,
        "ncbi_12S_count": count,
        "status":         status,
    })
    time.sleep(0.5)

df = pd.DataFrame(records)
df.to_csv("ncbi_gap_report.csv", index=False)

print("\n" + "="*60)
print("SUMMARY")
print("="*60)
print(df.groupby("status").size().to_string())
print(f"\nTotal species queried: {len(df)}")
print(f"Priority gaps (absent): {len(df[df.status=='absent'])}")
print("\nSaved: ncbi_gap_report.csv")
input("\nPress Enter to close...")
