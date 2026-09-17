#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — SERVICE × CITY matrix generator (config-driven)
   Templatized from the signed-off gold-standard CNC/Detroit page.

   Produces services/<service-slug>/<city-slug>.html for each
   (service, metro) in WAVES, then rewrites each pillar's metro grid
   (sentinels), appends URLs to sitemap.xml (idempotent), and writes
   data/service-cities.json.

   UNIQUENESS ENGINE: every page weaves the metro's REAL local data —
   industry phrase (data/metros.json) + nearby suburbs (data/locations.json)
   + state Interstates/DOT permits — and each SERVICE supplies genuinely
   distinct copy so same-city pages across services don't cannibalize.

   Add a service: add a SERVICES{} block + a WAVES{} entry. ('ALL' = all 88.)
   Run AFTER build-locations.js (it owns sitemap.xml). Re-run any time.
   =========================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/site.json'), 'utf8'));
const locations = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/locations.json'), 'utf8'));
const metrosFile = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/metros.json'), 'utf8'));
const TODAY = new Date().toISOString().slice(0, 10);
const DOMAIN = site.domain;

const STATE = {
  CA:{name:'California',ix:'I-5, I-10, I-15 and I-80'}, OR:{name:'Oregon',ix:'I-5 and I-84'}, WA:{name:'Washington',ix:'I-5, I-90 and I-82'}, NV:{name:'Nevada',ix:'I-15 and I-80'},
  AZ:{name:'Arizona',ix:'I-10, I-17 and I-40'}, NM:{name:'New Mexico',ix:'I-25, I-40 and I-10'}, CO:{name:'Colorado',ix:'I-25, I-70 and I-76'}, UT:{name:'Utah',ix:'I-15, I-80 and I-70'},
  ID:{name:'Idaho',ix:'I-84, I-86 and I-15'}, MT:{name:'Montana',ix:'I-90, I-94 and I-15'}, WY:{name:'Wyoming',ix:'I-25, I-80 and I-90'}, ND:{name:'North Dakota',ix:'I-29 and I-94'},
  NE:{name:'Nebraska',ix:'I-80 and I-29'}, MN:{name:'Minnesota',ix:'I-35, I-90 and I-94'}, MO:{name:'Missouri',ix:'I-70, I-44, I-35 and I-29'}, WI:{name:'Wisconsin',ix:'I-94, I-43 and I-90'},
  IL:{name:'Illinois',ix:'I-55, I-80, I-90 and I-94'}, IN:{name:'Indiana',ix:'I-65, I-70 and I-69'}, MI:{name:'Michigan',ix:'I-75, I-94 and I-96'}, OH:{name:'Ohio',ix:'I-70, I-71, I-75 and I-90'},
  TX:{name:'Texas',ix:'I-10, I-20, I-35 and I-45'}, OK:{name:'Oklahoma',ix:'I-35, I-40 and I-44'}, AR:{name:'Arkansas',ix:'I-40, I-30 and I-55'}, LA:{name:'Louisiana',ix:'I-10, I-12, I-20 and I-49'},
  MS:{name:'Mississippi',ix:'I-55, I-20, I-10 and I-59'}, AL:{name:'Alabama',ix:'I-65, I-20, I-10 and I-59'}, TN:{name:'Tennessee',ix:'I-40, I-65, I-24 and I-75'}, GA:{name:'Georgia',ix:'I-75, I-85, I-20 and I-95'},
  SC:{name:'South Carolina',ix:'I-95, I-26, I-85 and I-20'}, NC:{name:'North Carolina',ix:'I-40, I-85, I-95 and I-77'}, FL:{name:'Florida',ix:'I-95, I-75, I-10 and I-4'}, KY:{name:'Kentucky',ix:'I-65, I-64, I-75 and I-71'},
  VA:{name:'Virginia',ix:'I-95, I-64, I-81 and I-66'}, MD:{name:'Maryland',ix:'I-95, I-70 and I-83'}, PA:{name:'Pennsylvania',ix:'I-76, I-80, I-81 and I-95'}, NY:{name:'New York',ix:'I-87, I-90, I-95 and I-81'}, MA:{name:'Massachusetts',ix:'I-90, I-95 and I-93'},
  KS:{name:'Kansas',ix:'I-70, I-35 and I-135'}, CT:{name:'Connecticut',ix:'I-95, I-91 and I-84'}, IA:{name:'Iowa',ix:'I-80, I-35 and I-380'},
};
const stateName = (st) => (STATE[st] && STATE[st].name) || st;
const interstatesOf = (st) => (STATE[st] && STATE[st].ix) || 'the Interstate system';
const citySlug = (city, st) => `${city.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}-${st.toLowerCase()}`;
const locByKey = {}; locations.forEach(l => { locByKey[`${l.city}|${l.state}`] = l; });
const metroByKey = {}; metrosFile.metros.forEach(m => { metroByKey[`${m.city}|${m.state}`] = m; });
const ALL_KEYS = locations.map(l => `${l.city}|${l.state}`);

// shared real-industry detector → a sector phrase every service can frame its own way
function industryPhrase(industry) {
  const i = (industry || '').toLowerCase();
  if (/auto|tool-and-die|tool and die/.test(i)) return 'automotive and tool-and-die';
  if (/semiconductor|silicon/.test(i)) return 'semiconductor and precision-tool';
  if (/aerospace|aviation|defense/.test(i)) return 'aerospace and defense';
  if (/oil|petrochem|energy|lng|refin/.test(i)) return 'energy and petrochemical';
  if (/steel|metal|foundry/.test(i)) return 'steel and metal-fabrication';
  if (/ag\b|agriculture|food/.test(i)) return 'ag-equipment and food-processing';
  if (/pharma|biotech|medical/.test(i)) return 'pharma and medical-device';
  if (/paper|packaging|polymer|rubber|glass/.test(i)) return 'process-industry';
  if (/port|distribution|logistics|rail/.test(i)) return 'distribution and manufacturing';
  return 'manufacturing';
}

const chrome = require('./lib/chrome');
const NAV = `\n${chrome.topbar()}\n${chrome.header()}`;
const FOOTER_FOR = (rel) => chrome.footer(rel);

