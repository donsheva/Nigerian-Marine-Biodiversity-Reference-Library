// ─── DATA (extracted verbatim from nigeria_reflib_dashboard_v21.html) ────────

const VERTEBRATES = [
  {name:"Ethmalosa fimbriata",         common:"Bonga shad",               group:"Fish",        marker:"12S", ncbi:"partial",bold:"partial", priority:"high",iucn:"LC",location:"Lagos Lagoon",habitat:"Estuarine/Coastal",notes:"v22.1 (Nov 2026): NCBI 3 global / 2 WA 12S (Guinea-Bissau 2); BOLD 2 global / 2 WA.",ncbi_global:3,ncbi_wa:2,ncbi_ng:0,bold_global:2,bold_wa:2,bold_ng:0,eco_notes:""},
  {name:"Sardinella maderensis",       common:"Madeiran sardinella",      group:"Fish",        marker:"12S", ncbi:"partial",bold:"partial",priority:"med", iucn:"LC",location:"Gulf of Guinea",habitat:"Marine/Pelagic",notes:"v22.1 (Nov 2026): NCBI 3 global / 2 WA 12S (Guinea-Bissau 2); BOLD 2 global / 2 WA.",ncbi_global:3,ncbi_wa:2,ncbi_ng:0,bold_global:2,bold_wa:2,bold_ng:0,eco_notes:"",boldTaxon:"Sardinella maderensis",genbank:"JX073750"},
  {name:"Sardinella aurita",           common:"Round sardinella",         group:"Fish",        marker:"12S", ncbi:"partial",bold:"partial",priority:"low", iucn:"LC",location:"Gulf of Guinea",habitat:"Marine/Pelagic",notes:"v22.1 (Nov 2026): NCBI 12 global / 1 WA 12S (Guinea-Bissau 1); BOLD 1 global / 1 WA.",ncbi_global:12,ncbi_wa:1,ncbi_ng:0,bold_global:1,bold_wa:1,bold_ng:0,eco_notes:"",genbank:"KF929356",boldTaxon:"Sardinella aurita"},
  {name:"Pseudotolithus senegalensis", common:"Cassava croaker",          group:"Fish",        marker:"12S", ncbi:"partial", bold:"absent", priority:"high",iucn:"LC",location:"Niger Delta",habitat:"Coastal/Estuarine",notes:"Top commercial demersal. v22.1 (Nov 2026): NCBI 2 global / 2 WA 12S (Guinea-Bissau 2); BOLD 0 global / 0 WA.",ncbi_global:2,ncbi_wa:2,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0,eco_notes:"Top commercial demersal"},
  {name:"Pseudotolithus elongatus",    common:"Bobo croaker",             group:"Fish",        marker:"12S", ncbi:"present", bold:"present", priority:"high",iucn:"LC",location:"Niger Delta",habitat:"Coastal/Demersal",notes:"v22.1 (Nov 2026): NCBI 4 global / 3 WA 12S (Guinea-Bissau 3); BOLD 3 global / 3 WA.",ncbi_global:4,ncbi_wa:3,ncbi_ng:0,bold_global:3,bold_wa:3,bold_ng:0,eco_notes:""},
  {name:"Cynoglossus senegalensis",    common:"Senegalese tonguesole",    group:"Fish",        marker:"12S", ncbi:"absent", bold:"absent", priority:"high",iucn:"LC",location:"Gulf of Guinea",habitat:"Demersal/Soft sediment",notes:"Abundant bycatch; no West African sequences. v22.1 (Nov 2026): NCBI 1 global / 0 WA 12S; BOLD 0 global / 0 WA.",ncbi_global:1,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0,eco_notes:"Abundant bycatch; no West African sequences"},
  {name:"Galeoides decadactylus",      common:"Lesser African threadfin", group:"Fish",        marker:"12S", ncbi:"partial", bold:"partial", priority:"high",iucn:"LC",location:"Lagos/Niger Delta",habitat:"Coastal/Estuarine",notes:"Key artisanal species. v22.1 (Nov 2026): NCBI 2 global / 1 WA 12S (Guinea-Bissau 1); BOLD 1 global / 1 WA.",ncbi_global:2,ncbi_wa:1,ncbi_ng:0,bold_global:1,bold_wa:1,bold_ng:0,eco_notes:"Key artisanal species"},
  {name:"Polydactylus quadrifilis",    common:"Giant African threadfin",  group:"Fish",        marker:"12S", ncbi:"partial",bold:"partial", priority:"high",iucn:"LC",location:"Lagos Lagoon",habitat:"Coastal/Estuarine",notes:"v22.1 (Nov 2026): NCBI 3 global / 2 WA 12S (Guinea-Bissau 2); BOLD 2 global / 2 WA.",ncbi_global:3,ncbi_wa:2,ncbi_ng:0,bold_global:2,bold_wa:2,bold_ng:0,eco_notes:""},
  {name:"Lutjanus agennes",            common:"African red snapper",      group:"Fish",        marker:"12S", ncbi:"absent", bold:"partial", priority:"high",iucn:"LC",location:"Gulf of Guinea",habitat:"Reef/Rocky substrate",notes:"Reef-associated; no NCBI sequences. v22.1 (Nov 2026): NCBI 0 global / 0 WA 12S; BOLD 1 global / 1 WA.",ncbi_global:0,ncbi_wa:0,ncbi_ng:0,bold_global:1,bold_wa:1,bold_ng:0,eco_notes:"Reef-associated; no NCBI sequences"},
  {name:"Arius latiscutatus",          common:"Rough-head sea catfish",   group:"Fish",        marker:"12S", ncbi:"partial", bold:"partial", priority:"high",iucn:"LC",location:"Niger Delta",habitat:"Estuarine/Mangrove",notes:"Dominant estuarine catfish; WoRMS: Carlarius latiscutatus. v22.1 (Nov 2026): NCBI 3 global / 2 WA 12S (Guinea-Bissau 2); BOLD 2 global / 2 WA. Accepted name (WoRMS): Carlarius latiscutatus — counts include both names.",ncbi_global:3,ncbi_wa:2,ncbi_ng:0,bold_global:2,bold_wa:2,bold_ng:0,eco_notes:"Dominant estuarine catfish; WoRMS: Carlarius latiscutatus",accepted_name:"Carlarius latiscutatus"},
  {name:"Brachydeuterus auritus",      common:"Bigeye grunt",             group:"Fish",        marker:"12S", ncbi:"absent", bold:"partial", priority:"med", iucn:"LC",location:"Gulf of Guinea",habitat:"Coastal/Demersal",notes:"Abundant in trawl surveys. v22.1 (Nov 2026): NCBI 0 global / 0 WA 12S; BOLD 1 global / 1 WA.",ncbi_global:0,ncbi_wa:0,ncbi_ng:0,bold_global:1,bold_wa:1,bold_ng:0,eco_notes:"Abundant in trawl surveys"},
  {name:"Pomadasys jubelini",          common:"Sompat grunt",             group:"Fish",        marker:"12S", ncbi:"absent",bold:"partial", priority:"med", iucn:"LC",location:"Lagos Lagoon",habitat:"Estuarine/Nearshore",notes:"Estuarine and nearshore. v22.1 (Nov 2026): NCBI 0 global / 0 WA 12S; BOLD 2 global / 2 WA.",ncbi_global:0,ncbi_wa:0,ncbi_ng:0,bold_global:2,bold_wa:2,bold_ng:0,eco_notes:"Estuarine and nearshore"},
  {name:"Elops lacerta",               common:"West African ladyfish",    group:"Fish",        marker:"12S", ncbi:"partial", bold:"partial", priority:"med", iucn:"LC",location:"Gulf of Guinea",habitat:"Coastal/Estuarine",notes:"Coastal; underrepresented. v22.1 (Nov 2026): NCBI 1 global / 1 WA 12S (Guinea-Bissau 1); BOLD 1 global / 1 WA.",ncbi_global:1,ncbi_wa:1,ncbi_ng:0,bold_global:1,bold_wa:1,bold_ng:0,eco_notes:"Coastal; underrepresented"},
  {name:"Drepane africana",            common:"African sicklefish",       group:"Fish",        marker:"12S", ncbi:"partial", bold:"partial", priority:"med", iucn:"LC",location:"Gulf of Guinea",habitat:"Coastal/Sandy substrate",notes:"v22.1 (Nov 2026): NCBI 5 global / 2 WA 12S (Guinea-Bissau 2); BOLD 2 global / 2 WA.",ncbi_global:5,ncbi_wa:2,ncbi_ng:0,bold_global:2,bold_wa:2,bold_ng:0,eco_notes:""},
  {name:"Mugil cephalus",              common:"Flathead mullet",          group:"Fish",        marker:"12S", ncbi:"absent",bold:"absent",priority:"low", iucn:"LC",location:"Lagos Lagoon",habitat:"Coastal/Estuarine",notes:"Cosmopolitan; well covered globally but no West African 12S references. v22.1 (Nov 2026): NCBI 64 global / 0 WA 12S; BOLD 3 global / 0 WA.",ncbi_global:64,ncbi_wa:0,ncbi_ng:0,bold_global:3,bold_wa:0,bold_ng:0,eco_notes:"Cosmopolitan; well covered globally but no West African 12S references",genbank:"AF247431",boldTaxon:"Mugil cephalus"},
  {name:"Chrysichthys nigrodigitatus", common:"Bagrid catfish",           group:"Fish",        marker:"12S", ncbi:"partial",bold:"partial", priority:"med", iucn:"LC",location:"Lagos Lagoon",habitat:"Freshwater/Estuarine",notes:"Common in Lagos Lagoon. v22.1 (Nov 2026): NCBI 2 global / 1 WA 12S (Guinea-Bissau 1); BOLD 1 global / 1 WA.",ncbi_global:2,ncbi_wa:1,ncbi_ng:0,bold_global:1,bold_wa:1,bold_ng:0,eco_notes:"Common in Lagos Lagoon"},
  {name:"Rhizoprionodon acutus",       common:"Milk shark",               group:"Elasmobranch",marker:"12S", ncbi:"absent",bold:"absent", priority:"high",iucn:"NT",location:"Gulf of Guinea",habitat:"Inshore/Coastal",notes:"v22.1 (Nov 2026): NCBI 2 global / 0 WA 12S; BOLD 0 global / 0 WA.",ncbi_global:2,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0,eco_notes:""},
  {name:"Rhinobatos rhinobatos",       common:"Common guitarfish",        group:"Elasmobranch",marker:"12S", ncbi:"absent",bold:"partial", priority:"high",iucn:"CR",location:"Gulf of Guinea",habitat:"Inshore/Sandy substrate",notes:"Critically endangered; major WA gap. v22.1 (Nov 2026): NCBI 0 global / 0 WA 12S; BOLD 1 global / 1 WA.",ncbi_global:0,ncbi_wa:0,ncbi_ng:0,bold_global:1,bold_wa:1,bold_ng:0,eco_notes:"Critically endangered; major WA gap"},
  {name:"Hypanus marianae",            common:"Large-eyed stingray",      group:"Elasmobranch",marker:"12S", ncbi:"absent", bold:"absent", priority:"high",iucn:"VU",location:"Gulf of Guinea",habitat:"Inshore/Sandy substrate",notes:"Inshore stingray; no West African sequences — IUCN VU (verify). v22.1 (Nov 2026): NCBI 29 global / 0 WA 12S; BOLD 0 global / 0 WA (no BOLD records found).",ncbi_global:29,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0,eco_notes:"Inshore stingray; no West African sequences — IUCN VU (verify)"},
  {name:"Carcharhinus leucas",         common:"Bull shark",               group:"Elasmobranch",marker:"12S", ncbi:"partial",bold:"absent",priority:"med", iucn:"NT",location:"Lagos/Niger Delta",habitat:"Coastal/Estuarine",notes:"v22.1 (Nov 2026): NCBI 375 global / 1 WA 12S (Sierra Leone 1); BOLD 0 global / 0 WA.",ncbi_global:375,ncbi_wa:1,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0,eco_notes:"",genbank:"AY283758",boldTaxon:"Carcharhinus leucas"},
  {name:"Sphyrna lewini",              common:"Scalloped hammerhead",     group:"Elasmobranch",marker:"12S", ncbi:"absent",bold:"absent",priority:"med", iucn:"CR",location:"Gulf of Guinea",habitat:"Coastal/Offshore",notes:"v22.1 (Nov 2026): NCBI 102 global / 0 WA 12S; BOLD 0 global / 0 WA.",ncbi_global:102,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0,eco_notes:"",genbank:"AY048578",boldTaxon:"Sphyrna lewini"},
  {name:"Penaeus notialis",            common:"Southern pink shrimp",     group:"Crustacean",  marker:"COI", ncbi:"absent",bold:"absent", priority:"high",iucn:"LC",location:"Niger Delta",habitat:"Shallow marine/Estuarine",notes:"v22.1 (Nov 2026): NCBI 50 global / 0 WA COI; BOLD 16 global / 0 WA. Accepted name (WoRMS): Penaeus (Farfantepenaeus) notialis — counts include both names.",ncbi_global:50,ncbi_wa:0,ncbi_ng:0,bold_global:16,bold_wa:0,bold_ng:0,eco_notes:"",genbank:"KM243344",boldTaxon:"Penaeus notialis",accepted_name:"Penaeus (Farfantepenaeus) notialis"},
  {name:"Callinectes amnicola",        common:"Swimming crab",            group:"Crustacean",  marker:"COI", ncbi:"partial", bold:"partial", priority:"high",iucn:"DD",location:"Lagos Lagoon",habitat:"Estuarine/Lagoon",notes:"Dominant brachyuran. v22.1 (Nov 2026): NCBI 3 global / 1 WA COI (Ghana 1); BOLD 3 global / 1 WA.",ncbi_global:3,ncbi_wa:1,ncbi_ng:0,bold_global:3,bold_wa:1,bold_ng:0,eco_notes:"Dominant brachyuran"},
  {name:"Parapenaeus longirostris",    common:"Deep-water rose shrimp",   group:"Crustacean",  marker:"COI", ncbi:"absent",bold:"partial",priority:"med", iucn:"LC",location:"Gulf of Guinea",habitat:"Offshore/Deep",notes:"v22.1 (Nov 2026): NCBI 29 global / 0 WA COI; BOLD 38 global / 1 WA.",ncbi_global:29,ncbi_wa:0,ncbi_ng:0,bold_global:38,bold_wa:1,bold_ng:0,eco_notes:"",boldTaxon:"Parapenaeus longirostris"},
  {name:"Macrobrachium vollenhovenii", common:"African river prawn",      group:"Crustacean",  marker:"COI", ncbi:"partial",bold:"partial", priority:"med", iucn:"LC",location:"Niger Delta",habitat:"Freshwater/Estuarine",notes:"Estuarine/freshwater overlap. v22.1 (Nov 2026): NCBI 3 global / 2 WA COI (Nigeria 2); BOLD 3 global / 2 WA.",ncbi_global:3,ncbi_wa:2,ncbi_ng:2,bold_global:3,bold_wa:2,bold_ng:2,eco_notes:"Estuarine/freshwater overlap"},
  {name:"Trichechus senegalensis",     common:"African manatee",          group:"Mammal",      marker:"COI", ncbi:"absent",bold:"absent", priority:"high",iucn:"VU",location:"Lagos Lagoon",habitat:"Lagoon/Mangrove/Riverine",notes:"CITES Appendix I; data-deficient in Nigeria. One partial mitochondrial genome in GenBank (MW073827; Republic of the Congo, outside the West African filter), which contains both COI and 12S. So the species has one COI and one 12S reference sequence globally and none from West Africa or Nigeria. No BOLD records. Earlier versions (to v21) reported zero because searches matched the marker name in record titles only and missed mitogenomes (corrected in v22). v22.1 (Nov 2026): NCBI 1 global / 0 WA COI; BOLD 0 global / 0 WA.",ncbi_global:1,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0,eco_notes:"",genbank:"MW073827"},
  {name:"Sousa teuszii",               common:"Atlantic humpback dolphin",group:"Mammal",      marker:"COI", ncbi:"partial",bold:"absent", priority:"high",iucn:"CR",location:"Gulf of Guinea",habitat:"Coastal/Marine",notes:"Critically endangered; Gulf of Guinea endemic. One complete mitochondrial genome in GenBank (MN365274; RefSeq copy NC_045404): vouchered specimen USNM:MAMM:605133, Senegal, 2018. A mitogenome contains both COI and 12S, so the species has exactly one COI and one 12S reference sequence — West African, but none from Nigeria. No BOLD records. Earlier versions (to v21) reported zero because searches matched the marker name in record titles only and missed mitogenomes (corrected in v22). v22.1 (Nov 2026): NCBI 1 global / 1 WA COI (Senegal 1); BOLD 0 global / 0 WA.",ncbi_global:1,ncbi_wa:1,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0,eco_notes:"",genbank:"MN365274"},
  {name:"Tursiops truncatus",          common:"Bottlenose dolphin",       group:"Mammal",      marker:"COI", ncbi:"absent",bold:"absent",priority:"med", iucn:"LC",location:"Gulf of Guinea",habitat:"Coastal/Offshore",notes:"v22.1 (Nov 2026): NCBI 239 global / 0 WA COI; BOLD 168 global / 0 WA.",ncbi_global:239,ncbi_wa:0,ncbi_ng:0,bold_global:168,bold_wa:0,bold_ng:0,eco_notes:"",genbank:"AF055847",boldTaxon:"Tursiops truncatus"},
  {name:"Chelonia mydas",              common:"Green sea turtle",         group:"Turtle",      marker:"12S", ncbi:"absent",bold:"absent",priority:"med", iucn:"EN",location:"Gulf of Guinea",habitat:"Marine/Nesting beaches",notes:"v22.1 (Nov 2026): NCBI 20 global / 0 WA 12S; BOLD 0 global / 0 WA.",ncbi_global:20,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0,eco_notes:"",genbank:"AJ238583",boldTaxon:"Chelonia mydas"},
  {name:"Dermochelys coriacea",        common:"Leatherback turtle",       group:"Turtle",      marker:"12S", ncbi:"absent",bold:"absent",priority:"med", iucn:"VU",location:"Gulf of Guinea",habitat:"Marine/Offshore",notes:"v22.1 (Nov 2026): NCBI 10 global / 0 WA 12S; BOLD 0 global / 0 WA.",ncbi_global:10,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0,eco_notes:"",genbank:"AJ131457",boldTaxon:"Dermochelys coriacea"},
  {name:"Lepidochelys olivacea",       common:"Olive ridley turtle",      group:"Turtle",      marker:"12S", ncbi:"absent",bold:"absent",priority:"med", iucn:"VU",location:"Gulf of Guinea",habitat:"Marine/Coastal",notes:"v22.1 (Nov 2026): NCBI 8 global / 0 WA 12S; BOLD 0 global / 0 WA.",ncbi_global:8,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0,eco_notes:""},
];

