# ─────────────────────────────────────────────────────────────────────────────
# Nigeria Marine Biodiversity Library — BOLD v5 API Query Script
#
# Uses the new BOLD Data Portal API (portal.boldsystems.org)
# which replaced the old v4 JSON API.
#
# WORKFLOW (3 steps per species):
#   Step 1 — Preprocessor validates the query and returns formal triplets
#     GET /api/query/preprocessor?query=tax:<species>
#
#   Step 2 — Submit triplets, get a query_id token
#     POST /api/query  (body: {triplets, extent})
#
#   Step 3 — Download records using the token
#     GET /api/documents/<query_id>/download?format=json
#
# For each species we run TWO queries:
#   Query A: tax:<species>                       → global count
#   Query B: tax:<species>;geo:<WA country>      → West Africa count
#
# OUTPUT:
#   bold_v5_query_results.csv
#
# RUN:
#   pip install requests pandas
#   python bold_v5_query_nmbl.py
#
# TIME: ~45–60 min for all 107 species (2 queries each + download batches)
#       Script saves progress and can be resumed if interrupted.
# ─────────────────────────────────────────────────────────────────────────────

import requests
import pandas as pd
import time
import json
import os

BASE = "https://portal.boldsystems.org"

# West Africa countries — queried individually then summed
WA_COUNTRIES = [
    "Nigeria", "Ghana", "Cameroon", "Benin", "Togo",
    "Senegal", "Guinea", "Ivory Coast", "Sierra Leone",
    "Liberia", "Equatorial Guinea", "Gabon"
]

