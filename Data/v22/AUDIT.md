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

---

# v22.2 — One classification rule, accepted names displayed (14 November 2026)

PI decisions on the open items from v22.1:

1. **Nematode classification brought into line with the v21 rule.** Nematode genera previously used a separate rule, recorded under "Known limitations" in v22: global sequences > 0 gave "partial". They now use the same rule as every other taxon: status depends on West African records, with an 18S threshold of ≥1, and the SILVA WA count equals the INSDC WA count. All 25 genera have 0 WA 18S records and are therefore **absent** (23 were partial before). No counts changed.
   * **Totals (132 taxa):** absent 62 → 85, partial 65 → 42, present 5 → 5.
   * The Nematodes tab's own descriptive labels ("unsequenced", "Nigeria gap") are unchanged.
2. **Accepted names displayed.** Records keep their site name as the internal key, while the 12 species with a different WoRMS accepted name are displayed under the accepted name, with the site name shown as a synonym. Search matches either name (`displayName()` and `nameMatches()` in `data.js`).
3. ***Tympanotonos radula* marked as a synonym of *T. fuscatus*.** It is kept in the list, displayed as "(synonym of *Tympanotonos fuscatus*)", and its note states that its records are the same as the *T. fuscatus* entry's and must not be added to them. **It still counts as a separate taxon in the 132 totals; removing it would make 131.**

In addition, the *Sousa teuszii* and *Trichechus senegalensis* records now give the mitogenome accession, voucher and country, state that a mitogenome contains both COI and 12S, and link directly to GenBank (MN365274 and MW073827). No counts changed.

## Site review (14 Nov 2026)

| Check | Result |
|---|---|
| Internal links | No broken links. The analytics script is loaded from an external `//` URL, which is a false positive. |
| JavaScript | All files parse. `data.js` loads, every stored status matches its counts, and the totals reconcile to 132. |
| HTML structure | Edited pages have balanced tags. |
| Stale statements | Remaining "v21" mentions refer correctly to the classification rule. The "NEW v21" badges on the Statistics page are historical. The citation example on the Citations page has a fixed "accessed 20 April 2026" date, which is cosmetic. |
| Rendering test | Statistics, Gap Analysis, Citations, Coverage and About pages were loaded in a headless DOM (jsdom) with all scripts run. There were no JavaScript errors; the only failure was Google Fonts being unreachable from the test sandbox. Gap Analysis shows 132 / 5 present / 42 partial / 85 absent / 25 nematodes, matching `data.js`. Coverage shows a cite date and 4% / 32% / 64%. Accepted names render, search finds *Guinearma*, and *Sousa teuszii* shows its GenBank link. |
| Leaderboard label fix | The Statistics priority leaderboard labelled every absent taxon "zero refs", although absent means zero **West African** records (e.g. *Sphyrna lewini* has 102 global). The label now reads "zero WA refs". |
| Search and pop-up test | The global search was tested on Gap Analysis, Statistics and About pages (jsdom; typing queries, clicking results). Search by site name, accepted name and common name works (e.g. "Sesarma" and "guinearma" both find the same record; "manatee" finds *Trichechus senegalensis*); no-match queries show a "No taxa found" message. Four pop-up defects were found and fixed: (1) nematode pop-ups showed the internal label "nigeria-gap" as the overall status, so they now show absent/present under the v21 rule; (2) NCBI/BOLD buttons searched the outdated name only, so they now search all names on NCBI and the accepted name on BOLD; (3) the NCBI search button added a marker word that can miss mitogenome records, so it is now organism-only; (4) pop-ups showed status only, so they now show NCBI and BOLD record counts (global, West Africa, Nigeria). The NCBI button now also appears for any taxon with NCBI records, not only "present" ones. |


## v22.3 — decision tree and wording corrections (14 Nov 2026)

No data or classification changed (132 taxa: absent 85, partial 42, present 5).

