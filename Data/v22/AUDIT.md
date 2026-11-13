# NMBL v22 — Audit report (13 November 2026)

## Trigger

During editorial fact-checking of Odedere & Rufai (2026), *Regional Studies in Marine Science* 103: 105586, an editor identified complete mitochondrial genomes in GenBank for *Sousa teuszii* and *Trichechus senegalensis*. Table 3 of the paper's appendix (March 2026 analysis) reported zero 12S records for both species. Tracing the cause led to a full audit and re-run of the NMBL dataset.

## Issues found

| # | Issue | Affected versions | Effect |
|---|---|---|---|
| 1 | Marker searches used `<marker>[Title]` only, so mitochondrial and chloroplast genome records (titled "mitochondrion, complete genome", etc.) were never matched. | v1–v21 | Global counts understated, sometimes by two orders of magnitude (e.g. *Orcinus orca* COI 2 → 180). Both species flagged by the editor were reported as zero. |
| 2 | NCBI has no `[Country]` search field. Terms like `"Nigeria"[Country]` are silently translated to `[All Fields]` (confirmed via E-utilities `querytranslation`). | v1–v21 West African (WA) counts | WA counts matched country names anywhere in a record; "Guinea" also matched Papua New Guinea. |
| 3 | 57 of 107 species/higher taxa had never been queried; status came from published literature. | v1–v21 | Optimistic statuses (e.g. tunas and cetaceans marked "present" with zero WA records). |
| 4 | Several stored WA counts could not be reproduced by any query (e.g. *Mugil cephalus* 27 WA 12S; the original query returns 0 today and no record has a WA country). | v21 | Overstated regional coverage. |
| 5 | Stored nematode global counts (e.g. *Chromadora* 4,200 18S / 890 28S) could not be reproduced from SILVA (genus, family, order or class), NCBI (18S or all records) or NeMys (taxonomy only; no sequences). No script in the repository or the local working folder produces them. They first appear in files extracted from the dashboard HTML (22 March 2026). | v12–v21 | Global nematode counts overstated by roughly 10–700×. WA counts were also non-zero for 9 genera, contradicting the published finding of zero. |
| 6 | Combined multi-country BOLD v5 geo queries silently return nothing for very large taxa (time-out). | First v22 BOLD pass | Detected (Polychaeta: 9 Nigerian but 0 WA). All taxa re-queried country by country; only Polychaeta changed (0 → 132). |

## v22 method

* **NCBI Nucleotide (E-utilities), 13 Nov 2026.** Query: `"<taxon>"[Organism] AND <marker clause> NOT srcdb_refseq[Properties]`.
  * COI clause: COI/COX1/CO1 or "cytochrome (c) oxidase subunit I/1" in title, **or** a mitochondrial genome.
  * 12S clause: `12S[Title]` **or** a mitochondrial genome.
  * rbcL clause: rbcL or the full gene name, **or** a chloroplast/plastid genome.
  * 18S/28S clause: 18S/28S or "small/large subunit ribosomal RNA" in title.
* **WA provenance (NCBI).** Country names are used only to shortlist candidates (`[All Fields]`). Each candidate's GenBank `country` qualifier is then read from esummary, and the record counts as WA only if that field names Mauritania, Senegal, Gambia, Guinea-Bissau, Guinea, Sierra Leone, Liberia, Côte d'Ivoire, Ghana, Togo, Benin, Nigeria, Cameroon or Cabo Verde. Nigeria is counted separately.
* **BOLD Systems v5 (portal.boldsystems.org API).** `/api/query/preprocessor` to resolve the taxon, then `/api/summary` with `fields=country/ocean,marker_code`. WA = sum over each WA country queried individually. COI = COI-5P + COI-3P.
* **SILVA (legatum.arb-silva.de search service).** SSU r144 and LSU r138.2, genus-level organism-name match. SILVA is derived from INSDC, so the WA count equals the INSDC WA count (0 for all 25 genera, cross-checked in NCBI).
* **Classification.** v21 rule and thresholds unchanged (COI ≥5, 12S ≥3, 18S ≥1, 28S ≥1, rbcL ≥3).

## Verification

* An independent re-query of 20 randomly selected taxa (NCBI global/WA/Nigeria) reproduced the main run exactly: **0 mismatches**.
* Invariant checks: no WA count exceeds its global count, and no Nigeria count exceeds its WA count, in NCBI or BOLD. **0 violations.**
* Taxa where global = WA (all records are West African), flagged for manual review: *Pseudotolithus senegalensis*, *Elops lacerta*, *Sousa teuszii*, *Tympanotonos fuscatus*, *Senilia senilis*, *Goniopsis pelii*, *Pomadasys rogerii*, *Lutjanus goreensis*. *Sousa teuszii* was checked by hand: MN365274, voucher USNM:MAMM:605133, Senegal 2018.
* `data.js` classification consistency: for every record with stored counts, the status computed from the stored counts equals the stored status (0 mismatches).

## Result (all 132 taxa)

| Status | v21 | v22 |
|---|---|---|
| Absent | 28 | 67 |
| Partial | 94 | 61 |
| Present | 10 | 4 |

* Present in v22: *Pseudotolithus elongatus*, *Scomberomorus tritor*, *Epinephelus aeneus* (all from one Guinea-Bissau 12S dataset, accessions PQ6287xx–PQ6288xx) and Polychaeta.
* No Nigerian 12S record exists for any fish tracked.

Species-level details are in `species_before_after_v21_v22.csv`; nematodes are in `nematode_genera_v21_v22.csv`.

## Known limitations

* WA counts are conservative: records whose origin appears only in isolate names, free-text locality or lat_lon without a country field are not counted.
* 19 taxa return no BOLD records under the name used. Some are probably synonyms (e.g. *Nereis diversicolor* → *Hediste diversicolor*; *Uca tangeri* → *Afruca tangeri*) and need a synonym-aware re-query.
* Nematode site logic (unchanged) sets the NCBI status to "partial" when global SILVA > 0 even with zero WA records. This differs from the v21 "zero WA = absent" rule applied to all other taxa. It is a methodological decision for the PI and was not changed in v22.
* The figures in the published paper (March 2026) differ from v22 and are not updated by this release.

## Files

| File | Contents |
|---|---|
| `ncbi_raw_v22.json` | Per taxon: [marker, v21-style global, v22 global, candidate count, WA, Nigeria, WA mitogenomes, country tally, WA accessions (truncated)] |
| `bold_raw_v22.json` | Per taxon BOLD global, WA, Nigeria and all-marker record counts |
| `silva_nematodes_v22.json` | SILVA SSU/LSU genus counts |
| `ncbi_nematodes_crosscheck_v22.json` | NCBI 18S/28S counts for the nematode genera: [global18S, WA18S, NG18S, global28S, WA28S, NG28S] |
| `ncbi_reverification_sample_v22.json` | Independent re-query sample: [global, WA, Nigeria] |
| `species_before_after_v21_v22.csv` | v21 vs v22 counts and statuses for the 107 species and higher taxa |
| `nematode_genera_v21_v22.csv` | v21 vs v22 counts for the 25 nematode genera |
| `../../Scripts/nmbl_v22_rerun_browser.js` | Query code used |