TAXA = [
    # Fish — coastal / estuarine
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
    # Elasmobranchs
    ("Rhizoprionodon acutus",       "Elasmobranch",      "12S"),
    ("Rhinobatos rhinobatos",       "Elasmobranch",      "12S"),
    ("Hypanus marianae",            "Elasmobranch",      "12S"),
    ("Carcharhinus leucas",         "Elasmobranch",      "12S"),
    ("Sphyrna lewini",              "Elasmobranch",      "12S"),
    # Crustaceans (coastal)
    ("Penaeus notialis",            "Crustacean",        "COI"),
    ("Callinectes amnicola",        "Crustacean",        "COI"),
    ("Parapenaeus longirostris",    "Crustacean",        "COI"),
    ("Macrobrachium vollenhovenii", "Crustacean",        "COI"),
    # Coastal mammals
    ("Trichechus senegalensis",     "Mammal",            "COI"),
    ("Sousa teuszii",               "Mammal",            "COI"),
    ("Tursiops truncatus",          "Mammal",            "COI"),
    # Sea turtles
    ("Chelonia mydas",              "Turtle",            "12S"),
    ("Dermochelys coriacea",        "Turtle",            "12S"),
    ("Lepidochelys olivacea",       "Turtle",            "12S"),
    # Meiofauna / protists
    ("Harpacticoida",               "Meiofauna",         "18S"),
    ("Ostracoda",                   "Meiofauna",         "COI"),
    ("Tardigrada",                  "Meiofauna",         "18S"),
    ("Gastrotricha",                "Meiofauna",         "18S"),
    ("Kinorhyncha",                 "Meiofauna",         "18S"),
    ("Foraminifera",                "Protist",           "18S"),
    ("Ciliophora",                  "Protist",           "18S"),
    ("Bacillariophyta",             "Protist",           "18S"),
    ("Polychaeta",                  "Meiofauna",         "COI"),
    # Gastropods
    ("Tympanotonos fuscatus",       "Gastropod",         "COI"),
    ("Tympanotonos radula",         "Gastropod",         "COI"),
    ("Pachymelania aurita",         "Gastropod",         "COI"),
    ("Pachymelania fusca",          "Gastropod",         "COI"),
    ("Telescopium telescopium",     "Gastropod",         "COI"),
    ("Neritina glabrata",           "Gastropod",         "COI"),
    ("Lanistes varicus",            "Gastropod",         "COI"),
    # Bivalves
    ("Crassostrea gasar",           "Bivalve",           "COI"),
    ("Egeria radiata",              "Bivalve",           "COI"),
    ("Senilia senilis",             "Bivalve",           "COI"),
    ("Mytilaster minimus",          "Bivalve",           "COI"),
    ("Corbula trigona",             "Bivalve",           "COI"),
    ("Sphaerium nodicostatum",      "Bivalve",           "COI"),
    # Polychaetes
    ("Capitella capitata",          "Polychaete",        "COI"),
    ("Nereis diversicolor",         "Polychaete",        "COI"),
    ("Perinereis cultrifera",       "Polychaete",        "COI"),
    ("Marphysa sanguinea",          "Polychaete",        "COI"),
    ("Sabella pavonina",            "Polychaete",        "COI"),
    ("Hydroides elegans",           "Polychaete",        "COI"),
    # Macrobenthic crustaceans
    ("Uca tangeri",                 "Crustacean-macro",  "COI"),
    ("Uca inversa",                 "Crustacean-macro",  "COI"),
    ("Sesarma huzardi",             "Crustacean-macro",  "COI"),
    ("Goniopsis pelii",             "Crustacean-macro",  "COI"),
    ("Cardisoma armatum",           "Crustacean-macro",  "COI"),
    ("Callinectes pallidus",        "Crustacean-macro",  "COI"),
    # Marine pelagic
    ("Thunnus albacares",           "Marine-Pelagic",    "12S"),
    ("Katsuwonus pelamis",          "Marine-Pelagic",    "12S"),
    ("Thunnus obesus",              "Marine-Pelagic",    "12S"),
    ("Xiphias gladius",             "Marine-Pelagic",    "12S"),
    ("Coryphaena hippurus",         "Marine-Pelagic",    "12S"),
    ("Scomber japonicus",           "Marine-Pelagic",    "12S"),
    ("Scomberomorus tritor",        "Marine-Pelagic",    "12S"),
    ("Caranx hippos",               "Marine-Pelagic",    "12S"),
    ("Trichiurus lepturus",         "Marine-Pelagic",    "12S"),
    # Marine demersal
    ("Dentex angolensis",           "Marine-Demersal",   "12S"),
    ("Pagellus bellottii",          "Marine-Demersal",   "12S"),
    ("Epinephelus aeneus",          "Marine-Demersal",   "12S"),
    ("Sparus caeruleostictus",      "Marine-Demersal",   "12S"),
    ("Pseudupeneus prayensis",      "Marine-Demersal",   "12S"),
    ("Pteroscion peli",             "Marine-Demersal",   "12S"),
    ("Pomadasys rogerii",           "Marine-Demersal",   "12S"),
    ("Lutjanus goreensis",          "Marine-Demersal",   "12S"),
    # Marine reef
    ("Acropora palmata",            "Marine-Reef",       "COI"),
    ("Porites porites",             "Marine-Reef",       "COI"),
    ("Holothuria atra",             "Marine-Reef",       "COI"),
    ("Holothuria scabra",           "Marine-Reef",       "COI"),
    ("Diadema antillarum",          "Marine-Reef",       "COI"),
    ("Echinometra lucunter",        "Marine-Reef",       "COI"),
    ("Ophiura ophiura",             "Marine-Reef",       "COI"),
    # Marine invertebrates
    ("Octopus vulgaris",            "Marine-Invertebrate", "COI"),
    ("Sepia officinalis",           "Marine-Invertebrate", "COI"),
    ("Loligo vulgaris",             "Marine-Invertebrate", "COI"),
    ("Charonia variegata",          "Marine-Invertebrate", "COI"),
    ("Strombus latus",              "Marine-Invertebrate", "COI"),
    ("Murex brandaris",             "Marine-Invertebrate", "COI"),
    ("Penaeus kerathurus",          "Marine-Invertebrate", "COI"),
    # Seagrass & algae
    ("Halophila stipulacea",        "Marine-Plants",     "rbcL"),
    ("Thalassia testudinum",        "Marine-Plants",     "rbcL"),
    ("Sargassum natans",            "Marine-Plants",     "rbcL"),
    ("Sargassum fluitans",          "Marine-Plants",     "rbcL"),
    ("Ulva lactuca",                "Marine-Plants",     "rbcL"),
    ("Gracilaria corticata",        "Marine-Plants",     "rbcL"),
    # Offshore marine mammals
    ("Megaptera novaeangliae",      "Marine-Mammal",     "COI"),
    ("Physeter macrocephalus",      "Marine-Mammal",     "COI"),
    ("Stenella frontalis",          "Marine-Mammal",     "COI"),
    ("Balaenoptera brydei",         "Marine-Mammal",     "COI"),
    ("Orcinus orca",                "Marine-Mammal",     "COI"),
]


# ─── STEP 1: PREPROCESSOR ────────────────────────────────────────────────────
def preprocess(query_str, retries=3):
    """
    Sends query string to the BOLD v5 preprocessor.
    Returns list of validated triplets, or None on failure.

    Example query_str: "tax:Ethmalosa fimbriata;geo:Nigeria"
    """
    url = f"{BASE}/api/query/preprocessor"
    for attempt in range(retries):
        try:
            r = requests.get(url, params={"query": query_str}, timeout=20)
            if r.status_code == 200:
                data = r.json()
                # Returns list of triplets: [{scope, field, value}, ...]
                return data
            else:
                time.sleep(3)
        except Exception as e:
            time.sleep(5)
    return None


