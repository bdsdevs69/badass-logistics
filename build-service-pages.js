#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — service page generator

   Every /services/<slug> pillar and sub-service page is rendered from
   a content module in content/services/<slug>.js. The template owns
   layout, schema, chrome and internal linking; the module owns copy.

   Pages that carry a city matrix (rigging, machinery-moving,
   plant-relocation, cnc-machine-movers) declare `metrosSentinel`.
   This generator writes the EMPTY sentinel pair; build-service-cities.js
   runs after it and fills in the city cards. Run order lives in build.js.

   RUN: node build.js   (never on its own — see README)
   =========================================================== */
const fs = require('fs');
const path = require('path');
const { topbar, header, footer, headAssets } = require('./lib/chrome');
const { FAMILIES, bySlug, inFamily } = require('./lib/taxonomy');

const ROOT = __dirname;
const DOMAIN = 'https://badasslogistics.com';
const CONTENT_DIR = path.join(ROOT, 'content/services');

const esc = (s) => String(s).replace(/"/g, '&quot;');
const strip = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

// Allowed hero/band images must exist — fail loudly instead of shipping a blank hero.
function assertImg(p, slug) {
  if (!fs.existsSync(path.join(ROOT, p.replace(/^\//, '')))) {
    throw new Error(`[${slug}] image not found: ${p}`);
  }
}

// Only link blog guides that are live articles (not retired redirect stubs).
function liveGuide(slug) {
  const f = path.join(ROOT, 'blog', `${slug}.html`);
  if (!fs.existsSync(f)) return false;
  return !fs.readFileSync(f, 'utf8').includes('<!--REDIRECT-->');
}

const bgnotes = (notes = []) => {
  const spots = [
    'top:8%;right:4%;transform:rotate(-4deg)', 'top:44%;left:3%;transform:rotate(3deg)',
    'bottom:10%;right:6%;transform:rotate(-3deg)', 'top:24%;left:4%;transform:rotate(-2deg)',
    'bottom:26%;left:3%;transform:rotate(4deg)', 'top:62%;right:5%;transform:rotate(2deg)',
  ];
  return notes.slice(0, 3).map((n, i) => `<span class="bgnote" style="${spots[i % spots.length]}">${n}</span>`).join('\n  ');
};

function renderSection(sec, notes) {
  const bg = sec.bg === 'paper';
  const open = bg
    ? `<section class="bg-paper notes-bg" style="border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);">`
    : `<section class="notes-bg">`;
  const paras = (sec.paragraphs || []).map(p => `<p>${p}</p>`).join('\n  ');
  const list = sec.list && sec.list.length
    ? `<ul class="checklist" style="margin-bottom:18px;">${sec.list.map(li => `<li><span>${li}</span></li>`).join('')}</ul>` : '';
  const sub = (sec.subsections || []).map(ss => `<h3>${ss.h}</h3>\n  ${(ss.paragraphs || []).map(p => `<p>${p}</p>`).join('\n  ')}`).join('\n  ');
  return `${open}
  ${bgnotes(notes)}
  <div class="wrap prose">
  ${sec.tag ? `<span class="section-tag hand">${sec.tag}</span>` : ''}
  <h2>${sec.h2}</h2>
  ${paras}
  ${list}
  ${sub}
  ${(sec.after || []).map(p => `<p>${p}</p>`).join('\n  ')}
</div></section>`;
}

function page(c) {
  const svc = bySlug[c.slug];
  if (!svc) throw new Error(`[${c.slug}] not in lib/taxonomy.js`);
  const fam = FAMILIES[svc.family];
  const isPillar = fam.pillar === c.slug;
  const url = `${DOMAIN}/services/${c.slug}`;
  const rel = `services/${c.slug}.html`;
  [c.hero, c.band].filter(Boolean).forEach(p => assertImg(p, c.slug));
  (c.media && c.media.images || []).forEach(im => assertImg(im.src, c.slug));

  // ---- schema ----
  const serviceSchema = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: strip(c.h1), serviceType: c.serviceType,
    provider: { '@type': 'LocalBusiness', '@id': `${DOMAIN}/#organization`, name: 'Badass Logistics', telephone: '+1-307-284-1332', url: `${DOMAIN}/` },
    areaServed: { '@type': 'Country', name: 'United States' },
    description: strip(c.quickAnswer),
    url,
  };
  if (c.offers && c.offers.length) {
    serviceSchema.hasOfferCatalog = {
      '@type': 'OfferCatalog', name: c.serviceType,
      itemListElement: c.offers.map(o => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: strip(o) } })),
    };
  }
  const crumbs = [{ name: 'Home', item: `${DOMAIN}/` }];
  if (!isPillar) crumbs.push({ name: fam.label, item: `${DOMAIN}/services/${fam.pillar}` });
  crumbs.push({ name: svc.label, item: url });
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: b.item })),
  };
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: c.faq.map(f => ({ '@type': 'Question', name: strip(f.q), acceptedAnswer: { '@type': 'Answer', text: strip(f.a) } })),
  };
  const webPage = { '@context': 'https://schema.org', '@type': 'WebPage', url, name: strip(c.title), speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.answer-box'] } };

  // ---- blocks ----
  const crumbHtml = isPillar
    ? `<a href="/">Home</a> / ${svc.label}`
    : `<a href="/">Home</a> / <a href="/services/${fam.pillar}">${fam.label}</a> / ${svc.label}`;
  const notes = c.bgnotes || [];
  const n = (i) => notes.slice(i * 3, i * 3 + 3).length ? notes.slice(i * 3, i * 3 + 3) : notes.slice(0, 3);

  const caps = c.capabilities ? `
<section class="bg-paper" style="border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);"><div class="wrap">
  <span class="section-tag hand">${c.capabilities.tag || 'capabilities'}</span>
  <h2 class="section-title">${c.capabilities.h2}</h2>
  ${c.capabilities.intro ? `<p class="section-intro">${c.capabilities.intro}</p>` : ''}
  <div class="cap-grid">
    ${c.capabilities.items.map(it => `<div class="cap"><div class="k">${it.k}</div><h3>${it.h}</h3><p>${it.p}</p></div>`).join('\n    ')}
  </div>
</div></section>` : '';

  // Pillars list every service in their family — this is the "every type of rigging" grid.
  const familyGrid = isPillar && inFamily(svc.family).length > 1 ? `
<section class="notes-bg" id="types">
  ${bgnotes(n(4))}
  <div class="wrap">
  <span class="section-tag hand">${c.familyGrid && c.familyGrid.tag || 'every kind of job'}</span>
  <h2 class="section-title">${c.familyGrid && c.familyGrid.h2 || `${fam.label} services`}</h2>
  ${c.familyGrid && c.familyGrid.intro ? `<p class="section-intro">${c.familyGrid.intro}</p>` : ''}
  <div class="grid-services" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr));">
    ${inFamily(svc.family).filter(s => s.slug !== c.slug).map(s => {
      const m = loadModule(s.slug);
      return `<a class="svc-card" href="/services/${s.slug}"><div class="thumb" style="background-image:url('${m ? m.hero : c.hero}')"></div><span class="num hand">// ${s.short.toLowerCase()}</span><h3>${s.label}</h3><p>${m ? m.cardBlurb : ''}</p><span class="more">${s.short}</span></a>`;
    }).join('\n    ')}
  </div>
