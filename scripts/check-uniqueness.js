#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — corpus uniqueness gate.

   WHY THIS EXISTS:
   check-content.js proves an article has the right SHAPE — fields,
   lengths, FAQ count, working links. It cannot tell you the article
   says anything new. At one post a week that did not matter. At the
   rate seo/schedule.md now runs, the failure mode is 70 articles that
   are each individually fine and collectively one article written 70
   ways, which is exactly what Google's site-wide quality signals
   punish — and it drags the pages that DO rank down with them.

   This measures how much of a document already exists somewhere else
   in the corpus, using word shingles (overlapping n-word runs).

     containment(A in B) = shared shingles / A's shingles
       → "how much of A is already in B"
     boilerplate(A)      = A's shingles seen anywhere else / A's shingles
       → "how much of A is recycled from the whole corpus"

   Shingles beat naive word counting because prose that reorders the
   same sentences still shares its 6-word runs.

   RUN:
     node scripts/check-uniqueness.js <slug> [slug...]   gate one article
     node scripts/check-uniqueness.js --all              audit the corpus
     node scripts/check-uniqueness.js --all --top 25     show more pairs
   =========================================================== */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'content', 'blog-new');
const SVC_DIR = path.join(ROOT, 'content', 'services');

// Tuned against the 18 posts that existed on 2026-09-21: the worst real
// pair sat at 0.06 containment and the highest boilerplate at 0.11, so
// these thresholds sit far above honest overlap between two articles on
// neighbouring subjects, and well below a rehash.
const PAIR_WARN = Number(process.env.UNIQ_PAIR_WARN || 0.12);
const PAIR_FAIL = Number(process.env.UNIQ_PAIR_FAIL || 0.22);
const BOILER_WARN = Number(process.env.UNIQ_BOILER_WARN || 0.25);
const BOILER_FAIL = Number(process.env.UNIQ_BOILER_FAIL || 0.40);
const N = 6; // shingle size, in words

const strip = (s) => String(s)
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z]+;/gi, ' ')
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

// The prose a reader actually reads. Slugs, image paths and keyword
// lists are not writing and would inflate every score identically.
function proseOf(mod) {
  const parts = [mod.dek, mod.tldr, mod.body, mod.lead, mod.intro, mod.quickAnswer];
  for (const f of mod.faq || []) parts.push(f.q, f.a);
  for (const s of mod.sections || []) parts.push(s.h, s.p, s.body);
  return strip(parts.filter(Boolean).join(' '));
}

function shingles(text) {
  const w = text.split(' ').filter(Boolean);
  const out = new Set();
  for (let i = 0; i + N <= w.length; i++) out.add(w.slice(i, i + N).join(' '));
  return out;
}

function loadDir(dir, kind) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(n => n.endsWith('.js')).map(n => {
    const slug = n.replace(/\.js$/, '');
    const f = path.join(dir, n);
    let mod;
    try { delete require.cache[require.resolve(f)]; mod = require(f); }
    catch (e) { return { slug, kind, error: e.message, sh: new Set(), words: 0 }; }
    const text = proseOf(mod);
    return { slug, kind, sh: shingles(text), words: text.split(' ').filter(Boolean).length };
  });
}

const corpus = [...loadDir(BLOG_DIR, 'blog'), ...loadDir(SVC_DIR, 'service')];
const byslug = new Map(corpus.map(d => [d.slug, d]));

// Every shingle in the corpus and how many documents use it. A shingle in
// 3+ documents is house boilerplate, not one article copying another.
const docFreq = new Map();
for (const d of corpus) for (const s of d.sh) docFreq.set(s, (docFreq.get(s) || 0) + 1);

function containment(a, b) {
  if (!a.sh.size) return 0;
  let shared = 0;
  for (const s of a.sh) if (b.sh.has(s)) shared++;
  return shared / a.sh.size;
}

function boilerplate(a) {
  if (!a.sh.size) return 0;
  let seen = 0;
  for (const s of a.sh) if ((docFreq.get(s) || 0) > 1) seen++;
  return seen / a.sh.size;
}

