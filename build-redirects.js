#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — redirect stubs for retired URLs

   GitHub Pages can't send a server 301, so each retired path gets a
   tiny HTML stub: canonical + instant meta refresh + JS replace, the
   same pattern jekyll-redirect-from ships. Google treats an instant
   meta refresh as a permanent redirect and passes signals.

   NO noindex. It used to carry one, and that was wrong twice over.
   Google's guidance is not to combine noindex with rel=canonical --
   the two instructions contradict each other ("drop this URL" vs
   "fold it into that one") and noindex prevents the consolidation the
   canonical exists to get. It also wasn't working: URL Inspection on
   2026-09-21 reported /services/heavy-haul, /services/multi-axle-transport
   and /blog/step-deck-vs-drop-deck-trailers all "Submitted and indexed"
   after crawls on 2026-09-06..12, while 133 stubs pulled 6,879
   impressions over 90 days.

   The stub inherits its target's <title> and description, so while
   Google still serves the old URL the snippet is the destination's
   rather than a debug string. Stubs used to title themselves
   "Moved: /a -> /b", which is what searchers were being shown.

   Rules live in data/redirects.json. A '*' matches one path segment;
   wildcard rules expand against files already on disk (so they only
   cover URLs that were actually published), and against the target's
   directory so a stub never points at a page that doesn't exist.

   Runs AFTER every generator (nothing may overwrite a stub) and BEFORE
   build-sitemap.js (which skips stubs). Stubs carry <!--REDIRECT--> so
   other scripts can recognise them.
   =========================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const DOMAIN = 'https://badasslogistics.com';
const { rules } = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/redirects.json'), 'utf8'));

const fileFor = (u) => path.join(ROOT, u.replace(/^\//, '') + '.html');
const exists = (u) => {
  const p = path.join(ROOT, u.replace(/^\//, ''));
  return fs.existsSync(p + '.html') || (fs.existsSync(p) && fs.statSync(p).isFile())
    || fs.existsSync(path.join(p, 'index.html'));
};
const isStub = (f) => fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes('<!--REDIRECT-->');

// Pull the destination's own <title> and description so the stub presents
// as the page it redirects to, not as a debug line.
function metaOf(to) {
  const f = fileFor(to);
  let title = '', desc = '';
  if (fs.existsSync(f)) {
    const h = fs.readFileSync(f, 'utf8');
    title = (h.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1].trim();
    desc = (h.match(/name="description"\s+content="([^"]*)"/) || [, ''])[1].trim();
  }
  return { title, desc };
}

function stub(from, to) {
  const abs = DOMAIN + to;
  const { title, desc } = metaOf(to);
  const esc = (x) => String(x).replace(/&(?!(amp|lt|gt|quot|#\d+);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<!--REDIRECT-->
<title>${title ? esc(title) : `Moved: ${from} → ${to}`}</title>
${desc ? `<meta name="description" content="${esc(desc).replace(/"/g, '&quot;')}">\n` : ''}<link rel="canonical" href="${abs}">
<meta http-equiv="refresh" content="0; url=${to}">
<script>location.replace(${JSON.stringify(to)} + location.hash);</script>
</head>
<body>
<p>This page has moved to <a href="${to}">${abs}</a>.</p>
</body>
</html>
`;
}

// expand rules -> concrete [from, to] pairs
const pairs = [];
for (const [from, to] of Object.entries(rules)) {
  if (!from.includes('*')) { pairs.push([from, to]); continue; }
  const dir = path.join(ROOT, path.dirname(from).replace(/^\//, ''));
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter(n => n.endsWith('.html'))) {
    const seg = f.replace(/\.html$/, '');
    pairs.push([from.replace('*', seg), to.replace('*', seg)]);
  }
}

let written = 0, missing = [];
const map = {};
for (const [from, to] of pairs) {
  if (!exists(to) || isStub(fileFor(to))) { missing.push(`${from} -> ${to}`); continue; }
  const f = fileFor(from);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, stub(from, to));
  map[from] = to;
  written++;
}
fs.writeFileSync(path.join(ROOT, 'data/redirect-map.json'), JSON.stringify(map, null, 2) + '\n');

if (missing.length) {
  console.error(`✖ ${missing.length} redirect target(s) do not exist:`);
  missing.slice(0, 20).forEach(m => console.error('   ' + m));
  process.exit(1);
}
console.log(`✓ Wrote ${written} redirect stubs (data/redirect-map.json)`);
