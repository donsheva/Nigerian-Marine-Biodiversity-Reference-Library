// ─── DATA ──────────────────────────────────────────────────────────────────

const VERTEBRATES = [
  {name:"Ethmalosa fimbriata",         common:"Bonga shad",               group:"Fish",        marker:"12S", ncbi:"partial",bold:"absent", priority:"high",iucn:"LC",location:"Lagos Lagoon",habitat:"Estuarine/Coastal",notes:"Top commercial pelagic; 2 NCBI records globally — 2 from West Africa (100% WA coverage; NCBI partial→present under 50% rule; BOLD absent → overall partial)",ncbi_global:2,ncbi_wa:2,eco_notes:"Top commercial pelagic; 2 NCBI records (100% WA); BOLD absent — overall partial"},
  {name:"Sardinella maderensis",       common:"Madeiran sardinella",      group:"Fish",        marker:"12S", ncbi:"partial",bold:"present",priority:"low", iucn:"LC",location:"Gulf of Guinea",habitat:"Marine/Pelagic",notes:"BOLD v5: present WA coverage; NCBI 2 global records (both WA)",ncbi_global:2,ncbi_wa:2,eco_notes:"BOLD v5: WA records confirmed",boldTaxon:"Sardinella maderensis",genbank:"JX073750"},
  {name:"Sardinella aurita",           common:"Round sardinella",         group:"Fish",        marker:"12S", ncbi:"partial",bold:"present",priority:"low", iucn:"LC",location:"Gulf of Guinea",habitat:"Marine/Pelagic",notes:"8 global NCBI 12S; 4 from West Africa (Senegal, Ghana, Côte d'Ivoire); BOLD v5: WA records confirmed",ncbi_global:8,ncbi_wa:4,eco_notes:"8 global NCBI / 1 WA; BOLD WA records confirmed",genbank:"KF929356",boldTaxon:"Sardinella aurita"},
  {name:"Pseudotolithus senegalensis", common:"Cassava croaker",          group:"Fish",        marker:"12S", ncbi:"partial", bold:"absent", priority:"high",iucn:"LC",location:"Niger Delta",habitat:"Coastal/Estuarine",notes:"Top commercial demersal; zero sequences",ncbi_global:2,ncbi_wa:2,eco_notes:"Top commercial demersal; zero sequences"},
  {name:"Pseudotolithus elongatus",    common:"Bobo croaker",             group:"Fish",        marker:"12S", ncbi:"partial", bold:"absent", priority:"high",iucn:"LC",location:"Niger Delta",habitat:"Coastal/Demersal",notes:"Common Niger Delta trawls; unsequenced",ncbi_global:3,ncbi_wa:3,eco_notes:"Common Niger Delta trawls; unsequenced"},
  {name:"Cynoglossus senegalensis",    common:"Senegalese tonguesole",    group:"Fish",        marker:"12S", ncbi:"absent", bold:"absent", priority:"high",iucn:"LC",location:"Gulf of Guinea",habitat:"Demersal/Soft sediment",notes:"Abundant bycatch; zero sequences",ncbi_global:0,ncbi_wa:0,eco_notes:"Abundant bycatch; zero sequences"},
  {name:"Galeoides decadactylus",      common:"Lesser African threadfin", group:"Fish",        marker:"12S", ncbi:"partial", bold:"absent", priority:"high",iucn:"LC",location:"Lagos/Niger Delta",habitat:"Coastal/Estuarine",notes:"Key artisanal species",ncbi_global:1,ncbi_wa:1,eco_notes:"Key artisanal species"},
  {name:"Polydactylus quadrifilis",    common:"Giant African threadfin",  group:"Fish",        marker:"12S", ncbi:"partial",bold:"absent", priority:"high",iucn:"LC",location:"Lagos Lagoon",habitat:"Coastal/Estuarine",notes:"Few COI records; no 12S",ncbi_global:2,ncbi_wa:2,eco_notes:"Few COI records; no 12S"},
  {name:"Lutjanus agennes",            common:"African red snapper",      group:"Fish",        marker:"12S", ncbi:"absent", bold:"absent", priority:"high",iucn:"LC",location:"Gulf of Guinea",habitat:"Reef/Rocky substrate",notes:"Reef-associated; no sequences anywhere",ncbi_global:0,ncbi_wa:0,eco_notes:"Reef-associated; no sequences anywhere"},
  {name:"Arius latiscutatus",          common:"Rough-head sea catfish",   group:"Fish",        marker:"12S", ncbi:"partial", bold:"absent", priority:"high",iucn:"LC",location:"Niger Delta",habitat:"Estuarine/Mangrove",notes:"Dominant estuarine catfish; WoRMS: Carlarius latiscutatus",ncbi_global:3,ncbi_wa:2,eco_notes:"Dominant estuarine catfish; WoRMS: Carlarius latiscutatus"},
  {name:"Brachydeuterus auritus",      common:"Bigeye grunt",             group:"Fish",        marker:"12S", ncbi:"absent", bold:"absent", priority:"med", iucn:"LC",location:"Gulf of Guinea",habitat:"Coastal/Demersal",notes:"Abundant in trawl surveys",ncbi_global:0,ncbi_wa:0,eco_notes:"Abundant in trawl surveys"},
  {name:"Pomadasys jubelini",          common:"Sompat grunt",             group:"Fish",        marker:"12S", ncbi:"absent",bold:"absent", priority:"med", iucn:"LC",location:"Lagos Lagoon",habitat:"Estuarine/Nearshore",notes:"Estuarine and nearshore",ncbi_global:0,ncbi_wa:0,eco_notes:"Estuarine and nearshore"},
  {name:"Elops lacerta",               common:"West African ladyfish",    group:"Fish",        marker:"12S", ncbi:"partial", bold:"absent", priority:"med", iucn:"LC",location:"Gulf of Guinea",habitat:"Coastal/Estuarine",notes:"Coastal; underrepresented",ncbi_global:1,ncbi_wa:1,eco_notes:"Coastal; underrepresented"},
  {name:"Drepane africana",            common:"African sicklefish",       group:"Fish",        marker:"12S", ncbi:"partial", bold:"absent", priority:"med", iucn:"LC",location:"Gulf of Guinea",habitat:"Coastal/Sandy substrate",notes:"Coastal/sandy substrate; 5 global / 2 WA NCBI records (WA 40% of global — below 50% threshold)",ncbi_global:5,ncbi_wa:2,eco_notes:"Coastal/sandy substrate; 5 global / 2 WA NCBI records (WA 40% — below 50% threshold)"},
  {name:"Mugil cephalus",              common:"Flathead mullet",          group:"Fish",        marker:"12S", ncbi:"present",bold:"present",priority:"low", iucn:"LC",location:"Lagos Lagoon",habitat:"Coastal/Estuarine",notes:"Cosmopolitan; very well covered globally. BOLD v5: present. NCBI: numerous WA records confirmed",ncbi_global:53,ncbi_wa:27,eco_notes:"Cosmopolitan; well covered globally and in West Africa",genbank:"AF247431",boldTaxon:"Mugil cephalus"},
  {name:"Chrysichthys nigrodigitatus", common:"Bagrid catfish",           group:"Fish",        marker:"12S", ncbi:"partial",bold:"absent", priority:"med", iucn:"LC",location:"Lagos Lagoon",habitat:"Freshwater/Estuarine",notes:"Common in Lagos Lagoon",ncbi_global:1,ncbi_wa:1,eco_notes:"Common in Lagos Lagoon"},
  {name:"Rhizoprionodon acutus",       common:"Milk shark",               group:"Elasmobranch",marker:"12S", ncbi:"partial",bold:"absent", priority:"high",iucn:"NT",location:"Gulf of Guinea",habitat:"Inshore/Coastal",notes:"Most common inshore shark; few WA records",ncbi_global:1,ncbi_wa:0,eco_notes:"Most common inshore shark; few WA records"},
  {name:"Rhinobatos rhinobatos",       common:"Common guitarfish",        group:"Elasmobranch",marker:"12S", ncbi:"absent",bold:"absent", priority:"high",iucn:"CR",location:"Gulf of Guinea",habitat:"Inshore/Sandy substrate",notes:"Critically endangered; major WA gap",ncbi_global:0,ncbi_wa:0,eco_notes:"Critically endangered; major WA gap"},
  {name:"Hypanus marianae",            common:"Large-eyed stingray",      group:"Elasmobranch",marker:"12S", ncbi:"absent", bold:"absent", priority:"high",iucn:"VU",location:"Gulf of Guinea",habitat:"Inshore/Sandy substrate",notes:"Inshore stingray; no sequences",ncbi_global:0,ncbi_wa:0,eco_notes:"Inshore stingray; no sequences — IUCN VU (verify)"},
  {name:"Carcharhinus leucas",         common:"Bull shark",               group:"Elasmobranch",marker:"12S", ncbi:"partial",bold:"partial",priority:"low", iucn:"NT",location:"Lagos/Niger Delta",habitat:"Coastal/Estuarine",notes:"Global records available",ncbi_global:7,ncbi_wa:0,eco_notes:"Global records available",genbank:"AY283758",boldTaxon:"Carcharhinus leucas"},
  {name:"Sphyrna lewini",              common:"Scalloped hammerhead",     group:"Elasmobranch",marker:"12S", ncbi:"partial",bold:"partial",priority:"med", iucn:"CR",location:"Gulf of Guinea",habitat:"Coastal/Offshore",notes:"CITES listed; some records",ncbi_global:25,ncbi_wa:4,eco_notes:"CITES listed; some records",genbank:"AY048578",boldTaxon:"Sphyrna lewini"},
  {name:"Penaeus notialis",            common:"Southern pink shrimp",     group:"Crustacean",  marker:"COI", ncbi:"partial",bold:"absent", priority:"high",iucn:"LC",location:"Niger Delta",habitat:"Shallow marine/Estuarine",notes:"Most important commercial shrimp",ncbi_global:45,ncbi_wa:0,eco_notes:"Most important commercial shrimp",genbank:"KM243344",boldTaxon:"Penaeus notialis"},
  {name:"Callinectes amnicola",        common:"Swimming crab",            group:"Crustacean",  marker:"COI", ncbi:"partial", bold:"absent", priority:"high",iucn:"DD",location:"Lagos Lagoon",habitat:"Estuarine/Lagoon",notes:"Dominant brachyuran; zero sequences",ncbi_global:1,ncbi_wa:1,eco_notes:"Dominant brachyuran; zero sequences"},
  {name:"Parapenaeus longirostris",    common:"Deep-water rose shrimp",   group:"Crustacean",  marker:"COI", ncbi:"partial",bold:"partial",priority:"low", iucn:"LC",location:"Gulf of Guinea",habitat:"Offshore/Deep",notes:"Some Mediterranean records",ncbi_global:25,ncbi_wa:0,eco_notes:"Some Mediterranean records",boldTaxon:"Parapenaeus longirostris"},
  {name:"Macrobrachium vollenhovenii", common:"African river prawn",      group:"Crustacean",  marker:"COI", ncbi:"partial",bold:"absent", priority:"med", iucn:"LC",location:"Niger Delta",habitat:"Freshwater/Estuarine",notes:"Estuarine/freshwater overlap",ncbi_global:1,ncbi_wa:1,eco_notes:"Estuarine/freshwater overlap"},
  {name:"Trichechus senegalensis",     common:"African manatee",          group:"Mammal",      marker:"COI", ncbi:"absent",bold:"absent", priority:"high",iucn:"VU",location:"Lagos Lagoon",habitat:"Lagoon/Mangrove/Riverine",notes:"CITES I; data-deficient in Nigeria",ncbi_global:0,ncbi_wa:0,eco_notes:"CITES I; data-deficient in Nigeria"},
  {name:"Sousa teuszii",               common:"Atlantic humpback dolphin",group:"Mammal",      marker:"COI", ncbi:"absent",bold:"absent", priority:"high",iucn:"CR",location:"Gulf of Guinea",habitat:"Coastal/Marine",notes:"Critically endangered; GoG endemic",ncbi_global:0,ncbi_wa:0,eco_notes:"Critically endangered; GoG endemic"},
  {name:"Tursiops truncatus",          common:"Bottlenose dolphin",       group:"Mammal",      marker:"COI", ncbi:"partial",bold:"present",priority:"low", iucn:"LC",location:"Gulf of Guinea",habitat:"Coastal/Offshore",notes:"Well covered globally. BOLD v5: present",ncbi_global:42,ncbi_wa:0,eco_notes:"Well covered globally",genbank:"AF055847",boldTaxon:"Tursiops truncatus"},
  {name:"Chelonia mydas",              common:"Green sea turtle",         group:"Turtle",      marker:"12S", ncbi:"partial",bold:"partial",priority:"low", iucn:"EN",location:"Gulf of Guinea",habitat:"Marine/Nesting beaches",notes:"Global records; BOLD v5: partial. Some WA gaps remain",ncbi_global:11,ncbi_wa:0,eco_notes:"Global records; some WA gaps",genbank:"AJ238583",boldTaxon:"Chelonia mydas"},
  {name:"Dermochelys coriacea",        common:"Leatherback turtle",       group:"Turtle",      marker:"12S", ncbi:"partial",bold:"partial",priority:"low", iucn:"VU",location:"Gulf of Guinea",habitat:"Marine/Offshore",notes:"Global records available",ncbi_global:7,ncbi_wa:0,eco_notes:"Global records available",genbank:"AJ131457",boldTaxon:"Dermochelys coriacea"},
  {name:"Lepidochelys olivacea",       common:"Olive ridley turtle",      group:"Turtle",      marker:"12S", ncbi:"partial",bold:"partial",priority:"low", iucn:"VU",location:"Gulf of Guinea",habitat:"Marine/Coastal",notes:"Nests on Nigerian beaches",ncbi_global:3,ncbi_wa:0,eco_notes:"Nests on Nigerian beaches"},
];