const pct = (x) => (x * 100).toFixed(1) + '%';

function report(doc) {
  const others = corpus.filter(d => d.slug !== doc.slug && d.sh.size);
  const scored = others.map(o => ({ slug: o.slug, kind: o.kind, c: containment(doc, o) }))
    .sort((x, y) => y.c - x.c);
  const worst = scored[0] || { slug: '—', c: 0 };
  const boiler = boilerplate(doc);
  const errs = [], warns = [];

  if (doc.error) errs.push(`failed to load — ${doc.error}`);
  if (!doc.sh.size) errs.push('no prose found — check the body field');
  if (worst.c >= PAIR_FAIL) errs.push(`${pct(worst.c)} of this article already exists in "${worst.slug}" (limit ${pct(PAIR_FAIL)}) — rewrite the overlapping sections or merge the two`);
  else if (worst.c >= PAIR_WARN) warns.push(`${pct(worst.c)} overlap with "${worst.slug}" — closest neighbour, worth a skim`);
  if (boiler >= BOILER_FAIL) errs.push(`${pct(boiler)} of this article is phrasing reused elsewhere on the site (limit ${pct(BOILER_FAIL)}) — it is assembled, not written`);
  else if (boiler >= BOILER_WARN) warns.push(`${pct(boiler)} recycled phrasing across the corpus`);

  console.log(`${errs.length ? '✖' : '✓'} ${doc.slug}  (${doc.words} words, top overlap ${pct(worst.c)} vs ${worst.slug}, recycled ${pct(boiler)})`);
  scored.slice(0, 3).forEach(s => console.log(`      ${pct(s.c).padStart(6)}  ${s.slug}`));
  errs.forEach(e => console.log(`    ERROR ${e}`));
  warns.forEach(w => console.log(`    warn  ${w}`));
  return errs.length === 0;
}

const args = process.argv.slice(2);

// ---- matrix mode -------------------------------------------------
// The generated service x city pages are the other half of the volume
// question, and they fail differently from articles. They share a
// template on purpose, so raw overlap is meaningless; what matters is
// how much of each page is specific to ITS city. When that number is
// low, Google cannot tell the pages apart, picks one semi-arbitrarily
// and ranks it badly everywhere — which is exactly what
// machinery-moving/omaha-ne is doing across eight other metros.
if (args.includes('--matrix')) {
  const svc = args[args.indexOf('--matrix') + 1];
  const dir = path.join(ROOT, 'services', svc || '');
  if (!svc || !fs.existsSync(dir)) {
    console.error('usage: node scripts/check-uniqueness.js --matrix <service-slug>');
    console.error('available: ' + fs.readdirSync(path.join(ROOT, 'services')).filter(n => fs.statSync(path.join(ROOT, 'services', n)).isDirectory()).join(', '));
    process.exit(1);
  }
  // Body only, with header/footer/script/style removed — chrome is
  // identical everywhere and would drown the signal.
  const clean = (html) => strip(html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<header\b[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, ' '));

  const files = fs.readdirSync(dir).filter(n => /-[a-z]{2}\.html$/.test(n) || /^[a-z-]+\.html$/.test(n));
  const docs = files.map(n => {
    const text = clean(fs.readFileSync(path.join(dir, n), 'utf8'));
    return { slug: n.replace(/\.html$/, ''), sh: shingles(text), words: text.split(' ').filter(Boolean).length };
  }).filter(d => d.sh.size);

  const df = new Map();
  for (const d of docs) for (const s of d.sh) df.set(s, (df.get(s) || 0) + 1);

  // A shingle unique to one page IS that page's city-specific writing.
  const scored = docs.map(d => {
    let own = 0;
    for (const s of d.sh) if (df.get(s) === 1) own++;
    return { ...d, ownShare: own / d.sh.size, own };
  }).sort((a, b) => a.ownShare - b.ownShare);

  const mean = scored.reduce((a, d) => a + d.ownShare, 0) / scored.length;
  console.log(`\n=== MATRIX DIFFERENTIATION — services/${svc} ===\n`);
  console.log(`${docs.length} pages, ${N}-word shingles, chrome stripped.`);
  console.log(`Mean page-specific content: ${pct(mean)}\n`);
  console.log(`LEAST differentiated — these are the pages Google confuses:`);
  console.log(`${'own%'.padStart(7)} ${'words'.padStart(7)}  page`);
  console.log('─'.repeat(60));
  scored.slice(0, 15).forEach(d => console.log(`${pct(d.ownShare).padStart(7)} ${String(d.words).padStart(7)}  ${d.slug}`));
  console.log(`\nMOST differentiated:`);
  scored.slice(-5).reverse().forEach(d => console.log(`${pct(d.ownShare).padStart(7)} ${String(d.words).padStart(7)}  ${d.slug}`));

  // Below a third of a page being its own, the template is the page.
  const FLOOR = Number(process.env.MATRIX_FLOOR || 0.33);
  const under = scored.filter(d => d.ownShare < FLOOR);
  console.log(`\n${under.length ? '✖' : '✓'} ${under.length} of ${docs.length} pages are under the ${pct(FLOOR)} floor.`);
  if (under.length) {
    console.log(`  These need real city-specific substance before this matrix grows,`);
    console.log(`  or the new pages inherit the same problem at a larger scale.`);
  }
  console.log('');
  process.exit(under.length > docs.length * 0.25 ? 1 : 0);
}

