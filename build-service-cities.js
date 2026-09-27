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

   Add a service: add a SERVICES{} block + an entry in lib/waves.js. ('ALL' = all 88.)
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

const { STATE, stateName, interstatesOf } = require('./lib/states');
const citySlug = (city, st) => `${city.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}-${st.toLowerCase()}`;
const locByKey = {}; locations.forEach(l => { locByKey[`${l.city}|${l.state}`] = l; });
// The `detail` block in data/metros.json carries the researched per-metro
// substance (sectors, corridors, rail, port, stock, equipment) that the matrix
// differentiation work added. It is kept separate from the `metros` table so
// that table stays a readable one-line-per-metro index; merge it in here so the
// rest of the generator sees one metro object. A metro with no detail entry is
// unchanged.
const metroDetail = metrosFile.detail || {};
const metroByKey = {}; metrosFile.metros.forEach(m => { const k = `${m.city}|${m.state}`; metroByKey[k] = Object.assign({}, m, metroDetail[k] || {}); });
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
const PLACES = require('./lib/places');
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
    descFn:(CS)=>`CNC machine movers in ${CS} — machine tool moving for single machines, cells and full shops, re-leveled to the builder's spec. Same-day quotes.`,
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
    // "Heavy Equipment Moving" was retired as a service name on 2026-09-18
    // (it reads as heavy haul) but survived here because check-content.js only
    // lints content/services, not this generator. "Machinery moving company"
    // replaces it and carries real demand: 236 impressions across Savannah and
    // Charleston alone at position 23-24, 90d to 2026-09-18.
    titleFn:(CS)=>`Machinery Moving Company in ${CS} | Badass Logistics`,
    descFn:(CS)=>`Machinery movers in ${CS} — a machinery moving company that disconnects, rigs, hauls and re-levels as one job. Same-day quotes: (307) 284-1332.`,
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
    descFn:(CS)=>`Factory and plant relocation in ${CS} — lines moved in phases so the floor keeps running. Teardown, transport, reinstall, leveling. Same-day quotes.`,
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
      [`Are you a rigging contractor or a machinery mover?`,`Both, and on a ${c.city} job they are one scope rather than two vendors. Rigging contractors plan and execute the lift; machinery movers own the equipment end to end. Our riggers survey the job, size the gear, make the pick, then set and level the machine — so there is no handoff between a crane crew and whoever moves it afterward. <a href="/blog/crane-rental-vs-rigging-company">Crane rental vs a rigging company →</a>`],
    ],
    // "rigging contractors" pulled 358 impressions at position 26.5 with zero
    // clicks over 90d and the word appeared nowhere on the site; "riggers"
    // another 233. The terms we already used ranked best (industrial rigging
    // 15.0, rigging company 20.6), so this keeps those and adds the miss.
    titleFn:(CS)=>`Rigging Company & Contractors in ${CS} | Badass Logistics`,
    descFn:(CS)=>`Rigging contractors in ${CS} — industrial riggers for machine setting, crane and gantry lifts, jacking and skidding. One crew. Same-day quotes.`,
    quoteFactors:['The load: weight, dimensions, and center of gravity','The method: skates and jacks, gantry, forklift, or crane — and who supplies the crane','Site access, headroom, floor ratings, and any street or site closures','Crew size and schedule, including nights and weekends around production','Setting, leveling, and anchoring at the final position'],
    pillarFile:'services/rigging.html', sentinel:'RIG_METROS', cardNoun:'riggers',
  },

  // ---------- WAVE 2 (2026-09-27) — seo/geo-architecture-plan.md §4 ----------
  // Volume-led: millwright 320/mo, crane-and-rigging 1,600/mo, plus the
  // machinery-removal SERP (riggers next to junk haulers) and the
  // market-validated forklift load/unload matrix. Each block is written from
  // its own job, not find-replaced from rigging — the same city must not
  // produce the same sentences on two services.

  'millwright-services': {
    name:'Millwright Services', serviceType:'Millwright & Machine Installation', hero:'/assets/img/rigging-crane.jpg', band:'/assets/img/loads/load-machine-loadout.jpg',
    tag:'millwright services', quote:'Millwright', coverageNoun:'Millwright jobs',
    snippet:`We set, anchor, level, and align industrial machinery and reassemble conveyors and lines, so equipment is handed off ready for utilities and start-up.`,
    lead:(c)=>`Getting a machine onto its pad in ${c.city} is rigging. Getting it to run true is millwright work — set on its anchors, leveled to the builder's spec, shafts and couplings aligned, and the line put back together in order. Across the ${c.city} metro, the crew that moved it is the crew that makes it ready to run.`,
    introH2:(c)=>`Millwright services in ${c.CS}`,
    introPs:(c)=>[
      `A machine that arrives in one piece can still fail on start-up. A soft foot, a coupling a few thousandths out, a conveyor transfer that sits proud of the next section — those are installation faults, not transport faults, and they show up as vibration, bearing wear, and scrap. ${c.metro?`In ${c.city}'s ${c.metro.industry} plants`:`On ${c.city} production floors`}, that is the work a millwright is there to prevent.`,
      `Badass Logistics sets equipment on baseplates and foundations, positions anchor bolts, chocks, and shim packs to the layout, levels to the builder's spec with precision and optical tools, and aligns motors, pumps, and gearboxes by laser or dial indicator. Electrical, piping, and grouting stay with the trades that own them — we sequence around them. When the machine is new, it can arrive as <a href="/services/project-freight">project freight</a>; when it is being relocated, <a href="/services/machinery-moving">the move</a> and the installation are one job.`,
    ],
    movesH2:(c)=>`Millwright work we do in ${c.city}`,
    moves:[['setting','Setting &amp; Anchoring','Equipment set on baseplates and foundations, anchors and shim packs positioned to the layout'],['leveling','Precision Leveling','Machines leveled to the builder\'s installation spec'],['alignment','Shaft &amp; Coupling Alignment','Motors, pumps, gearboxes, and driven equipment aligned by laser or dial indicator'],['lines','Conveyor &amp; Line Assembly','Conveyor sections, transfers, and production lines reassembled in order']],
    faq:(c)=>[
      [`Do you provide millwright services in ${c.city}?`,`Yes — machine setting, anchoring, precision leveling, shaft alignment, and conveyor and line installation throughout ${c.CS} and the surrounding metro, serving its ${c.angle} base. <a href="/contact">Get a quote →</a>`],
      [`What's the difference between a rigger and a millwright?`,`A rigger gets the load to its position. A millwright makes it run right once it's there — leveling, alignment, anchoring, and reassembly. On a ${c.city} job we do both, so there is no handoff between the crew that moved it and the crew that installs it. <a href="/blog/what-is-a-millwright">What is a millwright? →</a>`],
      [`Do you install new equipment or only machines you moved?`,`Both. New equipment arriving from the builder can be received, set, and leveled, and relocated machines are reinstalled to the same spec they left.`],
      [`Do you handle grouting and electrical hookups?`,`Grouting, electrical, controls, and piping are done by the trades or OEM that own them. We set and level the machine ready for their work and sequence the job around them.`],
    ],
    titleFn:(CS)=>`Millwright Services in ${CS} | Badass Logistics`,
    descFn:(CS)=>`Millwright services in ${CS} — machine installation, setting, anchoring, precision leveling and shaft alignment, and line reassembly. Same-day quotes.`,
    quoteFactors:['What is being installed, and the builder\'s installation and leveling spec','Foundation or baseplate status — new pour, existing pad, or anchors to relocate','Alignment scope: how many drive trains, couplings, and transfers','Which trades and OEM technicians have to be sequenced in','Whether we also rig and move the equipment to the pad'],
    pillarFile:'services/millwright-services.html', sentinel:'MW_METROS', cardNoun:'millwrights',
  },

  'machinery-removal': {
    name:'Machinery Removal', serviceType:'Machinery Removal & Decommissioning', hero:'/assets/img/loads/load-pallet-racking.jpg', band:'/assets/img/warehouse-loadout.jpg',
    tag:'machinery removal', quote:'Removal', coverageNoun:'Removal jobs',
    snippet:`We disconnect, rig out, and remove retired machines, production lines, and whole plants — sequenced around buyers, relocation loads, and scrap so the floor is handed back clean.`,
    lead:(c)=>`Getting an old machine out of a ${c.city} plant is often harder than the day it went in — the building grew around it, the door got smaller, and nobody labeled the utilities. We rig out retired machines, production lines, and whole plants across the ${c.city} metro, and hand the floor back ready for what comes next.`,
    introH2:(c)=>`Machinery removal in ${c.CS}`,
    introPs:(c)=>[
      `Removal is not junk hauling. A machine being sold has to reach its buyer working; one being scrapped still has to come out without damaging the building, the machines staying behind, or the people around it. ${c.metro?`Across ${c.city}'s ${c.metro.industry} base`:`Across the ${c.city} metro`}, most removals are one of three things — a single machine being replaced, a line being retired, or a whole floor coming out for a closure or lease exit.`,
      `Badass Logistics coordinates lockout with your maintenance team or licensed trades, tags every asset, drains and secures what has to be drained, splits what won't fit the opening, and sequences the load-out so nothing blocks the dock. Resale units are prepped and loaded for the buyer, relocation units run as <a href="/services/project-freight">project freight</a> through our licensed broker and carrier partners, and when the rest of the plant is moving too, it becomes a <a href="/services/plant-relocation">plant relocation</a>.`,
    ],
    movesH2:(c)=>`What we remove in ${c.city}`,
    moves:[['single machines','Machine Removal','Presses, machine tools, molding machines, and compressors disconnected and rigged out'],['lines','Line Teardown','Production lines and cells dismantled in sequence, tagged, and removed'],['closures','Plant Decommissioning','Whole-floor removal for closures, consolidations, and lease exits'],['resale','Removal for Resale','Machines prepped, protected, and loaded so the buyer receives them working']],
    faq:(c)=>[
      [`Do you do machinery removal in ${c.city}?`,`Yes — single machines, production lines, and full plant decommissioning throughout ${c.CS} and the surrounding metro, serving its ${c.angle} base. <a href="/contact">Get a quote →</a>`],
      [`Can you remove a machine we sold to a buyer?`,`Yes. We prep and protect it so it arrives working, then load it for the buyer's carrier or run the freight as part of the project through our licensed broker and carrier partners.`],
      [`What if the machine won't fit through the door?`,`It gets split at factory joints where the builder allows it, or rigged out through a wall opening or the roof. The ${c.city} site walk decides which, before anything is quoted.`],
      [`Who disconnects the power and utilities?`,`Qualified personnel — your maintenance team or licensed trades. We coordinate the lockout sequence and don't touch the machine until it's verified safe.`],
    ],
    titleFn:(CS)=>`Machinery Removal in ${CS} | Badass Logistics`,
    descFn:(CS)=>`Machinery removal in ${CS} — retired machines, production lines and plant closures disconnected, rigged out and removed. Floor left clean. Same-day quotes.`,
    quoteFactors:['The asset list, weights, and which units are resale, relocation, or scrap','The route out: doors, aisles, docks, and whether anything has to be split','Lockout, draining, and disconnect coordination with your team or trades','The deadline — lease end, closure date, or the buyer\'s pickup window','Floor make-ready: anchors cut flush, pits covered, area left clean'],
    pillarFile:'services/machinery-removal.html', sentinel:'MR_METROS', cardNoun:'machinery removal',
  },

  'crane-services': {
    name:'Crane & Rigging Services', serviceType:'Crane & Rigging Services', hero:'/assets/img/rigging-crane2.jpg', band:'/assets/img/rigging-crane.jpg',
    tag:'crane and rigging services', quote:'Crane Lift', coverageNoun:'Crane lifts',
    snippet:`We plan the lift, bring in the crane sized to the load, radius, and site, and rig, signal, and set the pick with our own crew.`,
    lead:(c)=>`Finding a crane in ${c.city} is the easy part. The hard part is the lift plan, the rigging, the ground under the outriggers, and the crew that signals the pick. We plan and rig crane lifts across the ${c.city} metro from start to finish — and bring in the right crane for the load, the radius, and the site.`,
    introH2:(c)=>`Crane and rigging services in ${c.CS}`,
    introPs:(c)=>[
      `A crane rental gets you a machine and an operator. It does not get you the load weight and center of gravity, the rigging that attaches to the right points, the ground-bearing check under the outriggers, the street or site closure, or the crew that takes the load off the hook and moves it into the building. ${c.metro?`On ${c.city}'s ${c.metro.industry} jobs`:`On ${c.city} jobs`}, those are the parts that decide whether a pick goes to plan.`,
      `Badass Logistics owns the lift, not just the hook time. We size the crane to the load and radius, write the lift plan, rig and signal the pick, and set the load — and where the crane can only reach the door or the dock, the same crew takes it the rest of the way with <a href="/services/heavy-lift-rigging">jacks, skates, and gantries</a>. <a href="/blog/crane-rental-vs-rigging-company">Crane rental vs a rigging company →</a>`,
    ],
    movesH2:(c)=>`Crane lifts we plan in ${c.city}`,
    moves:[['rooftop','Rooftop Crane-Ins','RTUs, chillers, cooling towers, and mechanical equipment picked onto roofs'],['machinery','Machine Picks','Presses and production equipment lifted on and off trucks or into buildings'],['critical','Critical &amp; Tandem Lifts','Close-to-capacity, high-value, and two-crane picks with detailed plans'],['setting','Equipment Setting','Tanks, vessels, generators, and skids placed on foundations and pads']],
    faq:(c)=>[
      [`Do you provide crane services in ${c.city}?`,`Yes — planned crane lifts, rooftop crane-ins, critical and tandem picks, and equipment setting throughout ${c.CS} and the surrounding metro, serving its ${c.angle} base. <a href="/contact">Get a quote →</a>`],
      [`Do you supply the crane for a ${c.city} lift?`,`We plan the lift and bring in the crane sized for the load, radius, and site, then rig, signal, and set the pick with our own crew — one team accountable for the whole lift.`],
      [`What makes a crane lift a critical lift?`,`Generally a pick close to the crane's rated capacity, a two-crane lift, a lift over occupied areas or live equipment, or a load that is hard to replace. Those get a more detailed plan and review. <a href="/blog/what-is-a-critical-lift">What is a critical lift? →</a>`],
      [`What if the crane can't reach inside the building?`,`The crane sets the load at the door, dock, or roof opening, and our crew moves it the rest of the way on skates, jacks, or a gantry.`],
    ],
    titleFn:(CS)=>`Crane & Rigging Services in ${CS} | Badass Logistics`,
    descFn:(CS)=>`Crane and rigging services in ${CS} — lift plans, rooftop crane-ins, critical and tandem picks, rigged and signaled by our crew. Same-day quotes.`,
    quoteFactors:['Load weight, dimensions, and center of gravity — from the nameplate or builder data','Pick radius, set height, and what is between the crane and the set point','Ground conditions and outrigger bearing, and whether mats are needed','Street, lot, or site closures and the approvals the location requires','What happens after the pick: set on a pad, or moved inside on skates'],
    pillarFile:'services/crane-services.html', sentinel:'CR_METROS', cardNoun:'crane services',
  },

  'forklift-loading-unloading': {
    name:'Machinery Loading & Unloading', serviceType:'Machinery Loading & Unloading', hero:'/assets/img/loads/palletized-equipment-curbside-unload.jpg', band:'/assets/img/warehouse-loadout.jpg',
    tag:'machinery loading and unloading', quote:'Loading', coverageNoun:'Load and unload jobs',
    snippet:`We load and unload machines, crated equipment, and containers as rigging work — weight and center of gravity verified, forklifts sized to the real load, and a crew that can take it into the building.`,
    lead:(c)=>`The riskiest minutes of a machine's trip are the ones at each end. Across the ${c.city} metro we load and unload machinery, crated equipment, and containers with high-capacity forklifts and rigging gear — weight and center of gravity checked, forks positioned, and the load secured before anything leaves the ground.`,
    introH2:(c)=>`Machinery loading and unloading in ${c.CS}`,
    introPs:(c)=>[
      `Most loading damage happens in a few seconds: forks set under the wrong point, a top-heavy machine tipped on a slope, a forklift picking a load past its rated load center. ${c.metro?`In a metro built on ${c.metro.industry}`:`Around ${c.city}`}, machines and crated equipment arrive and leave every day at buildings that were never laid out for them — no dock, a gravel lot, a container that has to be emptied from the doors inward.`,
      `Badass Logistics treats loading and unloading as rigging, not labor. We verify weight and center of gravity, size the forklift to the actual load and ground, and position and secure the load for the carrier — and when the machine has to go further than the tailgate, the crew skates it through the door and <a href="/services/millwright-services">sets it in place</a>. We don't rent forklifts; we provide the crew, the lift, and the gear as one job. <a href="/blog/forklift-vs-crane-for-machine-loading">Forklift vs crane for machine loading →</a>`,
    ],
    movesH2:(c)=>`What we load and unload in ${c.city}`,
    moves:[['load-out','Machine Load-Outs','Machines rigged out and loaded onto trucks, positioned and secured for transit'],['receiving','Equipment Receiving','Crated and skidded equipment unloaded, inspected, and staged or moved in'],['containers','Container Unloading','Heavy machines and crates pulled from containers with rollers, jacks, and forklifts'],['no dock','Dock-Less Deliveries','Heavy freight unloaded at ground level where there is no loading dock']],
    faq:(c)=>[
      [`Do you offer machinery loading and unloading in ${c.city}?`,`Yes — machine load-outs, equipment receiving, container unloads, and dock-less deliveries throughout ${c.CS} and the surrounding metro, serving its ${c.angle} base. <a href="/contact">Get a quote →</a>`],
      [`Do you rent forklifts in ${c.city}?`,`No. Loading and unloading is provided as rigging work — the crew, a forklift sized to the load, and the rigging gear together — not equipment rental.`],
      [`Can you unload heavy equipment without a loading dock?`,`Yes. We unload at ground level from open-deck and enclosed trailers with forklifts, rigging gear, or a crane, depending on the load and the site.`],
      [`Can you move the equipment into the building too?`,`Yes. The crew can take it through the door on skates, set it, and level it — or stage it until the floor is ready.`],
    ],
    titleFn:(CS)=>`Machinery Loading & Unloading in ${CS} | Badass Logistics`,
    descFn:(CS)=>`Machinery loading and unloading in ${CS} — machine load-outs, container unloads and dock-less deliveries with forklifts sized to the load. Same-day quotes.`,
    quoteFactors:['Weight, dimensions, and center of gravity of each piece','Trailer or container type, and whether there is a dock','Ground conditions and the path from the truck to the door','Loading, blocking, and securement requirements for the carrier','Whether the crew also moves it inside, sets it, or stages it'],
    pillarFile:'services/forklift-loading-unloading.html', sentinel:'FL_METROS', cardNoun:'loading crews',
  },
};