const MEIOFAUNA_OTHER = [
  {name:"Harpacticoida",   common:"Harpacticoid copepods", group:"Meiofauna",marker:"18S",ncbi:"partial",bold:"absent",priority:"high",notes:"N:C ratio denominator; key bioindicator"},
  {name:"Ostracoda",       common:"Ostracods",             group:"Meiofauna",marker:"COI", ncbi:"partial",bold:"absent",priority:"med", notes:"Sediment archive; pollution record"},
  {name:"Tardigrada",      common:"Water bears",           group:"Meiofauna",marker:"18S",ncbi:"partial",bold:"absent",priority:"med", notes:"Sandy sediment specialist"},
  {name:"Gastrotricha",    common:"Gastrotrichs",          group:"Meiofauna",marker:"18S",ncbi:"absent", bold:"absent",priority:"med", notes:"Fine sediment indicator"},
  {name:"Kinorhyncha",     common:"Mud dragons",           group:"Meiofauna",marker:"18S",ncbi:"absent", bold:"absent",priority:"med", notes:"Subtidal mud specialist"},
  {name:"Foraminifera",    common:"Foraminifera",          group:"Protist",  marker:"18S",ncbi:"partial",bold:"absent",priority:"high",notes:"Sediment archive; historical baseline"},
  {name:"Ciliophora",      common:"Ciliates",              group:"Protist",  marker:"18S",ncbi:"partial",bold:"absent",priority:"med", notes:"Organic matter processors"},
  {name:"Bacillariophyta", common:"Diatoms",               group:"Protist",  marker:"18S",ncbi:"partial",bold:"absent",priority:"med", notes:"Primary producers; water quality"},
  {name:"Polychaeta",      common:"Polychaete worms",      group:"Meiofauna",marker:"COI", ncbi:"partial",bold:"absent",priority:"high",notes:"Key organic enrichment indicator"},
];