const MEIOFAUNA_OTHER = [
  {name:"Harpacticoida",   common:"Harpacticoid copepods", group:"Meiofauna",marker:"18S",ncbi:"absent",bold:"absent",priority:"high",notes:"N:C ratio denominator; key bioindicator. v22.1 (Nov 2026): NCBI 1499 global / 0 WA 18S; BOLD 150 global / 0 WA.",ncbi_global:1499,ncbi_wa:0,ncbi_ng:0,bold_global:150,bold_wa:0,bold_ng:0},
  {name:"Ostracoda",       common:"Ostracods",             group:"Meiofauna",marker:"COI", ncbi:"partial",bold:"partial",priority:"med", notes:"Sediment archive; pollution record. v22.1 (Nov 2026): NCBI 5594 global / 3 WA COI (Cape Verde 3); BOLD 7018 global / 3 WA.",ncbi_global:5594,ncbi_wa:3,ncbi_ng:0,bold_global:7018,bold_wa:3,bold_ng:0},
  {name:"Tardigrada",      common:"Water bears",           group:"Meiofauna",marker:"18S",ncbi:"absent",bold:"absent",priority:"med", notes:"Sandy sediment specialist. v22.1 (Nov 2026): NCBI 3762 global / 0 WA 18S; BOLD 2306 global / 0 WA.",ncbi_global:3762,ncbi_wa:0,ncbi_ng:0,bold_global:2306,bold_wa:0,bold_ng:0},
  {name:"Gastrotricha",    common:"Gastrotrichs",          group:"Meiofauna",marker:"18S",ncbi:"absent", bold:"absent",priority:"med", notes:"Fine sediment indicator. v22.1 (Nov 2026): NCBI 874 global / 0 WA 18S; BOLD 575 global / 0 WA.",ncbi_global:874,ncbi_wa:0,ncbi_ng:0,bold_global:575,bold_wa:0,bold_ng:0},
  {name:"Kinorhyncha",     common:"Mud dragons",           group:"Meiofauna",marker:"18S",ncbi:"absent", bold:"absent",priority:"med", notes:"Subtidal mud specialist. v22.1 (Nov 2026): NCBI 112 global / 0 WA 18S; BOLD 96 global / 0 WA.",ncbi_global:112,ncbi_wa:0,ncbi_ng:0,bold_global:96,bold_wa:0,bold_ng:0},
  {name:"Foraminifera",    common:"Foraminifera",          group:"Protist",  marker:"18S",ncbi:"absent",bold:"absent",priority:"high",notes:"Sediment archive; historical baseline. v22.1 (Nov 2026): NCBI 21519 global / 0 WA 18S; BOLD 0 global / 0 WA.",ncbi_global:21519,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0},
  {name:"Ciliophora",      common:"Ciliates",              group:"Protist",  marker:"18S",ncbi:"present",bold:"absent",priority:"med", notes:"Organic matter processors. v22.1 (Nov 2026): NCBI 20113 global / 137 WA 18S (Cameroon 36, Benin 97, Cape Verde 1, Guinea 1, Sierra Leone 1, Ghana 1); BOLD 0 global / 0 WA.",ncbi_global:20113,ncbi_wa:137,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0},
  {name:"Bacillariophyta", common:"Diatoms",               group:"Protist",  marker:"18S",ncbi:"present",bold:"absent",priority:"med", notes:"Primary producers; water quality. v22.1 (Nov 2026): NCBI 17068 global / 17 WA 18S (Senegal 1, Nigeria 16); BOLD 326 global / 0 WA.",ncbi_global:17068,ncbi_wa:17,ncbi_ng:16,bold_global:326,bold_wa:0,bold_ng:0},
  {name:"Polychaeta",      common:"Polychaete worms",      group:"Meiofauna",marker:"COI", ncbi:"present",bold:"present",priority:"high",notes:"Key organic enrichment indicator. v22.1 (Nov 2026): NCBI 33820 global / 99 WA COI (Guinea-Bissau 4, Mauritania 8, Senegal 3, Guinea 3, Nigeria 4, Cape Verde 74, Sierra Leone 1, Ghana 2); BOLD 51528 global / 132 WA.",ncbi_global:33820,ncbi_wa:99,ncbi_ng:4,bold_global:51528,bold_wa:132,bold_ng:9},
];