// Per-service internal links to the highest-value blog "movers" (from GSC: pages already
// pulling impressions on page 3-9). Every city page funnels authority to these → pushes them up.
const CITY_GUIDES = {
  'rigging': [['types-of-rigging','Types of Rigging, Explained'],['what-is-a-critical-lift','What Is a Critical Lift?'],['how-to-move-an-mri-machine','How to Move an MRI Machine'],['how-to-move-a-cnc-machine','How to Move a CNC Machine']],
  'cnc-machine-movers': [['how-to-move-a-cnc-machine','How to Move a CNC Machine'],['machine-leveling-and-alignment','Machine Leveling &amp; Alignment'],['how-to-move-a-lathe','How to Move a Metal Lathe']],
  'machinery-moving': [['how-much-do-machinery-movers-cost','How Much Do Machinery Movers Cost?'],['machine-leveling-and-alignment','Machine Leveling &amp; Alignment'],['how-to-move-an-mri-machine','How to Move an MRI Machine']],
  'plant-relocation': [['plant-relocation-checklist','The Plant Relocation Checklist'],['blocking-bracing-and-dunnage-explained','Blocking, Bracing &amp; Dunnage Explained'],['machine-leveling-and-alignment','Machine Leveling &amp; Alignment']],
  'millwright-services': [['what-is-a-millwright','What Is a Millwright?'],['machine-leveling-and-alignment','Machine Leveling &amp; Alignment'],['how-to-move-a-conveyor-system','How to Move a Conveyor System']],
  'machinery-removal': [['how-to-prepare-a-machine-for-shipping','How to Prepare a Machine for Shipping'],['plant-relocation-checklist','The Plant Relocation Checklist'],['how-much-do-machinery-movers-cost','How Much Do Machinery Movers Cost?']],
  'crane-services': [['what-is-a-critical-lift','What Is a Critical Lift?'],['crane-rental-vs-rigging-company','Crane Rental vs a Rigging Company'],['rigging-load-charts-explained','Rigging Load Charts, Explained'],['how-to-move-a-boiler-or-chiller','How to Move a Boiler or Chiller']],
  'forklift-loading-unloading': [['forklift-vs-crane-for-machine-loading','Forklift vs Crane for Machine Loading'],['how-to-ship-industrial-machinery-on-a-flatbed','How to Ship Machinery on a Flatbed'],['what-is-transloading','What Is Transloading?']],
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

const { inWave } = require('./lib/waves');
const WAVE2 = [['millwright-services','millwright services'],['machinery-removal','machinery removal'],['crane-services','crane and rigging services'],['forklift-loading-unloading','machinery loading and unloading']];

function siblingMesh(serviceSlug, svc, city, slug, key) {
  const sibs = CROSS_ORDER.filter(s => s !== serviceSlug);
  const w2 = WAVE2.filter(([s]) => s !== serviceSlug && inWave(s, key));
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
  <p style="margin-top:22px;font-weight:600;">In ${city} we also run ${inlineList}, plus <a href="/services/project-freight" style="color:var(--yellow-deep);text-decoration:underline;">project freight</a> for the jobs we rig &mdash; or see <a href="/locations/${slug}" style="color:var(--yellow-deep);text-decoration:underline;">every service we offer in ${city}</a>.</p>${w2.length ? `
  <p style="margin-top:12px;font-weight:600;">The same ${city} crew also handles ${oxford(w2.map(([s, label]) => `<a href="/services/${s}/${slug}" style="color:var(--yellow-deep);text-decoration:underline;">${label}</a>`))}.</p>` : ''}
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

/* ---------- PER-METRO SUBSTANCE (the matrix differentiation engine) ----------
   WHY THIS EXISTS. On 2026-09-21 the four city matrices measured 31-32%
   page-specific content against a 33% floor, with 86-88 of 113 pages under it.
   The cause was structural, not stylistic: the only per-city input to a
   ~1,550-word page was the `industry` string in data/metros.json, which
   averages FOUR WORDS ("rail & ag manufacturing" for Omaha). Four words of
   difference across 1,550 is why 113 pages read as one page — why
   /services/machinery-moving/omaha-ne ranked for Indianapolis, Detroit,
   Milwaukee and New York queries at position 67, and why
   machinery-moving/dallas-tx, plant-relocation/chicago-il and
   rigging/new-york-ny earned no impressions at all in 90 days.

   So the fix is data, not prose. data/metros.json now carries researched,
   verifiable per-metro fields — sectors, corridors, rail, port, stock,
   equipment — and this block is what the generator READS. Widening the input
   raises every page at once.

   TWO RULES THAT MUST HOLD.
   1. Each service draws a DIFFERENT mix of the fields and words them its own
      way. The same facts must not produce the same sentences on
      rigging/detroit-mi and machinery-moving/detroit-mi, or the matrix fix
      becomes a cross-service cannibalisation problem.
   2. Every slot degrades silently. A metro with no research (the queued tier)
      emits nothing extra and keeps its previous output exactly. Never fabricate
      a fact about a city to fill a slot — an unverifiable claim on 88 pages is
      worse than a generic one.
   --------------------------------------------------------------------------- */
const oxford = (a, conj = 'and') => {
  const x = (a || []).filter(Boolean);
  if (!x.length) return '';
  if (x.length === 1) return x[0];
  if (x.length === 2) return `${x[0]} ${conj} ${x[1]}`;
  return `${x.slice(0, -1).join(', ')}, ${conj} ${x.slice(-1)}`;
};
// Drop a researched sentence into the middle of one of ours without a stutter.
const lower1 = (s) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : '');
const trimDot = (s) => (s || '').replace(/\.\s*$/, '');
// A slot only renders when it has enough real material to be worth a paragraph.
const enough = (...parts) => parts.filter(p => p && String(p).trim()).length >= 2;

const METRO_COPY = {
  // machinery-moving: corridors + sectors + stock up front, equipment on the
  // floor, routing at the end.
  'machinery-moving': {
    base: (c, m) => enough(m.corridors && m.corridors.length, m.sectors && m.sectors.length, m.stock) ? [
      m.corridors && m.corridors.length ? `The machinery work in ${c.city} is concentrated where the floor space is — ${oxford(m.corridors)}.` : '',
      m.sectors && m.sectors.length ? `What sits inside follows what the metro actually builds: ${oxford(m.sectors)}.` : '',
      m.stock ? `The buildings are ${trimDot(m.stock)}, and that is usually what decides whether a machine rolls out through a dock door on skates or has to come apart on the floor first.` : '',
    ].filter(Boolean).join(' ') : '',
    floor: (c, m) => (m.equipment && m.equipment.length >= 3)
      ? `On ${c.city} floors that most often means ${oxford(m.equipment)} — each with its own lift points, its own disconnect list, and its own reason it can't be handled like palletised freight.` : '',
    away: (c, m) => enough(m.rail, m.port) ? [
      m.rail ? `${trimDot(m.rail)}.` : '',
      m.port ? `${trimDot(m.port)}.` : '',
      `With ${c.ix} carrying the over-the-road legs, a machine leaving a ${c.city} plant has more than one viable routing — and the crating and load plan get built around whichever one it is, not the other way round.`,
    ].filter(Boolean).join(' ') : '',
    faq: (c, m) => (m.corridors && m.corridors.length && m.sectors && m.sectors.length) ? [
      `Which parts of the ${c.city} metro do you cover?`,
      `Machinery moving across ${c.CS} and the industrial areas around it, including ${oxford(m.corridors)}. The work follows the metro's ${oxford(m.sectors)}, so the crews here are used to the equipment those plants run. <a href="/contact">Get a quote →</a>`,
    ] : null,
  },

  // rigging: the building is the story, so corridors + stock lead and sectors
  // are left to the other services.
  'rigging': {
    base: (c, m) => enough(m.corridors && m.corridors.length, m.stock) ? [
      m.corridors && m.corridors.length ? `Rigging in ${c.CS} is mostly a building problem, and in this metro the buildings are in ${oxford(m.corridors)}.` : '',
      m.stock ? `They are ${trimDot(m.stock)} — column spacing, door height and floor rating decide the gear long before the weight does.` : '',
      m.sectors && m.sectors.length ? `The lifts themselves follow the metro's ${oxford(m.sectors)}.` : '',
    ].filter(Boolean).join(' ') : '',
    floor: (c, m) => (m.equipment && m.equipment.length >= 3)
      ? `A ${c.city} lift list usually runs to ${oxford(m.equipment)}, and each one changes the rig: where it can be picked, what it cannot be set down on, and how much of it has to come apart to clear a doorway.` : '',
    away: (c, m) => enough(m.rail, m.port) ? [
      `Not every ${c.city} rig finishes on the floor it started on.`,
      m.rail ? `${trimDot(m.rail)}.` : '',
      m.port ? `${trimDot(m.port)}.` : '',
      `Add ${c.ix} for the road legs and a machine rigged out of a ${c.city} plant can leave on a trailer, in a rail car, or over water — the rigging plan is built backwards from whichever it is.`,
    ].filter(Boolean).join(' ') : '',
    faq: (c, m) => (m.corridors && m.corridors.length && m.equipment && m.equipment.length) ? [
      `Where in ${c.city} do your rigging crews work?`,
      `Throughout ${c.CS} and the surrounding industrial areas — ${oxford(m.corridors)} among them. The lifts in this metro are typically ${oxford(m.equipment)}, so the survey starts with the building as much as the machine. <a href="/contact">Get a quote →</a>`,
    ] : null,
  },

  // plant-relocation: sequencing is the product, so sectors + equipment drive
  // the teardown order and stock lands in the floor slot.
  'plant-relocation': {
    base: (c, m) => enough(m.corridors && m.corridors.length, m.sectors && m.sectors.length) ? [
      m.corridors && m.corridors.length ? `A ${c.city} plant move is shaped first by where the plant is: ${oxford(m.corridors)} hold most of the metro's industrial floor space.` : '',
      m.sectors && m.sectors.length ? `What has to come out of those buildings follows the metro's ${oxford(m.sectors)} — and that is what sets the teardown order, because the equipment that takes longest to recommission has to move first.` : '',
    ].filter(Boolean).join(' ') : '',
    floor: (c, m) => enough(m.equipment && m.equipment.length >= 3, m.stock) ? [
      (m.equipment && m.equipment.length >= 3) ? `A ${c.city} equipment schedule typically runs to ${oxford(m.equipment)}, and the order those come apart and go back together is the plan.` : '',
      m.stock ? `The local stock — ${trimDot(m.stock)} — is what turns a sequence on paper into a sequence that survives rig day.` : '',
    ].filter(Boolean).join(' ') : '',
    away: (c, m) => enough(m.rail, m.port) ? [
      `Plant moves rarely stay inside ${c.city}.`,
      m.rail ? `${trimDot(m.rail)}.` : '',
      m.port ? `${trimDot(m.port)}.` : '',
      `With ${c.ix} for the road legs, a consolidation or a move to a sister plant usually has several workable routings — and which one we use changes the crating, the sequence, and how long anything sits in staging.`,
    ].filter(Boolean).join(' ') : '',
    faq: (c, m) => (m.sectors && m.sectors.length && m.corridors && m.corridors.length) ? [
      `What kinds of ${c.city} plants do you relocate?`,
      `Production floors across the metro's ${oxford(m.sectors)}, in and out of ${oxford(m.corridors)}. Single lines, whole facilities, and consolidations of two sites into one. <a href="/contact">Get a quote →</a>`,
    ] : null,
  },

  // cnc-machine-movers: shop-scale, so the metro's sectors tell you who the
  // shops feed, and the building stock is the tolerance risk.
  'cnc-machine-movers': {
    base: (c, m) => enough(m.corridors && m.corridors.length, m.sectors && m.sectors.length) ? [
      m.corridors && m.corridors.length ? `${c.city}'s machine shops sit where its industry sits — ${oxford(m.corridors)}.` : '',
      m.sectors && m.sectors.length ? `They cut for the metro's ${oxford(m.sectors)} — which is what puts real tolerance pressure on a shop that has to move without losing a delivery date.` : '',
    ].filter(Boolean).join(' ') : '',
    floor: (c, m) => enough(m.stock, m.equipment && m.equipment.length >= 3) ? [
      m.stock ? `Getting a machine out of a ${c.city} shop is usually the harder half. The stock here is ${trimDot(m.stock)} — and for a machine holding ten-thousandths, the route out of the building is as much of the job as the lift itself.` : '',
      (m.equipment && m.equipment.length >= 3) ? `The parts those spindles cut end up inside the rest of the metro's plant — ${oxford(m.equipment)} — which is why a shop move here is rarely the only rigging job on the schedule.` : '',
    ].filter(Boolean).join(' ') : '',
    away: (c, m) => enough(m.rail, m.port) ? [
      m.rail ? `${trimDot(m.rail)}.` : '',
      m.port ? `${trimDot(m.port)}.` : '',
      `With ${c.ix} for the road legs, a machine going from a ${c.city} shop to a plant in another state can travel more than one way — and a machine tool's routing is chosen for shock and vibration, not for speed.`,
    ].filter(Boolean).join(' ') : '',
    faq: (c, m) => (m.corridors && m.corridors.length && m.sectors && m.sectors.length) ? [
      `Which ${c.city} areas do you move machine tools in?`,
      `Machine-tool work throughout ${c.CS} and the industrial areas around it, including ${oxford(m.corridors)}. Most of it feeds the metro's ${oxford(m.sectors)}, where a lost tolerance is a lost delivery date. <a href="/contact">Get a quote →</a>`,
    ] : null,
  },

  // ---------- WAVE 2 services — each reads the same researched fields
  // through its own job, so millwright/detroit-mi and crane-services/detroit-mi
  // never produce the same sentence from the same fact.

  // millwright-services: the machine on the pad is the story, so equipment
  // and sectors lead; the building shows up as foundations, not doors.
  'millwright-services': {
    base: (c, m) => enough(m.equipment && m.equipment.length >= 3, m.sectors && m.sectors.length) ? [
      (m.equipment && m.equipment.length >= 3) ? `Millwright work in ${c.city} is set by what has to be installed: ${oxford(m.equipment)}, each with its own foundation, anchor pattern, and leveling tolerance.` : '',
      m.sectors && m.sectors.length ? `Those machines serve the metro's ${oxford(m.sectors)}, where a drive train a few thousandths out shows up as vibration, bearing wear, and scrap long before anyone calls it an installation fault.` : '',
    ].filter(Boolean).join(' ') : '',
    floor: (c, m) => enough(m.stock, m.corridors && m.corridors.length) ? [
      m.stock ? `The floors matter as much as the machines. ${c.city}'s plants are ${trimDot(m.stock)}, and an older slab is often why a machine needs a new pad, re-drilled anchors, or a grout crew before it can be leveled at all.` : '',
      m.corridors && m.corridors.length ? `Most of our ${c.city} installation work lands in ${oxford(m.corridors)}.` : '',
    ].filter(Boolean).join(' ') : '',
    away: (c, m) => enough(m.rail, m.port) ? [
      `New equipment for ${c.city} plants rarely arrives by one road.`,
      m.port ? `${trimDot(m.port)}.` : '',
      m.rail ? `${trimDot(m.rail)}.` : '',
      `However it comes in, the installation clock starts at receiving — the crate is checked against the builder's packing list and the anchor layout before the pad is released for setting.`,
    ].filter(Boolean).join(' ') : '',
    faq: (c, m) => (m.equipment && m.equipment.length && m.sectors && m.sectors.length) ? [
      `What equipment do your ${c.city} millwrights install?`,
      `Most often ${oxford(m.equipment)} — the machinery behind the metro's ${oxford(m.sectors)}. Set, anchored, leveled to the builder's spec, and aligned before hand-off. <a href="/contact">Get a quote →</a>`,
    ] : null,
  },

  // machinery-removal: the way OUT of the building is the job, so stock and
  // corridors lead and the freight routing decides where the asset ends up.
  'machinery-removal': {
    base: (c, m) => enough(m.stock, m.corridors && m.corridors.length) ? [
      m.stock ? `Removals in ${c.city} are decided by the building before the machine. The stock here is ${trimDot(m.stock)} — and a door, column line, or mezzanine installed after the machine went in is the most common reason one has to be split to come out.` : '',
      m.corridors && m.corridors.length ? `Most of the retired equipment we pull in this metro sits in ${oxford(m.corridors)}.` : '',
    ].filter(Boolean).join(' ') : '',
    floor: (c, m) => enough(m.equipment && m.equipment.length >= 3, m.sectors && m.sectors.length) ? [
      (m.equipment && m.equipment.length >= 3) ? `The units coming out of ${c.city} plants are usually ${oxford(m.equipment)}. Each has its own drain-down, lockout points, and resale value — which is why they are tagged by destination before the first one is disconnected.` : '',
      m.sectors && m.sectors.length ? `Removals here track the churn in the metro's ${oxford(m.sectors)}: a line retired for a model change, a floor cleared for a consolidation, or a building handed back at lease end.` : '',
    ].filter(Boolean).join(' ') : '',
    away: (c, m) => enough(m.rail, m.port) ? [
      `Where a removed machine goes decides how it leaves.`,
      m.rail ? `${trimDot(m.rail)}.` : '',
      m.port ? `${trimDot(m.port)}.` : '',
      `Resale units bound for another state or overseas are prepped and loaded for whichever routing the buyer uses, while scrap goes local — so a ${c.city} decommissioning usually runs two or three load-out streams at once.`,
    ].filter(Boolean).join(' ') : '',
    faq: (c, m) => (m.sectors && m.sectors.length && m.corridors && m.corridors.length) ? [
      `What kinds of ${c.city} plants do you decommission?`,
      `Floors across the metro's ${oxford(m.sectors)}, in ${oxford(m.corridors)} and the areas around them — single machines, retired lines, and full closures. <a href="/contact">Get a quote →</a>`,
    ] : null,
  },

  // crane-services: the site is the story — ground, reach, and access — so
  // corridors and stock lead and equipment is framed as what gets picked.
  'crane-services': {
    base: (c, m) => enough(m.corridors && m.corridors.length, m.stock) ? [
      m.corridors && m.corridors.length ? `Crane work in ${c.CS} concentrates in ${oxford(m.corridors)}, and each of those sets up differently — lot space for outriggers, overhead lines, rail spurs, and neighbors that can't be shut down.` : '',
      m.stock ? `The buildings are ${trimDot(m.stock)}, which usually decides whether the crane sets the load inside through a roof opening or at the door for the crew to skate in.` : '',
    ].filter(Boolean).join(' ') : '',
    floor: (c, m) => enough(m.equipment && m.equipment.length >= 3, m.sectors && m.sectors.length) ? [
      (m.equipment && m.equipment.length >= 3) ? `The picks that come up most in ${c.city} are ${oxford(m.equipment)} — and the crane is sized to the heaviest of them at the longest radius the site forces, not to the weight alone.` : '',
      m.sectors && m.sectors.length ? `Who is asking changes the plan as much as what is being lifted: a pick for ${c.city}'s ${oxford(m.sectors, 'or')} usually lands inside a running site, so the lift window, the exclusion zone, and the traffic plan are written around their operation.` : '',
    ].filter(Boolean).join(' ') : '',
    away: (c, m) => enough(m.rail, m.port) ? [
      m.port ? `${trimDot(m.port)}.` : '',
      m.rail ? `${trimDot(m.rail)}.` : '',
      `Loads arriving that way often need a crane at both ends — off the railcar or dock and onto a trailer, then off the trailer and onto a pad in ${c.city} — and both picks go into the same lift plan.`,
    ].filter(Boolean).join(' ') : '',
    faq: (c, m) => (m.corridors && m.corridors.length && m.equipment && m.equipment.length) ? [
      `Where in ${c.city} do you plan crane lifts?`,
      `Throughout ${c.CS}, including ${oxford(m.corridors)}. Typical picks here are ${oxford(m.equipment)}, planned around the site as much as the load. <a href="/contact">Get a quote →</a>`,
    ] : null,
  },

  // forklift-loading-unloading: the handoff between truck and building, so
  // rail/port lead (that is where the loads come from) and stock is the dock.
  'forklift-loading-unloading': {
    base: (c, m) => enough(m.rail, m.port, m.corridors && m.corridors.length) ? [
      m.port ? `A lot of what gets unloaded in ${c.city} arrives in containers. ${trimDot(m.port)}.` : '',
      m.rail ? `${trimDot(m.rail)}.` : '',
      m.corridors && m.corridors.length ? `The receiving end is usually ${oxford(m.corridors)}.` : '',
    ].filter(Boolean).join(' ') : '',
    floor: (c, m) => enough(m.stock, m.equipment && m.equipment.length >= 3) ? [
      m.stock ? `The dock is the variable. ${c.city} buildings are ${trimDot(m.stock)} — so one delivery backs into a dock leveler and the next comes off a trailer at ground level onto a lot.` : '',
      (m.equipment && m.equipment.length >= 3) ? `What comes off those trucks is mostly ${oxford(m.equipment)}, and every one of them gets a weight and center-of-gravity check before the forks go in.` : '',
    ].filter(Boolean).join(' ') : '',
    away: () => '',
    faq: (c, m) => (m.sectors && m.sectors.length && m.equipment && m.equipment.length) ? [
      `What do you load and unload for ${c.city} plants?`,
      `Mostly ${oxford(m.equipment)} for the metro's ${oxford(m.sectors)} — machines, crates, and skids on and off trucks and containers, and into the building when needed. <a href="/contact">Get a quote →</a>`,
    ] : null,
  },
};

// Render one slot for one service x metro. Returns '' when there is no
// researched data, so untouched metros keep their previous page exactly.
function metroSlot(serviceSlug, slot, c) {
  const m = c.metro;
  if (!m) return '';
  const svcCopy = METRO_COPY[serviceSlug];
  if (!svcCopy || !svcCopy[slot]) return '';
  const txt = svcCopy[slot](c, m);
  return txt && txt.trim() ? txt.trim() : '';
}
function industrySection(svc, c, serviceSlug) {
  const prof = INDUSTRY_PROFILE[c.angle] || INDUSTRY_PROFILE['manufacturing'];
  const lead = c.metro && c.metro.industry ? `${c.city}'s industrial base — ${c.metro.industry} —` : `${c.city}'s ${c.angle} base`;
  const floor = metroSlot(serviceSlug, 'floor', c);
  return `
<section class="notes-bg">
  <span class="bgnote" style="top:10%;right:4%;transform:rotate(-4deg)">${c.angle.split(' ')[0].toUpperCase()} ✓</span>
  <div class="wrap">
  <span class="section-tag hand">${c.angle} equipment</span>
  <h2 class="section-title">Equipment we rig for ${c.city}'s ${c.angle} plants</h2>
  <p class="section-intro">${lead} runs on equipment that doesn't move like freight. ${prof.why} Typical ${svc.coverageNoun.toLowerCase()} for ${c.city} customers include:</p>
  <div class="chip-row">${prof.eq.map(e => `<span>${e}</span>`).join('')}</div>${floor ? `
  <div class="prose" style="margin-top:22px;"><p>${floor}</p></div>` : ''}
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
  const near = PLACES.names(loc.near, 12);
  const nearRows = loc.near || [];
  // Other metros in the same state — real city→city internal links (hub-and-spoke mesh)
  // Only link cities this service actually has a page for — crane-services and
  // forklift cover the top 60 / 40 metros, not all 88.
  const nearbyMetros = locations.filter(l => l.state === state && l.city !== city && inWave(serviceSlug, `${l.city}|${l.state}`)).slice(0, 8);
  const url = `${DOMAIN}/services/${serviceSlug}/${slug}`;
  const cityHub = `/locations/${slug}`;
  const mapQ = encodeURIComponent(CS);
  const title = svc.titleFn ? svc.titleFn(CS) : `${svc.name} in ${CS} | Badass Logistics`;
  // Keep under ~155 chars so Google doesn't truncate mid-sentence, and don't
  // repeat svc.name/svc.serviceType back-to-back (they're identical for several
  // services, which produced a stuttering snippet on 87 pages).
  // Per-service descriptions. This used to be one boilerplate line across all
  // 352 pages, which wasted the snippet: 90d to 2026-09-18 the matrix took
  // 9,979 impressions and 4 non-brand clicks. Each service now leads with the
  // phrase its own queries actually use.
  const desc = svc.descFn ? svc.descFn(CS) : `${svc.name} in ${CS} — surveyed, rigged, moved, and re-leveled to spec by one accountable crew. Same-day quotes: (307) 284-1332.`;
  const svcSchema = {"@context":"https://schema.org","@type":"Service","serviceType":svc.serviceType,"areaServed":{"@type":"City","name":CS},"provider":{"@type":"LocalBusiness","@id":`${DOMAIN}/#organization`,"name":site.brand,"telephone":"+1-307-284-1332","url":`${DOMAIN}/`},"description":`${site.brand} provides ${svc.serviceType.toLowerCase()} across ${CS} and the surrounding metro.`};
  const bcItems = [{"@type":"ListItem","position":1,"name":"Home","item":`${DOMAIN}/`},{"@type":"ListItem","position":2,"name":svc.name,"item":`${DOMAIN}/services/${serviceSlug}`}];
  if (hasHub) bcItems.push({"@type":"ListItem","position":3,"name":c.stName,"item":`${DOMAIN}/services/${serviceSlug}/${stSlug}`});
  bcItems.push({"@type":"ListItem","position":hasHub?4:3,"name":CS,"item":url});
  const breadcrumb = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":bcItems};
  const faqPairs = svc.faq(c).slice();
  if (serviceSlug !== 'cnc-machine-movers') faqPairs.splice(2, 0, [`How much do ${svc.cardNoun} cost in ${city}?`, `There is no flat rate for ${svc.serviceType.toLowerCase()} — the price comes from the equipment, the access at both ends, the crew and gear, distance, and setting work. Send the equipment list and both sites and we'll quote your ${city} job fast, usually the same day.`]);
  // One metro-specific FAQ per page, from the researched data. This slot uses
  // fields that are filled for every live metro, so it lifts the pages whose
  // `stock` research came back empty too.
  const metroFaq = (METRO_COPY[serviceSlug] && METRO_COPY[serviceSlug].faq) ? METRO_COPY[serviceSlug].faq(c, c.metro || {}) : null;
  if (metroFaq) faqPairs.push(metroFaq);
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
  ${svc.introPs(c).map(p=>`<p>${p}</p>`).join('\n  ')}${metroSlot(serviceSlug, 'base', c) ? `
  <p>${metroSlot(serviceSlug, 'base', c)}</p>` : ''}
</div></section>
${industrySection(svc, c, serviceSlug)}

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
  <p>Plenty of ${city} jobs start and finish on one floor. The rest have to travel — to a new building across the metro, a sister plant down ${c.ix}, or a facility in another state. We don't hand that part off. It runs as <a href="/services/project-freight">project freight</a> inside the same plan: machines <a href="/services/crating-packing">crated or prepped</a> on site, loads sequenced to the rig-out, transport through our licensed broker and carrier partners with <a href="/services/dedicated-lanes">dedicated capacity</a> for bigger moves, and our crew waiting at the destination to set it.</p>${metroSlot(serviceSlug, 'away', c) ? `
  <p>${metroSlot(serviceSlug, 'away', c)}</p>` : ''}
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
  <p class="section-intro">${svc.serviceType} throughout ${city} and the industrial suburbs around it — the towns below are where the plants, shops and distribution parks actually sit:</p>
  <div class="towns">${near.map(t=>`<span>${t}</span>`).join('')}</div>
  ${PLACES.coverageTable(nearRows)}
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
${siblingMesh(serviceSlug, svc, city, slug, `${city}|${state}`)}

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
  // State hubs carry state-level intent only. They used to lead with city names
  // and sat at position 50-80 beside their own city page for "<service> <city>"
  // queries (Georgia vs Savannah, South Carolina vs Charleston, Oklahoma vs
  // Tulsa) — pure drag on a query the city page wins. City names stay on the
  // cards and in the "which cities" FAQ, where they are navigation.
  const desc = `${svc.name} anywhere in ${stName} — statewide, through a network of 88 locations. Rigged, moved, and re-leveled to spec. Same-day quotes.`;
  const svcSchema = {"@context":"https://schema.org","@type":"Service","serviceType":svc.serviceType,"areaServed":{"@type":"State","name":stName},"provider":{"@type":"LocalBusiness","@id":`${DOMAIN}/#organization`,"name":site.brand,"telephone":"+1-307-284-1332","url":`${DOMAIN}/`},"description":`${site.brand} provides ${svc.serviceType.toLowerCase()} across ${stName}.`};
  const breadcrumb = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":`${DOMAIN}/`},{"@type":"ListItem","position":2,"name":svc.name,"item":`${DOMAIN}/services/${serviceSlug}`},{"@type":"ListItem","position":3,"name":stName,"item":url}]};
  const faqPairs = [
    [`Do you provide ${svc.name.toLowerCase()} across ${stName}?`,`Yes — ${svc.serviceType.toLowerCase()} anywhere in ${stName}, backed by a nationwide network of 88 locations. <a href="/contact">Get a quote →</a>`],
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
  <p class="lead">${svc.serviceType} anywhere in ${stName}, statewide. One accountable crew surveys it, rigs it, manages the move, and sets it to spec.</p>
  <div class="cta-row" style="margin-top:24px;"><a class="btn" href="/contact">Get a ${stName} ${svc.quote} Quote</a></div>
</div>
  <span class="annot hand tag warn a1">${stName.toUpperCase()}</span>
  <span class="annot hand a4">${cities.length} METROS ✓</span>
</section>

<section><div class="wrap prose">
  <h2>${svc.serviceType} statewide in ${stName}</h2>
  <p>${stName}'s industrial base runs on machines that have to move — presses, machining centers, production lines, and the plants that house them. Badass Logistics provides ${svc.serviceType.toLowerCase()} statewide — the metros below each have their own local page — and reaches every other corner of ${stName} through a nationwide network of 88 locations. One crew plans the lift, protects the floors, and sets the load to spec — and when equipment has to travel, the same team runs it as <a href="/services/project-freight">project freight</a>, so a ${stName} move never gets passed between a rigger, a trucking company, and an installer.</p>
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
// Which service x city pages exist lives in lib/waves.js — build-locations.js
// reads the same list so city hubs never link a page that was not built.
const { WAVES } = require('./lib/waves');

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
      return `    <a class="svc-card" href="${serviceSlug}/${slug}"><div class="num">// ${l.state}</div><h3>${l.city}, ${l.state}</h3><p>${PLACES.names(l.near,3).join(' · ')}</p><span class="more">${l.city} ${svc.cardNoun}</span></a>`;
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