const NEMATODES = [
  {genus:"Chromadora",        order:"Chromadorida",   response:"tolerant",  global18s:4200, wa18s:12, ng18s:0, global28s:890, ng28s:0, role:"Enrichment tolerant; increases with pollution"},
  {genus:"Chromadorita",      order:"Chromadorida",   response:"tolerant",  global18s:1800, wa18s:4,  ng18s:0, global28s:420, ng28s:0, role:"Enrichment tolerant"},
  {genus:"Ptycholaimellus",   order:"Chromadorida",   response:"tolerant",  global18s:320,  wa18s:0,  ng18s:0, global28s:180, ng28s:0, role:"Organic enrichment indicator"},
  {genus:"Dichromadora",      order:"Chromadorida",   response:"tolerant",  global18s:560,  wa18s:2,  ng18s:0, global28s:210, ng28s:0, role:"Tolerant generalist"},
  {genus:"Innocuonema",       order:"Chromadorida",   response:"tolerant",  global18s:140,  wa18s:0,  ng18s:0, global28s:60,  ng28s:0, role:"Sandy sediment tolerant"},
  {genus:"Desmodora",         order:"Desmodorida",    response:"tolerant",  global18s:2100, wa18s:8,  ng18s:0, global28s:640, ng28s:0, role:"Hypoxia tolerant; sulphidic sediment"},
  {genus:"Spirinia",          order:"Desmodorida",    response:"tolerant",  global18s:980,  wa18s:3,  ng18s:0, global28s:310, ng28s:0, role:"Hypoxia tolerant"},
  {genus:"Metachromadora",    order:"Desmodorida",    response:"tolerant",  global18s:720,  wa18s:1,  ng18s:0, global28s:280, ng28s:0, role:"Organic enrichment associated"},
  {genus:"Monhystera",        order:"Monhysterida",   response:"indicator", global18s:5600, wa18s:18, ng18s:0, global28s:1200,ng28s:0, role:"Disturbance opportunist; rises after spills"},
  {genus:"Terschellingia",    order:"Monhysterida",   response:"indicator", global18s:890,  wa18s:2,  ng18s:0, global28s:340, ng28s:0, role:"Organic enrichment / sulphide indicator"},
  {genus:"Diplolaimelloides", order:"Monhysterida",   response:"indicator", global18s:420,  wa18s:0,  ng18s:0, global28s:160, ng28s:0, role:"Organic enrichment indicator"},
  {genus:"Sphaerolaimus",     order:"Monhysterida",   response:"indicator", global18s:380,  wa18s:0,  ng18s:0, global28s:140, ng28s:0, role:"Sulphide-rich sediment indicator"},
  {genus:"Enoplus",           order:"Enoplida",       response:"sensitive", global18s:3200, wa18s:6,  ng18s:0, global28s:780, ng28s:0, role:"Pollution sensitive; baseline reference"},
  {genus:"Thoracostoma",      order:"Enoplida",       response:"sensitive", global18s:640,  wa18s:0,  ng18s:0, global28s:220, ng28s:0, role:"Pollution sensitive; clean sediment"},
  {genus:"Eurystomina",       order:"Enoplida",       response:"sensitive", global18s:480,  wa18s:0,  ng18s:0, global28s:190, ng28s:0, role:"Pollution sensitive"},
  {genus:"Oxystomina",        order:"Enoplida",       response:"sensitive", global18s:310,  wa18s:0,  ng18s:0, global28s:120, ng28s:0, role:"Clean sediment specialist"},
  {genus:"Axonolaimus",       order:"Araeolaimida",   response:"other",     global18s:760,  wa18s:1,  ng18s:0, global28s:290, ng28s:0, role:"Deposit feeder; fine sediment"},
  {genus:"Odontophora",       order:"Araeolaimida",   response:"other",     global18s:420,  wa18s:0,  ng18s:0, global28s:160, ng28s:0, role:"Deposit feeder"},
  {genus:"Campylaimus",       order:"Araeolaimida",   response:"other",     global18s:280,  wa18s:0,  ng18s:0, global28s:110, ng28s:0, role:"Deposit feeder"},
  {genus:"Desmoscolex",       order:"Desmoscolecida", response:"other",     global18s:1200, wa18s:0,  ng18s:0, global28s:380, ng28s:0, role:"Sandy sediment specialist"},
  {genus:"Quadricoma",        order:"Desmoscolecida", response:"other",     global18s:340,  wa18s:0,  ng18s:0, global28s:130, ng28s:0, role:"Sandy sediment specialist"},
  {genus:"Aphanolaimus",      order:"Araeolaimida",   response:"other",     global18s:190,  wa18s:0,  ng18s:0, global28s:80,  ng28s:0, role:"Fine sediment generalist"},
  {genus:"Stylotheristus",    order:"Desmodorida",    response:"other",     global18s:160,  wa18s:0,  ng18s:0, global28s:60,  ng28s:0, role:"Mangrove sediment associated"},
  {genus:"Pellioditis",       order:"Rhabditida",     response:"indicator", global18s:2200, wa18s:5,  ng18s:0, global28s:580, ng28s:0, role:"Organic matter indicator"},
  {genus:"Plectus",           order:"Plectida",       response:"other",     global18s:3100, wa18s:9,  ng18s:0, global28s:740, ng28s:0, role:"Generalist; broad habitat"},
];

