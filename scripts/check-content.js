#!/usr/bin/env node
// Validate content/services modules WITHOUT writing any pages.
//   node scripts/check-content.js <slug> [slug...]
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
  [/\bbroker(age|ed|s)?\b/i, 'broker language (avoid describing ourselves in broker terms)'],
];
const strip = s => String(s).replace(/<[^>]+>/g,' ').replace(/&[a-z]+;/g,' ');
const slugs = process.argv.slice(2);
if (!slugs.length) { console.log('usage: node scripts/check-content.js <slug>...'); process.exit(1); }
let bad = 0;
for (const slug of slugs) {
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
  const words = strip(text.replace(/"(slug|hero|band|src|metrosSentinel)":"[^"]*"/g,'')).split(/\s+/).filter(w=>/[a-z]/i.test(w)).length;
  if (words < 900) warns.push(`only ~${words} words (aim 1,100-1,700)`);
  for (const m of text.matchAll(/href=\\?"(\/[^"\\#]*)/g)) {
    const u = m[1];
    const svc = u.match(/^\/services\/([a-z0-9-]+)$/);
    if (svc && !bySlug[svc[1]]) errs.push(`link to unknown service ${u}`);
    const blog = u.match(/^\/blog\/([a-z0-9-]+)$/);
    if (blog && !fs.existsSync(path.join(ROOT,'blog',blog[1]+'.html')) && !['types-of-rigging','what-is-transloading','dedicated-freight-lanes-explained','truck-dispatch-for-small-fleets'].includes(blog[1])) errs.push(`link to missing blog ${u}`);
  }
  (c.faq||[]).length < 5 && warns.push('fewer than 5 FAQs');
  console.log(`${errs.length ? '✖' : '✓'} ${slug} (~${words} words)`);
  errs.forEach(e => console.log(`    ERROR ${e}`)); warns.forEach(w => console.log(`    warn  ${w}`));
  if (errs.length) bad++;
}
process.exit(bad ? 1 : 0);
