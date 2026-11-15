import re

input_file = "nigeria_reflib_dashboard_meiofauna_tab_fixed.html"
output_file = "nigeria_reflib_dashboard_meiofauna_tab_FIXED_EDITED.html"

with open(input_file, "r", encoding="utf-8") as f:
html = f.read()

# ------------------------------------------------

# 1. Remove NeMys citation section

# ------------------------------------------------

pattern = r'<div class="section-head">Citing NeMys — World Database of Nematodes</div>.*?</div>\s*</div>'
html = re.sub(pattern, '', html, flags=re.DOTALL)

# ------------------------------------------------

# 2. Add nematodes to meiofauna dataset

# ------------------------------------------------

nematode_entry = '''
{name:"Nematoda",
common:"Free-living nematodes",
group:"Meiofauna",
marker:"18S",
ncbi:"partial",
bold:"absent",
priority:"high",
notes:"Dominant meiofauna; see Nematodes tab"},
'''

html = html.replace(
'const MEIOFAUNA_OTHER = [',
'const MEIOFAUNA_OTHER = [' + nematode_entry
)

# ------------------------------------------------

# Save edited file

# ------------------------------------------------

with open(output_file, "w", encoding="utf-8") as f:
f.write(html)

print("✔ Edited file saved as:", output_file)
