// /services/container-to-warehouse — project freight sub-service: drayage, transloading, devanning.
module.exports = {
  slug: 'container-to-warehouse',
  cardBlurb: 'Containers of machinery pulled from port or rail, drayed to staging, devanned by riggers, inspected, and released to the project.',
  title: 'Transloading & Container Devanning Services | Badass Logistics',
  description: 'Container transloading, devanning and drayage to warehouse for project freight. Port and rail pickup, machinery rigged out of the box, inspected and staged.',
  serviceType: 'Container Drayage, Transloading & Devanning',
  hero: '/assets/img/loads/load-reels-container.jpg',
  band: '/assets/img/loads/tarped-machinery-flatbed-warehouse-loadout.jpg',
  bandAnnots: ['SEAL # MATCHED ✓', 'STAGED FOR SET'],
  tag: 'container to warehouse — project freight',
  h1: 'Container to Warehouse: <span class="y">Drayage, Transloading &amp; Devanning</span>',
  lead: 'Your machines landed at the port in a steel box, and the free-time clock started the minute it hit the ground. We get the container pulled, drayed to secure staging, and opened by riggers who know a 30,000-lb machine does not come out on a pallet jack. Devanned, inspected, staged, and released to your project on schedule.',
  cta: 'Get a Project Freight Quote',
  ctaHref: '/quote-project-freight',
  annots: ['LAST FREE DAY ✓', '40\' HIGH CUBE', 'DOOR CLEAR ✓', 'ROLLERS UNDER'],
  bgnotes: ['SEAL INTACT ✓', 'PHOTOS BEFORE DOORS', 'FLOOR RATING?', 'OPEN TOP — CRANE', 'FLAT RACK', 'CHASSIS ✓', 'EMPTY RETURN', 'DUNNAGE CUT', 'OS&amp;D NOTED', 'TRANSLOAD → 53\'', 'HOLDS CLEARED ✓'],
  quickAnswer: 'Container-to-warehouse service picks up an import container at a port or rail ramp, drays it to a warehouse or staging site, then devans it, meaning the cargo is unloaded, inspected, and staged. Badass Logistics runs it as part of a rigging or project-freight job: drayage through our licensed broker and carrier partners, heavy machines rigged out of the box by our crews, and the empty returned before per diem runs up.',
  intro: {
    h2: 'The box is the easy part. What\'s inside is the job.',
    paragraphs: [
      'Most drayage outfits see a container as a unit: pull it, drop it, return the empty. That works for cartons. It falls apart when the box is holding a machining center, a press frame, a skid of process equipment, or crated parts that belong to a production line going in next month. Somebody has to get that freight out of an 8-foot-wide steel tube without dropping it, and the dock crew with a standard forklift is usually not that somebody.',
      'That\'s where we come in. Badass Logistics is a rigging company, and container-to-warehouse work is part of our <a href="/services/project-freight">project freight</a> service. We coordinate the pickup at the port or rail ramp, manage the drayage through our licensed broker and carrier partners, and put a rigging crew on the unload. Heavy machines get jacked, skated, or pulled out on rollers. Light freight gets devanned and checked like it matters, because it does.',
      'We don\'t take single one-off containers off a load board. This is project work: a plant build-out receiving machinery in waves, a relocation with equipment coming back from overseas, a line install waiting on imported components. The containers, the staging, and the rig-in all run on one schedule, managed by one team.',
    ],
  },
  capabilities: {
    tag: 'what we handle',
    h2: 'From terminal gate to project floor',
    items: [
      { k: 'drayage', h: 'Port &amp; Rail Pickup', p: 'Containers pulled from ocean terminals and rail ramps on licensed partner drayage carriers, timed to the free-time window.' },
      { k: 'devanning', h: 'Rigged Out, Not Dragged', p: 'Heavy machines jacked, skated, or rolled out of the box by riggers instead of forced out with the wrong forklift.' },
      { k: 'transloading', h: 'Box to Trailer', p: 'Freight moved from ocean containers into domestic trailers when it has further to go.' },
      { k: 'inspection', h: 'Receive &amp; Document', p: 'Seal checks, door photos, damage and shifted-load notes recorded before anything is signed for.' },
      { k: 'staging', h: 'Secure Staging', p: 'Equipment held at warehouse partners or on site until the floor, foundation, or crew is ready.' },
      { k: 'equipment', h: 'Returns &amp; Chassis', p: 'Empties returned to the right location and chassis use tracked so per diem does not creep.' },
    ],
  },
  sections: [
    {
      tag: 'the clock',
      h2: 'Demurrage, per diem, and free time',
      paragraphs: [
        'Every import container comes with a limited number of free days. Miss the window and two different charges start stacking up, and they come from different directions.',
      ],
      subsections: [
        { h: 'Demurrage', paragraphs: ['Demurrage is charged while a loaded container sits at the terminal past its free time. It usually can\'t be pulled until customs, freight, and carrier holds are cleared, so a box can rack up days before anyone is allowed to touch it. We track holds and the last free day so the pickup is booked the moment the container is released.'] },
        { h: 'Per diem and detention', paragraphs: ['Once the container leaves the terminal, the clock switches to the ocean carrier\'s equipment. Keep the box, and sometimes the chassis, past the allowed days and per diem or detention applies until the empty is returned. That\'s why we plan the devanning date before the pickup, not after the box shows up at the dock.'] },
        { h: 'How we keep it short', paragraphs: ['Receiving staff, rigging crew, and staging space are lined up before the container gates out. When a project has a string of containers landing over several weeks, we sequence them so the floor never gets buried and the empties keep moving back.'] },
      ],
    },
    {
      bg: 'paper',
      tag: 'know the box',
      h2: 'Container types and what they mean for the unload',
      paragraphs: [
        'The container type decides how the freight comes out, so we confirm it from the booking before scheduling a crew.',
      ],
      list: [
        '<strong>Standard 20\' and 40\' dry containers:</strong> loaded and unloaded through the end doors only. The door opening is smaller than the inside of the box, so tall or wide machines get measured against it first.',
        '<strong>40\' high cube:</strong> about a foot taller than a standard box. More room for tall equipment, and more height to account for at a low dock or door.',
        '<strong>Open top:</strong> a removable tarp roof so cargo can be picked straight up and out. We plan and rig the lift and bring in the right crane for the pick.',
        '<strong>Flat rack:</strong> no sides or roof, built for machinery too wide or tall for a closed box. Unloaded by crane or a properly rated forklift from the side.',
      ],
      after: [
        'Chassis matter too. The container rides a chassis from the terminal, and it isn\'t always sitting where the box is. Heavy 20-foot containers may need a tri-axle chassis to stay legal on axle weights. Our carrier partners handle the chassis side, and we track it inside the project so a chassis delay doesn\'t quietly eat the free time.',
      ],
    },
    {
      tag: 'rigging out of a container',
      h2: 'When the machine doesn\'t come out on a pallet jack',
      paragraphs: [
        'A heavy machine inside a container is a rigging problem in a tight space. There\'s no overhead access in a closed box, the floor has a rated forklift axle load, and the machine was usually loaded with blocking and bracing that has to come out in the right order so nothing shifts.',
        'Our crews cut the dunnage, set toe jacks under the base, and put the load on rollers or skates. Then we pull it to the door with controlled force and meet it with the right forklift or a <a href="/services/heavy-lift-rigging">gantry or jack-and-slide setup</a>. Lighter freight comes out with standard <a href="/services/forklift-loading-unloading">forklift unloading</a>. Either way, nothing gets yanked out with a chain and a prayer.',
        'If the equipment is headed straight to its foundation, the same crew can take it the rest of the way: moved in, set, and handed to your installers or our <a href="/services/millwright-services">millwrights</a> for leveling.',
      ],
    },
  ],
  media: {
    tag: 'on the job',
    h2: 'Receiving project equipment the right way',
    intro: 'Unloading is where damage gets hidden or found. We make sure it gets found.',
    checklist: [
      'Seal number checked against the paperwork before the doors open',
      'Photos of the doors, the load face, and every exception',
      'Blocking and bracing removed in sequence so nothing shifts',
      'Heavy machines rigged out with jacks, rollers, and rated equipment',
      'Pieces counted, tagged, and staged by project area',
    ],
    images: [
      { src: '/assets/img/warehouse-loadout.jpg', alt: 'Large wooden crate of equipment being loaded onto a trailer inside a warehouse', caption: 'Crated equipment rigged inside a warehouse, staged for the next move.' },
    ],
  },
  process: {
    h2: 'How a container-to-warehouse job runs',
    steps: [
      { h: 'Booking &amp; packing list review', p: 'Container type, weights, dimensions, holds, and last free day confirmed before anything is scheduled.' },
      { h: 'Pickup &amp; drayage', p: 'Released containers pulled from the port or rail ramp through our licensed broker and carrier partners.' },
      { h: 'Devan &amp; rig out', p: 'Doors opened on record, dunnage removed, and freight unloaded by forklift or rigged out by our crew.' },
      { h: 'Inspect &amp; stage', p: 'Damage and shortages documented, pieces tagged, and equipment held in secure staging.' },
      { h: 'Return &amp; release', p: 'Empty returned, then equipment released to the floor, the next leg, or our rig-in crew.' },
    ],
  },
  industries: {
    h2: 'Who calls us for container work',
    items: ['Manufacturing plants', 'Machine tool importers', 'Plant build-outs &amp; expansions', 'Automotive suppliers', 'Food &amp; beverage lines', 'Packaging equipment', 'Energy &amp; utilities', 'Data centers', 'Industrial contractors', 'OEM installation teams'],
  },
  faq: [
    { q: 'What is the difference between transloading and devanning?', a: 'Devanning means unloading a container. Transloading means moving that freight from the ocean container into another conveyance, usually a domestic trailer, so it can keep moving. Many projects need both.' },
    { q: 'How do I avoid demurrage and per diem charges?', a: 'Get holds cleared early, book the pickup against the last free day, and have the unload ready before the container gates out. We plan the receiving and rigging crew first so the box doesn\'t sit waiting.' },
    { q: 'Can you unload a heavy machine from a shipping container?', a: 'Yes. Our riggers jack, skate, and roll heavy machines out of containers, and use cranes on open tops and flat racks. We check the weight against the container floor rating before any forklift goes inside.' },
    { q: 'Do you pick up single containers?', a: 'No. Container work is part of a project, such as a build-out, relocation, or line install with equipment arriving in containers. One-off drayage moves aren\'t something we take on.' },
    { q: 'Do you own the drayage trucks?', a: 'No. Drayage runs on our network of licensed broker and carrier partners, coordinated inside the project plan. Our own crews handle the rigging and devanning.' },
    { q: 'What is drayage?', a: 'Drayage is the short-distance move of a container between a port or rail ramp and a nearby warehouse or site. Our guide to <a href="/blog/what-is-drayage">what drayage is</a> covers how it works.' },
  ],
  faqTitle: 'Container to warehouse FAQ',
  related: ['crating-packing', 'dedicated-lanes', 'forklift-loading-unloading', 'machinery-moving'],
  guides: [
    ['what-is-drayage', 'What Is Drayage?'],
    ['what-is-transloading', 'What Is Transloading?'],
    ['blocking-bracing-and-dunnage-explained', 'Blocking, Bracing &amp; Dunnage Explained'],
    ['what-is-project-cargo', 'What Is Project Cargo?'],
  ],
  ctaBand: { h2: 'Containers of equipment on the way?', p: 'Send the booking, the packing list, and the site. We\'ll plan the pickup, the unload, and the staging.' },
};
