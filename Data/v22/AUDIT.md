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

---

# v22.1 — Accepted-name re-query and independent reproduction (14 November 2026)

## Trigger

v22 left 19 taxa with no BOLD records. Checking every species and genus name against the World Register of Marine Species (WoRMS REST API) showed that 13 species were listed under superseded names. Records filed under the accepted name had never been counted.

## Method

The whole dataset was re-run with a stand-alone Python script, `Scripts/nmbl_v22_requery.py`, on the PI's own computer (14 Nov 2026, 11:30–11:59 WAT). The script used Biopython Entrez for NCBI, the BOLD v5 API, the SILVA search service and the WoRMS REST API. Query logic was identical to v22, with one change: each name was resolved through WoRMS, and species with a superseded name were queried under **both** names:
* NCBI: `("old"[Organism] OR "accepted"[Organism])`.
* BOLD: sum of the two names.

Raw outputs are in `Data/v22.1/`: results JSON and CSV, nematode CSV and run log.

## Name corrections (WoRMS)

| Site name | Accepted name | WoRMS status |
|---|---|---|
| *Arius latiscutatus* | *Carlarius latiscutatus* | unaccepted |
| *Sesarma huzardi* | *Guinearma huzardi* | superseded combination |
| *Uca tangeri* | *Afruca tangeri* | superseded combination |
| *Uca inversa* | *Cranuca inversa* | superseded combination |
| *Nereis diversicolor* | *Hediste diversicolor* | superseded original combination |
| *Crassostrea gasar* | *Crassostrea tulipa* | junior subjective synonym |
| *Egeria radiata* | *Galatea paradoxa* | unaccepted |
| *Neritina glabrata* | *Vitta glabrata* | unaccepted |
| *Corbula trigona* | *Potamocorbula adusta* | junior homonym |
| *Sparus caeruleostictus* | *Pagrus caeruleostictus* | unaccepted |
| *Strombus latus* | *Thetystrombus latus* | unaccepted |
| *Murex brandaris* | *Bolinus brandaris* | superseded combination |
| *Tympanotonos radula* | *Tympanotonos fuscatus* | unaccepted (synonym; duplicates the *T. fuscatus* entry) |

Other WoRMS notes, with no effect on counts:
* *Penaeus notialis* and *P. kerathurus* are subgenus forms only.
* *Balaenoptera brydei* is a *taxon inquirendum*.
* *Sphaerium nodicostatum* is not in WoRMS (freshwater).
* *Quadricoma* is now *Tricoma (Quadricoma)*; 0 records under either name.

Site display names are unchanged pending a PI decision. Each affected record carries `accepted_name` and a note that its counts include both names.

## Reclassifications (5)

| Taxon | v22 | v22.1 | Basis |
|---|---|---|---|
| *Sesarma huzardi* (*Guinearma huzardi*) | absent | **present** | NCBI 35 global / 33 WA COI (Cameroon 16, Ghana 14, Gambia 3); BOLD 35 / 33 |
| *Sparus caeruleostictus* (*Pagrus caeruleostictus*) | absent | partial | NCBI 3 / 3 WA 12S (Guinea-Bissau 2, Ghana 1); BOLD 2 / 2 |
| *Egeria radiata* (*Galatea paradoxa*) | absent | partial | NCBI 2 / 2 WA COI (Ghana) |
| *Corbula trigona* (*Potamocorbula adusta*) | absent | partial | BOLD 2 / 2 WA COI, both Nigeria |
| *Tympanotonos radula* (= *T. fuscatus*) | absent | partial | NCBI 3 / 3 WA COI (Ghana, Gambia) |

Count-only changes with no change in status:
* *Arius latiscutatus*: BOLD 0 → 2 WA.
* *Uca tangeri*: BOLD 0 → 1 WA.
* *Uca inversa*: BOLD 0 → 46 global.
* *Crassostrea gasar*: BOLD 0 → 54 global.
* *Strombus latus*: BOLD 1 → 3 global / 2 WA.
* *Murex brandaris*: BOLD 0 → 3 global.
* *Nereis diversicolor*: BOLD 0 → 366 global.

**Totals (132 taxa):** absent 67 → 62, partial 61 → 65, present 4 → 5.

## Independent reproduction

* **Species:** 94 of 106 reproduced v22 exactly. *Nereis diversicolor* is excluded from this comparison because it was re-queried separately. Of the 12 differences, 11 come from the name corrections; Ciliophora rose from 20,109 to 20,113 global, reflecting new NCBI deposits between runs.
* **Nematodes:** all 25 genera reproduced exactly, both the SILVA SSU/LSU counts and the NCBI 18S/28S counts (WA = 0 throughout).
* **Invariant checks:** no WA count exceeds its global count and no Nigeria count exceeds its WA count, in NCBI or BOLD (0 violations).
* **Stored data:** all 107 species records in `data.js` match the script output exactly (0 mismatches), and every stored status equals the status computed from its counts (0 mismatches).

## Headline figures (v22.1; replaces the earlier "32% of vertebrates with zero public sequences")

The 32% figure could not be reproduced from any version of the data. On v22.1 data, for the 49 vertebrate taxa tracked (fish, elasmobranchs, turtles, marine mammals):
* **4%** (2/49) have no reference sequence for their eDNA marker anywhere in NCBI or BOLD: *Pteroscion peli* and *Pseudupeneus prayensis*.
* **51%** (25/49) have no West African reference sequence in either database.
* **6%** (3/49) meet the regional threshold.
* **0%** (0/49) have a Nigerian reference sequence.

Across all 107 species and higher taxa, only 7 have any Nigerian record in NCBI or BOLD: *Macrobrachium vollenhovenii*, Bacillariophyta, Polychaeta, *Pachymelania aurita*, *P. fusca*, *Corbula trigona* (*Potamocorbula adusta*) and *Cardisoma armatum*.