</div></section>` : '';

  const media = c.media ? `
<section class="notes-bg">
  ${bgnotes(n(2))}
  <div class="wrap">
  <span class="section-tag hand">${c.media.tag || 'on the job'}</span>
  <h2 class="section-title">${c.media.h2}</h2>
  ${c.media.intro ? `<p class="section-intro">${c.media.intro}</p>` : ''}
  <div class="media-split">
    <div><ul class="checklist">${c.media.checklist.map(li => `<li><span>${li}</span></li>`).join('')}</ul></div>
    ${c.media.images.slice(0, 1).map(im => `<figure class="media"><img loading="lazy" src="${im.src}" alt="${esc(im.alt)}"><figcaption>${im.caption}</figcaption></figure>`).join('')}
  </div>
</div></section>` : '';

  const process = c.process ? `
<section class="notes-bg">
  ${bgnotes(n(3))}
  <div class="wrap">
  <span class="section-tag hand">${c.process.tag || 'how it works'}</span>
  <h2 class="section-title">${c.process.h2}</h2>
  <ol class="step-list">
    ${c.process.steps.map(s => `<li><div><strong>${s.h}</strong>${s.p}</div></li>`).join('\n    ')}
  </ol>
</div></section>` : '';

  const industries = c.industries ? `
<section class="bg-paper" style="border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);"><div class="wrap">
  <span class="section-tag hand">${c.industries.tag || 'who we work for'}</span>
  <h2 class="section-title">${c.industries.h2}</h2>
  <div class="chip-row">${c.industries.items.map(i => `<span>${i}</span>`).join('')}</div>