// ---------- SERVICES (genuinely distinct copy per vertical) ----------
const SERVICES = {
  'cnc-machine-movers': {
    name:'CNC Machine Movers', serviceType:'CNC Machine Moving', hero:'/assets/img/loads/load-machine-loadout.jpg', band:'/assets/img/rigging-crane.jpg',
    tag:'cnc machine movers', quote:'CNC', coverageNoun:'Machine-tool moves',
    snippet:`We move VMCs, HMCs, lathes, grinders, and full machine shops — lifted from the OEM's points, hauled on air-ride, and re-leveled to spec.`,
    lead:(c)=>`${c.city}'s ${c.angle} shops run on CNC — and their tolerances don't get a day off. We move VMCs, HMCs, lathes, and full machine shops across the ${c.city} metro, lifted from the OEM's points, hauled on air-ride, and re-leveled to spec so the spindle cuts true the morning you power back up.`,
    introH2:(c)=>`Machine-tool moving in ${c.CS}`,
    introPs:(c)=>[
      `${c.metro?`${c.city}'s industrial base — ${c.metro.industry} — runs on CNC.`:`${c.city} runs on CNC.`} Machining centers, lathes, grinders, and the job shops that feed them count on precision, and when one of those machines has to move it can't be muscled like a pallet. It's an instrument that holds ten-thousandths, and it has to come back online holding them.`,
      `That's the job Badass Logistics is built for in ${c.city}. We pull the manufacturer's lift and jacking data before a wrench turns, protect the ways, lock the axes and spindle, and move on air skates and air-ride — then set, level, and square the machine to spec. And when the machine is headed to another plant, the same crew manages it as <a href="/services/project-freight">project freight</a> — crated, loaded, and <a href="/services/rigging">rigged</a> back in at the other end, no hand-off.`,
    ],
    movesH2:(c)=>`${c.city} CNC &amp; machine-tool moves`,
    moves:[['production machining','Production Machining','VMCs, HMCs, and transfer lines'],['turning','CNC Lathes','Flat-bed and slant-bed lathes and multi-axis turning centers'],['grinding','Grinders &amp; EDM','Surface, cylindrical, and CNC grinders plus wire and sinker EDM'],['cells &amp; shops','Full Shop Relocations','Multi-machine cells and complete machine-shop moves']],
    faq:(c)=>[
      [`Do you move CNC machines in ${c.city}?`,`Yes — CNC machine moving throughout ${c.CS} and the surrounding metro, serving ${c.angle} machine shops. Single machines, cells, and full shop relocations. <a href="/contact">Get a quote →</a>`],
      [`How much does it cost to move a CNC machine in ${c.city}?`,`It depends on weight and class, rigging access at both shops, distance across the metro, and the disconnect and re-level work involved. Send the model and both floor layouts and we'll turn a ${c.city} quote around fast.`],
      [`Can you move a CNC machine from ${c.city} to another state?`,`Yes — we rig it out, crate it, and manage the transport as project freight through our licensed broker and carrier partners, then set and re-level it at the new shop.`],
      [`Do you re-level the machine after transit?`,`Always — set on the new pad and squared to the builder's spec before hand-off, ready for OEM ramp-up and first cut.`],
    ],
    titleFn:(CS)=>`CNC Machine Movers in ${CS} | Badass Logistics`,
    quoteFactors:['Machine make, model, and weight — from the builder\'s data, not a guess','Rigging access at both shops: doors, aisles, pits, and floor ratings','Disconnect, draining, and axis-locking work, and whether the OEM tech attends','Air-ride transport distance and whether the machine is crated','Re-leveling and anchoring at the new pad'],
    pillarFile:'services/cnc-machine-movers.html', sentinel:'CNC_METROS', cardNoun:'CNC movers',
  },

  'machinery-moving': {
    name:'Machinery Movers', serviceType:'Machinery Moving', hero:'/assets/img/loads/load-machine-loadout.jpg', band:'/assets/img/heavyhaul-load.jpg',
    tag:'machinery movers', quote:'Machinery', coverageNoun:'Machinery moves',
    snippet:`We disconnect, rig, haul, and re-level presses, generators, compressors, and full production lines as one accountable job.`,
    lead:(c)=>`Every hour a ${c.city} production floor sits idle costs money. From ${c.angle} plants to job shops, we rig, haul, and set industrial machinery across the ${c.city} metro — one accountable crew from disconnect to re-level, built to get your line back up on schedule.`,
    introH2:(c)=>`Machinery moving in ${c.CS}`,
    introPs:(c)=>[
      `Most machinery moves fail in the gaps — the rigger who only lifts, the carrier who only drives, the installer who shows up to a machine that was moved wrong. Across ${c.metro?`${c.city}'s ${c.metro.industry} base`:`the ${c.city} metro`}, Badass Logistics closes those gaps by running rigging, transport, and reinstallation as one job with one crew.`,
      `Presses, generators, compressors, production lines, a single machine between bays or a full <a href="/services/plant-relocation">plant relocation</a> — we plan it on paper first, move it on air skates and air-ride, and set and level it to spec at the new floor. Moving to another facility? It runs as <a href="/services/project-freight">project freight</a> inside the same plan — no hand-off.`,
    ],
    movesH2:(c)=>`What we move in ${c.city}`,
    moves:[['forming','Presses &amp; Fabrication','Stamping presses, press brakes, shears, and injection molding machines'],['power','Generators &amp; Compressors','Generator sets, compressors, switchgear, and plant utilities'],['machining','CNC &amp; Machine Tools','VMCs, lathes, and machining centers — see <a href="/services/cnc-machine-movers">CNC moving</a>'],['lines','Production Lines','Full lines and multi-machine cells, sequenced around production']],
    faq:(c)=>[
      [`Do you move industrial machinery in ${c.city}?`,`Yes — single machines, multi-machine cells, and full production-line moves throughout ${c.CS} and the surrounding metro, serving its ${c.angle} base. <a href="/contact">Get a quote →</a>`],
      [`How do you keep our downtime short?`,`Everything is decided before rig day — path of travel, floor loads, gear, and sequence — and the move is scheduled around your production calendar in ${c.city}, nights and weekends included, so the floor is down only for the move window.`],
      [`Can you move machinery out of ${c.city} to another plant?`,`Yes — machines are rigged out, crated where needed, and moved as project freight through our licensed broker and carrier partners, then set and leveled at the destination by the same crew.`],
      [`Do you reinstall and level the machine?`,`Yes — set on the new pad and leveled to the manufacturer's spec before hand-off, ready for recommissioning.`],
    ],
    titleFn:(CS)=>`Machinery Movers in ${CS} | Heavy Equipment Moving | Badass Logistics`,
    quoteFactors:['What\'s moving: machine types, weights, and dimensions','Access at both ends — doors, ceilings, docks, and floor capacity along the path','Disconnect and reconnect scope, and who handles utilities','Distance, crating, and whether it runs as a truckload or several','Setting, leveling, anchoring, and any staging time in between'],
    pillarFile:'services/machinery-moving.html', sentinel:'MM_METROS', cardNoun:'machinery movers',
  },

  'plant-relocation': {
    name:'Plant Relocation', serviceType:'Plant & Factory Relocation', hero:'/assets/img/heavyhaul-hero.jpg', band:'/assets/img/rgn-load.jpg',
    tag:'plant & factory relocation', quote:'Plant Relocation', coverageNoun:'Plant moves',
    snippet:`We plan and run full plant and production-line moves — disconnect, sequenced transport, reinstall, and recommission — so the floor is down only for the move window.`,
    lead:(c)=>`When a ${c.city} ${c.angle} operation expands, consolidates, or relocates, the whole floor moves — production lines, machines, utilities and all. We plan and run full plant and production-line relocations across the ${c.city} metro, sequenced so the line is down only for the move window, not a day longer.`,
    introH2:(c)=>`Plant &amp; factory relocation in ${c.CS}`,
    introPs:(c)=>[
      `A plant move isn't one big lift — it's dozens of moves in the right order: disconnect, teardown, sequenced transport, reinstall, recommission. Get the sequence wrong and the new floor sits half-built while production bleeds. Across ${c.metro?`${c.city}'s ${c.metro.industry} sector`:`the ${c.city} metro`}, Badass Logistics owns the whole project with one accountable crew.`,
      `We map the path of travel and floor loadings at both sites, tear down and label, run the loads as <a href="/services/project-freight">project freight</a> on <a href="/services/dedicated-lanes">dedicated lanes</a>, and <a href="/services/machinery-moving">rig and set</a> every machine back to spec in the new layout. Single line, full facility, or a multi-site consolidation — one plan, one team, one schedule.`,
    ],
    movesH2:(c)=>`${c.city} plant &amp; line relocation`,
    moves:[['production lines','Production Lines','Sequenced teardown, transport, and reinstall of complete lines'],['machine cells','Machine Cells','Multi-machine cells relocated and re-leveled in the new layout'],['utilities','Plant Utilities','Compressors, dust collection, conveyors, and support equipment'],['consolidation','Multi-Site Moves','Consolidating two floors into one, or splitting to a new building']],
    faq:(c)=>[
      [`Do you handle full plant relocations in ${c.city}?`,`Yes — single production lines, machine cells, and complete facility relocations throughout ${c.CS} and the surrounding metro, serving its ${c.angle} base. <a href="/contact">Get a quote →</a>`],
      [`How do you minimize downtime on a ${c.city} plant move?`,`The whole project is planned before teardown — path of travel, floor loads, machine sequence, and a schedule built around your production calendar so the line is down only for the move window.`],
      [`How do you handle the freight on a ${c.city} plant move?`,`It runs as project freight: machines are crated or prepped, loaded in sequence, and moved on dedicated partner-carrier capacity scheduled around the rig-out and rig-in, so trucks arrive when the crew is ready.`],
      [`Do you reinstall the line in the new building?`,`Yes — every machine is set, leveled, and squared to spec in the new layout, ready for recommissioning. We hand off a floor that's ready to run.`],
    ],
    titleFn:(CS)=>`Factory & Plant Relocation in ${CS} | Badass Logistics`,
    quoteFactors:['The asset list: how many machines and lines, and their weights','Phasing — what has to keep running while the rest moves','Teardown, tagging, and reassembly scope with your trades and OEMs','Truckload count, crating, and whether dedicated lanes make sense','Reinstall, leveling, and the start-up date the schedule works back from'],
    pillarFile:'services/plant-relocation.html', sentinel:'PR_METROS', cardNoun:'plant relocation',
  },

  'rigging': {
    name:'Industrial Rigging', serviceType:'Industrial Rigging', hero:'/assets/img/rigging-hero.jpg', band:'/assets/img/rigging-crane2.jpg',
    tag:'rigging company', quote:'Rigging', coverageNoun:'Rigging jobs',
    snippet:`We handle engineered lifts, machine setting, and heavy moves from a few hundred pounds to 200,000 lbs and beyond, set and leveled to spec.`,
    lead:(c)=>`When a machine is too heavy, too tall, or too tight to move safely, ${c.city} calls a rigger. Badass Logistics plans and executes precision lifts, machine setting, and heavy moves across the ${c.city} metro — from a few hundred pounds to 200,000 lbs and beyond, rigged, moved, and set by one accountable crew.`,
    introH2:(c)=>`Industrial rigging in ${c.CS}`,
    introPs:(c)=>[
      `${c.metro?`${c.city}'s ${c.metro.industry} base`:`The ${c.city} metro`} runs on machines that can't be muscled onto a truck — presses, machining centers, transformers, and production lines that have to come off the floor, through the door, and onto a trailer without a scratch. That's rigging: engineered lifts, air skates and gantries, and a crew that measures every doorway before anything moves.`,
      `Badass Logistics rigs it like an engineering problem and runs it like a road crew across ${c.city}. We plan the pick, protect the floors, and set the load to spec — and when the load has to leave the building, the same team runs <a href="/services/machinery-moving">the move</a> and the <a href="/services/project-freight">project freight</a>, so it gets rigged out, delivered, and reset without a hand-off.`,
    ],
    movesH2:(c)=>`What we rig in ${c.city}`,
    moves:[['machine setting','Machine Setting','Setting and leveling machinery onto pads and foundations to spec'],['heavy lifts','Heavy &amp; Critical Lifts','Crane, gantry, and jack-and-slide lifts up to 200,000 lbs and beyond'],['plant equipment','Plant Equipment','Presses, generators, transformers, and production-line machinery'],['tight access','Tight-Access Moves','Skating machines through doorways, up mezzanines, and out of packed floors']],
    faq:(c)=>[
      [`Do you offer rigging services in ${c.city}?`,`Yes — industrial rigging, machine setting, and heavy lifts throughout ${c.CS} and the surrounding metro, serving its ${c.angle} base. Single machines to full production lines. <a href="/contact">Get a quote →</a>`],
      [`How heavy a load can you rig in ${c.city}?`,`From a few hundred pounds to 200,000 lbs and beyond. We size the gear — cranes, gantries, skates, and jack-and-slide — to the load and the site, and plan every pick before rig day.`],
      [`What kinds of rigging do you do in ${c.city}?`,`Machine setting, crane and gantry lifts, jacking and skidding, millwright installation, MRI and medical equipment, data center, chiller, and transformer rigging — see every type on our <a href="/services/rigging">rigging page</a>.`],
      [`Do you set and level the machine after the lift?`,`Yes — we set the load on its new pad or foundation and level it to the manufacturer's spec, ready for recommissioning.`],
    ],
    titleFn:(CS)=>`Rigging Company in ${CS} | Industrial Rigging | Badass Logistics`,
    quoteFactors:['The load: weight, dimensions, and center of gravity','The method: skates and jacks, gantry, forklift, or crane — and who supplies the crane','Site access, headroom, floor ratings, and any street or site closures','Crew size and schedule, including nights and weekends around production','Setting, leveling, and anchoring at the final position'],
    pillarFile:'services/rigging.html', sentinel:'RIG_METROS', cardNoun:'riggers',
  },
};

