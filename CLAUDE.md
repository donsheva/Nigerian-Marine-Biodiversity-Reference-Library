# EnviroBiotics.org — Multi-Page Site Conversion Brief

**For:** Claude Code (terminal agent)
**From:** Adelodun Odedere, NMBL principal investigator
**Source:** `nigeria_reflib_dashboard_v20.html` (313KB single-file dashboard)
**Target:** Multi-page static site at envirobiotics.org, hosted on GitHub Pages
**Repository:** `github.com/donsheva/Nigerian-Marine-Biodiversity-Reference-Library`
**Domain registrar:** Porkbun

---

## 1 · Goal in one sentence

Split the v20 single-file dashboard into a multi-page static site where each top-nav tab becomes its own URL (`/`, `/database/`, `/gap-analysis/`, `/statistics/`, `/citations/`, `/gallery/`, `/resources/`, `/contact/`, `/about/`), so individual pages are linkable, indexable, and shareable — without breaking any of the existing interactive Gap Analysis, Statistics, search, or popup behaviour.

---

## 2 · Non-negotiables

These cannot regress during the split. If a change risks any of these, stop and ask.

1. **All 132 taxa data arrays** (`VERTEBRATES`, `MEIOFAUNA_OTHER`, `NEMATODES`, `MACROBENTHOS`, `MARINE`, `ALL_TAXA`) must be loaded on every page where the global search bar appears (effectively every page). They live in one shared `data.js` so there is one source of truth.
2. **The global search dropdown** in the header must work site-wide and route to the species' "home" page (Gap Analysis / Marine / Macrobenthos / Nematodes / etc.) when a result is clicked.
3. **The classification logic** (`overallStatus`, `ncbiEffectiveStatus`, the 50% West African threshold) must remain intact and shared across pages — never duplicated.
4. **The v20 design system** — Sora / DM Sans / DM Mono fonts, the navy-and-blue colour palette, all CSS variables (`--bg`, `--blue`, `--green-bg`, etc.), the shadow system, the badges — must be preserved exactly. Extract to one shared `styles.css`.
5. **Single-source for the header, footer, and site nav.** These three components must be defined in one place and included on every page (server-side include is not available on Pages, so use a small JS shim or a build step — see §6).
6. **No build pipeline required.** The site must work as plain HTML/CSS/JS that GitHub Pages can serve directly. No Webpack, no Vite, no React. (A small build script in `tools/` is acceptable if it just copies the shared partials at commit time — but the deployed output must be plain static files.)
7. **The Zenodo DOI, GitHub repo link, and BOLD project NGMBL references** must remain prominent and clickable on Database, Citations, and Footer.
8. **The keyboard shortcuts** (⌘K / Ctrl+K, `/`, Esc) must work on every page.
9. **The v20 changelog block** stays at the top of `/database/` (the landing page).

---

## 3 · Target file structure

```
Nigerian-Marine-Biodiversity-Reference-Library/
├── index.html                      → redirects to /database/ (or serves it directly)
├── database/
│   └── index.html                  → "The Database" overview (current default landing)
├── gap-analysis/
│   └── index.html                  → 6 sub-tabs: gap, all-taxa, marine, fish, macrobenthos, nematodes
├── statistics/
│   └── index.html                  → KPIs, donut, bar chart, priority leaderboard, IUCN crosstab, marker table
├── citations/
│   └── index.html
├── gallery/
│   └── index.html                  → Media gallery + identification keys (placeholder content)
├── resources/
│   └── index.html
├── contact/
│   └── index.html
├── about/
│   └── index.html
│
├── assets/
│   ├── css/
│   │   └── styles.css              → ALL styling, extracted from <style> blocks
│   ├── js/
│   │   ├── data.js                 → All five data arrays + ALL_TAXA + classification fns
│   │   ├── search.js               → Global search index + dropdown + Cmd+K shortcut
│   │   ├── render.js               → renderTable, renderMarineTable, renderFishTable, etc.
│   │   ├── stats.js                → populateStatsPage, renderPriorityLeaderboard, renderIucnCrosstab
│   │   ├── popup.js                → Species detail popup logic
│   │   ├── partials.js             → Loads header.html / footer.html / nav.html into page
│   │   └── nav.js                  → Active-page highlight in top nav, mobile menu toggle
│   └── partials/
│       ├── header.html             → <header> markup with logo, search, NMBL pill, DOI link
│       ├── nav.html                → Top navigation with all 8 page links
│       └── footer.html             → Footer with newsletter, donate, social, copyright
│
├── CNAME                           → contains the single line: envirobiotics.org
├── 404.html                        → custom 404 styled to match
├── robots.txt                      → allow all
├── sitemap.xml                     → list every page with lastmod
├── README.md                       → repository readme
└── archive/
    └── nigeria_reflib_dashboard_v20.html   → keep the original for reference
```

