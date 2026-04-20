// ─── STATISTICS PAGE ───────────────────────────────────────────────────────

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

  // ── Render new v20 sections ──
  renderPriorityLeaderboard();
  renderIucnCrosstab();
}

// ═══ TOP PRIORITY SEQUENCING TARGETS LEADERBOARD ═══════════════════════════
// Composite priority score for ranking sequencing candidates.
function priorityScore(s) {
  let score = 0;
  // Base curator-assigned priority
  const pmap = { high: 3, med: 2, low: 1 };
  score += pmap[s.priority] || 0;
  // Overall coverage status — absent is the strongest signal
  const ov = overallStatus(s);
  if (ov === 'absent')  score += 3;
  if (ov === 'partial') score += 1;
  // IUCN threatened bump
  const iucnBump = { CR: 4, EN: 3, VU: 2, NT: 1 };
  if (s.iucn) score += (iucnBump[s.iucn] || 0);
  // Zero global records — completely undetectable
  if (s.ncbi_global !== undefined && s.ncbi_global === 0) score += 2;
  // Commercial / ecological / endemic flag (heuristic: common-name markers)
  const c = (s.notes || s.eco_notes || '').toLowerCase();
  if (c.includes('commercial') || c.includes('endemic') || c.includes('artisanal') ||
      c.includes('cites') || c.includes('bycatch') || c.includes('framework')) {
    score += 1;
  }
  return score;
}

function priorityRationale(s) {
  const reasons = [];
  const ov = overallStatus(s);
  if (ov === 'absent')  reasons.push('zero refs');
  if (s.ncbi_global === 0) reasons.push('0 global');
  if (s.iucn && ['CR','EN','VU'].includes(s.iucn)) reasons.push('IUCN ' + s.iucn);
  if (s.priority === 'high') reasons.push('curator-flagged');
  const c = (s.notes || s.eco_notes || '').toLowerCase();
  if (c.includes('commercial')) reasons.push('commercial');
  if (c.includes('endemic'))    reasons.push('endemic');
  if (c.includes('cites'))      reasons.push('CITES');
  if (c.includes('bycatch'))    reasons.push('bycatch');
  if (c.includes('artisanal'))  reasons.push('artisanal');
  return reasons.slice(0, 4).join(' · ') || '—';
}

function getPrioritySection(s) {
  // Re-derive section from group since meiofauna/macrobenthos store .section,
  // but vertebrates need inference
  if (s.section) return s.section;
  if (['Fish','Elasmobranch','Mammal','Turtle','Crustacean'].includes(s.group)) return 'vertebrate';
  if (['Marine-Pelagic','Marine-Demersal','Marine-Reef','Marine-Invertebrate','Marine-Plants','Marine-Mammal'].includes(s.group)) return 'marine';
  if (['Gastropod','Bivalve','Polychaete','Crustacean-macro'].includes(s.group)) return 'macrobenthos';
  if (['Meiofauna','Protist'].includes(s.group)) return 'meiofauna';
  return 'other';
}

