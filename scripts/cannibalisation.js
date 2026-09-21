#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — keyword cannibalisation detector.

   WHY THIS EXISTS:
   This is the one failure mode that gets WORSE the faster we
   publish, which makes it the thing to watch while scaling. When
   several of our own pages target the same intent, Google has to
   pick one, it splits the link equity and the relevance signals
   between them, and it often picks the wrong one. The site already
   shows the pattern: four trailer posts exist and Google answers
   most step-deck queries with drop-deck-vs-flatbed, from position
   12 to 64.

   Writing another post into a cannibalised cluster does not win the
   cluster. It adds a fifth competitor. The fix is to merge and
   redirect, or to differentiate the intents hard.

   RUN:  node scripts/cannibalisation.js [days] [--min N] [--json]
   =========================================================== */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const DAYS = parseInt(args.find(a => /^\d+$/.test(a)) || '90', 10);
const MIN_IMPR = parseInt((args.includes('--min') ? args[args.indexOf('--min') + 1] : '3'), 10);
const JSON_OUT = args.includes('--json');
const SITE = process.env.SITE || 'sc-domain:badasslogistics.com';
const KEY_PATH = process.env.GSC_KEY || path.join(ROOT, 'gsc-key.json');

if (!fs.existsSync(KEY_PATH)) { console.error(`✖ No Search Console key at ${KEY_PATH}`); process.exit(2); }
const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
const b64url = (b) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function getToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({ iss: key.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const si = `${header}.${claim}`;
  const sig = crypto.createSign('RSA-SHA256').update(si).sign(key.private_key);
  const res = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${si}.${b64url(sig)}` }) });
  const j = await res.json();
  if (!j.access_token) { console.error('token failed', j); process.exit(2); }
  return j.access_token;
}
async function query(token, body) {
  const res = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const j = await res.json();
  if (j.error) { console.error(`API error ${j.error.code}: ${j.error.message}`); process.exit(2); }
  return j.rows || [];
}
const dstr = (d) => d.toISOString().slice(0, 10);
const short = (u) => u.replace(/^https:\/\/badasslogistics\.com/, '').replace(/\/$/, '') || '/';

(async () => {
  const token = await getToken();
  const end = new Date(Date.now() - 2 * 864e5);
  const start = new Date(end.getTime() - DAYS * 864e5);
  const rows = await query(token, { startDate: dstr(start), endDate: dstr(end), dimensions: ['query', 'page'], rowLimit: 25000 });

  // Brand queries legitimately return several of our pages — the homepage
  // beside /about and /contact is Google building a sitelink cluster, not
  // two pages fighting. Counting those swamps the real signal.
  const brand = /badass|bad ass|badas|bad-ass|ass logistic|badlands|bass logistic|bad logistic/i;

  // query -> the pages Google has served for it
  const byQuery = new Map();
  for (const r of rows) {
    const [q, p] = r.keys;
    if (r.impressions < 1 || brand.test(q)) continue;
    if (!byQuery.has(q)) byQuery.set(q, []);
    byQuery.get(q).push({ page: short(p), impressions: r.impressions, clicks: r.clicks, position: r.position });
  }

  // A query is cannibalised when two or more of our URLs have shown for it.
  const split = [];
  for (const [q, pages] of byQuery) {
    const tot = pages.reduce((a, p) => a + p.impressions, 0);
    if (pages.length < 2 || tot < MIN_IMPR) continue;
    pages.sort((a, b) => b.impressions - a.impressions);
    split.push({ query: q, total: Math.round(tot), pages, best: Math.min(...pages.map(p => p.position)) });
  }
  split.sort((a, b) => b.total - a.total);

  // How two competing URLs relate. A pillar showing beside its own city
  // page is how a matrix is supposed to work and is not worth a rewrite.
  // Two DIFFERENT services fighting over the same city is a real problem,
  // and so is one topic spread over several articles.
  const svcOf = (u) => (u.match(/^\/services\/([a-z0-9-]+)/) || [])[1] || null;
  const isChild = (u) => /^\/services\/[a-z0-9-]+\/.+/.test(u);
  function classify(a, b) {
    const [sa, sb] = [svcOf(a), svcOf(b)];
    if (/^\/blog\//.test(a) && /^\/blog\//.test(b)) return 'ARTICLES';
    if (sa && sb && sa !== sb) return 'CROSS-SERVICE';
    if (sa && sa === sb) return isChild(a) && isChild(b) ? 'SIBLING CITIES' : 'PILLAR/CHILD';
    return 'OTHER';
  }
  // Credit a pair only with the impressions of the two pages in it, not
  // with the query's whole total — otherwise a query answered by six URLs
  // inflates all fifteen of its pairs.
  const pairCount = new Map();
  for (const s of split) {
    for (let i = 0; i < s.pages.length; i++) {
      for (let j = i + 1; j < s.pages.length; j++) {
        const A = s.pages[i], B = s.pages[j];
        const k = [A.page, B.page].sort().join('  ||  ');
        const cur = pairCount.get(k) || { queries: 0, impressions: 0, kind: classify(A.page, B.page) };
        cur.queries++;
        cur.impressions += A.impressions + B.impressions;
        pairCount.set(k, cur);
      }
    }
  }
  const pairs = [...pairCount].map(([k, v]) => ({ pair: k, ...v })).sort((a, b) => b.impressions - a.impressions);

  if (JSON_OUT) { console.log(JSON.stringify({ queries: split.slice(0, 60), pairs: pairs.slice(0, 40) }, null, 2)); return; }

  console.log(`\n=== CANNIBALISATION — ${dstr(start)} → ${dstr(end)} (${DAYS}d) ===\n`);
  console.log(`${split.length} queries where two or more of our own URLs competed.\n`);

  // PILLAR/CHILD is how a matrix is meant to behave, so it is reported
  // separately rather than mixed into the list of things to fix.
  const real = pairs.filter(p => p.kind !== 'PILLAR/CHILD');
  const expected = pairs.filter(p => p.kind === 'PILLAR/CHILD');

  console.log(`\n████ WORTH FIXING — ranked by the demand they split\n`);
  console.log(`${'queries'.padStart(7)} ${'impr'.padStart(6)}  kind            the two pages fighting`);
  console.log('─'.repeat(104));
  for (const p of real.slice(0, 18)) {
    const [a, b] = p.pair.split('  ||  ');
    console.log(`${String(p.queries).padStart(7)} ${String(Math.round(p.impressions)).padStart(6)}  ${p.kind.padEnd(14)}  ${a}`);
    console.log(`${''.padStart(31)}  ${b}\n`);
  }
  console.log(`(${expected.length} more pairs are a pillar showing beside its own city page — that is the matrix working, not a fault.)\n`);

  console.log(`\n████ WORST SPLIT QUERIES\n`);
  for (const s of split.slice(0, 15)) {
    console.log(`"${s.query}"  — ${s.total} impr across ${s.pages.length} pages`);
    for (const p of s.pages.slice(0, 4)) {
      console.log(`     ${String(Math.round(p.impressions)).padStart(5)} impr  pos ${p.position.toFixed(1).padStart(5)}  ${p.page}`);
    }
    console.log('');
  }

  const totalSplit = split.reduce((a, s) => a + s.total, 0);
  console.log(`${totalSplit} impressions are being split between our own pages.`);
  console.log(`Merging a cluster and redirecting the losers usually beats writing into it.\n`);
})();
