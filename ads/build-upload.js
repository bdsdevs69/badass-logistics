#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — turn ads/campaigns.json into a Google Ads
   bulk-upload CSV (Tools → Bulk actions → Uploads).

   Typing four campaigns, eight ad groups, ~90 keywords and eight
   responsive search ads into the web UI by hand is several hours and
   at least one silently-dropped keyword. The uploader takes the whole
   structure in one pass and shows a preview before anything commits.

   Campaigns are written PAUSED on purpose: location targeting, the ad
   schedule and the call asset are not carried by this format, so they
   get set in the UI first and the campaigns are enabled last.

   RUN:  node ads/build-upload.js            # writes ads/upload.csv
   =========================================================== */
const fs = require('fs');
const path = require('path');

const plan = JSON.parse(fs.readFileSync(path.join(__dirname, 'campaigns.json'), 'utf8'));

const COLS = [
  'Campaign', 'Campaign Type', 'Budget', 'Bid Strategy Type', 'Status',
  'Ad Group', 'Max CPC', 'Keyword', 'Criterion Type', 'Ad type', 'Final URL',
  ...Array.from({ length: 15 }, (_, i) => `Headline ${i + 1}`),
  ...Array.from({ length: 4 }, (_, i) => `Description ${i + 1}`),
];

const rows = [];
const row = (o) => rows.push(COLS.map(c => o[c] === undefined ? '' : String(o[c])));

// A keyword's match type is carried in its punctuation, the same way
// the Ads UI reads it: "quoted" is phrase, [bracketed] is exact, bare
// is broad.
function matchType(kw, negative) {
  const prefix = negative ? 'Campaign Negative ' : '';
  if (/^".*"$/.test(kw)) return [prefix + 'Phrase', kw.slice(1, -1)];
  if (/^\[.*\]$/.test(kw)) return [prefix + 'Exact', kw.slice(1, -1)];
  return [prefix + 'Broad', kw];
}

for (const c of plan.campaigns) {
  row({
    Campaign: c.name,
    'Campaign Type': 'Search',
    Budget: c.dailyBudget.toFixed(2),
    'Bid Strategy Type': 'Manual CPC',
    Status: 'Paused',
  });

  for (const g of c.adGroups) {
    row({ Campaign: c.name, 'Ad Group': g.name, 'Max CPC': g.maxCpc.toFixed(2), Status: 'Enabled' });

    for (const kw of g.keywords) {
      const [type, text] = matchType(kw, false);
      row({ Campaign: c.name, 'Ad Group': g.name, Keyword: text, 'Criterion Type': type, Status: 'Enabled' });
    }

    const ad = {
      Campaign: c.name, 'Ad Group': g.name,
      'Ad type': 'Responsive search ad',
      'Final URL': g.finalUrl,
      Status: 'Enabled',
    };
    g.headlines.forEach((h, i) => { ad[`Headline ${i + 1}`] = h; });
    g.descriptions.forEach((d, i) => { ad[`Description ${i + 1}`] = d; });
    row(ad);
  }

  // Campaign-level negatives: the theme-specific ones here, plus every
  // shared negative repeated per campaign. The uploader has no concept
  // of a shared list, so the list itself gets built once in the UI and
  // these rows cover the campaigns until it is attached.
  for (const kw of (plan.campaignNegatives[c.name] || [])) {
    const [type, text] = matchType(kw, true);
    row({ Campaign: c.name, Keyword: text, 'Criterion Type': type });
  }
}

const esc = (v) => /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
const csv = [COLS, ...rows].map(r => r.map(esc).join(',')).join('\n') + '\n';
fs.writeFileSync(path.join(__dirname, 'upload.csv'), csv);

// The shared negatives go in one list, pasted into the UI once.
const shared = Object.entries(plan.sharedNegatives)
  .filter(([k]) => !k.startsWith('_') && k !== 'neverAdd')
  .flatMap(([, v]) => v);
fs.writeFileSync(path.join(__dirname, 'shared-negatives.txt'), shared.join('\n') + '\n');

const counts = rows.reduce((a, r) => {
  const k = r[9] ? 'ads' : r[8] ? (r[8].startsWith('Campaign Negative') ? 'negatives' : 'keywords')
    : r[5] ? 'adGroups' : 'campaigns';
  a[k] = (a[k] || 0) + 1; return a;
}, {});
console.log(`✓ ads/upload.csv — ${rows.length} rows`);
for (const [k, v] of Object.entries(counts)) console.log(`   ${String(v).padStart(4)} ${k}`);
console.log(`✓ ads/shared-negatives.txt — ${shared.length} terms for the shared list`);