// Combine all taxa into one flat list for "All taxa" tab
const ALL_TAXA = [
  ...VERTEBRATES.map(s => ({...s, bold_silva: s.bold, section:"vertebrate"})),
  ...MEIOFAUNA_OTHER.map(s => ({name:s.name, common:s.common, group:s.group, marker:s.marker,
    ncbi:s.ncbi, bold_silva:s.bold, priority:s.priority, notes:s.notes, section:"meiofauna"})),
  ...NEMATODES.map(n => ({name:n.genus, common:n.role.split(";")[0].trim(), group:"Nematode",
    marker:"18S", ncbi: n.ng18s>0?"present": n.global18s>0?"partial":"absent",
    bold_silva: n.wa18s>0?"partial":"absent",
    priority: n.ng18s===0&&n.global18s>0?"high": n.global18s===0?"high":"med",
    notes:n.role, section:"nematode"})),
];

function iucnBadge(status) {
  if (!status) return '<span class="badge iucn-ne">NE</span>';
  const cls = 'iucn-' + status.toLowerCase().replace('/','');
  const labels = {LC:'Least Concern',NT:'Near Threatened',VU:'Vulnerable',EN:'Endangered',CR:'Critically Endangered',EW:'Extinct in Wild',EX:'Extinct',DD:'Data Deficient',NE:'Not Evaluated'};
  return '<span class="badge ' + cls + '" title="' + (labels[status]||status) + '">' + status + '</span>';
}

