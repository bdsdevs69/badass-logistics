/* ===========================================================
   Which service x city pages exist. Single source for
   build-service-cities.js (which writes them) and build-locations.js
   (whose city hubs link to them, and runs first). Keeping one list
   is what stops a city hub linking a crane page that was never built.

   'ALL' = all 88 metros in data/locations.json. A number = the top N
   metros by `rank` in data/metros.json, plus any DEMAND_EXTRAS.
   Wave 1 (Sep 2026): rigging, cnc, machinery-moving, plant-relocation.
   Wave 2 (2026-09-27): millwright, removal, crane (60), forklift (40)
   — seo/geo-architecture-plan.md §4.
   Wave 3 (2026-10-19): the 7 specialty services, SECTOR-MATCHED — a
   service goes only to metros whose researched `anchors` (data/metros.json
   detail) grade that sector "strong" or "some" and name at least one real
   anchor. `max` is a ceiling, not a target: a sector that only exists in
   12 metros gets 12 pages. That match is the anti-doorway defence.
   =========================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const WAVE_SPEC = {
  'rigging': 'ALL',
  'cnc-machine-movers': 'ALL',
  'machinery-moving': 'ALL',
  'plant-relocation': 'ALL',
  'millwright-services': 'ALL',
  'machinery-removal': 'ALL',
  'crane-services': 60,
  'forklift-loading-unloading': 40,
  // wave 3, 2026-10-19
  'heavy-lift-rigging': 50,
  'hvac-chiller-rigging':          { sector: ['buildings'], max: 40 },
  'transformer-generator-rigging': { sector: ['energy', 'datacenter'], max: 35 },
  'mri-medical-equipment-rigging': { sector: ['health'], max: 30 },
  'lab-equipment-movers':          { sector: ['research'], max: 25 },
  'printing-press-movers':         { sector: ['print'], max: 25 },
  'data-center-rigging':           { sector: ['datacenter'], max: 20 },
};

// Metros added on top of a top-N wave because Search Console already shows
// demand there. 90d to 2026-09-25: "forklift rigging savannah ga" 21 impr,
// "large equipment unloading lansing/grand rapids/toledo" 11/10/3 — all
// ranked 52-70 by size, so rank alone would have left them out.
const DEMAND_EXTRAS = {
  'forklift-loading-unloading': ['Savannah|GA', 'Lansing|MI', 'Grand Rapids|MI', 'Toledo|OH'],
};

const locations = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/locations.json'), 'utf8'));
const metrosFile = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/metros.json'), 'utf8'));
const metros = metrosFile.metros;
const detail = metrosFile.detail || {};
const rankOf = {};
metros.forEach(m => { rankOf[`${m.city}|${m.state}`] = m.rank; });
const ALL_KEYS = locations.map(l => `${l.city}|${l.state}`);

// Sector score for one metro: 2 = strong, 1 = some, 0 = no match. A grade
// with no named anchor behind it does not count — the page has to be able
// to name what is there. `buildings` is a sentence, not a list.
const GRADE = { strong: 2, some: 1 };
function sectorScore(key, sectors) {
  const a = (detail[key] || {}).anchors;
  if (!a || !a.grade) return 0;
  return Math.max(0, ...sectors.map(s => {
    const named = Array.isArray(a[s]) ? a[s].length > 0 : !!(a[s] && String(a[s]).trim());
    return named ? (GRADE[a.grade[s]] || 0) : 0;
  }));
}

function waveKeys(service) {
  const spec = WAVE_SPEC[service];
  if (spec === undefined) return [];
  if (spec === 'ALL') return ALL_KEYS.slice();
  if (typeof spec === 'object') {
    // strong before some, then metro rank. Never padded past the matches.
    return ALL_KEYS.map(k => [k, sectorScore(k, spec.sector)]).filter(([, sc]) => sc > 0)
      .sort((x, y) => (y[1] - x[1]) || ((rankOf[x[0]] || 999) - (rankOf[y[0]] || 999)))
      .slice(0, spec.max).map(([k]) => k);
  }
  const top = ALL_KEYS.filter(k => rankOf[k]).sort((a, b) => rankOf[a] - rankOf[b]).slice(0, spec);
  for (const k of DEMAND_EXTRAS[service] || []) {
    if (!ALL_KEYS.includes(k)) throw new Error(`lib/waves.js: demand extra ${k} is not in data/locations.json`);
    if (!top.includes(k)) top.push(k);
  }
  return top;
}

const WAVES = {};
for (const s of Object.keys(WAVE_SPEC)) WAVES[s] = WAVE_SPEC[s] === 'ALL' ? 'ALL' : waveKeys(s);

const inWave = (service, key) => { const w = WAVES[service]; return !!w && (w === 'ALL' || w.includes(key)); };

module.exports = { WAVES, WAVE_SPEC, waveKeys, inWave, sectorScore };
