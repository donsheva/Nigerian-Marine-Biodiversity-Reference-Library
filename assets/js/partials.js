// ─── SHARED PARTIAL LOADER (Option A — JS fetch) ──────────────────────────
// Injects header.html, nav.html, footer.html into their placeholder divs,
// then re-binds keyboard shortcuts, active-nav highlight, back-to-top, and
// the global search index.

(async () => {
  const inject = async (id, file) => {
    const el = document.getElementById(id);
    if (!el) return;
    try {
      const r = await fetch('/assets/partials/' + file);
      if (!r.ok) throw new Error(r.status);
      el.innerHTML = await r.text();
    } catch (err) {
      console.warn('partials.js: could not load', file, err);
    }
  };

  await inject('site-header', 'header.html');
  await inject('site-nav',    'nav.html');
  await inject('site-footer', 'footer.html');

  // Build global search index now that header search input is in the DOM
  if (typeof buildSearchIndex === 'function') {
    SEARCH_INDEX = buildSearchIndex();
  }

  // Bind keyboard shortcuts (Cmd/Ctrl+K, /, Esc)
  if (typeof bindGlobalKeyboard === 'function') bindGlobalKeyboard();

  // Highlight the current page in the nav
  if (typeof highlightActiveNav === 'function') highlightActiveNav();

  // Wire up back-to-top scroll listener
  if (typeof bindBackToTop === 'function') bindBackToTop();

  // Newsletter subscribe on Enter key in footer email input
  const emailEl = document.getElementById('footer-email');
  if (emailEl) {
    emailEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') nmblSubscribe();
    });
  }
})();
