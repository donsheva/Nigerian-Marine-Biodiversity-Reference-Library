"""
using_nmbl_data_examples.py
----------------------------
Shows how to use nmbl_data.json in other Python projects once
extract_nmbl_data.py has been run.
"""

import json

# ── 1. Load the shared data file ─────────────────────────────────────────
with open("nmbl_data.json") as f:
    db = json.load(f)

# Keys available:  VERTEBRATES, MEIOFAUNA_OTHER, NEMATODES, MACROBENTHOS, MARINE

# ── 2. Example: list all high-priority gaps in Fish ───────────────────────
print("=== High-priority fish gaps ===")
for s in db["VERTEBRATES"]:
    if s["group"] == "Fish" and s["priority"] == "high":
        status = "ABSENT" if s["ncbi"] == "absent" and s["bold"] == "absent" else "PARTIAL"
        print(f"  {s['name']:<40} {status}")

# ── 3. Example: filter nematodes with no Nigeria sequences ────────────────
print("\n=== Nematodes with Nigeria gap ===")
for n in db["NEMATODES"]:
    if n["ng18s"] == 0 and n["global18s"] > 0:
        print(f"  {n['genus']:<22} global 18S: {n['global18s']:>5}  W.Africa: {n['wa18s']:>3}")

# ── 4. Example: count taxa by group ──────────────────────────────────────
print("\n=== Coverage by group (vertebrates) ===")
from collections import Counter
groups = Counter(s["group"] for s in db["VERTEBRATES"])
for group, count in groups.items():
    absent = sum(1 for s in db["VERTEBRATES"]
                 if s["group"] == group
                 and s["ncbi"] == "absent"
                 and s.get("bold","") == "absent")
    print(f"  {group:<20} {count:>3} taxa,  {absent:>2} gaps")

# ── 5. Example: get all Gulf of Guinea endemic marine species ─────────────
GULF_ENDEMICS = {"Scomberomorus tritor", "Dentex angolensis",
                 "Pteroscion peli", "Lutjanus goreensis",
                 "Strombus latus", "Balaenoptera brydei"}

print("\n=== Gulf of Guinea endemics ===")
for s in db["MARINE"]:
    if s["name"] in GULF_ENDEMICS:
        print(f"  {s['name']:<35} ncbi:{s['ncbi']:<8} bold:{s['bold']}")
