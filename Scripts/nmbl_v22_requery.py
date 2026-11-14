"""
nmbl_v22_requery.py - NMBL v22 re-query with accepted names (Biopython Entrez + BOLD v5 + WoRMS)

Run on your own computer (needs internet access to NCBI, BOLD and WoRMS):
    pip install biopython requests
    python nmbl_v22_requery.py --email you@example.org [--api-key NCBI_KEY]

What it does, for each of the 107 species/higher taxa in data.js:
  1. WoRMS: resolves the accepted name. If the site name is outdated, both names are queried.
  2. NCBI Nucleotide (Biopython Entrez), same method as the v22 release:
       ("name1"[Organism] OR "name2"[Organism]) AND <marker clause> NOT srcdb_refseq[Properties]
     The marker clause includes mitochondrial genomes (COI, 12S) and chloroplast genomes (rbcL).
     A record counts as West African (WA) only if its GenBank `country` qualifier names
     a WA state (Mauritania to Cameroon, plus Cabo Verde). Nigeria is counted separately.
  3. BOLD v5 API: global and per-country WA counts for the marker, summed over both names.

Part 2 - the 25 nematode genera:
  4. WoRMS check of each genus name.
  5. NCBI 18S and 28S (global / WA / Nigeria), same method as above.
  6. SILVA SSU r144 and LSU r138.2 genus counts (organism-name match), via the SILVA
     search service used by its website (legatum.arb-silva.de). SILVA is built from
     INSDC, so its WA count equals the NCBI WA count.

Part 3 - completeness checks (v22.3):
  7. For every species/higher taxon: the total number of NCBI Nucleotide records for
     ANY gene (organism only, all names, RefSeq excluded) - shown on the site so a
     marker count of 1 is not mistaken for "1 record in total".
  8. Marine mammals (Sousa, Trichechus): genus-level search for every NCBI record with
     a West African country, whatever species name it is filed under (catches records
     filed as "Sousa sp." / "Trichechus sp." or under other names). Each record is listed.

Outputs (in the current folder):
  nmbl_v22_requery_results.csv   one row per taxon
  nmbl_v22_requery_results.json  same, plus WA accession numbers (species and nematodes)
  nmbl_v22_nematodes_results.csv one row per nematode genus
  nmbl_v22_all_records.csv       total NCBI records (any gene) per taxon
  nmbl_v22_mammal_wa_check.csv   every West African Sousa / Trichechus record in NCBI
  nmbl_v22_requery.log           progress log

Takes about 25-40 minutes without an NCBI API key (10-15 with one). Safe to re-run:
finished taxa are cached in nmbl_v22_requery_cache.json and skipped.
"""
import argparse, csv, json, os, re, sys, time
import requests
from Bio import Entrez