function renderPriorityLeaderboard() {
  const tbody = document.getElementById('priority-tbody');
  if (!tbody) return;
  const groupFilter  = (document.getElementById('prio-filter-group')  || {}).value || 'all';
  const statusFilter = (document.getElementById('prio-filter-status') || {}).value || 'all';

  let pool = ALL_TAXA.filter(s => s.name && s.name !== '');
  if (groupFilter !== 'all') pool = pool.filter(s => getPrioritySection(s) === groupFilter);
  if (statusFilter !== 'all') pool = pool.filter(s => overallStatus(s) === statusFilter);

  const ranked = pool
    .map(s => ({ ...s, _score: priorityScore(s), _ov: overallStatus(s) }))
    .sort((a, b) => b._score - a._score || a.name.localeCompare(b.name))
    .slice(0, 15);

  if (!ranked.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="padding:20px;text-align:center;color:var(--text3);">No taxa match those filters.</td></tr>';
    return;
  }

  const statusBadge = (st) => {
    if (st === 'absent')  return '<span style="background:var(--red-bg);color:var(--red);padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;">✗ ABSENT</span>';
    if (st === 'partial') return '<span style="background:var(--amber-bg);color:var(--amber);padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;">~ PARTIAL</span>';
    return '<span style="background:var(--green-bg);color:var(--green);padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;">✓ PRESENT</span>';
  };

  tbody.innerHTML = ranked.map((s, i) => {
    const rankColor = i < 3 ? 'var(--red)' : i < 8 ? 'var(--amber)' : 'var(--text2)';
    const iucnHtml  = s.iucn ? iucnBadge(s.iucn) : '<span style="color:var(--text3);font-size:10px;">—</span>';
    const groupTag  = s.group || '—';
    const common    = s.common ? ' <span style="font-size:10.5px;color:var(--text3);">(' + s.common + ')</span>' : '';
    return '<tr style="border-bottom:0.5px solid var(--border);">'
      + '<td style="padding:8px 10px;text-align:center;font-weight:800;color:' + rankColor + ';font-size:13px;">' + (i + 1) + '</td>'
      + '<td style="padding:8px 10px;"><span style="font-style:italic;color:var(--navy);font-weight:600;">' + s.name + '</span>' + common + '</td>'
      + '<td style="padding:8px 10px;font-size:11px;color:var(--text2);">' + groupTag + '</td>'
      + '<td style="padding:8px 10px;text-align:center;font-size:10.5px;color:var(--text2);font-family:\'DM Mono\',monospace;">' + (s.marker || '—') + '</td>'
      + '<td style="padding:8px 10px;text-align:center;">' + statusBadge(s._ov) + '</td>'
      + '<td style="padding:8px 10px;text-align:center;">' + iucnHtml + '</td>'
      + '<td style="padding:8px 10px;text-align:center;font-weight:800;color:' + rankColor + ';font-size:14px;">' + s._score + '</td>'
      + '<td style="padding:8px 10px;font-size:11px;color:var(--text2);">' + priorityRationale(s) + '</td>'
      + '</tr>';
  }).join('');
}

