# CLAUDE.md — Multi-page Conversion Brief (v3.0)

**Project:** Nigerian Marine Biodiversity Reference Library (NMBL)
**Repo:** github.com/donsheva/Nigerian-Marine-Biodiversity-Reference-Library
**Source dashboard:** `nigeria_reflib_dashboard_v21.html` (canonical, at repo root)
**Target deployment:** envirobiotics.org (custom domain via Porkbun → GitHub Pages — already live and serving the v21 single-file dashboard)
**Brief version:** 3.0 — accurate to repo state as of commit `d9cb3dd`. Supersedes the v20-targeted brief and the earlier v21 draft (which assumed Phase 2 was a fresh start).

---

## What this brief does

Continues the multi-page conversion from the partially-completed Phase 4 state.
The single-file v21 dashboard is already serving live at envirobiotics.org via
a redirect from `index.html`. The multi-page site exists in the repo but is
not yet served — it will replace the single-file redirect once Phases 4–8
are complete.

---

## CRITICAL — read this section before any work

The repo's `assets/js/data.js` was extracted in Phase 2 from the **v20**
single-file dashboard, which used a different classification rule:

- **v20 (retired):** `ncbi` is "present" if WA records ≥ 50% of global NCBI count
- **v21 (live in the dashboard):** marker-specific absolute WA thresholds:
  - COI ≥5
  - 12S ≥3
  - 18S ≥1
  - 28S ≥1
  - rbcL ≥3

The function `ncbiEffectiveStatus` at line ~97 of `data.js` is the v20 version
and **must be replaced** before any new pages are built that read it.
Pre-computed `ncbi` fields on individual species records also need updating
where v21 changes them.

The canonical v21 source-of-truth lives at:
- `nigeria_reflib_dashboard_v21.html` (lines 1379–1409 contain `WA_THRESHOLD`,
  `ncbiEffectiveStatus`, `overallStatus`)
- The 132-taxon arrays inside the v21 file's `<script>` block contain the
  authoritative current `ncbi` / `overall` field values

---

## Repo state baseline (commit `d9cb3dd`)

```
✅ CNAME, .nojekyll, LICENSE, CITATION.cff, README.md, .gitignore — all in place
✅ index.html — redirects root to nigeria_reflib_dashboard_v21.html (live)
✅ nigeria_reflib_dashboard_v21.html — canonical, at root, ~323 KB
✅ archive/, Data/, Scripts/ — preserved
✅ Phase 1 scaffold: 8 page directories
✅ Phase 2 asset extraction (PARTIAL):
   - assets/css/styles.css
   - assets/js/data.js          [CONTAINS v20 LOGIC — needs Phase 2.1 fix]
   - assets/js/search.js
   - assets/js/render.js
   - assets/js/stats.js
   - assets/js/popup.js
   - assets/js/contact.js
   - 3 HTML partials (header, nav, footer)
✅ Phase 3 shared partials: header, nav, footer
🟡 Phase 4 (in progress, 5 of 8 pages wired):
   - about/index.html         ✅ wired (full content)
   - citations/index.html     ✅ wired
   - contact/index.html       ✅ wired
   - gallery/index.html       ✅ wired
   - resources/index.html     ✅ wired
   - database/index.html      ❌ placeholder only — needs full Phase 4 build
   - statistics/index.html    ❌ placeholder only — needs full Phase 4 build
   - [third unwired page]     ❌ placeholder only — needs full Phase 4 build
❌ Phase 5–8 not started
```

---

## Phase 2.1 — Migrate data.js from v20 to v21 (DO THIS FIRST)

Goal: `assets/js/data.js` must use v21 classification logic and v21-correct
pre-computed status fields, sourced verbatim from the canonical
`nigeria_reflib_dashboard_v21.html` file at the repo root.

### Steps

1. **Open `nigeria_reflib_dashboard_v21.html` and locate lines 1379–1409.**
   This contains `WA_THRESHOLD`, `ncbiEffectiveStatus`, and `overallStatus`.
   Extract these verbatim — do not rewrite, do not "improve", do not change
   the threshold values, do not change `>=` to `>`.

2. **Open `assets/js/data.js` and replace the v20 classification block.**
   The v20 `ncbiEffectiveStatus` function (around line 97 — search for the
   string `s.ncbi_global * 0.50` to find it) must be replaced with the v21
   version. The `overallStatus` function may also need replacement; compare
   with v21's version to confirm.