TAXA = [  # (site name, marker) - from assets/js/data.js, v22
 ("Ethmalosa fimbriata","12S"),("Sardinella maderensis","12S"),("Sardinella aurita","12S"),("Pseudotolithus senegalensis","12S"),
 ("Pseudotolithus elongatus","12S"),("Cynoglossus senegalensis","12S"),("Galeoides decadactylus","12S"),("Polydactylus quadrifilis","12S"),
 ("Lutjanus agennes","12S"),("Arius latiscutatus","12S"),("Brachydeuterus auritus","12S"),("Pomadasys jubelini","12S"),("Elops lacerta","12S"),
 ("Drepane africana","12S"),("Mugil cephalus","12S"),("Chrysichthys nigrodigitatus","12S"),("Rhizoprionodon acutus","12S"),
 ("Rhinobatos rhinobatos","12S"),("Hypanus marianae","12S"),("Carcharhinus leucas","12S"),("Sphyrna lewini","12S"),("Penaeus notialis","COI"),
 ("Callinectes amnicola","COI"),("Parapenaeus longirostris","COI"),("Macrobrachium vollenhovenii","COI"),("Trichechus senegalensis","COI"),
 ("Sousa teuszii","COI"),("Tursiops truncatus","COI"),("Chelonia mydas","12S"),("Dermochelys coriacea","12S"),("Lepidochelys olivacea","12S"),
 ("Harpacticoida","18S"),("Ostracoda","COI"),("Tardigrada","18S"),("Gastrotricha","18S"),("Kinorhyncha","18S"),("Foraminifera","18S"),
 ("Ciliophora","18S"),("Bacillariophyta","18S"),("Polychaeta","COI"),("Tympanotonos fuscatus","COI"),("Tympanotonos radula","COI"),
 ("Pachymelania aurita","COI"),("Pachymelania fusca","COI"),("Telescopium telescopium","COI"),("Neritina glabrata","COI"),("Lanistes varicus","COI"),
 ("Crassostrea gasar","COI"),("Egeria radiata","COI"),("Senilia senilis","COI"),("Mytilaster minimus","COI"),("Corbula trigona","COI"),
 ("Sphaerium nodicostatum","COI"),("Capitella capitata","COI"),("Nereis diversicolor","COI"),("Perinereis cultrifera","COI"),
 ("Marphysa sanguinea","COI"),("Sabella pavonina","COI"),("Hydroides elegans","COI"),("Uca tangeri","COI"),("Uca inversa","COI"),
 ("Sesarma huzardi","COI"),("Goniopsis pelii","COI"),("Cardisoma armatum","COI"),("Callinectes pallidus","COI"),("Thunnus albacares","12S"),
 ("Katsuwonus pelamis","12S"),("Thunnus obesus","12S"),("Xiphias gladius","12S"),("Coryphaena hippurus","12S"),("Scomber japonicus","12S"),
 ("Scomberomorus tritor","12S"),("Caranx hippos","12S"),("Trichiurus lepturus","12S"),("Dentex angolensis","12S"),("Pagellus bellottii","12S"),
 ("Epinephelus aeneus","12S"),("Sparus caeruleostictus","12S"),("Pseudupeneus prayensis","12S"),("Pteroscion peli","12S"),
 ("Pomadasys rogerii","12S"),("Lutjanus goreensis","12S"),("Acropora palmata","COI"),("Porites porites","COI"),("Holothuria atra","COI"),
 ("Holothuria scabra","COI"),("Diadema antillarum","COI"),("Echinometra lucunter","COI"),("Ophiura ophiura","COI"),("Octopus vulgaris","COI"),
 ("Sepia officinalis","COI"),("Loligo vulgaris","COI"),("Charonia variegata","COI"),("Strombus latus","COI"),("Murex brandaris","COI"),
 ("Penaeus kerathurus","COI"),("Halophila stipulacea","rbcL"),("Thalassia testudinum","rbcL"),("Sargassum natans","rbcL"),
 ("Sargassum fluitans","rbcL"),("Ulva lactuca","rbcL"),("Gracilaria corticata","rbcL"),("Megaptera novaeangliae","COI"),
 ("Physeter macrocephalus","COI"),("Stenella frontalis","COI"),("Balaenoptera brydei","COI"),("Orcinus orca","COI"),
]

NEMATODE_GENERA = ["Chromadora","Chromadorita","Ptycholaimellus","Dichromadora","Innocuonema","Desmodora","Spirinia",
 "Metachromadora","Monhystera","Terschellingia","Diplolaimelloides","Sphaerolaimus","Enoplus","Thoracostoma","Eurystomina",
 "Oxystomina","Axonolaimus","Odontophora","Campylaimus","Desmoscolex","Quadricoma","Aphanolaimus","Stylotheristus",
 "Pellioditis","Plectus"]

WA_RE = re.compile(r"^(Mauritania|Senegal|Gambia|Guinea-Bissau|Guinea|Sierra Leone|Liberia|Cote d'Ivoire|Côte d'Ivoire|Ivory Coast|"
                   r"Ghana|Togo|Benin|Nigeria|Cameroon|Cabo Verde|Cape Verde)$", re.I)