</div></section>` : '';

  const sections = (c.sections || []).map((s, i) => renderSection(s, n(i + 1))).join('\n');

  const faq = `
<section class="bg-paper notes-bg" style="border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);">
  <div class="wrap">
  <span class="section-tag hand">questions</span>
  <h2 class="section-title">${c.faqTitle || `${svc.short} FAQ`}</h2>
  <div class="faq">
    ${c.faq.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${f.q}</summary><div class="a">${f.a}</div></details>`).join('\n    ')}
  </div>
</div></section>`;

  // Related: explicit list first, then the family pillar, then cross-family bridges.
  const relatedSlugs = [...new Set([...(c.related || []), ...(isPillar ? [] : [fam.pillar])])]
    .filter(s => s !== c.slug && bySlug[s]).slice(0, 6);
  const related = relatedSlugs.length && !isPillar ? `
<section><div class="wrap">
  <span class="section-tag hand">same crew, next step</span>
  <h2 class="section-title">Related services</h2>
  <div class="grid-services" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
    ${relatedSlugs.map(s => { const m = loadModule(s); return `<a class="svc-card" href="/services/${s}"><span class="num hand" style="margin-top:22px;">// ${FAMILIES[bySlug[s].family].label.toLowerCase()}</span><h3>${bySlug[s].label}</h3><p>${m ? m.cardBlurb : ''}</p><span class="more">${bySlug[s].short}</span></a>`; }).join('\n    ')}
  </div>
</div></section>` : '';

  const guides = (c.guides || []).filter(([g]) => liveGuide(g));
  const guideHtml = guides.length ? `
<section><div class="wrap">
  <span class="section-tag hand">From the field guide</span>
  <h2 class="section-title">Straight answers from our blog</h2>
  <div class="grid-services" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
    ${guides.map(([g, t]) => `<a class="svc-card" href="/blog/${g}"><span class="num hand" style="margin-top:22px;">field guide</span><h3>${t}</h3><span class="more">Read the guide</span></a>`).join('\n    ')}
  </div>
</div></section>` : '';

  const metros = c.metrosSentinel ? `
<section><div class="wrap">
  <span class="section-tag hand">${c.metrosTag || 'by metro'}</span>
  <h2 class="section-title">${c.metrosH2 || `Where we work`}</h2>
  <p class="section-intro">${c.metrosIntro || ''}</p>
  <div class="grid-services" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));">
  <!--${c.metrosSentinel}_START-->
  <!--${c.metrosSentinel}_END-->
  </div>