3. **Update pre-computed `ncbi` fields on the 107 ALL_TAXA records.**
   The v21 dashboard's runtime classification produces different `ncbi`
   field values for some species than the pre-computed values currently in
   data.js. Walk every species record and update the `ncbi` field to match
   what the v21 file's classification produces for that species's
   `ncbi_wa` count and marker.

4. **Run the verification gate before committing:**
   - Load `data.js` in Node
   - Classify all 107 records via the new `ncbiEffectiveStatus`
   - Produce a list: `(species_name, marker, ncbi_wa, computed_status,
     pre_computed_status_in_record)`
   - For every record, computed_status MUST equal pre_computed_status. Any
     mismatch means data.js is internally inconsistent — STOP and audit.

5. **Cross-check three known reclassifications.** For three well-known
   species, confirm the multi-page data.js produces the same classification
   as the live v21 dashboard:
   - *Sardinella maderensis* — should be `partial` (was `present` in v20)
   - *Rhizoprionodon acutus* — should be `absent` (was `partial` in v20)
   - *Penaeus notialis* — should be `absent` (was `partial` in v20)

   If any of these three differ, the migration has a bug — STOP and audit.

6. **Show the user `git diff assets/js/data.js` (full diff) and `git status`
   before committing.** Wait for explicit approval before running
   `git commit`.

7. **On approval, commit with message:**
   ```
   Phase 2.1: Migrate data.js from v20 to v21 classification rule

   - Replace ncbiEffectiveStatus with marker-specific WA thresholds
     (COI >=5, 12S >=3, 18S >=1, 28S >=1, rbcL >=3)
   - Update pre-computed ncbi fields on affected species
   - Verified against canonical nigeria_reflib_dashboard_v21.html
   - Three reclassifications confirmed: Sardinella maderensis (present ->
     partial), Rhizoprionodon acutus (partial -> absent), Penaeus notialis
     (partial -> absent)
   ```

### Constraints for Phase 2.1

- DO NOT touch any other file in `assets/`. `styles.css`, `search.js`,
  `render.js`, `stats.js`, `popup.js`, `contact.js`, and the partials are
  all fine.
- DO NOT touch `nigeria_reflib_dashboard_v21.html` — it is the canonical
  source-of-truth and must remain untouched.
- DO NOT start any Phase 4 work in the same commit. Phase 2.1 is one
  focused commit.

---

## Phase 4 — Build the three remaining pages

Only proceed once Phase 2.1 is committed and approved.

The three unwired pages are some combination of `database/`, `statistics/`,
and one of `methodology/` or `gap-analysis/`. Run `dir` to confirm which
directories exist as placeholders.

### `database/index.html`

This is the heart of the multi-page site — the interactive 107-taxon table.
Build it to match the equivalent section of the v21 single-file dashboard:

- Search box (uses `search.js`'s `attachSearchHandler`)
- Filters: by group, by status (present/partial/absent), by IUCN
- Main table or card grid showing all 107 ALL_TAXA records
- Status pills color-coded by `overallStatus()` from data.js
- Click-through to a species detail popup (uses `popup.js`)
- IUCN badge column (uses `iucnBadge()` from data.js)
- Marker column showing COI / 12S / 18S / 28S / rbcL
- WA record counts (NCBI WA / NCBI global / BOLD WA)

Render via the shared header, nav, and footer partials.

### `statistics/index.html`

Mirror the Statistics page from v21:

- Group coverage cards (one per taxonomic group: Fish, Elasmobranch,
  Crustacean, etc.)
- Top Priority Sequencing Targets leaderboard (weighted composite scoring,
  CSV export — function lives in `stats.js`)
- IUCN × coverage crosstab (highlights threatened taxa lacking references)
- Coverage classification flowchart (the SVG decision tree from v21)
- KPI grid (total taxa, % present, % absent, # nematodes)

### Third unwired page

Confirm what it is — likely `methodology/` or `gap-analysis/`. If
`methodology/`, port the methodology / classification rules section of v21.
If `gap-analysis/`, port the introductory gap-analysis explainer + the v21
changelog block.

### Verification before commit

For each page:

1. Open it in a local browser via `python -m http.server 8000` and check it renders without console errors.
2. Verify partials load (header, nav, footer all visible).
3. Verify data renders (table populated, stats numbers show, search works).
4. Compare visually against the equivalent section of the live v21 dashboard at envirobiotics.org. Should look near-identical (same colours, same layout, same content).

Show `git status` and a brief description of what was added before committing.

---

## Phase 5 — Visual parity check (30 min)

Open both the live v21 single-file dashboard at envirobiotics.org AND the
local multi-page site (`python -m http.server 8000`) side-by-side. Verify:

- Colours match exactly (CSS custom properties carried over correctly)
- The Top Priority Sequencing Targets leaderboard ranks the same species
  in the same order
- The IUCN × coverage crosstab cells contain the same taxon counts
- The decision-tree flowchart renders identically
- Search works on `database/` with the same fuzzy-match behaviour as v21
- Keyboard shortcuts work
- The status filter on `database/` returns exactly the same row counts as
  the single-file dashboard

If any of these diverge, fix before Phase 6.

---

## Phase 6 — Update README.md (10 min)

Update the existing `README.md` to mention:

- The site is live at envirobiotics.org
- Citation block (already exists in CITATION.cff — link to it)
- Brief structure-of-the-repo overview
- Link to the canonical single-file dashboard for archival reference

Don't rewrite from scratch — extend what's there.

---

## Phase 7 — Pre-deployment smoke test (15 min)

Locally serve the site and run through this checklist:

```bash
python -m http.server 8000
# open http://localhost:8000 in browser
```

- [ ] Homepage redirects to v21 (or to /database/, depending on Phase 8 decision below)
- [ ] All 8 pages reachable from the nav menu
- [ ] Data table on /database/ shows 107 taxa
- [ ] Filtering by "absent" returns the expected count
- [ ] Searching for "Capitella" returns *Capitella capitata*
- [ ] Searching for "Sardinella maderensis" shows status = `partial` (key v21 reclassification — confirms Phase 2.1 worked end-to-end)
- [ ] Statistics page priority leaderboard renders with all rows
- [ ] Coverage flowchart renders
- [ ] Mobile viewport (375px wide): nav menu collapses, table scrolls horizontally
- [ ] Keyboard shortcut focuses search
- [ ] Footer email link opens mail client

---

## Phase 8 — Switch the live site over (10 min)

Once Phases 4–7 are complete and the multi-page site is verified working,
the final commit changes `index.html`'s redirect target from
`nigeria_reflib_dashboard_v21.html` to `/database/` (or to `/about/` if
the about page is the better landing — discuss before deciding).

```bash
# Edit index.html — change the meta-refresh URL
git add index.html
git commit -m "Phase 8: switch live site from v21 single-file to multi-page"
git push origin main
```

Wait 2–3 minutes for GitHub Pages to publish, then verify envirobiotics.org
serves the multi-page site instead of the single-file dashboard.

If anything regresses, revert with `git revert HEAD && git push` — the
single-file v21 dashboard is back as the front door, and the multi-page
work stays in the repo for further iteration.

---

## Conventions and constraints

- **Edits to large files** (data.js, the v21 source HTML) must use
  Python `content.replace()` for reliability, not `sed`.
- **Validate every edit** with grep and file size check.
- **Never modify `nigeria_reflib_dashboard_v21.html`.** It's the
  canonical source-of-truth.
- **Search dropdown**: must use `position: fixed` with a
  `positionDropdown()` JS function, NOT `position: absolute`, to avoid
  clipping by `overflow: hidden` on the sticky header.
- **Fonts**: Sora, DM Sans, DM Mono. Loaded via Google Fonts in the
  shared `<head>` partial.
- **No build step.** Plain HTML/CSS/JS. No bundler, no transpilation,
  no npm dependencies.

---

## What "done" looks like

- envirobiotics.org loads the multi-page site (Phase 8 complete)
- All 8 pages render correctly on desktop, tablet, and mobile
- The single-file v21 dashboard remains accessible at
  `/nigeria_reflib_dashboard_v21.html` for archival reference
- The classification logic on the multi-page site exactly matches v21
  (verified by Phase 2.1 verification gate and the Phase 7 smoke test)

---

## What's deferred (NOT part of this brief)

- Confirming *Hypanus marianae* IUCN status (LC → VU update from earlier)
- Uploading full NCBI query results
- Running `bold_query_fallback.py` and uploading the CSV
- Biodiversity Data Journal data paper preparation
- GBIF IPT and OBIS registration
- Logo integration in the header (waiting on the logo file)

These are data-and-publication tasks. The multi-page conversion is
infrastructure-and-presentation. Keep them separate to avoid scope creep.