MITO = '((mitochondrion[Title] OR mitochondrial[Title]) AND genome[Title])'
MARKER = {
    "COI": f'(COI[Title] OR COX1[Title] OR CO1[Title] OR "cytochrome c oxidase subunit I"[Title] OR "cytochrome c oxidase subunit 1"[Title] '
           f'OR "cytochrome oxidase subunit I"[Title] OR "cytochrome oxidase subunit 1"[Title] OR {MITO})',
    "12S": f'(12S[Title] OR {MITO})',
    "18S": '(18S[Title] OR "small subunit ribosomal RNA"[Title])',
    "28S": '(28S[Title] OR "large subunit ribosomal RNA"[Title])',
    "rbcL": '(rbcL[Title] OR "ribulose-1,5-bisphosphate carboxylase/oxygenase large subunit"[Title] OR '
            '((chloroplast[Title] OR plastid[Title]) AND genome[Title]))',
}
NAMES = ["Nigeria","Ghana","Cameroon","Benin","Togo","Senegal","Guinea","Ivoire","Ivory","Liberia","Sierra Leone","Gambia",
         "Mauritania","Cabo Verde","Cape Verde","Bissau","Gulf of Guinea"]
NAMEQ = "(" + " OR ".join(f'"{n}"[All Fields]' for n in NAMES) + ")"
BOLD = "https://portal.boldsystems.org"
BOLD_MARKER = {"COI": re.compile(r"^COI-(5P|3P)$", re.I), "12S": re.compile(r"^12S", re.I),
               "18S": re.compile(r"^18S", re.I), "rbcL": re.compile(r"^rbcL", re.I)}

log_f = open("nmbl_v22_requery.log", "a", encoding="utf-8")
def log(msg):
    line = time.strftime("%H:%M:%S ") + msg
    print(line); log_f.write(line + "\n"); log_f.flush()

def retry(fn, tries=4, wait=5):
    for i in range(tries):
        try:
            return fn()
        except Exception as e:
            code = getattr(getattr(e, "response", None), "status_code", None)
            if i == tries - 1 or (code is not None and 400 <= code < 500 and code != 429):
                raise  # client errors will not succeed on retry
            log(f"   retry {i+1}: {e}"); time.sleep(wait * (i + 1))

# ---------- WoRMS ----------
def worms_names(name):
    def go():
        r = requests.get(f"https://www.marinespecies.org/rest/AphiaRecordsByName/{requests.utils.quote(name)}",
                         params={"like": "false", "marine_only": "false"}, timeout=30)
        return r.json() if r.status_code == 200 else []
    recs = retry(go)
    if not recs:
        return [name], "not in WoRMS"
    if any(r.get("status") == "accepted" for r in recs):
        return [name], "accepted"
    valid = recs[0].get("valid_name")
    if valid and valid != name:
        return [name, valid], f"{recs[0].get('status')} -> {valid}"
    return [name], recs[0].get("status", "")

# ---------- NCBI (Biopython Entrez) ----------
def esearch_count(term, retmax=0):
    def go():
        h = Entrez.esearch(db="nucleotide", term=term, retmax=retmax)
        r = Entrez.read(h); h.close(); return r
    r = retry(go); time.sleep(PAUSE)
    return int(r["Count"]), list(r["IdList"])

def countries(ids):
    out = []
    for i in range(0, len(ids), 200):
        def go():
            h = Entrez.esummary(db="nucleotide", id=",".join(ids[i:i+200]), retmode="json")
            data = json.loads(h.read()); h.close(); return data
        data = retry(go); time.sleep(PAUSE)
        res = data.get("result", {})
        for uid in res.get("uids", []):
            d = res[uid]
            st = (d.get("subtype") or "").split("|"); sn = (d.get("subname") or "").split("|")
            if "country" in st:
                out.append((d.get("accessionversion"), sn[st.index("country")].split(":")[0].strip()))
    return out