</div></section>` : '';

  const annots = (c.annots || []).slice(0, 4).map((a, i) =>
    `<span class="annot hand ${i === 0 ? 'tag warn ' : ''}${['a1', 'a4', 'a3', 'a6'][i]}">${a}</span>`).join('\n  ');

  const ctaHref = c.ctaHref || (svc.family === 'dispatch' ? '/quote-dispatch' : svc.family === 'freight' ? '/quote-project-freight' : '/contact');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${c.title}</title>
<meta name="description" content="${esc(c.description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#141414">
<meta property="og:type" content="website">
<meta property="og:title" content="${c.title}">
<meta property="og:description" content="${esc(c.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${DOMAIN}${c.hero}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${c.title}">
<meta name="twitter:description" content="${esc(c.description)}">
<meta name="twitter:image" content="${DOMAIN}${c.hero}">
${headAssets()}
<script type="application/ld+json">
${JSON.stringify(serviceSchema, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify(breadcrumbSchema, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify(faqSchema, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify(webPage)}
</script>
<link rel="preload" as="image" href="${c.hero}" fetchpriority="high">
</head>
<body>

${topbar()}
${header()}

<div class="wrap breadcrumb">${crumbHtml}</div>

<section class="page-hero photo" style="background-image:url('${c.hero}')">
  <div class="wrap">
  <span class="section-tag hand">// ${c.tag}</span>
  <h1>${c.h1}</h1>
  <p class="lead">${c.lead}</p>
  <div class="cta-row" style="margin-top:24px;"><a class="btn" href="${ctaHref}">${c.cta}</a>${c.cta2 ? ` <a class="btn ghost" href="${c.cta2.href}">${c.cta2.label}</a>` : ''}</div>
</div>
  ${annots}
</section>

<section class="notes-bg">
  ${bgnotes(n(0))}
  <div class="wrap prose">
    <div class="answer-box"><p><strong>Quick answer:</strong> ${c.quickAnswer}</p></div>
  <h2>${c.intro.h2}</h2>
  ${c.intro.paragraphs.map(p => `<p>${p}</p>`).join('\n  ')}
</div></section>
${c.requirements ? `
<div class="band"><div class="wrap" style="padding-top:40px;padding-bottom:40px;">
  <div class="req-row">${c.requirements.map(r => `<div class="req"><div class="n">${r.n}</div><div class="l">${r.l}</div></div>`).join('')}</div>
</div></div>` : ''}
${caps}
${familyGrid}
${media}
${sections}
${process}
${industries}
${faq}
${related}
${guideHtml}
${c.band ? `
<div class="photo-band" style="background-image:url('${c.band}')">
  ${(c.bandAnnots || []).slice(0, 2).map((a, i) => `<span class="annot hand ${i === 0 ? 'tag a1' : 'a6'}">${a}</span>`).join('\n  ')}
</div>` : ''}
${metros}

<div class="cta-band"><div class="wrap" style="padding-top:56px;padding-bottom:56px;text-align:center;">
  <h2>${c.ctaBand.h2}</h2>
  <p>${c.ctaBand.p}</p>
  <a class="btn dark" href="${ctaHref}">${c.cta}</a>
</div></div>

${footer(rel)}

</body>
</html>
`;
}

const cache = {};
function loadModule(slug) {
  if (slug in cache) return cache[slug];
  const f = path.join(CONTENT_DIR, `${slug}.js`);
  cache[slug] = fs.existsSync(f) ? require(f) : null;
  return cache[slug];
}