// v22 (Nov 2026): global18s = SILVA SSU r144, global28s = SILVA LSU r138.2 (genus-level, organism-name match);
// wa/ng = INSDC GenBank country field (0 for all 25 genera). Previous figures could not be reproduced from any source.
const NEMATODES = [
  {genus:"Chromadora",        order:"Chromadorida",   response:"tolerant",  global18s:6, wa18s:0, ng18s:0, global28s:1, ng28s:0, wa28s:0, role:"Enrichment tolerant; increases with pollution"},
  {genus:"Chromadorita",      order:"Chromadorida",   response:"tolerant",  global18s:66, wa18s:0,  ng18s:0, global28s:51, ng28s:0, wa28s:0, role:"Enrichment tolerant"},
  {genus:"Ptycholaimellus",   order:"Chromadorida",   response:"tolerant",  global18s:55,  wa18s:0,  ng18s:0, global28s:0, ng28s:0, wa28s:0, role:"Organic enrichment indicator"},
  {genus:"Dichromadora",      order:"Chromadorida",   response:"tolerant",  global18s:38,  wa18s:0,  ng18s:0, global28s:2, ng28s:0, wa28s:0, role:"Tolerant generalist"},
  {genus:"Innocuonema",       order:"Chromadorida",   response:"tolerant",  global18s:2,  wa18s:0,  ng18s:0, global28s:0,  ng28s:0, wa28s:0, role:"Sandy sediment tolerant"},
  {genus:"Desmodora",         order:"Desmodorida",    response:"tolerant",  global18s:37, wa18s:0,  ng18s:0, global28s:2, ng28s:0, wa28s:0, role:"Hypoxia tolerant; sulphidic sediment"},
  {genus:"Spirinia",          order:"Desmodorida",    response:"tolerant",  global18s:20,  wa18s:0,  ng18s:0, global28s:3, ng28s:0, wa28s:0, role:"Hypoxia tolerant"},
  {genus:"Metachromadora",    order:"Desmodorida",    response:"tolerant",  global18s:27,  wa18s:0,  ng18s:0, global28s:3, ng28s:0, wa28s:0, role:"Organic enrichment associated"},
  {genus:"Monhystera",        order:"Monhysterida",   response:"indicator", global18s:26, wa18s:0, ng18s:0, global28s:38,ng28s:0, wa28s:0, role:"Disturbance opportunist; rises after spills"},
  {genus:"Terschellingia",    order:"Monhysterida",   response:"indicator", global18s:182,  wa18s:0,  ng18s:0, global28s:0, ng28s:0, wa28s:0, role:"Organic enrichment / sulphide indicator"},
  {genus:"Diplolaimelloides", order:"Monhysterida",   response:"indicator", global18s:138,  wa18s:0,  ng18s:0, global28s:0, ng28s:0, wa28s:0, role:"Organic enrichment indicator"},
  {genus:"Sphaerolaimus",     order:"Monhysterida",   response:"indicator", global18s:60,  wa18s:0,  ng18s:0, global28s:3, ng28s:0, wa28s:0, role:"Sulphide-rich sediment indicator"},
  {genus:"Enoplus",           order:"Enoplida",       response:"sensitive", global18s:19, wa18s:0,  ng18s:0, global28s:2, ng28s:0, wa28s:0, role:"Pollution sensitive; baseline reference"},
  {genus:"Thoracostoma",      order:"Enoplida",       response:"sensitive", global18s:2,  wa18s:0,  ng18s:0, global28s:6, ng28s:0, wa28s:0, role:"Pollution sensitive; clean sediment"},
  {genus:"Eurystomina",       order:"Enoplida",       response:"sensitive", global18s:10,  wa18s:0,  ng18s:0, global28s:0, ng28s:0, wa28s:0, role:"Pollution sensitive"},
  {genus:"Oxystomina",        order:"Enoplida",       response:"sensitive", global18s:42,  wa18s:0,  ng18s:0, global28s:22, ng28s:0, wa28s:0, role:"Clean sediment specialist"},
  {genus:"Axonolaimus",       order:"Araeolaimida",   response:"other",     global18s:17,  wa18s:0,  ng18s:0, global28s:2, ng28s:0, wa28s:0, role:"Deposit feeder; fine sediment"},
  {genus:"Odontophora",       order:"Araeolaimida",   response:"other",     global18s:12,  wa18s:0,  ng18s:0, global28s:7, ng28s:0, wa28s:0, role:"Deposit feeder"},
  {genus:"Campylaimus",       order:"Araeolaimida",   response:"other",     global18s:4,  wa18s:0,  ng18s:0, global28s:0, ng28s:0, wa28s:0, role:"Deposit feeder"},
  {genus:"Desmoscolex",       order:"Desmoscolecida", response:"other",     global18s:17, wa18s:0,  ng18s:0, global28s:0, ng28s:0, wa28s:0, role:"Sandy sediment specialist"},
  {genus:"Quadricoma",        order:"Desmoscolecida", response:"other",     global18s:0,  wa18s:0,  ng18s:0, global28s:0, ng28s:0, wa28s:0, role:"Sandy sediment specialist"},
  {genus:"Aphanolaimus",      order:"Araeolaimida",   response:"other",     global18s:3,  wa18s:0,  ng18s:0, global28s:4,  ng28s:0, wa28s:0, role:"Fine sediment generalist"},
  {genus:"Stylotheristus",    order:"Desmodorida",    response:"other",     global18s:0,  wa18s:0,  ng18s:0, global28s:0,  ng28s:0, wa28s:0, role:"Mangrove sediment associated"},
  {genus:"Pellioditis",       order:"Rhabditida",     response:"indicator", global18s:37, wa18s:0,  ng18s:0, global28s:45, ng28s:0, wa28s:0, role:"Organic matter indicator"},
  {genus:"Plectus",           order:"Plectida",       response:"other",     global18s:181, wa18s:0,  ng18s:0, global28s:77, ng28s:0, wa28s:0, role:"Generalist; broad habitat"},
];