// Per-service internal links to the highest-value blog "movers" (from GSC: pages already
// pulling impressions on page 3-9). Every city page funnels authority to these → pushes them up.
const CITY_GUIDES = {
  'rigging': [['types-of-rigging','Types of Rigging, Explained'],['what-is-a-critical-lift','What Is a Critical Lift?'],['how-to-move-an-mri-machine','How to Move an MRI Machine'],['how-to-move-a-cnc-machine','How to Move a CNC Machine']],
  'cnc-machine-movers': [['how-to-move-a-cnc-machine','How to Move a CNC Machine'],['machine-leveling-and-alignment','Machine Leveling &amp; Alignment'],['how-to-move-a-lathe','How to Move a Metal Lathe']],
  'machinery-moving': [['how-much-do-machinery-movers-cost','How Much Do Machinery Movers Cost?'],['machine-leveling-and-alignment','Machine Leveling &amp; Alignment'],['how-to-move-an-mri-machine','How to Move an MRI Machine']],
  'plant-relocation': [['plant-relocation-checklist','The Plant Relocation Checklist'],['blocking-bracing-and-dunnage-explained','Blocking, Bracing &amp; Dunnage Explained'],['machine-leveling-and-alignment','Machine Leveling &amp; Alignment']],
};

// ---------- SIBLING-SERVICE MESH ----------
// Every city has 5 service pages, and until now none of them linked to each other —
// 440 city pages × 4 siblings = 1,760 contextual internal links that simply didn't exist.
// Each page was an island: it linked UP to its pillar and state hub, but never sideways to
// the same crew's other work in the same metro. GSC shows the cost of that — Savannah rigging
// (pos 25.7) and Savannah machinery-moving (pos 26.7) were competing alone instead of
// reinforcing each other on the exact same local intent.
//
// `pitch` is written from the perspective of a *different* service page in the same city,
// so the link reads as a genuine next step rather than a footer dump. Anchors rotate by a
// stable per-city hash so 440 pages don't ship one identical anchor-text pattern.
const CROSS = {
  'rigging': {
    short:'Industrial Rigging', noun:'riggers',
    pitch:(c)=>`Machine has to come off the floor, through the door, or onto a pad before it travels? That's the rigging side of the same ${c} crew.`,
    anchors:(c)=>[`industrial rigging in ${c}`,`${c} riggers`,`rigging contractors in ${c}`,`${c} industrial rigging`],
  },
  'machinery-moving': {
    short:'Machinery Movers', noun:'machinery movers',
    pitch:(c)=>`Presses, compressors, generators, full production lines — disconnected, rigged, hauled, and re-leveled across ${c} as one accountable job.`,
    anchors:(c)=>[`machinery moving in ${c}`,`${c} machinery movers`,`industrial machinery movers in ${c}`,`${c} machinery moving company`],
  },
  'cnc-machine-movers': {
    short:'CNC Machine Movers', noun:'CNC movers',
    pitch:(c)=>`Machine tools are instruments, not freight. VMCs, lathes, and grinders moved on air-ride and squared back to the builder's spec in ${c}.`,
    anchors:(c)=>[`CNC machine movers in ${c}`,`${c} CNC machine moving`,`machine tool movers in ${c}`,`${c} CNC movers`],
  },
  'plant-relocation': {
    short:'Plant Relocation', noun:'plant relocation',
    pitch:(c)=>`Moving the whole floor instead of one machine? Phased teardown, sequenced loads, and reinstallation planning for ${c} plants.`,
    anchors:(c)=>[`plant relocation in ${c}`,`${c} plant &amp; factory relocation`,`factory relocation in ${c}`,`${c} plant relocation`],
  },
};
const CROSS_ORDER = ['rigging','machinery-moving','cnc-machine-movers','plant-relocation'];

