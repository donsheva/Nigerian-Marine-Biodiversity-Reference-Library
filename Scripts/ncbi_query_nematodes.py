# ncbi_query_nematodes.py
# Focused gap analysis for free-living marine nematodes
# Niger Delta / Nigerian coastal waters
# Run: python ncbi_query_nematodes.py

from Bio import Entrez
import pandas as pd
import time

Entrez.email = "your@email.com"   # required

# ─────────────────────────────────────────────────────────────────
# TARGET GENERA
# These are the most commonly reported free-living marine nematode
# genera in West African and tropical coastal sediments.
# Source: published surveys from Gulf of Guinea + global coastal lit.
#
# HOW TO READ THE RESULTS:
#   global_count  = sequences from anywhere in the world
#   wa_count      = sequences specifically from West Africa
#   ng_count      = sequences specifically from Nigeria
#
# A genus with 5000 global but 0 Nigeria records = your priority target.
# ─────────────────────────────────────────────────────────────────

NEMATODE_GENERA = [

    # ── Chromadorida (tolerant of enrichment/low oxygen) ──────────
    # These tend to INCREASE under oil/organic pollution
    ("Chromadora",        "Chromadorida", "Enrichment tolerant"),
    ("Chromadorita",      "Chromadorida", "Enrichment tolerant"),
    ("Ptycholaimellus",   "Chromadorida", "Enrichment tolerant"),
    ("Dichromadora",      "Chromadorida", "Enrichment tolerant"),
    ("Innocuonema",       "Chromadorida", "Enrichment tolerant"),

    # ── Desmodorida (hypoxia tolerant) ────────────────────────────
    ("Desmodora",         "Desmodorida",  "Hypoxia tolerant"),
    ("Spirinia",          "Desmodorida",  "Hypoxia tolerant"),
    ("Metachromadora",    "Desmodorida",  "Hypoxia tolerant"),

    # ── Monhysterida (opportunists, rise under disturbance) ───────
    ("Monhystera",        "Monhysterida", "Disturbance opportunist"),
    ("Terschellingia",    "Monhysterida", "Organic enrichment indicator"),
    ("Diplolaimelloides", "Monhysterida", "Organic enrichment indicator"),
    ("Sphaerolaimus",     "Monhysterida", "Sulphide tolerant"),

    # ── Enoplida (sensitive, decline under pollution) ─────────────
    # These DECREASE under oil/organic enrichment — good reference baseline
    ("Enoplus",           "Enoplida",     "Pollution sensitive"),
    ("Thoracostoma",      "Enoplida",     "Pollution sensitive"),
    ("Eurystomina",       "Enoplida",     "Pollution sensitive"),
    ("Oxystomina",        "Enoplida",     "Pollution sensitive"),

    # ── Araeolaimida ──────────────────────────────────────────────
    ("Axonolaimus",       "Araeolaimida", "Deposit feeder"),
    ("Odontophora",       "Araeolaimida", "Deposit feeder"),
    ("Campylaimus",       "Araeolaimida", "Deposit feeder"),

    # ── Desmoscolecida ────────────────────────────────────────────
    ("Desmoscolex",       "Desmoscolecida","Sandy sediment specialist"),
    ("Quadricoma",        "Desmoscolecida","Sandy sediment specialist"),

    # ── Rhabditida (includes some parasitic — avoid confusion) ────
    ("Pellioditis",       "Rhabditida",   "Organic matter indicator"),
    ("Diploscapter",      "Rhabditida",   "Organic matter indicator"),

    # ── Plectida ──────────────────────────────────────────────────
    ("Plectus",           "Plectida",     "Generalist"),
    ("Rhabditis",         "Plectida",     "Generalist"),

    # ── Aphanolaimus / Stylotheristus ─────────────────────────────
    ("Aphanolaimus",      "Araeolaimida", "Fine sediment"),
    ("Stylotheristus",    "Desmodorida",  "Mangrove associated"),
]

# West African and Nigerian geographic filters
WA  = ["Nigeria", "Ghana", "Cameroon", "Benin", "Togo",
       "Senegal", "Guinea", "Cote d Ivoire", "Gulf of Guinea"]
NIG = ["Nigeria", "Niger Delta", "Lagos", "Cross River",
       "Bayelsa", "Delta State", "Akwa Ibom"]

# Markers used for nematode barcoding
# 18S V1V2 is primary; 28S D2D3 is higher resolution
MARKERS = ["18S", "28S"]

