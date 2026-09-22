#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — article-shaped demand finder.

   WHY THIS EXISTS:
   gsc-gaps.js answers "what PAGE should exist" and mostly returns
   city x service queries, which are matrix pages. This answers the
   different question the writing runs need: "what ARTICLE should
   exist" — the question, how-to, cost, comparison and definition
   queries that a service page cannot satisfy and a blog post can.

   The content queue is the throttle on writing throughput. Refilling
   it from a brainstorm is how thin posts get written, so it refills
   from queries Google already shows us for.

   RUN:  node scripts/topic-gaps.js [days] [--limit N] [--json]
   =========================================================== */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const DAYS = parseInt(args.find(a => /^\d+$/.test(a)) || '90', 10);
const LIMIT = parseInt((args.includes('--limit') ? args[args.indexOf('--limit') + 1] : '60'), 10);
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

// US state names and the metro names in the matrix. A query carrying one
// of these is demand for a PAGE, not an article, and belongs to
// gsc-gaps.js. Keeping them out is what stops the writing runs from
// producing geo-flavoured blog posts, which is a doorway pattern.
const GEO = new RegExp('\\b(' + [
  'alabama','alaska','arizona','arkansas','california','colorado','connecticut','delaware','florida','georgia',
  'hawaii','idaho','illinois','indiana','iowa','kansas','kentucky','louisiana','maine','maryland','massachusetts',
  'michigan','minnesota','mississippi','missouri','montana','nebraska','nevada','ohio','oklahoma','oregon',
  'pennsylvania','tennessee','texas','utah','vermont','virginia','washington','wisconsin','wyoming','carolina',
  'hampshire','jersey','mexico','york','dakota','island','houston','chicago','detroit','dallas','atlanta',
  'cleveland','charlotte','indianapolis','columbus','milwaukee','nashville','pittsburgh','phoenix','denver',
  'minneapolis','louisville','memphis','savannah','charleston','jacksonville','tulsa','akron','tampa','omaha',
  'kalispell','ontario','near me',
].join('|') + ')\\b', 'i');

// Article intent. These shapes are answered by prose, not by a service page.
const SHAPES = [
  [/^(how|what|why|when|who|which|does|do|is|are|can|should)\b/i, 'question'],
  [/\b(vs\.?|versus|difference between|compared to|or)\b/i, 'comparison'],
  [/\b(cost|price|pricing|rate|rates|how much|quote|estimate)\b/i, 'cost'],
  [/\b(guide|checklist|process|steps|procedure|requirements|regulations|rules|tips|best practice)\b/i, 'guide'],
  [/\b(types? of|kinds? of|examples? of|list of)\b/i, 'taxonomy'],
];

