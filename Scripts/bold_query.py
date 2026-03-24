# --- bold_query.py ---
import requests, json, time

def query_bold(taxon, geo="Nigeria"):
    url = "http://www.boldsystems.org/index.php/API_Public/combined"
    params = {"taxon": taxon, "geo": geo, "format": "json"}
    r = requests.get(url, params=params, timeout=30)
    if r.status_code == 200 and r.text.strip():
        return r.json()
    return {}

groups = ["Actinopterygii", "Elasmobranchii", 
          "Malacostraca", "Cetacea", "Testudines"]

results = {}
for group in groups:
    print(f"Querying BOLD: {group}...")
    data = query_bold(group, geo="Nigeria")
    bold_records = data.get("bold_records", {})
    results[group] = len(bold_records)
    print(f"  Found: {len(bold_records)} records")
    time.sleep(1)  # be polite to the API

print("\nSummary:", results)

# Save sequences to FASTA
with open("bold_nigeria.fasta", "w") as f:
    for group in groups:
        data = query_bold(group, geo="Nigeria")
        for rec_id, rec in data.get("bold_records", {}).items():
            seq = rec.get("sequences", {}).get("sequence", "")
            name = rec.get("taxonomy", {}).get("species", {}).get("taxon", {}).get("name", "unknown")
            if seq:
                f.write(f">{rec_id}|{name}\n{seq}\n")

print("Saved: bold_nigeria.fasta")