// Stable string hash → picks an anchor variant per (city, target service) so the mesh
// doesn't ship 440 copies of the same anchor text.
function hashPick(str, n) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % n;
}

function siblingMesh(serviceSlug, svc, city, slug) {
  const sibs = CROSS_ORDER.filter(s => s !== serviceSlug);
  const cards = sibs.map(s => {
    const x = CROSS[s];
    const variants = x.anchors(city);
    const anchor = variants[hashPick(slug + s, variants.length)];
    return `    <a class="svc-card" href="/services/${s}/${slug}"><div class="num">// also in ${city}</div><h3>${x.short}</h3><p>${x.pitch(city)}</p><span class="more">${anchor} &rarr;</span></a>`;
  }).join('\n');
  const inline = sibs.map(s =>
    `<a href="/services/${s}/${slug}" style="color:var(--yellow-deep);text-decoration:underline;">${CROSS[s].noun}</a>`
  );
  const inlineList = inline.slice(0, -1).join(', ') + ', and ' + inline[inline.length - 1];
  return `
<section><div class="wrap">
  <span class="section-tag hand">same crew, same city</span>
  <h2 class="section-title">Other heavy work we do in ${city}</h2>
  <p class="section-intro">Most ${city} jobs don't stop at one service. The crew that rigs a machine out is the crew that manages the move and sets it back down — so you're dealing with one company from the disconnect to the re-level, not three subcontractors pointing at each other.</p>
  <div class="grid-services" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));margin-top:22px;">
${cards}
  </div>
  <p style="margin-top:22px;font-weight:600;">In ${city} we also run ${inlineList}, plus <a href="/services/project-freight" style="color:var(--yellow-deep);text-decoration:underline;">project freight</a> for the jobs we rig &mdash; or see <a href="/locations/${slug}" style="color:var(--yellow-deep);text-decoration:underline;">every service we offer in ${city}</a>.</p>
</div></section>`;
}


// ---------- INDUSTRY PROFILES (per-metro uniqueness from the metro's real industrial base) ----------
// Keyed off industryPhrase(). General, accurate equipment lists — no invented local facts.
const INDUSTRY_PROFILE = {
  'automotive and tool-and-die': { eq: ['Stamping and transfer presses', 'Die sets and tool-and-die equipment', 'Robotic weld and assembly cells', 'CMMs and inspection equipment', 'Conveyor and body-shop lines', 'Injection molding machines'], why: 'Press pits, heavy die weights, and short retooling windows during model changeovers decide how these moves are planned.' },
  'semiconductor and precision-tool': { eq: ['Process and metrology tools', 'Sub-fab pumps and abatement units', 'Cleanroom air handlers and chillers', 'Precision machining centers', 'Test and inspection systems', 'Vibration-isolated instruments'], why: 'Cleanroom protocol, decontamination sign-off, and tight shock and tilt limits drive the rigging plan.' },
  'aerospace and defense': { eq: ['Large 5-axis machining centers', 'Autoclaves and composite ovens', 'Test cells and test stands', 'Tooling fixtures and jigs', 'CMMs and inspection equipment', 'Paint and finishing systems'], why: 'Large machine envelopes, documentation expectations, and secure-site access rules shape every move.' },
  'energy and petrochemical': { eq: ['Compressors and pump skids', 'Heat exchangers and vessels', 'Transformers and switchgear', 'Generators and turbines', 'Process skids and modules', 'Control buildings and e-houses'], why: 'Turnaround windows, site safety rules, and heavy concentrated loads on process pads set the schedule.' },
  'steel and metal-fabrication': { eq: ['Press brakes and shears', 'Laser, plasma, and waterjet tables', 'Rolling and forming equipment', 'Furnaces and heat-treat equipment', 'Welding and cutting cells', 'Overhead-crane-served production lines'], why: 'Very concentrated floor loads and moves inside running mills and shops shape how these jobs are rigged.' },
  'ag-equipment and food-processing': { eq: ['Processing and cooking lines', 'Fillers and packaging lines', 'Industrial ovens and fryers', 'Freezers and refrigeration equipment', 'Stainless tanks and mixers', 'Palletizers and conveyors'], why: 'Sanitary handling, washdown areas, and short plant shutdown windows drive the plan.' },
  'pharma and medical-device': { eq: ['Cleanroom production equipment', 'Bioreactors and process vessels', 'Fill-finish lines', 'Autoclaves and sterilizers', 'Lab and analytical instruments', 'Molding and assembly equipment'], why: 'Validated spaces, cleanroom rules, and equipment that has to be requalified after the move shape every job.' },
  'process-industry': { eq: ['Extruders and calenders', 'Converting and laminating lines', 'Mixers and reactors', 'Molding presses', 'Dryers and ovens', 'Winders and slitters'], why: 'Long interconnected lines have to come apart and go back together in the right order and alignment.' },
  'distribution and manufacturing': { eq: ['Conveyor and sortation systems', 'Pallet racking and mezzanines', 'Automated storage and retrieval equipment', 'Compressors and plant utilities', 'Packaging and palletizing lines', 'Production machinery'], why: 'Most work happens around live distribution and production operations that can\'t stop for the move.' },
  'manufacturing': { eq: ['CNC machining centers', 'Presses and press brakes', 'Injection molding machines', 'Compressors and plant utilities', 'Production and assembly lines', 'Paint and finishing systems'], why: 'Keeping the rest of production running while machines move is usually the hardest part of the plan.' },
};
function industrySection(svc, c) {
  const prof = INDUSTRY_PROFILE[c.angle] || INDUSTRY_PROFILE['manufacturing'];
  const lead = c.metro && c.metro.industry ? `${c.city}'s industrial base — ${c.metro.industry} —` : `${c.city}'s ${c.angle} base`;
  return `
<section class="notes-bg">
  <span class="bgnote" style="top:10%;right:4%;transform:rotate(-4deg)">${c.angle.split(' ')[0].toUpperCase()} ✓</span>
  <div class="wrap">
  <span class="section-tag hand">${c.angle} equipment</span>
  <h2 class="section-title">Equipment we rig for ${c.city}'s ${c.angle} plants</h2>
  <p class="section-intro">${lead} runs on equipment that doesn't move like freight. ${prof.why} Typical ${svc.coverageNoun.toLowerCase()} for ${c.city} customers include:</p>
  <div class="chip-row">${prof.eq.map(e => `<span>${e}</span>`).join('')}</div>
</div></section>`;
}

