/* Nigeria Marine Biodiversity Library — Main JS
   Extracted from nigeria_reflib_dashboard_v13.html for multi-page site */

// ─── DATA ──────────────────────────────────────────────────────────────────

const VERTEBRATES = [
  {name:"Ethmalosa fimbriata",         common:"Bonga shad",               group:"Fish",        marker:"12S", ncbi:"partial",bold:"absent", priority:"high",iucn:"LC",location:"Lagos Lagoon",habitat:"Estuarine/Coastal",notes:"Top commercial pelagic; only 2 NCBI records globally — below eDNA threshold",ncbi_global:2,ncbi_wa:2,eco_notes:"Top commercial pelagic; 2 NCBI records globally — insufficient for eDNA (<5 threshold)"},
  {name:"Sardinella maderensis",       common:"Madeiran sardinella",      group:"Fish",        marker:"12S", ncbi:"partial",bold:"partial",priority:"low", iucn:"LC",location:"Gulf of Guinea",habitat:"Marine/Pelagic",notes:"BOLD v5: partial WA coverage; NCBI 2 global records",ncbi_global:2,ncbi_wa:2,eco_notes:"BOLD v5: some WA records"},
  {name:"Sardinella aurita",           common:"Round sardinella",         group:"Fish",        marker:"12S", ncbi:"partial",bold:"partial",priority:"low", iucn:"LC",location:"Gulf of Guinea",habitat:"Marine/Pelagic",notes:"8 global / 1 WA NCBI 12S records; moderate coverage",ncbi_global:8,ncbi_wa:1,eco_notes:"8 global / 1 WA NCBI records — moderate coverage"},
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
  {name:"Drepane africana",            common:"African sicklefish",       group:"Fish",        marker:"12S", ncbi:"partial", bold:"absent", priority:"med", iucn:"LC",location:"Gulf of Guinea",habitat:"Coastal/Sandy substrate",notes:"Coastal/sandy substrate; 5 global / 2 WA NCBI records (just meets eDNA threshold)",ncbi_global:5,ncbi_wa:2,eco_notes:"Coastal/sandy substrate; 5 global / 2 WA (meets eDNA threshold)"},
  {name:"Mugil cephalus",              common:"Flathead mullet",          group:"Fish",        marker:"12S", ncbi:"partial",bold:"present",priority:"low", iucn:"LC",location:"Lagos Lagoon",habitat:"Coastal/Estuarine",notes:"Cosmopolitan; well covered. BOLD v5: present globally",ncbi_global:53,ncbi_wa:0,eco_notes:"Cosmopolitan; well covered"},
  {name:"Chrysichthys nigrodigitatus", common:"Bagrid catfish",           group:"Fish",        marker:"12S", ncbi:"partial",bold:"absent", priority:"med", iucn:"LC",location:"Lagos Lagoon",habitat:"Freshwater/Estuarine",notes:"Common in Lagos Lagoon",ncbi_global:1,ncbi_wa:1,eco_notes:"Common in Lagos Lagoon"},
  {name:"Rhizoprionodon acutus",       common:"Milk shark",               group:"Elasmobranch",marker:"12S", ncbi:"partial",bold:"absent", priority:"high",iucn:"NT",location:"Gulf of Guinea",habitat:"Inshore/Coastal",notes:"Most common inshore shark; few WA records",ncbi_global:1,ncbi_wa:0,eco_notes:"Most common inshore shark; few WA records"},
  {name:"Rhinobatos rhinobatos",       common:"Common guitarfish",        group:"Elasmobranch",marker:"12S", ncbi:"absent",bold:"absent", priority:"high",iucn:"CR",location:"Gulf of Guinea",habitat:"Inshore/Sandy substrate",notes:"Critically endangered; major WA gap",ncbi_global:0,ncbi_wa:0,eco_notes:"Critically endangered; major WA gap"},
  {name:"Hypanus marianae",            common:"Large-eyed stingray",      group:"Elasmobranch",marker:"12S", ncbi:"absent", bold:"absent", priority:"high",iucn:"VU",location:"Gulf of Guinea",habitat:"Inshore/Sandy substrate",notes:"Inshore stingray; no sequences",ncbi_global:0,ncbi_wa:0,eco_notes:"Inshore stingray; no sequences — IUCN VU (verify)"},
  {name:"Carcharhinus leucas",         common:"Bull shark",               group:"Elasmobranch",marker:"12S", ncbi:"partial",bold:"partial",priority:"low", iucn:"NT",location:"Lagos/Niger Delta",habitat:"Coastal/Estuarine",notes:"Global records available",ncbi_global:7,ncbi_wa:0,eco_notes:"Global records available"},
  {name:"Sphyrna lewini",              common:"Scalloped hammerhead",     group:"Elasmobranch",marker:"12S", ncbi:"partial",bold:"partial",priority:"med", iucn:"CR",location:"Gulf of Guinea",habitat:"Coastal/Offshore",notes:"CITES listed; some records",ncbi_global:25,ncbi_wa:4,eco_notes:"CITES listed; some records"},
  {name:"Penaeus notialis",            common:"Southern pink shrimp",     group:"Crustacean",  marker:"COI", ncbi:"partial",bold:"absent", priority:"high",iucn:"LC",location:"Niger Delta",habitat:"Shallow marine/Estuarine",notes:"Most important commercial shrimp",ncbi_global:45,ncbi_wa:0,eco_notes:"Most important commercial shrimp"},
  {name:"Callinectes amnicola",        common:"Swimming crab",            group:"Crustacean",  marker:"COI", ncbi:"partial", bold:"absent", priority:"high",iucn:"DD",location:"Lagos Lagoon",habitat:"Estuarine/Lagoon",notes:"Dominant brachyuran; zero sequences",ncbi_global:1,ncbi_wa:1,eco_notes:"Dominant brachyuran; zero sequences"},
  {name:"Parapenaeus longirostris",    common:"Deep-water rose shrimp",   group:"Crustacean",  marker:"COI", ncbi:"partial",bold:"partial",priority:"low", iucn:"LC",location:"Gulf of Guinea",habitat:"Offshore/Deep",notes:"Some Mediterranean records",ncbi_global:25,ncbi_wa:0,eco_notes:"Some Mediterranean records"},
  {name:"Macrobrachium vollenhovenii", common:"African river prawn",      group:"Crustacean",  marker:"COI", ncbi:"partial",bold:"absent", priority:"med", iucn:"LC",location:"Niger Delta",habitat:"Freshwater/Estuarine",notes:"Estuarine/freshwater overlap",ncbi_global:1,ncbi_wa:1,eco_notes:"Estuarine/freshwater overlap"},
  {name:"Trichechus senegalensis",     common:"African manatee",          group:"Mammal",      marker:"COI", ncbi:"absent",bold:"absent", priority:"high",iucn:"VU",location:"Lagos Lagoon",habitat:"Lagoon/Mangrove/Riverine",notes:"CITES I; data-deficient in Nigeria",ncbi_global:0,ncbi_wa:0,eco_notes:"CITES I; data-deficient in Nigeria"},
  {name:"Sousa teuszii",               common:"Atlantic humpback dolphin",group:"Mammal",      marker:"COI", ncbi:"absent",bold:"absent", priority:"high",iucn:"CR",location:"Gulf of Guinea",habitat:"Coastal/Marine",notes:"Critically endangered; GoG endemic",ncbi_global:0,ncbi_wa:0,eco_notes:"Critically endangered; GoG endemic"},
  {name:"Tursiops truncatus",          common:"Bottlenose dolphin",       group:"Mammal",      marker:"COI", ncbi:"partial",bold:"present",priority:"low", iucn:"LC",location:"Gulf of Guinea",habitat:"Coastal/Offshore",notes:"Well covered globally. BOLD v5: present",ncbi_global:42,ncbi_wa:0,eco_notes:"Well covered globally"},
  {name:"Chelonia mydas",              common:"Green sea turtle",         group:"Turtle",      marker:"12S", ncbi:"partial",bold:"partial",priority:"low", iucn:"EN",location:"Gulf of Guinea",habitat:"Marine/Nesting beaches",notes:"Global records; BOLD v5: partial. Some WA gaps remain",ncbi_global:11,ncbi_wa:0,eco_notes:"Global records; some WA gaps"},
  {name:"Dermochelys coriacea",        common:"Leatherback turtle",       group:"Turtle",      marker:"12S", ncbi:"partial",bold:"partial",priority:"low", iucn:"VU",location:"Gulf of Guinea",habitat:"Marine/Offshore",notes:"Global records available",ncbi_global:7,ncbi_wa:0,eco_notes:"Global records available"},
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

// NCBI threshold: < 5 global sequences = effectively absent for eDNA purposes
// (too few to build a reliable MiFish reference; may be incidental deposits)
function ncbiEffectiveStatus(s) {
  if (s.ncbi_global !== undefined) {
    if (s.ncbi_global === 0) return "absent";
    if (s.ncbi_global < 5)  return "absent";   // 1-4 seqs: insufficient for eDNA
    if (s.ncbi_wa > 0)      return "present";
    return "partial";  // ≥5 global but no WA records
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

// ─── GAP ANALYSIS ──────────────────────────────────────────────────────────
function updateStats() {
  const total = ALL_TAXA.length;
  const present = ALL_TAXA.filter(s => overallStatus(s)==="present").length;
  const absent  = ALL_TAXA.filter(s => overallStatus(s)==="absent").length;
  // Nematodes ARE meiofauna — count them as part of meiofauna total
  const meiofaunaTotal = NEMATODES.length + MEIOFAUNA_OTHER.filter(s=>s.group==="Meiofauna").length;
  document.getElementById("s-total").textContent   = total;
  document.getElementById("s-present").textContent = present;
  document.getElementById("s-absent").textContent  = absent;
  document.getElementById("s-pct").textContent     = Math.round(present/total*100)+"%";
  document.getElementById("s-nema").textContent    = NEMATODES.length;
}

function renderGroups() {
  const groupOrder = ["Fish","Elasmobranch","Crustacean","Mammal","Turtle",
    "Marine-Pelagic","Marine-Demersal","Marine-Reef","Marine-Invertebrate","Marine-Plants","Marine-Mammal",
    "Gastropod","Bivalve","Polychaete","Crustacean-macro",
    "Nematode","Meiofauna","Protist","Fungi"];
  const g = document.getElementById("group-grid");
  g.innerHTML = "";
  groupOrder.forEach(gr => {
    const sp = ALL_TAXA.filter(s => s.group===gr);
    if (!sp.length) return;
    const pct = Math.round(sp.filter(s=>overallStatus(s)==="present").length/sp.length*100);
    const gaps = sp.filter(s=>overallStatus(s)==="absent").length;
    const col = pct>=60?"#1D9E75":pct>=30?"#BA7517":"#E24B4A";
    const card = document.createElement("div");
    card.className = "group-card";
    card.title = `Click to view all ${gr} taxa`;
    card.innerHTML = `
      <div class="group-row"><span class="group-name">${gr}</span><span style="font-size:13px;color:${col};font-weight:600;">${pct}%</span></div>
      <div class="group-sub">${sp.length} taxa · <span style="color:var(--red)">${gaps} gaps</span></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${col};"></div></div>
      <div style="font-size:10px;color:var(--text3);margin-top:6px;">click to view taxa →</div>`;
    card.onclick = () => goToTaxa(gr, "all");
    g.appendChild(card);
  });
}

// ─── NAVIGATION HELPERS ───────────────────────────────────────────────────
function goToTaxa(group, status) {
  // If not on gap-analysis page, navigate there
  if (document.body.getAttribute('data-page') !== 'home') {
    window.location.href = 'gap-analysis.html?tab=species&group=' + encodeURIComponent(group) + '&status=' + encodeURIComponent(status);
    return;
  }
  // Set filters
  document.getElementById("filt-group").value  = group;
  document.getElementById("filt-status").value = status;
  document.getElementById("filt-marker").value = "all";
  document.getElementById("filt-priority").value = "all";
  document.getElementById("search-in").value   = "";

  // Build descriptive label for the banner
  const groupLabel  = group  === "all" ? "all groups"  : group;
  const statusLabel = status === "all" ? "all statuses"
                    : status === "present" ? "taxa with sequences"
                    : status === "absent"  ? "priority gaps (no sequences)"
                    : "partial coverage";
  const bar = document.getElementById("active-filter-bar");
  document.getElementById("active-filter-text").textContent =
    `Filtered: ${groupLabel} · ${statusLabel}`;
  bar.classList.add("visible");

  // Render table then switch tab
  renderTable();
  switchTab("species");
  window.scrollTo({top:0, behavior:"smooth"});
}

function clearFilters() {
  document.getElementById("filt-group").value    = "all";
  document.getElementById("filt-status").value   = "all";
  document.getElementById("filt-marker").value   = "all";
  document.getElementById("filt-priority").value = "all";
  document.getElementById("search-in").value     = "";
  document.getElementById("active-filter-bar").classList.remove("visible");
  renderTable();
}

function renderGapLists() {
  const vertGaps = VERTEBRATES.filter(s=>overallStatus({...s,bold_silva:s.bold})==="absent"&&s.priority==="high");
  document.getElementById("gap-list-vert").innerHTML = vertGaps.map(s=>
    `<span class="gap-item" style="cursor:pointer;" onclick="goToSearch('${s.name}')" title="Click to view in All taxa">— <em>${s.name}</em> (${s.common}) →</span>`).join("");
  const nemaGaps = NEMATODES.filter(n=>n.ng18s===0&&n.global18s>0).slice(0,10);
  document.getElementById("gap-list-nema").innerHTML = nemaGaps.map(n=>
    `<span class="gap-item" style="cursor:pointer;" onclick="goToSearch('${n.genus}')" title="Click to view in All taxa">— <em>${n.genus}</em> (${n.order}) →</span>`).join("");
}

function goToSearch(name) {
  document.getElementById("filt-group").value    = "all";
  document.getElementById("filt-status").value   = "all";
  document.getElementById("filt-marker").value   = "all";
  document.getElementById("filt-priority").value = "all";
  document.getElementById("search-in").value     = name.toLowerCase();
  const bar = document.getElementById("active-filter-bar");
  document.getElementById("active-filter-text").textContent = `Searching: "${name}"`;
  bar.classList.add("visible");
  renderTable();
  switchTab("species");
  window.scrollTo({top:0, behavior:"smooth"});
}

// ─── ALL TAXA TABLE ────────────────────────────────────────────────────────
let sortCol="priority", sortDir=1;
function sortBy(col) {
  if(sortCol===col) sortDir*=-1; else { sortCol=col; sortDir=1; }
  document.querySelectorAll("th.sortable").forEach(th=>{th.classList.remove("sort-asc","sort-desc");});
  const th=[...document.querySelectorAll("#tab-species th.sortable")].find(t=>t.getAttribute("onclick").includes(col));
  if(th) th.classList.add(sortDir===1?"sort-asc":"sort-desc");
  renderTable();
}

function renderTable() {
  const q  = document.getElementById("search-in").value.toLowerCase();
  const fs = document.getElementById("filt-status").value;
  const fg = document.getElementById("filt-group").value;
  const fm = document.getElementById("filt-marker").value;
  const fp = document.getElementById("filt-priority").value;

  let data = ALL_TAXA.filter(s => {
    const st=overallStatus(s);
    return (q===""||s.name.toLowerCase().includes(q)||s.common.toLowerCase().includes(q)||s.notes.toLowerCase().includes(q))
      &&(fs==="all"||st===fs)&&(fg==="all"||s.group===fg)
      &&(fm==="all"||s.marker===fm)&&(fp==="all"||s.priority===fp);
  });

  const priO={high:0,med:1,low:2};
  data.sort((a,b)=>sortCol==="priority"?sortDir*(priO[a.priority]-priO[b.priority]):sortDir*a.name.localeCompare(b.name));
  document.getElementById("row-count").textContent=data.length;

  const markerClass = m => ({
    "12S":"marker-12s","18S":"marker-18s","28S":"marker-28s","COI":"marker-coi","rbcL":"marker-rbcl"
  }[m]||"group-tag");
  const groupClass = g => g==="Nematode"?"nema-tag":
    g==="Meiofauna"||g==="Protist"||g==="Fungi"?"meio-tag":
    g.startsWith("Marine-")?"marker-12s":"group-tag";

  document.getElementById("species-tbody").innerHTML = data.map(s=>{
    const bs = s.bold_silva||s.bold||"absent";
    const pri = s.priority==="high"?`<span class="priority-high">high</span>`:s.priority==="med"?`<span class="priority-med">med</span>`:`<span class="priority-low">low</span>`;
    // For nematode rows, add a link to the Nematodes tab
    const nemaLink = s.group==="Nematode"
      ? `<br><span onclick="switchTab('nematodes')" style="font-size:10px;color:var(--blue);cursor:pointer;text-decoration:underline;">→ Nematodes tab</span>`
      : "";
    // For marine rows, add a link to the Marine tab
    const marineLink = s.group && s.group.startsWith("Marine-")
      ? `<br><span onclick="switchTab('marine')" style="font-size:10px;color:var(--blue);cursor:pointer;text-decoration:underline;">→ Marine tab</span>`
      : "";
    return `<tr>
      <td class="species-name">${s.name}${nemaLink}${marineLink}</td>
      <td style="font-size:11px;color:var(--text2);max-width:140px;">${s.common}</td>
      <td><span class="badge ${groupClass(s.group)}">${s.group}</span></td>
      <td><span class="badge ${markerClass(s.marker)}">${s.marker}</span></td>
      <td>
        <span class="badge ${ncbiEffectiveStatus(s)}">${ncbiEffectiveStatus(s)}</span>
        ${(s.ncbi_global !== undefined) ? `<br><span style="font-size:10px;color:var(--text3);">${s.ncbi_global} global / ${s.ncbi_wa} WA</span>` : ''}
      </td>
      <td><span class="badge ${bs}">${bs}</span></td>
      <td>${iucnBadge(s.iucn||'NE')}</td>
      <td>${pri}</td>
      <td style="font-size:11px;color:var(--text2);max-width:180px;">${s.eco_notes||s.notes}</td>
    </tr>`;
  }).join("");
}

// ─── NEMATODE TABLE ────────────────────────────────────────────────────────
let nSortCol="genus", nSortDir=1;
function sortNemaBy(col) {
  if(nSortCol===col) nSortDir*=-1; else{nSortCol=col;nSortDir=1;}
  renderNemaTable();
}

function nemaGapStatus(n) {
  if(n.global18s===0) return "unsequenced";
  if(n.ng18s===0)     return "nigeria-gap";
  return "present";
}

function renderNemaTable() {
  const q  = document.getElementById("nema-search").value.toLowerCase();
  const fo = document.getElementById("nema-order").value;
  const fr = document.getElementById("nema-response").value;
  const fg = document.getElementById("nema-gap").value;

  let data = NEMATODES.filter(n =>
    (q===""||n.genus.toLowerCase().includes(q)||n.order.toLowerCase().includes(q))
    &&(fo==="all"||n.order===fo)
    &&(fr==="all"||n.response===fr)
    &&(fg==="all"||nemaGapStatus(n)===fg)
  );

  data.sort((a,b)=>nSortDir*(nSortCol==="genus"?a.genus.localeCompare(b.genus):0));
  document.getElementById("nema-count").textContent=data.length;

  const responseColor = r => r==="tolerant"?"color:var(--red)":r==="sensitive"?"color:var(--green)":r==="indicator"?"color:var(--amber)":"color:var(--text3)";
  const responseLabel = r => r==="tolerant"?"increases w/ pollution":r==="sensitive"?"decreases w/ pollution":r==="indicator"?"enrichment indicator":"generalist";

  document.getElementById("nema-tbody").innerHTML = data.map(n => {
    const gst = nemaGapStatus(n);
    const rowBg = gst==="unsequenced"?"background:var(--amber-bg)":gst==="nigeria-gap"?"background:var(--red-bg)":"";
    const gapBadge = gst==="unsequenced"?`<span class="badge absent">unsequenced</span>`:gst==="nigeria-gap"?`<span class="badge partial">Nigeria gap</span>`:`<span class="badge present">ok</span>`;
    const fmtGlobal = v => v===0
      ? `<span style="color:var(--amber);font-weight:600" title="No sequences globally">0</span>`
      : `<span style="font-weight:500">${v.toLocaleString()}</span>`;
    const fmtNg = v => v===0
      ? `<span style="color:var(--red);font-weight:600" title="Nigeria gap">0</span>`
      : `<span style="color:var(--green);font-weight:600">${v.toLocaleString()}</span>`;
    const fmtWA = v => v===0
      ? `<span style="color:var(--red);font-weight:500">0</span>`
      : `<span>${v.toLocaleString()}</span>`;
    return `<tr style="${rowBg}">
      <td class="species-name">${n.genus}</td>
      <td style="font-size:11px;color:var(--text2);">${n.order}</td>
      <td><span style="font-size:11px;${responseColor(n.response)}">${responseLabel(n.response)}</span></td>
      <td style="font-size:12px;text-align:center;">${fmtGlobal(n.global18s)}</td>
      <td style="font-size:12px;text-align:center;">${fmtWA(n.wa18s)}</td>
      <td style="font-size:12px;text-align:center;">${fmtNg(n.ng18s)}</td>
      <td style="font-size:12px;text-align:center;">${fmtGlobal(n.global28s)}</td>
      <td>${gapBadge}</td>
      <td class="eco-role">${n.role}</td>
    </tr>`;
  }).join("");
}

// ─── EXPORT ────────────────────────────────────────────────────────────────
function exportCSV() {
  const h = ["taxon","common_role","group","marker","ncbi","bold_silva","overall_status","priority","notes"];
  const rows = ALL_TAXA.map(s=>[s.name,s.common,s.group,s.marker,s.ncbi,s.bold_silva||s.bold,overallStatus(s),s.priority,s.notes].map(v=>`"${v}"`).join(","));
  const blob = new Blob([[h.join(","),...rows].join("\n")],{type:"text/csv"});
  Object.assign(document.createElement("a"),{href:URL.createObjectURL(blob),download:"nigeria_reflib_gap_all_taxa.csv"}).click();
}

function exportNemaCSV() {
  const h = ["genus","order","pollution_response","global_18S","wa_18S","ng_18S","global_28S","ng_28S","gap_status","ecological_role"];
  const rows = NEMATODES.map(n=>[n.genus,n.order,n.response,n.global18s,n.wa18s,n.ng18s,n.global28s,n.ng28s,nemaGapStatus(n),n.role].map(v=>`"${v}"`).join(","));
  const blob = new Blob([[h.join(","),...rows].join("\n")],{type:"text/csv"});
  Object.assign(document.createElement("a"),{href:URL.createObjectURL(blob),download:"nematode_gap_report.csv"}).click();
}


// ─── FISH TABLE ────────────────────────────────────────────────────────────
// ALL_FISH is defined below, after MARINE is populated

let fishSortCol="priority", fishSortDir=1;
function sortFishBy(col) {
  if(fishSortCol===col) fishSortDir*=-1; else{fishSortCol=col;fishSortDir=1;}
  renderFishTable();
}

function renderFishTable() {
  const q  = document.getElementById("fish-search").value.toLowerCase();
  const fh = document.getElementById("fish-habitat").value;
  const fs = document.getElementById("fish-status").value;
  const fp = document.getElementById("fish-priority").value;
  const priO = {high:0,med:1,low:2};

  let data = ALL_FISH.filter(s => {
    const st = s.group==="Fish" ? overallStatus({...s,bold_silva:s.bold}) : marineStatus(s);
    const htMatch = fh==="all" || (fh==="marine"&&s.habitatType==="marine") || (fh==="estuarine"&&s.habitatType==="estuarine");
    return (q===""||s.name.toLowerCase().includes(q)||s.common.toLowerCase().includes(q))
      &&(fs==="all"||st===fs)&&(fp==="all"||s.priority===fp)&&htMatch;
  });
  data.sort((a,b)=>fishSortCol==="priority"?fishSortDir*(priO[a.priority]-priO[b.priority]):fishSortDir*a.name.localeCompare(b.name));
  document.getElementById("fish-count").textContent=data.length;
  const markerClass=m=>({
    "12S":"marker-12s","18S":"marker-18s","COI":"marker-coi","rbcL":"marker-rbcl"
  }[m]||"group-tag");

  document.getElementById("fish-tbody").innerHTML = data.map(s=>{
    const st = s.group==="Fish" ? overallStatus({...s,bold_silva:s.bold}) : marineStatus(s);
    const pri=s.priority==="high"?`<span class="priority-high">high</span>`:s.priority==="med"?`<span class="priority-med">med</span>`:`<span class="priority-low">low</span>`;
    const grpLabel=s.group.replace("Marine-","");
    return `<tr>
      <td class="species-name">${s.name}</td>
      <td style="font-size:11px;color:var(--text2);">${s.common}</td>
      <td><span class="badge marker-12s" style="font-size:10px;">${grpLabel}</span></td>
      <td><span class="badge ${markerClass(s.marker)}">${s.marker}</span></td>
      <td>
        <span class="badge ${ncbiEffectiveStatus(s)}">${ncbiEffectiveStatus(s)}</span>
        ${(s.ncbi_global !== undefined) ? `<br><span style="font-size:10px;color:var(--text3);">${s.ncbi_global} global / ${s.ncbi_wa} WA</span>` : ''}
      </td>
      <td><span class="badge ${s.bold||s.bold_silva||'absent'}">${s.bold||s.bold_silva||'absent'}</span></td>
      <td>${iucnBadge(s.iucn||'NE')}</td>
      <td>${pri}</td>
      <td style="font-size:11px;color:var(--text2);">${s.eco_notes||s.notes}</td>
    </tr>`;
  }).join("");
}

function exportFishCSV() {
  const h=["species","common_name","group","marker","ncbi","bold","iucn","priority","notes"];
  const rows=ALL_FISH.map(s=>[s.name,s.common,s.group,s.marker,s.ncbi,s.bold||s.bold_silva||"absent",s.iucn||"NE",s.priority,s.notes].map(v=>`"${v}"`).join(","));
  const blob=new Blob([[h.join(","),...rows].join("\n")],{type:"text/csv"});
  Object.assign(document.createElement("a"),{href:URL.createObjectURL(blob),download:"fish_gap_report.csv"}).click();
}

// ─── MACROBENTHOS DATA ─────────────────────────────────────────────────────
// priority species flagged with star for highlighting
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
  {name:"Capitella capitata",      common:"Capitella worm",        group:"Polychaete",habitat:"subtidal",   marker:"COI", ncbi:"present",bold:"present",priority:"low",  star:false, notes:"NCBI: 19 global, 0 W.Africa; BOLD v5: no WA records found"},
  {name:"Nereis diversicolor",     common:"Ragworm",               group:"Polychaete",habitat:"intertidal", marker:"COI", ncbi:"present",bold:"partial",priority:"low",  star:false, notes:"Common; some records; West Africa gap"},
  {name:"Perinereis cultrifera",   common:"Cultured ragworm",      group:"Polychaete",habitat:"intertidal", marker:"COI", ncbi:"partial",bold:"absent", priority:"med",  star:false, notes:"Niger Delta intertidal; few West Africa records"},
  {name:"Marphysa sanguinea",      common:"King ragworm",          group:"Polychaete",habitat:"intertidal", marker:"COI", ncbi:"partial",bold:"absent", priority:"med",  star:false, notes:"Intertidal; bait species; few WA records"},
  {name:"Sabella pavonina",        common:"Peacock worm",          group:"Polychaete",habitat:"subtidal",   marker:"COI", ncbi:"partial",bold:"absent", priority:"low",  star:false, notes:"Subtidal hard substrate"},
  {name:"Hydroides elegans",       common:"Calcareous tubeworm",   group:"Polychaete",habitat:"subtidal",   marker:"COI", ncbi:"present",bold:"partial",priority:"low",  star:false, notes:"Fouling species; globally sequenced"},
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
  {name:"Thunnus albacares",        common:"Yellowfin tuna",          group:"Marine-Pelagic",  marker:"12S", ncbi:"present", bold:"present", priority:"low",  notes:"Well-sequenced globally; NCBI: ~13 at time of v1 query, 0 W.Africa; run v2 script for full count"},
  {name:"Katsuwonus pelamis",       common:"Skipjack tuna",           group:"Marine-Pelagic",  marker:"12S", ncbi:"present", bold:"present", priority:"low",  notes:"Well-sequenced globally; NCBI: ~10 at v1 query, 0 W.Africa; run v2 script"},
  {name:"Thunnus obesus",           common:"Bigeye tuna",             group:"Marine-Pelagic",  marker:"12S", ncbi:"present", bold:"present", priority:"low",  notes:"Well-sequenced globally; not in v1 query — run v2 script to confirm"},
  {name:"Xiphias gladius",          common:"Swordfish",               group:"Marine-Pelagic",  marker:"12S", ncbi:"present", bold:"partial", priority:"low",  notes:"Offshore billfish; some WA gap"},
  {name:"Coryphaena hippurus",      common:"Dolphinfish / mahi-mahi", group:"Marine-Pelagic",  marker:"12S", ncbi:"present", bold:"partial", priority:"low",  notes:"Offshore; few Nigeria-specific sequences"},
  {name:"Scomber japonicus",        common:"Chub mackerel",           group:"Marine-Pelagic",  marker:"12S", ncbi:"present", bold:"present", priority:"low",  notes:"Well-sequenced globally; not in v1 query — run v2 script to confirm"},
  {name:"Scomberomorus tritor",     common:"West African Spanish mackerel", group:"Marine-Pelagic", marker:"12S", ncbi:"partial",bold:"absent", priority:"high", notes:"NCBI: 4 global, 3 W.Africa; BOLD v5: no WA records found"},
  {name:"Caranx hippos",            common:"Crevalle jack",           group:"Marine-Pelagic",  marker:"12S", ncbi:"partial", bold:"absent", priority:"med",  notes:"NCBI: 1 global, 0 W.Africa; BOLD v5: no WA records found"},
  {name:"Trichiurus lepturus",      common:"Largehead hairtail",      group:"Marine-Pelagic",  marker:"12S", ncbi:"present", bold:"partial", priority:"med",  notes:"Common offshore demersal-pelagic"},

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
  {name:"Acropora palmata",         common:"Elkhorn coral",           group:"Marine-Reef",     marker:"COI", ncbi:"present", bold:"partial", priority:"med",  notes:"Framework reef builder; some Atlantic records"},
  {name:"Porites porites",          common:"Finger coral",            group:"Marine-Reef",     marker:"COI", ncbi:"present", bold:"partial", priority:"med",  notes:"Common patch reef coral; Gulf of Guinea"},
  {name:"Holothuria atra",          common:"Black sea cucumber",      group:"Marine-Reef",     marker:"COI", ncbi:"present", bold:"partial", priority:"med",  notes:"Reef flat; harvested; few WA records"},
  {name:"Holothuria scabra",        common:"Sandfish sea cucumber",   group:"Marine-Reef",     marker:"COI", ncbi:"present", bold:"partial", priority:"med",  notes:"Commercial fishery species"},
  {name:"Diadema antillarum",       common:"Long-spined sea urchin",  group:"Marine-Reef",     marker:"COI", ncbi:"present", bold:"partial", priority:"low",  notes:"Reef herbivore; Atlantic records exist"},
  {name:"Echinometra lucunter",     common:"Rock-boring urchin",      group:"Marine-Reef",     marker:"COI", ncbi:"present", bold:"partial", priority:"low",  notes:"Intertidal rock surfaces"},
  {name:"Ophiura ophiura",          common:"Common brittle star",     group:"Marine-Reef",     marker:"COI", ncbi:"present", bold:"partial", priority:"low",  notes:"Subtidal sediment; some WA records"},

  // MARINE INVERTEBRATES — cephalopods & others
  {name:"Octopus vulgaris",         common:"Common octopus",          group:"Marine-Invertebrate", marker:"COI", ncbi:"present", bold:"present", priority:"low",  notes:"Coastal/offshore; globally sequenced"},
  {name:"Sepia officinalis",        common:"Common cuttlefish",       group:"Marine-Invertebrate", marker:"COI", ncbi:"present", bold:"partial", priority:"low",  notes:"Coastal; some WA gap in sequences"},
  {name:"Loligo vulgaris",          common:"European squid",          group:"Marine-Invertebrate", marker:"COI", ncbi:"present", bold:"partial", priority:"med",  notes:"Offshore squid; few Nigeria sequences"},
  {name:"Charonia variegata",       common:"Triton shell",            group:"Marine-Invertebrate", marker:"COI", ncbi:"partial", bold:"absent", priority:"high", notes:"Large marine gastropod; zero WA sequences"},
  {name:"Strombus latus",           common:"West African stromb",     group:"Marine-Invertebrate", marker:"COI", ncbi:"absent",  bold:"absent", priority:"high", notes:"West African endemic; zero sequences globally"},
  {name:"Murex brandaris",          common:"Spiny dye-murex",         group:"Marine-Invertebrate", marker:"COI", ncbi:"partial", bold:"absent", priority:"med",  notes:"Subtidal rocky; few WA records"},
  {name:"Penaeus kerathurus",       common:"Caramote prawn",          group:"Marine-Invertebrate", marker:"COI", ncbi:"present", bold:"partial", priority:"low",  notes:"Offshore prawn; some Mediterranean records"},

  // SEAGRASS & MACROALGAE
  {name:"Halophila stipulacea",     common:"Stipulate seagrass",      group:"Marine-Plants",   marker:"rbcL", ncbi:"present", bold:"absent", priority:"med",  notes:"Expanding range in Gulf of Guinea; invasive watch"},
  {name:"Thalassia testudinum",     common:"Turtle grass",            group:"Marine-Plants",   marker:"rbcL", ncbi:"present", bold:"absent", priority:"med",  notes:"Coastal seagrass beds; Caribbean/Atlantic"},
  {name:"Sargassum natans",         common:"Sargassum (floating)",    group:"Marine-Plants",   marker:"rbcL", ncbi:"present", bold:"partial", priority:"med",  notes:"Pelagic/coastal; major ecological concern in GoG"},
  {name:"Sargassum fluitans",       common:"Sargassum (fluitans)",    group:"Marine-Plants",   marker:"rbcL", ncbi:"present", bold:"partial", priority:"med",  notes:"Co-dominant Sargassum species in inundations"},
  {name:"Ulva lactuca",             common:"Sea lettuce",             group:"Marine-Plants",   marker:"rbcL", ncbi:"present", bold:"absent", priority:"low",  notes:"Intertidal/coastal; nutrient indicator"},
  {name:"Gracilaria corticata",     common:"Red macroalgae",          group:"Marine-Plants",   marker:"rbcL", ncbi:"partial", bold:"absent", priority:"med",  notes:"Subtidal macroalgae; few WA sequences"},

  // MARINE MAMMALS — offshore
  {name:"Megaptera novaeangliae",   common:"Humpback whale",          group:"Marine-Mammal",   marker:"COI", ncbi:"present", bold:"present", priority:"low",  notes:"Thousands of global GenBank/BOLD records; not queried directly — run v2 script to confirm"},
  {name:"Physeter macrocephalus",   common:"Sperm whale",             group:"Marine-Mammal",   marker:"COI", ncbi:"present", bold:"present", priority:"low",  notes:"Thousands of global GenBank/BOLD records; not queried directly — run v2 script to confirm"},
  {name:"Stenella frontalis",       common:"Atlantic spotted dolphin",group:"Marine-Mammal",   marker:"COI", ncbi:"present", bold:"partial", priority:"low",  notes:"Offshore pelagic; few WA sequences"},
  {name:"Balaenoptera brydei",      common:"Bryde's whale",           group:"Marine-Mammal",   marker:"COI", ncbi:"present", bold:"partial", priority:"med",  notes:"Resident in Gulf of Guinea; WA gap"},
  {name:"Orcinus orca",             common:"Killer whale",            group:"Marine-Mammal",   marker:"COI", ncbi:"present", bold:"present", priority:"low",  notes:"Thousands of global GenBank/BOLD records; not queried directly — run v2 script to confirm"},
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

// ─── MACROBENTHOS TABLE ────────────────────────────────────────────────────
let mSortCol="priority", mSortDir=1;
function sortMacroBy(col) {
  if(mSortCol===col) mSortDir*=-1; else{mSortCol=col;mSortDir=1;}
  renderMacroTable();
}

function macroStatus(s) {
  if(s.ncbi==="absent"&&s.bold==="absent") return "absent";
  if(s.ncbi==="present"&&s.bold==="present") return "present";
  return "partial";
}

function renderMacroTable() {
  const q  = document.getElementById("macro-search").value.toLowerCase();
  const fg = document.getElementById("macro-group").value;
  const fh = document.getElementById("macro-habitat").value;
  const fs = document.getElementById("macro-status").value;

  const priO = {high:0,med:1,low:2};
  let data = MACROBENTHOS.filter(s =>
    (q===""||s.name.toLowerCase().includes(q)||s.common.toLowerCase().includes(q))
    &&(fg==="all"||s.group===fg)
    &&(fh==="all"||s.habitat===fh)
    &&(fs==="all"||macroStatus(s)===fs)
  );
  data.sort((a,b) => mSortCol==="priority" ? mSortDir*(priO[a.priority]-priO[b.priority]) : mSortDir*a.name.localeCompare(b.name));
  document.getElementById("macro-count").textContent = data.length;

  const habitatColor = h => ({
    mangrove:"color:var(--green)", intertidal:"color:var(--blue)",
    subtidal:"color:var(--purple)", estuarine:"color:var(--amber)"
  }[h]||"");

  document.getElementById("macro-tbody").innerHTML = data.map(s => {
    const st = macroStatus(s);
    const pri = s.priority==="high"?`<span class="priority-high">high</span>`:s.priority==="med"?`<span class="priority-med">med</span>`:`<span class="priority-low">low</span>`;
    const starMark = s.star ? `<span style="color:var(--amber);font-size:12px;margin-right:3px;">&#9733;</span>` : "";
    const rowStyle = s.star ? "background:var(--amber-bg);" : "";
    return `<tr style="${rowStyle}">
      <td class="species-name">${starMark}${s.name}</td>
      <td style="font-size:11px;color:var(--text2);">${s.common}</td>
      <td><span class="badge meio-tag">${s.group}</span></td>
      <td><span style="font-size:11px;${habitatColor(s.habitat)}">${s.habitat}</span></td>
      <td><span class="badge marker-coi">${s.marker}</span></td>
      <td><span class="badge ${ncbiEffectiveStatus(s)}">${ncbiEffectiveStatus(s)}</span></td>
      <td><span class="badge ${s.bold}">${s.bold}</span></td>
      <td>${pri}</td>
      <td style="font-size:11px;color:var(--text2);">${s.notes}</td>
    </tr>`;
  }).join("");
}

function exportMacroCSV() {
  const h = ["species","common_name","group","habitat","marker","ncbi_COI","bold","overall_status","priority","notes"];
  const rows = MACROBENTHOS.map(s=>[s.name,s.common,s.group,s.habitat,s.marker,s.ncbi,s.bold,macroStatus(s),s.priority,s.notes].map(v=>`"${v}"`).join(","));
  const blob = new Blob([[h.join(","),...rows].join("\n")],{type:"text/csv"});
  Object.assign(document.createElement("a"),{href:URL.createObjectURL(blob),download:"macrobenthos_gap_report.csv"}).click();
}

// ─── MARINE TABLE ──────────────────────────────────────────────────────────
const GULF_ENDEMICS = ["Scomberomorus tritor","Dentex angolensis","Pteroscion peli","Lutjanus goreensis","Strombus latus","Balaenoptera brydei"];

let marSortCol="priority", marSortDir=1;
function sortMarineBy(col) {
  if(marSortCol===col) marSortDir*=-1; else{marSortCol=col;marSortDir=1;}
  renderMarineTable();
}

function marineStatus(s) {
  if(s.ncbi==="absent"&&s.bold==="absent") return "absent";
  if(s.ncbi==="present"&&s.bold==="present") return "present";
  return "partial";
}

function renderMarineTable() {
  const q  = document.getElementById("mar-search").value.toLowerCase();
  const fg = document.getElementById("mar-subgroup").value;
  const fs = document.getElementById("mar-status").value;
  const fp = document.getElementById("mar-priority").value;
  const priO = {high:0,med:1,low:2};

  let data = MARINE.filter(s =>
    (q===""||s.name.toLowerCase().includes(q)||s.common.toLowerCase().includes(q))
    &&(fg==="all"||s.group===fg)
    &&(fs==="all"||marineStatus(s)===fs)
    &&(fp==="all"||s.priority===fp)
  );
  data.sort((a,b)=>marSortCol==="priority"?marSortDir*(priO[a.priority]-priO[b.priority]):marSortDir*a.name.localeCompare(b.name));
  document.getElementById("marine-count").textContent=data.length;

  const groupLabel = g => g.replace("Marine-","");
  const markerClass = m => ({"12S":"marker-12s","COI":"marker-coi","rbcL":"marker-rbcl"}[m]||"group-tag");

  document.getElementById("marine-tbody").innerHTML = data.map(s=>{
    const st  = marineStatus(s);
    const pri = s.priority==="high"?`<span class="priority-high">high</span>`:s.priority==="med"?`<span class="priority-med">med</span>`:`<span class="priority-low">low</span>`;
    const endemic = GULF_ENDEMICS.includes(s.name);
    const rowStyle = endemic ? "background:var(--blue-bg);" : "";
    const endemicMark = endemic ? `<span style="font-size:10px;color:var(--blue);margin-left:4px;">GoG endemic</span>` : "";
    return `<tr style="${rowStyle}">
      <td class="species-name">${s.name}${endemicMark}</td>
      <td style="font-size:11px;color:var(--text2);">${s.common}</td>
      <td><span class="badge marker-12s" style="font-size:10px;">${groupLabel(s.group)}</span></td>
      <td><span class="badge ${markerClass(s.marker)}">${s.marker}</span></td>
      <td><span class="badge ${ncbiEffectiveStatus(s)}">${ncbiEffectiveStatus(s)}</span></td>
      <td><span class="badge ${s.bold}">${s.bold}</span></td>
      <td>${pri}</td>
      <td style="font-size:11px;color:var(--text2);">${s.notes}</td>
    </tr>`;
  }).join("");

  // Fill gap summary cards
  const demGaps = MARINE.filter(s=>s.group==="Marine-Demersal"&&marineStatus(s)==="absent");
  document.getElementById("marine-gap-demersal").innerHTML = demGaps.map(s=>`<em>${s.name}</em> — ${s.common}`).join("<br>") || "None";
  const pelGaps = MARINE.filter(s=>(s.group==="Marine-Pelagic"||s.group==="Marine-Reef")&&marineStatus(s)==="absent");
  document.getElementById("marine-gap-pelagic").innerHTML = pelGaps.map(s=>`<em>${s.name}</em> — ${s.common}`).join("<br>") || "None";
}

function exportMarineCSV() {
  const h = ["species","common_name","group","marker","ncbi","bold","overall_status","priority","gulf_endemic","notes"];
  const rows = MARINE.map(s=>[s.name,s.common,s.group,s.marker,s.ncbi,s.bold,marineStatus(s),s.priority,GULF_ENDEMICS.includes(s.name)?"yes":"no",s.notes].map(v=>`"${v}"`).join(","));
  const blob = new Blob([[h.join(","),...rows].join("\n")],{type:"text/csv"});
  Object.assign(document.createElement("a"),{href:URL.createObjectURL(blob),download:"marine_species_gap_report.csv"}).click();
}

function copyCode(id,btn) {
  navigator.clipboard.writeText(document.getElementById(id).textContent.trim())
    .then(()=>{btn.textContent="Copied!";setTimeout(()=>btn.textContent="Copy",2000);});
}

function switchTab(id) {
  // If we're not on the gap-analysis page, navigate there with the tab parameter
  if (document.body.getAttribute('data-page') !== 'home') {
    window.location.href = 'gap-analysis.html?tab=' + id;
    return;
  }
  const ids=["gap","species","marine","fish","macrobenthos","nematodes","python","workflow"]; // dashboard tabs
  document.querySelectorAll(".tab").forEach((t,i)=>t.classList.toggle("active",ids[i]===id));
  document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
  var panel = document.getElementById("tab-"+id);
  if (panel) panel.classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
}

// ─── GLOBAL SEARCH ─────────────────────────────────────────────────────────

function buildSearchIndex() {
  const idx = [];
  VERTEBRATES.forEach(s => idx.push({
    name:s.name, common:s.common, group:s.group, marker:s.marker,
    ncbi:s.ncbi, bold:s.bold, priority:s.priority, notes:s.notes,
    status:overallStatus({...s,bold_silva:s.bold}), section:"vertebrate", tab:"species",
    iucn:s.iucn||"NE", location:s.location||"", habitat:s.habitat||"", extra:{}
  }));
  MACROBENTHOS.forEach(s => idx.push({
    name:s.name, common:s.common, group:s.group, marker:s.marker,
    ncbi:s.ncbi, bold:s.bold, priority:s.priority, notes:s.notes,
    status:macroStatus(s), section:"macrobenthos", tab:"macrobenthos",
    iucn:"LC", location:"Niger Delta / Lagos Lagoon", habitat:s.habitat||"", extra:{habitat:s.habitat}
  }));
  MARINE.forEach(s => idx.push({
    name:s.name, common:s.common, group:s.group, marker:s.marker,
    ncbi:s.ncbi, bold:s.bold, priority:s.priority, notes:s.notes,
    status:marineStatus(s), section:"marine", tab:"marine",
    iucn:s.iucn||"NE", location:"Gulf of Guinea", habitat:s.habitat||"Marine", extra:{endemic:GULF_ENDEMICS.includes(s.name)}
  }));
  MEIOFAUNA_OTHER.forEach(s => idx.push({
    name:s.name, common:s.common, group:s.group, marker:s.marker,
    ncbi:s.ncbi, bold:s.bold, priority:s.priority, notes:s.notes,
    status:overallStatus({...s,bold_silva:s.bold}), section:"meiofauna", tab:"species", extra:{}
  }));
  NEMATODES.forEach(n => idx.push({
    name:n.genus, common:n.role.split(";")[0].trim(), group:"Nematode",
    marker:"18S", ncbi:n.ng18s>0?"present":n.global18s>0?"partial":"absent",
    bold:n.wa18s>0?"partial":"absent",
    priority:n.ng18s===0&&n.global18s>0?"high":n.global18s===0?"high":"med",
    notes:n.role, status:nemaGapStatus(n), section:"nematode", tab:"nematodes",
    extra:{order:n.order, response:n.response, global18s:n.global18s, ng18s:n.ng18s}
  }));
  return idx;
}

let SEARCH_INDEX = [];
let searchActiveIdx = -1;

function onSearchInput(val) {
  const q = val.trim().toLowerCase();
  document.getElementById('search-clear').classList.toggle('visible', val.length > 0);
  const dd = document.getElementById('search-dropdown');
  searchActiveIdx = -1;
  if (q.length < 2) { dd.classList.remove('open'); return; }

  const results = SEARCH_INDEX.filter(s =>
    s.name.toLowerCase().includes(q) || s.common.toLowerCase().includes(q)
  ).slice(0, 30);

  if (!results.length) {
    dd.innerHTML = '<div class="search-no-results">No taxa found for <strong>' + val + '</strong></div>';
    dd.classList.add('open');
    return;
  }

  const secLabels = {vertebrate:'Fish & Vertebrates', macrobenthos:'Macrobenthos',
                     marine:'Marine', meiofauna:'Meiofauna', nematode:'Nematodes'};
  const grouped = {};
  results.forEach(r => { (grouped[r.section] = grouped[r.section] || []).push(r); });

  // Build displayOrder to match HTML render order so indices are consistent
  const displayOrder = [];
  let html = '';
  Object.entries(grouped).forEach(([sec, items]) => {
    html += '<div class="search-section-label">' + (secLabels[sec] || sec) + '</div>';
    items.forEach(item => {
      const i     = displayOrder.length;
      displayOrder.push(item);
      const stBg  = item.status === 'present' ? 'var(--green-bg)' : item.status === 'absent' ? 'var(--red-bg)' : 'var(--amber-bg)';
      const stCol = item.status === 'present' ? 'var(--green)'    : item.status === 'absent' ? 'var(--red)'    : 'var(--amber)';
      const ibg   = item.section === 'nematode' ? 'var(--purple-bg)' : item.section === 'marine' ? 'var(--blue-bg)' : item.section === 'macrobenthos' ? 'var(--teal-bg)' : 'var(--bg2)';
      const icol  = item.section === 'nematode' ? 'var(--purple)'    : item.section === 'marine' ? 'var(--blue)'    : item.section === 'macrobenthos' ? 'var(--teal)'    : 'var(--text2)';
      const init  = item.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
      const imgUrl = item.image || '';
      const thumbHtml = imgUrl
        ? `<div style="width:44px;height:44px;border-radius:6px;overflow:hidden;flex-shrink:0;"><img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover;" alt="${item.name}" loading="lazy"/></div>`
        : `<div style="width:44px;height:44px;border-radius:6px;background:var(--bg2);border:1px dashed var(--border2);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px;" title="No voucher photo yet">📷</div>`;
      html += '<div class="search-result-item" onclick="openPopup(' + i + ')">'
            + thumbHtml
            + '<div class="sri-icon" style="background:' + ibg + ';color:' + icol + ';">' + init + '</div>'
            + '<div class="sri-text">'
            +   '<div class="sri-name">' + item.name + '</div>'
            +   '<div class="sri-meta">' + item.common + ' &middot; ' + item.group + (item.extra && item.extra.endemic ? ' <span style="color:var(--blue);font-size:10px;font-weight:600;">GoG endemic</span>' : '') + '</div>'
            + '</div>'
            + '<span class="sri-badge" style="background:' + stBg + ';color:' + stCol + ';">' + item.status + '</span>'
            + '</div>';
    });
  });
  html += '<div class="search-result-count">' + displayOrder.length + ' result' + (displayOrder.length !== 1 ? 's' : '') + '</div>';
  dd.innerHTML   = html;
  dd._results    = displayOrder;
  dd.classList.add('open');
  positionDropdown();
}

function positionDropdown() {
  const input = document.getElementById('global-search');
  const dd    = document.getElementById('search-dropdown');
  if (!input || !dd) return;
  const rect  = input.getBoundingClientRect();
  const vw    = window.innerWidth;
  const ddW   = Math.min(400, vw - 24);
  let left    = rect.right - ddW;
  if (left < 12) left = 12;
  dd.style.top    = (rect.bottom + 8) + 'px';
  dd.style.left   = left + 'px';
  dd.style.width  = ddW + 'px';
  dd.style.right  = 'auto';
}
window.addEventListener('resize', () => {
  if (document.getElementById('search-dropdown').classList.contains('open')) positionDropdown();
}, {passive: true});
window.addEventListener('scroll', () => {
  if (document.getElementById('search-dropdown').classList.contains('open')) positionDropdown();
}, {passive: true});

function onSearchKey(e) {
  const dd = document.getElementById('search-dropdown');
  if (!dd.classList.contains('open')) return;
  const items = dd.querySelectorAll('.search-result-item');
  if (!items.length) return;
  if (e.key === 'ArrowDown')  { e.preventDefault(); searchActiveIdx = Math.min(searchActiveIdx + 1, items.length - 1); }
  else if (e.key === 'ArrowUp')   { e.preventDefault(); searchActiveIdx = Math.max(searchActiveIdx - 1, 0); }
  else if (e.key === 'Enter' && searchActiveIdx >= 0) { e.preventDefault(); items[searchActiveIdx].click(); return; }
  else if (e.key === 'Escape') { clearSearch(); return; }
  items.forEach((el, i) => el.classList.toggle('active', i === searchActiveIdx));
  if (searchActiveIdx >= 0) items[searchActiveIdx].scrollIntoView({ block: 'nearest' });
}

function clearSearch() {
  document.getElementById('global-search').value = '';
  document.getElementById('search-clear').classList.remove('visible');
  document.getElementById('search-dropdown').classList.remove('open');
  searchActiveIdx = -1;
}

document.addEventListener('click', e => {
  if (!e.target.closest('.search-wrap')) document.getElementById('search-dropdown').classList.remove('open');
});
// Keyboard: Escape closes popup or search dropdown
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('popup-overlay').classList.contains('open')) {
      closePopup();
    } else if (document.getElementById('search-dropdown').classList.contains('open')) {
      clearSearch();
    }
  }
});