// Combine all taxa into one flat list for "All taxa" tab
const ALL_TAXA = [
  ...VERTEBRATES.map(s => ({...s, bold_silva: s.bold, section:"vertebrate"})),
  ...MEIOFAUNA_OTHER.map(s => ({name:s.name, common:s.common, group:s.group, marker:s.marker,
    ncbi:s.ncbi, bold_silva:s.bold, priority:s.priority, notes:s.notes, section:"meiofauna"})),
  ...NEMATODES.map(n => ({name:n.genus, common:n.role.split(";")[0].trim(), group:"Nematode",
    // v22.1: same v21 rule as all other taxa — status follows West African records (18S threshold >= 1).
    // SILVA is built from INSDC, so its WA count equals the NCBI WA count (wa18s).
    marker:"18S", ncbi_wa:n.wa18s, ncbi: n.wa18s>=1?"present":"absent",
    bold_silva: n.wa18s>=1?"present":"absent",
    priority: n.ng18s===0&&n.global18s>0?"high": n.global18s===0?"high":"med",
    notes:n.role, section:"nematode"})),
];

function iucnBadge(status) {
  if (!status) return '<span class="badge iucn-ne">NE</span>';
  const cls = 'iucn-' + status.toLowerCase().replace('/','');
  const labels = {LC:'Least Concern',NT:'Near Threatened',VU:'Vulnerable',EN:'Endangered',CR:'Critically Endangered',EW:'Extinct in Wild',EX:'Extinct',DD:'Data Deficient',NE:'Not Evaluated'};
  return '<span class="badge ' + cls + '" title="' + (labels[status]||status) + '">' + status + '</span>';
}

// ─── CLASSIFICATION RULE (v21 thresholds; v22 data, Nov 2026) ────────────────────────────────────────────
// Marker-specific absolute West African record thresholds.
// Rationale: "present" must mean the WA reference library is operationally
// sufficient for reliable ID using that marker — not a ratio of global count.
// Thresholds reflect intraspecific variation coverage needs per marker:
//   COI  ≥5  — fast-evolving animal barcode; multiple haplotypes needed
//   12S  ≥3  — vertebrate eDNA marker; more conserved than COI
//   18S  ≥1  — genus-level work; single reference operationally useful
//   28S  ≥1  — genus-level metazoan marker
//   rbcL ≥3  — plant/algal barcode
// Classification is driven by WA record count alone. Global counts are
// shown as context but no longer classify (the v20 50% ratio is retired).
const WA_THRESHOLD = { COI:5, '12S':3, '18S':1, '28S':1, rbcL:3 };

function ncbiEffectiveStatus(s) {
  if (s.ncbi_wa !== undefined) {
    const thr = WA_THRESHOLD[s.marker] !== undefined ? WA_THRESHOLD[s.marker] : 3;
    if (s.ncbi_wa === 0) return "absent";        // zero WA = WA reference absent
    if (s.ncbi_wa >= thr) return "present";       // sufficient WA records
    return "partial";                             // 1..(threshold-1) WA records
  }
  return s.ncbi;  // unqueried species: use stored classification
}

function overallStatus(s) {
  const ncbi = ncbiEffectiveStatus(s);
  const bold = s.bold_silva || s.bold;
  if (ncbi==="absent" && bold==="absent") return "absent";
  if (ncbi==="present" && bold==="present") return "present";
  return "partial";
}

// Shared classification helpers — used by search.js (loaded on every page)
// as well as render.js's group-specific tables, so they live here in data.js
// rather than render.js.
function macroStatus(s) {
  if(s.ncbi==="absent"&&s.bold==="absent") return "absent";
  if(s.ncbi==="present"&&s.bold==="present") return "present";
  return "partial";
}

function marineStatus(s) {
  if(s.ncbi==="absent"&&s.bold==="absent") return "absent";
  if(s.ncbi==="present"&&s.bold==="present") return "present";
  return "partial";
}

function nemaGapStatus(n) {
  if(n.global18s===0) return "unsequenced";
  if(n.ng18s===0)     return "nigeria-gap";
  return "present";
}