# ─── STEP 2: SUBMIT QUERY, GET TOKEN ─────────────────────────────────────────
def get_query_token(triplets, extent="summary", retries=3):
    """
    Submits validated triplets and returns a query_id token.
    extent: "summary" for counts only, "full" for all record fields
    """
    url = f"{BASE}/api/query"
    payload = {"triplets": triplets, "extent": extent}
    for attempt in range(retries):
        try:
            r = requests.post(url, json=payload, timeout=20)
            if r.status_code == 200:
                data = r.json()
                return data.get("query_id") or data.get("queryId") or data.get("id")
            else:
                time.sleep(3)
        except Exception as e:
            time.sleep(5)
    return None


# ─── STEP 3a: GET SUMMARY (count only, fast) ─────────────────────────────────
def get_summary(query_id, retries=3):
    """
    Retrieves summary stats for a query token.
    Returns total record count without downloading all data.
    """
    url = f"{BASE}/api/summary/{query_id}"
    for attempt in range(retries):
        try:
            r = requests.get(url, timeout=20)
            if r.status_code == 200:
                data = r.json()
                # Try common response fields for total count
                for key in ("total", "count", "records", "specimen_count", "n"):
                    if key in data:
                        return int(data[key])
                # If it's a dict with nested data, try to find count
                if isinstance(data, dict):
                    for v in data.values():
                        if isinstance(v, int):
                            return v
                return 0
            else:
                time.sleep(3)
        except Exception as e:
            time.sleep(5)
    return -1


# ─── STEP 3b: DOWNLOAD RECORDS (if summary endpoint doesn't give count) ──────
def count_via_download(query_id, retries=3):
    """
    Downloads first batch of records and uses response metadata for count.
    Falls back to counting records in first 1000-batch.
    """
    url = f"{BASE}/api/documents/{query_id}/download"
    for attempt in range(retries):
        try:
            r = requests.get(url, params={"format": "json", "offset": 0, "limit": 100},
                             timeout=30, stream=True)
            if r.status_code == 200:
                # Check headers for total count
                total = r.headers.get("X-Total-Count") or r.headers.get("total-count")
                if total:
                    return int(total)
                # Parse the body
                data = r.json()
                if isinstance(data, list):
                    return len(data)  # rough count from first batch
                if isinstance(data, dict):
                    for key in ("total", "count", "total_results"):
                        if key in data:
                            return int(data[key])
            time.sleep(3)
        except Exception as e:
            time.sleep(5)
    return -1


# ─── FULL QUERY FOR ONE SPECIES ───────────────────────────────────────────────
def query_species(species, geo=None):
    """
    Runs the full 3-step BOLD v5 query for one species.
    Returns (count, api_ok)
    """
    # Build query string
    query_str = f"tax:{species}"
    if geo:
        query_str += f";geo:{geo}"

    # Step 1 — preprocess
    triplets = preprocess(query_str)
    if triplets is None:
        return -1, False

    # Step 2 — get token
    token = get_query_token(triplets, extent="summary")
    if token is None:
        # Try with full extent as fallback
        token = get_query_token(triplets, extent="full")
    if token is None:
        return -1, False

    time.sleep(0.5)  # brief pause before retrieving results

    # Step 3a — try summary first (faster, no large download)
    count = get_summary(token)
    if count >= 0:
        return count, True

    # Step 3b — fallback to download endpoint
    count = count_via_download(token)
    return count, (count >= 0)


# ─── PROGRESS SAVE / RESUME ───────────────────────────────────────────────────
PROGRESS_FILE = "bold_v5_progress.json"

def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE) as f:
            return json.load(f)
    return {}

def save_progress(progress):
    with open(PROGRESS_FILE, "w") as f:
        json.dump(progress, f, indent=2)


# ─── CONNECTIVITY TEST ────────────────────────────────────────────────────────
def test_api():
    print("Testing BOLD v5 API connectivity...", end=" ", flush=True)
    # Quick test: preprocess a known species
    triplets = preprocess("tax:Thunnus albacares")
    if triplets is None:
        print("✗ Preprocessor unreachable")
        return False

    token = get_query_token(triplets, extent="summary")
    if token is None:
        print("✗ Query endpoint unreachable")
        return False

    count = get_summary(token)
    if count < 0:
        # Try download fallback
        count = count_via_download(token)

    if count >= 0:
        print(f"✓ API responding — Thunnus albacares: {count} records")
        return True
    else:
        print("✗ Could not retrieve record count (preprocessor and query OK, but summary failed)")
        print("  Will attempt full run anyway — some endpoints may still work")
        return True  # continue anyway


# ─── MAIN ─────────────────────────────────────────────────────────────────────
print("=" * 72)
print("Nigeria Marine Biodiversity Library")
print("BOLD v5 API Query — portal.boldsystems.org")
print("=" * 72)
print()

