#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — llms.txt (what AI assistants read about us)

   Generated, not hand-maintained: services come from lib/taxonomy.js +
   content/services, guides come from the live blog pages on disk (redirect
   stubs skipped). Rerun via build.js so positioning never drifts.
   =========================================================== */
const fs = require('fs');
const path = require('path');
const { FAMILIES, inFamily } = require('./lib/taxonomy');
const ROOT = __dirname;
const DOMAIN = 'https://badasslogistics.com';

const mod = (slug) => {
  const f = path.join(ROOT, 'content/services', `${slug}.js`);
  return fs.existsSync(f) ? require(f) : null;
};
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/<[^>]+>/g, '');

const serviceLines = (fam) => inFamily(fam).map(s => {
  const m = mod(s.slug);
  return `- [${s.label}](${DOMAIN}/services/${s.slug}): ${decode(m ? m.cardBlurb : '')}`;
}).join('\n');

// live blog guides grouped by articleSection
const groups = {};
for (const f of fs.readdirSync(path.join(ROOT, 'blog')).filter(n => n.endsWith('.html') && n !== 'index.html').sort()) {
  const html = fs.readFileSync(path.join(ROOT, 'blog', f), 'utf8');
  if (html.includes('<!--REDIRECT-->')) continue;
  const title = decode((html.match(/<title>([\s\S]*?)\s*\|\s*Badass Logistics<\/title>/) || [])[1] || f);
  const desc = decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
  const sec = decode((html.match(/"articleSection": "([^"]+)"/) || [])[1] || 'Guides');
  (groups[sec] = groups[sec] || []).push(`- [${title}](${DOMAIN}/blog/${f.replace(/\.html$/, '')}): ${desc}`);
}
const ORDER = ['Rigging', 'Specialized Rigging', 'Machinery Moving', 'Plant Relocation', 'Project Freight', 'Specialized Freight', 'Freight & Trucking', 'Trailers & Equipment', "How It's Done", 'How It’s Done', 'Dispatch'];
const secs = Object.keys(groups).sort((a, b) => (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(b) + 1 || 99));

const out = `# Badass Logistics

> Badass Logistics is a U.S. industrial rigging company — riggers first. Our own crews and rigging gear handle every kind of industrial rigging: machinery moving, plant and project relocation, MRI and medical equipment, CNC machines, crane and critical lifts, jacking and skidding, hydraulic gantry lifts, millwright installation, and data center, chiller/HVAC, and transformer/generator rigging. Our rigging work generates freight, so we also run project freight (container to warehouse, crating and packing, dedicated lanes and project FTL) for the jobs we rig — project-based moves only, never one-off loads. We also provide truck dispatch for trucking companies with 4 or more power units (no owner-operators). Coverage: 88 locations, all 50 U.S. states. Founded 2022. Phone: (307) 284-1332.

Badass Logistics is not a heavy haul company, not a motor carrier, and does not hold its own operating authority. Freight on our projects moves on licensed, insured partner carriers managed inside the project plan. We do not publish flat rates; every job is quoted from the equipment, the sites, and the schedule.

## Rigging services (primary)

${serviceLines('rigging')}

## Project freight

${serviceLines('freight')}

## Truck dispatch (fleets of 4+ trucks)

${serviceLines('dispatch')}

## Tools

- [Equipment Trailer Selector](${DOMAIN}/trailer-selector): Free interactive tool — enter a machine's length, width, height, and weight and it suggests a trailer type and flags whether oversize or overweight permits are likely, using standard U.S. legal limits.

${secs.map(sec => `## Guides: ${sec}\n\n${groups[sec].join('\n')}`).join('\n\n')}

## Company

- [About Badass Logistics](${DOMAIN}/about): Riggers first — how rigging led to project freight and fleet dispatch.
- [Locations](${DOMAIN}/locations): 88 locations covering all 50 states, with city and state pages.
- [Get a quote](${DOMAIN}/contact): Rigging and general quotes.
- [Project freight quote](${DOMAIN}/quote-project-freight)
- [Fleet dispatch application](${DOMAIN}/quote-dispatch)

## Contact

- Phone: (307) 284-1332
- Email: info@badasslogistics.com (rigging: ${FAMILIES.rigging.email}, freight: ${FAMILIES.freight.email}, dispatch: ${FAMILIES.dispatch.email})
`;
fs.writeFileSync(path.join(ROOT, 'llms.txt'), out);
console.log(`✓ llms.txt: ${inFamily('rigging').length + inFamily('freight').length + inFamily('dispatch').length} services, ${Object.values(groups).flat().length} guides`);