// ---- lint: the positioning rules, enforced on every build ----
const BANNED = [
  [/\$\s?\d/, 'price or dollar figure'],
  [/\b(MC|DOT)\s?(#|number|no\.?)\s?\d/i, 'authority number'],
  [/\bour (own )?(trucks|fleet|trailers|drivers)\b/i, 'claims an owned fleet (transport runs on partner carriers)'],
  [/heavy[- ]haul(ers?|ing)? (company|carrier|trucking|specialists?|transport(ation)?)\b/i, 'heavy-haul positioning'],
  [/\b(OSHA|NCCCO|ASME)[- ]certified\b/i, 'certification claim'],
  [/\bservice area\b/i, '"service area" phrasing'],
  [/\bheadquarter/i, 'HQ disclosure'],
];
function lint(c) {
  const text = JSON.stringify(c);
  return BANNED.filter(([re]) => re.test(text)).map(([, why]) => why);
}

// ---- build ----
const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.js')).sort();
let built = 0, problems = 0;
for (const f of files) {
  const c = loadModule(f.replace(/\.js$/, ''));
  const issues = lint(c);
  if (issues.length) { problems++; console.error(`  ✖ ${c.slug}: ${issues.join(', ')}`); continue; }
  const out = path.join(ROOT, 'services', `${c.slug}.html`);
  fs.writeFileSync(out, page(c));
  built++;
}
if (problems) { console.error(`✖ ${problems} service page(s) failed the positioning lint`); process.exit(1); }

// ---- homepage: rigging type grid + Organization schema, both from the taxonomy ----
const home = path.join(ROOT, 'index.html');
if (fs.existsSync(home)) {
  let h = fs.readFileSync(home, 'utf8');
  const types = inFamily('rigging').filter(s => s.slug !== 'rigging').map(s => {
    const m = loadModule(s.slug);
    return `      <a href="/services/${s.slug}"><span class="k">// ${s.short.toLowerCase()}</span><h3>${s.label}</h3></a>`;
  }).join('\n');
  h = h.replace(/<!--RIG_TYPES_START-->[\s\S]*?<!--RIG_TYPES_END-->/, `<!--RIG_TYPES_START-->\n${types}\n      <a href="/services/rigging"><span class="k">// and more</span><h3>Presses, Labs, Tanks &amp; More &rarr;</h3></a>\n<!--RIG_TYPES_END-->`);
  const { SERVICES } = require('./lib/taxonomy');
  const org = {
    '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': `${DOMAIN}/#organization`,
    name: 'Badass Logistics', foundingDate: '2022',
    image: `${DOMAIN}/assets/logo.png`, url: `${DOMAIN}/`, telephone: '+1-307-284-1332', email: 'info@badasslogistics.com',
    address: { '@type': 'PostalAddress', streetAddress: '1001 S Main St, STE 500', addressLocality: 'Kalispell', addressRegion: 'MT', postalCode: '59901', addressCountry: 'US' },
    hasMap: 'https://www.google.com/maps?cid=11233972225292606488',
    sameAs: ['https://www.google.com/maps?cid=11233972225292606488'],
    areaServed: { '@type': 'Country', name: 'United States' },
    slogan: 'Riggers first.',
    knowsAbout: ['Industrial rigging', 'Machinery moving', 'Plant relocation', 'MRI and medical equipment rigging', 'CNC machine moving', 'Crane lifts and critical lifts', 'Jacking and skidding', 'Hydraulic gantry lifts', 'Millwright services', 'Data center rigging', 'Chiller and HVAC rigging', 'Transformer and generator rigging', 'Project freight', 'Container transloading', 'Industrial crating', 'Dedicated freight lanes', 'Truck dispatch for fleets'],
    description: 'Industrial rigging company — our own crews and rigging gear for every kind of rigging, plus project freight for the jobs we rig and truck dispatch for trucking companies with 4 or more trucks.',
    hasOfferCatalog: {
      '@type': 'OfferCatalog', name: 'Rigging, Project Freight & Truck Dispatch',
      itemListElement: SERVICES.map(s => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.label, url: `${DOMAIN}/services/${s.slug}` } })),
    },
  };
  h = h.replace(/<!--ORG_SCHEMA_START-->[\s\S]*?<!--ORG_SCHEMA_END-->/, `<!--ORG_SCHEMA_START-->\n<script type="application/ld+json">\n${JSON.stringify(org, null, 2)}\n</script>\n<!--ORG_SCHEMA_END-->`);
  fs.writeFileSync(home, h);
  console.log('✓ Homepage rigging grid + Organization schema refreshed from taxonomy');
}
console.log(`✓ Built ${built} service pages from content/services`);