def query(term, retries=3):
    for attempt in range(retries):
        try:
            handle = Entrez.esearch(db="nucleotide", term=term)
            result = Entrez.read(handle)
            handle.close()
            return int(result["Count"])
        except RuntimeError:
            if attempt < retries - 1:
                print(f"    Server busy, retrying...")
                time.sleep(5)
            else:
                return -1
        except Exception as e:
            print(f"    Error: {e}")
            return -1

# ─────────────────────────────────────────────────────────────────
# RUN
# ─────────────────────────────────────────────────────────────────
print("=" * 72)
print("Nigeria Coastal Waters — Nematode Reference Library Gap Analysis")
print("Markers: 18S rRNA (V1V2) and 28S rRNA (D2D3)")
print("=" * 72)
print(f"\n{'Genus':<22} {'Order':<18} {'Global 18S':>10} {'WA 18S':>8} {'NGA 18S':>8} {'Global 28S':>10} {'NGA 28S':>8}")
print("-" * 90)

records = []

for genus, order, role in NEMATODE_GENERA:
    row = {"genus": genus, "order": order, "ecological_role": role}

    for marker in MARKERS:
        q_global = f'"{genus}"[Organism] AND {marker}[Title]'
        q_wa     = f'"{genus}"[Organism] AND {marker}[Title] AND ({" OR ".join(f"{c}[Country]" for c in WA)})'
        q_ng     = f'"{genus}"[Organism] AND {marker}[Title] AND ({" OR ".join(f"{c}[Country]" for c in NIG)})'

        row[f"global_{marker}"] = query(q_global); time.sleep(0.4)
        row[f"wa_{marker}"]     = query(q_wa);     time.sleep(0.4)
        row[f"ng_{marker}"]     = query(q_ng);     time.sleep(0.4)

    ng_gap = "<<< NIGERIA GAP" if row["ng_18S"] == 0 and row["global_18S"] > 0 else ""
    zero   = "<<< UNSEQUENCED" if row["global_18S"] == 0 else ""
    flag   = ng_gap or zero

    print(f"  {genus:<20} {order:<18} "
          f"{row['global_18S']:>10} {row['wa_18S']:>8} {row['ng_18S']:>8} "
          f"{row['global_28S']:>10} {row['ng_28S']:>8}  {flag}")
    records.append(row)

# ─────────────────────────────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────────────────────────────
df = pd.DataFrame(records)
df.to_csv("nematode_gap_report.csv", index=False)

print("\n" + "=" * 72)
print("SUMMARY")
print("=" * 72)

total         = len(df)
unsequenced   = len(df[df["global_18S"] == 0])
ng_gap        = len(df[(df["global_18S"] > 0) & (df["ng_18S"] == 0)])
ng_present    = len(df[df["ng_18S"] > 0])

print(f"\n  Total genera assessed:              {total}")
print(f"  Globally unsequenced (18S):         {unsequenced}  — these need new sequencing from scratch")
print(f"  Sequenced globally, gap in Nigeria: {ng_gap}  — sequences exist but not from your region")
print(f"  Have Nigeria/WA sequences:          {ng_present}")

print("\n  Priority 1 — Globally unsequenced genera:")
for _, r in df[df["global_18S"] == 0].iterrows():
    print(f"    {r['genus']:<22} ({r['order']}) — {r['ecological_role']}")

print("\n  Priority 2 — Nigeria gap (sequences exist elsewhere):")
for _, r in df[(df["global_18S"] > 0) & (df["ng_18S"] == 0)].iterrows():
    print(f"    {r['genus']:<22} ({r['order']}) global 18S: {r['global_18S']:>4} — {r['ecological_role']}")

print("\n  Pollution-sensitive genera with Nigeria sequences (baseline available):")
sensitive = df[(df["ecological_role"].str.contains("sensitive|tolerant")) & (df["ng_18S"] > 0)]
for _, r in sensitive.iterrows():
    print(f"    {r['genus']:<22} Nigeria 18S records: {r['ng_18S']}")

print("\nSaved: nematode_gap_report.csv")
print("\nNEXT STEPS:")
print("  1. Open nematode_gap_report.csv in Excel")
print("  2. Sort by ng_18S = 0 — those are your collection priorities")
print("  3. Cross-reference with SILVA database at https://www.arb-silva.de/")
print("     (SILVA is more complete than NCBI for 18S nematode sequences)")
print("  4. Check WoRMS for accepted taxonomy: https://www.marinespecies.org/")
input("\nPress Enter to close...")
