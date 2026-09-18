#!/usr/bin/env node
// Validate content/services modules WITHOUT writing any pages.
//   node scripts/check-content.js <slug> [slug...]
// Validates content/services/<slug>.js, or content/blog-new/<slug>.js when the
// slug is a blog post (the semi-weekly SEO routine writes those).
// Checks: loads, required fields, SEO lengths, images exist, positioning lint, word count, links.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const { bySlug } = require('../lib/taxonomy');
const REQUIRED = ['slug','cardBlurb','title','description','serviceType','hero','tag','h1','lead','cta','quickAnswer','intro','faq','ctaBand'];
const BANNED = [
  [/\$\s?\d/, 'price or dollar figure'],
  [/\b(MC|DOT)\s?(#|number|no\.?)\s?\d/i, 'authority number'],
  [/\bour (own )?(trucks|fleet|trailers|drivers)\b/i, 'claims an owned fleet'],
  [/heavy[- ]haul/i, 'mentions heavy haul (retired service line)'],
  [/\b(OSHA|NCCCO|ASME|ISO)[- ]certified\b/i, 'certification claim'],
  [/\bservice area\b/i, '"service area" phrasing'],
  [/\bheadquarter/i, 'HQ disclosure'],
  [/\b(seamless|cutting-edge|one-stop shop|we pride ourselves|world-class|state-of-the-art)\b/i, 'marketing cliche'],
  [/\b(we are|we're|as an?|our) (freight |licensed )?broker(age)?\b(?! and carrier partners)|\bbrokerage\b/i, 'describes Badass as a broker'],
];
const strip = s => String(s).replace(/<[^>]+>/g,' ').replace(/&[a-z]+;/g,' ');
// Blog modules live in content/blog-new/ and use a different field set than
// service pages. Same positioning lint, different shape and different gates
// (the ones seo/routine.md calls non-negotiable: tldr length, FAQ count,
// word count, and links that resolve).
const BLOG_REQUIRED = ['slug','cat','hero','date','title','desc','dek','tldr','keywords','body','faq','related'];
function checkBlog(slug) {
  const f = path.join(ROOT, 'content/blog-new', `${slug}.js`);
  const errs = [], warns = [];
  let c;
  try { delete require.cache[require.resolve(f)]; c = require(f); }
  catch (e) { console.log(`\u2716 ${slug}: failed to load \u2014 ${e.message}`); return false; }
  BLOG_REQUIRED.forEach(k => { if (!c[k]) errs.push(`missing ${k}`); });
  if (c.slug !== slug) errs.push(`slug field "${c.slug}" != filename`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(c.date || '')) errs.push(`date "${c.date}" is not YYYY-MM-DD`);
  const tl = (c.title || '').replace(/&amp;/g,'&').length; if (tl > 68) warns.push(`title ${tl} chars (aim \u2264 65)`);
  const dl = (c.desc || '').length; if (dl < 120 || dl > 165) warns.push(`desc ${dl} chars (aim 140-160)`);
  const tw = String(c.tldr || '').split(/\s+/).filter(Boolean).length;
  if (tw < 40 || tw > 70) warns.push(`tldr ${tw} words (aim 40-70 \u2014 it is the lifted answer)`);
  if (c.hero && !fs.existsSync(path.join(ROOT, 'assets/img', c.hero))) errs.push(`hero missing: assets/img/${c.hero}`);
  const text = JSON.stringify(c);
  BANNED.forEach(([re, why]) => { const m = text.match(re); if (m) errs.push(`${why}: "${m[0]}"`); });
  const words = strip(c.body || '').split(/\s+/).filter(w => /[a-z]/i.test(w)).length;
  if (words < 1200 || words > 2000) warns.push(`body ~${words} words (routine says 1,200-2,000)`);
  const nf = (c.faq || []).length;
  if (nf < 4 || nf > 6) errs.push(`${nf} FAQ entries (routine says 4-6)`);
  (c.faq || []).forEach((x, i) => { if (!x || !x.q || !x.a) errs.push(`faq[${i}] missing q or a`); });
  const blogSlugs = new Set(
    fs.readdirSync(path.join(ROOT, 'blog')).filter(n => n.endsWith('.html')).map(n => n.replace(/\.html$/, ''))
      .concat(fs.readdirSync(path.join(ROOT, 'content/blog-new')).filter(n => n.endsWith('.js')).map(n => n.replace(/\.js$/, '')))
  );
  const hrefs = [...text.matchAll(/href=\\?"([^"\\#?]+)/g)].map(m => m[1])
    .concat((c.related || []).map(r => String(r.u || '').split('#')[0]));
  for (const u of hrefs) {
    if (!u) continue;
    if (/^(https?:|mailto:|tel:)/i.test(u)) continue;
    if (u.startsWith('/')) { errs.push(`absolute link ${u} \u2014 blog links are relative`); continue; }
    if (u.startsWith('../')) { if (!fs.existsSync(path.join(ROOT, u.replace(/^\.\.\//, '')))) errs.push(`link to missing page ${u}`); }
    else if (!blogSlugs.has(u.replace(/\.html$/, ''))) errs.push(`link to missing blog ${u}`);
  }
  console.log(`${errs.length ? '\u2716' : '\u2713'} ${slug} (blog, ~${words} words)`);
  errs.forEach(e => console.log(`    ERROR ${e}`)); warns.forEach(w => console.log(`    warn  ${w}`));
  return !errs.length;
}

const slugs = process.argv.slice(2);
if (!slugs.length) { console.log('usage: node scripts/check-content.js <slug>...'); process.exit(1); }
let bad = 0;
for (const slug of slugs) {
  if (!fs.existsSync(path.join(ROOT, 'content/services', slug + '.js')) && fs.existsSync(path.join(ROOT, 'content/blog-new', slug + '.js'))) { if (!checkBlog(slug)) bad++; continue; }
  const f = path.join(ROOT, 'content/services', `${slug}.js`);
  const errs = [], warns = [];
  let c;
  try { delete require.cache[require.resolve(f)]; c = require(f); } catch (e) { console.log(`✖ ${slug}: failed to load — ${e.message}`); bad++; continue; }
  REQUIRED.forEach(k => { if (!c[k]) errs.push(`missing ${k}`); });
  if (c.slug !== slug) errs.push(`slug field "${c.slug}" != filename`);
  if (!bySlug[slug]) errs.push('slug not in lib/taxonomy.js');
  const tl = c.title.replace(/&amp;/g,'&').length; if (tl > 68) warns.push(`title ${tl} chars (aim ≤ 65)`);
  const dl = (c.description||'').length; if (dl < 120 || dl > 165) warns.push(`description ${dl} chars (aim 140-160)`);
  const imgs = [c.hero, c.band, ...((c.media && c.media.images)||[]).map(i=>i.src)].filter(Boolean);
  imgs.forEach(p => { if (!fs.existsSync(path.join(ROOT, p.replace(/^\//,'')))) errs.push(`image missing: ${p}`); });
  const text = JSON.stringify(c);
  BANNED.forEach(([re, why]) => { if (slug === 'truck-dispatch' && /broker/.test(why)) return; const m = text.match(re); if (m) errs.push(`${why}: "${m[0]}"`); });
  // Sam's call 2026-09-18: "heavy equipment movers" / "heavy machinery movers"
  // reads as heavy haul and trucking, which the revamp retired. Body prose may
  // still say a rigger lifts heavy equipment — that's plain English. This only
  // guards the naming slots, where the phrase becomes what we call ourselves.
  for (const [field, val] of Object.entries({ title: c.title, description: c.description, h1: c.h1, cardBlurb: c.cardBlurb, tag: c.tag })) {
    if (val && /heavy (equipment|machinery|machine)\s*(mover|moving)/i.test(val)) {
      errs.push(`heavy-haul-flavoured service name in ${field}: "${val.match(/heavy (equipment|machinery|machine)\s*(mover|moving)\w*/i)[0]}"`);
    }
  }
  const words = strip(text.replace(/"(slug|hero|band|src|metrosSentinel)":"[^"]*"/g,'')).split(/\s+/).filter(w=>/[a-z]/i.test(w)).length;
  if (words < 900) warns.push(`only ~${words} words (aim 1,100-1,700)`);
  for (const m of text.matchAll(/href=\\?"(\/[^"\\#]*)/g)) {
    const u = m[1];
    const svc = u.match(/^\/services\/([a-z0-9-]+)$/);
    if (svc && !bySlug[svc[1]]) errs.push(`link to unknown service ${u}`);
    const blog = u.match(/^\/blog\/([a-z0-9-]+)$/);
    if (blog && !fs.existsSync(path.join(ROOT,'blog',blog[1]+'.html')) && !['types-of-rigging','what-is-transloading','dedicated-freight-lanes-explained','truck-dispatch-for-small-fleets','how-to-move-a-printing-press','what-is-a-critical-lift','jacking-and-skidding-explained','export-crating-requirements','how-much-do-machinery-movers-cost','how-do-truck-dispatchers-get-paid'].includes(blog[1])) errs.push(`link to missing blog ${u}`);
  }
  (c.faq||[]).length < 5 && warns.push('fewer than 5 FAQs');
  console.log(`${errs.length ? '✖' : '✓'} ${slug} (~${words} words)`);
  errs.forEach(e => console.log(`    ERROR ${e}`)); warns.forEach(w => console.log(`    warn  ${w}`));
  if (errs.length) bad++;
}
process.exit(bad ? 1 : 0);