function openPopup(idx) {
  const dd = document.getElementById('search-dropdown');
  const s  = dd._results && dd._results[idx];
  if (!s) return;
  dd.classList.remove('open');

  const sec     = s.section;
  const ibg     = sec === 'nematode' ? 'var(--purple-bg)' : sec === 'marine' ? 'var(--blue-bg)' : sec === 'macrobenthos' ? 'var(--teal-bg)' : 'var(--bg2)';
  const icol    = sec === 'nematode' ? 'var(--purple)'    : sec === 'marine' ? 'var(--blue)'    : sec === 'macrobenthos' ? 'var(--teal)'    : 'var(--text2)';
  const icon    = document.getElementById('popup-icon');
  icon.textContent  = s.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  icon.style.background = ibg;
  icon.style.color      = icol;

  document.getElementById('popup-name').textContent   = s.name;
  document.getElementById('popup-common').textContent = s.common;

  const badge = v => {
    const bg  = v === 'present' ? 'var(--green-bg)' : v === 'absent' ? 'var(--red-bg)' : 'var(--amber-bg)';
    const col = v === 'present' ? 'var(--green)'    : v === 'absent' ? 'var(--red)'    : 'var(--amber)';
    return '<span style="background:' + bg + ';color:' + col + ';padding:2px 10px;border-radius:20px;font-size:11px;font-weight:500;">' + v + '</span>';
  };
  const priCol = s.priority === 'high' ? 'var(--red)' : s.priority === 'med' ? 'var(--amber)' : 'var(--text3)';

  const rows = [
    ['Taxonomic group',       s.group],
    ['Primary marker',        s.marker],
    ['NCBI status',           badge(ncbiEffectiveStatus(s))],
    ['BOLD / SILVA',          badge(s.bold)],
    ['Overall status',        badge(s.status)],
    ['Collection priority',   '<span style="color:' + priCol + ';font-weight:500;">' + s.priority + '</span>'],
    ['IUCN Red List',         iucnBadge(s.iucn||"NE")],
  ];
  if (s.location) rows.push(['Location', s.location]);
  if (s.habitat) rows.push(['Habitat', s.habitat]);
  if (s.extra.habitat && !s.habitat)  rows.push(['Habitat', s.extra.habitat]);
  if (s.extra.endemic)  rows.push(['Gulf of Guinea', '<span style="color:var(--blue);font-weight:500;">Endemic species</span>']);
  if (s.extra.order)    rows.push(['Nematode order', s.extra.order]);
  if (s.extra.response) rows.push(['Pollution response', s.extra.response]);
  if (s.extra.global18s !== undefined) rows.push(['Global 18S sequences', s.extra.global18s.toLocaleString()]);
  if (s.extra.ng18s    !== undefined)  rows.push(['Nigeria 18S sequences',
    s.extra.ng18s === 0
      ? '<span style="color:var(--red);font-weight:500;">0 &mdash; priority gap</span>'
      : String(s.extra.ng18s)
  ]);

  // Image section — top of popup body
  const imgHtml = s.image
    ? `<div style="width:100%;height:180px;border-radius:var(--radius);overflow:hidden;margin-bottom:10px;"><img src="${s.image}" style="width:100%;height:100%;object-fit:cover;" alt="${s.name}" loading="lazy"/></div>`
    : `<div style="width:100%;height:120px;border-radius:var(--radius);background:var(--bg2);border:1.5px dashed var(--border2);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;margin-bottom:10px;">
        <span style="font-size:28px;">📷</span>
        <span style="font-size:11px;color:var(--text3);font-weight:500;">Voucher photograph — not yet available</span>
        <span style="font-size:10px;color:var(--text3);">Upload via <a href="mailto:odedereao@niomr.gov.ng" style="color:var(--blue);">odedereao@niomr.gov.ng</a></span>
       </div>`;

  document.getElementById('popup-body').innerHTML = imgHtml + rows.map(([lbl, val]) =>
    '<div class="popup-row"><span class="popup-row-label">' + lbl + '</span><div class="popup-row-val">' + val + '</div></div>'
  ).join('');

  document.getElementById('popup-notes').innerHTML = s.notes
    ? '<strong style="color:var(--text2);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Notes</strong><br>' + s.notes
    : '';

  const tabLabel = s.tab.charAt(0).toUpperCase() + s.tab.slice(1);
  document.getElementById('popup-footer').innerHTML =
      '<button class="popup-action" onclick="closePopup();goToTaxa(\'' + s.group + '\',\'all\')">View group in All Taxa</button>'
    + '<button class="popup-action" onclick="closePopup();switchTab(\'' + s.tab + '\')">Open ' + tabLabel + ' tab</button>'
    + '<button class="popup-action" onclick="closePopup();goToSearch(\'' + s.name.replace(/'/g, "\\'") + '\')">Search in table</button>';

  document.getElementById('popup-overlay').classList.add('open');
}


function closePopup() { document.getElementById("popup-overlay").classList.remove("open"); }
function closePopupOnOverlay(e) { if (e.target===document.getElementById("popup-overlay")) closePopup(); }



// Citation date helper
const _now = new Date();
const _months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const _citeDate = _now.getDate() + ' ' + _months[_now.getMonth()] + ' ' + _now.getFullYear();

// Initialization is now handled by the DOMContentLoaded listener at the bottom of this file

// ─── PAGE NAVIGATION (multi-page: switchPage now redirects to actual pages) ──
function switchPage(page) {
  var pageMap = {
    'home': 'gap-analysis.html',
    'database': 'index.html',
    'statistics': 'statistics.html',
    'citations': 'citations.html',
    'gallery': 'gallery.html',
    'resources': 'resources.html',
    'contact': 'contact.html',
    'about': 'about.html'
  };
  window.location.href = pageMap[page] || 'index.html';
}

function populateDbStats() {
  const total   = ALL_TAXA.length;
  const present = ALL_TAXA.filter(s => overallStatus(s) === 'present').length;
  const absent  = ALL_TAXA.filter(s => overallStatus(s) === 'absent').length;
  const partial = ALL_TAXA.filter(s => overallStatus(s) === 'partial').length;
  const pct = (n) => Math.round(n/total*100) + '% of total';
  document.getElementById('db-total').textContent   = total;
  document.getElementById('db-present').textContent = present;
  document.getElementById('db-present-pct').textContent = pct(present);
  document.getElementById('db-absent').textContent  = absent;
  document.getElementById('db-absent-pct').textContent  = pct(absent);
  document.getElementById('db-partial').textContent = partial;
  document.getElementById('db-partial-pct').textContent = pct(partial);
  document.getElementById('db-nema').textContent    = NEMATODES.length;
  // Populate cite date in database page
  const citeEl = document.getElementById('cite-date');
  const yearEl = document.getElementById('cite-year');
  if (citeEl) citeEl.textContent = _citeDate;
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function submitContact(e) {
  e.preventDefault();
  const name  = document.getElementById('cf-name').value;
  const inst  = document.getElementById('cf-institution').value;
  const email = document.getElementById('cf-email').value;
  const type  = document.getElementById('cf-type').value;
  const msg   = document.getElementById('cf-message').value;
  const subject = encodeURIComponent('Research Enquiry — EnviroBiotics.org: ' + (type || 'General'));
  const body    = encodeURIComponent(
    'Dear Adelodun Odedere,\n\n' + msg +
    '\n\n---\nFrom: ' + name + '\nInstitution: ' + inst + '\nEmail: ' + email +
    '\nEnquiry type: ' + (type || 'General') +
    '\n\nSent via EnviroBiotics.org contact form'
  );
  // Open mailto — replace with your actual email below
  window.location.href = 'mailto:odedereao@niomr.gov.ng?subject=' + subject + '&body=' + body;
  document.getElementById('form-success').style.display = 'block';
}

// Old single-page init removed — now handled by multi-page DOMContentLoaded at bottom

// ─── STATISTICS PAGE ───────────────────────────────────────────────────────
function populateStatsPage() {
  const groupDefs = [
    {label:'Fish (coastal/estuarine)', groups:['Fish']},
    {label:'Elasmobranchs', groups:['Elasmobranch']},
    {label:'Marine pelagic fish', groups:['Marine-Pelagic']},
    {label:'Marine demersal fish', groups:['Marine-Demersal']},
    {label:'Coral reef & hard substrate', groups:['Marine-Reef']},
    {label:'Marine invertebrates', groups:['Marine-Invertebrate']},
    {label:'Seagrass & macroalgae', groups:['Marine-Plants']},
    {label:'Offshore marine mammals', groups:['Marine-Mammal']},
    {label:'Crustaceans', groups:['Crustacean']},
    {label:'Coastal mammals', groups:['Mammal']},
    {label:'Sea turtles', groups:['Turtle']},
    {label:'Gastropods', groups:['Gastropod']},
    {label:'Bivalves', groups:['Bivalve']},
    {label:'Polychaetes', groups:['Polychaete']},
    {label:'Macrobenthic crustaceans', groups:['Crustacean-macro']},
    {label:'Nematodes', groups:['Nematode']},
    {label:'Meiofauna', groups:['Meiofauna']},
    {label:'Protists', groups:['Protist']},
    {label:'Fungi', groups:['Fungi']},
  ];

  const tbody = document.getElementById('stats-tbody');
  const tfoot = document.getElementById('stats-tfoot');
  if (!tbody) return;

  let totalAll=0, totalPres=0, totalAbs=0, totalPartial=0;
  let rows = '';

  groupDefs.forEach(def => {
    const taxa = ALL_TAXA.filter(s => def.groups.includes(s.group));
    if (!taxa.length) return;
    const present = taxa.filter(s => overallStatus(s) === 'present').length;
    const absent  = taxa.filter(s => overallStatus(s) === 'absent').length;
    const partial = taxa.filter(s => overallStatus(s) === 'partial').length;
    const pct     = Math.round(present/taxa.length*100);
    const pctCol  = pct>=60?'var(--green)':pct>=30?'var(--amber)':'var(--red)';
    totalAll  += taxa.length;
    totalPres += present;
    totalAbs  += absent;
    totalPartial += partial;
    rows += '<tr style="border-bottom:0.5px solid var(--border);">'
          + '<td style="padding:9px 14px;font-size:13px;">' + def.label + '</td>'
          + '<td style="padding:9px 14px;text-align:center;">' + taxa.length + '</td>'
          + '<td style="padding:9px 14px;text-align:center;color:var(--green);font-weight:600;">' + present + '</td>'
          + '<td style="padding:9px 14px;text-align:center;color:var(--amber);">' + partial + '</td>'
          + '<td style="padding:9px 14px;text-align:center;color:var(--red);font-weight:600;">' + absent + '</td>'
          + '<td style="padding:9px 14px;text-align:center;"><span style="background:'+(pct>=60?'var(--green-bg)':pct>=30?'var(--amber-bg)':'var(--red-bg)')+';color:'+pctCol+';padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;">' + pct + '%</span></td>'
          + '</tr>';
  });
  tbody.innerHTML = rows;

  const totalPct = Math.round(totalPres/totalAll*100);
  tfoot.innerHTML = '<tr style="background:linear-gradient(135deg,var(--blue-bg),var(--teal-bg));font-weight:700;border-top:2px solid var(--blue);">'
    + '<td style="padding:10px 14px;font-size:13px;color:var(--navy);">TOTAL (' + totalAll + ' taxa)</td>'
    + '<td style="padding:10px 14px;text-align:center;">' + totalAll + '</td>'
    + '<td style="padding:10px 14px;text-align:center;color:var(--green);">' + totalPres + '</td>'
    + '<td style="padding:10px 14px;text-align:center;color:var(--amber);">' + totalPartial + '</td>'
    + '<td style="padding:10px 14px;text-align:center;color:var(--red);">' + totalAbs + '</td>'
    + '<td style="padding:10px 14px;text-align:center;"><span style="background:var(--blue-bg);color:var(--blue);padding:4px 12px;border-radius:20px;font-size:12px;font-weight:800;">' + totalPct + '%</span></td>'
    + '</tr>';

  // ── KPI CARDS ────────────────────────────────────────────────────────────
  const kpiGrid = document.getElementById('stats-kpi-grid');
  if (kpiGrid) {
    const highPriority = ALL_TAXA.filter(s => s.priority==='high').length;
    const critAbsent   = ALL_TAXA.filter(s => overallStatus(s)==='absent' && s.priority==='high').length;
    const nemaGap      = NEMATODES.filter(n => n.ng18s===0).length;
    const iucnThreat   = VERTEBRATES.filter(s => ['VU','EN','CR'].includes(s.iucn)).length;
    const kpis = [
      {label:'Total Taxa', val: totalAll, color:'var(--blue)', bg:'var(--blue-bg)'},
      {label:'✓ Present', val: totalPres, color:'var(--green)', bg:'var(--green-bg)'},
      {label:'~ Partial', val: totalPartial, color:'var(--amber)', bg:'var(--amber-bg)'},
      {label:'✗ Absent', val: totalAbs, color:'var(--red)', bg:'var(--red-bg)'},
      {label:'High Priority Gaps', val: critAbsent, color:'var(--red)', bg:'var(--red-bg)'},
      {label:'IUCN Threatened', val: iucnThreat, color:'var(--purple)', bg:'var(--purple-bg)'},
    ];
    kpiGrid.innerHTML = kpis.map(k =>
      `<div style="background:${k.bg};border:1px solid ${k.color};border-radius:var(--radius-lg);padding:14px 16px;text-align:center;">
        <div style="font-size:28px;font-weight:800;color:${k.color};line-height:1;">${k.val}</div>
        <div style="font-size:10px;font-weight:600;color:${k.color};margin-top:5px;text-transform:uppercase;letter-spacing:0.05em;opacity:0.85;">${k.label}</div>
      </div>`
    ).join('');
  }

  // ── DONUT CHART ──────────────────────────────────────────────────────────
  const donut = document.getElementById('donut-chart');
  if (donut) {
    const cx=70, cy=70, r=52, strokeW=22;
    const total2 = totalPres + totalPartial + totalAbs;
    const segs = [
      {val:totalPres,   col:'#0F6E56', label:'Present'},
      {val:totalPartial,col:'#854F0B', label:'Partial'},
      {val:totalAbs,    col:'#A32D2D', label:'Absent'},
    ];
    let startAngle = -Math.PI/2;
    let svgPaths = '';
    const pct = v => (v/total2*100).toFixed(0)+'%';
    segs.forEach(s => {
      const angle = (s.val/total2) * 2*Math.PI;
      const endAngle = startAngle + angle;
      const x1=cx+r*Math.cos(startAngle), y1=cy+r*Math.sin(startAngle);
      const x2=cx+r*Math.cos(endAngle),   y2=cy+r*Math.sin(endAngle);
      const lg = angle > Math.PI ? 1 : 0;
      svgPaths += `<path d="M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${lg} 1 ${x2} ${y2} Z" fill="${s.col}" opacity="0.15"/>`;
      svgPaths += `<path d="M${x1} ${y1} A${r} ${r} 0 ${lg} 1 ${x2} ${y2}" fill="none" stroke="${s.col}" stroke-width="${strokeW}" stroke-linecap="butt"/>`;
      startAngle = endAngle;
    });
    const pctVal = Math.round(totalPres/total2*100);
    svgPaths += `<text x="${cx}" y="${cy-6}" text-anchor="middle" font-size="18" font-weight="800" fill="var(--navy)">${pctVal}%</text>`;
    svgPaths += `<text x="${cx}" y="${cy+10}" text-anchor="middle" font-size="9" fill="var(--text3)">global</text>`;
    svgPaths += `<text x="${cx}" y="${cy+22}" text-anchor="middle" font-size="9" fill="var(--text3)">coverage</text>`;
    donut.innerHTML = svgPaths;
    const legend = document.getElementById('donut-legend');
    if (legend) legend.innerHTML = segs.map(s =>
      `<span style="display:flex;align-items:center;gap:4px;font-size:10px;color:var(--text2);">
        <span style="width:10px;height:10px;border-radius:50%;background:${s.col};flex-shrink:0;"></span>${s.label} (${pct(s.val)})</span>`
    ).join('');
  }

  // ── GAP BAR CHART ────────────────────────────────────────────────────────
  const barChart = document.getElementById('gap-bar-chart');
  if (barChart) {
    const groupAbsent = groupDefs.map(def => {
      const taxa = ALL_TAXA.filter(s => def.groups.includes(s.group));
      return {label: def.label, absent: taxa.filter(s=>overallStatus(s)==='absent').length, total: taxa.length};
    }).filter(d=>d.total>0).sort((a,b)=>b.absent-a.absent).slice(0,12);
    const maxA = Math.max(...groupAbsent.map(d=>d.absent), 1);
    barChart.innerHTML = groupAbsent.map(d => {
      const w = Math.round(d.absent/maxA*100);
      const col = d.absent===0?'var(--green)':d.absent/d.total>0.6?'var(--red)':'var(--amber)';
      return `<div style="display:flex;align-items:center;gap:8px;">
        <div style="font-size:11px;color:var(--text2);width:180px;flex-shrink:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${d.label}">${d.label}</div>
        <div style="flex:1;background:var(--bg2);border-radius:4px;height:16px;overflow:hidden;">
          <div style="width:${w}%;height:100%;background:${col};border-radius:4px;transition:width 0.4s;min-width:${d.absent?2:0}px;"></div>
        </div>
        <div style="font-size:11px;font-weight:700;color:${col};width:28px;text-align:right;">${d.absent}</div>
        <div style="font-size:10px;color:var(--text3);width:38px;">/ ${d.total}</div>
      </div>`;
    }).join('');
  }

  // ── MARKER MINI KPI CARDS ─────────────────────────────────────────────────
  const mkRow = document.getElementById('marker-kpi-row');
  const markerColors2 = {'12S':['var(--blue-bg)','var(--blue)'],'COI':['var(--amber-bg)','var(--amber)'],'18S':['var(--purple-bg)','var(--purple)'],'28S':['var(--teal-bg)','var(--teal)'],'rbcL':['var(--green-bg)','var(--green)']};
  if (mkRow) {
    mkRow.innerHTML = ['12S','COI','18S','28S','rbcL'].map(m => {
      const taxa = ALL_TAXA.filter(s=>s.marker===m);
      const pres = taxa.filter(s=>overallStatus(s)==='present').length;
      const abs  = taxa.filter(s=>overallStatus(s)==='absent').length;
      const [bg, col] = markerColors2[m]||['var(--blue-bg)','var(--blue)'];
      const pct2 = taxa.length ? Math.round(pres/taxa.length*100) : 0;
      return `<div style="background:${bg};border:1px solid ${col};border-radius:var(--radius-lg);padding:12px;text-align:center;">
        <div style="font-size:16px;font-weight:800;color:${col};">${m}</div>
        <div style="font-size:22px;font-weight:800;color:${col};margin:4px 0;">${pct2}%</div>
        <div style="font-size:10px;color:var(--text2);">covered globally</div>
        <div style="margin-top:6px;display:flex;justify-content:center;gap:8px;">
          <span style="font-size:10px;color:var(--green);font-weight:600;">✓${pres}</span>
          <span style="font-size:10px;color:var(--red);font-weight:600;">✗${abs}</span>
        </div>
      </div>`;
    }).join('');
  }

  // Marker table
  const markerDefs = [
    {marker:'12S', label:'12S rRNA (MiFish-U/E)', targets:'Fish, elasmobranchs, sea turtles', primers:'MiFish-U / MiFish-E', amplicon:'~170 bp', db:'NCBI + BOLD'},
    {marker:'COI', label:'COI (Leray-XT)',         targets:'Macrobenthos, invertebrates, mammals', primers:'Leray-XT / mlCOIintF', amplicon:'~313 bp', db:'BOLD primary + NCBI'},
    {marker:'18S', label:'18S rRNA V1V2',           targets:'Nematodes, meiofauna, protists', primers:'NF1 / 18Sr2b', amplicon:'~250 bp', db:'SILVA SSU + NCBI'},
    {marker:'28S', label:'28S rRNA D2D3',           targets:'Nematodes (species-level)', primers:'D2A / D3B', amplicon:'~700 bp', db:'SILVA + NCBI'},
    {marker:'rbcL',label:'rbcL',                   targets:'Seagrass, macroalgae', primers:'rbcLa-F / rbcLa-R', amplicon:'~550 bp', db:'NCBI + AlgaeBase'},
  ];
  const mtbody = document.getElementById('marker-tbody');
  if (!mtbody) return;
  mtbody.innerHTML = markerDefs.map(m => {
    const taxa    = ALL_TAXA.filter(s => s.marker === m.marker);
    const present = taxa.filter(s => overallStatus(s)==='present').length;
    const absent  = taxa.filter(s => overallStatus(s)==='absent').length;
    const pct     = taxa.length ? Math.round(present/taxa.length*100) : 0;
    const pctCol  = pct>=60?'var(--green)':pct>=30?'var(--amber)':'var(--red)';
    const markerColors = {'12S':'var(--blue-bg),var(--blue)','COI':'var(--amber-bg),var(--amber)','18S':'var(--purple-bg),var(--purple)','28S':'var(--teal-bg),var(--teal)','rbcL':'var(--green-bg),var(--green)'};
    const [mbg, mcol] = (markerColors[m.marker]||'var(--blue-bg),var(--blue)').split(',');
    return '<tr style="border-bottom:0.5px solid var(--border);">'
      + '<td style="padding:9px 14px;white-space:nowrap;"><span style="background:'+mbg+';color:'+mcol+';padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;">' + m.marker + '</span><br><span style="font-size:10px;color:var(--text3);margin-top:2px;display:block;">' + m.amplicon + '</span></td>'
      + '<td style="padding:9px 14px;font-size:12px;color:var(--text2);">' + m.targets + '</td>'
      + '<td style="padding:9px 14px;font-size:12px;color:var(--text3);font-style:italic;">' + m.primers + '</td>'
      + '<td style="padding:9px 14px;font-size:11px;color:var(--text2);">' + m.db + '</td>'
      + '<td style="padding:9px 14px;text-align:center;">' + taxa.length + '</td>'
      + '<td style="padding:9px 14px;text-align:center;color:var(--green);font-weight:600;">' + present + '</td>'
      + '<td style="padding:9px 14px;text-align:center;color:var(--red);font-weight:600;">' + absent + '</td>'
      + '<td style="padding:9px 14px;text-align:center;"><span style="background:'+(pct>=60?'var(--green-bg)':pct>=30?'var(--amber-bg)':'var(--red-bg)')+';color:'+pctCol+';padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700;">' + pct + '%</span></td>'
      + '</tr>';
  }).join('');
}


// ── Back to top button ──
(function(){
  const btn = document.getElementById('back-to-top');
  window.addEventListener('scroll', function(){
    if (window.scrollY > 400) {
      btn.style.display = 'flex';
      btn.style.opacity = '1';
    } else {
      btn.style.opacity = '0';
      setTimeout(function(){ if(window.scrollY<=400) btn.style.display='none'; }, 200);
    }
  }, {passive:true});
})();

function handleSubscribe(e) {
  e.preventDefault();
  const email = document.getElementById('footer-email').value;
  if (!email) return;
  window.location.href = 'mailto:odedereao@niomr.gov.ng?subject=EnviroBiotics%20Newsletter&body=Please%20subscribe%20me%3A%20' + encodeURIComponent(email);
  document.getElementById('footer-email').value = '';
}

// ── MULTI-PAGE INITIALIZATION ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  // Detect current page from body data attribute
  var page = document.body.getAttribute('data-page') || 'database';

  // Highlight active nav item
  var navBtn = document.getElementById('nav-' + page);
  if (navBtn) navBtn.classList.add('nav-pg-active');

  // Build search index (available on all pages)
  if (typeof buildSearchIndex === 'function') {
    SEARCH_INDEX = buildSearchIndex();
  }

  // Page-specific initialization
  if (page === 'home') {
    // Gap analysis / dashboard page
    if (typeof updateStats === 'function') updateStats();
    if (typeof renderGroups === 'function') renderGroups();
    if (typeof renderGapLists === 'function') renderGapLists();
    if (typeof renderTable === 'function') renderTable();
    if (typeof renderMarineTable === 'function') renderMarineTable();
    if (typeof renderFishTable === 'function') renderFishTable();
    if (typeof renderMacroTable === 'function') renderMacroTable();
    if (typeof renderNemaTable === 'function') renderNemaTable();

    // Handle ?tab= parameter (e.g. gap-analysis.html?tab=marine)
    var urlParams = new URLSearchParams(window.location.search);
    var tabParam = urlParams.get('tab');
    if (tabParam) {
      switchTab(tabParam);
    }
  }

  if (page === 'database') {
    if (typeof populateDbStats === 'function') populateDbStats();
  }

  if (page === 'statistics') {
    if (typeof populateStatsPage === 'function') populateStatsPage();
  }

  if (page === 'citations') {
    var _now = new Date();
    var _months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var _citeDate = _months[_now.getMonth()] + ' ' + _now.getDate() + ', ' + _now.getFullYear();
    var el1 = document.getElementById('cite-date-pg');
    var el2 = document.getElementById('cite-year-pg');
    if (el1) el1.textContent = _citeDate;
    if (el2) el2.textContent = _now.getFullYear();
  }
});