**Why this layout.** Subfolder + `index.html` gives clean URLs (`envirobiotics.org/citations/`, not `/citations.html`), works with GitHub Pages without rewrites, and keeps the back button intuitive.

---

## 4 · How shared partials work (without a build step)

GitHub Pages does not run server-side includes. Two options — **pick one and apply it consistently:**

### Option A — JavaScript include (simpler, what I recommend)

```html
<!-- Each page contains, near the top of <body>: -->
<div id="site-header"></div>
<div id="site-nav"></div>

<!-- And before </body>: -->
<div id="site-footer"></div>
<script src="/assets/js/partials.js"></script>
```

`partials.js` does:
```js
(async () => {
  const inject = async (id, file) => {
    const r = await fetch(`/assets/partials/${file}`);
    document.getElementById(id).innerHTML = await r.text();
  };
  await inject('site-header', 'header.html');
  await inject('site-nav',    'nav.html');
  await inject('site-footer', 'footer.html');
  // Re-bind keyboard shortcuts and active-page highlight after partials land
  if (window.bindGlobalKeyboard) window.bindGlobalKeyboard();
  if (window.highlightActiveNav) window.highlightActiveNav();
})();
```

**Trade-off:** there's a tiny flash of unstyled content while partials load. Acceptable for v1; can be optimised later with HTTP/2 push or by inlining.

### Option B — Pre-build step

A small Node script in `tools/build.js` reads each `index.html`, finds `<!-- include: header.html -->` markers, and writes the combined files back. Run before every commit. More moving parts, no FOUC, no JS dependency.

**Recommendation: Option A for v1.** Switch to B only if SEO/perf testing flags FOUC as a problem.

---

## 5 · Step-by-step task sequence

Run these in order. Commit after each numbered step so a regression is easy to bisect.

### Phase 1 — Repository setup

1. **Clone the repo** if not already local.
   ```bash
   git clone https://github.com/donsheva/Nigerian-Marine-Biodiversity-Reference-Library.git
   cd Nigerian-Marine-Biodiversity-Reference-Library
   ```
2. **Create the directory skeleton** from §3 (empty folders, empty placeholder `index.html` in each subfolder).
3. **Move the v20 file into `archive/`** as the source of truth. Do not delete it.
4. **Create `CNAME`** at the repo root with one line: `envirobiotics.org`
5. **Create `.nojekyll`** at the repo root (empty file) — prevents Jekyll from processing the site.
6. **Commit:** `chore: scaffold multi-page structure`

### Phase 2 — Extract shared assets

7. **Extract all CSS** from the `<style>` blocks in `archive/nigeria_reflib_dashboard_v20.html` into `assets/css/styles.css`. Keep all CSS variables, all rules, all media queries. Don't refactor — just move.
8. **Extract the data arrays** (`VERTEBRATES`, `MEIOFAUNA_OTHER`, `NEMATODES`, `MACROBENTHOS`, `MARINE`, `ALL_TAXA`) plus the classification helpers (`iucnBadge`, `ncbiEffectiveStatus`, `overallStatus`) into `assets/js/data.js`. **Do not modify any data values.**
9. **Extract the search functions** (`buildSearchIndex`, `onSearchInput`, `onSearchKey`, `clearSearch`, `positionDropdown`, `bindGlobalKeyboard` — name the keyboard binder so partials.js can call it) into `assets/js/search.js`.
10. **Extract the popup functions** (`openPopup`, `closePopup`, `closePopupOnOverlay`) into `assets/js/popup.js`.
11. **Extract the render functions** (`renderTable`, `renderMarineTable`, `renderFishTable`, `renderMacroTable`, `renderNemaTable`, `renderGroups`, `renderGapLists`, `updateStats`) into `assets/js/render.js`.
12. **Extract the statistics functions** (`populateStatsPage`, `populateDbStats`, `priorityScore`, `priorityRationale`, `getPrioritySection`, `renderPriorityLeaderboard`, `renderIucnCrosstab`, `exportPriorityCSV`) into `assets/js/stats.js`.
13. **Extract the page-switching functions** (`switchPage`, `switchTab`) — these can be removed entirely once the multi-page split is complete, but keep them temporarily for the gap-analysis sub-tabs (gap / all-taxa / marine / fish / macrobenthos / nematodes still tab-switch within `/gap-analysis/`).
14. **Commit:** `refactor: extract shared CSS, data, search, render to /assets`