// ─── MACROBENTHOS DATA ─────────────────────────────────────────────────────
// priority species flagged with star for highlighting
const MACROBENTHOS = [
  // GASTROPODS — Potamididae (mangrove/estuarine snails)
  {name:"Tympanotonos fuscatus",   common:"Mud periwinkle / Isam", group:"Gastropod", habitat:"mangrove",   marker:"COI", ncbi:"partial",bold:"absent", priority:"high", star:true,  notes:"v22.1 (Nov 2026): NCBI 3 global / 3 WA COI (Gambia 1, Ghana 2); BOLD 0 global / 0 WA (no BOLD records found).",ncbi_global:3,ncbi_wa:3,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0},
  {name:"Tympanotonos radula",     common:"Radula periwinkle",     group:"Gastropod", habitat:"mangrove",   marker:"COI", ncbi:"partial", bold:"absent", priority:"high", star:false, notes:"Synonym of Tympanotonos fuscatus (WoRMS) — same species; counts are identical to the T. fuscatus entry and should not be added to it. v22.1 (Nov 2026): NCBI 3 global / 3 WA COI (Gambia 1, Ghana 2); BOLD 0 global / 0 WA (no BOLD records found).",ncbi_global:3,ncbi_wa:3,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0,synonym_of:"Tympanotonos fuscatus"},
  {name:"Pachymelania aurita",     common:"Eared mud snail",       group:"Gastropod", habitat:"estuarine",  marker:"COI", ncbi:"absent",bold:"present", priority:"high", star:true,  notes:"v22.1 (Nov 2026): NCBI 0 global / 0 WA COI; BOLD 5 global / 5 WA.",ncbi_global:0,ncbi_wa:0,ncbi_ng:0,bold_global:5,bold_wa:5,bold_ng:5},
  {name:"Pachymelania fusca",      common:"Fusca mud snail",       group:"Gastropod", habitat:"estuarine",  marker:"COI", ncbi:"absent", bold:"partial", priority:"high", star:false, notes:"v22.1 (Nov 2026): NCBI 0 global / 0 WA COI; BOLD 3 global / 3 WA.",ncbi_global:0,ncbi_wa:0,ncbi_ng:0,bold_global:3,bold_wa:3,bold_ng:3},
  {name:"Telescopium telescopium", common:"Telescope snail",       group:"Gastropod", habitat:"mangrove",   marker:"COI", ncbi:"absent",bold:"absent",priority:"med",  star:false, notes:"Mangrove gastropod; some Indo-Pacific records. v22.1 (Nov 2026): NCBI 51 global / 0 WA COI; BOLD 50 global / 0 WA.",ncbi_global:51,ncbi_wa:0,ncbi_ng:0,bold_global:50,bold_wa:0,bold_ng:0},
  {name:"Neritina glabrata",       common:"Smooth nerite",         group:"Gastropod", habitat:"estuarine",  marker:"COI", ncbi:"absent", bold:"absent", priority:"med",  star:false, notes:"Freshwater-estuarine snail; Lagos Lagoon. v22.1 (Nov 2026): NCBI 0 global / 0 WA COI; BOLD 0 global / 0 WA (no BOLD records found). Accepted name (WoRMS): Vitta glabrata — counts include both names.",ncbi_global:0,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0,accepted_name:"Vitta glabrata"},
  {name:"Lanistes varicus",        common:"Apple snail",           group:"Gastropod", habitat:"estuarine",  marker:"COI", ncbi:"absent",bold:"absent", priority:"med",  star:false, notes:"Freshwater/brackish; Niger Delta. v22.1 (Nov 2026): NCBI 2 global / 0 WA COI; BOLD 0 global / 0 WA (no BOLD records found).",ncbi_global:2,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0},
  // BIVALVES
  {name:"Crassostrea gasar",       common:"Mangrove oyster",       group:"Bivalve",   habitat:"mangrove",   marker:"COI", ncbi:"absent",bold:"absent",priority:"high", star:false, notes:"v22.1 (Nov 2026): NCBI 32 global / 0 WA COI; BOLD 54 global / 0 WA. Accepted name (WoRMS): Crassostrea tulipa — counts include both names.",ncbi_global:32,ncbi_wa:0,ncbi_ng:0,bold_global:54,bold_wa:0,bold_ng:0,accepted_name:"Crassostrea tulipa"},
  {name:"Egeria radiata",          common:"Estuarine clam",        group:"Bivalve",   habitat:"estuarine",  marker:"COI", ncbi:"partial", bold:"absent", priority:"high", star:false, notes:"v22.1 (Nov 2026): NCBI 2 global / 2 WA COI (Ghana 2); BOLD 0 global / 0 WA (no BOLD records found). Accepted name (WoRMS): Galatea paradoxa — counts include both names.",ncbi_global:2,ncbi_wa:2,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0,accepted_name:"Galatea paradoxa"},
  {name:"Senilia senilis",         common:"Blood cockle",          group:"Bivalve",   habitat:"intertidal", marker:"COI", ncbi:"partial",bold:"absent",priority:"med",  star:false, notes:"Intertidal mudflats; some West African records. v22.1 (Nov 2026): NCBI 1 global / 1 WA COI (Senegal 1); BOLD 0 global / 0 WA (no BOLD records found).",ncbi_global:1,ncbi_wa:1,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0},
  {name:"Mytilaster minimus",      common:"Dwarf mussel",          group:"Bivalve",   habitat:"intertidal", marker:"COI", ncbi:"absent",bold:"absent", priority:"med",  star:false, notes:"Hard substrate; Lagos harbour. v22.1 (Nov 2026): NCBI 17 global / 0 WA COI; BOLD 17 global / 0 WA.",ncbi_global:17,ncbi_wa:0,ncbi_ng:0,bold_global:17,bold_wa:0,bold_ng:0},
  {name:"Corbula trigona",         common:"Trigonal basket clam",  group:"Bivalve",   habitat:"subtidal",   marker:"COI", ncbi:"absent", bold:"partial", priority:"med",  star:false, notes:"Subtidal soft sediment; Niger Delta. v22.1 (Nov 2026): NCBI 0 global / 0 WA COI; BOLD 2 global / 2 WA. Accepted name (WoRMS): Potamocorbula adusta — counts include both names.",ncbi_global:0,ncbi_wa:0,ncbi_ng:0,bold_global:2,bold_wa:2,bold_ng:2,accepted_name:"Potamocorbula adusta"},
  {name:"Sphaerium nodicostatum",  common:"Freshwater clam",       group:"Bivalve",   habitat:"estuarine",  marker:"COI", ncbi:"absent", bold:"absent", priority:"low",  star:false, notes:"Freshwater/estuarine margin. v22.1 (Nov 2026): NCBI 0 global / 0 WA COI; BOLD 0 global / 0 WA (no BOLD records found).",ncbi_global:0,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0},
  // POLYCHAETES
  {name:"Capitella capitata",      common:"Capitella worm",        group:"Polychaete",habitat:"intertidal/subtidal",marker:"COI", ncbi:"absent",bold:"absent",priority:"high",star:true, notes:"v22.1 (Nov 2026): NCBI 29 global / 0 WA COI; BOLD 57 global / 0 WA.", genbank:"GU223584", boldTaxon:"Capitella capitata", ncbi_global:19, ncbi_wa:0,ncbi_global:29,ncbi_wa:0,ncbi_ng:0,bold_global:57,bold_wa:0,bold_ng:0},
  {name:"Nereis diversicolor",     common:"Ragworm",               group:"Polychaete",habitat:"intertidal", marker:"COI", ncbi:"absent",bold:"absent",priority:"low",  star:false, notes:"Common; some records; West Africa gap. v22.1 (Nov 2026): NCBI 418 global / 0 WA COI; BOLD 366 global / 0 WA. Accepted name (WoRMS): Hediste diversicolor — counts include both names.",genbank:"AY744816",boldTaxon:"Nereis diversicolor",ncbi_global:418,ncbi_wa:0,ncbi_ng:0,bold_global:366,bold_wa:0,bold_ng:0,accepted_name:"Hediste diversicolor"},
  {name:"Perinereis cultrifera",   common:"Cultured ragworm",      group:"Polychaete",habitat:"intertidal", marker:"COI", ncbi:"absent",bold:"absent", priority:"med",  star:false, notes:"Niger Delta intertidal; few West Africa records. v22.1 (Nov 2026): NCBI 67 global / 0 WA COI; BOLD 67 global / 0 WA.",ncbi_global:67,ncbi_wa:0,ncbi_ng:0,bold_global:67,bold_wa:0,bold_ng:0},
  {name:"Marphysa sanguinea",      common:"King ragworm",          group:"Polychaete",habitat:"intertidal", marker:"COI", ncbi:"absent",bold:"absent", priority:"med",  star:false, notes:"Intertidal; bait species; few WA records. v22.1 (Nov 2026): NCBI 48 global / 0 WA COI; BOLD 45 global / 0 WA.",ncbi_global:48,ncbi_wa:0,ncbi_ng:0,bold_global:45,bold_wa:0,bold_ng:0},
  {name:"Sabella pavonina",        common:"Peacock worm",          group:"Polychaete",habitat:"subtidal",   marker:"COI", ncbi:"absent",bold:"absent", priority:"low",  star:false, notes:"Subtidal hard substrate. v22.1 (Nov 2026): NCBI 6 global / 0 WA COI; BOLD 14 global / 0 WA.",ncbi_global:6,ncbi_wa:0,ncbi_ng:0,bold_global:14,bold_wa:0,bold_ng:0},
  {name:"Hydroides elegans",       common:"Calcareous tubeworm",   group:"Polychaete",habitat:"subtidal",   marker:"COI", ncbi:"absent",bold:"absent",priority:"low",  star:false, notes:"Fouling species; globally sequenced. v22.1 (Nov 2026): NCBI 63 global / 0 WA COI; BOLD 55 global / 0 WA.",genbank:"AY611380",boldTaxon:"Hydroides elegans",ncbi_global:63,ncbi_wa:0,ncbi_ng:0,bold_global:55,bold_wa:0,bold_ng:0},
  // CRUSTACEANS — macrobenthic
  {name:"Uca tangeri",             common:"Fiddler crab",          group:"Crustacean-macro",habitat:"mangrove",  marker:"COI", ncbi:"partial",bold:"partial", priority:"high", star:false, notes:"v22.1 (Nov 2026): NCBI 6 global / 4 WA COI (Guinea-Bissau 3, Ghana 1); BOLD 3 global / 1 WA. Accepted name (WoRMS): Afruca tangeri — counts include both names.",ncbi_global:6,ncbi_wa:4,ncbi_ng:0,bold_global:3,bold_wa:1,bold_ng:0,accepted_name:"Afruca tangeri"},
  {name:"Uca inversa",             common:"Fiddler crab",          group:"Crustacean-macro",habitat:"mangrove",  marker:"COI", ncbi:"absent", bold:"absent", priority:"high", star:false, notes:"West African fiddler crab; no West African sequences. v22.1 (Nov 2026): NCBI 42 global / 0 WA COI; BOLD 46 global / 0 WA. Accepted name (WoRMS): Cranuca inversa — counts include both names.",ncbi_global:42,ncbi_wa:0,ncbi_ng:0,bold_global:46,bold_wa:0,bold_ng:0,accepted_name:"Cranuca inversa"},
  {name:"Sesarma huzardi",         common:"Mangrove sesarmid crab",group:"Crustacean-macro",habitat:"mangrove",  marker:"COI", ncbi:"present", bold:"present", priority:"high", star:false, notes:"v22.1 (Nov 2026): NCBI 35 global / 33 WA COI (Cameroon 16, Ghana 14, Gambia 3); BOLD 35 global / 33 WA. Accepted name (WoRMS): Guinearma huzardi — counts include both names.",ncbi_global:35,ncbi_wa:33,ncbi_ng:0,bold_global:35,bold_wa:33,bold_ng:0,accepted_name:"Guinearma huzardi"},
  {name:"Goniopsis pelii",         common:"Mangrove climbing crab",group:"Crustacean-macro",habitat:"mangrove",  marker:"COI", ncbi:"partial", bold:"partial", priority:"high", star:false, notes:"v22.1 (Nov 2026): NCBI 1 global / 1 WA COI (Ghana 1); BOLD 1 global / 1 WA.",ncbi_global:1,ncbi_wa:1,ncbi_ng:0,bold_global:1,bold_wa:1,bold_ng:0},
  {name:"Cardisoma armatum",       common:"Rainbow crab",          group:"Crustacean-macro",habitat:"mangrove",  marker:"COI", ncbi:"partial",bold:"partial", priority:"med",  star:false, notes:"Sold in markets; semi-terrestrial mangrove crab. v22.1 (Nov 2026): NCBI 2 global / 1 WA COI (Nigeria 1); BOLD 2 global / 1 WA.",ncbi_global:2,ncbi_wa:1,ncbi_ng:1,bold_global:2,bold_wa:1,bold_ng:1},
  {name:"Callinectes pallidus",    common:"Pallid swimming crab",  group:"Crustacean-macro",habitat:"estuarine", marker:"COI", ncbi:"partial", bold:"partial", priority:"med",  star:false, notes:"Estuarine; co-occurs with C. amnicola. v22.1 (Nov 2026): NCBI 3 global / 1 WA COI (Ghana 1); BOLD 1 global / 1 WA.",ncbi_global:3,ncbi_wa:1,ncbi_ng:0,bold_global:1,bold_wa:1,bold_ng:0},
];