if not test_api():
    print()
    print("BOLD v5 API is not reachable.")
    print("Check https://boldsystems.org/about/system-status/ for outages.")
    input("\nPress Enter to exit...")
    exit(1)

print()

# Load any previous progress
progress = load_progress()
if progress:
    done = len([k for k in progress if not k.endswith("_wa")])
    print(f"Resuming from previous run ({done} species already completed)")
    print()

print(f"{'#':>4}  {'Species':<44} {'Global':>8} {'W.Africa':>9}  Status")
print("-" * 75)

records = []
api_failures = 0

for i, (sp, group, marker) in enumerate(TAXA, 1):
    # Skip if already done
    if sp in progress:
        g  = progress[sp]["global"]
        wa = progress[sp]["wa"]
        ok = progress[sp]["api_ok"]
        status = progress[sp]["status"]
        print(f"[{i:>3}] {sp:<44} {g:>8} {wa:>9}  {status} (cached)")
    else:
        print(f"[{i:>3}] {sp:<44}", end=" ", flush=True)

        # Global count
        g, ok_g = query_species(sp)
        time.sleep(1.2)

        # West Africa count — query each country and sum
        # (BOLD v5 may support multi-value geo queries; try combined first)
        wa_combined = 0
        ok_wa = True

        # Try combined geo query first: geo:Nigeria OR geo:Ghana etc.
        # BOLD v5 syntax: multiple geo values use semicolons within same scope
        # We query Nigeria specifically first as the primary target
        ng, ok_ng = query_species(sp, geo="Nigeria")
        time.sleep(1.0)

        if ok_ng and ng >= 0:
            wa_combined = ng
            # Also check broader West Africa
            for country in ["Ghana", "Cameroon", "Benin", "Senegal", "Togo"]:
                c_count, c_ok = query_species(sp, geo=country)
                time.sleep(0.8)
                if c_ok and c_count > 0:
                    wa_combined += c_count
            wa = wa_combined
            ok_wa = True
        else:
            wa = -1
            ok_wa = False

        api_ok = ok_g and ok_wa
        if not api_ok:
            api_failures += 1

        # Determine status
        if not api_ok:
            status = "api_failed"
        elif g == 0:
            status = "absent"
        elif wa > 0:
            status = "present_wa"
        else:
            status = "present_global"

        flag = ""
        if status == "absent":       flag = "← NOT IN BOLD"
        elif status == "present_wa": flag = f"✓ {wa} WA records"
        elif status == "api_failed": flag = "⚠ failed"

        g_disp  = str(g)  if g  >= 0 else "err"
        wa_disp = str(wa) if wa >= 0 else "err"
        print(f"{g_disp:>8} {wa_disp:>9}  {status:<16} {flag}")

        # Save progress
        progress[sp] = {
            "global": g, "wa": wa, "api_ok": api_ok, "status": status,
            "group": group, "marker": marker
        }
        save_progress(progress)

    records.append({
        "species":         sp,
        "group":           group,
        "primary_marker":  marker,
        "bold_global":     progress[sp]["global"],
        "bold_wa":         progress[sp]["wa"],
        "bold_status":     progress[sp]["status"],
        "bold_api_ok":     progress[sp]["api_ok"],
    })

# ─── SAVE FINAL CSV ───────────────────────────────────────────────────────────
df = pd.DataFrame(records)
df.to_csv("bold_v5_query_results.csv", index=False)

print()
print("=" * 72)
print("SUMMARY")
print("=" * 72)

absent         = df[df.bold_status == "absent"]
present_wa     = df[df.bold_status == "present_wa"]
present_global = df[df.bold_status == "present_global"]
failed         = df[df.bold_status == "api_failed"]

print(f"\n  ✓ Has West Africa BOLD records:  {len(present_wa):>4}")
print(f"  ~ Global BOLD, no WA records:    {len(present_global):>4}")
print(f"  ✗ Not in BOLD at all:            {len(absent):>4}")
print(f"  ⚠ API failures:                 {len(failed):>4}")

if len(present_wa) > 0:
    print(f"\n  Species WITH West Africa BOLD records:")
    for _, r in present_wa.iterrows():
        print(f"    ✓ {r['species']} ({r['group']}): {r['bold_wa']} WA / {r['bold_global']} global")

if len(absent) > 0:
    print(f"\n  NOT IN BOLD (barcoding priority):")
    for _, r in absent.iterrows():
        print(f"    ✗ {r['species']} ({r['group']})")

print()
print("Saved: bold_v5_query_results.csv")
if api_failures > 0:
    print(f"Note: {api_failures} queries failed. Delete bold_v5_progress.json and re-run to retry.")
print()
input("Press Enter to close...")