**Decision tree (Coverage page).** The previous SVG showed: "Any West African NCBI records? No → ABSENT; Yes → meets threshold? → records in both NCBI and BOLD? → PRESENT/PARTIAL". This did not match `overallStatus()` in `assets/js/data.js`, which scores NCBI and BOLD/SILVA separately (0 = absent, 1 to T−1 = partial, ≥T = present) and combines them (absent+absent = absent, present+present = present, otherwise partial). Status combinations across the 132 taxa:

| NCBI / BOLD | → overall | n |
|---|---|---|
| absent / absent | absent | 85 |
| partial / partial | partial | 19 |
| partial / absent | partial | 9 |
| absent / partial | partial | 7 |
| present / absent | partial | 4 |
| present / present | present | 5 |
| absent / present | partial | 1 |
| present / partial | partial | 1 |
| partial / present | partial | 1 |

The 8 taxa with absent NCBI but partial/present BOLD would have been "absent" under the old diagram; the table was always right. Stored BOLD statuses were re-checked against the threshold rule: 0 mismatches. The new diagram's outcome counts are filled in from `overallStatus()` at page load (jsdom test: 85/42/5 of 132, no script errors). The diagram was also visually broken (right-hand diamond clipped at the viewBox edge, unarrowed connector).

**Wording.**
- "undetectable in Nigerian eDNA" (Coverage ×2, Gap Analysis, Statistics tooltip) → no West African reference; assignments rely on non-regional sequences where these exist. E.g. *Tursiops truncatus* has 239 global NCBI COI records; it can be assigned, but not checked against local haplotypes.
- Coverage data-sources text: "cross-referencing … 10 global databases" (list actually names 11, and only 3 feed the classification) → NCBI, BOLD and SILVA compute status; the others supply names, occurrences, IUCN status.
- Worked examples re-checked against data.js: *P. elongatus* 12S NCBI 3 WA / BOLD 3 WA → present; *D. africana* 2 WA → partial; *T. truncatus* 239/168 global, 0 WA → absent; *M. cephalus* 64 12S, *S. lewini* 102 12S, 0 WA → absent; nematode SSU range 0–182 (Terschellingia 182). All correct.
- Citations: self-citation author format "Odedere, A.O."; Odedere & Rufai (2026) RSMS 103:105586 listed under publications. The "accessed" date was already filled in automatically (fallback text only).
- About: 16S rRNA marker line clarified (planned field marker; coverage tracked with COI); roadmap Phase 5 no longer says the website "launches".

**Still unverified on the About page (flagged to the curator):** BOLD Nematoda "132,070 specimen records … 79,150 with barcodes"; N:C ratio "<50 … >1,000"; EEZ "~210,000 km²".

### v22.3 — re-run and "any gene" totals (14 Nov 2026, later)

- Curator re-ran `Scripts/nmbl_v22_requery.py` (Biopython/BOLD v5/SILVA/WoRMS) on 14 Nov 2026. Results compared field by field with `data.js`: 107 taxa × 6 counts (NCBI/BOLD global, WA, Nigeria) = 0 differences; 25 nematode genera × 6 counts (SILVA SSU/LSU, NCBI 18S/28S WA and Nigeria) = 0 differences.
- New field `ncbi_all` (all NCBI nucleotide records for the taxon, any gene, organism search across current and accepted names, RefSeq excluded) added to all 107 species records from `nmbl_v22_all_records.csv`; shown in the pop-up as "All NCBI records (any gene)". Classification is unchanged — it uses the marker count only.
- Genus-level West African check (`nmbl_v22_mammal_wa_check.csv`): *Sousa* — 2 records with a West African country (MN365274 mitogenome, Senegal; EU380409 control region 335 bp, Mauritania). *Trichechus* — 0. Published West African manatee work (e.g. a "Thatcher et al. 2018" Senegal study the curator recalled — not located; Nigerian/Ghanaian/Cameroonian control-region studies) is not in GenBank with a West African country. Notes on both species updated.
- Wording: "Gulf of Guinea endemic(s)" → "West African endemic(s)" (8 places; ranges ≈ Senegal–Angola, *S. tritor* to the Canaries). *S. tritor*: "4 global 12S records, all from Guinea-Bissau" corrected to 3 of 4 (NCBI WA accessions PQ628824–26). *Sousa teuszii* range corrected from "Gulf of Guinea endemic" to Western Sahara–Angola.
- Files: `Data/v22.3/` (results JSON/CSV, all-records CSV, mammal check CSV, log).

