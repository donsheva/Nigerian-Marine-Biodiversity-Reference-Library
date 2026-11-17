# v22.5 — nematode list revision (16 Nov 2026)

**Added (7):** *Sabatieria*, *Daptonema*, *Theristus*, *Paracomesoma*, *Dorylaimopsis*, *Halalaimus*, *Viscosia* — genera typical of tropical estuarine, lagoon and mangrove muds.
**Removed (3):** *Monhystera*, *Aphanolaimus*, *Plectus* — mainly terrestrial/freshwater; their counts remain in `Data/v22.4`.
**Corrections:** *Stylotheristus* → Monhysterida (Xyalidae); *Quadricoma* noted as subgenus *Tricoma (Quadricoma)* in WoRMS.

Run by the curator on 16 Nov 2026 with `Scripts/nmbl_v22_requery.py`, starting from the v22.4 cache, so only the new genera were queried
(WoRMS, SILVA SSU r144 / LSU r138.2, NCBI 18S/28S). Checks: all 261 cached entries are identical to v22.4; the 107 species results are
identical to v22.4; 7 new nematode entries. All new genera have 0 West African and 0 Nigerian 18S/28S records.

| Genus | SILVA SSU | SILVA LSU | NCBI 18S global | NCBI 28S global |
|---|---|---|---|---|
| Sabatieria | 228 | 41 | 315 | 96 |
| Daptonema | 101 | 7 | 128 | 24 |
| Theristus | 60 | 1 | 102 | 33 |
| Paracomesoma | 18 | 1 | 26 | 1 |
| Dorylaimopsis | 21 | 2 | 30 | 4 |
| Halalaimus | 79 | 42 | 94 | 46 |
| Viscosia | 44 | 18 | 64 | 24 |

Totals after v22.5: nematodes 29 genera across 7 orders; all taxa 136; absent 84, partial 46, present 6.

## Pollution responses (added 17 Nov 2026)
Each genus's `response` in `assets/js/data.js` is now literature-sourced (`evidence` field), with a `cp` (colonizer–persister) class where a source gives one:
Bongers et al. 1991 (MEPS 76:135–142); Charrier et al. 2023 (MEPS 720:95–116); Semprucci, Losi & Moreno 2015 (Med. Mar. Sci. 16:352–365, reviewing Moreno et al. 2011, Mirto et al. 2002/2014, Losi et al. 2012/2013, Danovaro et al. 1995);
Mutua 2016 (WIOJMS 15:55–66); Gyedu-Ababio & Baird (Ecotoxicol. Environ. Saf.). Totals: 17 tolerant, 5 sensitive, 3 intermediate, 4 not assessed.

## Habitat check
`worms_habitat_check.csv` — WoRMS environment flags fetched 17 Nov 2026. All nematode genera and meiofauna/protist taxa are marine or brackish.
Flagged outside the nematode/meiofauna lists: *Lanistes varicus* and *Sphaerium nodicostatum* (macrobenthos) are strictly freshwater in WoRMS.
