#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — queue guard for the Tue/Fri SEO run.

   WHY THIS EXISTS:
   `seo/schedule.md` is Sam's plan and it sets the pace — 6 to 8
   articles per run, 74 across ten runs. At that rate the content
   queue empties fast, and a run that starts with an empty queue ends
   up brainstorming topics mid-run, which is how thin posts get
   written. This checks there is enough researched backlog to cover
   the next run BEFORE any writing starts, and that nothing in the
   queue is claiming to be published when it is not.

   It does NOT police how many posts a run ships. schedule.md owns
   that number.

   RUN:  node seo/check-pace.js     (run it first, before writing)
   =========================================================== */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const queue = JSON.parse(fs.readFileSync(path.join(__dirname, 'content-queue.json'), 'utf8'));
const schedule = fs.readFileSync(path.join(__dirname, 'schedule.md'), 'utf8');

const errs = [];
const warns = [];

// --- what does the next run need? ---------------------------
// Rows look like:  | 4 | Fri 2 Oct | ships... | 8 |
const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const now = new Date();
const runs = [];
for (const m of schedule.matchAll(/^\|\s*(\d+)\s*\|\s*\w{3}\s+(\d{1,2})\s+(\w{3})\s*\|(.*)\|\s*(\d+)\s*\|\s*$/gm)) {
  const [, n, day, mon, ships, articles] = m;
  if (!(mon in MONTHS)) continue;
  // The plan spans one turn of the year; a month behind us is next year's.
  let year = now.getFullYear();
  const d = new Date(year, MONTHS[mon], +day);
  if (d < new Date(now.getFullYear(), now.getMonth() - 2, 1)) d.setFullYear(++year);
  runs.push({ n: +n, date: d, ships: ships.trim(), articles: +articles });
}
const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const next = runs.find(r => r.date >= startOfToday);
const need = next ? next.articles : 6;

// --- queue integrity ----------------------------------------
const slugs = new Set();
for (const q of queue.queue) {
  if (slugs.has(q.slug)) errs.push(`duplicate queue slug: ${q.slug}`);
  slugs.add(q.slug);
  if (q.status !== 'done') continue;
  const f = path.join(ROOT, 'content', 'blog-new', `${q.slug}.js`);
  if (!fs.existsSync(f)) errs.push(`queue says ${q.slug} is done, but content/blog-new/${q.slug}.js does not exist`);
  if (!q.published) errs.push(`${q.slug} is done with no published date`);
}

// --- backlog depth ------------------------------------------
const todo = queue.queue.filter(q => q.status === 'todo');
if (todo.length === 0) {
  errs.push('queue is empty — backfill it with `node scripts/topic-gaps.js 90` before writing anything');
} else if (todo.length < need) {
  errs.push(
    `queue holds ${todo.length} topics; run ${next ? next.n : '?'} needs ${need}.\n` +
    `    This is not a blocker for Sam — backfilling is the first job of the run:\n` +
    `      node scripts/topic-gaps.js 90   (article-shaped demand with no post)\n` +
    `    Add the topics to content-queue.json, re-run this, then start writing.\n` +
    `    Never backfill from a brainstorm.`
  );
} else if (todo.length < need * 2) {
  warns.push(`queue holds ${todo.length} topics — enough for this run, not the next. Backfill while you are in here.`);
}

const done = queue.queue.filter(q => q.status === 'done').length;
const claimed = queue.queue.filter(q => q.status === 'writing').length;
console.log(`\n▸ queue:    ${queue.queue.length} topics, ${done} done, ${todo.length} todo${claimed ? `, ${claimed} claimed by a run in flight` : ''}`);
if (next) console.log(`▸ next run: #${next.n} on ${next.date.toDateString()} — ${next.articles} articles`);
else console.log('▸ next run: no future row in seo/schedule.md — the plan has run out, write the next block');
if (todo.length) console.log(`▸ first up: ${todo[0].slug}  (${todo[0].cluster})`);
warns.forEach(w => console.log(`⚠ ${w}`));
if (errs.length) {
  console.log('');
  errs.forEach(e => console.log(`✗ ${e}`));
  console.log(`\n✗ ${errs.length} problem(s) — fix before writing.\n`);
  process.exit(1);
}
console.log('\n✓ Queue is deep enough for this run.\n');
