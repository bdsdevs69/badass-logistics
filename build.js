#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — single build entrypoint

   WHY THIS EXISTS:
   The generators overwrite programmatic pages, which wipes any pass that
   ran before them. Running steps in the wrong order, or skipping the tail,
   has silently broken the live site more than once. So: one command.

   RUN:  node build.js            (full rebuild, then verify)
         node build.js --verify   (verify only — no writes)

   2026-09 revamp: riggers first. Heavy haul is retired (redirect stubs via
   data/redirects.json); service pages come from content/services; header and
   footer come from lib/chrome.js; sitemap and llms.txt are generated last.
   =========================================================== */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VERIFY_ONLY = process.argv.includes('--verify');

// Order matters. Writers first, link pass after the pages it links, stubs after
// every generator (nothing may overwrite them), chrome after every writer,
// then the files that describe the finished site.
const STEPS = [
  ['build-locations.js',      '88 city pages + locations grid'],
  ['build-states.js',         'state hub pages + state chips'],
  ['build-blog.js',           'field-guide articles + blog index'],
  ['build-service-pages.js',  '17 service pages from content/services + homepage grid'],
  ['build-service-cities.js', 'service x city pages + state hubs + pillar metro grids'],
  ['seo-polish.js',           'head upgrades for hand-written pages'],
  ['link-city-mesh.js',       'LINK PASS — lateral nearby-city mesh'],
  ['build-redirects.js',      'redirect stubs for retired URLs'],
  ['apply-chrome.js',         'shared header + footer on every page'],
  ['build-llms.js',           'llms.txt'],
  ['build-sitemap.js',        'sitemap.xml from indexable pages on disk'],
];

