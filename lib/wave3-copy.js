/* ===========================================================
   Wave 3 (2026-10-19) — the 7 specialty rigging services, city copy.

   Lives beside build-service-cities.js (which requires it) only because
   these blocks lean on the researched `anchors` field the first 8
   services never read. Same contract as the blocks in that file:

   1. SERVICES — per-service page copy. Every claim is a capability, never
      a client: anchors are named as what exists in the metro ("home to"),
      never as who we have worked for.
   2. METRO_COPY — base / floor / away / faq slots. Each service draws a
      DIFFERENT mix of fields, and every slot returns '' when the research
      is thin, so no page ever carries a padded or invented local fact.
   3. eqSection — replaces the generic "{angle} plants" chip section, which
      read wrong on a hospital or a data hall.

   Positioning: no prices, no certifications, no permits, never "our
   trucks". Freight between sites is the shared "When the equipment leaves"
   section in page(), which already says broker and carrier partners.
   Specialist trades (refrigerant recovery, magnet ramp-down, electrical
   disconnects, press technicians) stay with the people licensed or
   employed to do them — the copy says so rather than implying we do.
   =========================================================== */

const oxford = (a, conj = 'and') => {
  const x = (a || []).filter(Boolean);
  if (!x.length) return '';
  if (x.length === 1) return x[0];
  if (x.length === 2) return `${x[0]} ${conj} ${x[1]}`;
  return `${x.slice(0, -1).join(', ')}, ${conj} ${x.slice(-1)}`;
};
const trimDot = (s) => (s || '').replace(/\.\s*$/, '');
const lower1 = (s) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : '');
const enough = (...parts) => parts.filter(p => p && String(p).trim()).length >= 2;
const A = (m) => (m && m.anchors) || {};
const L = (x, n = 3) => (Array.isArray(x) ? x.slice(0, n) : []);
const has = (x) => Array.isArray(x) && x.length > 0;

