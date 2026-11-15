from bs4 import BeautifulSoup
import re

INPUT_FILE = "nigeria_reflib_dashboard_v4.html"
OUTPUT_FILE = "nigeria_reflib_dashboard_v5.html"

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")


# -----------------------------
# 1. REMOVE NIOMR HEADER TEXT
# -----------------------------
for a in soup.find_all("a", href=True):
    if "niomr.gov.ng" in a["href"]:
        parent = a.find_parent("div")
        if parent:
            parent.decompose()


# -----------------------------
# 2. REMOVE NEMYS CITATION BLOCK
# -----------------------------
nemys_text = "Nemys: World Database of Nematodes"
for tag in soup.find_all(text=re.compile("Nemys")):
    parent = tag.find_parent()
    if parent:
        parent.decompose()


# -----------------------------
# 3. ADD IUCN COLUMN
# -----------------------------
for table in soup.find_all("table"):
    thead = table.find("thead")
    if thead:
        header_row = thead.find("tr")
        if header_row:
            new_th = soup.new_tag("th")
            new_th.string = "Conservation"
            header_row.append(new_th)


# -----------------------------
# 4. ADD CSS FOR IUCN COLORS
# -----------------------------
style = soup.find("style")

style.append("""
.badge.iucn-lc {background:#E1F5EE;color:#0F6E56;}
.badge.iucn-nt {background:#E6F1FB;color:#185FA5;}
.badge.iucn-vu {background:#FAEEDA;color:#854F0B;}
.badge.iucn-en {background:#FCEBEB;color:#A32D2D;}
.badge.iucn-cr {background:#7A0000;color:#fff;}
""")


# -----------------------------
# 5. ADD PROJECT DESCRIPTION
# -----------------------------
hero = soup.find(class_="site-subtitle")
if hero:
    new_p = soup.new_tag("div")
    new_p.string = ("A major limitation of environmental DNA (eDNA) metabarcoding in West Africa "
                    "is the lack of regionally representative reference sequences for coastal biodiversity...")
    hero.insert_after(new_p)


# -----------------------------
# 6. ADD DONATE BUTTON
# -----------------------------
header = soup.find(class_="site-badge-block")

donate_btn = soup.new_tag("button")
donate_btn.string = "Support / Donate"
donate_btn["style"] = "padding:6px 12px;border-radius:6px;background:#185FA5;color:white;border:none;cursor:pointer;"

header.append(donate_btn)


# -----------------------------
# 7. ADD NEWSLETTER INPUT
# -----------------------------
footer = soup.body

newsletter = soup.new_tag("div")
newsletter.string = "Subscribe to our mailing list (coming soon)"

footer.append(newsletter)


# -----------------------------
# 8. CENTER TABLE CONTENT
# -----------------------------
style.append("""
td, th {
  text-align: center !important;
}
""")


# -----------------------------
# 9. SAVE FILE
# -----------------------------
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write(str(soup))

print("✅ Updated HTML saved as:", OUTPUT_FILE)