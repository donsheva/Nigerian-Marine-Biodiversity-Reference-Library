#!/usr/bin/env python3
"""
Convert nigeria_reflib_dashboard_v13.html into a multi-page static website.
Run from the Web/ directory: python build_site.py
"""
import re, os

SRC = "nigeria_reflib_dashboard_v13.html"
with open(SRC, "r", encoding="utf-8") as f:
    html = f.read()
    lines = html.split("\n")

# ── 1. EXTRACT CSS ──────────────────────────────────────────────────────
css_main = "\n".join(lines[22:331])
css_footer = "\n".join(lines[3411:3419])
css_extra = """
@keyframes gradientSlide { 0% { background-position: 0% } 100% { background-position: 300% } }
@keyframes gradientFlow { 0% { background-position: 0% } 50% { background-position: 100% } 100% { background-position: 0% } }
.site-nav-btn.nav-pg-active { color: var(--blue) !important; font-weight: 600 !important; border-bottom: 3px solid var(--blue) !important; }
a.site-nav-btn { text-decoration: none; }
"""
os.makedirs("css", exist_ok=True)
with open("css/styles.css", "w", encoding="utf-8") as f:
    f.write(f"/* Nigeria Marine Biodiversity Library — Styles */\n\n{css_main}\n{css_extra}\n/* Footer */\n{css_footer}\n")
print("  css/styles.css")

# ── 2. EXTRACT JS ───────────────────────────────────────────────────────
js_main = "\n".join(lines[1274:2459])  # Main data + functions
js_backtop = "\n".join(lines[3396:3408])
js_subscribe = "\n".join(lines[3460:3467])

# Fix old init code: remove direct calls, switchPage, old DOMContentLoaded
js_main = js_main.replace(
    '<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script><script>',
    ''
)
# Remove Cloudflare email obfuscation in JS
js_main = re.sub(
    r'<a href="/cdn-cgi/l/email-protection"[^>]*>\[email&#160;protected\]</a>',
    'you@email.com', js_main
)

# Replace direct init calls with conditional init
old_init = """SEARCH_INDEX = buildSearchIndex();
updateStats();
renderGroups();
renderGapLists();
renderTable();
renderMarineTable();
renderFishTable();
renderMacroTable();
renderNemaTable();"""
js_main = js_main.replace(old_init, "// Init moved to DOMContentLoaded below")

# Replace old citation init
js_main = re.sub(
    r"const _citeEl = document\.getElementById\('cite-date'\);.*?if \(_yearEl\) _yearEl\.textContent = _now\.getFullYear\(\);",
    "// Citation init moved to DOMContentLoaded below",
    js_main, flags=re.DOTALL
)

# Replace switchPage with redirect version
old_switchPage = re.search(r'function switchPage\(page\) \{.*?window\.scrollTo\(\{ top: 0, behavior: .smooth. \}\);\s*\}', js_main, re.DOTALL)
if old_switchPage:
    js_main = js_main.replace(old_switchPage.group(0), """function switchPage(page) {
  var pageMap = { 'home':'gap-analysis.html','database':'index.html','statistics':'statistics.html',
    'citations':'citations.html','gallery':'gallery.html','resources':'resources.html',
    'contact':'contact.html','about':'about.html' };
  window.location.href = pageMap[page] || 'index.html';
}""")

# Replace old DOMContentLoaded
js_main = re.sub(
    r"document\.addEventListener\('DOMContentLoaded', function\(\) \{\s*document\.getElementById\('nav-database'\).*?switchPage\('database'\);\s*\}\);",
    "// Old init removed — replaced by multi-page init below",
    js_main, flags=re.DOTALL
)

# Update switchTab to handle cross-page navigation
old_switchTab = """function switchTab(id) {
  const ids=["gap","species","marine","fish","macrobenthos","nematodes","python","workflow"]; // dashboard tabs
  document.querySelectorAll(".tab").forEach((t,i)=>t.classList.toggle("active",ids[i]===id));
  document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
  document.getElementById("tab-"+id).classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
}"""
new_switchTab = """function switchTab(id) {
  if (document.body.getAttribute('data-page') !== 'home') {
    window.location.href = 'gap-analysis.html?tab=' + id;
    return;
  }
  const ids=["gap","species","marine","fish","macrobenthos","nematodes","python","workflow"];
  document.querySelectorAll(".tab").forEach((t,i)=>t.classList.toggle("active",ids[i]===id));
  document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
  var panel = document.getElementById("tab-"+id);
  if (panel) panel.classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
}"""
js_main = js_main.replace(old_switchTab, new_switchTab)

# Add cross-page goToTaxa support
old_goToTaxa = "function goToTaxa(group, status) {\n  // Set filters"
new_goToTaxa = """function goToTaxa(group, status) {
  if (document.body.getAttribute('data-page') !== 'home') {
    window.location.href = 'gap-analysis.html?tab=species&group=' + encodeURIComponent(group) + '&status=' + encodeURIComponent(status);
    return;
  }
  // Set filters"""
