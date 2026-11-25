#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — push daily ad numbers to the ops portal.

   WHY THIS EXISTS:
   The portal shows spend beside the leads that spend bought. It cannot
   read the ad account itself — the Google Ads API needs a developer
   token and an OAuth grant that nobody has set up — so the Monday
   review, which is already in the account, writes the numbers out.

   The portal upserts on (date, campaign), so re-pushing the same day
   corrects it rather than double-counting. Push the whole last 30 days
   every run and late conversions fix themselves.

   USAGE
     node ads/push-to-portal.js rows.json
     cat rows.json | node ads/push-to-portal.js -

   rows.json is an array; cost is dollars, or give cost_cents instead:
     [{"date":"2026-11-24","campaign":"Crane & Rigging",
       "impressions":430,"clicks":9,"cost":14.20,"conversions":1}]

   ENV
     OPS_PORTAL_URL    default https://ops.badasslogistics.com
     OPS_INGEST_TOKEN  required — same value as INGEST_TOKEN on the portal
   =========================================================== */
const fs = require('fs');

const BASE = (process.env.OPS_PORTAL_URL || 'https://ops.badasslogistics.com').replace(/\/$/, '');
const TOKEN = process.env.OPS_INGEST_TOKEN || '';
const src = process.argv[2];

if (!src) {
  console.error('usage: node ads/push-to-portal.js <rows.json|->');
  process.exit(2);
}
if (!TOKEN) {
  console.error('✖ OPS_INGEST_TOKEN is not set. It is the INGEST_TOKEN value from the portal.');
  process.exit(2);
}

const raw = src === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(src, 'utf8');
let rows;
try { rows = JSON.parse(raw); } catch (e) {
  console.error('✖ input is not valid JSON:', e.message);
  process.exit(2);
}
if (!Array.isArray(rows)) rows = rows.rows || [];

// Fail loudly here rather than letting the portal silently skip a row:
// a dropped day shows up later as a cost-per-lead that is quietly wrong.
const bad = [];
rows.forEach((r, i) => {
  if (!r || typeof r !== 'object') return bad.push(`row ${i}: not an object`);
  if (!/^\d{4}-\d{2}-\d{2}/.test(String(r.date || ''))) bad.push(`row ${i}: date must be YYYY-MM-DD`);
  if (!r.campaign) bad.push(`row ${i}: no campaign`);
  if (r.cost == null && r.cost_cents == null) bad.push(`row ${i}: no cost or cost_cents`);
});
if (bad.length) {
  bad.slice(0, 10).forEach(b => console.error('✖ ' + b));
  process.exit(1);
}
if (!rows.length) { console.error('✖ nothing to push'); process.exit(1); }

(async () => {
  const res = await fetch(`${BASE}/api/ads/daily`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify(rows),
  }).catch(e => { console.error('✖ could not reach the portal:', e.message); process.exit(1); });

  const text = await res.text();
  if (!res.ok) { console.error(`✖ portal returned ${res.status}: ${text}`); process.exit(1); }
  let j = {}; try { j = JSON.parse(text); } catch {}
  const total = rows.reduce((a, r) => a + (r.cost != null ? Number(r.cost) : Number(r.cost_cents) / 100), 0);
  const days = new Set(rows.map(r => String(r.date).slice(0, 10))).size;
  console.log(`✓ pushed ${j.upserted != null ? j.upserted : rows.length} rows — ${days} day(s), $${total.toFixed(2)} total — to ${BASE}`);
})();