// Add macrobenthos into ALL_TAXA
MACROBENTHOS.forEach(s => {
  ALL_TAXA.push({name:s.name, common:s.common, group:s.group, marker:s.marker,
    ncbi:s.ncbi, bold_silva:s.bold, priority:s.priority, notes:s.notes, section:"macrobenthos"});
});

// ─── MARINE SPECIES DATA ───────────────────────────────────────────────────
const MARINE = [
  // PELAGIC FISH — offshore open water
  {name:"Thunnus albacares",        common:"Yellowfin tuna",          group:"Marine-Pelagic",  marker:"12S", ncbi:"partial", bold:"absent", priority:"low",  notes:"v22.1 (Nov 2026): NCBI 22 global / 1 WA 12S (Senegal 1); BOLD 0 global / 0 WA.", genbank:"NC_014061", boldTaxon:"Thunnus albacares",ncbi_global:22,ncbi_wa:1,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0},
  {name:"Katsuwonus pelamis",       common:"Skipjack tuna",           group:"Marine-Pelagic",  marker:"12S", ncbi:"absent", bold:"absent", priority:"low",  notes:"v22.1 (Nov 2026): NCBI 18 global / 0 WA 12S; BOLD 0 global / 0 WA.", genbank:"NC_009709", boldTaxon:"Katsuwonus pelamis",ncbi_global:18,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0},
  {name:"Thunnus obesus",           common:"Bigeye tuna",             group:"Marine-Pelagic",  marker:"12S", ncbi:"absent", bold:"absent", priority:"low",  notes:"v22.1 (Nov 2026): NCBI 168 global / 0 WA 12S; BOLD 0 global / 0 WA.", genbank:"NC_014059", boldTaxon:"Thunnus obesus",ncbi_global:168,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0},
  {name:"Xiphias gladius",          common:"Swordfish",               group:"Marine-Pelagic",  marker:"12S", ncbi:"absent", bold:"absent", priority:"low",  notes:"Offshore billfish; some WA gap. v22.1 (Nov 2026): NCBI 13 global / 0 WA 12S; BOLD 0 global / 0 WA.",genbank:"NC_012511",boldTaxon:"Xiphias gladius",ncbi_global:13,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0},
  {name:"Coryphaena hippurus",      common:"Dolphinfish / mahi-mahi", group:"Marine-Pelagic",  marker:"12S", ncbi:"absent", bold:"absent", priority:"low",  notes:"Offshore; few Nigeria-specific sequences. v22.1 (Nov 2026): NCBI 24 global / 0 WA 12S; BOLD 1 global / 0 WA.",ncbi_global:24,ncbi_wa:0,ncbi_ng:0,bold_global:1,bold_wa:0,bold_ng:0},
  {name:"Scomber japonicus",        common:"Chub mackerel",           group:"Marine-Pelagic",  marker:"12S", ncbi:"absent", bold:"absent", priority:"low",  notes:"v22.1 (Nov 2026): NCBI 28 global / 0 WA 12S; BOLD 4 global / 0 WA.", genbank:"NC_006398", boldTaxon:"Scomber japonicus",ncbi_global:28,ncbi_wa:0,ncbi_ng:0,bold_global:4,bold_wa:0,bold_ng:0},
  {name:"Scomberomorus tritor",     common:"West African Spanish mackerel", group:"Marine-Pelagic", marker:"12S", ncbi:"present",bold:"present", priority:"high", notes:"v22.1 (Nov 2026): NCBI 4 global / 3 WA 12S (Guinea-Bissau 3); BOLD 3 global / 3 WA.",ncbi_global:4,ncbi_wa:3,ncbi_ng:0,bold_global:3,bold_wa:3,bold_ng:0},
  {name:"Caranx hippos",            common:"Crevalle jack",           group:"Marine-Pelagic",  marker:"12S", ncbi:"absent", bold:"absent", priority:"med",  notes:"v22.1 (Nov 2026): NCBI 6 global / 0 WA 12S; BOLD 0 global / 0 WA.",ncbi_global:6,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0},
  {name:"Trichiurus lepturus",      common:"Largehead hairtail",      group:"Marine-Pelagic",  marker:"12S", ncbi:"partial", bold:"partial", priority:"med",  notes:"Common offshore demersal-pelagic. v22.1 (Nov 2026): NCBI 23 global / 1 WA 12S (Guinea-Bissau 1); BOLD 1 global / 1 WA.",genbank:"KC999417",boldTaxon:"Trichiurus lepturus",ncbi_global:23,ncbi_wa:1,ncbi_ng:0,bold_global:1,bold_wa:1,bold_ng:0},

  // DEMERSAL OFFSHORE FISH
  {name:"Dentex angolensis",        common:"Angolan dentex",          group:"Marine-Demersal", marker:"12S", ncbi:"absent",  bold:"absent", priority:"high", notes:"v22.1 (Nov 2026): NCBI 1 global / 0 WA 12S; BOLD 0 global / 0 WA.",ncbi_global:1,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0},
  {name:"Pagellus bellottii",       common:"Red pandora",             group:"Marine-Demersal", marker:"12S", ncbi:"absent", bold:"absent", priority:"high", notes:"v22.1 (Nov 2026): NCBI 4 global / 0 WA 12S; BOLD 0 global / 0 WA.",ncbi_global:4,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0},
  {name:"Epinephelus aeneus",       common:"White grouper",           group:"Marine-Demersal", marker:"12S", ncbi:"present", bold:"present", priority:"high", notes:"v22.1 (Nov 2026): NCBI 7 global / 3 WA 12S (Guinea-Bissau 3); BOLD 3 global / 3 WA.",ncbi_global:7,ncbi_wa:3,ncbi_ng:0,bold_global:3,bold_wa:3,bold_ng:0},
  {name:"Sparus caeruleostictus",   common:"Blue-spotted seabream",   group:"Marine-Demersal", marker:"12S", ncbi:"present", bold:"partial", priority:"high", notes:"Common offshore; unsequenced from Nigeria. v22.1 (Nov 2026): NCBI 3 global / 3 WA 12S (Guinea-Bissau 2, Ghana 1); BOLD 2 global / 2 WA. Accepted name (WoRMS): Pagrus caeruleostictus — counts include both names.",ncbi_global:3,ncbi_wa:3,ncbi_ng:0,bold_global:2,bold_wa:2,bold_ng:0,accepted_name:"Pagrus caeruleostictus"},
  {name:"Pseudupeneus prayensis",   common:"West African goatfish",   group:"Marine-Demersal", marker:"12S", ncbi:"absent",  bold:"absent", priority:"high", notes:"Sandy substrate offshore; zero sequences. v22.1 (Nov 2026): NCBI 0 global / 0 WA 12S; BOLD 0 global / 0 WA.",ncbi_global:0,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0},
  {name:"Pteroscion peli",          common:"Boe drum",                group:"Marine-Demersal", marker:"12S", ncbi:"absent",  bold:"absent", priority:"high", notes:"v22.1 (Nov 2026): NCBI 0 global / 0 WA 12S; BOLD 0 global / 0 WA.",ncbi_global:0,ncbi_wa:0,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0},
  {name:"Pomadasys rogerii",        common:"Piggy grunt",             group:"Marine-Demersal", marker:"12S", ncbi:"partial",  bold:"absent", priority:"med",  notes:"Coastal/offshore demersal. v22.1 (Nov 2026): NCBI 1 global / 1 WA 12S (Guinea-Bissau 1); BOLD 0 global / 0 WA (no BOLD records found).",ncbi_global:1,ncbi_wa:1,ncbi_ng:0,bold_global:0,bold_wa:0,bold_ng:0},
  {name:"Lutjanus goreensis",       common:"Gorean snapper",          group:"Marine-Demersal", marker:"12S", ncbi:"partial",  bold:"present", priority:"high", notes:"v22.1 (Nov 2026): NCBI 2 global / 2 WA 12S (Guinea-Bissau 2); BOLD 4 global / 4 WA.",ncbi_global:2,ncbi_wa:2,ncbi_ng:0,bold_global:4,bold_wa:4,bold_ng:0},

  // CORAL REEF & HARD SUBSTRATE
  {name:"Acropora palmata",         common:"Elkhorn coral",           group:"Marine-Reef",     marker:"COI", ncbi:"absent", bold:"absent", priority:"med",  notes:"Framework reef builder; some Atlantic records. v22.1 (Nov 2026): NCBI 33 global / 0 WA COI; BOLD 5 global / 0 WA.",genbank:"AY692189",boldTaxon:"Acropora palmata",ncbi_global:33,ncbi_wa:0,ncbi_ng:0,bold_global:5,bold_wa:0,bold_ng:0},
  {name:"Porites porites",          common:"Finger coral",            group:"Marine-Reef",     marker:"COI", ncbi:"absent", bold:"absent", priority:"med",  notes:"Common patch reef coral; Gulf of Guinea. v22.1 (Nov 2026): NCBI 4 global / 0 WA COI; BOLD 4 global / 0 WA.",ncbi_global:4,ncbi_wa:0,ncbi_ng:0,bold_global:4,bold_wa:0,bold_ng:0},
  {name:"Holothuria atra",          common:"Black sea cucumber",      group:"Marine-Reef",     marker:"COI", ncbi:"absent", bold:"absent", priority:"med",  notes:"Reef flat; harvested; few WA records. v22.1 (Nov 2026): NCBI 401 global / 0 WA COI; BOLD 400 global / 0 WA.",genbank:"GQ221580",boldTaxon:"Holothuria atra",ncbi_global:401,ncbi_wa:0,ncbi_ng:0,bold_global:400,bold_wa:0,bold_ng:0},
  {name:"Holothuria scabra",        common:"Sandfish sea cucumber",   group:"Marine-Reef",     marker:"COI", ncbi:"absent", bold:"absent", priority:"med",  notes:"Commercial fishery species. v22.1 (Nov 2026): NCBI 205 global / 0 WA COI; BOLD 104 global / 0 WA.",ncbi_global:205,ncbi_wa:0,ncbi_ng:0,bold_global:104,bold_wa:0,bold_ng:0},
  {name:"Diadema antillarum",       common:"Long-spined sea urchin",  group:"Marine-Reef",     marker:"COI", ncbi:"absent", bold:"absent", priority:"low",  notes:"Reef herbivore; Atlantic records exist. v22.1 (Nov 2026): NCBI 15 global / 0 WA COI; BOLD 14 global / 0 WA.",ncbi_global:15,ncbi_wa:0,ncbi_ng:0,bold_global:14,bold_wa:0,bold_ng:0},
  {name:"Echinometra lucunter",     common:"Rock-boring urchin",      group:"Marine-Reef",     marker:"COI", ncbi:"partial", bold:"partial", priority:"low",  notes:"Intertidal rock surfaces. v22.1 (Nov 2026): NCBI 74 global / 3 WA COI (Senegal 3); BOLD 53 global / 3 WA.",ncbi_global:74,ncbi_wa:3,ncbi_ng:0,bold_global:53,bold_wa:3,bold_ng:0},
  {name:"Ophiura ophiura",          common:"Common brittle star",     group:"Marine-Reef",     marker:"COI", ncbi:"absent", bold:"absent", priority:"low",  notes:"Subtidal sediment; some WA records. v22.1 (Nov 2026): NCBI 46 global / 0 WA COI; BOLD 71 global / 0 WA.",ncbi_global:46,ncbi_wa:0,ncbi_ng:0,bold_global:71,bold_wa:0,bold_ng:0},

  // MARINE INVERTEBRATES — cephalopods & others
  {name:"Octopus vulgaris",         common:"Common octopus",          group:"Marine-Invertebrate", marker:"COI", ncbi:"present", bold:"absent", priority:"low",  notes:"Coastal/offshore; globally sequenced. v22.1 (Nov 2026): NCBI 605 global / 13 WA COI (Cape Verde 13); BOLD 727 global / 0 WA.", genbank:"AM910139", boldTaxon:"Octopus vulgaris",ncbi_global:605,ncbi_wa:13,ncbi_ng:0,bold_global:727,bold_wa:0,bold_ng:0},
  {name:"Sepia officinalis",        common:"Common cuttlefish",       group:"Marine-Invertebrate", marker:"COI", ncbi:"absent", bold:"absent", priority:"low",  notes:"Coastal; some WA gap in sequences. v22.1 (Nov 2026): NCBI 518 global / 0 WA COI; BOLD 402 global / 0 WA.",genbank:"X70209",boldTaxon:"Sepia officinalis",ncbi_global:518,ncbi_wa:0,ncbi_ng:0,bold_global:402,bold_wa:0,bold_ng:0},
  {name:"Loligo vulgaris",          common:"European squid",          group:"Marine-Invertebrate", marker:"COI", ncbi:"absent", bold:"absent", priority:"med",  notes:"Offshore squid; few Nigeria sequences. v22.1 (Nov 2026): NCBI 218 global / 0 WA COI; BOLD 237 global / 0 WA.",ncbi_global:218,ncbi_wa:0,ncbi_ng:0,bold_global:237,bold_wa:0,bold_ng:0},
  {name:"Charonia variegata",       common:"Triton shell",            group:"Marine-Invertebrate", marker:"COI", ncbi:"absent", bold:"absent", priority:"high", notes:"Large marine gastropod; zero WA sequences. v22.1 (Nov 2026): NCBI 1 global / 0 WA COI; BOLD 1 global / 0 WA.",ncbi_global:1,ncbi_wa:0,ncbi_ng:0,bold_global:1,bold_wa:0,bold_ng:0},
  {name:"Strombus latus",           common:"West African stromb",     group:"Marine-Invertebrate", marker:"COI", ncbi:"partial",  bold:"partial", priority:"high", notes:"West African endemic; very few sequences globally. v22.1 (Nov 2026): NCBI 3 global / 2 WA COI (Senegal 2); BOLD 3 global / 2 WA. Accepted name (WoRMS): Thetystrombus latus — counts include both names.",ncbi_global:3,ncbi_wa:2,ncbi_ng:0,bold_global:3,bold_wa:2,bold_ng:0,accepted_name:"Thetystrombus latus"},
  {name:"Murex brandaris",          common:"Spiny dye-murex",         group:"Marine-Invertebrate", marker:"COI", ncbi:"absent", bold:"absent", priority:"med",  notes:"Subtidal rocky; few WA records. v22.1 (Nov 2026): NCBI 4 global / 0 WA COI; BOLD 3 global / 0 WA. Accepted name (WoRMS): Bolinus brandaris — counts include both names.",ncbi_global:4,ncbi_wa:0,ncbi_ng:0,bold_global:3,bold_wa:0,bold_ng:0,accepted_name:"Bolinus brandaris"},
  {name:"Penaeus kerathurus",       common:"Caramote prawn",          group:"Marine-Invertebrate", marker:"COI", ncbi:"absent", bold:"absent", priority:"low",  notes:"Offshore prawn; some Mediterranean records. v22.1 (Nov 2026): NCBI 112 global / 0 WA COI; BOLD 115 global / 0 WA. Accepted name (WoRMS): Penaeus (Melicertus) kerathurus — counts include both names.",genbank:"AY372048",boldTaxon:"Penaeus kerathurus",ncbi_global:112,ncbi_wa:0,ncbi_ng:0,bold_global:115,bold_wa:0,bold_ng:0,accepted_name:"Penaeus (Melicertus) kerathurus"},

  // SEAGRASS & MACROALGAE
  {name:"Halophila stipulacea",     common:"Stipulate seagrass",      group:"Marine-Plants",   marker:"rbcL", ncbi:"absent", bold:"absent", priority:"med",  notes:"Expanding range in Gulf of Guinea; invasive watch. v22.1 (Nov 2026): NCBI 17 global / 0 WA rbcL; BOLD 5 global / 0 WA.",genbank:"DQ422073",ncbi_global:17,ncbi_wa:0,ncbi_ng:0,bold_global:5,bold_wa:0,bold_ng:0},
  {name:"Thalassia testudinum",     common:"Turtle grass",            group:"Marine-Plants",   marker:"rbcL", ncbi:"absent", bold:"absent", priority:"med",  notes:"Coastal seagrass beds; Caribbean/Atlantic. v22.1 (Nov 2026): NCBI 127 global / 0 WA rbcL; BOLD 2 global / 0 WA.",ncbi_global:127,ncbi_wa:0,ncbi_ng:0,bold_global:2,bold_wa:0,bold_ng:0},
  {name:"Sargassum natans",         common:"Sargassum (floating)",    group:"Marine-Plants",   marker:"rbcL", ncbi:"absent", bold:"absent", priority:"med",  notes:"Pelagic/coastal; major ecological concern in GoG. v22.1 (Nov 2026): NCBI 4 global / 0 WA rbcL; BOLD 2 global / 0 WA.",genbank:"KX373597",boldTaxon:"Sargassum natans",ncbi_global:4,ncbi_wa:0,ncbi_ng:0,bold_global:2,bold_wa:0,bold_ng:0},
  {name:"Sargassum fluitans",       common:"Sargassum (fluitans)",    group:"Marine-Plants",   marker:"rbcL", ncbi:"absent", bold:"absent", priority:"med",  notes:"Co-dominant Sargassum species in inundations. v22.1 (Nov 2026): NCBI 8 global / 0 WA rbcL; BOLD 1 global / 0 WA.",ncbi_global:8,ncbi_wa:0,ncbi_ng:0,bold_global:1,bold_wa:0,bold_ng:0},
  {name:"Ulva lactuca",             common:"Sea lettuce",             group:"Marine-Plants",   marker:"rbcL", ncbi:"present", bold:"absent", priority:"low",  notes:"Intertidal/coastal; nutrient indicator. v22.1 (Nov 2026): NCBI 241 global / 6 WA rbcL (Senegal 6); BOLD 64 global / 0 WA.",ncbi_global:241,ncbi_wa:6,ncbi_ng:0,bold_global:64,bold_wa:0,bold_ng:0},
  {name:"Gracilaria corticata",     common:"Red macroalgae",          group:"Marine-Plants",   marker:"rbcL", ncbi:"absent", bold:"absent", priority:"med",  notes:"Subtidal macroalgae; few WA sequences. v22.1 (Nov 2026): NCBI 13 global / 0 WA rbcL; BOLD 1 global / 0 WA.",ncbi_global:13,ncbi_wa:0,ncbi_ng:0,bold_global:1,bold_wa:0,bold_ng:0},

  // MARINE MAMMALS — offshore
  {name:"Megaptera novaeangliae",   common:"Humpback whale",          group:"Marine-Mammal",   marker:"COI", ncbi:"absent", bold:"absent", priority:"low",  notes:"v22.1 (Nov 2026): NCBI 34 global / 0 WA COI; BOLD 30 global / 0 WA.", genbank:"NC_006927", boldTaxon:"Megaptera novaeangliae",ncbi_global:34,ncbi_wa:0,ncbi_ng:0,bold_global:30,bold_wa:0,bold_ng:0},
  {name:"Physeter macrocephalus",   common:"Sperm whale",             group:"Marine-Mammal",   marker:"COI", ncbi:"absent", bold:"absent", priority:"low",  notes:"v22.1 (Nov 2026): NCBI 106 global / 0 WA COI; BOLD 4 global / 0 WA.", genbank:"NC_002503", boldTaxon:"Physeter macrocephalus",ncbi_global:106,ncbi_wa:0,ncbi_ng:0,bold_global:4,bold_wa:0,bold_ng:0},
  {name:"Stenella frontalis",       common:"Atlantic spotted dolphin",group:"Marine-Mammal",   marker:"COI", ncbi:"absent", bold:"absent", priority:"low",  notes:"Offshore pelagic; few WA sequences. v22.1 (Nov 2026): NCBI 24 global / 0 WA COI; BOLD 23 global / 0 WA.",ncbi_global:24,ncbi_wa:0,ncbi_ng:0,bold_global:23,bold_wa:0,bold_ng:0},
  {name:"Balaenoptera brydei",      common:"Bryde's whale",           group:"Marine-Mammal",   marker:"COI", ncbi:"absent", bold:"absent", priority:"med",  notes:"Resident in Gulf of Guinea; WA gap. v22.1 (Nov 2026): NCBI 39 global / 0 WA COI; BOLD 36 global / 0 WA.",ncbi_global:39,ncbi_wa:0,ncbi_ng:0,bold_global:36,bold_wa:0,bold_ng:0},
  {name:"Orcinus orca",             common:"Killer whale",            group:"Marine-Mammal",   marker:"COI", ncbi:"absent", bold:"absent", priority:"low",  notes:"v22.1 (Nov 2026): NCBI 180 global / 0 WA COI; BOLD 169 global / 0 WA.", genbank:"NC_023889", boldTaxon:"Orcinus orca",ncbi_global:180,ncbi_wa:0,ncbi_ng:0,bold_global:169,bold_wa:0,bold_ng:0},
];