js_main = js_main.replace(old_goToTaxa, new_goToTaxa)

# Multi-page init
js_init = """
// ── MULTI-PAGE INITIALIZATION ──
document.addEventListener('DOMContentLoaded', function() {
  var page = document.body.getAttribute('data-page') || 'database';
  var navBtn = document.getElementById('nav-' + page);
  if (navBtn) navBtn.classList.add('nav-pg-active');
  if (typeof buildSearchIndex === 'function') { try { SEARCH_INDEX = buildSearchIndex(); } catch(e){} }
  if (page === 'home') {
    if (typeof updateStats === 'function') updateStats();
    if (typeof renderGroups === 'function') renderGroups();
    if (typeof renderGapLists === 'function') renderGapLists();
    if (typeof renderTable === 'function') renderTable();
    if (typeof renderMarineTable === 'function') renderMarineTable();
    if (typeof renderFishTable === 'function') renderFishTable();
    if (typeof renderMacroTable === 'function') renderMacroTable();
    if (typeof renderNemaTable === 'function') renderNemaTable();
    var urlParams = new URLSearchParams(window.location.search);
    var tabParam = urlParams.get('tab');
    if (tabParam) switchTab(tabParam);
  }
  if (page === 'database' && typeof populateDbStats === 'function') populateDbStats();
  if (page === 'statistics' && typeof populateStatsPage === 'function') populateStatsPage();
  if (page === 'citations') {
    var n=new Date(), ms=['January','February','March','April','May','June','July','August','September','October','November','December'];
    var d=ms[n.getMonth()]+' '+n.getDate()+', '+n.getFullYear();
    var e1=document.getElementById('cite-date-pg'), e2=document.getElementById('cite-year-pg');
    if(e1) e1.textContent=d; if(e2) e2.textContent=n.getFullYear();
  }
});
"""

os.makedirs("js", exist_ok=True)
with open("js/main.js", "w", encoding="utf-8") as f:
    f.write(f"/* Nigeria Marine Biodiversity Library — Main JS */\n\n{js_main}\n\n{js_backtop}\n\n{js_subscribe}\n{js_init}")
print("  js/main.js")

# ── 3. SHARED HTML COMPONENTS ───────────────────────────────────────────
def get_head(title, desc):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="{desc}">
<meta name="author" content="Adelodun Odedere, NIOMR">
<meta name="keywords" content="eDNA, metabarcoding, Nigeria, Gulf of Guinea, marine biodiversity, NIOMR, Niger Delta, Lagos Lagoon, reference library, barcoding">
<meta property="og:title" content="{title}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://envirobiotics.org">
<meta name="theme-color" content="#0d6efd">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧬</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/styles.css">
<title>{title}</title>
</head>"""

# Extract header HTML (lines 337-434)
header_start = html.find('<!-- ═══ SITE HEADER')
header_end = html.find('<!-- ═══ SITE NAVIGATION')
site_header = html[header_start:header_end].strip()
site_header = re.sub(r'<style>@keyframes gradient\w+.*?</style>', '', site_header)

# Navigation with real links
nav = """
<nav class="site-nav"><div class="site-nav-inner">
  <div class="site-nav-group"><a class="site-nav-btn" id="nav-database" href="index.html">Overview</a></div>
  <div class="site-nav-group"><a class="site-nav-btn" id="nav-home" href="gap-analysis.html">Gap Analysis</a></div>
  <div class="site-nav-group"><a class="site-nav-btn" id="nav-statistics" href="statistics.html">Statistics</a></div>
  <div class="site-nav-group"><a class="site-nav-btn" id="nav-citations" href="citations.html">Citations</a></div>
  <div class="site-nav-group"><a class="site-nav-btn" id="nav-gallery" href="gallery.html">Media Gallery</a></div>
  <div class="site-nav-group"><a class="site-nav-btn" id="nav-resources" href="resources.html">Resources</a></div>
  <div class="site-nav-group"><a class="site-nav-btn" id="nav-contact" href="contact.html">Contact &amp; Collaboration</a></div>
  <div class="site-nav-group"><a class="site-nav-btn" id="nav-about" href="about.html">About</a></div>
