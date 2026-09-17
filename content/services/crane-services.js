// /services/crane-services — crane lifts planned and rigged by the crew. No owned-crane-fleet claim.
module.exports = {
  slug: 'crane-services',
  cardBlurb: 'Crane lifts planned, rigged, and signaled by our crew — rooftop units, machine picks, and critical lifts.',
  title: 'Crane Service & Critical Lifts | Badass Logistics',
  description: 'Crane and rigging services for industrial lifts — lift plans, critical and tandem picks, rooftop crane-ins, and equipment setting, rigged and signaled by our crew.',
  serviceType: 'Crane & Rigging Services',
  hero: '/assets/img/rigging-crane2.jpg',
  band: '/assets/img/rigging-crane.jpg',
  bandAnnots: ['BOOM 110 FT', 'LOAD ON THE HOOK ✓'],
  tag: 'crane &amp; rigging — lifts planned before they\'re picked',
  h1: 'Crane Service &amp; <span class="y">Critical Lifts</span>',
  lead: 'The crane is the easy part to find. The hard part is the lift plan, the rigging, the ground under the outriggers, and the crew that signals the pick. We plan and rig crane lifts from start to finish — and bring in the right crane for the load, the radius, and the site.',
  cta: 'Get a Crane Lift Quote',
  annots: ['RADIUS 64 FT', 'LOAD 18,500 LBS', 'CHART CHECKED ✓', 'OUTRIGGER MATS'],
  bgnotes: ['LOAD CHART ✓', 'RADIUS 64 FT', 'MATS UNDER PADS', 'SIGNAL PERSON', 'TAGLINES ON', 'SPREADER BAR', 'WIND &lt; LIMIT', 'EXCLUSION ZONE', 'PICK WEIGHT + RIGGING', 'STREET CLOSED 05:00', 'TANDEM — 2 CRANES', 'SET ON PAD ✓'],
  quickAnswer: 'Crane service for industrial work means planning, rigging, and executing lifts with a mobile, carry-deck, or larger crane — setting machines, picking rooftop units, placing equipment on foundations, or loading freight. Badass Logistics plans each lift, sizes the crane to the load and radius, rigs and signals the pick with our own crew, and sets the load — so you get one team accountable for the whole lift.',
  intro: {
    h2: 'A crane lift is a rigging job first',
    paragraphs: [
      'Renting a crane gets you a machine and an operator. It doesn\'t get you the answer to the questions that actually decide whether a lift goes well: what the load really weighs with the rigging on it, where its center of gravity is, what radius the crane has to reach, whether the ground or the slab can take the outrigger loads, and what happens if the wind picks up halfway through the pick.',
      'Badass Logistics runs crane work the way we run all <a href="/services/rigging">rigging</a>. We survey the site, get the real weight and dimensions, and build a lift plan: crane size and configuration, setup location, radius, rigging gear, sling angles, and a sequence the whole crew understands before anything leaves the ground. Then we bring in the crane that fits the plan — a carry-deck in a plant, a mobile crane in a parking lot, or larger capacity when the pick demands it.',
      'On lift day our crew rigs the load, runs the taglines, sets the exclusion zone, and signals the operator. When the load is down, we <a href="/services/millwright-services">set and level</a> it — or move it the rest of the way on skates and jacks if the crane can only get it to the door.',
    ],
  },
  capabilities: {
    tag: 'what we lift',
    h2: 'Crane lifts we plan and rig',
    items: [
      { k: 'rooftop', h: 'Rooftop Units &amp; Crane-Ins', p: 'RTUs, cooling towers, chillers, and mechanical equipment picked onto roofs and into penthouses.' },
      { k: 'machinery', h: 'Machine Picks', p: 'Presses, machining centers, and production equipment lifted on and off trucks or into buildings.' },
      { k: 'critical', h: 'Critical Lifts', p: 'Heavy, high-value, or close-to-capacity picks with detailed plans and tighter controls.' },
      { k: 'tandem', h: 'Tandem Lifts', p: 'Two-crane lifts for long, heavy, or awkward loads that need to be picked and rotated.' },
      { k: 'setting', h: 'Equipment Setting', p: 'Tanks, vessels, generators, and skids placed on foundations and pads.' },
      { k: 'load &amp; unload', h: 'Truck Loading', p: 'Crane-loaded freight for project shipments where forklifts can\'t reach or lift it.' },
    ],
  },
  sections: [
    {
      tag: 'the lift plan',
      h2: 'What goes into a crane lift plan',
      paragraphs: [
        'Every crane lift we run is written down before the crane shows up. The detail scales with the risk, but the core questions don\'t change:',
      ],
      list: [
        'Total load weight — the equipment plus the hook block, slings, shackles, and spreader or lifting beam',
        'Center of gravity and pick points, so the load comes up level and doesn\'t swing',
        'Crane setup location, radius at pick and at set, boom length, and the capacity at that configuration',
        'Ground or slab bearing under the outriggers, and cribbing or mats to spread the load',
        'Overhead power lines, structures, and swing path obstructions',
        'Wind and weather limits, exclusion zones, signal communication, and street or site closures',
      ],
      after: [
        'A lift is often treated as critical when it\'s close to the crane\'s rated capacity, uses more than one crane, happens over occupied areas or live equipment, or involves a load that can\'t be replaced. Those picks get more detailed planning and review before lift day.',
      ],
    },
    {
      bg: 'paper',
      tag: 'choosing the crane',
      h2: 'Carry-deck, mobile, or bigger',
      paragraphs: [
        'The right crane depends on the load, the reach, and where the crane can physically set up — not on what\'s closest.',
      ],
      subsections: [
        { h: 'Carry-deck and industrial cranes', paragraphs: ['Compact cranes that work inside plants and warehouses, pick and carry loads short distances, and fit where a truck crane can\'t.'] },
        { h: 'Mobile hydraulic cranes', paragraphs: ['Truck and all-terrain cranes for rooftop work, loading and unloading, and outdoor picks where the setup area is limited and the reach matters.'] },
        { h: 'Higher-capacity cranes', paragraphs: ['For heavy loads at long radius, large equipment sets, and tandem work, sized from the lift plan and brought in with the rigging it needs.'] },
        { h: 'When a crane isn\'t the answer', paragraphs: ['Inside buildings with low ceilings or no crane access, <a href="/services/heavy-lift-rigging">hydraulic gantries and jack-and-slide systems</a> often do the job more safely and with less disruption.'] },
      ],
    },
  ],
  process: {
    h2: 'How a crane lift runs',
    steps: [
      { h: 'Site survey', p: 'Load data, setup area, ground conditions, overhead hazards, and access for the crane and rigging.' },
      { h: 'Lift plan', p: 'Crane selection, configuration, radius, rigging gear, and sequence documented and reviewed.' },
      { h: 'Site prep', p: 'Permits or closures where needed, mats and cribbing, exclusion zones, and a pre-lift meeting.' },
      { h: 'Rig &amp; pick', p: 'Load rigged, test lift, then the pick signaled and controlled with taglines.' },
      { h: 'Set &amp; finish', p: 'Load set, leveled, and anchored, or moved the final distance on skates and jacks.' },
    ],
  },
  industries: {
    h2: 'Who calls us for crane work',
    items: ['Manufacturing plants', 'Mechanical contractors', 'HVAC contractors', 'Hospitals &amp; imaging centers', 'Data centers', 'Energy &amp; utilities', 'General contractors', 'Water &amp; wastewater plants', 'Food &amp; beverage', 'Commercial property managers'],
  },
  faq: [
    { q: 'Do you provide the crane?', a: 'We plan the lift and bring in the right crane for the load, radius, and site, then rig, signal, and set the load with our own crew. You deal with one team for the whole lift.' },
    { q: 'What is a critical lift?', a: 'Generally a lift close to the crane\'s rated capacity, a multi-crane lift, a pick over occupied areas or live equipment, or a load that\'s hard to replace. Critical lifts get more detailed plans and review.' },
    { q: 'Can you lift equipment onto a roof?', a: 'Yes — rooftop units, chillers, cooling towers, and mechanical equipment. See <a href="/services/hvac-chiller-rigging">chiller and HVAC rigging</a> for how rooftop replacements are planned.' },
    { q: 'Do you handle street closures for crane lifts?', a: 'We plan them into the lift and coordinate the setup, timing, and traffic control with the site and whatever local approvals the job requires.' },
    { q: 'What if a crane can\'t reach inside the building?', a: 'The crane sets the load at the door or on the dock, and our crew moves it the rest of the way with <a href="/services/heavy-lift-rigging">jacks, skates, and gantries</a>.' },
    { q: 'How far ahead should we plan a crane lift?', a: 'As early as possible. Survey, lift planning, crane availability, and any closures all take lead time, and critical lifts take the most.' },
  ],
  faqTitle: 'Crane service FAQ',
  related: ['heavy-lift-rigging', 'hvac-chiller-rigging', 'transformer-generator-rigging', 'mri-medical-equipment-rigging'],
  guides: [
    ['types-of-rigging', 'Types of Rigging, Explained'],
    ['what-is-industrial-rigging', 'What Is Industrial Rigging?'],
    ['how-to-move-a-boiler-or-chiller', 'How to Move a Boiler or Chiller'],
  ],
  ctaBand: { h2: 'Got a pick to plan?', p: 'Send the load, the site, and where it needs to land. We\'ll size the crane and write the lift plan.' },
};