// ---------- EVERY TYPE OF RIGGING (links money pages to every specialty page) ----------
// Competitor city pages that win "near me" SERPs link 9+ same-city specialties.
// We don't build city variants of every specialty (scaled-content risk), so each
// city page links the national specialty pages with city-framed context instead.
const { inFamily } = require('./lib/taxonomy');
const RIG_TYPE_PITCH = {
  'machinery-moving': 'presses, machine tools, and production equipment',
  'plant-relocation': 'whole floors, lines, and multi-site consolidations',
  'machinery-removal': 'retired machines, plant closures, and lease exits',
  'mri-medical-equipment-rigging': 'MRI, CT, and imaging systems for hospitals',
  'lab-equipment-movers': 'microscopes, NMR, and semiconductor tools',
  'cnc-machine-movers': 'VMCs, lathes, grinders, and machine shops',
  'printing-press-movers': 'offset, web, digital presses, and bindery',
  'crane-services': 'planned crane picks and critical lifts',
  'heavy-lift-rigging': 'gantries, jacking, and skidding where cranes can\'t reach',
  'millwright-services': 'installation, leveling, alignment, conveyors',
  'forklift-loading-unloading': 'load-outs, container unloads, dock-less deliveries',
  'data-center-rigging': 'generators, UPS, switchgear, and racks',
  'hvac-chiller-rigging': 'chillers, boilers, rooftop units, cooling towers',
  'transformer-generator-rigging': 'transformers, gensets, and switchgear',
};
function rigTypes(serviceSlug, city, CS) {
  const items = inFamily('rigging').filter(x => x.slug !== 'rigging' && x.slug !== serviceSlug);
  return `
<section class="notes-bg">
  <span class="bgnote" style="top:8%;right:4%;transform:rotate(-4deg)">EVERY KIND OF RIG</span>
  <div class="wrap">
  <span class="section-tag hand">every type of rigging</span>
  <h2 class="section-title">More rigging we do in ${city}</h2>
  <p class="section-intro">The same ${city} crews handle every kind of industrial rigging. If your job looks more like one of these, start here:</p>
  <div class="type-grid">
${items.map(x => `    <a href="/services/${x.slug}"><span class="k">// ${RIG_TYPE_PITCH[x.slug] || x.short.toLowerCase()}</span><h3>${x.label}</h3></a>`).join('\n')}
  </div>
  <p style="margin-top:20px;font-weight:600;">Running a trucking fleet out of ${city}? See <a href="/services/truck-dispatch" style="color:var(--yellow-deep);text-decoration:underline;">truck dispatch for fleets of 4+ trucks</a>.</p>
</div></section>`;
}

function page(serviceSlug, svc, loc, metro, hubStates) {
  const { city, state } = loc;
  const CS = `${city}, ${state}`;
  const slug = citySlug(city, state);
  const c = { city, state, CS, stName: stateName(state), ix: interstatesOf(state), angle: industryPhrase(metro && metro.industry), metro };
  const stSlug = c.stName.toLowerCase().replace(/[^a-z0-9]+/g,'-');
  const hasHub = hubStates && hubStates.has(state);
  const near = (loc.near || []).slice(0, 12);
  // Other metros in the same state — real city→city internal links (hub-and-spoke mesh)
  const nearbyMetros = locations.filter(l => l.state === state && l.city !== city).slice(0, 8);
  const url = `${DOMAIN}/services/${serviceSlug}/${slug}`;
  const cityHub = `/locations/${slug}`;
  const mapQ = encodeURIComponent(CS);
  const title = svc.titleFn ? svc.titleFn(CS) : `${svc.name} in ${CS} | Badass Logistics`;
  // Keep under ~155 chars so Google doesn't truncate mid-sentence, and don't
  // repeat svc.name/svc.serviceType back-to-back (they're identical for several
  // services, which produced a stuttering snippet on 87 pages).
  const desc = `${svc.name} in ${CS} — surveyed, rigged, moved, and re-leveled to spec by one accountable crew. Same-day quotes: (307) 284-1332.`;
  const svcSchema = {"@context":"https://schema.org","@type":"Service","serviceType":svc.serviceType,"areaServed":{"@type":"City","name":CS},"provider":{"@type":"LocalBusiness","@id":`${DOMAIN}/#organization`,"name":site.brand,"telephone":"+1-307-284-1332","url":`${DOMAIN}/`},"description":`${site.brand} provides ${svc.serviceType.toLowerCase()} across ${CS} and the surrounding metro.`};
  const bcItems = [{"@type":"ListItem","position":1,"name":"Home","item":`${DOMAIN}/`},{"@type":"ListItem","position":2,"name":svc.name,"item":`${DOMAIN}/services/${serviceSlug}`}];
  if (hasHub) bcItems.push({"@type":"ListItem","position":3,"name":c.stName,"item":`${DOMAIN}/services/${serviceSlug}/${stSlug}`});
  bcItems.push({"@type":"ListItem","position":hasHub?4:3,"name":CS,"item":url});
  const breadcrumb = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":bcItems};
  const faqPairs = svc.faq(c).slice();
  if (serviceSlug !== 'cnc-machine-movers') faqPairs.splice(2, 0, [`How much do ${svc.cardNoun} cost in ${city}?`, `There is no flat rate for ${svc.serviceType.toLowerCase()} — the price comes from the equipment, the access at both ends, the crew and gear, distance, and setting work. Send the equipment list and both sites and we'll quote your ${city} job fast, usually the same day.`]);
  const faqSchema = {"@context":"https://schema.org","@type":"FAQPage","mainEntity":faqPairs.map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a.replace(/<[^>]+>/g,'')}}))};

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#141414">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${svc.serviceType} in ${CS} — surveyed, rigged, moved, and re-leveled to spec.">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${DOMAIN}${svc.hero}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${svc.serviceType} in ${CS} — surveyed, rigged, moved, and re-leveled to spec.">
<meta name="twitter:image" content="${DOMAIN}${svc.hero}">
<link rel="sitemap" type="application/xml" href="${DOMAIN}/sitemap.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Architects+Daughter&family=Barlow:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Architects+Daughter&family=Barlow:wght@400;500;600;700&display=swap"></noscript>
<link rel="icon" href="/assets/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
<link rel="stylesheet" href="/css/styles.css">
<style>
  .map-frame { border:3px solid var(--ink); box-shadow:var(--shadow); background:var(--white); overflow:hidden; }
  .map-frame iframe { width:100%; height:380px; border:0; display:block; filter:grayscale(.15) contrast(1.05); }
  .towns { display:flex; flex-wrap:wrap; gap:10px; margin-top:24px; }
  .towns span { background:var(--white); border:2px solid var(--ink); box-shadow:3px 3px 0 var(--ink); padding:7px 14px; font-weight:600; font-size:15px; }
