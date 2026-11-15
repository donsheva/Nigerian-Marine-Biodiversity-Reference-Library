import re
import json
from pathlib import Path

# -------- SETTINGS --------
HTML_FILE = "nigeria_reflib_dashboard_v4.html"
OUTPUT_FILE = "species_database_from_html.json"

# -------- READ HTML --------
print("Reading HTML file...")

with open(HTML_FILE, "r", encoding="utf-8") as f:
    html = f.read()

# -------- REGEX PATTERNS --------

name_pattern = r'name\s*:\s*"([^"]+)"'
common_pattern = r'common\s*:\s*"([^"]*)"'
group_pattern = r'group\s*:\s*"([^"]*)"'
marker_pattern = r'marker\s*:\s*"([^"]*)"'
priority_pattern = r'priority\s*:\s*"([^"]*)"'
notes_pattern = r'notes\s*:\s*"([^"]*)"'

names = re.findall(name_pattern, html)
commons = re.findall(common_pattern, html)
groups = re.findall(group_pattern, html)
markers = re.findall(marker_pattern, html)
priorities = re.findall(priority_pattern, html)
notes = re.findall(notes_pattern, html)

species_list = []

print("Extracting species...")

for i, name in enumerate(names):

    species = {
        "id": i + 1,
        "scientific_name": name,
        "common_name": commons[i] if i < len(commons) else "",
        "group": groups[i] if i < len(groups) else "",
        "marker": markers[i] if i < len(markers) else "",
        "priority": priorities[i] if i < len(priorities) else "",
        "notes": notes[i] if i < len(notes) else "",

        "iucn_status": "",
        "ncbi_accession": "",
        "bold_id": "",
        "sequence_available": False,
        "location": "",
        "habitat": "",
        "image": ""
    }

    species_list.append(species)

# -------- SAVE DATABASE --------

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(species_list, f, indent=4)

print("\nExtraction complete.")
print("Species found:", len(species_list))
print("Database saved as:", OUTPUT_FILE)