function exportPriorityCSV() {
  const groupFilter  = (document.getElementById('prio-filter-group')  || {}).value || 'all';
  const statusFilter = (document.getElementById('prio-filter-status') || {}).value || 'all';
  let pool = ALL_TAXA.filter(s => s.name && s.name !== '');
  if (groupFilter !== 'all')  pool = pool.filter(s => getPrioritySection(s) === groupFilter);
  if (statusFilter !== 'all') pool = pool.filter(s => overallStatus(s) === statusFilter);
  const ranked = pool
    .map(s => ({ ...s, _score: priorityScore(s), _ov: overallStatus(s) }))
    .sort((a, b) => b._score - a._score || a.name.localeCompare(b.name));
  const header = ['rank','species','common_name','group','marker','status','iucn','priority_score','rationale'];
  const rows = ranked.map((s, i) => [
    i + 1,
    s.name,
    s.common || '',
    s.group || '',
    s.marker || '',
    s._ov,
    s.iucn || '',
    s._score,
    priorityRationale(s)
  ]);
  const esc = v => '"' + String(v).replace(/"/g, '""') + '"';
  const csv = [header.map(esc).join(','), ...rows.map(r => r.map(esc).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'NMBL_priority_sequencing_targets.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ═══ IUCN × COVERAGE CROSSTAB ════════════════════════════════════════════
function renderIucnCrosstab() {
  const container = document.getElementById('iucn-crosstab-container');
  if (!container) return;

  const iucnOrder = ['CR','EN','VU','NT','LC','DD','NE'];
  const iucnLabels = { CR:'Critically Endangered', EN:'Endangered', VU:'Vulnerable', NT:'Near Threatened', LC:'Least Concern', DD:'Data Deficient', NE:'Not Evaluated' };
  const statuses = ['present','partial','absent'];

  // Only consider taxa that have an iucn field (vertebrates)
  const taxa = ALL_TAXA.filter(s => s.iucn);
  if (!taxa.length) {
    container.innerHTML = '<p style="font-size:12px;color:var(--text3);font-style:italic;">No IUCN-annotated taxa in the current data set.</p>';
    return;
  }

  // Build matrix
  const matrix = {};
  iucnOrder.forEach(i => { matrix[i] = { present: 0, partial: 0, absent: 0, total: 0 }; });
  taxa.forEach(s => {
    const i = s.iucn || 'NE';
    const ov = overallStatus(s);
    if (matrix[i]) {
      matrix[i][ov]++;
      matrix[i].total++;
    }
  });

  const cellColor = (status, n) => {
    if (n === 0) return { bg: 'var(--bg2)', col: 'var(--text3)' };
    if (status === 'absent')  return { bg: 'var(--red-bg)',   col: 'var(--red)' };
    if (status === 'partial') return { bg: 'var(--amber-bg)', col: 'var(--amber)' };
    return { bg: 'var(--green-bg)', col: 'var(--green)' };
  };

  const iucnRowColor = (i) => {
    if (i === 'CR') return 'var(--red)';
    if (i === 'EN') return 'var(--red)';
    if (i === 'VU') return 'var(--amber)';
    if (i === 'NT') return 'var(--amber)';
    return 'var(--text2)';
  };

  let rows = '';
  iucnOrder.forEach(i => {
    if (matrix[i].total === 0) return;
    const rowCol = iucnRowColor(i);
    rows += '<tr style="border-bottom:0.5px solid var(--border);">';
    rows += '<td style="padding:9px 12px;font-size:12px;color:' + rowCol + ';font-weight:700;white-space:nowrap;">'
          + i + '<span style="font-weight:400;color:var(--text3);font-size:10px;margin-left:6px;">' + iucnLabels[i] + '</span></td>';
    statuses.forEach(st => {
      const n = matrix[i][st];
      const { bg, col } = cellColor(st, n);
      const pct = matrix[i].total ? Math.round(n / matrix[i].total * 100) : 0;
      rows += '<td style="padding:9px 12px;text-align:center;">'
            + '<span style="display:inline-block;background:' + bg + ';color:' + col + ';padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;min-width:36px;">'
            + n + (n ? ' <span style="font-size:9.5px;font-weight:500;opacity:0.8;">(' + pct + '%)</span>' : '')
            + '</span></td>';
    });
    rows += '<td style="padding:9px 12px;text-align:center;font-size:12px;color:var(--text2);font-weight:600;">' + matrix[i].total + '</td>';
    rows += '</tr>';
  });

  container.innerHTML =
    '<table style="width:100%;border-collapse:collapse;font-size:13px;min-width:520px;">'
    + '<thead><tr style="background:var(--bg2);border-bottom:2px solid var(--border);">'
    + '<th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.05em;">IUCN status</th>'
    + '<th style="padding:10px 12px;text-align:center;font-size:10px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:0.05em;">✓ Present</th>'
    + '<th style="padding:10px 12px;text-align:center;font-size:10px;font-weight:700;color:var(--amber);text-transform:uppercase;letter-spacing:0.05em;">~ Partial</th>'
    + '<th style="padding:10px 12px;text-align:center;font-size:10px;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:0.05em;">✗ Absent</th>'
    + '<th style="padding:10px 12px;text-align:center;font-size:10px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.05em;">Taxa</th>'
    + '</tr></thead>'
    + '<tbody>' + rows + '</tbody></table>';

  // Flagged-list — threatened (CR/EN/VU) species with absent or partial coverage
  const flagged = taxa
    .filter(s => ['CR','EN','VU'].includes(s.iucn) && overallStatus(s) !== 'present')
    .sort((a,b) => {
      const order = { CR: 0, EN: 1, VU: 2 };
      return (order[a.iucn] - order[b.iucn]) || a.name.localeCompare(b.name);
    });

  const flaggedEl = document.getElementById('iucn-flagged-list');
  if (!flagged.length) {
    flaggedEl.innerHTML = '<div style="padding:12px 14px;background:var(--green-bg);border:1px solid var(--green);border-radius:var(--radius);font-size:12px;color:var(--green);">All threatened taxa (CR/EN/VU) have at least partial reference coverage. ✓</div>';
    return;
  }
  flaggedEl.innerHTML =
    '<div style="font-size:12px;font-weight:700;color:var(--red);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.04em;">⚠ Threatened taxa lacking reliable reference coverage (' + flagged.length + ')</div>'
    + '<div style="display:flex;flex-wrap:wrap;gap:6px;">'
    + flagged.map(s => {
        const ov = overallStatus(s);
        const ovCol = ov === 'absent' ? 'var(--red)' : 'var(--amber)';
        const ovBg  = ov === 'absent' ? 'var(--red-bg)' : 'var(--amber-bg)';
        return '<span style="display:inline-flex;align-items:center;gap:6px;padding:5px 10px;background:var(--bg);border:0.5px solid ' + ovCol + ';border-radius:6px;font-size:11.5px;">'
             + iucnBadge(s.iucn)
             + '<span style="font-style:italic;color:var(--navy);font-weight:600;">' + s.name + '</span>'
             + (s.common ? '<span style="color:var(--text3);">(' + s.common + ')</span>' : '')
             + '<span style="background:' + ovBg + ';color:' + ovCol + ';padding:1px 6px;border-radius:10px;font-size:9.5px;font-weight:700;">' + ov.toUpperCase() + '</span>'
             + '</span>';
      }).join('')
    + '</div>';
}
