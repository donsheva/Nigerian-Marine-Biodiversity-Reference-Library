// ─── SPECIES POPUP ─────────────────────────────────────────────────────────

function openPopup(idx) {
  const dd = document.getElementById('search-dropdown');
  if (!dd) return;
  const s  = dd._results && dd._results[idx];
  if (!s) return;
  dd.classList.remove('open');
  // Ensure popup overlay exists
  const overlay = document.getElementById('popup-overlay');
  if (!overlay) return;

  const sec     = s.section;
  const ibg     = sec === 'nematode' ? 'var(--purple-bg)' : sec === 'marine' ? 'var(--blue-bg)' : sec === 'macrobenthos' ? 'var(--teal-bg)' : 'var(--bg2)';
  const icol    = sec === 'nematode' ? 'var(--purple)'    : sec === 'marine' ? 'var(--blue)'    : sec === 'macrobenthos' ? 'var(--teal)'    : 'var(--text2)';
  const icon    = document.getElementById('popup-icon');
  icon.textContent  = s.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  icon.style.background = ibg;
  icon.style.color      = icol;

  const pName = document.getElementById('popup-name');
  const pCommon = document.getElementById('popup-common');
  if (pName) pName.textContent = s.name;
  if (pCommon) pCommon.textContent = s.common;


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
    : `<div style="width:100%;height:100px;border-radius:var(--radius);background:linear-gradient(135deg,var(--bg2),var(--bg3));border:1px dashed var(--border2);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;margin-bottom:10px;">
        <span style="font-size:22px;opacity:0.4;">🔬</span>
        <span style="font-size:10.5px;color:var(--text3);font-weight:500;">Voucher photograph not yet deposited</span>
       </div>`;

  const pbody = document.getElementById('popup-body'); if (pbody) pbody.innerHTML = imgHtml + rows.map(([lbl, val]) =>
    '<div class="popup-row"><span class="popup-row-label">' + lbl + '</span><div class="popup-row-val">' + val + '</div></div>'
  ).join('');

  const pnotes = document.getElementById('popup-notes'); if (pnotes) pnotes.innerHTML = s.notes
    ? '<strong style="color:var(--text2);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Notes</strong><br>' + s.notes
    : '';

  const tabLabel = s.tab.charAt(0).toUpperCase() + s.tab.slice(1);
  // Build GenBank and BOLD links for species with sequence data
  let gbLink = '', boldLink = '';
  const overSt = s.status;
  if (overSt === 'present' || s.genbank) {
    const gbAcc = s.genbank || '';
    const gbUrl = gbAcc
      ? 'https://www.ncbi.nlm.nih.gov/nuccore/' + gbAcc
      : 'https://www.ncbi.nlm.nih.gov/nuccore/?term=' + encodeURIComponent(s.name + '[ORGN] ' + s.marker);
    const gbLabel = gbAcc ? 'GenBank: ' + gbAcc : 'Search NCBI';
    gbLink = '<a href="' + gbUrl + '" target="_blank" class="popup-action" style="text-decoration:none;background:var(--green-bg);color:var(--green);border-color:rgba(10,107,78,0.3);">🔗 ' + gbLabel + '</a>';
  }
  if (overSt === 'present' || s.boldTaxon || (s.bold && s.bold !== 'absent')) {
    const bTaxon = s.boldTaxon || s.name;
    const bUrl = 'https://www.boldsystems.org/index.php/Taxbrowser_Taxonpage?taxon=' + encodeURIComponent(bTaxon);
    boldLink = '<a href="' + bUrl + '" target="_blank" class="popup-action" style="text-decoration:none;background:var(--blue-bg);color:var(--blue);border-color:rgba(20,98,232,0.3);">🔗 BOLD: ' + bTaxon + '</a>';
  }
  // goToTaxa/switchTab/goToSearch only work on the /gap-analysis/ page (the
  // only page with the filter/tab/table markup they operate on). From any
  // other page, send the user there instead of calling undefined functions.
  const hasTaxaTable = !!document.getElementById('filt-group');
  const gotoGroupAction  = hasTaxaTable
    ? "closePopup();goToTaxa('" + s.group.replace(/'/g, "\\'") + "','all')"
    : "location.href='/gap-analysis/?group=" + encodeURIComponent(s.group) + "&status=all'";
  const openTabAction    = hasTaxaTable
    ? "closePopup();switchTab('" + s.tab + "')"
    : "location.href='/gap-analysis/?tab=" + encodeURIComponent(s.tab) + "'";
  const searchTableAction = hasTaxaTable
    ? "closePopup();goToSearch('" + s.name.replace(/'/g, "\\'") + "')"
    : "location.href='/gap-analysis/?q=" + encodeURIComponent(s.name) + "'";

  const pfooter = document.getElementById('popup-footer'); if (pfooter) pfooter.innerHTML =
      '<button class="popup-action" onclick="' + gotoGroupAction + '">View group in All Taxa</button>'
    + '<button class="popup-action" onclick="' + openTabAction + '">Open ' + tabLabel + ' tab</button>'
    + '<button class="popup-action" onclick="' + searchTableAction + '">Search in table</button>'
    + gbLink + boldLink;

  if (overlay) overlay.classList.add('open');
}


function closePopup() { document.getElementById("popup-overlay").classList.remove("open"); }
function closePopupOnOverlay(e) { if (e.target===document.getElementById("popup-overlay")) closePopup(); }