</style>
<script type="application/ld+json">
${JSON.stringify(svcSchema,null,2)}
</script>
<script type="application/ld+json">
${JSON.stringify(breadcrumb,null,2)}
</script>
<script type="application/ld+json">
${JSON.stringify(faqSchema,null,2)}
</script>
<link rel="preload" as="image" href="${svc.hero}" fetchpriority="high">
</head>
<body>
${NAV}

<div class="wrap breadcrumb"><a href="/">Home</a> / <a href="/services/${serviceSlug}">${svc.name}</a> / ${hasHub?`<a href="/services/${serviceSlug}/${stSlug}">${c.stName}</a> / `:``}${CS}</div>

<section class="page-hero photo" style="background-image:url('${svc.hero}')"><div class="wrap">
  <span class="section-tag hand">// ${svc.tag} — ${city.toLowerCase()}</span>
  <h1>${svc.name} in <span class="y">${CS}</span></h1>
  <p class="lead">${svc.lead(c)}</p>
  <div class="cta-row" style="margin-top:24px;"><a class="btn" href="/contact">Get a ${city} ${svc.quote} Quote</a></div>
</div>
  <span class="annot hand tag warn a1">${state} • ${c.angle.split(' ')[0].toUpperCase()}</span>
  <span class="annot hand a4">${city.toUpperCase()} ✓</span>
</section>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebPage","url":"${url}","name":"${title}","speakable":{"@type":"SpeakableSpecification","cssSelector":["h1",".answer-box"]}}
</script>
<section><div class="wrap prose">
  <div class="answer-box"><p><strong>Quick answer:</strong> ${site.brand} provides ${svc.serviceType.toLowerCase()} in ${CS} and the surrounding metro. ${svc.snippet} Our crews work across ${city} and nearby ${c.stName} metros, and moves between facilities run as project freight under the same plan — usually quoted the same day. Call (307) 284-1332.</p></div>
  <h2>${svc.introH2(c)}</h2>
  ${svc.introPs(c).map(p=>`<p>${p}</p>`).join('\n  ')}
</div></section>
${industrySection(svc, c)}

<section class="bg-paper" style="border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);"><div class="wrap">
  <span class="section-tag hand">what we move in ${city}</span>
  <h2 class="section-title">${svc.movesH2(c)}</h2>
  <div class="cap-grid">
    ${svc.moves.map(([k,h,p])=>`<div class="cap"><div class="k">${k}</div><h3>${h}</h3><p>${p} across the ${city} metro.</p></div>`).join('\n    ')}
  </div>
</div></section>

<section class="notes-bg">
  <span class="bgnote" style="top:10%;right:5%;transform:rotate(-4deg)">${c.ix.split(',')[0]} CORRIDOR</span>
  <span class="bgnote" style="bottom:12%;left:4%;transform:rotate(4deg)">CRATED &amp; STAGED ✓</span>
  <div class="wrap prose">
  <h2>When the equipment leaves ${city}</h2>
  <p>Plenty of ${city} jobs start and finish on one floor. The rest have to travel — to a new building across the metro, a sister plant down ${c.ix}, or a facility in another state. We don't hand that part off. It runs as <a href="/services/project-freight">project freight</a> inside the same plan: machines <a href="/services/crating-packing">crated or prepped</a> on site, loads sequenced to the rig-out, transport through our licensed broker and carrier partners with <a href="/services/dedicated-lanes">dedicated capacity</a> for bigger moves, and our crew waiting at the destination to set it.</p>
</div></section>

<section class="bg-paper notes-bg" style="border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);">
  <span class="bgnote" style="top:10%;right:5%;transform:rotate(-4deg)">NO FLAT RATES</span>
  <span class="bgnote" style="bottom:12%;left:4%;transform:rotate(4deg)">SAME-DAY QUOTE</span>
  <div class="wrap prose">
  <span class="section-tag hand">how we quote</span>
  <h2>How we price a ${city} ${svc.quote.toLowerCase()} job</h2>
  <p>Every ${svc.serviceType.toLowerCase()} job in ${CS} is quoted from the actual work, not a rate sheet. These are the things that move the number — send them with your request and you'll get a real quote back fast:</p>
  <ul class="checklist" style="margin-bottom:18px;">${(svc.quoteFactors||[]).map(f=>`<li><span>${f}</span></li>`).join('')}</ul>
  <p>Photos of the equipment, its nameplate, and the path out of the building save a site visit on smaller ${city} jobs. For bigger moves we walk both sites before we price anything.</p>
</div></section>
${rigTypes(serviceSlug, city, CS)}

<section><div class="wrap">
  <span class="section-tag hand">on the map</span>
  <h2 class="section-title">${svc.name} in ${city}</h2>
  <p class="section-intro">Working throughout ${CS} and the surrounding metro — backed by a nationwide network of 88 locations when a move crosses state lines.</p>
  <div class="map-frame" style="margin-top:24px;">
    <iframe loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${CS} ${svc.name} map" src="https://maps.google.com/maps?q=${mapQ}&z=10&output=embed"></iframe>
  </div>
</div></section>