### Phase 3 — Build the partials

15. **Create `assets/partials/header.html`** — copy the `<header>` block from v20 verbatim. Make sure asset paths (none in header currently) use absolute paths (`/assets/...`) so they work from every subfolder.
16. **Create `assets/partials/nav.html`** — copy the `<nav class="site-nav">` block, but rewrite the `onclick="switchPage(...)"` handlers as plain `<a href="...">` links to the new URLs. Add `data-page="database"` etc. attributes so `nav.js` can mark the active one.
17. **Create `assets/partials/footer.html`** — copy the `<footer>` block verbatim, including the newsletter form, donate buttons, social links.
18. **Create `assets/js/nav.js`** with `highlightActiveNav()` — reads the current path and adds `.nav-pg-active` to the matching `<a data-page>`.
19. **Create `assets/js/partials.js`** as shown in §4 Option A.
20. **Commit:** `feat: shared header, nav, footer partials`

### Phase 4 — Build the pages, one at a time

For each page below: create the file, paste the page's `<div id="page-XYZ" class="page-section container">...</div>` content from the v20 file, replace the surrounding scaffold with the new partial includes, link the JS files this page needs, and visually verify in the browser before moving on.

21. **`database/index.html`** — landing page. Includes the v20 changelog block, "Why coverage matters", current coverage stats (uses `populateDbStats`), classification flowchart, data sources grid. JS needed: `data.js`, `render.js` (for stats), `popup.js`, `search.js`, `nav.js`, `partials.js`.
22. **`gap-analysis/index.html`** — keep the 6 sub-tabs (`gap`, `species`, `marine`, `fish`, `macrobenthos`, `nematodes`) as in-page tabs since they share filtering UX. JS needed: all of the above plus the `switchTab` function.
23. **`statistics/index.html`** — KPI grid, donut, bar chart, **Top Priority Sequencing Targets leaderboard**, **IUCN crosstab**, marker mini cards, marker table. JS needed: `data.js`, `stats.js`, `popup.js`, `search.js`, `partials.js`. Make sure `populateStatsPage()` is called on page load.
24. **`citations/index.html`** — citation block, BibTeX, related publications. Keep the dynamic year/date from `_now`. JS needed: minimal — `data.js` (for header search to work), `search.js`, `partials.js`.
25. **`gallery/index.html`** — placeholder cards as in v20. JS needed: minimal.
26. **`resources/index.html`** — taxonomy primer, government bodies, data portals. JS needed: minimal.
27. **`contact/index.html`** — contact form (still uses mailto), expertise tags, collaboration interests. JS needed: `submitContact()` from the original — extract to a small `assets/js/contact.js` for cleanliness.
28. **`about/index.html`** — about content from v20.
29. **`index.html` at root** — minimal redirect to `/database/`:
   ```html
   <!doctype html><meta charset="utf-8">
   <title>EnviroBiotics — NMBL</title>
   <meta http-equiv="refresh" content="0; url=/database/">
   <link rel="canonical" href="https://envirobiotics.org/database/">
   <p>Redirecting to <a href="/database/">the database</a>…</p>
   ```
30. **Commit each page individually:** `feat: /database page`, `feat: /gap-analysis page`, etc.

### Phase 5 — Search routing

