#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — stamp the shared header + footer onto every page

   lib/chrome.js is the only place the nav, footer, and topbar are
   defined. This pass replaces the topbar+header block and the footer
   block on every HTML page, so hand-written pages (index, about,
   contact, locations hub, trailer-selector…) can never drift from the
   generated ones. Idempotent.

   Skips: redirect stubs, and ad landing pages (quote-*.html) which use
   their own stripped-down header on purpose.
   =========================================================== */
const fs = require('fs');
const path = require('path');
const { topbar, header, footer } = require('./lib/chrome');
const ROOT = __dirname;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.claude', 'content-drafts', 'content', 'assets', 'lib', 'scripts', 'data'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const HEAD_RE = /<div class="topbar">[\s\S]*?<\/header>/;
const FOOT_RE = /<footer[\s>][\s\S]*?<\/footer>/;

let changed = 0, skipped = 0;
const odd = [];
for (const f of walk(ROOT)) {
  const rel = path.relative(ROOT, f);
  let h = fs.readFileSync(f, 'utf8');
  if (h.includes('<!--REDIRECT-->') || /^quote-/.test(rel)) { skipped++; continue; }
  const before = h;
  if (HEAD_RE.test(h)) h = h.replace(HEAD_RE, () => `${topbar()}\n${header()}`);
  else odd.push(`${rel} (no topbar/header)`);
  if (FOOT_RE.test(h)) h = h.replace(FOOT_RE, () => footer(rel));
  else odd.push(`${rel} (no footer)`);
  if (h !== before) { fs.writeFileSync(f, h); changed++; }
}
console.log(`✓ Chrome applied: ${changed} pages updated, ${skipped} skipped (stubs + landing pages)`);
if (odd.length) { console.log(`! ${odd.length} page(s) without standard chrome:`); odd.slice(0, 10).forEach(o => console.log('   ' + o)); }