def ncbi(names, marker):
    org = "(" + " OR ".join(f'"{n}"[Organism]' for n in names) + ")"
    base = f"{org} AND {MARKER[marker]} NOT srcdb_refseq[Properties]"
    g, _ = esearch_count(base)
    c, ids = esearch_count(f"{base} AND {NAMEQ}", retmax=10000)
    recs = countries(ids) if ids else []
    wa = [(a, ctry) for a, ctry in recs if WA_RE.match(ctry)]
    tally = {}
    for _, ctry in wa:
        tally[ctry] = tally.get(ctry, 0) + 1
    return {"global": g, "wa": len(wa), "ng": sum(1 for _, x in wa if x.lower() == "nigeria"),
            "wa_countries": tally, "wa_accessions": [a for a, _ in wa]}

# ---------- BOLD v5 ----------
def bold_get(path, params):
    def go():
        r = requests.get(BOLD + path, params=params, timeout=60)
        r.raise_for_status(); return r.json()
    out = retry(go, tries=5); time.sleep(0.3); return out

def bold_one(name, marker):
    # BOLD's preprocessor can reject a plain name (HTTP 400, e.g. Hediste diversicolor);
    # fall back to explicit ranks, which do not need resolving.
    tax = None
    try:
        pre = bold_get("/api/query/preprocessor", {"query": "tax:" + name})
        terms = pre.get("successful_terms") or []
        if terms:
            tax = terms[0]["matched"]
    except requests.HTTPError as e:
        if e.response is None or e.response.status_code != 400:
            raise
        log(f"   BOLD preprocessor rejected '{name}'; trying explicit rank")
    if tax is None:
        rank = "species" if " " in name.strip() else "genus"
        test = f"tax:{rank}:{name}"
        try:
            bold_get("/api/summary", {"query": test, "fields": "marker_code", "reduce_operation": "count"})
            tax = test
        except requests.HTTPError:
            return None
    s = bold_get("/api/summary", {"query": tax, "fields": "country/ocean,marker_code", "reduce_operation": "count"})
    mk = lambda mc: sum(v for k, v in (mc or {}).items() if BOLD_MARKER[marker].match(k))
    g = mk(s.get("marker_code")); allrec = sum((s.get("marker_code") or {}).values())
    wa = ng = 0
    for c in [c for c in (s.get("country/ocean") or {}) if WA_RE.match(c)]:   # per country: combined queries time out
        r = bold_get("/api/summary", {"query": f"{tax};geo:country/ocean:{c}", "fields": "marker_code", "reduce_operation": "count"})
        n = mk(r.get("marker_code")); wa += n
        if c.lower() == "nigeria": ng = n
    return {"global": g, "wa": wa, "ng": ng, "all_records": allrec}

def bold(names, marker):
    tot = {"global": 0, "wa": 0, "ng": 0, "all_records": 0}; per = {}
    for n in names:
        r = bold_one(n, marker)
        per[n] = r
        if r:
            for k in tot: tot[k] += r[k]
    tot["per_name"] = per
    return tot

# ---------- SILVA ----------
SILVA = requests.Session()
def silva_count(name, db):
    """Accession count for an organism-name search in SILVA (db = 'ssu-144' or 'lsu-138.2')."""
    if not SILVA.cookies:
        SILVA.get("https://legatum.arb-silva.de/search/", timeout=60)
    form = [("tx_pmtree_pi1[db]", db)] + [("tx_pmtree_pi1[qfield][]", str(f)) for f in (0, 1, 2, 3)] + \
           [("tx_pmtree_pi1[qtext][]", name)] + [("tx_pmtree_pi1[qtext][]", "")] * 3 + \
           [("tx_pmtree_pi1[submit]", ""), ("tx_pmtree_pi1[taxname]", "silva"),
            ("tx_pmtree_pi1[action]", "stats"), ("tx_pmtree_pi1[type]", "search")]
    def go():
        r = SILVA.post("https://legatum.arb-silva.de/WS/", data=form, timeout=90,
                       headers={"X-Requested-With": "XMLHttpRequest"})
        r.raise_for_status()
        m = re.search(r"Accessions:\s*([\d,]+)", r.text)
        if not m:
            raise ValueError("unexpected SILVA response")
        return int(m.group(1).replace(",", ""))
    n = retry(go); time.sleep(0.5); return n

