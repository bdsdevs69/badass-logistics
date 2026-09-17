// /services/dedicated-lanes — project FTL and dedicated capacity. Project-based only.
module.exports = {
  slug: 'dedicated-lanes',
  cardBlurb: 'Truckload and dedicated capacity reserved for the life of a project — same lane, same schedule, synced with the crew.',
  title: 'Dedicated Trucking Services & Project Lanes | Badass Logistics',
  description: 'Dedicated freight lanes and truckload capacity for industrial projects — relocations, phased deliveries, and recurring site runs, scheduled with the rigging crew.',
  serviceType: 'Dedicated Lane & Project Truckload Management',
  hero: '/assets/img/loads/tarped-flatbed-load-blue-kenworth.jpg',
  band: '/assets/img/loads/step-deck-industrial-air-handlers.jpg',
  bandAnnots: ['RUN 9 OF 26 ✓', 'SAME LANE — DAILY'],
  tag: 'project freight — dedicated lanes &amp; ftl',
  h1: 'Dedicated Lanes &amp; <span class="y">Project FTL</span>',
  lead: 'When a project needs dozens of truckloads between the same two places, booking them one at a time is how schedules slip. We set up dedicated lanes and truckload capacity for the length of the project — the right equipment, on a fixed cadence, timed to the crews loading and unloading it.',
  cta: 'Plan a Dedicated Lane',
  ctaHref: '/quote-project-freight',
  annots: ['LANE: PLANT A → PLANT B', '2 TRUCKS / DAY', 'AIR-RIDE ✓', 'DELIVERY 06:00–10:00'],
  bgnotes: ['SAME TRUCKS DAILY', 'LOAD 14 OF 40', 'WINDOW 06:00', 'CREW READY ✓', 'AIR-RIDE', 'STEP DECK — TALL', 'TARPED ✓', 'POD + PHOTOS', 'LANE LOCKED', 'PHASE 2 RUNS', 'NO SPOT BOOKING', 'RETURN LOAD: RACKING'],
  quickAnswer: 'A dedicated lane is truck capacity reserved on a specific route for a set period, instead of booking each load on the spot market. Badass Logistics sets up dedicated lanes and full-truckload capacity for industrial projects — plant relocations, phased equipment deliveries, and recurring runs between warehouses and job sites — through our licensed broker and carrier partners, with delivery windows synced to our rigging crews.',
  intro: {
    h2: 'Project capacity, not spot loads',
    paragraphs: [
      'The spot market works fine for one load. It falls apart on a project. A <a href="/services/plant-relocation">plant relocation</a> might need forty loads over three weeks between the same two buildings. A build-out might take deliveries every morning for two months. Book those one at a time and you get different trucks, different equipment, different arrival times, and a crew standing around waiting for whichever load shows up first.',
      'Dedicated lanes fix that by reserving the capacity up front. We work out how many loads the project really needs, the equipment each type of freight requires, and the cadence the loading and unloading crews can handle — then line up capacity through our licensed broker and carrier partners to run that lane for the life of the project. Same lane, same schedule, often the same drivers who learn the sites.',
      'This is the freight side of our <a href="/services/project-freight">project freight</a> work. We don\'t sell dedicated capacity for general freight or one-off loads. The lanes exist because a project needs them, and they\'re planned together with the <a href="/services/rigging">rigging</a> at both ends.',
    ],
  },
  capabilities: {
    tag: 'what\'s included',
    h2: 'Dedicated lane management',
    items: [
      { k: 'planning', h: 'Lane &amp; Volume Planning', p: 'Load counts, cadence, and equipment worked out from the project\'s asset list and schedule.' },
      { k: 'equipment', h: 'Equipment Matched to Freight', p: 'Dry van, air-ride, flatbed, step deck, and conestoga assigned by what each load needs.' },
      { k: 'ftl', h: 'Project Truckloads', p: 'Full truckloads for equipment packages and phases that don\'t need a standing lane.' },
      { k: 'windows', h: 'Delivery Windows', p: 'Pickups and deliveries scheduled around the crews loading and setting the freight.' },
      { k: 'visibility', h: 'Tracking &amp; Records', p: 'In-transit updates, photos at loading, and signed paperwork for every run.' },
      { k: 'returns', h: 'Round-Trip Planning', p: 'Backhauls of empty crates, racking, or tooling planned into the lane where the project allows.' },
    ],
  },
  sections: [
    {
      tag: 'when it fits',
      h2: 'When a project needs its own lane',
      paragraphs: [
        'Dedicated capacity makes sense when the freight is predictable enough to plan and important enough that a missed truck costs more than the capacity itself. The most common cases:',
      ],
      subsections: [
        { h: 'Plant relocations and consolidations', paragraphs: ['Many loads between two fixed sites over a set period, sequenced to the teardown and reinstall.'] },
        { h: 'Phased equipment deliveries', paragraphs: ['A production line, data center, or hospital build-out receiving equipment in a planned order as the site becomes ready.'] },
        { h: 'Warehouse-to-site runs', paragraphs: ['Staged or <a href="/services/container-to-warehouse">devanned</a> freight moving from a warehouse to a job site on a daily or weekly rhythm.'] },
        { h: 'Recurring project loads', paragraphs: ['Long-running programs with repeat moves between the same facilities, where consistency matters more than chasing the cheapest truck each time.'] },
      ],
    },
    {
      bg: 'paper',
      tag: 'getting it right',
      h2: 'How we plan a dedicated lane',
      paragraphs: [
        'A lane that\'s planned badly just locks in the same problems. These are the questions we answer before the first truck runs:',
      ],
      list: [
        'How many loads, over what period, and how many per day or week the crews can load and receive',
        'What each type of freight needs — air-ride for sensitive machines, open deck for tall or crane-loaded pieces, enclosed for crated parts',
        'Weights and dimensions per load so every truck runs legal and nothing gets double-handled',
        'Loading and delivery windows at both sites, including dock limits and site access',
        'What happens when the schedule changes — because on a real project, it will',
      ],
      after: [
        'For the difference between FTL, LTL, and dedicated capacity, see our guides to <a href="/blog/ltl-vs-ftl-freight">LTL vs FTL freight</a> and <a href="/blog/dedicated-freight-lanes-explained">dedicated freight lanes</a>.',
      ],
    },
  ],
  process: {
    h2: 'How a dedicated lane runs',
    steps: [
      { h: 'Scope the freight', p: 'Asset list, weights, dimensions, origins, destinations, and the project schedule.' },
      { h: 'Design the lane', p: 'Load count, cadence, equipment mix, and delivery windows tied to the rigging plan.' },
      { h: 'Secure capacity', p: 'Capacity committed to the lane through our licensed broker and carrier partners for the project period.' },
      { h: 'Run the lane', p: 'Loads move on schedule with tracking, photos, and signed paperwork for each run.' },
      { h: 'Adjust &amp; close out', p: 'Cadence adjusted as the project changes, then closed out with a complete record.' },
    ],
  },
  industries: {
    h2: 'Projects we run lanes for',
    items: ['Plant relocations', 'Production line installs', 'Data center build-outs', 'Hospital &amp; imaging projects', 'Warehouse &amp; automation projects', 'Energy &amp; utility projects', 'Equipment OEM programs', 'Multi-site consolidations'],
  },
  faq: [
    { q: 'What is a dedicated freight lane?', a: 'Truck capacity reserved on a specific route for a set period, instead of booking each load on the spot market. It gives a project consistent equipment, timing, and often the same drivers.' },
    { q: 'Do you offer dedicated lanes for regular freight?', a: 'No. Our dedicated lanes and truckloads are for projects — relocations, installs, build-outs, and equipment programs — planned together with our <a href="/services/project-freight">project freight</a> and rigging work.' },
    { q: 'Who runs the trucks?', a: 'Our network of licensed broker and carrier partners, coordinated inside the project plan. We don\'t own trucks; we own the planning, scheduling, and coordination with the crews.' },
    { q: 'What equipment can run on a project lane?', a: 'Dry van, air-ride, flatbed, step deck, and conestoga are the most common. Each load is matched to what the freight actually needs.' },
    { q: 'How many loads does a project need before a dedicated lane makes sense?', a: 'There\'s no fixed number. It depends on how predictable the freight is, how tight the schedule is, and what a missed truck would cost the job. We work it out from your asset list.' },
    { q: 'Can the schedule change mid-project?', a: 'Yes. Cadence and load counts are adjusted as the project moves, which is one of the main reasons to have one team managing the lane and the rigging together.' },
  ],
  faqTitle: 'Dedicated lanes FAQ',
  related: ['plant-relocation', 'container-to-warehouse', 'crating-packing', 'truck-dispatch'],
  guides: [
    ['dedicated-freight-lanes-explained', 'Dedicated Freight Lanes, Explained'],
    ['ltl-vs-ftl-freight', 'LTL vs FTL Freight'],
    ['how-to-ship-industrial-machinery-on-a-flatbed', 'How to Ship Industrial Machinery on a Flatbed'],
  ],
  ctaBand: { h2: 'Got a project with a lot of loads?', p: 'Send the asset list, the sites, and the schedule. We\'ll size the lane and the equipment.' },
};
