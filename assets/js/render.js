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
  const partial = ALL_TAXA.filter(s => overallStatus(s)==="partial").length;
  document.getElementById("s-pct").textContent     = partial;
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
    const present = sp.filter(s=>overallStatus(s)==="present").length;
    const partial = sp.filter(s=>overallStatus(s)==="partial").length;
    const gaps    = sp.filter(s=>overallStatus(s)==="absent").length;
    const pct = Math.round(present / sp.length * 100);
    const col = pct>=60?"#1D9E75":pct>=30?"#BA7517":"#E24B4A";
    const card = document.createElement("div");
    card.className = "group-card";
    card.title = `Click to view all ${gr} taxa`;
    card.innerHTML = `
      <div class="group-row"><span class="group-name">${gr}</span><span style="font-size:13px;color:${col};font-weight:600;">${pct}% <span style="font-size:9px;font-weight:500;opacity:0.7;">covered</span></span></div>
      <div class="group-sub">${sp.length} taxa · <span style="color:var(--red)">${gaps} absent</span>${partial ? ` · <span style="color:var(--amber)">${partial} partial</span>` : ''}</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${col};"></div></div>
      <div style="font-size:10px;color:var(--text3);margin-top:6px;">click to view taxa →</div>`;
    card.onclick = () => goToTaxa(gr, "all");
    g.appendChild(card);
  });
}

// ─── NAVIGATION HELPERS ───────────────────────────────────────────────────
function goToTaxa(group, status) {
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

// ─── MACROBENTHOS TABLE ────────────────────────────────────────────────────
let mSortCol="priority", mSortDir=1;
function sortMacroBy(col) {
  if(mSortCol===col) mSortDir*=-1; else{mSortCol=col;mSortDir=1;}
  renderMacroTable();
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
let marSortCol="priority", marSortDir=1;
function sortMarineBy(col) {
  if(marSortCol===col) marSortDir*=-1; else{marSortCol=col;marSortDir=1;}
  renderMarineTable();
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
  const ids=["gap","species","marine","fish","macrobenthos","nematodes"]; // dashboard tabs
  document.querySelectorAll(".tab").forEach((t,i)=>t.classList.toggle("active",ids[i]===id));
  document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
  const panel = document.getElementById("tab-"+id);
  if (panel) panel.classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
}