### v22.3 — sourced claims and pop-up redesign (14 Nov 2026, later)

**Three unverified About-page claims — decisions**
1. *EEZ ~210,000 km²* — **kept, now cited**: 210,900 km² (Folami 2017, cited in Ateme 2021, *Maritime Technology and Research* 3(4)). Other published figures differ (e.g. a Navy statement of ~290,000 km² includes wider maritime space), so the cited source is given. Coastline "over 900 km" → about 850 km (853 km, CIA World Factbook). "patch coral reefs" removed (ODINAFRICA national report: coral reef area 0 km²); "offshore upwelling zones" (the main Gulf of Guinea upwelling is off Ghana/Côte d'Ivoire) → "shelf waters fed by Niger River discharge".
2. *BOLD Nematoda "132,070 records … 79,150 with barcodes … West African records in the dozens"* — **removed**: source not traceable and BOLD not reachable for re-query from this environment. Replaced with this site's verified counts: 25 genera, SILVA SSU 0–182 per genus, 2 genera with none, 0 West African/Nigerian 18S or 28S in SILVA or NCBI (14 Nov 2026 run). "species that eDNA metabarcoding cannot detect" removed (overstated).
3. *N:C ratio "baseline below 50 … exceeding 1,000"* — **removed**: no source supports these thresholds. Replaced with Raffaelli & Mason (1981) origin, Warwick (1981) grain-size dependence, and the 2022 *Ecología Austral* meta-analysis finding N:C unreliable as a stand-alone tool. Also corrected "nematodes are the most sensitive … bioindicators" — nematodes are the more *tolerant* group, which is why N:C rises with pollution.
Sources added to the Citations page. OBIS "accessed [date]" → November 2026.

**Pop-up.** Rewritten (`assets/js/popup.js`, styles in `styles.css`): status + per-database reason first; NCBI/BOLD (or SILVA 18S/28S) record table; details; notes with version history in a collapsible block; database links first. IUCN for macrobenthos was hard-coded "LC" and for marine taxa defaulted to "NE" in `search.js`; neither array has IUCN data, so the pop-up now says "not recorded on this site". "Location" relabelled "Project sampling area" (it is a fixed value per group). Search dropdown: removed empty photo placeholder; left-aligned text. Test: all 132 pop-ups opened in Chrome — 0 errors, pill = `overallStatus()` for all, record table present for all.

**Flagged to curator, not changed (taxon-list scope):** several taxa on the list are not known from the Gulf of Guinea — *Acropora palmata*, *Diadema antillarum*, *Thalassia testudinum* (Caribbean/W. Atlantic); *Holothuria atra*, *H. scabra*, *Telescopium telescopium*, *Gracilaria corticata* (Indo-Pacific); *Halophila stipulacea* (Red Sea/Indian Ocean, invasive elsewhere); *Hypanus marianae* (Brazilian endemic); *Scomber japonicus* (Pacific; the E. Atlantic chub mackerel is *S. colias*).

## v22.4 — ten non-regional taxa replaced (14 Nov 2026)

**Reason.** Ten list taxa are not recorded in the Gulf of Guinea, so their "absent" status did not measure a regional reference gap. Each was replaced by a documented West African species in the same group and with the same marker (curator decision, 14 Nov 2026).

| Removed | Why | Replacement | Distribution source | Marker | NCBI g/WA | BOLD g/WA | Overall | NCBI any gene |
|---|---|---|---|---|---|---|---|---|
| *Acropora palmata* | Caribbean | *Siderastrea radians* | São Tomé & Príncipe (Schleimer et al. 2025, Crustacean Research 54) | COI | 6/0 | 6/0 | absent | 109 |
| *Diadema antillarum* | W. Atlantic | *Diadema africanum* | Senegal, Ghana, São Tomé (Rodríguez et al. 2013, Zootaxa 3636) | COI | 244/12 (Cape Verde) | 244/12 | present | 258 |
| *Thalassia testudinum* | Caribbean | *Halodule wrightii* | Mauritania–Angola (Tavares et al. 2022, Front. Mar. Sci. 9:809721) | rbcL | 7/0 | 5/0 | absent | 249 |
| *Halophila stipulacea* | Red Sea / Indian Ocean | *Ruppia maritima* | One of four W. African seagrasses (Seagrasses of West Africa, Diversity 2022) | rbcL | 68/0 | 54/0 | absent | 431 |
| *Holothuria atra* | Indo-Pacific | *Holothuria dakarensis* | Ghana (Thandar & Mjobo 2014, Zootaxa 3900) | COI | 2/1 (Cape Verde) | 2/0 | partial | 4 |
| *Holothuria scabra* | Indo-Pacific | *Isostichopus maculatus* | Nigeria, Liberia (Borrero-Pérez et al. 2024) | COI | 16/0 | 0/0 | absent | 32 |
| *Telescopium telescopium* | Indo-West Pacific | *Littoraria angulifera* | Senegal–Angola mangroves | COI | 8/2 (Ghana, Senegal) | 10/2 | partial | 16 |
| *Gracilaria corticata* | Indo-Pacific | *Hypnea musciformis* | Abundant on Ghana coast (Ale et al. 2016, Diversity 8:14) | rbcL | 64/3 (Cape Verde) | 18/0 | partial | 290 |
| *Hypanus marianae* | Brazilian endemic | *Fontitrygon margarita* | W. African endemic; Lagos landings (TJNPR 2025, 9(7):3398) | 12S | 1/1 (Senegal) | 0/0 | partial | 17 |
| *Scomber japonicus* | Pacific | *Scomber colias* | Gulf of Guinea 10°N–16°S (Plazi/FishBase) | 12S | 8/0 | 0/0 | absent | 969 |

Counts from the curator's run of `Scripts/nmbl_v22_requery.py` (log 20:49–20:51, 14 Nov 2026); raw files in `Data/v22.4/`. Verification: all 107 records × 6 counts and `ncbi_all` match the run (0 differences); stored per-database statuses match the threshold rule (0 mismatches); 132/132 pop-ups open with status = `overallStatus()`.

**Totals:** absent 85 → 80, partial 42 → 46, present 5 → 6. High-priority gaps 40 → 39. IUCN-threatened vertebrates 8 (unchanged count).

**Open points for the curator**
- *Holothuria dakarensis* — **resolved 15 Nov 2026**: accepted in WoRMS as *Holothuria (Holothuria) dakarensis* Panning, 1939 (AphiaID 124495), the same species written with its subgenus; the script's exact-name lookup missed the subgeneric form, so "not in WoRMS" in the log is a lookup artefact. Type locality Dakar, Senegal. IUCN Least Concern (assessed 19 May 2010, via SeaLifeBase) added to the record. NCBI and BOLD file the species as *Holothuria dakarensis*, so the counts stand.
- *Fontitrygon margarita* IUCN — **resolved 15 Nov 2026**: curator confirmed Endangered (EN, 2021 assessment). The Vulnerable category in Wikipedia's infobox is not used.
- Common names: neither sea cucumber has an established English name; both shown as "Sea cucumber".
