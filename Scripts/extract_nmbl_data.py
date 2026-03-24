"""
extract_nmbl_data.py
--------------------
Extracts all species/taxa data from the Nigeria Marine Biodiversity
Library dashboard HTML and saves it as:
  - nmbl_data.json      (all arrays, structured)
  - nmbl_all_taxa.csv   (flat table, one row per taxon)

Run:  python extract_nmbl_data.py

Requirements:  pip install beautifulsoup4
"""

import json
import re
import csv
import sys
from pathlib import Path

# ── CONFIG ─────────────────────────────────────────────────────────────────
HTML_FILE = "nigeria_reflib_dashboard_v11.html"   # change to whichever version you use
OUT_JSON  = "nmbl_data.json"
OUT_CSV   = "nmbl_all_taxa.csv"

# ── HELPERS ─────────────────────────────────────────────────────────────────

def extract_js_array(source: str, var_name: str) -> list[dict]:
    """
    Pull a JavaScript const ARRAY_NAME = [...] block from source
    and parse it with Python's json module.
    Handles trailing commas (common in hand-written JS objects).
    """
    # Grab the full const declaration
    pattern = rf'const\s+{var_name}\s*=\s*(\[.*?\n\];)'
    match = re.search(pattern, source, re.DOTALL)
    if not match:
        print(f"  [WARNING] Could not find array: {var_name}")
        return []

    raw = match.group(1)

    # Strip out JS template literals / comments that break JSON
    raw = re.sub(r'//.*', '', raw)                     # line comments
    raw = re.sub(r'/\*.*?\*/', '', raw, flags=re.DOTALL)  # block comments

    # Convert JS object keys  key:  →  "key":
    raw = re.sub(r'(\{|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":', raw)

    # Remove trailing commas before } or ]
    raw = re.sub(r',\s*([}\]])', r'\1', raw)

    # Remove the trailing semicolon
    raw = raw.rstrip().rstrip(';')

    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"  [WARNING] JSON parse error in {var_name}: {e}")
        return []


# ── MAIN ────────────────────────────────────────────────────────────────────

def main():
    html_path = Path(HTML_FILE)
    if not html_path.exists():
        # Try other versions
        for v in ["nigeria_reflib_dashboard_v8.html",
                  "nigeria_reflib_dashboard_v5.html",
                  "nigeria_reflib_dashboard_v4.html"]:
            if Path(v).exists():
                html_path = Path(v)
                print(f"Using: {html_path}")
                break
        else:
            print(f"ERROR: Could not find dashboard HTML file.")
            print("Place this script in the same folder as the HTML and try again.")
            sys.exit(1)

    print(f"Reading: {html_path}")
    source = html_path.read_text(encoding="utf-8")

    # ── Extract each data array ─────────────────────────────────────────────
    arrays = {
        "VERTEBRATES":    extract_js_array(source, "VERTEBRATES"),
        "MEIOFAUNA_OTHER": extract_js_array(source, "MEIOFAUNA_OTHER"),
        "NEMATODES":      extract_js_array(source, "NEMATODES"),
        "MACROBENTHOS":   extract_js_array(source, "MACROBENTHOS"),
        "MARINE":         extract_js_array(source, "MARINE"),
    }

    for name, data in arrays.items():
        print(f"  {name:20s}: {len(data):4d} records")

    # ── Save JSON ───────────────────────────────────────────────────────────
    print(f"\nWriting {OUT_JSON} ...")
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(arrays, f, indent=2, ensure_ascii=False)
    print(f"  Saved: {OUT_JSON}")

    # ── Build flat CSV ──────────────────────────────────────────────────────
    print(f"Writing {OUT_CSV} ...")

    rows = []

    def status(ncbi, bold):
        if ncbi == "absent" and bold == "absent":   return "absent"
        if ncbi == "present" and bold == "present": return "present"
        return "partial"

    # Vertebrates + Meiofauna + Marine + Macrobenthos  (same schema)
    for section, arr in [
        ("vertebrate",   arrays["VERTEBRATES"]),
        ("meiofauna",    arrays["MEIOFAUNA_OTHER"]),
        ("marine",       arrays["MARINE"]),
        ("macrobenthos", arrays["MACROBENTHOS"]),
    ]:
        for s in arr:
            ncbi = s.get("ncbi", "")
            bold = s.get("bold", s.get("bold_silva", ""))
            rows.append({
                "section":        section,
                "name":           s.get("name", ""),
                "common":         s.get("common", ""),
                "group":          s.get("group", ""),
                "marker":         s.get("marker", ""),
                "ncbi":           ncbi,
                "bold_silva":     bold,
                "overall_status": status(ncbi, bold),
                "priority":       s.get("priority", ""),
                "iucn":           s.get("iucn", ""),
                "habitat":        s.get("habitat", ""),
                "location":       s.get("location", ""),
                "notes":          s.get("notes", ""),
                # nematode-specific cols (empty for non-nematodes)
                "genus":          "",
                "order":          "",
                "pollution_response": "",
                "global_18S":     "",
                "wa_18S":         "",
                "ng_18S":         "",
                "global_28S":     "",
                "ng_28S":         "",
            })

    # Nematodes (different schema)
    for n in arrays["NEMATODES"]:
        ng18 = n.get("ng18s", 0)
        g18  = n.get("global18s", 0)
        ncbi_est = "present" if ng18 > 0 else ("partial" if g18 > 0 else "absent")
        wa18     = n.get("wa18s", 0)
        bold_est = "partial" if wa18 > 0 else "absent"
        rows.append({
            "section":        "nematode",
            "name":           n.get("genus", ""),
            "common":         (n.get("role", "").split(";")[0].strip()),
            "group":          "Nematode",
            "marker":         "18S",
            "ncbi":           ncbi_est,
            "bold_silva":     bold_est,
            "overall_status": status(ncbi_est, bold_est),
            "priority":       "high" if (ng18 == 0 and g18 > 0) else ("high" if g18 == 0 else "med"),
            "iucn":           "",
            "habitat":        "Sediment",
            "location":       "",
            "notes":          n.get("role", ""),
            "genus":          n.get("genus", ""),
            "order":          n.get("order", ""),
            "pollution_response": n.get("response", ""),
            "global_18S":     g18,
            "wa_18S":         wa18,
            "ng_18S":         ng18,
            "global_28S":     n.get("global28s", ""),
            "ng_28S":         n.get("ng28s", ""),
        })

    # Write CSV
    if rows:
        fields = list(rows[0].keys())
        with open(OUT_CSV, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=fields)
            w.writeheader()
            w.writerows(rows)
        print(f"  Saved: {OUT_CSV}  ({len(rows)} rows)")

    # ── Summary ─────────────────────────────────────────────────────────────
    total   = len(rows)
    absent  = sum(1 for r in rows if r["overall_status"] == "absent")
    present = sum(1 for r in rows if r["overall_status"] == "present")
    print(f"\nSummary: {total} total taxa — {present} have sequences, {absent} are priority gaps")
    print("\nDone. Files ready for your other projects:")
    print(f"  {OUT_JSON}     → import into any JS, Python, or web project")
    print(f"  {OUT_CSV}      → import into Excel, R, Pandas, or a database")


if __name__ == "__main__":
    main()