${near.length ? `<section class="notes-bg bg-paper" style="border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);">
  <span class="bgnote" style="top:10%;right:5%;transform:rotate(-4deg)">${state}</span>
  <span class="bgnote" style="bottom:10%;left:4%;transform:rotate(4deg)">NEAREST CREW →</span>
  <div class="wrap">
  <span class="section-tag hand">metro coverage</span>
  <h2 class="section-title">${svc.coverageNoun} near ${city}</h2>
  <p class="section-intro">Service throughout ${city} and the surrounding manufacturing suburbs — including:</p>
  <div class="towns">${near.map(t=>`<span>${t}</span>`).join('')}</div>
  <p style="margin-top:22px;font-weight:600;">Moving across the metro or out of state? See <a href="${cityHub}" style="color:var(--yellow-deep);text-decoration:underline;">all our ${city} services</a>${hasHub?`, <a href="/services/${serviceSlug}/${stSlug}" style="color:var(--yellow-deep);text-decoration:underline;">${svc.name} across ${c.stName}</a>`:``} or <a href="/contact" style="color:var(--yellow-deep);text-decoration:underline;">get a quote</a>.</p>
</div></section>` : ''}
${nearbyMetros.length ? `
<section class="bg-paper" style="border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);"><div class="wrap">
  <span class="section-tag hand">more ${c.stName} coverage</span>
  <h2 class="section-title">${svc.name} across ${c.stName}</h2>
  <p class="section-intro">We run ${svc.serviceType.toLowerCase()} in metros across ${c.stName} — pick the nearest crew:</p>
  <div class="grid-services" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin-top:22px;">
    ${nearbyMetros.map(m=>`<a class="svc-card" href="/services/${serviceSlug}/${citySlug(m.city,m.state)}"><div class="num">// ${m.state}</div><h3>${m.city}</h3><span class="more">${m.city} ${svc.cardNoun} →</span></a>`).join('\n    ')}
  </div>${hasHub?`
  <p style="margin-top:22px;font-weight:600;"><a href="/services/${serviceSlug}/${stSlug}" style="color:var(--yellow-deep);text-decoration:underline;">See all ${svc.name} across ${c.stName} →</a></p>`:``}
</div></section>` : ''}
${siblingMesh(serviceSlug, svc, city, slug)}

<section class="bg-paper" style="border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);"><div class="wrap">
  <span class="section-tag hand">questions</span>
  <h2 class="section-title">${city} ${svc.quote} FAQ</h2>
  <div class="faq">
    ${faqPairs.map(([q,a],i)=>`<details${i===0?' open':''}><summary>${q}</summary><div class="a">${a}</div></details>`).join('\n    ')}
  </div>
</div></section>
${(CITY_GUIDES[serviceSlug]||[]).length ? `
<section><div class="wrap">
  <span class="section-tag hand">field guides</span>
  <h2 class="section-title">Before you move in ${city}</h2>
  <div class="grid-services" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
    ${(CITY_GUIDES[serviceSlug]||[]).map(([g,t])=>`<a class="svc-card" href="/blog/${g}"><div class="num">// field guide</div><h3>${t}</h3><span class="more">Read the guide →</span></a>`).join('\n    ')}
  </div>
</div></section>` : ''}

<div class="photo-band" style="background-image:url('${svc.band}')">
  <span class="annot hand tag a1">${city.toUpperCase()} ✓</span>
  <span class="annot hand a6">ON SCHEDULE</span>
</div>

<div class="cta-band"><div class="wrap" style="padding-top:56px;padding-bottom:56px;text-align:center;">
  <h2>Need ${svc.name.toLowerCase()} in ${city}?</h2>
  <p>Tell us what's moving and where. We'll route the nearest crew and quote it fast.</p>
  <a class="btn dark" href="/contact">Get a ${city} ${svc.quote} Quote</a>
</div></div>
${FOOTER_FOR(`services/${serviceSlug}/${slug}.html`)}

</body>
</html>`;
}

// ---------- STATE HUB page (rolls up a state's city pages) ----------
function statePage(serviceSlug, svc, st, cityMs) {
  const stName = stateName(st), ix = interstatesOf(st);
  const stSlug = stName.toLowerCase().replace(/[^a-z0-9]+/g,'-');
  const url = `${DOMAIN}/services/${serviceSlug}/${stSlug}`;
  const cities = cityMs.slice().sort((a,b)=>a.city.localeCompare(b.city));
  const names = cities.map(m=>m.city);
  const nameList = names.length>1 ? names.slice(0,-1).join(', ')+', and '+names.slice(-1) : names[0];
  const title = `${svc.name} in ${stName} | Badass Logistics`;
  // No phone here — the city list already eats the character budget and these
  // ran past 160 (truncated) with it.
  const desc = `${svc.name} across ${stName} — ${names.slice(0,3).join(', ')} and metros statewide. Rigged, moved, and re-leveled to spec. Same-day quotes.`;
  const svcSchema = {"@context":"https://schema.org","@type":"Service","serviceType":svc.serviceType,"areaServed":{"@type":"State","name":stName},"provider":{"@type":"LocalBusiness","@id":`${DOMAIN}/#organization`,"name":site.brand,"telephone":"+1-307-284-1332","url":`${DOMAIN}/`},"description":`${site.brand} provides ${svc.serviceType.toLowerCase()} across ${stName}.`};
  const breadcrumb = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":`${DOMAIN}/`},{"@type":"ListItem","position":2,"name":svc.name,"item":`${DOMAIN}/services/${serviceSlug}`},{"@type":"ListItem","position":3,"name":stName,"item":url}]};
  const faqPairs = [
    [`Do you provide ${svc.name.toLowerCase()} across ${stName}?`,`Yes — ${svc.serviceType.toLowerCase()} in ${nameList} and metros throughout ${stName}, backed by a nationwide network of 88 locations. <a href="/contact">Get a quote →</a>`],
    [`Which ${stName} cities do you cover?`,`We run ${svc.tag} in ${nameList}, and reach the rest of ${stName} through our nationwide network. Pick your metro below for a local page.`],
    [`Can you move equipment between ${stName} facilities?`,`Yes — equipment is rigged out, crated or prepped, moved as project freight through our licensed broker and carrier partners, and set by the same crew at the destination.`],
  ];
  const faqSchema = {"@context":"https://schema.org","@type":"FAQPage","mainEntity":faqPairs.map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a.replace(/<[^>]+>/g,'')}}))};
  const cards = cities.map(m=>`    <a class="svc-card" href="${m.url.split('/').pop()}"><div class="num">// ${st}</div><h3>${m.city}, ${st}</h3><p>${svc.name} in ${m.city}</p><span class="more">${m.city} ${svc.cardNoun}</span></a>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#141414">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${svc.serviceType} across ${stName} — surveyed, rigged, and re-leveled to spec.">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${DOMAIN}${svc.hero}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${DOMAIN}${svc.hero}">
<link rel="sitemap" type="application/xml" href="${DOMAIN}/sitemap.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Architects+Daughter&family=Barlow:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Architects+Daughter&family=Barlow:wght@400;500;600;700&display=swap"></noscript>
<link rel="icon" href="/assets/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
<link rel="stylesheet" href="/css/styles.css">
<script type="application/ld+json">
${JSON.stringify(svcSchema,null,2)}
</script>
<script type="application/ld+json">
${JSON.stringify(breadcrumb,null,2)}
</script>
<script type="application/ld+json">
${JSON.stringify(faqSchema,null,2)}
</script>
<link rel="preload" as="image" href="${svc.hero}" fetchpriority="high">
</head>
<body>
${NAV}

<div class="wrap breadcrumb"><a href="/">Home</a> / <a href="/services/${serviceSlug}">${svc.name}</a> / ${stName}</div>

<section class="page-hero photo" style="background-image:url('${svc.hero}')"><div class="wrap">
  <span class="section-tag hand">// ${svc.tag} — ${stName.toLowerCase()}</span>
  <h1>${svc.name} in <span class="y">${stName}</span></h1>
  <p class="lead">${svc.serviceType} across ${stName} — from ${names.slice(0,3).join(', ')} to metros statewide. One accountable crew surveys it, rigs it, manages the move, and sets it to spec.</p>
  <div class="cta-row" style="margin-top:24px;"><a class="btn" href="/contact">Get a ${stName} ${svc.quote} Quote</a></div>
</div>
  <span class="annot hand tag warn a1">${stName.toUpperCase()}</span>
  <span class="annot hand a4">${cities.length} METROS ✓</span>
</section>

<section><div class="wrap prose">
  <h2>${svc.serviceType} statewide in ${stName}</h2>
  <p>${stName}'s industrial base runs on machines that have to move — presses, machining centers, production lines, and the plants that house them. Badass Logistics provides ${svc.serviceType.toLowerCase()} in ${nameList}, and reaches every other corner of ${stName} through a nationwide network of 88 locations. One crew plans the lift, protects the floors, and sets the load to spec — and when equipment has to travel, the same team runs it as <a href="/services/project-freight">project freight</a>, so a ${stName} move never gets passed between a rigger, a trucking company, and an installer.</p>
  <p>Work across ${stName} runs the ${ix} corridors between its industrial metros. Single machines, production lines, and full plant relocations all start the same way: a site survey, a documented plan, and a schedule built around your production calendar — then <a href="/services/rigging">rigging</a>, the move, and the reset handled by one crew.</p>
</div></section>

<section class="bg-paper" style="border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);"><div class="wrap">
  <span class="section-tag hand">${svc.tag} by metro</span>
  <h2 class="section-title">${svc.name} across ${stName}</h2>
  <p class="section-intro">Local pages for the ${stName} metros we serve — pick yours for city-specific coverage, or <a href="/contact">get a quote</a> for anywhere in the state.</p>
  <div class="grid-services" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));">
${cards}
  </div>
</div></section>

<section class="notes-bg"><div class="wrap">
  <span class="section-tag hand">questions</span>
  <h2 class="section-title">${stName} ${svc.quote} FAQ</h2>
  <div class="faq">
    ${faqPairs.map(([q,a],i)=>`<details${i===0?' open':''}><summary>${q}</summary><div class="a">${a}</div></details>`).join('\n    ')}
  </div>
</div></section>

<div class="cta-band"><div class="wrap" style="padding-top:56px;padding-bottom:56px;text-align:center;">
  <h2>Need ${svc.name.toLowerCase()} in ${stName}?</h2>
  <p>Tell us what's moving and where. We'll route the nearest crew and quote it fast.</p>
  <a class="btn dark" href="/contact">Get a ${stName} ${svc.quote} Quote</a>
</div></div>
${FOOTER_FOR(`services/${serviceSlug}/${stSlug}.html`)}

</body>
</html>`;
}

