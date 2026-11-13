// nmbl_v22_rerun_browser.js — query code used for the v22 re-run (13 Nov 2026)
//
// Run in a browser console. Each block must be pasted on the matching origin
// (NCBI block on https://eutils.ncbi.nlm.nih.gov, BOLD block on
// https://portal.boldsystems.org) so requests are same-origin.
// Define window.TAXA first: [[name, marker], ...] for the 107 taxa in data.js.
// Raw outputs are in Data/v22/.
//
// METHOD CHANGES vs v21
// 1. NCBI marker clause now includes mitochondrial genomes (COI, 12S) and
//    chloroplast/plastid genomes (rbcL), plus common COI/rbcL title synonyms.
//    RefSeq copies excluded (NOT srcdb_refseq[Properties]).
// 2. NCBI has no [Country] search field: earlier "X"[Country] terms were
//    silently translated to [All Fields]. v22 uses a country-name text search
//    only to shortlist candidates, then counts a record as West African only
//    if its GenBank `country` qualifier (from esummary) names a WA state.
// 3. BOLD v5 /api/summary gives counts by country/ocean and marker_code.
//    WA counts are queried country by country (combined multi-geo queries
//    time out on large taxa and were found to return nothing).
// Thresholds (COI>=5, 12S>=3, 18S>=1, 28S>=1, rbcL>=3) unchanged from v21.

const WA_RE = /^(Mauritania|Senegal|Gambia|Guinea-Bissau|Guinea|Sierra Leone|Liberia|Cote d'Ivoire|Côte d'Ivoire|Ivory Coast|Ghana|Togo|Benin|Nigeria|Cameroon|Cabo Verde|Cape Verde)$/i;
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ─── NCBI (run on eutils.ncbi.nlm.nih.gov) ────────────────────────────────
const E = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
const MITO = '((mitochondrion[Title] OR mitochondrial[Title]) AND genome[Title])';
const MARKER = {
  COI: `(COI[Title] OR COX1[Title] OR CO1[Title] OR "cytochrome c oxidase subunit I"[Title] OR "cytochrome c oxidase subunit 1"[Title] OR "cytochrome oxidase subunit I"[Title] OR "cytochrome oxidase subunit 1"[Title] OR ${MITO})`,
  '12S': `(12S[Title] OR ${MITO})`,
  '18S': `(18S[Title] OR "small subunit ribosomal RNA"[Title])`,
  '28S': `(28S[Title] OR "large subunit ribosomal RNA"[Title])`,
  rbcL: `(rbcL[Title] OR "ribulose-1,5-bisphosphate carboxylase/oxygenase large subunit"[Title] OR ((chloroplast[Title] OR plastid[Title]) AND genome[Title]))`,
};
const NAMES = ["Nigeria","Ghana","Cameroon","Benin","Togo","Senegal","Guinea","Ivoire","Ivory","Liberia","Sierra Leone","Gambia","Mauritania","Cabo Verde","Cape Verde","Bissau","Gulf of Guinea"];
const NAMEQ = '(' + NAMES.map(n => `"${n}"[All Fields]`).join(' OR ') + ')';

async function esearch(term, retmax = 0) {
  const r = await fetch(E + 'esearch.fcgi?db=nucleotide&retmode=json&retmax=' + retmax + '&term=' + encodeURIComponent(term)).then(r => r.json());
  await sleep(380); return r.esearchresult;
}
async function countries(ids) {          // GenBank country qualifier per record
  const out = [];
  for (let i = 0; i < ids.length; i += 300) {
    const body = new URLSearchParams({ db: 'nucleotide', retmode: 'json', id: ids.slice(i, i + 300).join(',') });
    const r = await fetch(E + 'esummary.fcgi', { method: 'POST', body }).then(r => r.json());
    for (const id of r.result.uids) {
      const d = r.result[id], st = (d.subtype || '').split('|'), sn = (d.subname || '').split('|');
      const ci = st.indexOf('country');
      if (ci >= 0) out.push({ acc: d.accessionversion, country: sn[ci].split(':')[0].trim() });
    }
    await sleep(380);
  }
  return out;
}
async function ncbiTaxon(name, marker) {
  const org = `"${name}"[Organism]`, base = `${org} AND ${MARKER[marker]} NOT srcdb_refseq[Properties]`;
  const global = +(await esearch(base)).count;
  const cand = await esearch(`${base} AND ${NAMEQ}`, 10000);
  const recs = cand.idlist.length ? await countries(cand.idlist) : [];
  const wa = recs.filter(r => WA_RE.test(r.country));
  return { global, wa: wa.length, nigeria: wa.filter(r => /^Nigeria$/i.test(r.country)).length, wa_accessions: wa.map(r => r.acc) };
}

// ─── BOLD v5 (run on portal.boldsystems.org) ──────────────────────────────
const BOLD_MARKER = { COI: /^COI-(5P|3P)$/i, '12S': /^12S/i, '18S': /^18S/i, rbcL: /^rbcL/i };
async function bj(u) { for (let a = 0; a < 5; a++) { try { const r = await fetch(u); if (r.ok) { const x = await r.json(); await sleep(300); return x; } } catch (e) {} await sleep(3000); } return null; }
const sumMarker = (mc, m) => Object.entries(mc || {}).filter(([k]) => BOLD_MARKER[m].test(k)).reduce((a, [, v]) => a + v, 0);
async function boldTaxon(name, marker) {
  const pre = await bj('/api/query/preprocessor?query=' + encodeURIComponent('tax:' + name));
  const tax = pre?.successful_terms?.[0]?.matched;
  if (!tax) return null;
  const g = await bj('/api/summary?query=' + encodeURIComponent(tax) + '&fields=country/ocean,marker_code&reduce_operation=count');
  const waCountries = Object.keys(g['country/ocean'] || {}).filter(c => WA_RE.test(c));
  let wa = 0, nigeria = 0;
  for (const c of waCountries) {
    const r = await bj('/api/summary?query=' + encodeURIComponent(tax + ';geo:country/ocean:' + c) + '&fields=marker_code&reduce_operation=count');
    const n = sumMarker(r?.marker_code, marker); wa += n; if (c === 'Nigeria') nigeria = n;
  }
  return { global: sumMarker(g.marker_code, marker), wa, nigeria };
}
