#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — index-absorption governor.

   WHY THIS EXISTS:
   The plan is to publish a lot. The only thing that makes "a lot"
   safe rather than reckless is evidence that Google is absorbing
   what already shipped. On 2026-09-21 the site had 650 sitemap URLs
   and 146 of them (22%) had never earned a single impression, while
   cnc-machine-movers — an equipment x city matrix — sat near 50%
   dead. Publishing 600 more pages into a cluster in that state is
   how a site earns a site-wide quality problem and loses the pages
   that DO rank.

   So: volume is not capped by a number someone guessed. It is capped
   per cluster by whether the last batch got absorbed. A GREEN cluster
   can take more. A RED cluster gets fixed before it gets fed.

   "Absorbed" here means earning impressions, which is a proxy for
   indexed — the Search Console API exposes performance, not the
   Index Coverage report. A page earning impressions is definitely
   indexed; a page earning none is either unindexed or indexed and
   ranking nowhere, and both mean the same thing for this decision.

   RUN:  node scripts/index-health.js [days]        (default 90)
         node scripts/index-health.js 90 --json     machine-readable
         node scripts/index-health.js --gate blog   exit 1 if that
                                                    cluster is RED
   =========================================================== */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const DAYS = parseInt(args.find(a => /^\d+$/.test(a)) || '90', 10);
const JSON_OUT = args.includes('--json');
const GATE = args.includes('--gate') ? args[args.indexOf('--gate') + 1] : null;
const SITE = process.env.SITE || 'sc-domain:badasslogistics.com';
const KEY_PATH = process.env.GSC_KEY || path.join(ROOT, 'gsc-key.json');

// A cluster is only worth judging once it is big enough for the
// percentage to mean something. Below this, one dead page swings it.
const MIN_N = 8;
// Share of a cluster earning nothing, above which we stop feeding it.
const RED = 0.55;
const AMBER = 0.35;

