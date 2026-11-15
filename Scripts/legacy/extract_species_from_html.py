import re
import json
from pathlib import Path

# HTML file name
html_file = "nigeria_reflib_dashboard_v4.html"

# Output JSON file
output_file = "species_database_from_html.json"

# Read HTML
with open(html_file, "r", encoding="utf-8") as f:
    html = f.read()

# Pattern to capture species entries like:
# name:"Ethmalosa fimbriata"
name_pattern = r'name\s*:\s*"([^"]+)"'

# common name
common_pattern = r'common\s*:\s*"([^"]+)"'

# group
group_pattern = r'group\s*:\s*"([^"]+)"'

# find all matches
names = re.findall(name_pattern, html)
commons = re.findall(common_pattern, html)
groups = re.findall(group_pattern, html)

species_list = []

for i, name in enumerate(names):

    species = {
        "id": i + 1,
        "scientific_name": name,
        "common_name": commons[i] if i < len(commons) else "",
        "group": groups[i] if i < len(groups) else "",
        "iucn_status": "",
        "ncbi_accession": "",
        "bold_id": "",
        "sequence_available": False,
        "habitat": "",
        "location": "",
        "image": ""
    }

    species_list.append(species)

# Save JSON
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(species_list, f, indent=4)

print("Extraction complete.")
print(f"Total species extracted: {len(species_list)}")
print(f"Saved to: {output_file}")