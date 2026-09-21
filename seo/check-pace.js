#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — pace guard for the semi-weekly SEO run.

   WHY THIS EXISTS:
   routine.md says one post per run. On 2026-09-18 a single run
   shipped four, which burned two thirds of the researched backlog in
   an afternoon and left the queue at its refill threshold. A rule that
   lives only in prose is a rule that gets skipped, so this one fails
   the run instead.

   RUN:  node seo/check-pace.js     (run it before node build.js)
   =========================================================== */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const queue = JSON.parse(fs.readFileSync(path.join(__dirname, 'content-queue.json'), 'utf8'));
const today = new Date().toISOString().slice(0, 10);

const errs = [];
const warns = [];

// 1. One post per run. Two items carrying today's date means the run
//    either double-shipped or a previous run's date was reused.
const shippedToday = queue.queue.filter(q => q.status === 'done' && q.published === today);
if (shippedToday.length > 1) {
  errs.push(
    `${shippedToday.length} posts dated ${today}: ${shippedToday.map(q => q.slug).join(', ')}.\n` +
    `    One post per run — revert the extras to "status": "todo" and ship them on their own runs.`
  );
}

// 2. Every done item has a file on disk, and every file is accounted
//    for. A "done" with no module is a queue entry that lied.
for (const q of queue.queue.filter(q => q.status === 'done')) {
  const f = path.join(ROOT, 'content', 'blog-new', `${q.slug}.js`);
  if (!fs.existsSync(f)) errs.push(`queue says ${q.slug} is done, but content/blog-new/${q.slug}.js does not exist`);
  if (!q.published) errs.push(`${q.slug} is done with no published date`);
}

// 3. Backlog depth. Writing against an empty queue means brainstorming
//    topics mid-run, which is how thin posts get written.
const todo = queue.queue.filter(q => q.status === 'todo');
if (todo.length === 0) {
  errs.push('queue is empty — refill it from Search Console queries before writing anything');
} else if (todo.length < 4) {
  warns.push(`only ${todo.length} topics left in the queue; refill from Search Console queries this run`);
}

console.log(`\n▸ queue: ${queue.queue.length} topics, ${queue.queue.length - todo.length} done, ${todo.length} todo`);
if (todo.length) console.log(`▸ next:  ${todo[0].slug}  (${todo[0].cluster})`);
warns.forEach(w => console.log(`⚠ ${w}`));
if (errs.length) {
  console.log('');
  errs.forEach(e => console.log(`✗ ${e}`));
  console.log(`\n✗ ${errs.length} problem(s) — do not ship this run.\n`);
  process.exit(1);
}
console.log('\n✓ Pace is fine.\n');
