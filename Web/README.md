This folder contains the multi-page static website for the Nigeria Marine Biodiversity Library (EnviroBiotics.org).

## Site Structure

```
Web/
  index.html            # Overview / database summary (landing page)
  gap-analysis.html     # Interactive gap analysis dashboard with all data tabs
  statistics.html       # Coverage statistics, charts, and marker gene tables
  citations.html        # How to cite this library and partner databases
  gallery.html          # Media gallery (voucher photos, microscopy, field images)
  resources.html        # Reference databases, taxonomic tools, and policy links
  contact.html          # Contact form and collaboration information
  about.html            # Project mission, team, scope, and roadmap
  css/
    styles.css          # All site styles (responsive, dark mode, print)
  js/
    main.js             # Species data, search, tables, filtering, popups, exports
  nigeria_reflib_dashboard_v13.html  # Original single-file version (archive)
```

## Deployment

This is a static site — no build step required. Upload all files to any web host, CDN, or GitHub Pages. All pages share the same CSS and JS files, with a common header, navigation, and footer.