const GULF_ENDEMICS = ["Scomberomorus tritor","Dentex angolensis","Pteroscion peli","Lutjanus goreensis","Strombus latus","Balaenoptera brydei"];

// Add marine species into ALL_TAXA
MARINE.forEach(s => {
  ALL_TAXA.push({name:s.name, common:s.common, group:s.group, marker:s.marker,
    ncbi:s.ncbi, bold_silva:s.bold, priority:s.priority, notes:s.notes, section:"marine"});
});

// ─── ALL_FISH — defined here so MARINE is already available ───────────────
const ALL_FISH = [
  ...VERTEBRATES.filter(s => s.group === "Fish").map(s => ({...s, habitatType:"estuarine"})),
  ...MARINE.filter(s => s.group === "Marine-Pelagic" || s.group === "Marine-Demersal").map(s => ({...s, habitatType:"marine"})),
];


// ─── NAMES (v22.1) ─────────────────────────────────────────────────────────
// Site names are kept as record keys. Where WoRMS gives a different accepted name,
// the accepted name is displayed with the site name as a synonym.
const NAME_INFO = {};
[VERTEBRATES, MACROBENTHOS, MARINE, MEIOFAUNA_OTHER].forEach(arr => arr.forEach(s => {
  if (s.accepted_name || s.synonym_of) NAME_INFO[s.name] = {accepted: s.accepted_name || null, synonymOf: s.synonym_of || null};
}));
function displayName(name) {
  const i = NAME_INFO[name];
  if (!i) return name;
  if (i.synonymOf) return name + ' <span class="syn-note">(synonym of <em>' + i.synonymOf + '</em>)</span>';
  return i.accepted + ' <span class="syn-note">(syn. <em>' + name + '</em>)</span>';
}
function nameMatches(name, q) {
  const i = NAME_INFO[name];
  return name.toLowerCase().includes(q) || !!(i && i.accepted && i.accepted.toLowerCase().includes(q));
}
