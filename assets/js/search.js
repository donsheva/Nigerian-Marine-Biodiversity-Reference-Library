// ─── GLOBAL SEARCH ─────────────────────────────────────────────────────────

function buildSearchIndex() {
  const idx = [];
  VERTEBRATES.forEach(s => idx.push({
    name:s.name, common:s.common, group:s.group, marker:s.marker,
    ncbi:s.ncbi, bold:s.bold, priority:s.priority, notes:s.notes,
    status:overallStatus({...s,bold_silva:s.bold}), section:"vertebrate", tab:"species",
    iucn:s.iucn||"NE", location:s.location||"", habitat:s.habitat||"",
    genbank:s.genbank||null, boldTaxon:s.boldTaxon||null, extra:{}
  }));
  MACROBENTHOS.forEach(s => idx.push({
    name:s.name, common:s.common, group:s.group, marker:s.marker,
    ncbi:s.ncbi, bold:s.bold, priority:s.priority, notes:s.notes,
    status:macroStatus(s), section:"macrobenthos", tab:"macrobenthos",
    iucn:"LC", location:"Niger Delta / Lagos Lagoon", habitat:s.habitat||"",
    genbank:s.genbank||null, boldTaxon:s.boldTaxon||null,
    extra:{habitat:s.habitat}
  }));
  MARINE.forEach(s => idx.push({
    name:s.name, common:s.common, group:s.group, marker:s.marker,
    ncbi:s.ncbi, bold:s.bold, priority:s.priority, notes:s.notes,
    status:marineStatus(s), section:"marine", tab:"marine",
    iucn:s.iucn||"NE", location:"Gulf of Guinea", habitat:s.habitat||"Marine",
    genbank:s.genbank||null, boldTaxon:s.boldTaxon||null,
    extra:{endemic:GULF_ENDEMICS.includes(s.name)}
  }));
  MEIOFAUNA_OTHER.forEach(s => idx.push({
    name:s.name, common:s.common, group:s.group, marker:s.marker,
    ncbi:s.ncbi, bold:s.bold, priority:s.priority, notes:s.notes,
    status:overallStatus({...s,bold_silva:s.bold}), section:"meiofauna", tab:"species",
    genbank:s.genbank||null, boldTaxon:s.boldTaxon||null, extra:{}
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

// ── Called by partials.js after header/nav/footer are injected ─────────────
function bindGlobalKeyboard() {
  // Close dropdown when clicking outside search wrap
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap')) {
      const dd = document.getElementById('search-dropdown');
      if (dd) dd.classList.remove('open');
    }
  });

  // Escape: close popup first, then search dropdown
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const overlay = document.getElementById('popup-overlay');
      if (overlay && overlay.classList.contains('open')) {
        closePopup();
      } else {
        const dd = document.getElementById('search-dropdown');
        if (dd && dd.classList.contains('open')) clearSearch();
      }
    }
  });

  // Cmd/Ctrl+K opens the global search; '/' focuses it
  document.addEventListener('keydown', function(e) {
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
    const cmdK  = (isMac ? e.metaKey : e.ctrlKey) && (e.key === 'k' || e.key === 'K');
    if (cmdK) {
      e.preventDefault();
      const s = document.getElementById('global-search');
      if (s) { s.focus(); s.select(); }
    }
    // Press '/' to focus search (when not already in an input)
    if (e.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      const s = document.getElementById('global-search');
      if (s) { s.focus(); }
    }
    // Esc clears search dropdown
    if (e.key === 'Escape') {
      const dd = document.getElementById('search-dropdown');
      if (dd && dd.style.display !== 'none') dd.style.display = 'none';
    }
  });

  // Platform-aware shortcut label + auto-hide on focus
  (function() {
    const hint = document.getElementById('search-kbd-hint');
    const search = document.getElementById('global-search');
    if (!hint || !search) return;
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
    if (!isMac) hint.textContent = '⌃K';
    search.addEventListener('focus', function() { hint.style.display = 'none'; });
    search.addEventListener('blur',  function() { if (!search.value) hint.style.display = ''; });
  })();
}