31. **Update the search-result click handler** in `search.js` so clicking a result navigates to the right page with the species pre-selected. Convention: append `?focus=<species-name>` to the URL, then on page load that page reads the param and opens the popup.
32. Map species → page:
   - vertebrate (Fish, Elasmobranch, Mammal, Turtle, Crustacean) → `/gap-analysis/?focus=...&tab=fish` or `?tab=species`
   - marine → `/gap-analysis/?focus=...&tab=marine`
   - macrobenthos → `/gap-analysis/?focus=...&tab=macrobenthos`
   - nematode → `/gap-analysis/?focus=...&tab=nematodes`
   - meiofauna → `/gap-analysis/?focus=...&tab=species`
33. **Commit:** `feat: search routing across pages`

### Phase 6 — SEO + sharing

34. **Update `<title>`, `<meta description>`, `<meta og:*>`, `<link canonical>`** on every page so each has a unique, page-specific value. The current v20 sets these once for the whole single-page; multi-page needs each to be tailored.
35. **Generate `sitemap.xml`** with one `<url>` entry per page, `lastmod` set to today.
36. **Create `robots.txt`** allowing all.
37. **Create a styled `404.html`** matching the v20 design.
38. **Commit:** `feat: SEO metadata, sitemap, 404`

### Phase 7 — DNS + deploy

39. **Push to GitHub:** `git push origin main`
40. **Enable Pages** in repo Settings → Pages → Source: `main` branch, root folder.
41. **Set custom domain:** Settings → Pages → Custom domain → enter `envirobiotics.org`. GitHub will commit the `CNAME` file (already in repo, so this just verifies).
42. **At Porkbun**, in DNS Records for envirobiotics.org:
    - **Delete any existing default A or CNAME records** for `@` and `www`.
    - **Add four A records** for the apex (`@`):
      - `185.199.108.153`
      - `185.199.109.153`
      - `185.199.110.153`
      - `185.199.111.153`
    - **Add one CNAME** for `www` pointing to `donsheva.github.io` (replace with your actual GitHub username).
    - Optional but recommended: **AAAA records for IPv6**:
      - `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
43. **Wait 10–60 minutes** for DNS propagation. Check with:
    ```bash
    dig envirobiotics.org +noall +answer -t A
    ```
    Should return the four GitHub IPs.
44. **In GitHub Pages settings, tick "Enforce HTTPS"** once the certificate is provisioned (Let's Encrypt — happens automatically; can take up to 24h, usually under 1h).
45. **Verify:** browse to `https://envirobiotics.org/`, `/database/`, `/statistics/`, etc. Confirm:
    - HTTPS works without warnings
    - Search bar is present and functional on every page
    - Cmd+K focuses search on every page
    - Top Priority Sequencing Targets leaderboard renders on `/statistics/`
    - IUCN crosstab renders on `/statistics/`
    - Newsletter subscribe opens mail client to `ade@envirobiotics.org`
46. **Smoke test on mobile** (Chrome dev tools, narrow viewport) — confirm KPI grids reflow, nav doesn't overflow, search dropdown isn't clipped.

---

## 6 · Suggested Claude Code prompts (copy-paste ready)

Hand these to Claude Code one phase at a time. Don't paste them all at once.

### Prompt A — Phase 1 (scaffold)

> Read `archive/nigeria_reflib_dashboard_v20.html` to understand the structure. Then create the multi-page directory layout described in §3 of `BRIEF.md`: subfolder + `index.html` for each of database, gap-analysis, statistics, citations, gallery, resources, contact, about. Add `CNAME`, `.nojekyll`, root `index.html` redirect. Commit with message `chore: scaffold multi-page structure`.

### Prompt B — Phase 2 (extract assets)

> Following §5 steps 7–13 of `BRIEF.md`, extract CSS, data, search, popup, render, and stats functions from `archive/nigeria_reflib_dashboard_v20.html` into the `assets/` folders. Do not modify any data values, classification logic, or CSS rules — this is a move-only refactor. After extraction, all five data arrays must be reachable from `window.ALL_TAXA` etc. for any page that loads `data.js`. Commit when done.

### Prompt C — Phase 3 (partials)

> Build the three shared partials (`header.html`, `nav.html`, `footer.html`) and the loader `partials.js` per §4 Option A. Convert the `onclick="switchPage(...)"` handlers in `nav.html` to plain `<a href="/.../">` links with `data-page` attributes. Write `nav.js` with `highlightActiveNav()`. Commit.