const CLUSTERS = [
  ['blog',           u => /^\/blog\//.test(u)],
  ['dispatch',       u => /^\/services\/(truck-dispatch|dedicated-lanes|project-freight|dispatching)/.test(u)],
  ['service pillars', u => /^\/services\/[a-z0-9-]+$/.test(u)],
  ['rigging x city', u => /^\/services\/rigging\//.test(u)],
  ['machinery x city', u => /^\/services\/machinery-moving\//.test(u)],
  ['plant x city',   u => /^\/services\/plant-relocation\//.test(u)],
  ['cnc x city',     u => /^\/services\/cnc-machine-movers\//.test(u)],
  ['city hubs',      u => /^\/locations\//.test(u)],
  ['state hubs',     u => /^\/(states|service-areas)\//.test(u)],
];

if (!fs.existsSync(KEY_PATH)) {
  console.error(`✖ No Search Console key at ${KEY_PATH}. Reissue: see seo/routine.md`);
  process.exit(2);
}
const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
const b64url = (b) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function getToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
  }));
  const si = `${header}.${claim}`;
  const sig = crypto.createSign('RSA-SHA256').update(si).sign(key.private_key);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${si}.${b64url(sig)}` }),
  });
  const j = await res.json();
  if (!j.access_token) { console.error('token failed', j); process.exit(2); }
  return j.access_token;
}

async function query(token, body) {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const j = await res.json();
  if (j.error) { console.error(`API error ${j.error.code}: ${j.error.message}`); process.exit(2); }
  return j.rows || [];
}

const dstr = (d) => d.toISOString().slice(0, 10);
const pct = (x) => (x * 100).toFixed(0) + '%';

(async () => {
  const token = await getToken();
  const end = new Date(Date.now() - 2 * 864e5);
  const start = new Date(end.getTime() - DAYS * 864e5);
  const rows = await query(token, { startDate: dstr(start), endDate: dstr(end), dimensions: ['page'], rowLimit: 25000 });

  const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const urls = [...sm.matchAll(/<loc>https:\/\/badasslogistics\.com([^<]*)<\/loc>/g)]
    .map(m => (m[1] || '/').replace(/\/$/, '') || '/');
  const perf = new Map(rows.map(r => {
    const u = r.keys[0].replace(/^https:\/\/badasslogistics\.com/, '').replace(/\/$/, '') || '/';
    return [u, r];
  }));

  const out = [];
  const claimed = new Set();
  for (const [name, match] of CLUSTERS) {
    const mine = urls.filter(u => !claimed.has(u) && match(u));
    mine.forEach(u => claimed.add(u));
    if (!mine.length) continue;
    const live = mine.filter(u => perf.has(u));
    const clicks = live.reduce((a, u) => a + perf.get(u).clicks, 0);
    const impr = live.reduce((a, u) => a + perf.get(u).impressions, 0);
    const dead = mine.length - live.length;
    const deadShare = dead / mine.length;
    const verdict = mine.length < MIN_N ? 'NEW'
      : deadShare >= RED ? 'RED'
      : deadShare >= AMBER ? 'AMBER' : 'GREEN';
    out.push({ cluster: name, urls: mine.length, earning: live.length, dead, deadShare, impressions: Math.round(impr), clicks, verdict });
  }
  const other = urls.filter(u => !claimed.has(u));
  if (other.length) {
    const live = other.filter(u => perf.has(u));
    out.push({
      cluster: 'other', urls: other.length, earning: live.length, dead: other.length - live.length,
      deadShare: (other.length - live.length) / other.length,
      impressions: Math.round(live.reduce((a, u) => a + perf.get(u).impressions, 0)),
      clicks: live.reduce((a, u) => a + perf.get(u).clicks, 0),
      verdict: 'INFO',
    });
  }

  if (JSON_OUT) { console.log(JSON.stringify({ days: DAYS, clusters: out }, null, 2)); return; }

  console.log(`\n=== INDEX ABSORPTION — last ${DAYS} days ===\n`);
  console.log(`${'cluster'.padEnd(18)} ${'URLs'.padStart(5)} ${'earning'.padStart(8)} ${'dead'.padStart(6)} ${'dead%'.padStart(6)} ${'impr'.padStart(8)} ${'clicks'.padStart(7)}  verdict`);
  console.log('─'.repeat(80));
  for (const c of out) {
    console.log(`${c.cluster.padEnd(18)} ${String(c.urls).padStart(5)} ${String(c.earning).padStart(8)} ${String(c.dead).padStart(6)} ${pct(c.deadShare).padStart(6)} ${String(c.impressions).padStart(8)} ${String(c.clicks).padStart(7)}  ${c.verdict}`);
  }
  const tot = urls.length, totLive = urls.filter(u => perf.has(u)).length;
  console.log('─'.repeat(80));
  console.log(`${'SITE'.padEnd(18)} ${String(tot).padStart(5)} ${String(totLive).padStart(8)} ${String(tot - totLive).padStart(6)} ${pct((tot - totLive) / tot).padStart(6)}`);

  console.log(`\nWHAT THIS MEANS FOR THE NEXT RUN`);
  const red = out.filter(c => c.verdict === 'RED');
  const amber = out.filter(c => c.verdict === 'AMBER');
  const green = out.filter(c => c.verdict === 'GREEN');
  if (green.length) console.log(`  EXPAND  ${green.map(c => c.cluster).join(', ')} — absorbing what it already has.`);
  if (amber.length) console.log(`  HOLD    ${amber.map(c => c.cluster).join(', ')} — add nothing new; improve what is dead first.`);
  if (red.length) console.log(`  STOP    ${red.map(c => c.cluster).join(', ')} — over ${pct(RED)} dead. Consolidate or deepen before a single new page lands here.`);
  if (!green.length && !amber.length && !red.length) console.log(`  Every cluster is still too new to judge (< ${MIN_N} URLs).`);
  console.log('');

  if (GATE) {
    const c = out.find(x => x.cluster === GATE || x.cluster.startsWith(GATE));
    if (!c) { console.error(`✖ no cluster named "${GATE}"`); process.exit(2); }
    if (c.verdict === 'RED') {
      console.error(`✖ ${c.cluster} is RED (${pct(c.deadShare)} dead) — do not add pages to it this run.\n`);
      process.exit(1);
    }
    console.log(`✓ ${c.cluster} is ${c.verdict} — safe to add to.\n`);
  }
})();
