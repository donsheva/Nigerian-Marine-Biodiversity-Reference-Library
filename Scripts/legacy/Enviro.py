# --- build_library.py ---
from Bio import SeqIO
from Bio.SeqRecord import SeqRecord
from Bio.Seq import Seq
import csv, os

# Your new sequences (from Sanger sequencing results)
new_sequences = [
    {
        "id": "NGA_001",
        "species": "Ethmalosa fimbriata",
        "location": "Lagos Lagoon",
        "lat": 6.45, "lon": 3.40,
        "date": "2025-03-01",
        "marker": "12S",
        "voucher": "NIOMR-2025-001",
        "sequence": "ACGTACGT..."  # paste your sequence here
    },
]

os.makedirs("nigeria_reflib/12S", exist_ok=True)

records = []
taxonomy_lines = []

for s in new_sequences:
    rec = SeqRecord(
        Seq(s["sequence"]),
        id=s["id"],
        description=f"{s['species']}|{s['location']}|{s['marker']}|{s['voucher']}"
    )
    records.append(rec)
    taxonomy_lines.append(
        f"{s['id']}\t{s['species']};{s['marker']};Nigeria"
    )

SeqIO.write(records, "nigeria_reflib/12S/nigeria_12S.fasta", "fasta")

with open("nigeria_reflib/12S/taxonomy.tsv", "w") as f:
    f.write("\n".join(taxonomy_lines))

print(f"Library updated: {len(records)} sequences")
print("Files: nigeria_reflib/12S/nigeria_12S.fasta")