// ─── SPECIES POPUP ─────────────────────────────────────────────────────────
// Layout (v22.3): status + reason → record table → details → notes →
// collapsible data history → links. One scroll area; no empty placeholders.

const _esc = t => String(t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const _stCol = v => v === 'present' ? ['var(--green-bg)','var(--green)'] : v === 'absent' ? ['var(--red-bg)','var(--red)'] : ['var(--amber-bg)','var(--amber)'];
const _pill = (v, big) => {
  const [bg, col] = _stCol(v);
  return '<span class="pp-pill' + (big ? ' pp-pill-big' : '') + '" style="background:' + bg + ';color:' + col + ';">'
       + (v === 'present' ? '✓ ' : v === 'absent' ? '✗ ' : '~ ') + v + '</span>';
};
const _n = v => (v === undefined || v === null) ? '—' : (v < 0 ? 'n/q' : Number(v).toLocaleString());

// Split curator notes from the version-by-version data history ("Earlier versions…", "v22.1 (…):", "v22.3:")
function _splitNotes(t) {
  if (!t) return ['', ''];
  const m = t.match(/(^|\s)(?=(Earlier versions|v2\d(\.\d)?\b))/);
  if (!m) return [t, ''];
  return [t.slice(0, m.index).trim(), t.slice(m.index).trim()];
}

// Why a database got its status, in words (v21 thresholds)
function _reason(db, wa, marker) {
  const thr = (typeof WA_THRESHOLD !== 'undefined' && WA_THRESHOLD[marker] !== undefined) ? WA_THRESHOLD[marker] : 3;
  if (wa === undefined) return null;
  const st = wa === 0 ? 'absent' : wa >= thr ? 'present' : 'partial';
  const recs = wa === 0 ? 'no West African ' + marker + ' record' : wa + ' West African ' + marker + ' record' + (wa === 1 ? '' : 's');
  return { st, text: '<strong>' + db + ':</strong> ' + recs + (wa > 0 && wa < thr ? ' (threshold ' + thr + ')' : '') + ' → ' + st };
}

function openPopup(idx) {
  const dd = document.getElementById('search-dropdown');
  if (!dd) return;
  const s = dd._results && dd._results[idx];
  if (!s) return;
  dd.classList.remove('open');
  const overlay = document.getElementById('popup-overlay');
  if (!overlay) return;

  // Header
  const sec  = s.section;
  const ibg  = sec === 'nematode' ? 'var(--purple-bg)' : sec === 'marine' ? 'var(--blue-bg)' : sec === 'macrobenthos' ? 'var(--teal-bg)' : 'var(--bg2)';
  const icol = sec === 'nematode' ? 'var(--purple)'    : sec === 'marine' ? 'var(--blue)'    : sec === 'macrobenthos' ? 'var(--teal)'    : 'var(--text2)';
  const icon = document.getElementById('popup-icon');
  if (icon) {
    icon.textContent = s.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    icon.style.background = ibg; icon.style.color = icol;
  }
  const pName = document.getElementById('popup-name');
  const pCommon = document.getElementById('popup-common');
  if (pName) pName.innerHTML = (typeof displayName === 'function') ? displayName(s.name) : _esc(s.name);
  if (pCommon) pCommon.textContent = [s.common, s.group].filter(Boolean).join(' · ');

  const rec  = [VERTEBRATES, MACROBENTHOS, MARINE, MEIOFAUNA_OTHER].map(a => a.find(x => x.name === s.name)).find(Boolean);
  const nrec = sec === 'nematode' ? NEMATODES.find(n => n.genus === s.name) : null;

  // 1 · Status and the reason for it
  let html = '<div class="pp-status">' + _pill(s.status, true) + '<div class="pp-why">';
  const reasons = [];
  if (rec && rec.ncbi_wa !== undefined) {
    reasons.push(_reason('NCBI', rec.ncbi_wa, s.marker));
    if (rec.bold_wa !== undefined) reasons.push(_reason('BOLD', rec.bold_wa, s.marker));
  } else if (nrec) {
    reasons.push(_reason('NCBI / SILVA', nrec.wa18s, '18S'));
  }
  html += reasons.filter(Boolean).map(r => '<div>' + r.text + '</div>').join('')
       || '<div>NCBI: ' + s.ncbi + ' · BOLD: ' + s.bold + '</div>';
  html += '<div class="pp-rule">Overall: absent only if absent in both databases; present only if the threshold is met in both.</div></div></div>';

  // 2 · Reference records table
  if (rec && rec.ncbi_global !== undefined) {
    html += '<div class="pp-h">Reference sequences · ' + _esc(s.marker) + '</div>'
         + '<table class="pp-table"><thead><tr><th></th><th>Global</th><th>West Africa</th><th>Nigeria</th></tr></thead><tbody>'
         + '<tr><th>NCBI GenBank</th><td>' + _n(rec.ncbi_global) + '</td><td>' + _n(rec.ncbi_wa) + '</td><td>' + _n(rec.ncbi_ng || 0) + '</td></tr>'
         + (rec.bold_global !== undefined ? '<tr><th>BOLD</th><td>' + _n(rec.bold_global) + '</td><td>' + _n(rec.bold_wa) + '</td><td>' + _n(rec.bold_ng || 0) + '</td></tr>' : '')
         + '</tbody></table>';
    if (rec.ncbi_all !== undefined)
      html += '<div class="pp-sub">All NCBI records for this taxon, any gene: <strong>' + _n(rec.ncbi_all) + '</strong> (only ' + _esc(s.marker) + ' counts towards status)</div>';
  } else if (nrec) {
    html += '<div class="pp-h">Reference sequences</div>'
         + '<table class="pp-table"><thead><tr><th></th><th>Global (SILVA)</th><th>West Africa</th><th>Nigeria</th></tr></thead><tbody>'
         + '<tr><th>18S (SSU)</th><td>' + _n(nrec.global18s) + '</td><td>' + _n(nrec.wa18s) + '</td><td>' + _n(nrec.ng18s) + '</td></tr>'
         + '<tr><th>28S (LSU)</th><td>' + _n(nrec.global28s) + '</td><td>' + _n(nrec.wa28s || 0) + '</td><td>' + _n(nrec.ng28s || 0) + '</td></tr>'
         + '</tbody></table><div class="pp-sub">West African and Nigerian counts checked in SILVA and NCBI.</div>';
  }

  // 3 · Details
  const priCol = s.priority === 'high' ? 'var(--red)' : s.priority === 'med' ? 'var(--amber)' : 'var(--text3)';
  const rows = [
    ['Primary marker', _esc(s.marker)],
    ['IUCN Red List', s.iucn ? ((typeof iucnBadge === 'function') ? iucnBadge(s.iucn) : _esc(s.iucn)) : '<span style="color:var(--text3);font-weight:500;">not recorded on this site</span>'],
    ['Collection priority', '<span style="color:' + priCol + ';">' + _esc(s.priority) + '</span>'],
  ];
  if (s.location) rows.push(['Project sampling area', _esc(s.location)]);
  const hab = s.habitat || (s.extra && s.extra.habitat);
  if (hab) rows.push(['Habitat', _esc(hab)]);
  if (s.extra && s.extra.endemic) rows.push(['Range', '<span style="color:var(--blue);">West African endemic</span>']);
  if (s.extra && s.extra.order) rows.push(['Nematode order', _esc(s.extra.order)]);
  if (s.extra && s.extra.response) rows.push(['Pollution response', _esc(s.extra.response) + (s.extra.cp ? ' (c-p ' + _esc(s.extra.cp) + ')' : '')]);
  if (s.extra && s.extra.evidence) rows.push(['Response evidence', s.extra.evidence]);
  html += '<div class="pp-h">Details</div><div class="pp-grid">'
       + rows.map(([l, v]) => '<div class="pp-k">' + l + '</div><div class="pp-v">' + v + '</div>').join('') + '</div>';

  // Voucher photo only when one exists
  if (s.image) html += '<div class="pp-photo"><img src="' + _esc(s.image) + '" alt="' + _esc(s.name) + ' voucher" loading="lazy"></div>';

  // 4 · Notes + collapsible data history
  const [notes, history] = _splitNotes(s.notes);
  if (notes) html += '<div class="pp-h">Notes</div><div class="pp-notes">' + notes + '</div>';
  if (history) html += '<details class="pp-hist"><summary>Data history and verification</summary><div>' + history + '</div></details>';

  const pbody = document.getElementById('popup-body');
  if (pbody) { pbody.innerHTML = html; pbody.scrollTop = 0; }
  const pnotes = document.getElementById('popup-notes');
  if (pnotes) { pnotes.innerHTML = ''; pnotes.style.display = 'none'; }

  // 5 · Links: databases first, then site navigation
  let gbLink = '', boldLink = '';
  if (s.status === 'present' || s.genbank || (rec && rec.ncbi_global > 0) || (nrec && nrec.global18s > 0)) {
    const info = (typeof NAME_INFO !== 'undefined' && NAME_INFO[s.name]) || {};
    const orgNames = [s.name].concat(info.accepted ? [info.accepted] : []).concat(info.synonymOf ? [info.synonymOf] : []);
    // Organism-only search on every name; a marker word would miss mitochondrial genomes
    const gbUrl = s.genbank
      ? 'https://www.ncbi.nlm.nih.gov/nuccore/' + s.genbank
      : 'https://www.ncbi.nlm.nih.gov/nuccore/?term=' + encodeURIComponent(orgNames.map(n => '"' + n + '"[ORGN]').join(' OR '));
    gbLink = '<a href="' + gbUrl + '" target="_blank" rel="noopener" class="popup-action pp-db pp-ncbi">' + (s.genbank ? 'GenBank ' + s.genbank : 'Open in NCBI') + ' ↗</a>';
  }
  if (s.status === 'present' || s.boldTaxon || (s.bold && s.bold !== 'absent') || (rec && rec.bold_global > 0)) {
    const binfo = (typeof NAME_INFO !== 'undefined' && NAME_INFO[s.name]) || {};
    const bTaxon = s.boldTaxon || binfo.accepted || binfo.synonymOf || s.name;
    boldLink = '<a href="https://www.boldsystems.org/index.php/Taxbrowser_Taxonpage?taxon=' + encodeURIComponent(bTaxon)
             + '" target="_blank" rel="noopener" class="popup-action pp-db pp-bold">Open in BOLD ↗</a>';
  }
  // goToTaxa/switchTab/goToSearch exist only on /gap-analysis/; elsewhere, navigate there
  const hasTaxaTable = !!document.getElementById('filt-group');
  const q = v => v.replace(/'/g, "\\'");
  const gotoGroup = hasTaxaTable ? "closePopup();goToTaxa('" + q(s.group) + "','all')" : "location.href='/gap-analysis/?group=" + encodeURIComponent(s.group) + "&status=all'";
  const searchTbl = hasTaxaTable ? "closePopup();goToSearch('" + q(s.name) + "')" : "location.href='/gap-analysis/?q=" + encodeURIComponent(s.name) + "'";

  const pfooter = document.getElementById('popup-footer');
  if (pfooter) pfooter.innerHTML = gbLink + boldLink
    + '<button class="popup-action" onclick="' + searchTbl + '">Show in table</button>'
    + '<button class="popup-action" onclick="' + gotoGroup + '">All ' + _esc(s.group) + ' taxa</button>';

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  const card = document.getElementById('popup-card');
  if (card) { card.setAttribute('tabindex', '-1'); card.style.outline = 'none'; card.focus({ preventScroll: true }); }
}

function closePopup() {
  const o = document.getElementById('popup-overlay');
  if (o) o.classList.remove('open');
  document.body.style.overflow = '';
}
function closePopupOnOverlay(e) { if (e.target === document.getElementById('popup-overlay')) closePopup(); }