</div></nav>"""

# Reference databases bar
refdb_start = html.find('<!-- ═══ REFERENCE DATABASES BAR')
refdb_end = html.find('<!-- ═══ SPECIES POPUP CARD')
refdb = html[refdb_start:refdb_end].strip()

# Popup overlay
popup_start = html.find('<!-- ═══ SPECIES POPUP CARD')
popup_end = html.find('<div class="container" id="main-content">')
popup = html[popup_start:popup_end].strip()

# Footer
footer_start = html.find('<!-- FOOTER -->')
footer_end = html.find('</footer>') + len('</footer>')
footer = html[footer_start:footer_end]
footer = re.sub(r'<style>.*?</style>', '', footer, flags=re.DOTALL)
footer = re.sub(r'<script data-cfasync="false"[^>]*></script>', '', footer)
footer = re.sub(r'<a href="/cdn-cgi/l/email-protection[^"]*"[^>]*>Bank Transfer</a>',
    '<a href="mailto:odedereao@niomr.gov.ng" style="display:inline-block;padding:8px 16px;background:rgba(255,255,255,0.1);color:#fff;border-radius:6px;font-weight:600;font-size:13px;text-decoration:none;border:1px solid rgba(255,255,255,0.2);">Bank Transfer</a>',
    footer)

def fix_emails(content):
    content = re.sub(r'<a href="/cdn-cgi/l/email-protection[^"]*"[^>]*><span class="__cf_email__"[^>]*>\[email&#160;protected\]</span></a>',
        '<a href="mailto:odedereao@niomr.gov.ng" style="color:var(--blue);">odedereao@niomr.gov.ng</a>', content)
    content = re.sub(r'<span class="__cf_email__"[^>]*>\[email&#160;protected\]</span>', 'odedereao@niomr.gov.ng', content)
    content = re.sub(r'href="/cdn-cgi/l/email-protection[^"]*"', 'href="mailto:odedereao@niomr.gov.ng"', content)
    content = re.sub(r'<a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="[^"]*">\[email&#160;protected\]</a>', 'you@email.com', content)
    return content

# ── 4. EXTRACT PAGE SECTIONS ────────────────────────────────────────────
def extract_section(section_id):
    pattern = f'<div id="{section_id}" class="page-section container">'
    start = html.find(pattern)
    if start == -1:
        start = html.find(f'<div id="{section_id}" class="page-section')
    if start == -1:
        return f"<!-- Section {section_id} not found -->"
    depth = 0
    i = start
    while i < len(html):
        if html[i:i+4] == '<div': depth += 1
        elif html[i:i+6] == '</div>':
            depth -= 1
            if depth == 0:
                content = html[start:i+6]
                content = content.replace('class="page-section container"', 'class="container"', 1)
                return content
        i += 1
    return f"<!-- Section {section_id} failed -->"

# Dashboard content
dash_start = html.find('<div class="container" id="main-content">')
depth = 0
i = dash_start
while i < len(html):
    if html[i:i+4] == '<div': depth += 1
    elif html[i:i+6] == '</div>':
        depth -= 1
        if depth == 0:
            dashboard = html[dash_start:i+6]
            break
    i += 1

# ── 5. BUILD PAGES ─────────────────────────────────────────────────────
def build_page(filename, page_id, title, desc, content):
    content = fix_emails(content)
    content = content.replace("switchPage('contact')", "window.location.href='contact.html'")
    content = content.replace("switchPage('home')", "window.location.href='gap-analysis.html'")
    content = re.sub(r"""<button class="submit-btn" onclick="switchPage\('home'\)">([^<]*)</button>""",
        r'<a class="submit-btn" href="gap-analysis.html" style="display:inline-block;text-decoration:none;">\1</a>', content)
    page = f"""{get_head(title, desc)}
<body data-page="{page_id}">
<a href="#main-content" class="skip-link">Skip to main content</a>
{site_header}
{nav}
{refdb}
{popup}
<div id="main-content">
{content}
</div>
{footer}
<script src="js/main.js"></script>
</body>
</html>"""
    with open(filename, "w", encoding="utf-8") as f:
        f.write(page)
    print(f"  {filename}")

pages = [
    ("gap-analysis.html", "home", "Gap Analysis — NMBL", "eDNA gap analysis dashboard for the Gulf of Guinea.", dashboard),
    ("index.html", "database", "Nigeria Marine Biodiversity Library", "eDNA reference library for the Gulf of Guinea.", extract_section("page-database")),
    ("about.html", "about", "About — NMBL", "About the Nigeria Marine Biodiversity Reference Library.", extract_section("page-about")),
    ("statistics.html", "statistics", "Statistics — NMBL", "Coverage statistics for Nigerian marine taxa.", extract_section("page-statistics")),
    ("citations.html", "citations", "Citations — NMBL", "How to cite the Nigeria Marine Biodiversity Library.", extract_section("page-citations")),
    ("gallery.html", "gallery", "Media Gallery — NMBL", "Voucher photographs and field documentation.", extract_section("page-gallery")),
    ("resources.html", "resources", "Resources — NMBL", "Reference databases, tools, and policy links.", extract_section("page-resources")),
    ("contact.html", "contact", "Contact — NMBL", "Contact and collaboration information.", extract_section("page-contact")),
]

print("\nBuilding site:")
for args in pages:
    build_page(*args)

print("\n✅ Done! Files ready to deploy.")
print("   Next: git add . && git commit -m 'Convert to multi-page site' && git push -u origin claude/html-to-website-Tcz0z")