function run(script, desc) {
  const p = path.join(__dirname, script);
  if (!fs.existsSync(p)) { console.error(`  ✖ missing ${script}`); process.exit(1); }
  process.stdout.write(`\n▸ ${script}  — ${desc}\n`);
  try {
    const out = execSync(`node ${JSON.stringify(p)}`, { cwd: __dirname, encoding: 'utf8' });
    out.trim().split('\n').filter(Boolean).forEach(l => console.log('   ' + l));
  } catch (e) {
    console.error(`  ✖ ${script} failed:\n${e.stdout || ''}${e.stderr || ''}`);
    process.exit(1);
  }
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.claude', 'content-drafts', 'content', 'lib', 'scripts', 'data', 'assets'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function verify() {
  console.log('\n══ VERIFY ═══════════════════════════════════════════');
  const ROOT = __dirname;
  const all = walk(ROOT);
  const read = (f) => fs.readFileSync(f, 'utf8');
  const isStub = (f) => read(f).includes('<!--REDIRECT-->');
  const files = all.filter(f => !isStub(f));
  const stubs = all.filter(isStub);
  let fail = 0;
  const check = (ok, msg, detail = []) => {
    console.log(`${ok ? '✓' : '✖'} ${msg}`);
    if (!ok) { fail++; detail.slice(0, 12).forEach(d => console.log('     ' + d)); }
  };

  // 1. city mesh landed on every service-city page
  const SERVICE_DIRS = ['machinery-moving', 'rigging', 'cnc-machine-movers', 'plant-relocation'];
  const cityRe = /-[a-z]{2}\.html$/;
  let meshTotal = 0, meshHas = 0;
  for (const d of SERVICE_DIRS) {
    const dir = path.join(ROOT, 'services', d);
    if (!fs.existsSync(dir)) continue;
    for (const n of fs.readdirSync(dir).filter(x => cityRe.test(x))) {
      meshTotal++;
      if (read(path.join(dir, n)).includes('<!--CITY_MESH_START-->')) meshHas++;
    }
  }
  check(meshTotal > 0 && meshHas === meshTotal, `city mesh: ${meshHas}/${meshTotal} service-city pages`);

  // 2. internal links resolve, and never point at a redirect stub
  const resolve = (u) => {
    u = u.split('#')[0].split('?')[0];
    if (u.endsWith('/')) u += 'index.html';
    const p = path.join(ROOT, u.replace(/^\//, ''));
    for (const c of [p, p + '.html', path.join(p, 'index.html')]) {
      if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
    }
    return null;
  };
  const broken = new Map(), toStub = new Map();
  let checked = 0;
  for (const f of files) {
    const html = read(f).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
    for (const m of html.matchAll(/href="([^"]+)"/g)) {
      const raw = m[1];
      if (/^(https?:|mailto:|tel:|#|javascript:|data:)/i.test(raw)) continue;
      checked++;
      const target = raw.startsWith('/') ? raw : '/' + path.relative(ROOT, path.resolve(path.dirname(f), raw.split('#')[0].split('?')[0]));
      const hit = resolve(target);
      const key = `${raw}  (from /${path.relative(ROOT, f)})`;
      if (!hit) broken.set(key, (broken.get(key) || 0) + 1);
      else if (hit.endsWith('.html') && isStubCached(hit)) toStub.set(key, (toStub.get(key) || 0) + 1);
    }
  }
  check(broken.size === 0, `internal links: ${checked} checked, ${broken.size} broken`, [...broken].map(([u, c]) => `${c}x ${u}`));
  check(toStub.size === 0, `links to retired URLs: ${toStub.size}`, [...toStub].map(([u, c]) => `${c}x ${u}`));

  // 3. every pillar with a city matrix still carries its city cards
  for (const [svc, min] of [['machinery-moving', 50], ['rigging', 50], ['plant-relocation', 50], ['cnc-machine-movers', 50]]) {
    const pillar = path.join(ROOT, `services/${svc}.html`);
    const ph = fs.existsSync(pillar) ? read(pillar) : '';
    const n = new Set([...ph.matchAll(new RegExp(`href="(?:/services/)?${svc}/([a-z-]+)"`, 'g'))].map(m => m[1])).size;
    check(n >= min, `${svc} pillar city links: ${n} (expect ${min}+)`);
  }

  // 4. titles + descriptions present and unique (stubs exempt)
  const titles = new Map(), descs = new Map();
  let noTitle = 0, noDesc = 0;
  for (const f of files) {
    const html = read(f);
    const t = html.match(/<title>([\s\S]*?)<\/title>/);
    const d = html.match(/name="description"\s+content="([\s\S]*?)"/);
    if (!t) noTitle++; else titles.set(t[1].trim(), (titles.get(t[1].trim()) || 0) + 1);
    const noindex = /name="robots"[^>]*content="[^"]*noindex/i.test(html);
    if (!d) { if (!noindex) noDesc++; } else descs.set(d[1].trim(), (descs.get(d[1].trim()) || 0) + 1);
  }
  const dupT = [...titles].filter(([, v]) => v > 1);
  const dupD = [...descs].filter(([, v]) => v > 1).length;
  check(noTitle === 0 && dupT.length === 0, `titles: ${files.length} pages, ${noTitle} missing, ${dupT.length} duplicated`, dupT.map(([t, c]) => `${c}x ${t}`));
  console.log(`${noDesc === 0 && dupD === 0 ? '✓' : '!'} descriptions: ${noDesc} missing, ${dupD} duplicated (noindex pages exempt)`);

  // 5. positioning: heavy haul must not appear in any indexable page's title,
  //    description, or site chrome; retired pages must all be stubs
  const leaks = [];
  for (const f of files) {
    const html = read(f);
    if (/name="robots"[^>]*noindex/i.test(html)) continue;
    const head = (html.match(/<title>[\s\S]*?<\/title>/) || [''])[0] + ((html.match(/name="description"\s+content="[^"]*"/) || [''])[0]);
    const chrome = (html.match(/<header[\s\S]*?<\/header>/) || [''])[0] + (html.match(/<footer[\s\S]*?<\/footer>/) || [''])[0];
    if (/heavy[- ]haul/i.test(head + chrome)) leaks.push('/' + path.relative(ROOT, f));
  }
  check(leaks.length === 0, `heavy haul in titles/descriptions/nav/footer: ${leaks.length} pages`, leaks);
  const hhLeft = fs.existsSync(path.join(ROOT, 'services/heavy-haul'))
    ? fs.readdirSync(path.join(ROOT, 'services/heavy-haul')).filter(n => !isStubCached(path.join(ROOT, 'services/heavy-haul', n))) : [];
  check(hhLeft.length === 0, `retired heavy-haul city pages still live: ${hhLeft.length} (${stubs.length} redirect stubs total)`, hhLeft);

  // 6. every live page carries the phone and a department mailbox.
  //    Rigging pages answer on rigging@, dispatch on dispatch@, and
  //    everything else on info@ — a page that shows neither number nor
  //    address is a page a buyer can land on with no way to call.
  const noContact = [];
  for (const f of files) {
    const html = read(f);
    const rel = '/' + path.relative(ROOT, f);
    const hasPhone = /3072841332|\(307\)\s*284-1332/.test(html);
    const mail = html.match(/mailto:([a-z0-9._%+-]+@badasslogistics\.com)/i);
    if (!hasPhone || !mail) { noContact.push(`${rel}${hasPhone ? '' : ' (no phone)'}${mail ? '' : ' (no email)'}`); continue; }
    // Quote landing pages all answer on info@ — that mailbox is already
    // activated with FormSubmit, so a lead never waits on a confirmation click.
    const want = /^\/services\/(rigging|machinery|plant|mri|lab|cnc|printing|crane|heavy-lift|millwright|forklift|data-center|hvac|transformer)/.test(rel) ? 'rigging@'
      : /^\/services\/truck-dispatch/.test(rel) ? 'dispatch@'
      : /^\/quote-/.test(rel) ? 'info@' : null;
    if (want && !mail[1].startsWith(want)) noContact.push(`${rel} shows ${mail[1]}, expected ${want}…`);
  }
  check(noContact.length === 0, `phone + department email on every page: ${files.length - noContact.length}/${files.length}`, noContact.slice(0, 12));

  // 7. sitemap lists only indexable, non-stub pages
  const sm = fs.existsSync(path.join(ROOT, 'sitemap.xml')) ? read(path.join(ROOT, 'sitemap.xml')) : '';
  const smBad = [...sm.matchAll(/<loc>https:\/\/badasslogistics\.com([^<]*)<\/loc>/g)].map(m => m[1]).filter(u => {
    const hit = resolve(u === '' ? '/' : u);
    return !hit || isStubCached(hit);
  });
  check(sm.length > 0 && smBad.length === 0, `sitemap: ${(sm.match(/<loc>/g) || []).length} URLs, ${smBad.length} bad`, smBad);

  console.log('═════════════════════════════════════════════════════');
  if (fail) { console.error(`✖ ${fail} check(s) FAILED — do not deploy.`); process.exit(1); }
  console.log('✓ All checks passed.\n');
}

const stubCache = new Map();
function isStubCached(f) {
  if (!stubCache.has(f)) stubCache.set(f, fs.readFileSync(f, 'utf8').includes('<!--REDIRECT-->'));
  return stubCache.get(f);
}

if (!VERIFY_ONLY) {
  console.log('Badass Logistics — full rebuild');
  for (const [s, d] of STEPS) run(s, d);
}
verify();