// ---------- WAVES (which service × which metros) ----------
const TOP24 = ALL_KEYS.slice(); // ordered by locations.json; we slice per-service below
const WAVES = {
  'rigging': 'ALL',
  'cnc-machine-movers': 'ALL',
  'machinery-moving': 'ALL',
  'plant-relocation':  'ALL',
};

// ---------- build ----------
const manifest = [];
for (const [serviceSlug, wave] of Object.entries(WAVES)) {
  const svc = SERVICES[serviceSlug];
  const keys = wave === 'ALL' ? ALL_KEYS : wave;
  const stateCounts = {};
  keys.forEach(k => { const l = locByKey[k]; if (l) stateCounts[l.state] = (stateCounts[l.state]||0)+1; });
  const hubStates = new Set(Object.entries(stateCounts).filter(([,n])=>n>=2).map(([s])=>s));
  const outDir = path.join(ROOT, 'services', serviceSlug);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const built = [];
  for (const key of keys) {
    const loc = locByKey[key];
    if (!loc) { console.warn(`  ! skip ${key} (${serviceSlug}) — not in locations.json`); continue; }
    const slug = citySlug(loc.city, loc.state);
    fs.writeFileSync(path.join(outDir, `${slug}.html`), page(serviceSlug, svc, loc, metroByKey[key], hubStates));
    built.push(loc);
    manifest.push({ service: serviceSlug, city: loc.city, state: loc.state, url: `/services/${serviceSlug}/${slug}` });
  }
  // pillar metro grid (sentinels)
  const pillarPath = path.join(ROOT, svc.pillarFile);
  if (fs.existsSync(pillarPath)) {
    let p = fs.readFileSync(pillarPath, 'utf8');
    const cards = built.map(l => {
      const slug = citySlug(l.city, l.state);
      return `    <a class="svc-card" href="${serviceSlug}/${slug}"><div class="num">// ${l.state}</div><h3>${l.city}, ${l.state}</h3><p>${(l.near||[]).slice(0,3).join(' · ')}</p><span class="more">${l.city} ${svc.cardNoun}</span></a>`;
    }).join('\n');
    const S = `<!--${svc.sentinel}_START-->`, E = `<!--${svc.sentinel}_END-->`;
    if (p.includes(S) && p.includes(E)) {
      p = p.replace(new RegExp(`${S}[\\s\\S]*?${E}`), `${S}\n${cards}\n  ${E}`);
      fs.writeFileSync(pillarPath, p);
    }
  }
}

// ---------- STATE HUBS (roll-up: /services/<svc>/<state>) ----------
const stateManifest = [];
const byServiceState = {};
manifest.forEach(m => { (byServiceState[m.service] = byServiceState[m.service] || {})[m.state] = (byServiceState[m.service][m.state] || []).concat(m); });
for (const [serviceSlug, states] of Object.entries(byServiceState)) {
  const svc = SERVICES[serviceSlug];
  const outDir = path.join(ROOT, 'services', serviceSlug);
  for (const [st, cityMs] of Object.entries(states)) {
    if (cityMs.length < 2) continue;
    const stSlug = stateName(st).toLowerCase().replace(/[^a-z0-9]+/g,'-');
    fs.writeFileSync(path.join(outDir, `${stSlug}.html`), statePage(serviceSlug, svc, st, cityMs));
    stateManifest.push({ service: serviceSlug, state: st, url: `/services/${serviceSlug}/${stSlug}` });
  }
}
console.log(`✓ Built ${stateManifest.length} service×state hub pages`);

fs.writeFileSync(path.join(ROOT, 'data/service-cities.json'), JSON.stringify(manifest, null, 2) + '\n');

// sitemap.xml is written by build-sitemap.js from what's on disk.

const byService = manifest.reduce((a,m)=>{a[m.service]=(a[m.service]||0)+1;return a;},{});
console.log(`✓ Built ${manifest.length} service×city pages:`, JSON.stringify(byService));
console.log(`✓ Updated pillar grids + data/service-cities.json`);