# ---------- main ----------
if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--email", required=True, help="your email (NCBI requirement)")
    ap.add_argument("--api-key", default=None, help="NCBI API key (optional, faster)")
    a = ap.parse_args()
    Entrez.email = a.email
    if a.api_key: Entrez.api_key = a.api_key
    PAUSE = 0.12 if a.api_key else 0.4

    cache_f = "nmbl_v22_requery_cache.json"
    cache = json.load(open(cache_f, encoding="utf-8")) if os.path.exists(cache_f) else {}
    for i, (sp, m) in enumerate(TAXA, 1):
        if sp in cache:
            continue
        try:
            names, wstat = worms_names(sp)
            n = ncbi(names, m); b = bold(names, m)
            cache[sp] = {"marker": m, "names_queried": names, "worms": wstat, "ncbi": n, "bold": b}
            json.dump(cache, open(cache_f, "w", encoding="utf-8"), ensure_ascii=False)
            log(f"[{i:3}/{len(TAXA)}] {sp:<30} {m:<4} {wstat:<35} NCBI {n['global']}/{n['wa']}/{n['ng']}  BOLD {b['global']}/{b['wa']}/{b['ng']}")
        except Exception as e:
            log(f"[{i:3}/{len(TAXA)}] {sp}: FAILED {e} (re-run the script to retry)")

    # ---- Part 2: nematode genera ----
    for i, g in enumerate(NEMATODE_GENERA, 1):
        key = "NEMATODE:" + g
        if key in cache:
            continue
        try:
            names, wstat = worms_names(g)
            n18 = ncbi(names, "18S"); n28 = ncbi(names, "28S")
            ssu = sum(silva_count(n, "ssu-144") for n in names)
            lsu = sum(silva_count(n, "lsu-138.2") for n in names)
            cache[key] = {"genus": g, "names_queried": names, "worms": wstat, "ncbi_18s": n18, "ncbi_28s": n28,
                          "silva_ssu_r144": ssu, "silva_lsu_r138_2": lsu}
            json.dump(cache, open(cache_f, "w", encoding="utf-8"), ensure_ascii=False)
            log(f"[N{i:2}/{len(NEMATODE_GENERA)}] {g:<20} {wstat:<30} SILVA SSU {ssu} LSU {lsu}  "
                f"NCBI 18S {n18['global']}/{n18['wa']}/{n18['ng']}  28S {n28['global']}/{n28['wa']}/{n28['ng']}")
        except Exception as e:
            log(f"[N{i:2}/{len(NEMATODE_GENERA)}] {g}: FAILED {e} (re-run the script to retry)")

    with open("nmbl_v22_nematodes_results.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["genus","worms_status","names_queried","silva_ssu_r144","silva_lsu_r138_2","ncbi_18s_global","ncbi_18s_wa",
                    "ncbi_18s_nigeria","ncbi_28s_global","ncbi_28s_wa","ncbi_28s_nigeria"])
        for g in NEMATODE_GENERA:
            r = cache.get("NEMATODE:" + g)
            if not r:
                w.writerow([g, "NOT QUERIED"]); continue
            a, b = r["ncbi_18s"], r["ncbi_28s"]
            w.writerow([g, r["worms"], "; ".join(r["names_queried"]), r["silva_ssu_r144"], r["silva_lsu_r138_2"],
                        a["global"], a["wa"], a["ng"], b["global"], b["wa"], b["ng"]])

    # ---- Part 3a: total NCBI records, any gene ----
    for i, (sp, m) in enumerate(TAXA, 1):
        key = "ALLREC:" + sp
        if key in cache or sp not in cache:
            continue
        try:
            names = cache[sp]["names_queried"]
            org = "(" + " OR ".join(f'"{n}"[Organism]' for n in names) + ")"
            total, _ = esearch_count(f"{org} NOT srcdb_refseq[Properties]")
            cache[key] = {"taxon": sp, "ncbi_all_records": total}
            json.dump(cache, open(cache_f, "w", encoding="utf-8"), ensure_ascii=False)
            log(f"[A{i:3}/{len(TAXA)}] {sp:<30} all NCBI records (any gene): {total}")
        except Exception as e:
            log(f"[A{i:3}/{len(TAXA)}] {sp}: FAILED {e} (re-run the script to retry)")

    # ---- Part 3b: marine mammals, genus-level West African records ----
    for genus in ["Sousa", "Trichechus"]:
        key = "MAMMALWA:" + genus
        if key in cache:
            continue
        try:
            total, ids = esearch_count(f'"{genus}"[Organism] NOT srcdb_refseq[Properties] AND {NAMEQ}', retmax=10000)
            rows = []
            for i in range(0, len(ids), 200):
                def go():
                    h = Entrez.esummary(db="nucleotide", id=",".join(ids[i:i+200]), retmode="json")
                    data = json.loads(h.read()); h.close(); return data
                data = retry(go); time.sleep(PAUSE)
                res = data.get("result", {})
                for uid in res.get("uids", []):
                    d = res[uid]
                    st = (d.get("subtype") or "").split("|"); sn = (d.get("subname") or "").split("|")
                    ctry = sn[st.index("country")].split(":")[0].strip() if "country" in st else ""
                    if WA_RE.match(ctry):
                        rows.append({"accession": d.get("accessionversion"), "organism": d.get("organism"),
                                     "country": sn[st.index("country")], "length": d.get("slen"), "title": d.get("title")})
            cache[key] = {"genus": genus, "candidates": total, "wa_records": rows}
            json.dump(cache, open(cache_f, "w", encoding="utf-8"), ensure_ascii=False)
            log(f"[M] {genus}: {len(rows)} West African records in NCBI (any species name, any gene)")
            for r in rows:
                log(f"      {r['accession']}  {r['organism']}  {r['country']}  {r['length']} bp  {r['title'][:70]}")
        except Exception as e:
            log(f"[M] {genus}: FAILED {e} (re-run the script to retry)")

    with open("nmbl_v22_all_records.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f); w.writerow(["taxon", "ncbi_all_records_any_gene"])
        for sp, _ in TAXA:
            r = cache.get("ALLREC:" + sp); w.writerow([sp, r["ncbi_all_records"] if r else "NOT QUERIED"])
    with open("nmbl_v22_mammal_wa_check.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f); w.writerow(["genus", "accession", "organism", "country", "length_bp", "title"])
        for genus in ["Sousa", "Trichechus"]:
            for r in (cache.get("MAMMALWA:" + genus) or {}).get("wa_records", []):
                w.writerow([genus, r["accession"], r["organism"], r["country"], r["length"], r["title"]])

    with open("nmbl_v22_requery_results.json", "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=1)
    with open("nmbl_v22_requery_results.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["taxon","marker","worms_status","names_queried","ncbi_global","ncbi_wa","ncbi_nigeria","ncbi_wa_countries",
                    "bold_global","bold_wa","bold_nigeria","bold_all_records"])
        for sp, m in TAXA:
            r = cache.get(sp)
            if not r:
                w.writerow([sp, m, "NOT QUERIED"]); continue
            n, b = r["ncbi"], r["bold"]
            w.writerow([sp, m, r["worms"], "; ".join(r["names_queried"]), n["global"], n["wa"], n["ng"],
                        "; ".join(f"{k} {v}" for k, v in n["wa_countries"].items()), b["global"], b["wa"], b["ng"], b["all_records"]])
    missing = [sp for sp, _ in TAXA if sp not in cache] + [g for g in NEMATODE_GENERA if "NEMATODE:" + g not in cache]
    done = len(TAXA) + len(NEMATODE_GENERA) - len(missing)
    log(f"Done. {done}/{len(TAXA) + len(NEMATODE_GENERA)} taxa (107 species/higher taxa + 25 nematode genera). "
        + (f"Missing (re-run): {missing}" if missing else "All taxa complete."))
    log("Send nmbl_v22_requery_results.json back to Claude to apply to the site.")
