#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — validate ads/campaigns.json before it is
   typed into the Google Ads UI.

   Google silently truncates nothing: it refuses to save a headline
   over 30 characters or a description over 90, and finding that out
   one field at a time in the browser is how an hour disappears.
   This checks the whole blueprint in a second.

   RUN:  node ads/check-ads.js          # offline checks only
         node ads/check-ads.js --live   # also HEAD every final URL
   =========================================================== */
const fs = require('fs');
const path = require('path');

const LIMITS = { headline: 30, description: 90, sitelinkText: 25, sitelinkDesc: 35, callout: 25, snippet: 25 };
const plan = JSON.parse(fs.readFileSync(path.join(__dirname, 'campaigns.json'), 'utf8'));
const errs = [];
const warns = [];

// --- budget -------------------------------------------------
const daily = plan.campaigns.reduce((s, c) => s + c.dailyBudget, 0);
// Weekday-only schedule: 22 billable days a month, not 30.4.
const BILLABLE_DAYS = 22;
const monthly = daily * BILLABLE_DAYS;
if (monthly > plan.monthlyBudget) {
  errs.push(`budget: $${daily.toFixed(2)}/day x ${BILLABLE_DAYS} weekdays = $${monthly.toFixed(2)}/mo, over the $${plan.monthlyBudget} cap`);
}
if (monthly < plan.monthlyBudget * 0.9) {
  warns.push(`budget: only $${monthly.toFixed(2)}/mo of the $${plan.monthlyBudget} cap is allocated`);
}

// --- ad copy ------------------------------------------------
let adGroups = 0, keywords = 0;
for (const c of plan.campaigns) {
  for (const g of c.adGroups) {
    adGroups++;
    keywords += g.keywords.length;
    const where = `${c.name} / ${g.name}`;
    if (g.headlines.length < 12) warns.push(`${where}: only ${g.headlines.length} headlines (15 is what scores Excellent)`);
    if (g.descriptions.length < 4) warns.push(`${where}: only ${g.descriptions.length} descriptions (4 max, use them)`);
    if (g.keywords.length < 5) warns.push(`${where}: only ${g.keywords.length} keywords`);
    for (const h of g.headlines) {
      if (h.length > LIMITS.headline) errs.push(`${where}: headline ${h.length}/30 — "${h}"`);
    }
    for (const d of g.descriptions) {
      if (d.length > LIMITS.description) errs.push(`${where}: description ${d.length}/90 — "${d}"`);
    }
    const dupes = g.headlines.filter((h, i) => g.headlines.indexOf(h) !== i);
    if (dupes.length) errs.push(`${where}: duplicate headlines — ${dupes.join(', ')}`);
    if (!/^https:\/\/badasslogistics\.com\//.test(g.finalUrl)) errs.push(`${where}: bad final URL ${g.finalUrl}`);
    // Manual CPC means every ad group carries its own bid, and that bid has
    // to clear the top-of-page entry price or the ad buys the page bottom.
    if (typeof g.maxCpc !== 'number') errs.push(`${where}: no maxCpc — Manual CPC needs a bid per ad group`);
    else if (g.maxCpc < 2) warns.push(`${where}: bid $${g.maxCpc} is below the cheapest top-of-page price in the research`);
  }
}

// --- assets -------------------------------------------------
for (const s of plan.assets.sitelinks) {
  const [text, href, d1, d2] = s;
  if (text.length > LIMITS.sitelinkText) errs.push(`sitelink text ${text.length}/25 — "${text}"`);
  for (const d of [d1, d2]) {
    if (d && d.length > LIMITS.sitelinkDesc) errs.push(`sitelink desc ${d.length}/35 — "${d}"`);
  }
  if (!href.startsWith('/')) errs.push(`sitelink href must be root-relative — ${href}`);
}
for (const c of plan.assets.callouts) {
  if (c.length > LIMITS.callout) errs.push(`callout ${c.length}/25 — "${c}"`);
}
for (const v of plan.assets.structuredSnippet.values) {
  if (v.length > LIMITS.snippet) errs.push(`snippet value ${v.length}/25 — "${v}"`);
}

// --- positioning lint ---------------------------------------
// The same banned list the site content runs through. Heavy haul is
// retired, the company is not a motor carrier, and no price ever
// appears in an ad.
const BANNED = [
  [/\$\d/, 'a price'],
  [/\b(MC|DOT)\s*#?\s*\d/i, 'an MC/DOT number'],
  [/\bour (trucks|fleet|trailers|drivers)\b/i, 'claiming to own trucks'],
  [/heavy haul|oversize|lowboy|step deck|conestoga|\brgn\b|double drop|permit/i, 'retired heavy-haul positioning'],
  [/\b(OSHA|NCCCO|ASME)[- ]?(certified|licensed)/i, 'a certification claim'],
];
// Qualifying copy is allowed to say "no owner-operators"; a KEYWORD that
// targets them is the actual mistake, so that one is checked separately.
const BANNED_KEYWORDS = [[/\bowner[- ]operator/i, 'owner-operator targeting']];
for (const c of plan.campaigns) {
  for (const g of c.adGroups) {
    for (const text of [...g.headlines, ...g.descriptions, ...g.keywords]) {
      for (const [re, what] of BANNED) {
        // campaignNegatives legitimately contain these words; ad copy must not.
        if (re.test(text)) errs.push(`${c.name} / ${g.name}: ${what} in "${text}"`);
      }
    }
    for (const kw of g.keywords) {
      for (const [re, what] of BANNED_KEYWORDS) {
        if (re.test(kw)) errs.push(`${c.name} / ${g.name}: ${what} in keyword "${kw}"`);
      }
    }
  }
}

// --- live URL check -----------------------------------------
async function checkLive() {
  const urls = [...new Set(plan.campaigns.flatMap(c => c.adGroups.map(g => g.finalUrl)))];
  const sitelinks = plan.assets.sitelinks.map(s => 'https://badasslogistics.com' + s[1]);
  for (const u of [...urls, ...sitelinks]) {
    try {
      const res = await fetch(u, { redirect: 'follow' });
      if (!res.ok) errs.push(`live: ${u} returned ${res.status}`);
      else process.stdout.write(`   ✓ ${res.status} ${u}\n`);
    } catch (e) {
      errs.push(`live: ${u} — ${e.message}`);
    }
  }
}

(async () => {
  if (process.argv.includes('--live')) {
    console.log('\n▸ final URLs + sitelinks');
    await checkLive();
  }
  console.log(`\n▸ blueprint: ${plan.campaigns.length} campaigns, ${adGroups} ad groups, ${keywords} keywords`);
  console.log(`▸ budget:    $${daily.toFixed(2)}/day = $${monthly.toFixed(2)}/mo of $${plan.monthlyBudget}`);
  for (const c of plan.campaigns) {
    const bids = c.adGroups.map(g => `${g.name} $${g.maxCpc}`).join(', ');
    console.log(`   · ${c.name.padEnd(30)} $${c.dailyBudget.toFixed(2)}/day  ($${(c.dailyBudget * BILLABLE_DAYS).toFixed(0)}/mo)`);
    console.log(`     ${bids}`);
  }
  warns.forEach(w => console.log(`⚠ ${w}`));
  if (errs.length) {
    console.log('');
    errs.forEach(e => console.log(`✗ ${e}`));
    console.log(`\n✗ ${errs.length} problem(s) — fix before touching the Ads UI.\n`);
    process.exit(1);
  }
  console.log('\n✓ Blueprint is valid.\n');
})();