// NCBI threshold: absent if 0 global seqs; present if WA ≥50% of global (any count); else partial
function ncbiEffectiveStatus(s) {
  if (s.ncbi_global !== undefined) {
    if (s.ncbi_global === 0) return "absent";
    // Present if West African records are ≥50% of global count
    if (s.ncbi_wa !== undefined && s.ncbi_wa >= s.ncbi_global * 0.50) return "present";
    return "partial";  // global seqs exist but WA < 50%
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

const MACROBENTHOS = [
  // GASTROPODS — Potamididae (mangrove/estuarine snails)
  {name:"Tympanotonos fuscatus",   common:"Mud periwinkle / Isam", group:"Gastropod", habitat:"mangrove",   marker:"COI", ncbi:"partial",bold:"absent", priority:"high", star:true,  notes:"NCBI: 3 global, 2 W.Africa; BOLD v5: no WA records found"},
  {name:"Tympanotonos radula",     common:"Radula periwinkle",     group:"Gastropod", habitat:"mangrove",   marker:"COI", ncbi:"absent", bold:"absent", priority:"high", star:false, notes:"NCBI: 0 sequences globally; BOLD v5: no WA records found; WoRMS accepted: Tympanotonos fuscatus"},
  {name:"Pachymelania aurita",     common:"Eared mud snail",       group:"Gastropod", habitat:"estuarine",  marker:"COI", ncbi:"absent",bold:"absent", priority:"high", star:true,  notes:"NCBI: 0 sequences globally; BOLD v5: no WA records found"},
  {name:"Pachymelania fusca",      common:"Fusca mud snail",       group:"Gastropod", habitat:"estuarine",  marker:"COI", ncbi:"absent", bold:"absent", priority:"high", star:false, notes:"NCBI: 0 sequences globally; BOLD v5: no WA records found"},
  {name:"Telescopium telescopium", common:"Telescope snail",       group:"Gastropod", habitat:"mangrove",   marker:"COI", ncbi:"partial",bold:"partial",priority:"med",  star:false, notes:"Mangrove gastropod; some Indo-Pacific records"},
  {name:"Neritina glabrata",       common:"Smooth nerite",         group:"Gastropod", habitat:"estuarine",  marker:"COI", ncbi:"absent", bold:"absent", priority:"med",  star:false, notes:"Freshwater-estuarine snail; Lagos Lagoon"},
  {name:"Lanistes varicus",        common:"Apple snail",           group:"Gastropod", habitat:"estuarine",  marker:"COI", ncbi:"partial",bold:"absent", priority:"med",  star:false, notes:"Freshwater/brackish; Niger Delta"},
  // BIVALVES
  {name:"Crassostrea gasar",       common:"Mangrove oyster",       group:"Bivalve",   habitat:"mangrove",   marker:"COI", ncbi:"partial",bold:"absent",priority:"high", star:false, notes:"NCBI: 27 global, 0 W.Africa; BOLD v5: no WA records found; WoRMS accepted: Crassostrea tulipa"},
  {name:"Egeria radiata",          common:"Estuarine clam",        group:"Bivalve",   habitat:"estuarine",  marker:"COI", ncbi:"absent", bold:"absent", priority:"high", star:false, notes:"NCBI: 0 sequences globally; BOLD v5: no WA records found; WoRMS accepted: Galatea paradoxa"},
  {name:"Senilia senilis",         common:"Blood cockle",          group:"Bivalve",   habitat:"intertidal", marker:"COI", ncbi:"partial",bold:"partial",priority:"med",  star:false, notes:"Intertidal mudflats; some West African records"},
  {name:"Mytilaster minimus",      common:"Dwarf mussel",          group:"Bivalve",   habitat:"intertidal", marker:"COI", ncbi:"partial",bold:"absent", priority:"med",  star:false, notes:"Hard substrate; Lagos harbour"},
  {name:"Corbula trigona",         common:"Trigonal basket clam",  group:"Bivalve",   habitat:"subtidal",   marker:"COI", ncbi:"absent", bold:"absent", priority:"med",  star:false, notes:"Subtidal soft sediment; Niger Delta"},
  {name:"Sphaerium nodicostatum",  common:"Freshwater clam",       group:"Bivalve",   habitat:"estuarine",  marker:"COI", ncbi:"absent", bold:"absent", priority:"low",  star:false, notes:"Freshwater/estuarine margin"},
  // POLYCHAETES
  {name:"Capitella capitata",      common:"Capitella worm",        group:"Polychaete",habitat:"subtidal",   marker:"COI", ncbi:"present",bold:"present",priority:"low",  star:false, notes:"NCBI: 19 global, 0 W.Africa; BOLD v5: no WA records found", genbank:"GU223584", boldTaxon:"Capitella capitata"},
  {name:"Nereis diversicolor",     common:"Ragworm",               group:"Polychaete",habitat:"intertidal", marker:"COI", ncbi:"present",bold:"partial",priority:"low",  star:false, notes:"Common; some records; West Africa gap",genbank:"AY744816",boldTaxon:"Nereis diversicolor"},
  {name:"Perinereis cultrifera",   common:"Cultured ragworm",      group:"Polychaete",habitat:"intertidal", marker:"COI", ncbi:"partial",bold:"absent", priority:"med",  star:false, notes:"Niger Delta intertidal; few West Africa records"},
  {name:"Marphysa sanguinea",      common:"King ragworm",          group:"Polychaete",habitat:"intertidal", marker:"COI", ncbi:"partial",bold:"absent", priority:"med",  star:false, notes:"Intertidal; bait species; few WA records"},
  {name:"Sabella pavonina",        common:"Peacock worm",          group:"Polychaete",habitat:"subtidal",   marker:"COI", ncbi:"partial",bold:"absent", priority:"low",  star:false, notes:"Subtidal hard substrate"},
  {name:"Hydroides elegans",       common:"Calcareous tubeworm",   group:"Polychaete",habitat:"subtidal",   marker:"COI", ncbi:"present",bold:"partial",priority:"low",  star:false, notes:"Fouling species; globally sequenced",genbank:"AY611380",boldTaxon:"Hydroides elegans"},
  // CRUSTACEANS — macrobenthic
  {name:"Uca tangeri",             common:"Fiddler crab",          group:"Crustacean-macro",habitat:"mangrove",  marker:"COI", ncbi:"partial",bold:"absent", priority:"high", star:false, notes:"NCBI: 2 global, 1 W.Africa; BOLD v5: no WA records found; WoRMS accepted: Afruca tangeri"},
  {name:"Uca inversa",             common:"Fiddler crab",          group:"Crustacean-macro",habitat:"mangrove",  marker:"COI", ncbi:"absent", bold:"absent", priority:"high", star:false, notes:"West African fiddler crab; unsequenced"},
  {name:"Sesarma huzardi",         common:"Mangrove sesarmid crab",group:"Crustacean-macro",habitat:"mangrove",  marker:"COI", ncbi:"absent", bold:"absent", priority:"high", star:false, notes:"NCBI: 0 sequences globally; BOLD v5: no WA records found; WoRMS accepted: Guinearma huzardi"},
  {name:"Goniopsis pelii",         common:"Mangrove climbing crab",group:"Crustacean-macro",habitat:"mangrove",  marker:"COI", ncbi:"partial", bold:"absent", priority:"high", star:false, notes:"NCBI: 1 global, 1 W.Africa; BOLD v5: no WA records found"},
  {name:"Cardisoma armatum",       common:"Rainbow crab",          group:"Crustacean-macro",habitat:"mangrove",  marker:"COI", ncbi:"partial",bold:"absent", priority:"med",  star:false, notes:"Sold in markets; semi-terrestrial mangrove crab"},
  {name:"Callinectes pallidus",    common:"Pallid swimming crab",  group:"Crustacean-macro",habitat:"estuarine", marker:"COI", ncbi:"absent", bold:"absent", priority:"med",  star:false, notes:"Estuarine; co-occurs with C. amnicola"},
];

// Add macrobenthos into ALL_TAXA
MACROBENTHOS.forEach(s => {
  ALL_TAXA.push({name:s.name, common:s.common, group:s.group, marker:s.marker,
    ncbi:s.ncbi, bold_silva:s.bold, priority:s.priority, notes:s.notes, section:"macrobenthos"});
});

// ─── MARINE SPECIES DATA ───────────────────────────────────────────────────
const MARINE = [
  // PELAGIC FISH — offshore open water
  {name:"Thunnus albacares",        common:"Yellowfin tuna",          group:"Marine-Pelagic",  marker:"12S", ncbi:"present", bold:"present", priority:"low",  notes:"Well-sequenced globally; NCBI: ~13 at time of v1 query, 0 W.Africa; run v2 script for full count", genbank:"NC_014061", boldTaxon:"Thunnus albacares"},
  {name:"Katsuwonus pelamis",       common:"Skipjack tuna",           group:"Marine-Pelagic",  marker:"12S", ncbi:"present", bold:"present", priority:"low",  notes:"Well-sequenced globally; NCBI: ~10 at v1 query, 0 W.Africa; run v2 script", genbank:"NC_009709", boldTaxon:"Katsuwonus pelamis"},
  {name:"Thunnus obesus",           common:"Bigeye tuna",             group:"Marine-Pelagic",  marker:"12S", ncbi:"present", bold:"present", priority:"low",  notes:"Well-sequenced globally; not in v1 query — run v2 script to confirm", genbank:"NC_014059", boldTaxon:"Thunnus obesus"},
  {name:"Xiphias gladius",          common:"Swordfish",               group:"Marine-Pelagic",  marker:"12S", ncbi:"present", bold:"partial", priority:"low",  notes:"Offshore billfish; some WA gap",genbank:"NC_012511",boldTaxon:"Xiphias gladius"},
  {name:"Coryphaena hippurus",      common:"Dolphinfish / mahi-mahi", group:"Marine-Pelagic",  marker:"12S", ncbi:"present", bold:"partial", priority:"low",  notes:"Offshore; few Nigeria-specific sequences"},
  {name:"Scomber japonicus",        common:"Chub mackerel",           group:"Marine-Pelagic",  marker:"12S", ncbi:"present", bold:"present", priority:"low",  notes:"Well-sequenced globally; not in v1 query — run v2 script to confirm", genbank:"NC_006398", boldTaxon:"Scomber japonicus"},
  {name:"Scomberomorus tritor",     common:"West African Spanish mackerel", group:"Marine-Pelagic", marker:"12S", ncbi:"partial",bold:"absent", priority:"high", notes:"NCBI: 4 global, 3 W.Africa; BOLD v5: no WA records found"},
  {name:"Caranx hippos",            common:"Crevalle jack",           group:"Marine-Pelagic",  marker:"12S", ncbi:"partial", bold:"absent", priority:"med",  notes:"NCBI: 1 global, 0 W.Africa; BOLD v5: no WA records found"},
  {name:"Trichiurus lepturus",      common:"Largehead hairtail",      group:"Marine-Pelagic",  marker:"12S", ncbi:"present", bold:"partial", priority:"med",  notes:"Common offshore demersal-pelagic",genbank:"KC999417",boldTaxon:"Trichiurus lepturus"},

  // DEMERSAL OFFSHORE FISH
  {name:"Dentex angolensis",        common:"Angolan dentex",          group:"Marine-Demersal", marker:"12S", ncbi:"absent",  bold:"absent", priority:"high", notes:"NCBI: 0 sequences globally; BOLD v5: no WA records found"},
  {name:"Pagellus bellottii",       common:"Red pandora",             group:"Marine-Demersal", marker:"12S", ncbi:"partial", bold:"absent", priority:"high", notes:"NCBI: 3 global, 3 W.Africa; BOLD v5: no WA records found"},
  {name:"Epinephelus aeneus",       common:"White grouper",           group:"Marine-Demersal", marker:"12S", ncbi:"partial", bold:"absent", priority:"high", notes:"NCBI: 5 global, 3 W.Africa; BOLD v5: no WA records found"},
  {name:"Sparus caeruleostictus",   common:"Blue-spotted seabream",   group:"Marine-Demersal", marker:"12S", ncbi:"partial", bold:"absent", priority:"high", notes:"Common offshore; unsequenced from Nigeria"},
  {name:"Pseudupeneus prayensis",   common:"West African goatfish",   group:"Marine-Demersal", marker:"12S", ncbi:"absent",  bold:"absent", priority:"high", notes:"Sandy substrate offshore; zero sequences"},
  {name:"Pteroscion peli",          common:"Boe drum",                group:"Marine-Demersal", marker:"12S", ncbi:"absent",  bold:"absent", priority:"high", notes:"NCBI: 0 sequences globally; BOLD v5: no WA records found"},
  {name:"Pomadasys rogerii",        common:"Piggy grunt",             group:"Marine-Demersal", marker:"12S", ncbi:"absent",  bold:"absent", priority:"med",  notes:"Coastal/offshore demersal"},
  {name:"Lutjanus goreensis",       common:"Gorean snapper",          group:"Marine-Demersal", marker:"12S", ncbi:"partial",  bold:"absent", priority:"high", notes:"NCBI: 2 global, 2 W.Africa; BOLD v5: no WA records found"},

  // CORAL REEF & HARD SUBSTRATE
  {name:"Acropora palmata",         common:"Elkhorn coral",           group:"Marine-Reef",     marker:"COI", ncbi:"present", bold:"partial", priority:"med",  notes:"Framework reef builder; some Atlantic records",genbank:"AY692189",boldTaxon:"Acropora palmata"},
  {name:"Porites porites",          common:"Finger coral",            group:"Marine-Reef",     marker:"COI", ncbi:"present", bold:"partial", priority:"med",  notes:"Common patch reef coral; Gulf of Guinea"},
  {name:"Holothuria atra",          common:"Black sea cucumber",      group:"Marine-Reef",     marker:"COI", ncbi:"present", bold:"partial", priority:"med",  notes:"Reef flat; harvested; few WA records",genbank:"GQ221580",boldTaxon:"Holothuria atra"},
  {name:"Holothuria scabra",        common:"Sandfish sea cucumber",   group:"Marine-Reef",     marker:"COI", ncbi:"present", bold:"partial", priority:"med",  notes:"Commercial fishery species"},
  {name:"Diadema antillarum",       common:"Long-spined sea urchin",  group:"Marine-Reef",     marker:"COI", ncbi:"present", bold:"partial", priority:"low",  notes:"Reef herbivore; Atlantic records exist"},
  {name:"Echinometra lucunter",     common:"Rock-boring urchin",      group:"Marine-Reef",     marker:"COI", ncbi:"present", bold:"partial", priority:"low",  notes:"Intertidal rock surfaces"},
  {name:"Ophiura ophiura",          common:"Common brittle star",     group:"Marine-Reef",     marker:"COI", ncbi:"present", bold:"partial", priority:"low",  notes:"Subtidal sediment; some WA records"},

  // MARINE INVERTEBRATES — cephalopods & others
  {name:"Octopus vulgaris",         common:"Common octopus",          group:"Marine-Invertebrate", marker:"COI", ncbi:"present", bold:"present", priority:"low",  notes:"Coastal/offshore; globally sequenced", genbank:"AM910139", boldTaxon:"Octopus vulgaris"},
  {name:"Sepia officinalis",        common:"Common cuttlefish",       group:"Marine-Invertebrate", marker:"COI", ncbi:"present", bold:"partial", priority:"low",  notes:"Coastal; some WA gap in sequences",genbank:"X70209",boldTaxon:"Sepia officinalis"},
  {name:"Loligo vulgaris",          common:"European squid",          group:"Marine-Invertebrate", marker:"COI", ncbi:"present", bold:"partial", priority:"med",  notes:"Offshore squid; few Nigeria sequences"},
  {name:"Charonia variegata",       common:"Triton shell",            group:"Marine-Invertebrate", marker:"COI", ncbi:"partial", bold:"absent", priority:"high", notes:"Large marine gastropod; zero WA sequences"},
  {name:"Strombus latus",           common:"West African stromb",     group:"Marine-Invertebrate", marker:"COI", ncbi:"absent",  bold:"absent", priority:"high", notes:"West African endemic; zero sequences globally"},
  {name:"Murex brandaris",          common:"Spiny dye-murex",         group:"Marine-Invertebrate", marker:"COI", ncbi:"partial", bold:"absent", priority:"med",  notes:"Subtidal rocky; few WA records"},
  {name:"Penaeus kerathurus",       common:"Caramote prawn",          group:"Marine-Invertebrate", marker:"COI", ncbi:"present", bold:"partial", priority:"low",  notes:"Offshore prawn; some Mediterranean records",genbank:"AY372048",boldTaxon:"Penaeus kerathurus"},

  // SEAGRASS & MACROALGAE
  {name:"Halophila stipulacea",     common:"Stipulate seagrass",      group:"Marine-Plants",   marker:"rbcL", ncbi:"present", bold:"absent", priority:"med",  notes:"Expanding range in Gulf of Guinea; invasive watch",genbank:"DQ422073"},
  {name:"Thalassia testudinum",     common:"Turtle grass",            group:"Marine-Plants",   marker:"rbcL", ncbi:"present", bold:"absent", priority:"med",  notes:"Coastal seagrass beds; Caribbean/Atlantic"},
  {name:"Sargassum natans",         common:"Sargassum (floating)",    group:"Marine-Plants",   marker:"rbcL", ncbi:"present", bold:"partial", priority:"med",  notes:"Pelagic/coastal; major ecological concern in GoG",genbank:"KX373597",boldTaxon:"Sargassum natans"},
  {name:"Sargassum fluitans",       common:"Sargassum (fluitans)",    group:"Marine-Plants",   marker:"rbcL", ncbi:"present", bold:"partial", priority:"med",  notes:"Co-dominant Sargassum species in inundations"},
  {name:"Ulva lactuca",             common:"Sea lettuce",             group:"Marine-Plants",   marker:"rbcL", ncbi:"present", bold:"absent", priority:"low",  notes:"Intertidal/coastal; nutrient indicator"},
  {name:"Gracilaria corticata",     common:"Red macroalgae",          group:"Marine-Plants",   marker:"rbcL", ncbi:"partial", bold:"absent", priority:"med",  notes:"Subtidal macroalgae; few WA sequences"},

  // MARINE MAMMALS — offshore
  {name:"Megaptera novaeangliae",   common:"Humpback whale",          group:"Marine-Mammal",   marker:"COI", ncbi:"present", bold:"present", priority:"low",  notes:"Thousands of global GenBank/BOLD records; not queried directly — run v2 script to confirm", genbank:"NC_006927", boldTaxon:"Megaptera novaeangliae"},
  {name:"Physeter macrocephalus",   common:"Sperm whale",             group:"Marine-Mammal",   marker:"COI", ncbi:"present", bold:"present", priority:"low",  notes:"Thousands of global GenBank/BOLD records; not queried directly — run v2 script to confirm", genbank:"NC_002503", boldTaxon:"Physeter macrocephalus"},
  {name:"Stenella frontalis",       common:"Atlantic spotted dolphin",group:"Marine-Mammal",   marker:"COI", ncbi:"present", bold:"partial", priority:"low",  notes:"Offshore pelagic; few WA sequences"},
  {name:"Balaenoptera brydei",      common:"Bryde's whale",           group:"Marine-Mammal",   marker:"COI", ncbi:"present", bold:"partial", priority:"med",  notes:"Resident in Gulf of Guinea; WA gap"},
  {name:"Orcinus orca",             common:"Killer whale",            group:"Marine-Mammal",   marker:"COI", ncbi:"present", bold:"present", priority:"low",  notes:"Thousands of global GenBank/BOLD records; not queried directly — run v2 script to confirm", genbank:"NC_023889", boldTaxon:"Orcinus orca"},
];

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