const STOP = new Set(['the','a','an','to','for','in','of','and','near','me','my','you','is','are','with','how','what','do','does','can','be','on','from','by','that','this','we','they','your','it','vs','or','best','top']);
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// Slug tokens alone miss too much: "what is a step deck truck" scores 2/3
// against step-deck-trailer-dimensions and reads as an uncovered gap, which
// would send a writer to produce a near-duplicate of a post that already
// exists and merely ranks badly. So each post carries the tokens of its
// slug AND its title, and singulars and plurals collapse together.
const stem = (w) => w.replace(/(ies)$/, 'y').replace(/(sses|ches|shes|xes)$/, m => m.slice(0, -2)).replace(/s$/, '');
function tokens(s) {
  return new Set(norm(s).split(' ').filter(w => w.length > 2 && !STOP.has(w)).map(stem));
}
function existingPosts() {
  const out = new Map();
  const add = (slug, extra = '') => {
    const t = tokens(slug.replace(/-/g, ' ') + ' ' + extra);
    out.set(slug, { slug, tokens: t, slugTokens: tokens(slug.replace(/-/g, ' ')) });
  };
  const dir = path.join(ROOT, 'content', 'blog-new');
  if (fs.existsSync(dir)) for (const n of fs.readdirSync(dir)) {
    if (!n.endsWith('.js')) continue;
    const slug = n.replace(/\.js$/, '');
    let title = '';
    try { const m = require(path.join(dir, n)); title = `${m.title || ''} ${m.dek || ''} ${(m.keywords || []).join(' ')}`; } catch {}
    add(slug, title);
  }
  const html = path.join(ROOT, 'blog');
  if (fs.existsSync(html)) for (const n of fs.readdirSync(html)) {
    if (!n.endsWith('.html') || n === 'index.html') continue;
    const slug = n.replace(/\.html$/, '');
    if (out.has(slug)) continue;
    let title = '';
    try {
      const h = fs.readFileSync(path.join(html, n), 'utf8');
      title = ((h.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '') + ' ' +
              ((h.match(/name="description"\s+content="([^"]*)"/) || [])[1] || '');
    } catch {}
    add(slug, title);
  }
  return [...out.values()];
}

(async () => {
  const token = await getToken();
  const end = new Date(Date.now() - 2 * 864e5);
  const start = new Date(end.getTime() - DAYS * 864e5);
  const rows = await query(token, { startDate: dstr(start), endDate: dstr(end), dimensions: ['query'], rowLimit: 25000 });

  const posts = existingPosts();
  const brand = /badass|bad ass|badas|bad-ass|ass logistic/i;

  // Best existing post for a query, by how much of the query it already
  // covers. Returns null when nothing on the site is close.
  const bestMatch = (q) => {
    const words = [...tokens(q)];
    if (!words.length) return { post: null, score: 1 };
    let best = { post: null, score: 0, slugHit: 0 };
    for (const p of posts) {
      const hit = words.filter(w => p.tokens.has(w)).length;
      const score = hit / words.length;
      // Tie-break on the SLUG, not the description. Two posts can both
      // score 0.5 on a two-word query because each matched one word; the
      // one whose URL carries the query's subject is the one Google is
      // already ranking for it.
      const slugHit = words.filter(w => p.slugTokens.has(w)).length;
      if (score > best.score || (score === best.score && slugHit > best.slugHit)) best = { post: p, score, slugHit };
    }
    return best;
  };

  const gaps = [], weak = [];
  for (const r of rows) {
    const q = r.keys[0];
    if (brand.test(q) || GEO.test(q)) continue;
    if (r.impressions < 2) continue;
    const shape = SHAPES.find(([re]) => re.test(q));
    if (!shape) continue;
    const rec = { query: q, shape: shape[1], impressions: Math.round(r.impressions), clicks: r.clicks, position: +r.position.toFixed(1) };
    const m = bestMatch(q);
    const words0 = [...tokens(q)].length;
    // 0.6 of the query's meaningful words already in a post's slug or
    // title means the topic is covered. What is wrong then is the page,
    // not the absence of one.
    //
    // But 0.6 is unreachable for a short query: "how to lift a lathe"
    // reduces to two meaningful words, so it can only ever score 0, 0.5
    // or 1, and a post that matches the subject but not the verb is
    // filed as a GAP. On 2026-09-22 that nearly put a second lathe
    // article in the queue while /blog/how-to-move-a-lathe was sitting at
    // position 12.5 on 599 impressions — the exact cannibalisation the
    // queue exists to avoid. Scale the bar to the query's length.
    const covered = words0 <= 2 ? 0.5 : 0.6;
    if (m.score >= covered) {
      if (r.position > 10) weak.push({ ...rec, post: m.post.slug, cover: +m.score.toFixed(2) });
    } else {
      gaps.push({ ...rec, nearest: m.post ? m.post.slug : '—', cover: +m.score.toFixed(2) });
    }
  }
  gaps.sort((a, b) => b.impressions - a.impressions);
  weak.sort((a, b) => b.impressions - a.impressions);

  if (JSON_OUT) { console.log(JSON.stringify({ gaps: gaps.slice(0, LIMIT), upgrade: weak.slice(0, LIMIT) }, null, 2)); return; }

  console.log(`\n=== ARTICLE-SHAPED DEMAND — ${dstr(start)} → ${dstr(end)} (${DAYS}d) ===`);
  console.log(`Brand and geo-shaped queries excluded — those are pages, not articles.\n`);

  console.log(`\n████ TRACK A — WRITE A NEW POST  (${gaps.length} queries, no page covers them)\n`);
  const byShape = {};
  for (const c of gaps) (byShape[c.shape] ||= []).push(c);
  for (const [shape, list] of Object.entries(byShape).sort((a, b) => b[1].reduce((s, c) => s + c.impressions, 0) - a[1].reduce((s, c) => s + c.impressions, 0))) {
    const impr = list.reduce((a, c) => a + c.impressions, 0);
    console.log(`── ${shape.toUpperCase()}  (${list.length} queries, ${impr} impressions)`);
    console.log(`${'query'.padEnd(56)} impr    pos   nearest post`);
    console.log('─'.repeat(96));
    for (const c of list.slice(0, LIMIT)) {
      console.log(`${c.query.slice(0, 54).padEnd(56)} ${String(c.impressions).padStart(4)}  ${String(c.position).padStart(5)}   ${c.nearest.slice(0, 32)}`);
    }
    console.log('');
  }

  console.log(`\n████ TRACK B — UPGRADE AN EXISTING POST  (${weak.length} queries where the page exists and ranks badly)\n`);
  console.log(`A 70th article cannot fix a post sitting at position 27. These are the cheaper wins.\n`);
  console.log(`${'query'.padEnd(52)} impr    pos   the post that should be winning it`);
  console.log('─'.repeat(110));
  for (const c of weak.slice(0, LIMIT)) {
    console.log(`${c.query.slice(0, 50).padEnd(52)} ${String(c.impressions).padStart(4)}  ${String(c.position).padStart(5)}   ${c.post}`);
  }

  const upImpr = weak.reduce((a, c) => a + c.impressions, 0);
  const gapImpr = gaps.reduce((a, c) => a + c.impressions, 0);
  console.log(`\nTrack A is ${gapImpr} impressions of demand with nothing to land on.`);
  console.log(`Track B is ${upImpr} impressions already landing on a page that is not competitive.`);
  console.log(`Feed Track A into seo/content-queue.json. One topic absorbs several related`);
  console.log(`queries — never write one post per query.\n`);
})();
