# reverify_v21.py — Re-verification Script

Re-queries NCBI Nucleotide and BOLD Systems for every species in the v21
dashboard, applies the v21 classification rule, and generates a review-able
patch before touching the HTML.

## One-time setup

```bash
pip install biopython requests
```

Optional but recommended — get an NCBI API key (free) from
https://www.ncbi.nlm.nih.gov/account/settings/ to raise the rate limit from
3 req/s to 10 req/s. The script works without one, just slower.

## Running it

Both files should live in the same directory:

```
your_project/
├── nigeria_reflib_dashboard_v21.html
└── reverify_v21.py
```

### Step 1 — Dry run (does NOT modify the HTML)

```bash
python reverify_v21.py --dashboard nigeria_reflib_dashboard_v21.html
```

With an API key (faster):
```bash
python reverify_v21.py --dashboard nigeria_reflib_dashboard_v21.html \
  --email ade@envirobiotics.org --api-key YOUR_NCBI_KEY
```

This will:
- Parse all 107 species entries from the dashboard
- Query NCBI + BOLD for each (takes ~15–25 minutes without an API key;
  ~5–8 minutes with one)
- Write three files:
  - `verification_report_v21.csv` — open in Excel; shows old vs new status per species
  - `verification_report_v21.json` — same data, machine-readable
  - `dashboard_update_patch.json` — the patch to apply if you approve the changes
- Cache everything in `ncbi_cache.json` and `bold_cache.json` so a restart
  after a crash or timeout does not re-query species already done

### Step 2 — Review the report

Open `verification_report_v21.csv`. Key columns:

- `stored_ncbi` vs `new_ncbi_status` — any difference is a status change
- `stored_ncbi_wa` vs `new_ncbi_wa` — any difference is a count change
- `ncbi_changed` / `bold_changed` — YES flags that need your eyes
- `errors` — species where a query failed (usually BOLD being flaky)

Look especially at:
- Species you *expect* to have WA records but the script says 0
- Species classified absent that you know are in your local references
- Any species in the error column — those were not updated

### Step 3 — Apply the patch to the HTML

Only when you are satisfied the report looks right:

```bash
python reverify_v21.py --dashboard nigeria_reflib_dashboard_v21.html --apply
```

This will:
- Read `dashboard_update_patch.json` (generated in step 1)
- Back up the current HTML to `nigeria_reflib_dashboard_v21.html.bak`
- Rewrite the species entries with fresh `ncbi`, `bold`, `ncbi_global`, `ncbi_wa`
- Leave notes, priority, and everything else intact

## Options

| Flag | Purpose |
|---|---|
| `--dashboard PATH` | Path to the v21 HTML file (required) |
| `--email ADDR` | Email for NCBI Entrez (defaults to ade@envirobiotics.org) |
| `--api-key KEY` | NCBI API key; raises rate limit 3→10 req/s |
| `--limit N` | Only process first N species (for smoke-testing) |
| `--skip-bold` | Skip BOLD queries; NCBI only |
| `--apply` | Rewrite HTML from patch file (no new queries) |

## Smoke test (recommended first run)

Do a 5-species dry run before committing to the full ~25-minute run:

```bash
python reverify_v21.py --dashboard nigeria_reflib_dashboard_v21.html --limit 5
```

## If something goes wrong

- **BOLD keeps failing:** add `--skip-bold`. BOLD v4 and v5 have both been
  unreliable throughout this project. The script will flag errors in the
  report but continue with NCBI-only classification.
- **NCBI rate-limit 429 errors:** the script already backs off exponentially.
  If it still fails, the cache has saved everything completed so far;
  rerun later and it resumes from where it stopped.
- **Partial run interrupted:** just rerun the same command. Cached species
  are skipped.
- **You want to start over fresh:** delete `ncbi_cache.json` and
  `bold_cache.json`. The script will rebuild them.

## Methodology notes baked into the script

- **Geographic filter:** Gulf of Guinea only (Nigeria, Ghana, Cameroon,
  Benin, Togo, Côte d'Ivoire). Narrower than the v20 West Africa scope.
- **Marker scope:** each species' primary marker for NCBI, plus BOLD COI
  for all species (BOLD is COI-centric).
- **NCBI query:** `"Species name"[Organism] AND (marker synonyms)` plus
  `mitochondrion[Filter]` for mt markers so whole mitogenomes are counted.
- **Classification thresholds:** COI ≥5, 12S ≥3, 18S ≥1, 28S ≥1, rbcL ≥3
  (mirrors the dashboard's WA_THRESHOLD constant).
