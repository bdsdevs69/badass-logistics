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
  'Campaign', 'Campaign Type', 'Budget', 'Bid Strategy Type', 'Status', 'EU political ads',
  'Ad Group', 'Max CPC', 'Keyword', 'Criterion Type', 'Location', 'Ad Schedule',
  'Ad type', 'Final URL',
  ...Array.from({ length: 15 }, (_, i) => `Headline ${i + 1}`),
  ...Array.from({ length: 4 }, (_, i) => `Description ${i + 1}`),
];

// Re-running the full sheet after a partial apply would duplicate the ads
// that already landed, so the negatives get their own file.
const NEGATIVES_ONLY = process.argv.includes('--negatives');
const rows = [];
const negRows = [];
const setRows = [];
const row = (o, bucket) => (bucket === 'neg' ? negRows : bucket === 'set' ? setRows : rows)
  .push(COLS.map(c => o[c] === undefined ? '' : String(o[c])));

// A keyword's match type is carried in its punctuation, the same way
// the Ads UI reads it: "quoted" is phrase, [bracketed] is exact, bare
// is broad.
// Google rejects 'Campaign Negative Phrase' — the sheet wants plain
// 'Negative Phrase' and infers campaign level from the empty Ad Group cell.
function matchType(kw, negative) {
  const prefix = negative ? 'Negative ' : '';
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
    // Google refuses any new campaign without this declaration, and the
    // column only accepts a bare Yes/No. Nothing here is political
    // advertising anywhere, let alone in the EU.
    'EU political ads': 'No',
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

  // Campaign-level negatives. The uploader has no concept of a shared
  // negative list, so the global terms are repeated on every campaign
  // alongside that campaign's own theme-specific ones. One sheet, every
  // negative — no second pass to forget.
  const globals = Object.entries(plan.sharedNegatives)
    .filter(([k]) => !k.startsWith('_') && k !== 'neverAdd')
    .flatMap(([, v]) => v);
  for (const kw of [...globals, ...(plan.campaignNegatives[c.name] || [])]) {
    const [type, text] = matchType(kw, true);
    row({ Campaign: c.name, Keyword: text, 'Criterion Type': type }, 'neg');
  }

  // Targeting: 20 industrial metros, and weekdays only. Both are campaign
  // level and neither is carried by the structure sheet.
  for (const loc of plan.sharedSettings.locations) {
    row({ Campaign: c.name, Location: loc }, 'set');
  }
  for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']) {
    row({ Campaign: c.name, 'Ad Schedule': `${day} 7:00 AM 7:00 PM` }, 'set');
  }
}

const esc = (v) => /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
const toCsv = (rs) => [COLS, ...rs].map(r => r.map(esc).join(',')).join('\n') + '\n';
fs.writeFileSync(path.join(__dirname, 'upload.csv'), toCsv(rows));
fs.writeFileSync(path.join(__dirname, 'upload-negatives.csv'), toCsv(negRows));
fs.writeFileSync(path.join(__dirname, 'upload-settings.csv'), toCsv(setRows));

// The shared negatives go in one list, pasted into the UI once.
const shared = Object.entries(plan.sharedNegatives)
  .filter(([k]) => !k.startsWith('_') && k !== 'neverAdd')
  .flatMap(([, v]) => v);
fs.writeFileSync(path.join(__dirname, 'shared-negatives.txt'), shared.join('\n') + '\n');

const counts = rows.reduce((a, r) => {
  const i = (c) => COLS.indexOf(c);
  const k = r[i('Ad type')] ? 'ads'
    : r[i('Criterion Type')] ? (r[i('Criterion Type')].startsWith('Campaign Negative') ? 'negatives' : 'keywords')
    : r[i('Ad Group')] ? 'adGroups' : 'campaigns';
  a[k] = (a[k] || 0) + 1; return a;
}, {});
console.log(`✓ ads/upload.csv — ${rows.length} rows (structure)`);
console.log(`✓ ads/upload-negatives.csv — ${negRows.length} campaign negatives`);
console.log(`✓ ads/upload-settings.csv — ${setRows.length} location + ad schedule rows`);
for (const [k, v] of Object.entries(counts)) console.log(`   ${String(v).padStart(4)} ${k}`);
console.log(`✓ ads/shared-negatives.txt — ${shared.length} terms for the shared list`);