if (args.includes('--all')) {
  const top = Number((args[args.indexOf('--top') + 1] || 12));
  console.log(`\n▸ corpus: ${corpus.length} documents (${corpus.filter(d => d.kind === 'blog').length} blog, ${corpus.filter(d => d.kind === 'service').length} service), ${N}-word shingles\n`);
  const pairs = [];
  for (let i = 0; i < corpus.length; i++) {
    for (let j = 0; j < corpus.length; j++) {
      if (i === j) continue;
      const c = containment(corpus[i], corpus[j]);
      if (c > 0) pairs.push({ a: corpus[i].slug, b: corpus[j].slug, c });
    }
  }
  pairs.sort((x, y) => y.c - x.c);
  console.log(`Closest pairs — "X% of A already exists in B":`);
  pairs.slice(0, top).forEach(p => console.log(`  ${pct(p.c).padStart(6)}  ${p.a}  →  ${p.b}`));
  const boil = corpus.filter(d => d.sh.size).map(d => ({ slug: d.slug, b: boilerplate(d), w: d.words }))
    .sort((x, y) => y.b - x.b);
  console.log(`\nMost recycled phrasing:`);
  boil.slice(0, top).forEach(d => console.log(`  ${pct(d.b).padStart(6)}  ${d.slug} (${d.w} words)`));
  const thin = corpus.filter(d => d.kind === 'blog' && d.words && d.words < 900).sort((a, b) => a.words - b.words);
  if (thin.length) {
    console.log(`\nThin posts (< 900 prose words):`);
    thin.forEach(d => console.log(`  ${String(d.words).padStart(6)}  ${d.slug}`));
  }
  const overPair = pairs.filter(p => p.c >= PAIR_FAIL).length;
  const overBoil = boil.filter(d => d.b >= BOILER_FAIL).length;
  console.log(`\n${overPair === 0 && overBoil === 0 ? '✓' : '✖'} ${overPair} pair(s) over ${pct(PAIR_FAIL)}, ${overBoil} document(s) over ${pct(BOILER_FAIL)} recycled\n`);
  process.exit(overPair || overBoil ? 1 : 0);
}

if (!args.length) {
  console.log('usage: node scripts/check-uniqueness.js <slug>... | --all [--top N]');
  process.exit(1);
}
let bad = 0;
console.log('');
for (const slug of args) {
  const doc = byslug.get(slug);
  if (!doc) { console.log(`✖ ${slug}: not found in content/blog-new or content/services`); bad++; continue; }
  if (!report(doc)) bad++;
}
console.log(bad ? `\n✖ ${bad} article(s) too close to what is already published.\n` : '\n✓ Nothing is a rehash.\n');
process.exit(bad ? 1 : 0);
