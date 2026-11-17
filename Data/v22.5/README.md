# v22.5 — nematode genus additions (in progress)

Adds seven genera typical of tropical estuarine and lagoon muds to the nematode list:
*Sabatieria*, *Daptonema*, *Theristus*, *Paracomesoma*, *Dorylaimopsis*, *Halalaimus*, *Viscosia*.

`nmbl_v22_requery_cache.json` is copied from `Data/v22.4`, so running the script here
re-uses every existing result and queries only the new genera (WoRMS, SILVA SSU/LSU, NCBI 18S/28S).

Run from this folder:

    python ..\..\Scripts\nmbl_v22_requery.py --email YOUR_EMAIL

Pending decision: replace *Plectus*, *Monhystera* and *Aphanolaimus* (mainly terrestrial/freshwater)
once the new counts are in.