### Prompt D — Phase 4 (one prompt per page)

> Build `database/index.html` per §5 step 21 of `BRIEF.md`. Copy the `<div id="page-database">` content from the v20 archive verbatim, wrap it in a fresh page scaffold with the partial-include divs, link the required JS files, and verify it renders by serving locally with `python3 -m http.server 8000`. Confirm the v20 changelog, the classification flowchart, and `populateDbStats()` all work. Commit.

(Then repeat with the next page name.)

### Prompt E — Phase 5 (search routing)

> Update `assets/js/search.js` so clicking a search result navigates to the species' home page using the URL convention `?focus=<species>&tab=<tab>` per §5 steps 31–32. On each gap-analysis sub-tab page, on `DOMContentLoaded`, read the URL params and if `focus` is set, switch to the named tab and call `openPopup` with the matching species. Commit.

### Prompt F — Phase 6 (SEO)

> Audit every page's `<title>`, meta description, og:title, og:description, og:url, canonical link. Each must be unique and tailored to that page. Generate `sitemap.xml` with one entry per page, `lastmod` = today. Create `robots.txt`. Create `404.html` styled with the existing CSS. Commit.

### Prompt G — Phase 7 (deploy)

> Push to `main`. Walk me through enabling GitHub Pages and setting the custom domain. Then walk me through the Porkbun DNS changes step-by-step per §5 step 42 — I will execute them. Verify with `dig` after I report DNS is set.

---

## 7 · Things to verify after each phase

After Phase 2: open `archive/nigeria_reflib_dashboard_v20.html` in a browser locally — it must still work identically (I am keeping it as the rollback).

After Phase 3: open `database/index.html` locally, view source, confirm the partials inject and the page looks like the v20 database page.

After Phase 4: every page renders independently, search works on every page, no console errors.

After Phase 5: clicking a search result on `/database/` navigates to `/gap-analysis/` with the right tab and popup open.

After Phase 6: Lighthouse SEO score ≥ 95 on every page, no broken canonical links, sitemap parses.

After Phase 7: `https://envirobiotics.org/database/` loads with valid certificate, all interactivity intact.

---

## 8 · What NOT to do

- **Do not refactor the data structure.** The 132-taxa arrays stay flat objects with the existing keys. Even the slightly-redundant `bold` vs `bold_silva` aliasing stays.
- **Do not introduce a framework.** No React, no Vue, no Svelte, no Astro, no Next, no static-site generator.
- **Do not switch CSS-in-JS or Tailwind.** Keep the hand-written CSS.
- **Do not minify or fingerprint files.** Plain readable filenames.
- **Do not delete `archive/nigeria_reflib_dashboard_v20.html`** — it stays as the canonical source until the multi-page version is verified live.
- **Do not change any species data** in the arrays. There has been a history of silent data regressions; treat the arrays as read-only during the split.
- **Do not change the classification thresholds.** The 50% West African rule, the ≥5 global sequence floor for non-absent NCBI status — both stay exactly as in v20.

---

## 9 · Expected timeline

If the work goes smoothly: **one focused afternoon, maybe two.**

- Phases 1–3: ~30 minutes
- Phase 4 (eight pages): ~90 minutes
- Phase 5 (search routing): ~30 minutes
- Phase 6 (SEO): ~20 minutes
- Phase 7 (DNS + deploy): ~15 minutes of work + 1–24h of waiting for DNS and HTTPS provisioning

---

## 10 · Reference values

- **Apex A records:** `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- **Apex AAAA records (IPv6, optional):** `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
- **www CNAME target:** `donsheva.github.io` (your GitHub username)
- **Domain:** `envirobiotics.org`
- **Repo:** `github.com/donsheva/Nigerian-Marine-Biodiversity-Reference-Library`
- **Zenodo DOI:** `10.5281/zenodo.19201628`
- **BOLD project code:** `NGMBL`
- **Subscribe destination email:** `ade@envirobiotics.org`
- **Curator email (contact form):** `ade@envirobiotics.org`

---

*End of brief. Hand this to Claude Code, walk through one phase at a time, verify each commit before moving on.*
