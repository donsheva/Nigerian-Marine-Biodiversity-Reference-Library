// ─── ACTIVE NAV HIGHLIGHT ──────────────────────────────────────────────────

function highlightActiveNav() {
  // Derive the current page slug from the first path segment after the root.
  // /database/  → "database"
  // /gap-analysis/ → "gap-analysis"
  // /  (root redirect) → "database"
  const parts = window.location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  const slug  = parts[0] || 'database';

  document.querySelectorAll('.site-nav-btn[data-page]').forEach(el => {
    if (el.dataset.page === slug) {
      el.classList.add('nav-pg-active');
    } else {
      el.classList.remove('nav-pg-active');
    }
  });
}
