#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — redirect stubs for retired URLs

   GitHub Pages can't send a server 301, so each retired path gets a
   tiny HTML stub: canonical + instant meta refresh + JS replace, and
   noindex (the same pattern jekyll-redirect-from ships). Google treats
   an instant meta refresh as a permanent redirect and passes signals.

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

function stub(from, to) {
  const abs = DOMAIN + to;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<!--REDIRECT-->
<title>Moved: ${from} → ${to}</title>
<link rel="canonical" href="${abs}">
<meta name="robots" content="noindex">
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