const SERVICES = {
  'heavy-lift-rigging': {
    name: 'Heavy Lift Rigging', serviceType: 'Heavy Lift Rigging', hero: '/assets/img/loads/load-rigging-equipment.jpg', band: '/assets/img/mri-lift.jpg',
    tag: 'jacking, skidding & gantries', quote: 'Heavy Lift', coverageNoun: 'Jacking and gantry jobs',
    snippet: `We lift, jack, skid, and set heavy equipment with hydraulic gantries, jacking and cribbing, and skid systems — the methods for loads a crane can't reach, can't set up beside, or isn't allowed inside.`,
    lead: (c) => `Inside a ${c.city} plant there is usually no room for a crane — a roof overhead, live equipment either side, and a floor that has to carry the load the whole way. That is where heavy lift rigging takes over: hydraulic gantries, jacks and cribbing, and skid tracks that move the heaviest pieces in the building without a hook.`,
    introH2: (c) => `Heavy lift rigging in ${c.CS}`,
    introPs: (c) => [
      `A crane needs open sky, outrigger space, and ground that can take the bearing. Most heavy equipment in ${c.city} sits where none of that exists — under a bay roof, in a pit, behind a column line, or in a building the load has to roll into. ${c.metro ? `In ${c.city}'s ${c.metro.industry} plants` : `On ${c.city} production floors`}, the way a heavy piece moves is usually up a few inches, along a planned path, and down onto its set point.`,
      `Badass Logistics plans those lifts from the load data out: weight and center of gravity, the lift points the builder allows, floor capacity along the route, and the headroom at every stage. We set hydraulic gantries where the piece has to go up, jack and crib it where it has to come off a truck or a foundation, and skid or roll it where it has to travel. When there is room for a crane, the <a href="/services/crane-services">crane lift</a> and the inside move go into one plan. <a href="/blog/jacking-and-skidding-explained">Jacking and skidding, explained →</a>`,
    ],
    movesH2: (c) => `Heavy lifts we plan in ${c.city}`,
    moves: [['gantry', 'Hydraulic Gantry Lifts', 'Loads lifted and traversed under roofs and inside bays where a crane cannot set up'], ['jacking', 'Jacking &amp; Cribbing', 'Heavy pieces raised off trailers, foundations, and pits in controlled stages'], ['skidding', 'Skidding &amp; Rolling', 'Loads moved along engineered skid tracks or on rollers to the set point'], ['setting', 'Precision Setting', 'Equipment lowered onto anchors, soleplates, and foundations to the layout']],
    faq: (c) => [
      [`Do you provide heavy lift rigging in ${c.city}?`, `Yes — hydraulic gantry lifts, jacking and cribbing, and skidding and rolling throughout ${c.CS} and the surrounding metro, serving its ${c.angle} base. <a href="/contact">Get a quote →</a>`],
      [`When is a gantry or jacking better than a crane?`, `When there is a roof overhead, no space for outriggers, or the load has to travel inside the building after it is lifted. A gantry lifts and traverses in a bay, and jacks and skids move it the rest of the way. Where a crane can reach, we use one.`],
      [`Will the floor take the load?`, `That gets checked before anything moves. Floor capacity along the whole path is part of the plan, and where it falls short we spread the load with mats, plates, or cribbing, or change the route. <a href="/blog/floor-loading-for-machinery">Floor loading for machinery →</a>`],
      [`Can you set equipment onto a new foundation?`, `Yes. We lower it onto the anchors or soleplates to the layout, and our <a href="/services/millwright-services">millwrights</a> can level and align it once it is down.`],
    ],
    titleFn: (CS) => `Heavy Lift Rigging in ${CS} | Badass Logistics`,
    descFn: (CS) => `Heavy lift rigging in ${CS} — hydraulic gantries, jacking and cribbing, and skidding for loads a crane can't reach. Planned and set by our crew.`,
    quoteFactors: ['Load weight, dimensions, and center of gravity, and the lift points the builder allows', 'Headroom, door, and aisle clearances along the whole path', 'Floor capacity on the route and at the set point', 'Whether it comes off a trailer, out of a pit, or off a foundation', 'Setting tolerance — onto anchors, soleplates, or a new pad'],
    pillarFile: 'services/heavy-lift-rigging.html', sentinel: 'HL_METROS', cardNoun: 'heavy lift riggers',
    eqSection: (c) => ({ tag: 'heavy lifts', h2: `What gets jacked, skidded, and gantried in ${c.city}`, intro: `The loads that need these methods are the heaviest and most awkward in the building. Typical ${c.city} heavy lifts include:`, chips: ['Presses and press crowns', 'Transformers and switchgear', 'Vessels, tanks, and reactors', 'Large machine tools and bases', 'Generators and turbines', 'Molds, dies, and rolls'] }),
  },

  'hvac-chiller-rigging': {
    name: 'Chiller & HVAC Rigging', serviceType: 'Chiller, Boiler & HVAC Rigging', hero: '/assets/img/loads/step-deck-industrial-air-handlers.jpg', band: '/assets/img/rigging-crane2.jpg',
    tag: 'chiller & HVAC rigging', quote: 'Chiller Rigging', coverageNoun: 'Chiller and HVAC lifts',
    snippet: `We rig chillers, boilers, cooling towers, air handlers, and rooftop units into and out of mechanical rooms, basements, penthouses, and roofs — sectioned where the opening demands it and set ready for the mechanical contractor.`,
    lead: (c) => `A chiller in a ${c.city} building was usually set before the walls closed around it. Getting the old one out and the new one in means a route through a mechanical room, a basement, or a roof — and often a crane on a city street. We plan and rig HVAC equipment across the ${c.city} metro, from the first opening to the last anchor bolt.`,
    introH2: (c) => `Chiller and HVAC rigging in ${c.CS}`,
    introPs: (c) => [
      `The machine is rarely the hard part of an HVAC replacement. The route is. A centrifugal chiller headed for a basement plant room, a boiler that only fits through a wall, a cooling tower that has to go up past occupied floors — the plan is set by doors, corridors, slab capacity, and crane reach long before it is set by the unit. ${c.metro ? `In ${c.city}, much of that work is in buildings that cannot shut down while it happens.` : ''}`,
      `Badass Logistics walks both routes — the old unit's way out and the new unit's way in — and rigs them as one job. Refrigerant recovery, electrical disconnects, and piping stay with your licensed mechanical contractor; we sequence around them. Units are skated, jacked, or sectioned at factory joints where the builder allows it, and roof work runs as a planned <a href="/services/crane-services">crane lift</a>. <a href="/blog/how-to-move-a-boiler-or-chiller">How to move a boiler or chiller →</a>`,
    ],
    movesH2: (c) => `HVAC equipment we rig in ${c.city}`,
    moves: [['chillers', 'Chiller Replacements', 'Centrifugal, screw, and absorption chillers rigged out of and into plant rooms'], ['boilers', 'Boiler Rigging', 'Fire-tube and water-tube boilers removed and set, sectioned where the opening demands it'], ['rooftop', 'Rooftop Units &amp; Towers', 'RTUs, cooling towers, and condensers lifted onto and off roofs'], ['air handlers', 'Air Handlers', 'AHUs and fan sections moved through buildings and set on curbs and pads']],
    faq: (c) => [
      [`Do you provide chiller rigging in ${c.city}?`, `Yes — chiller and boiler replacements, rooftop unit and cooling tower lifts, and air handler moves throughout ${c.CS} and the surrounding metro. <a href="/contact">Get a quote →</a>`],
      [`Do you recover the refrigerant?`, `No. Refrigerant recovery has to be done by a properly licensed HVAC technician, so it stays with your mechanical contractor. We rig the unit once it has been recovered and disconnected.`],
      [`What if the chiller won't fit through the door?`, `It comes apart at the joints the manufacturer designed for it — compressor, evaporator, condenser — or goes through a wall or roof opening. The site walk decides which before anything is quoted.`],
      [`Can you work in an occupied building?`, `Yes. Most ${c.city} HVAC jobs are in buildings that stay open, so the route, protection, and timing are planned around the people still in them.`],
    ],
    titleFn: (CS) => `Chiller & HVAC Rigging in ${CS} | Badass Logistics`,
    descFn: (CS) => `Chiller and HVAC rigging in ${CS} — chiller and boiler replacements, rooftop unit and cooling tower crane lifts, air handlers set through tight routes.`,
    quoteFactors: ['Unit make, model, and weight — and whether it can be sectioned', 'The route: mechanical room, basement, penthouse, or roof', 'Crane access, street or lot closure, and roof structure for rooftop work', 'Which trades disconnect and reconnect, and when they are on site', 'Whether the old unit is scrapped, sold, or relocated'],
    pillarFile: 'services/hvac-chiller-rigging.html', sentinel: 'HV_METROS', cardNoun: 'chiller riggers',
    eqSection: (c) => ({ tag: 'mechanical plant', h2: `HVAC equipment in ${c.city}'s buildings`, intro: `${trimDot(A(c.metro).buildings) ? `${trimDot(A(c.metro).buildings)}.` : `${c.city}'s commercial and institutional buildings run on central plants.`} The equipment we rig for them includes:`, chips: ['Centrifugal and screw chillers', 'Fire-tube and water-tube boilers', 'Cooling towers and condensers', 'Rooftop units', 'Air handlers and fan walls', 'Pumps and heat exchangers'] }),
  },

  'transformer-generator-rigging': {
    name: 'Transformer & Generator Rigging', serviceType: 'Transformer & Generator Rigging', hero: '/assets/img/loads/load-flatbed-electrical.jpg', band: '/assets/img/loads/gooseneck-flatbed-industrial-tanks.jpg',
    tag: 'transformer & generator rigging', quote: 'Transformer', coverageNoun: 'Transformer and generator sets',
    snippet: `We rig, jack, skid, and set transformers, generator sets, and switchgear onto pads, into vaults, and into electrical rooms — with impact recording where the manufacturer requires it.`,
    lead: (c) => `Transformers and generators are dense, top-heavy, and set to tight pad layouts. Across the ${c.city} metro we jack them off the trailer, skid or crane them onto the pad, and set them on the anchors — so the electrical contractor gets the unit where the drawings put it.`,
    introH2: (c) => `Transformer and generator rigging in ${c.CS}`,
    introPs: (c) => [
      `A large power transformer can weigh more than everything else on the site combined, and it is built to sit still. Tilting it past its limit, dropping it on a corner, or skidding it across a pad that wasn't level can damage the core and windings in ways that only show up at energization. ${c.metro ? `Around ${c.city}, ` : ''}that is why the rigging is planned around the manufacturer's lift points, tilt limits, and impact requirements before it is planned around the crane.`,
      `Badass Logistics sets pad-mount and substation transformers, standby and prime generator sets, and switchgear lineups. Many of these jobs don't use a crane at all: the unit is jacked off the trailer onto cribbing and <a href="/services/heavy-lift-rigging">skidded onto the pad</a>. Electrical disconnection, oil handling, and testing stay with your electrical contractor and the manufacturer. <a href="/blog/how-to-move-a-transformer-into-a-building">How to move a transformer into a building →</a>`,
    ],
    movesH2: (c) => `Electrical equipment we set in ${c.city}`,
    moves: [['transformers', 'Transformer Setting', 'Pad-mount and substation transformers jacked, skidded, or craned onto pads'], ['generators', 'Generator Sets', 'Standby and prime gensets set in yards, enclosures, and on roofs'], ['switchgear', 'Switchgear &amp; MCCs', 'Switchgear lineups and motor control centers moved into electrical rooms'], ['vaults', 'Vault &amp; Indoor Sets', 'Units rigged into basement vaults and indoor substations']],
    faq: (c) => [
      [`Do you move transformers in ${c.city}?`, `Yes — pad-mount and substation transformers, generator sets, and switchgear jacked, skidded, craned, and set throughout ${c.CS} and the surrounding metro. <a href="/contact">Get a quote →</a>`],
      [`Do you disconnect or test the transformer?`, `No. Disconnection, oil handling, and testing are done by your electrical contractor and the manufacturer. We rig and set the unit and sequence the job around them.`],
      [`Do you use impact recorders?`, `Where the manufacturer or owner requires them, yes — recorders go on before the unit is moved and their readings are part of the hand-off.`],
      [`Can you set a generator on a roof?`, `Yes, by crane where the structure has been checked for it. The pick, the dunnage, and the set onto its rails or pad are planned together.`],
    ],
    titleFn: (CS) => `Transformer & Generator Rigging in ${CS} | Badass Logistics`,
    descFn: (CS) => `Transformer and generator rigging in ${CS} — pad-mount and substation transformers, gensets, and switchgear jacked, skidded, craned, and set.`,
    quoteFactors: ['Unit weight, dimensions, and the manufacturer\'s lift points and tilt limits', 'Where it sets: pad, vault, yard, roof, or electrical room', 'Access for the trailer and whether a crane or jacking and skidding is needed', 'Impact recording or other manufacturer requirements', 'Which electrical trades and manufacturer techs are on site, and when'],
    pillarFile: 'services/transformer-generator-rigging.html', sentinel: 'TG_METROS', cardNoun: 'transformer riggers',
    eqSection: (c) => ({ tag: 'power equipment', h2: `Power equipment we set around ${c.city}`, intro: `Utilities, plants, campuses, and data centers across ${c.city} all run on equipment that has to land exactly where the drawings put it. The units we rig include:`, chips: ['Pad-mount transformers', 'Substation transformers', 'Standby generator sets', 'Switchgear and MCC lineups', 'Unit substations', 'Load banks and fuel tanks'] }),
  },

  'mri-medical-equipment-rigging': {
    name: 'MRI & Medical Equipment Rigging', serviceType: 'MRI & Medical Equipment Rigging', hero: '/assets/img/mri-real.jpg', band: '/assets/img/loads/ct-mri-scanner-enclosed-air-ride.jpg',
    tag: 'MRI & medical rigging', quote: 'MRI Rigging', coverageNoun: 'Imaging installs',
    snippet: `We rig MRI magnets, CT, PET/CT, cath lab, and linac components into and out of hospitals and imaging centers — on planned routes, with tilt and shock monitoring, sequenced around the OEM's install team.`,
    lead: (c) => `An MRI magnet is one of the heaviest single pieces a ${c.city} hospital will ever bring through its doors — and it has to arrive without a scratch, inside a building that never closes. We plan the route, rig the magnet and its components, and set them for the OEM's install team across the ${c.city} metro.`,
    introH2: (c) => `MRI and medical equipment rigging in ${c.CS}`,
    introPs: (c) => [
      `Imaging equipment does not move like freight. A magnet has strict tilt and shock limits, a CT gantry carries delicate rotating components, and the route runs through corridors, elevators, and floors that were built for patients. ${c.metro ? `In ${c.city}'s hospitals and imaging centers` : `In ${c.city}`}, the move is also planned around infection control and a schedule that keeps clinical areas open.`,
      `Badass Logistics plans the route from the truck to the suite — rated elevator, wall or knockout opening, or a <a href="/services/crane-services">crane pick</a> to an upper floor — and checks floor loading at every stage. Magnet ramp-down, cryogens, and calibration stay with the OEM; we rig and set what they hand us, with monitoring recorded throughout. <a href="/blog/how-to-move-an-mri-machine">How to move an MRI machine →</a>`,
    ],
    movesH2: (c) => `Medical equipment we rig in ${c.city}`,
    moves: [['MRI', 'MRI Magnets', 'Magnets rigged in, out, and between suites with tilt and shock monitoring'], ['CT &amp; PET', 'CT &amp; PET/CT', 'Gantries, tables, and cabinets moved and set for the install team'], ['cath lab', 'Cath &amp; Interventional Labs', 'C-arms, ceiling mounts, and components handled as one sequenced job'], ['linac', 'Linear Accelerators', 'Linac components rigged into vaults on planned routes']],
    faq: (c) => [
      [`Do you rig MRI machines in ${c.city}?`, `Yes — MRI, CT, PET/CT, cath lab, and linac installs, relocations, and removals throughout ${c.CS} and the surrounding metro. <a href="/contact">Get a quote →</a>`],
      [`Do you ramp down the magnet?`, `No. Ramp-down, cryogen handling, and recalibration are done by the OEM or its authorized service provider. We rig and move the magnet once they have made it ready.`],
      [`How does an MRI get into an upper floor?`, `By a rated elevator where the numbers allow, through a wall or knockout panel, or by crane onto a platform at the floor level. The route is decided on the site walk.`],
      [`Can you work inside an open hospital?`, `Yes. Routes, protection, and timing are planned with the facility so patient areas stay open and infection control requirements are met.`],
    ],
    titleFn: (CS) => `MRI & Medical Equipment Rigging in ${CS} | Badass Logistics`,
    descFn: (CS) => `MRI and medical equipment rigging in ${CS} — MRI magnets, CT, PET/CT, cath labs, and linacs rigged in and out with tilt and shock monitoring.`,
    quoteFactors: ['Equipment make and model, and the OEM\'s rigging and monitoring requirements', 'The route from the truck to the suite, and which floor it is on', 'Elevator rating, knockout panels, or crane access', 'Floor loading along the route and in the suite', 'Facility rules: hours, infection control, and protection'],
    pillarFile: 'services/mri-medical-equipment-rigging.html', sentinel: 'MD_METROS', cardNoun: 'MRI riggers',
    eqSection: (c) => ({ tag: 'imaging equipment', h2: `Imaging and clinical equipment in ${c.city}`, intro: `Hospital imaging departments, outpatient imaging centers, and cancer centers across ${c.city} replace equipment on a steady cycle. The equipment we rig for them includes:`, chips: ['MRI magnets', 'CT scanners', 'PET/CT systems', 'Cath lab C-arms', 'Linear accelerators', 'Lab analyzers and sterilizers'] }),
  },

  'lab-equipment-movers': {
    name: 'Lab Equipment Movers', serviceType: 'Lab & Precision Equipment Moving', hero: '/assets/img/loads/ct-mri-scanner-enclosed-air-ride.jpg', band: '/assets/img/loads/enclosed-trailer-machinery-loaded.jpg',
    tag: 'lab & precision equipment', quote: 'Lab Move', coverageNoun: 'Lab and instrument moves',
    snippet: `We move heavy and precision lab equipment — electron microscopes, NMR, mass spectrometers, freezers, and semiconductor tools — with vibration and tilt care, sequenced around the vendor's decommission and requalification.`,
    lead: (c) => `Lab instruments are heavy where it hurts and fragile where it matters. Across the ${c.city} metro we rig, move, and set electron microscopes, NMR systems, ultra-low freezers, and process tools — on air-ride, inside buildings with tight corridors and strict rules, and ready for the vendor to bring back up.`,
    introH2: (c) => `Lab equipment movers in ${c.CS}`,
    introPs: (c) => [
      `A lab move fails in small ways: a column knocked out of alignment, a freezer tipped past its limit, a tool that won't requalify because it was handled outside its spec. ${c.metro ? `In ${c.city}'s university, research, and production labs` : `In ${c.city}`}, the equipment is usually worth more than the room it sits in, and the schedule is set by experiments and validation, not by the movers.`,
      `Badass Logistics plans lab moves around the vendor's requirements. Decommissioning, decontamination sign-off, and requalification stay with the OEM and your EHS team; we rig, crate, and move what they release, on air-ride equipment, with tilt and shock monitoring where the spec calls for it. Building-to-building moves run as one job, set at the far end by the same crew. <a href="/blog/how-to-move-a-lab-freezer">How to move a lab freezer →</a>`,
    ],
    movesH2: (c) => `Lab equipment we move in ${c.city}`,
    moves: [['microscopes', 'Electron Microscopes', 'SEMs and TEMs moved with columns secured and vibration controlled'], ['NMR', 'NMR &amp; Mass Spec', 'Spectrometers and their consoles rigged and set for the vendor'], ['freezers', 'Freezers &amp; Incubators', 'Ultra-low freezers and environmental equipment moved inside tilt limits'], ['tools', 'Process &amp; Test Tools', 'Semiconductor tools, test stands, and instruments rigged in and out']],
    faq: (c) => [
      [`Do you move lab equipment in ${c.city}?`, `Yes — electron microscopes, NMR and mass spec systems, freezers, and precision process tools throughout ${c.CS} and the surrounding metro. <a href="/contact">Get a quote →</a>`],
      [`Do you decontaminate or requalify the equipment?`, `No. Decontamination sign-off is your EHS team's, and requalification belongs to the OEM. We move the equipment once it has been released, inside the vendor's handling spec.`],
      [`Can you move a lab between buildings on one campus?`, `Yes. Building-to-building moves are planned as one job — rigged out, moved, and set at the far end by the same crew.`],
      [`Do you work in cleanrooms?`, `Yes, following the facility's gowning and protocol. Equipment is cleaned and wrapped to the site's requirements before it crosses the boundary.`],
    ],
    titleFn: (CS) => `Lab Equipment Movers in ${CS} | Badass Logistics`,
    descFn: (CS) => `Lab equipment movers in ${CS} — electron microscopes, NMR, freezers, and semiconductor tools moved on air-ride with vibration and tilt care.`,
    quoteFactors: ['The instrument list, weights, and each vendor\'s handling spec', 'Decommission, decontamination, and requalification sequence', 'Corridors, elevators, and doors at both ends', 'Cleanroom or containment rules at either site', 'Whether it stays on one campus or moves between buildings'],
    pillarFile: 'services/lab-equipment-movers.html', sentinel: 'LB_METROS', cardNoun: 'lab movers',
    eqSection: (c) => ({ tag: 'research equipment', h2: `Lab and precision equipment in ${c.city}`, intro: `University core facilities, clinical labs, and production QC labs around ${c.city} all run on instruments that are heavy where it hurts and fragile where it matters. The equipment we move includes:`, chips: ['Electron microscopes', 'NMR spectrometers', 'Mass spectrometers', 'Ultra-low freezers', 'Semiconductor process tools', 'Test stands and environmental chambers'] }),
  },

  'printing-press-movers': {
    name: 'Printing Press Movers', serviceType: 'Printing Press Moving', hero: '/assets/img/loads/load-machine-loadout.jpg', band: '/assets/img/loads/crating-shrink-wrap-electrical-equipment.jpg',
    tag: 'printing press movers', quote: 'Press Move', coverageNoun: 'Press moves',
    snippet: `We move offset, web, flexo, and digital presses and bindery lines — disassembled with your press technicians, rigged, crated, moved, and reassembled in order.`,
    lead: (c) => `A press is a line of machines that has to go back together exactly as it came apart. Across the ${c.city} metro we take presses and bindery equipment down unit by unit with your technicians, rig and crate each piece, and set them back in order so the press can be brought up again.`,
    introH2: (c) => `Printing press movers in ${c.CS}`,
    introPs: (c) => [
      `Moving a press is mostly a sequencing problem. Each printing unit, the feeder, the delivery, the dryers and the controls come apart in an order, travel as separate loads, and have to reach the new floor in the order they go back down. ${c.metro ? `In ${c.city}, ` : ''}print and packaging shops run tight schedules, so the downtime window is usually what the whole plan is built around.`,
      `Badass Logistics works alongside your press technicians or the manufacturer's: they handle the mechanical and electrical disconnects, and we rig, skid, crate, and load each section. At the new site we set the units on the layout and our <a href="/services/millwright-services">millwrights</a> level and align them for the technicians to reconnect. Moving the whole plant? That's <a href="/services/plant-relocation">plant relocation</a>. <a href="/blog/how-to-move-a-printing-press">How to move a printing press →</a>`,
    ],
    movesH2: (c) => `Print equipment we move in ${c.city}`,
    moves: [['offset', 'Sheetfed Offset', 'Multi-unit sheetfed presses taken down, moved, and set in sequence'], ['web', 'Web Presses', 'Web press units, folders, and reel stands rigged and relocated'], ['flexo', 'Flexo &amp; Packaging', 'Flexo, converting, and packaging lines moved for packaging plants'], ['bindery', 'Bindery &amp; Finishing', 'Cutters, folders, stitchers, and finishing lines moved and set']],
    faq: (c) => [
      [`Do you move printing presses in ${c.city}?`, `Yes — sheetfed, web, flexo, and digital presses and bindery equipment throughout ${c.CS} and the surrounding metro. <a href="/contact">Get a quote →</a>`],
      [`Do you disassemble the press?`, `Your press technicians or the manufacturer's handle the mechanical and electrical teardown. We rig, skid, crate, and load each section, and set them back in order at the new site.`],
      [`Can you level the press after the move?`, `Yes. Our millwrights set the units on the layout and level them, so your technicians can reconnect and register the press.`],
      [`Can you remove a press we sold?`, `Yes. We rig it out, crate or prep it, and load it for the buyer. See <a href="/services/machinery-removal">machinery removal</a>.`],
    ],
    titleFn: (CS) => `Printing Press Movers in ${CS} | Badass Logistics`,
    descFn: (CS) => `Printing press movers in ${CS} — sheetfed, web, flexo, and digital presses and bindery lines rigged, moved, and set back in order.`,
    quoteFactors: ['Press make, model, number of units, and the bindery and finishing equipment', 'Who handles the teardown — in-house technicians or the manufacturer', 'Access at both sites: doors, docks, and floor', 'The downtime window and the restart date', 'Crating, staging, and the order the loads arrive in'],
    pillarFile: 'services/printing-press-movers.html', sentinel: 'PP_METROS', cardNoun: 'press movers',
    eqSection: (c) => ({ tag: 'print & packaging', h2: `Print and packaging equipment in ${c.city}`, intro: `Commercial printers, newspaper plants, and packaging and converting shops around ${c.city} run lines that come apart in sections. The equipment we move includes:`, chips: ['Sheetfed offset presses', 'Web presses and folders', 'Flexo and converting lines', 'Digital presses', 'Cutters and folders', 'Stitchers and binders'] }),
  },

  'data-center-rigging': {
    name: 'Data Center Rigging', serviceType: 'Data Center Rigging', hero: '/assets/img/loads/load-flatbed-electrical.jpg', band: '/assets/img/loads/crating-shrink-wrap-electrical-equipment.jpg',
    tag: 'data center rigging', quote: 'Data Center', coverageNoun: 'Data center jobs',
    snippet: `We rig generators, UPS modules and batteries, switchgear, PDUs, CRAH and chiller units, and loaded racks into new builds and live data centers — on routes and schedules set around the facility.`,
    lead: (c) => `Data center equipment arrives heavy, dense, and on a schedule that the rest of the build depends on. Across the ${c.city} metro we rig the electrical and cooling plant into new halls and live facilities — generators into yards, switchgear into electrical rooms, cooling onto roofs, and racks onto raised floors.`,
    introH2: (c) => `Data center rigging in ${c.CS}`,
    introPs: (c) => [
      `A data center is built around equipment that weighs more per square foot than almost anything else in a commercial building. Generators, UPS battery strings, and switchgear lineups have to land precisely on their pads and in their rooms, and in a live facility they have to do it without disturbing the halls that are already running. ${c.metro ? `Around ${c.city}, ` : ''}the route, the floor loading, and the timing are planned before the first truck arrives.`,
      `Badass Logistics rigs the heavy plant for data centers — outside, by crane or by <a href="/services/heavy-lift-rigging">jacking and skidding</a>, and inside on skates and air-ride. Electrical connection, battery commissioning, and testing stay with your electrical contractor and the OEM; we set what they connect. For the generators and transformers themselves, see <a href="/services/transformer-generator-rigging">transformer and generator rigging</a>. <a href="/blog/how-to-move-a-data-center">How to move a data center →</a>`,
    ],
    movesH2: (c) => `Data center equipment we rig in ${c.city}`,
    moves: [['generators', 'Generators &amp; Yards', 'Standby generators and fuel systems set in yards and enclosures'], ['power', 'UPS, Switchgear &amp; PDUs', 'UPS modules, battery cabinets, switchgear, and PDUs moved into electrical rooms'], ['cooling', 'CRAH &amp; Chillers', 'Cooling units, chillers, and condensers set inside and on roofs'], ['racks', 'Racks &amp; Cabinets', 'Loaded racks and cabinets moved on air-ride within live halls']],
    faq: (c) => [
      [`Do you provide data center rigging in ${c.city}?`, `Yes — generators, UPS and batteries, switchgear, cooling units, and racks for new builds and live facilities throughout ${c.CS} and the surrounding metro. <a href="/contact">Get a quote →</a>`],
      [`Can you work in a live data center?`, `Yes. Routes, floor protection, and timing are planned with the facility team so running halls are not disturbed.`],
      [`Do you connect or commission the equipment?`, `No. Electrical connection, battery commissioning, and testing are done by your electrical contractor and the OEM. We rig and set the equipment for them.`],
      [`Can you move loaded server racks?`, `Yes, on air-ride equipment and inside the manufacturer's tilt and shock limits, when the owner prefers to move racks loaded.`],
    ],
    titleFn: (CS) => `Data Center Rigging in ${CS} | Badass Logistics`,
    descFn: (CS) => `Data center rigging in ${CS} — generators, UPS and batteries, switchgear, cooling units, and racks set into new builds and live facilities.`,
    quoteFactors: ['The equipment list, weights, and set locations', 'New build or live facility, and the site\'s access and work rules', 'Floor loading and raised-floor ratings along the route', 'Crane or jacking and skidding for yard and roof equipment', 'Which trades connect and commission, and the schedule they work to'],
    pillarFile: 'services/data-center-rigging.html', sentinel: 'DC_METROS', cardNoun: 'data center riggers',
    eqSection: (c) => ({ tag: 'critical facilities', h2: `Data center equipment around ${c.city}`, intro: `Colocation halls, hyperscale campuses, and enterprise data rooms around ${c.city} are built on the same heavy electrical and cooling plant. The equipment we rig includes:`, chips: ['Standby generators', 'UPS modules and battery cabinets', 'Switchgear and PDUs', 'CRAH and CRAC units', 'Chillers and condensers', 'Server racks and cabinets'] }),
  },
};

const METRO_COPY = {
  // heavy-lift: the building fights the load — stock and equipment lead.
  'heavy-lift-rigging': {
    base: (c, m) => enough(m.stock, m.equipment && m.equipment.length >= 3) ? [
      m.stock ? `The buildings decide the method in ${c.city}. The stock here is ${trimDot(m.stock)}, which is why so many heavy pieces move under a gantry or on skid track rather than on a hook.` : '',
      (m.equipment && m.equipment.length >= 3) ? `The heaviest loads in the metro are ${oxford(m.equipment)} — each one planned from its weight, lift points, and the floor under it.` : '',
    ].filter(Boolean).join(' ') : '',
    floor: (c, m) => enough(m.sectors && m.sectors.length, m.corridors && m.corridors.length) ? [
      m.sectors && m.sectors.length ? `That equipment serves ${c.city}'s ${oxford(m.sectors)}, where a lift usually happens beside machinery that keeps running.` : '',
      m.corridors && m.corridors.length ? `Most of our jacking and gantry work here lands in ${oxford(m.corridors)}.` : '',
    ].filter(Boolean).join(' ') : '',
    away: (c, m) => enough(m.rail, m.port) ? [
      `The heaviest pieces bound for ${c.city} often arrive by rail or water before they ever reach a road.`,
      m.rail ? `${trimDot(m.rail)}.` : '',
      m.port ? `${trimDot(m.port)}.` : '',
      `Getting a load off a railcar or a barge and onto a trailer is jacking and cribbing work in its own right, and it goes into the same plan as the set at the far end.`,
    ].filter(Boolean).join(' ') : '',
    faq: (c, m) => (m.equipment && m.equipment.length && m.corridors && m.corridors.length) ? [
      `What do you jack and skid in ${c.city}?`,
      `Most often ${oxford(m.equipment)}, in ${oxford(m.corridors)} and the plants around them. <a href="/contact">Get a quote →</a>`,
    ] : null,
  },

  // hvac: the building is the job — buildings sentence and campuses lead.
  'hvac-chiller-rigging': {
    base: (c, m) => { const a = A(m); return enough(a.buildings, has(a.health) || has(a.research) ? 'x' : '') ? [
      `Large HVAC plant in ${c.city} is concentrated in campuses that run around the clock.`,
      has(a.health) ? `The metro's hospitals — ${oxford(L(a.health))} — replace chillers and boilers without ever closing a wing.` : '',
      has(a.research) ? `${oxford(L(a.research, 2))} ${L(a.research, 2).length === 1 ? 'runs' : 'run'} central plants of their own, often in basements reached by one freight elevator or a single knockout wall.` : '',
    ].filter(Boolean).join(' ') : ''; },
    floor: (c, m) => enough(m.stock, m.corridors && m.corridors.length) ? [
      m.stock ? `On the industrial side, ${c.city}'s plants are ${trimDot(m.stock)}, and process cooling there means chillers, towers, and air handlers set on mezzanines and roofs.` : '',
      m.corridors && m.corridors.length ? `That work concentrates in ${oxford(m.corridors)}.` : '',
    ].filter(Boolean).join(' ') : '',
    away: (c, m) => { const a = A(m); return has(a.datacenter) ? [
      `Data centers are the other big buyer of cooling plant in ${c.city}. ${oxford(L(a.datacenter, 2))} ${L(a.datacenter, 2).length === 1 ? 'runs' : 'run'} chillers, CRAH units, and condensers that are replaced and added on the facility's schedule, not the weather's.`,
    ].join(' ') : ''; },
    faq: (c, m) => { const a = A(m); return a.buildings ? [
      `What kinds of ${c.city} buildings do you rig HVAC equipment for?`,
      `${trimDot(a.buildings)}. We rig chillers, boilers, towers, and air handlers into all of them. <a href="/contact">Get a quote →</a>`,
    ] : null; },
  },

  // transformer: the grid and the pad — energy anchors lead, then site.
  'transformer-generator-rigging': {
    base: (c, m) => { const a = A(m); return enough(has(a.energy) ? 'x' : '', has(a.datacenter) ? 'x' : '', m.sectors && m.sectors.length) ? [
      has(a.energy) ? `Transformer and generator work in ${c.city} follows the grid: ${oxford(L(a.energy))}.` : '',
      has(a.datacenter) ? `Demand has grown with the metro's data center build-out — ${oxford(L(a.datacenter, 2))} — where every hall arrives with its own transformers, gensets, and switchgear.` : '',
      m.sectors && m.sectors.length ? `Plants in the metro's ${oxford(m.sectors)} add standby power and unit substations on their own schedule.` : '',
    ].filter(Boolean).join(' ') : ''; },
    floor: (c, m) => enough(m.corridors && m.corridors.length, m.stock) ? [
      m.corridors && m.corridors.length ? `Pad work here lands in ${oxford(m.corridors)}, where trailer access to the pad decides whether the unit is craned or jacked and skidded.` : '',
      m.stock ? `Indoor sets are harder: ${c.city}'s buildings are ${trimDot(m.stock)}, and a unit headed for an electrical room is planned around every door on the way.` : '',
    ].filter(Boolean).join(' ') : '',
    away: (c, m) => enough(m.rail, m.port) ? [
      `Large units for ${c.city} often arrive by more than one mode.`,
      m.rail ? `${trimDot(m.rail)}.` : '',
      m.port ? `${trimDot(m.port)}.` : '',
      `Wherever the unit comes off, the rigging from that point to the pad is one plan.`,
    ].filter(Boolean).join(' ') : '',
    faq: (c, m) => { const a = A(m); return has(a.energy) ? [
      `Who uses transformer and generator rigging in ${c.city}?`,
      `Utilities, plants, data centers, and campuses across ${c.CS}. The metro's power base includes ${oxford(L(a.energy))}. <a href="/contact">Get a quote →</a>`,
    ] : null; },
  },

  // mri: health systems lead; the building is the constraint.
  'mri-medical-equipment-rigging': {
    base: (c, m) => { const a = A(m); return has(a.health) ? [
      `${c.city}'s imaging work is anchored by its health systems — ${oxford(L(a.health, 4))} — and by the outpatient imaging centers that ring them.`,
      `Each of them replaces scanners on a cycle, and each replacement means a magnet out, a magnet in, and a suite that has to reopen on a date.`,
    ].join(' ') : ''; },
    floor: (c, m) => { const a = A(m); return a.buildings ? [
      `The buildings set the route. ${trimDot(a.buildings)}, and an imaging suite in any of them can sit on an upper floor, in a basement, or behind a corridor that was never built for a magnet.`,
    ].join(' ') : ''; },
    away: (c, m) => { const a = A(m); return has(a.research) ? [
      `Research imaging adds a second kind of job. ${oxford(L(a.research, 3))} ${L(a.research, 3).length === 1 ? 'runs' : 'run'} scanners and instruments outside the clinical schedule, often in older research buildings where the route has to be engineered around floors that were never rated for a magnet.`,
    ].join(' ') : ''; },
    faq: (c, m) => { const a = A(m); return has(a.health) ? [
      `Which ${c.city} facilities need MRI rigging?`,
      `Hospitals and imaging centers across ${c.CS} — the metro is home to ${oxford(L(a.health))}. We rig for the OEM's install schedule at any of them. <a href="/contact">Get a quote →</a>`,
    ] : null; },
  },

  // lab: research anchors lead; health as the clinical lab side.
  'lab-equipment-movers': {
    base: (c, m) => { const a = A(m); return has(a.research) ? [
      `Lab moves in ${c.city} follow its research base: ${oxford(L(a.research, 4))}.`,
      `Those are buildings full of instruments that cost more than the rooms they sit in, moved on timelines set by grants, validation, and experiments that can't be paused for long.`,
    ].join(' ') : ''; },
    floor: (c, m) => { const a = A(m); return enough(has(a.health) ? 'x' : '', m.sectors && m.sectors.length) ? [
      has(a.health) ? `Clinical and hospital labs add to it — ${oxford(L(a.health, 2))} ${L(a.health, 2).length === 1 ? 'runs' : 'run'} analyzers, freezers, and sterilizers that move every time a lab is reorganized.` : '',
      m.sectors && m.sectors.length ? `On the industrial side, the metro's ${oxford(m.sectors)} keep QC and test labs of their own.` : '',
    ].filter(Boolean).join(' ') : ''; },
    away: (c, m) => { const a = A(m); return enough(a.buildings, m.corridors && m.corridors.length) ? [
      a.buildings ? `The buildings vary as much as the instruments: ${lower1(trimDot(a.buildings))}.` : '',
      m.corridors && m.corridors.length ? `Industrial test and QC labs sit further out, in ${oxford(m.corridors)}, where a lab move often happens inside a plant that keeps running.` : '',
    ].filter(Boolean).join(' ') : ''; },
    faq: (c, m) => { const a = A(m); return has(a.research) ? [
      `Do you move labs for ${c.city} universities and research centers?`,
      `Yes. The metro's research base includes ${oxford(L(a.research))}, and we move instruments for labs like these inside the vendor's handling spec. <a href="/contact">Get a quote →</a>`,
    ] : null; },
  },

  // printing: print anchors lead; industrial stock is the floor.
  'printing-press-movers': {
    base: (c, m) => { const a = A(m); return has(a.print) ? [
      `${c.city}'s print and packaging base includes ${oxford(L(a.print, 4))}.`,
      `Shops like these replace and relocate presses on tight downtime windows, so the teardown, the loads, and the reassembly are scheduled as one job.`,
    ].join(' ') : ''; },
    floor: (c, m) => enough(m.stock, m.corridors && m.corridors.length) ? [
      m.stock ? `The floor is the constraint. ${c.city}'s industrial buildings are ${trimDot(m.stock)}, and a press needs a level slab with the capacity for its heaviest unit before anything is set.` : '',
      m.corridors && m.corridors.length ? `Most print and converting floors here sit in ${oxford(m.corridors)}.` : '',
    ].filter(Boolean).join(' ') : '',
    away: (c, m) => enough(m.rail, m.port) ? [
      `Presses moving into or out of ${c.city} rarely travel as one load.`,
      m.port ? `${trimDot(m.port)}.` : '',
      m.rail ? `${trimDot(m.rail)}.` : '',
      `A used press sold overseas or bought in from another plant is crated unit by unit and sequenced so the sections reach the floor in the order they go back down.`,
    ].filter(Boolean).join(' ') : '',
    faq: (c, m) => { const a = A(m); return has(a.print) ? [
      `Do you move presses for ${c.city} print and packaging plants?`,
      `Yes — the metro's base includes ${oxford(L(a.print))}, and we move presses and bindery lines for shops of every size. <a href="/contact">Get a quote →</a>`,
    ] : null; },
  },

  // data center: the market and the grid that feeds it.
  'data-center-rigging': {
    base: (c, m) => { const a = A(m); return has(a.datacenter) ? [
      `${c.city}'s data center market includes ${oxford(L(a.datacenter, 4))}.`,
      `New halls there arrive as a sequence of heavy deliveries — generators, switchgear, UPS, cooling — and each one has to land on its pad or in its room before the next trade can start.`,
    ].join(' ') : ''; },
    floor: (c, m) => { const a = A(m); return has(a.energy) ? [
      `The power behind those halls is local too: ${oxford(L(a.energy))}. Substation and transformer work for a new campus often runs alongside the hall itself.`,
      a.buildings ? `Outside the dedicated campuses, enterprise data rooms sit in the metro's wider building stock — ${lower1(trimDot(a.buildings))} — where every delivery shares a dock and an elevator with a working building.` : '',
    ].filter(Boolean).join(' ') : ''; },
    away: (c, m) => enough(m.rail, m.port) ? [
      `Long-lead gear for ${c.city} halls — power transformers, switchgear lineups, and generator sets — is often built far from the site.`,
      m.rail ? `${trimDot(m.rail)}.` : '',
      m.port ? `${trimDot(m.port)}.` : '',
      `Each of those deliveries is booked against the construction schedule, so a late or damaged unit holds up every trade behind it.`,
    ].filter(Boolean).join(' ') : '',
    faq: (c, m) => { const a = A(m); return has(a.datacenter) ? [
      `Do you rig equipment for ${c.city} data centers?`,
      `Yes — new builds and live facilities across ${c.CS}, a market that includes ${oxford(L(a.datacenter))}. <a href="/contact">Get a quote →</a>`,
    ] : null; },
  },
};

const CITY_GUIDES = {
  'heavy-lift-rigging': [['jacking-and-skidding-explained', 'Jacking and Skidding, Explained'], ['floor-loading-for-machinery', 'Floor Loading for Machinery'], ['what-is-a-critical-lift', 'What Is a Critical Lift?']],
  'hvac-chiller-rigging': [['how-to-move-a-boiler-or-chiller', 'How to Move a Boiler or Chiller'], ['crane-rental-vs-rigging-company', 'Crane Rental vs a Rigging Company'], ['what-is-a-critical-lift', 'What Is a Critical Lift?']],
  'transformer-generator-rigging': [['how-to-move-a-transformer-into-a-building', 'How to Move a Transformer Into a Building'], ['switchgear-and-substation-equipment-moving', 'Switchgear &amp; Substation Equipment Moving'], ['jacking-and-skidding-explained', 'Jacking and Skidding, Explained']],
  'mri-medical-equipment-rigging': [['how-to-move-an-mri-machine', 'How to Move an MRI Machine'], ['how-to-move-a-pet-ct-scanner', 'How to Move a PET/CT Scanner'], ['floor-loading-for-machinery', 'Floor Loading for Machinery']],
  'lab-equipment-movers': [['how-to-move-a-lab-freezer', 'How to Move a Lab Freezer'], ['how-to-move-an-autoclave', 'How to Move an Autoclave'], ['how-to-move-an-mri-machine', 'How to Move an MRI Machine']],
  'printing-press-movers': [['how-to-move-a-printing-press', 'How to Move a Printing Press'], ['machine-leveling-and-alignment', 'Machine Leveling &amp; Alignment'], ['plant-relocation-checklist', 'The Plant Relocation Checklist']],
  'data-center-rigging': [['how-to-move-a-data-center', 'How to Move a Data Center'], ['switchgear-and-substation-equipment-moving', 'Switchgear &amp; Substation Equipment Moving'], ['how-to-move-a-transformer-into-a-building', 'How to Move a Transformer Into a Building']],
};

// label used in the "same crew also handles" sibling line and city hubs
const WAVE3 = [
  ['heavy-lift-rigging', 'heavy lift rigging', 'Heavy lift rigging', 'gantries, jacking, and skidding'],
  ['hvac-chiller-rigging', 'chiller and HVAC rigging', 'Chiller &amp; HVAC rigging', 'chillers, boilers, and rooftop units'],
  ['transformer-generator-rigging', 'transformer and generator rigging', 'Transformer &amp; generator rigging', 'pads, vaults, and switchgear'],
  ['mri-medical-equipment-rigging', 'MRI and medical equipment rigging', 'MRI &amp; medical rigging', 'MRI, CT, and imaging suites'],
  ['lab-equipment-movers', 'lab equipment moving', 'Lab equipment movers', 'microscopes, NMR, and freezers'],
  ['printing-press-movers', 'printing press moving', 'Printing press movers', 'presses and bindery lines'],
  ['data-center-rigging', 'data center rigging', 'Data center rigging', 'generators, UPS, and switchgear'],
];

module.exports = { SERVICES, METRO_COPY, CITY_GUIDES, WAVE3 };
