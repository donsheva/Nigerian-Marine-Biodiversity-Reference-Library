# Deploy v21 to envirobiotics.org — Runbook

**Goal:** Push the trimmed v21 dashboard to GitHub, configure Pages + custom
domain, and have https://envirobiotics.org serve the dashboard.

**Time required:** ~15 minutes of your time + DNS propagation (10 minutes to
several hours, usually fast for Porkbun).

---

## Files to download from this chat

Save all four into a single folder on your Windows machine
(e.g. `C:\Users\<you>\Downloads\nmbl-deploy\`):

1. `nigeria_reflib_dashboard_v21.html` (the trimmed v21, 323 KB)
2. `index.html` (286-byte redirect to v21)
3. `CNAME` (17 bytes, contains: `envirobiotics.org`)
4. `.nojekyll` (empty file, disables Jekyll processing)

---

## Step 1 — Update the repo locally

Open PowerShell. Replace `C:\path\to\repo` with your actual repo path.

```powershell
# Navigate to the repo
cd C:\path\to\Nigerian-Marine-Biodiversity-Reference-Library

# Confirm you're on main and the working tree is clean
git status
git checkout main
git pull origin main

# Create archive directory and move the deprecated v13 site out of the way
git mv Web archive\v13-deprecated

# If 'archive' doesn't exist yet, the above command may need this first:
# mkdir archive
# git mv Web archive/v13-deprecated

# Copy the four downloaded files into the repo root
$src = "$env:USERPROFILE\Downloads\nmbl-deploy"
Copy-Item "$src\nigeria_reflib_dashboard_v21.html" -Destination ".\" -Force
Copy-Item "$src\index.html"                        -Destination ".\" -Force
Copy-Item "$src\CNAME"                             -Destination ".\" -Force
Copy-Item "$src\.nojekyll"                         -Destination ".\" -Force

# Verify what changed
git status
```

You should see:

- `index.html` — modified (the redirect target changed from `Web/index.html` to `nigeria_reflib_dashboard_v21.html`)
- `Web` → renamed to `archive/v13-deprecated`
- `nigeria_reflib_dashboard_v21.html` — new file
- `CNAME` — new file
- `.nojekyll` — new file

If `git status` shows any unexpected modifications (especially to files in
`Data/`, `Scripts/`, or `LICENSE`), stop and audit before committing.

---

## Step 2 — Commit and push

```powershell
git add .nojekyll CNAME index.html nigeria_reflib_dashboard_v21.html archive Web

git commit -m "Deploy v21 dashboard to envirobiotics.org

- Add CNAME (envirobiotics.org) and .nojekyll for GitHub Pages custom domain
- Replace root index.html redirect target: Web/index.html -> v21 dashboard
- Move deprecated v13 multi-page site from Web/ to archive/v13-deprecated/
- Add nigeria_reflib_dashboard_v21.html (canonical v21 with trimmed
  Capitella note, marker-specific WA classification rule)"

git push origin main
```

If `git push` succeeds, the repo is updated. If it asks for credentials,
authenticate as you normally do.

---

## Step 3 — Configure GitHub Pages

Open in a browser:

`https://github.com/donsheva/Nigerian-Marine-Biodiversity-Reference-Library/settings/pages`

Set the following:

- **Source:** Deploy from a branch
- **Branch:** `main`
- **Folder:** `/ (root)`
- Click **Save**

The "Custom domain" field should auto-populate with `envirobiotics.org`
(read from the `CNAME` file you just pushed). If it doesn't, enter it
manually and save.

**Do not yet check "Enforce HTTPS"** — that toggle is greyed out until
GitHub provisions the SSL certificate, which can take 10 minutes to
24 hours after first DNS verification. We'll come back to this in Step 6.

---

## Step 4 — Verify Porkbun DNS

Open in a browser: `https://porkbun.com/account/domainsSpeedy`

Click on `envirobiotics.org`, then **DNS Records**. The records should be:

| Type  | Host  | Answer            | TTL |
|-------|-------|-------------------|-----|
| A     | (root)| 185.199.108.153   | 600 |
| A     | (root)| 185.199.109.153   | 600 |
| A     | (root)| 185.199.110.153   | 600 |
| A     | (root)| 185.199.111.153   | 600 |
| CNAME | www   | donsheva.github.io. | 600 |

Notes:

- "Host = (root)" means leave the host field blank or use `@`, depending on
  Porkbun's UI. Both produce the same record.
- The CNAME for `www` ends with a literal dot in the DNS standard, but
  Porkbun's UI may or may not show it; either way is fine.
- If any record is wrong, fix it. If all four A records and the www CNAME
  are missing, add them now. If extra records exist (other A, CNAME, AAAA
  records pointing elsewhere), they need to be removed or they'll conflict.

---

## Step 5 — Wait, then verify

Wait 5-10 minutes after the push. Then test:

```powershell
# Test the GitHub Pages URL (should work first)
curl -I https://donsheva.github.io/Nigerian-Marine-Biodiversity-Reference-Library/

# Test the custom domain HTTP (will redirect to HTTPS once provisioned)
curl -I http://envirobiotics.org

# Test the custom domain HTTPS
curl -I https://envirobiotics.org
```

What you should see at each stage:

- The GitHub Pages URL: `HTTP/2 200` or a redirect to your custom domain
- HTTP envirobiotics.org: `HTTP/1.1 301 Moved Permanently` redirecting to HTTPS
- HTTPS envirobiotics.org: `HTTP/2 200` and a `Location:` header pointing to the v21 dashboard

If you see `503 Service Unavailable` from envirobiotics.org, GitHub is still
provisioning the certificate. Wait 10-20 minutes and retry.

If you see `404` from the GitHub Pages URL, GitHub Pages isn't configured.
Recheck Step 3.

If DNS hasn't propagated yet, you may see "could not resolve host" on
`envirobiotics.org` — wait longer.

---

## Step 6 — Enable HTTPS enforcement

Once `https://envirobiotics.org` returns a 200 (browser shows the dashboard
without certificate warnings), go back to:

`https://github.com/donsheva/Nigerian-Marine-Biodiversity-Reference-Library/settings/pages`

The "Enforce HTTPS" checkbox will now be enabled. Tick it. This forces all
HTTP traffic to redirect to HTTPS automatically.

---

## Step 7 — Smoke test in the browser

Open in a clean browser window (or incognito) to bypass cache:

- `https://envirobiotics.org` — should load the v21 dashboard
- The page title bar should read "Nigerian Marine Biodiversity Reference Library — NMBL v21"
- Search for "Capitella capitata" in the dashboard — note should be the trimmed 3-sentence version
- Search for "Sardinella maderensis" — overall status should be "partial" (this is the v21 reclassification)
- Statistics page should show the Top Priority Sequencing Targets leaderboard
- Coverage classification flowchart should render
- Keyboard shortcut Cmd+K (Mac) or Ctrl+K (Windows) should focus search

If any of these fail, the deployment isn't right. Do not enable HTTPS
enforcement (Step 6) until smoke test passes.

---

## Troubleshooting

### `git mv Web archive\v13-deprecated` fails

If the `archive` directory doesn't exist yet:

```powershell
mkdir archive
git mv Web archive/v13-deprecated
```

If `Web/` was tracked but contains untracked files, those will need to be
handled separately:

```powershell
git status  # check what's untracked under Web/
# Either commit the untracked files first, or remove them, or include them
# explicitly in the move
```

### envirobiotics.org returns 404 indefinitely

Check that the `CNAME` file at the repo root contains exactly
`envirobiotics.org` with no trailing newline. The 17-byte file we shipped is
correct — if you opened it in a text editor and saved, you may have added a
newline.

```powershell
# Verify byte count (should be exactly 17)
(Get-Content -Path .\CNAME -Raw).Length
```

If it's 18 or 19, the file has a trailing newline or CRLF. Re-download
the original from the chat.

### envirobiotics.org loads but shows the OLD v13 site

Two possibilities:

1. Browser cache. Hard refresh: Ctrl+Shift+R.
2. The `index.html` redirect didn't update. Open
   `https://envirobiotics.org/index.html` directly in DevTools and check the
   `<meta http-equiv="refresh">` line — it should reference
   `nigeria_reflib_dashboard_v21.html`, not `Web/index.html`.

### GitHub Actions CI flagged something

Check the Actions tab. If something is broken in the Pages build, the
output will be there. Most common cause: typo in the CNAME file, or
`.nojekyll` got committed as a directory instead of a file.

---

## What this does NOT do

This runbook gets v21 served at envirobiotics.org as a single-file
deployment. It does NOT:

- Convert v21 into a multi-page site (that's the next task — Phase 2-8 of the
  multi-page conversion brief in `CLAUDE.md`)
- Add a logo to the header (waiting on the logo file)
- Set up redirects for old URLs that pointed at the deprecated v13 site

After this runbook succeeds, we resume the logo work and then the
multi-page conversion via Claude Code.
