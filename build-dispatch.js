#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — DISPATCH × EQUIPMENT generator

   Builds /services/truck-dispatch/<equipment> for each entry in
   EQUIPMENT, plus the hub at /services/truck-dispatch/equipment, then
   fills the DISPATCH_EQUIP sentinel on the truck-dispatch pillar.

   WHY EQUIPMENT AND NEVER GEO:
   /services/dispatching is a redirect stub sitting at position 5.7 — the
   best position on the site — on a page that bounces the visitor away.
   The demand is real and it is equipment-shaped, not city-shaped: the
   buyer searches "step deck dispatch service", not "dispatch service in
   Toledo". Every competitor that ranks runs the same architecture
   (Route One's slugs are literally /services/trailer-types/{type}/).
   Dispatch NEVER gets a geo page — build.js guardrail 2 fails the build
   if one appears.

   POSITIONING, and the line this file walks:
   Badass owns no trucks and holds no operating authority. These pages
   describe what OUR DESK does for a fleet that already owns the
   equipment. Trailer names are allowed here because we dispatch fleets
   that run them — they are NOT an offer to haul. Nothing on these pages
   may offer oversize, permitted, superload or escort work: that is the
   heavy haul line retired in 2026. The RGN/lowboy page says so out loud.

   Fleets of 4+ power units only. Never owner-operators.

   RUN: node build.js   (never on its own — see README)
   =========================================================== */
const fs = require('fs');
const path = require('path');
const { topbar, header, footer, headAssets, PHONE, PHONE_HREF } = require('./lib/chrome');

const ROOT = __dirname;
const DOMAIN = 'https://badasslogistics.com';
const OUT_DIR = path.join(ROOT, 'services', 'truck-dispatch');
const PILLAR = path.join(ROOT, 'services', 'truck-dispatch.html');
const SENTINEL = 'DISPATCH_EQUIP';

const esc = (s) => String(s).replace(/"/g, '&quot;');
const strip = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

// Only link blog guides that are live articles, never redirect stubs —
// build.js check 2 fails the build on a link into a stub.
function liveGuide(slug) {
  const f = path.join(ROOT, 'blog', `${slug}.html`);
  return fs.existsSync(f) && !fs.readFileSync(f, 'utf8').includes('<!--REDIRECT-->');
}
function assertImg(p, slug) {
  if (!fs.existsSync(path.join(ROOT, p.replace(/^\//, '')))) throw new Error(`[dispatch/${slug}] image not found: ${p}`);
}

// ---------- EQUIPMENT ----------
// Each entry has to earn its page. The `desk` block is the part that is
// genuinely different per equipment type — what a dispatcher has to know
// and plan around before a load on that equipment is ever booked. If two
// entries could swap their `desk` copy without anyone noticing, one of
// them should not exist.
const EQUIPMENT = {
  'dry-van': {
    name: 'Dry Van Dispatch',
    short: 'Dry Van',
    blurb: 'Van fleets running appointment freight — lane density, drop-and-hook programs, and detention billed as it happens.',
    title: 'Dry Van Dispatch Service for Fleets | Badass Logistics',
    description: 'Dry van dispatch for trucking companies running 4+ trucks. Lane planning, drop-and-hook programs, appointment freight, detention and lumper recovery, full back office.',
    tag: 'dry van dispatch — fleets of 4+',
    hero: '/assets/img/brokerage-dryvan.jpg',
    annots: ['DROP & HOOK ✓', 'APPT 06:00', 'DETENTION BILLED', 'RELOAD LINED UP'],
    h1: 'Dry Van Dispatch for <span class="y">Fleets</span>',
    lead: 'Van freight is a density game. Our desk dispatches van fleets of four trucks and up — planning reloads so a truck empties where the next load is, chasing the drop-trailer programs that keep drivers off docks, and billing detention the day it happens instead of arguing about it a month later.',
    quick: 'Dry van dispatch is load sourcing, rate negotiation and back-office work for a trucking company running enclosed 53ft trailers. Badass Logistics dispatches van fleets of four or more power units — never owner-operators. You keep your own authority and approve every load; our desk plans lanes, books the freight, and runs the paperwork.',
    whatH2: 'What dry van fleets actually get dispatched into',
    what: [
      'Dry van is the deepest freight pool in the country and the most competitive, which means the money is almost never in the individual rate — it is in how few empty miles a truck runs between loads. Palletized consumer goods, packaged food and beverage, paper and packaging, and retail DC replenishment make up most of what a van fleet on our desk sees.',
      'The freight is appointment-driven end to end. A van load is booked against a delivery window, not a delivery day, and a truck that misses a window at a grocery or retail DC can lose most of a day waiting for the next open door. Planning around those windows is most of what a van dispatcher does.',
    ],
    freightH2: 'Typical dry van freight on the desk',
    freight: [
      ['retail', 'Retail DC replenishment', 'Palletized consumer goods into regional distribution centres on tight appointment windows.'],
      ['food', 'Packaged food &amp; beverage', 'Ambient, non-temp-controlled grocery freight — steady, high-frequency, appointment-heavy.'],
      ['paper', 'Paper &amp; packaging', 'Rolls, cartons and corrugate out of mills and converters, usually floor-loaded or clamp-loaded.'],
      ['general', 'General palletized freight', 'Manufactured goods, parts and MRO moving between plants and warehouses.'],
    ],
    deskH2: 'What our desk does differently on van freight',
    desk: [
      { h: 'Reloads planned to the empty, not to the load', p: 'A van truck that delivers into a market with no outbound freight has just donated a day. We plan the next load before the current one delivers, and we would rather take a fair rate out of a strong market than a good rate into a dead one.' },
      { h: 'Drop-and-hook programs chased on purpose', p: 'Live-load and live-unload van freight burns driver hours at both ends. Drop-trailer programs at shippers and DCs are worth real money to a fleet, and getting into them takes a desk that asks for them and keeps the carrier packet current. We chase them.' },
      { h: 'Detention and lumpers documented as they happen', p: 'Van freight generates more detention and more lumper fees than any other equipment type, and both get written off constantly because nobody recorded the in and out times. Our desk timestamps arrival and release on every load and files with the paperwork, not from memory.' },
      { h: 'Appointment windows treated as the constraint they are', p: 'We book against the driver\'s available hours and the receiver\'s window together. A load that pays well but cannot legally be delivered on time is not a load we put on your truck.' },
    ],
    rateH2: 'What moves a dry van rate',
    rates: [
      'Lane density at the destination — how much outbound freight exists where the truck empties',
      'Live load and unload versus a drop-trailer program at either end',
      'Appointment window width, and whether the receiver runs first-come-first-served',
      'Lumper fees, and whether the shipper or broker reimburses them',
      'Deadhead to the next pickup, counted into the load and not after it',
    ],
    faq: [
      ['Do you dispatch dry van fleets?', 'Yes — dry van dispatch for trucking companies running four or more power units under their own authority. We do not dispatch single-truck owner-operators. <a href="/quote-dispatch">Apply for fleet dispatch →</a>'],
      ['How many trucks do I need for dry van dispatch?', 'Four power units and up. Van freight rewards planning reloads across several trucks at once, which is exactly what stops working on one or two trucks.'],
      ['Do you handle detention and lumper fees?', 'Yes. Arrival and release times are recorded on every load as they happen, and detention, layover and TONU are billed with the paperwork rather than reconstructed later. Lumper receipts are submitted with the invoice packet.'],
      ['Can you get my fleet into drop-and-hook programs?', 'We chase them where they exist, because they are worth more to a van fleet than a few cents a mile. It depends on the shipper, your trailer count and your setup paperwork being current — which the desk keeps on file for you.'],
      ['Do I keep my own authority?', 'Always. You keep your authority, your insurance and your drivers, and you approve every load before it is booked. No forced dispatch.'],
    ],
    siblings: ['reefer', 'power-only', 'ltl-partial'],
    guides: [['ltl-vs-ftl-freight', 'LTL vs FTL Freight'], ['how-do-truck-dispatchers-get-paid', 'How Do Truck Dispatchers Get Paid?']],
  },

  'reefer': {
    name: 'Reefer Dispatch',
    short: 'Reefer',
    blurb: 'Temperature-controlled fleets — set points on the rate con, download-backed claims defence, and seasonal lane planning.',
    title: 'Reefer Dispatch Service for Fleets | Badass Logistics',
    description: 'Reefer dispatch for trucking companies running 4+ trucks. Temperature-controlled freight, set points confirmed in writing, washouts, multi-stop planning and claims defence.',
    tag: 'reefer dispatch — fleets of 4+',
    hero: '/assets/img/loads/load-reefer-produce.jpg',
    annots: ['SET POINT 34°F', 'CONTINUOUS ✓', 'PULP TEMP LOGGED', 'WASHOUT PAID'],
    h1: 'Reefer Dispatch for <span class="y">Temperature-Controlled Fleets</span>',
    lead: 'Reefer freight pays better than van and punishes mistakes harder. Our desk dispatches temperature-controlled fleets of four trucks and up — set point and run mode confirmed in writing before the truck loads, washouts and multi-stop time priced in, and the download kept so a rejected load is a claim you can win.',
    quick: 'Reefer dispatch is load sourcing and back-office work for a trucking company running temperature-controlled trailers. Badass Logistics dispatches reefer fleets of four or more power units. Our desk confirms set point and run mode on every rate confirmation, prices washouts and multi-stop time in, and keeps the temperature record that defends a claim.',
    whatH2: 'What reefer fleets haul, and why the freight is different',
    what: [
      'Produce, protein, dairy, frozen and ambient-controlled pharma and consumer goods make up most reefer freight. What separates it from van is not the trailer — it is that the cargo can be rejected on arrival for a reason that has nothing to do with whether it arrived on time.',
      'A reefer claim is usually decided by three things: what set point was agreed, what run mode the unit was in, and what the download says the box actually did. A dispatcher who books the load without pinning down the first two has handed the fleet an argument it cannot win.',
    ],
    freightH2: 'Typical reefer freight on the desk',
    freight: [
      ['produce', 'Produce', 'Seasonal, regional and perishable — the freight that inverts lane pricing twice a year.'],
      ['protein', 'Protein &amp; dairy', 'Meat, poultry and dairy out of processors, usually on tight windows with strict washout requirements.'],
      ['frozen', 'Frozen &amp; ice cream', 'Deep-frozen freight where a brief set-point lapse is a total-loss claim.'],
      ['controlled', 'Controlled ambient', 'Pharma, beverages and consumer goods that ride in a reefer to hold a range, not to freeze.'],
    ],
    deskH2: 'What our desk does differently on reefer freight',
    desk: [
      { h: 'Set point and run mode in writing, every time', p: 'Before a reefer load is accepted, the rate confirmation has to state the set point and whether the unit runs continuous or cycle-sentry. Verbal instructions from a shipping clerk are not a defence when a receiver rejects at the dock.' },
      { h: 'Pre-cool and pulp temps treated as part of the job', p: 'A trailer pre-cooled to the set point before loading, and pulp temperatures taken at the door on product that warrants it, are the two steps that keep a marginal load from becoming a claim. We plan the time for them into the pickup instead of pretending they take none.' },
      { h: 'Washouts and multi-stop time priced, not absorbed', p: 'A protein load out of a plant that requires a wash-out certificate costs the fleet time and money, and so does a three-stop delivery. Both get negotiated into the rate up front rather than discovered on the settlement.' },
      { h: 'Seasonal lanes planned before the season turns', p: 'Reefer lane pricing inverts on a schedule — spring out of the south, summer through the upper midwest and northwest, the pre-holiday protein run. A desk that only reads today\'s board is always a month behind the market.' },
    ],
    rateH2: 'What moves a reefer rate',
    rates: [
      'Set point and run mode — continuous burns fuel that cycle-sentry does not',
      'Washout requirements, and whether the shipper or the receiver pays for one',
      'Multi-pick and multi-drop stops, and the hours each one costs the driver',
      'Season and direction — the same lane prices differently in April than in October',
      'Rejection exposure on the commodity, and what the receiver\'s tolerance actually is',
    ],
    faq: [
      ['Do you dispatch reefer fleets?', 'Yes — reefer dispatch for trucking companies running four or more power units under their own authority, never single-truck owner-operators. <a href="/quote-dispatch">Apply for fleet dispatch →</a>'],
      ['How do you handle temperature claims?', 'By making them defensible before they happen: set point and run mode confirmed on the rate confirmation, pre-cool and pulp-temp steps planned into the pickup, and the unit download preserved with the load file. Most reefer claims are lost on missing paperwork, not on a failed unit.'],
      ['Do you book multi-stop reefer loads?', 'Yes, when the stop pay covers the hours. Each additional stop costs a driver time that comes out of the same clock as the drive, so we price it in rather than treating extra stops as free.'],
      ['Do you dispatch produce season?', 'Yes. Produce is where reefer lane pricing inverts, and we plan fleet positioning ahead of the turn instead of chasing it after rates have already moved.'],
      ['Do I keep my own authority and insurance?', 'Yes. You keep your authority, your insurance and your drivers, and you approve every load before it is booked.'],
    ],
    siblings: ['dry-van', 'flatbed', 'power-only'],
    guides: [['ltl-vs-ftl-freight', 'LTL vs FTL Freight'], ['how-do-truck-dispatchers-get-paid', 'How Do Truck Dispatchers Get Paid?']],
  },

  'flatbed': {
    name: 'Flatbed Dispatch',
    short: 'Flatbed',
    blurb: 'Open-deck fleets — tarp pay negotiated up front, mill and yard queue time priced in, securement planned before booking.',
    title: 'Flatbed Dispatch Service for Fleets | Badass Logistics',
    description: 'Flatbed dispatch for trucking companies running 4+ trucks. Open-deck freight, tarp pay negotiated up front, securement planned before booking, mill and yard time priced in.',
    tag: 'flatbed dispatch — fleets of 4+',
    hero: '/assets/img/loads/flatbed-load-securement-yellow-straps.jpg',
    annots: ['TARP PAY ✓', '4 STRAPS + 2 CHAINS', 'MILL QUEUE 3 HRS', 'LOAD SECURED'],
    h1: 'Flatbed Dispatch for <span class="y">Open-Deck Fleets</span>',
    lead: 'Flatbed pays for work a van driver never does, and a desk that books it like van freight gives that work away. We dispatch open-deck fleets of four trucks and up — tarp pay negotiated before the load is accepted, securement understood before it is priced, and mill and yard queue time counted as the hours it really costs.',
    quick: 'Flatbed dispatch is load sourcing and rate work for a trucking company running open-deck trailers. Badass Logistics dispatches flatbed fleets of four or more power units. Our desk negotiates tarp pay up front, prices securement and mill queue time into the rate, and keeps the paperwork so detention on a yard is billed rather than absorbed.',
    whatH2: 'What flatbed fleets haul, and where the margin hides',
    what: [
      'Steel and coil, lumber and building materials, pipe, structural fabrication, machinery and palletized industrial goods make up most open-deck freight. It is the equipment type where the load itself demands labour: strapping, chaining, edge protection, blocking and — on a large share of it — tarping.',
      'That labour is where flatbed margin is won or lost. Tarping a steel load properly is an hour of hard physical work in whatever weather is happening, and a rate that does not pay for it is a rate that quietly transfers the cost to your driver. Our field guides on <a href="/blog/how-to-tarp-a-flatbed-load">tarping a flatbed load</a> and <a href="/blog/blocking-bracing-and-dunnage-explained">blocking, bracing and dunnage</a> cover what that work actually involves.',
    ],
    freightH2: 'Typical flatbed freight on the desk',
    freight: [
      ['steel', 'Steel, coil &amp; plate', 'Out of mills and service centres — heavy, dense, and almost always a tarp load.'],
      ['building', 'Lumber &amp; building materials', 'Bundled lumber, drywall, roofing and brick into yards and job sites.'],
      ['pipe', 'Pipe &amp; structural', 'Pipe, beam and fabricated structural steel, chained and blocked rather than strapped.'],
      ['machinery', 'Machinery &amp; industrial goods', 'Crated and skidded equipment, including freight coming out of our own rigging projects.'],
    ],
    deskH2: 'What our desk does differently on open-deck freight',
    desk: [
      { h: 'Tarp pay negotiated before the load is accepted', p: 'How many tarps, and who pays for them, is settled on the rate confirmation — not discovered at the mill gate. A load that needs a steel tarp and a lumber tarp is a different job from a load that rides bare, and it gets priced as one.' },
      { h: 'Securement understood before the rate is quoted', p: 'Strap and chain count, edge protection, dunnage and whether the shipper loads or the driver does all change how long a pickup takes. A dispatcher who cannot picture how the load sits on the deck cannot price the time it takes to secure it.' },
      { h: 'Mill and yard queue time counted', p: 'Steel mills, lumber yards and fabrication shops run on their own clock and routinely hold a truck for hours. We record in and out times and pursue detention on open-deck freight the same way we do on a grocery dock.' },
      { h: 'Weather planned into the lane, not reacted to', p: 'A tarped load in a crosswind and a tarped load in January are two different problems, and both belong in the plan before the truck rolls. We route and schedule around them rather than calling a driver mid-run to improvise.' },
    ],
    rateH2: 'What moves a flatbed rate',
    rates: [
      'Tarping: how many tarps, what kind, and who supplies them',
      'Securement work — strap and chain count, edge protection, dunnage and blocking',
      'Whether the shipper loads the trailer or the driver does it',
      'Mill, yard or job-site queue time, and whether detention is payable after it',
      'Backhaul depth out of the delivery market for an open-deck truck specifically',
    ],
    faq: [
      ['Do you dispatch flatbed fleets?', 'Yes — flatbed dispatch for trucking companies running four or more power units under their own authority. We do not dispatch single-truck owner-operators. <a href="/quote-dispatch">Apply for fleet dispatch →</a>'],
      ['Do you negotiate tarp pay?', 'On every load that needs a tarp. Tarp count and who supplies them go on the rate confirmation before the load is accepted, because tarping is an hour of real work and a rate that ignores it is a rate that charges your driver for it.'],
      ['Does Badass Logistics haul the freight itself?', 'No. Badass Logistics is an industrial rigging company and holds no operating authority — we own no trucks. Our desk dispatches your fleet, and freight on our own rigging projects moves through our licensed broker and carrier partners.'],
      ['Do you dispatch oversize or permitted loads?', 'No. Our desk books legal-weight, legal-dimension open-deck freight. Permitted oversize work, escorts and superloads are outside what we arrange — that service line was retired in 2026.'],
      ['Where does flatbed freight on your desk come from?', 'Direct shippers, vetted brokers and the boards, plus freight generated by our own <a href="/services/rigging">rigging</a> and <a href="/services/project-freight">project freight</a> work — crated machinery and industrial equipment that has to move between plants.'],
    ],
    siblings: ['step-deck', 'conestoga', 'reefer'],
    guides: [['how-to-tarp-a-flatbed-load', 'How to Tarp a Flatbed Load'], ['step-deck-vs-drop-deck-trailers', 'Step Deck vs Drop Deck Trailers'], ['blocking-bracing-and-dunnage-explained', 'Blocking, Bracing and Dunnage Explained']],
  },

  'step-deck': {
    name: 'Step Deck Dispatch',
    short: 'Step Deck',
    blurb: 'Drop-deck fleets — freight that needs the lower deck to stay legal height, booked as ordinary freight.',
    title: 'Step Deck Dispatch Service for Fleets | Badass Logistics',
    description: 'Step deck dispatch for trucking companies running 4+ trucks. Drop-deck freight that needs the lower deck to stay legal height, ramps, tarping and securement planned before booking.',
    tag: 'step deck dispatch — fleets of 4+',
    hero: '/assets/img/loads/step-deck-industrial-air-handlers.jpg',
    annots: ['DECK HEIGHT 3\'6"', 'LEGAL HEIGHT ✓', 'RAMPS ON BOARD', 'NO PERMIT NEEDED'],
    h1: 'Step Deck Dispatch for <span class="y">Drop-Deck Fleets</span>',
    lead: 'A step deck exists for one reason: to carry freight that would not clear legal height on a flatbed. Our desk dispatches step deck and drop deck fleets of four trucks and up, and books the freight where that lower deck is the whole point — so the load moves as ordinary legal freight instead of becoming somebody\'s permit problem.',
    quick: 'Step deck dispatch is load sourcing and rate work for a trucking company running drop-deck trailers. Badass Logistics dispatches step deck fleets of four or more power units. The desk targets freight that genuinely needs the lower deck to stay within legal height, and books it as legal-dimension freight — no oversize or permitted work.',
    whatH2: 'What a step deck is actually for',
    what: [
      'A step deck drops behind the tractor to a lower main deck, buying roughly three feet of usable load height over a standard flatbed. That is the entire economic argument for the trailer: a machine, a tank or a crated assembly that would sit above legal height on a flatbed rides on a step deck as ordinary freight, with no permit, no route survey and no escort.',
      'Which means a step deck is worth a premium only when the freight needs the deck height. Booking a step deck onto freight that would have ridden fine on a flatbed is how a drop-deck fleet ends up competing on flatbed rates with a more expensive trailer. Our guide on <a href="/blog/step-deck-vs-drop-deck-trailers">step deck vs drop deck trailers</a> covers where the line sits.',
    ],
    freightH2: 'Typical step deck freight on the desk',
    freight: [
      ['machinery', 'Tall machinery &amp; equipment', 'Machines and assemblies that exceed legal height on a flatbed and clear it on a drop deck.'],
      ['rolling', 'Rolling &amp; drive-on equipment', 'Wheeled and tracked equipment loaded over ramps onto the lower deck.'],
      ['tanks', 'Tanks, vessels &amp; air handlers', 'Process vessels and HVAC units that ride within legal height on a drop deck and would not on a flatbed.'],
      ['crated', 'Crated industrial freight', 'Tall crates and skidded assemblies, including freight out of our own rigging projects.'],
    ],
    deskH2: 'What our desk does differently on step deck freight',
    desk: [
      { h: 'The deck height is the qualifying question', p: 'Before a step deck load is quoted, we want the freight\'s real loaded height, not the shipper\'s estimate. That single number decides whether the trailer is earning its premium, whether the load is legal, and whether it should be on a step deck at all.' },
      { h: 'Legal-dimension freight only', p: 'Our desk books loads that move within legal height, width and weight. If a load needs a permit, a route survey or an escort, it is not freight we book — and we say so on the first call rather than putting your fleet in that position.' },
      { h: 'Ramps and loading method settled before pickup', p: 'Drive-on freight needs ramps, a surface that will take them, and a shipper who can actually load. Confirming that up front is the difference between a two-hour pickup and a wasted day.' },
      { h: 'Tarping priced separately from the deck', p: 'A step deck load that also needs tarps is two jobs, and the rate has to carry both. Tarp pay is negotiated on its own rather than folded into a deck-height premium.' },
    ],
    rateH2: 'What moves a step deck rate',
    rates: [
      'Loaded height, and whether the freight genuinely needs the lower deck',
      'Loading method — crane or forklift onto the deck, or drive-on over ramps',
      'Tarping, negotiated separately from the deck-height premium',
      'Securement work: chains, straps, edge protection and blocking for the specific piece',
      'How thin drop-deck capacity is in the pickup market that week',
    ],
    faq: [
      ['Do you dispatch step deck fleets?', 'Yes — step deck and drop deck dispatch for trucking companies running four or more power units under their own authority. Never single-truck owner-operators. <a href="/quote-dispatch">Apply for fleet dispatch →</a>'],
      ['What is the difference between a step deck and a drop deck?', 'In everyday use they are the same trailer — a deck that steps down behind the tractor to gain load height. Our guide on <a href="/blog/step-deck-vs-drop-deck-trailers">step deck vs drop deck trailers</a> covers the terminology and where a double drop is a genuinely different piece of equipment.'],
      ['Do you dispatch oversize or permitted step deck loads?', 'No. The desk books legal-height, legal-width, legal-weight freight. Permits, route surveys, escorts and superloads are outside what we arrange — the heavy haul service line was retired in 2026.'],
      ['How do you keep a step deck from hauling flatbed-rate freight?', 'By qualifying on loaded height before quoting. A step deck earns its premium when the freight needs the deck, and we would rather put a flatbed load on a flatbed than run your more expensive trailer at a flatbed rate.'],
      ['Do I keep my own authority?', 'Yes — your authority, your insurance, your drivers, and you approve every load before it is booked.'],
    ],
    siblings: ['flatbed', 'conestoga', 'rgn-lowboy'],
    guides: [['step-deck-vs-drop-deck-trailers', 'Step Deck vs Drop Deck Trailers'], ['how-to-tarp-a-flatbed-load', 'How to Tarp a Flatbed Load']],
  },

  'conestoga': {
    name: 'Conestoga Dispatch',
    short: 'Conestoga',
    blurb: 'Rolling-tarp fleets — freight that has to stay dry and cannot go in a van, without an hour of tarping at each end.',
    title: 'Conestoga Dispatch Service for Fleets | Badass Logistics',
    description: 'Conestoga dispatch for trucking companies running 4+ trucks. Rolling-tarp freight that must stay dry, side-load access, curtain condition and availability premium handled by the desk.',
    tag: 'conestoga dispatch — fleets of 4+',
    hero: '/assets/img/loads/conestoga-wrapped-equipment-inside-curtain.jpg',
    annots: ['CURTAIN ROLLED BACK', 'NO TARPING ✓', 'SIDE-LOAD ACCESS', 'DRY & COVERED'],
    h1: 'Conestoga Dispatch for <span class="y">Rolling-Tarp Fleets</span>',
    lead: 'A Conestoga trades capital cost for driver hours: the load is covered in minutes instead of tarped in an hour. Our desk dispatches Conestoga fleets of four trucks and up onto the freight that actually pays for that trade — machinery, coils and crated equipment that has to stay dry and will not fit in a van.',
    quick: 'Conestoga dispatch is load sourcing and rate work for a trucking company running rolling-tarp trailers. Badass Logistics dispatches Conestoga fleets of four or more power units. The desk targets freight that must stay dry and cannot go in a dry van, and prices in the side-load access and availability premium the equipment commands.',
    whatH2: 'Where a Conestoga earns its keep',
    what: [
      'A Conestoga is a flatbed or drop deck with a rolling curtain frame over it. The load gets crane or forklift access from the side, then the curtain rolls closed and the freight is covered — no tarps, no straps thrown over the top in the rain, no hour of physical work at each end.',
      'That matters most on freight that must stay dry but cannot go in a dry van: machinery too wide or too awkward to come through a rear door, coils, crated equipment, finished fabrication with a paint surface worth protecting. Our guide on <a href="/blog/how-to-load-and-secure-a-conestoga-trailer">loading and securing a Conestoga</a> covers what the inside of that job looks like.',
    ],
    freightH2: 'Typical Conestoga freight on the desk',
    freight: [
      ['machinery', 'Machinery &amp; fabrication', 'Equipment and finished fabrication that has to arrive dry and unmarked.'],
      ['coils', 'Coils &amp; sensitive steel', 'Steel that would be tarped on a flatbed, loaded from the side and covered in minutes.'],
      ['crated', 'Crated &amp; wrapped equipment', 'Shrink-wrapped and crated industrial freight, including loads out of our own rigging work.'],
      ['nodrip', 'No-tarp shippers', 'Shippers and receivers who will not accept a tarped load, or cannot load through a rear door.'],
    ],
    deskH2: 'What our desk does differently on Conestoga freight',
    desk: [
      { h: 'We book the freight that pays for the trailer', p: 'A Conestoga costs more to buy and more to maintain than a flatbed. Running it on freight that would have tarped fine is how that investment stops paying. We target the loads where the curtain is the reason the shipper chose the truck.' },
      { h: 'Side-load access confirmed at both ends', p: 'A Conestoga is loaded from the side. If the receiver has a dock and no yard space to roll the curtain back, the trailer\'s advantage evaporates. We confirm access at pickup and delivery before booking, not on arrival.' },
      { h: 'Curtain condition treated as a liability question', p: 'Torn curtains and bent bows are expensive, and a load damaged through a compromised curtain is a claim. We keep the fleet\'s equipment condition in the conversation instead of booking around it.' },
      { h: 'The availability premium negotiated, not assumed', p: 'There are far fewer Conestogas than flatbeds on the road. That scarcity is worth money on the right freight, and it is worth nothing on the wrong freight — the desk\'s job is knowing which load is which.' },
    ],
    rateH2: 'What moves a Conestoga rate',
    rates: [
      'Whether the freight genuinely requires cover, or would have ridden tarped',
      'Side-load access and yard space to roll the curtain back at both ends',
      'How scarce Conestoga capacity is in the pickup market that week',
      'Securement inside the curtain — straps, dunnage and blocking for the piece',
      'Backhaul depth for a Conestoga specifically out of the delivery market',
    ],
    faq: [
      ['Do you dispatch Conestoga fleets?', 'Yes — Conestoga dispatch for trucking companies running four or more power units under their own authority, never single-truck owner-operators. <a href="/quote-dispatch">Apply for fleet dispatch →</a>'],
      ['Is a Conestoga worth the premium over a flatbed?', 'On the right freight, yes — it removes roughly an hour of tarping at each end and satisfies shippers who will not accept a tarped load. On freight that would have tarped fine, you are running a more expensive trailer for a flatbed rate, which is what the desk exists to avoid.'],
      ['What if the receiver has no room to roll the curtain back?', 'Then the trailer\'s advantage is gone and the load takes longer than a flatbed would. We confirm side-load access at both ends before booking rather than finding out when the driver arrives.'],
      ['Do you dispatch oversize or permitted Conestoga loads?', 'No. The desk books legal-dimension, legal-weight freight only. Permitted oversize work and escorts are outside what we arrange.'],
      ['Where does the freight come from?', 'Direct shippers, vetted brokers and the boards, plus crated and wrapped equipment generated by our own <a href="/services/rigging">rigging</a> and <a href="/services/project-freight">project freight</a> projects.'],
    ],
    siblings: ['flatbed', 'step-deck', 'dry-van'],
    guides: [['how-to-load-and-secure-a-conestoga-trailer', 'How to Load and Secure a Conestoga Trailer'], ['how-to-tarp-a-flatbed-load', 'How to Tarp a Flatbed Load']],
  },

  'rgn-lowboy': {
    name: 'RGN &amp; Lowboy Dispatch',
    short: 'RGN / Lowboy',
    blurb: 'Well-deck fleets running legal-weight, legal-dimension freight. Permitted oversize work is not something this desk books.',
    title: 'RGN &amp; Lowboy Dispatch for Fleets | Badass Logistics',
    description: 'RGN and lowboy dispatch for trucking companies running 4+ trucks — legal-weight, legal-dimension drive-on freight. We do not book permitted oversize, escorts or superloads.',
    tag: 'rgn &amp; lowboy dispatch — fleets of 4+',
    hero: '/assets/img/loads/load-lowboy-warehouse.jpg',
    annots: ['LEGAL WEIGHT ONLY', 'DRIVE-ON ✓', 'GOOSENECK DETACHED', 'NO PERMIT WORK'],
    h1: 'RGN &amp; Lowboy Dispatch for <span class="y">Well-Deck Fleets</span>',
    lead: 'An RGN drops its gooseneck so equipment drives straight onto the well. Our desk dispatches RGN and lowboy fleets of four trucks and up on legal-weight, legal-dimension freight. Read the next paragraph before you call: permitted oversize work is deliberately not part of this.',
    quick: 'RGN and lowboy dispatch is load sourcing and rate work for a trucking company running removable-gooseneck or fixed-neck well-deck trailers. Badass Logistics dispatches these fleets on legal-weight, legal-dimension freight only. We do not book permitted oversize loads, superloads or escorted moves — that service line was retired in 2026.',
    whatH2: 'What this desk books, and what it does not',
    what: [
      'Say the limit first, because it decides whether we are any use to you. Our desk books <strong>legal-weight, legal-dimension</strong> freight on RGN and lowboy equipment. We do not source, price or book permitted oversize loads, superloads, escorted moves or anything requiring a route survey. Badass Logistics retired its heavy haul line in 2026 and we are not quietly running it through the dispatch desk.',
      'Plenty of RGN work is legal freight. A removable gooseneck drops to the ground so wheeled and tracked equipment drives onto a well deck that sits far lower than any flatbed — which is exactly how a machine that is tall but not overweight moves without a permit. That is the freight we book. If your fleet also runs permitted work, keep that with whoever handles your permits; the desk covers the legal side of your board.',
    ],
    freightH2: 'Typical RGN and lowboy freight on the desk',
    freight: [
      ['driveon', 'Drive-on equipment', 'Wheeled and tracked machines that load under their own power onto the well.'],
      ['tall', 'Tall but legal freight', 'Pieces that clear legal height only because the well deck sits so low.'],
      ['dealer', 'Dealer &amp; rental fleet moves', 'Equipment moving between yards, dealers and rental branches within legal limits.'],
      ['plant', 'Plant equipment relocations', 'Legal-dimension machines moving between facilities, including our own rigging projects.'],
    ],
    deskH2: 'What our desk does differently on well-deck freight',
    desk: [
      { h: 'The legal/permit line is checked before anything is quoted', p: 'Weight, height, width and length get confirmed against legal limits before a rate goes out. A load that crosses into permit territory is declined, not quietly booked and handed to your driver to sort out at a scale house.' },
      { h: 'Loading method settled at both ends', p: 'Drive-on, crane-on or forklift-on changes the pickup entirely. So does the ground the gooseneck has to drop onto. We confirm it before the truck is committed rather than discovering it in a gravel yard.' },
      { h: 'Deck length and axle configuration matched to the piece', p: 'Well length, axle count and how the weight sits over the deck decide whether a given machine can legally ride on a given trailer. We match the equipment to the piece instead of assuming any RGN takes any load.' },
      { h: 'Rigging expertise on the other side of the wall', p: 'Badass is a rigging company first. When a piece needs to be lifted onto the deck rather than driven on, we know what that job involves — and freight from our own <a href="/services/machinery-moving">machinery moving</a> work lands on this desk.' },
    ],
    rateH2: 'What moves an RGN or lowboy rate',
    rates: [
      'Whether the piece drives on, or has to be lifted on and rigged down',
      'Deck length and axle configuration needed for the weight distribution',
      'Ground conditions where the gooseneck detaches at pickup and delivery',
      'Securement — chain count and tie-down points on the machine itself',
      'How thin well-deck capacity is out of the pickup market that week',
    ],
    faq: [
      ['Do you dispatch RGN and lowboy fleets?', 'Yes — for trucking companies running four or more power units under their own authority, on legal-weight, legal-dimension freight only. <a href="/quote-dispatch">Apply for fleet dispatch →</a>'],
      ['Do you book permitted oversize loads or superloads?', 'No. Our desk books legal-weight, legal-dimension freight. Permits, route surveys, escorts and superloads are outside what we arrange. Badass Logistics retired its heavy haul service line in 2026 and does not run it through the dispatch desk.'],
      ['Why dispatch RGN fleets at all if you will not book permit work?', 'Because a large share of well-deck freight is legal. Equipment that is tall but not overweight moves on an RGN precisely so it does not need a permit, and that freight still has to be found, priced and papered. We cover that side of your board.'],
      ['Does Badass Logistics own trucks or haul the freight?', 'No. Badass Logistics is an industrial rigging company, holds no operating authority and owns no trucks. Freight on our own rigging projects moves through our licensed broker and carrier partners.'],
      ['Can you dispatch a fleet that runs both legal and permitted work?', 'Yes — we run the legal side of it. Your permitted moves stay with whoever handles your permits and escorts, and we keep the rest of the fleet covered.'],
    ],
    siblings: ['step-deck', 'flatbed', 'power-only'],
    guides: [['step-deck-vs-drop-deck-trailers', 'Step Deck vs Drop Deck Trailers'], ['how-to-ship-a-forklift', 'How to Ship a Forklift']],
  },

  'power-only': {
    name: 'Power Only Dispatch',
    short: 'Power Only',
    blurb: 'Tractor-only fleets pulling shipper and 3PL trailer pools — interchange terms and trailer condition handled up front.',
    title: 'Power Only Dispatch Service for Fleets | Badass Logistics',
    description: 'Power only dispatch for trucking companies running 4+ tractors. Drop-trailer programs, interchange agreements, trailer condition documentation and program-based lane planning.',
    tag: 'power only dispatch — fleets of 4+',
    hero: '/assets/img/brokerage-truck.jpg',
    annots: ['NO TRAILER CAPITAL', 'INTERCHANGE ON FILE', 'PRE-HOOK PHOTOS ✓', 'PROGRAM FREIGHT'],
    h1: 'Power Only Dispatch for <span class="y">Tractor Fleets</span>',
    lead: 'Power only lets a fleet grow tractors without buying trailers. Our desk dispatches power-only fleets of four trucks and up into shipper and 3PL trailer programs — with the interchange terms read before you sign and the trailer\'s condition documented before your driver pulls it.',
    quick: 'Power only dispatch is load sourcing for a trucking company running tractors that pull trailers owned by the shipper, broker or 3PL. Badass Logistics dispatches power-only fleets of four or more power units, reviews trailer interchange terms before a program starts, and builds the condition record that protects you on a trailer you do not own.',
    whatH2: 'How power only actually works for a fleet',
    what: [
      'In a power-only arrangement your tractor shows up, hooks a loaded trailer that belongs to someone else, and delivers it. No trailer purchase, no trailer maintenance, no trailer sitting empty depreciating — which is why a growing fleet can add revenue-earning tractors far faster on power only than on any other equipment type.',
      'The trade is that you are responsible for equipment you do not control. Tyres, lights, brakes and a roof you never inspected become your problem the moment the driver hooks, and a trailer interchange agreement decides who pays when something goes wrong. That agreement, not the rate, is the thing a power-only dispatcher has to get right.',
    ],
    freightH2: 'Typical power only work on the desk',
    freight: [
      ['pools', 'Shipper trailer pools', 'Dedicated drop-trailer programs at manufacturers and distribution centres.'],
      ['3pl', '3PL &amp; broker fleets', 'Pulling brokered trailer networks on a program basis rather than load by load.'],
      ['relay', 'Relay &amp; shuttle runs', 'Short repeatable moves between plants, yards and rail ramps.'],
      ['surge', 'Seasonal surge capacity', 'Covering a shipper\'s trailer pool through a peak without them adding tractors.'],
    ],
    deskH2: 'What our desk does differently on power only',
    desk: [
      { h: 'The interchange agreement gets read before you sign', p: 'Who carries physical damage on the trailer, who pays for a roadside tyre, what happens if a trailer is damaged in a yard you never entered — that is all in the interchange terms. We read them and flag what they put on your fleet before the program starts.' },
      { h: 'Trailer condition documented at every hook', p: 'Photos at hook, noted defects, and a record of what the trailer looked like when your driver took it. It takes two minutes and it is the only thing standing between your fleet and a damage claim for something that was already broken.' },
      { h: 'Programs prioritised over one-off spot hooks', p: 'Power only pays best as a repeating program, not as a load-by-load scramble. We target shippers and 3PLs running real trailer pools so your tractors have somewhere to go every week.' },
      { h: 'Detention rules confirmed per program', p: 'Detention on power only works differently — a driver may be waiting on a trailer rather than on a dock. What counts, and from when, is settled per program up front.' },
    ],
    rateH2: 'What moves a power only rate',
    rates: [
      'Program versus spot — a standing trailer pool prices differently from a one-off hook',
      'Interchange terms, and how much equipment liability lands on your fleet',
      'Trailer availability and yard turn time at the hook point',
      'Length of haul, and whether the return is a loaded trailer or a bobtail',
      'Whether the program guarantees weekly volume or just offers access',
    ],
    faq: [
      ['Do you dispatch power only fleets?', 'Yes — power only dispatch for trucking companies running four or more tractors under their own authority. Never single-truck owner-operators. <a href="/quote-dispatch">Apply for fleet dispatch →</a>'],
      ['Do I need my own trailers for power only?', 'No — that is the point of it. Your tractors pull trailers owned by the shipper, broker or 3PL, which is how a fleet adds earning tractors without adding trailer capital.'],
      ['Who is liable if a trailer I do not own is damaged?', 'It depends entirely on the trailer interchange agreement, which is why we read it before a program starts and tell you what it puts on your fleet. We also build a condition record at every hook so a pre-existing defect does not become your claim.'],
      ['Is power only worth it compared to running my own trailers?', 'It depends on whether you can keep the tractors loaded. Power only removes trailer capital and maintenance but ties you to someone else\'s equipment and programs. A fleet with steady program volume usually comes out ahead; a fleet hooking one-off spot trailers usually does not.'],
      ['Do I keep my own authority?', 'Yes. Your authority, your insurance, your drivers, and you approve every load before it is booked.'],
    ],
    siblings: ['dry-van', 'reefer', 'ltl-partial'],
    guides: [['truck-dispatcher-vs-freight-broker', 'Truck Dispatcher vs Freight Broker'], ['how-do-truck-dispatchers-get-paid', 'How Do Truck Dispatchers Get Paid?']],
  },

  'hotshot': {
    name: 'Hotshot Dispatch',
    short: 'Hotshot',
    blurb: 'Class 3–5 gooseneck fleets on expedited freight — where the weight ceiling helps you and where it costs you.',
    title: 'Hotshot Dispatch Service for Fleets | Badass Logistics',
    description: 'Hotshot dispatch for trucking companies running 4+ trucks. Expedited gooseneck freight, weight-ceiling economics, deadhead control and back-office paperwork handled by the desk.',
    tag: 'hotshot dispatch — fleets of 4+',
    hero: '/assets/img/loads/gooseneck-flatbed-industrial-tanks.jpg',
    annots: ['EXPEDITED', 'GOOSENECK 40\'', 'DIRECT RUN ✓', 'WEIGHT CEILING'],
    h1: 'Hotshot Dispatch for <span class="y">Expedite Fleets</span>',
    lead: 'Hotshot wins on speed and loses on weight. Our desk dispatches hotshot fleets of four trucks and up — targeting the expedited and MRO freight where a gooseneck beats a tractor-trailer on time and cost, and turning down the loads where it quietly does not.',
    quick: 'Hotshot dispatch is load sourcing and rate work for a trucking company running class 3 to 5 trucks with gooseneck or flatbed trailers. Badass Logistics dispatches hotshot fleets of four or more trucks — never single-truck owner-operators. The desk targets expedited and smaller industrial freight where a hotshot genuinely beats a full-size truck.',
    whatH2: 'Where a hotshot wins, and where it does not',
    what: [
      'A hotshot is a medium-duty truck pulling a gooseneck or flatbed trailer. It runs direct, it can leave now, and it carries far less than a tractor-trailer. That combination is worth a premium on urgent freight — a down machine\'s replacement part, a rush fabrication, equipment a plant is waiting on — and worth nothing on freight that could have waited two days on a regular truck.',
      'The weight ceiling is the honest limit. Above a certain payload a hotshot is simply the wrong tool and a flatbed will do the job cheaper, so a desk that books a hotshot on heavy freight is burning the fleet\'s advantage. Knowing where that line sits, load by load, is most of the job.',
    ],
    freightH2: 'Typical hotshot freight on the desk',
    freight: [
      ['expedite', 'Expedited &amp; emergency freight', 'Down-machine parts and rush deliveries where the clock is the whole value.'],
      ['mro', 'MRO &amp; plant maintenance', 'Maintenance and repair parts moving into plants on short notice.'],
      ['smallequip', 'Small equipment &amp; attachments', 'Compact machines, attachments and skidded assemblies under the weight ceiling.'],
      ['partial', 'Partial industrial loads', 'Freight too big for a courier and too small to justify a full-size truck.'],
    ],
    deskH2: 'What our desk does differently on hotshot freight',
    desk: [
      { h: 'We price urgency, not miles', p: 'Expedited freight is bought on time, and a hotshot rate that is calculated from mileage alone leaves the premium on the table. The question is what the delay costs the customer, not what the lane usually pays.' },
      { h: 'The weight ceiling is checked honestly', p: 'If a load is heavy enough that a flatbed does it better, we say so. Putting heavy freight on a hotshot to fill the truck is how an expedite fleet ends up doing flatbed work at flatbed margins in a truck that was never built for it.' },
      { h: 'Deadhead controlled hard', p: 'A hotshot carries less, so empty miles hurt proportionally more. We plan the return or the next run at the same time as the outbound rather than treating the trip home as an afterthought.' },
      { h: 'Hours planned around a direct run', p: 'The selling point of expedite is that it does not stop. That only works if the driver has the hours to finish, so availability gets checked before the commitment is made, not after.' },
    ],
    rateH2: 'What moves a hotshot rate',
    rates: [
      'Urgency — what the delay is actually costing the customer',
      'Payload against the truck\'s legal ceiling, and whether a flatbed would do it cheaper',
      'Deadhead to the pickup and the odds of anything loading out of the delivery market',
      'Whether the run is direct or can take a second stop',
      'Securement and tarping, where the freight needs either',
    ],
    faq: [
      ['Do you dispatch hotshot fleets?', 'Yes — hotshot dispatch for trucking companies running four or more trucks under their own authority. We do not dispatch single-truck owner-operators, which rules out a large share of the hotshot market.'],
      ['Can a single-truck hotshot operator use your desk?', 'No. The desk is built around fleets of four or more, because planning reloads across several trucks is what makes the economics work. If you are building toward a fleet, tell us where you are headed and we will tell you honestly whether the timing works.'],
      ['When is a hotshot the wrong truck for the load?', 'When the freight is heavy enough that a flatbed carries it cheaper, or when it is not actually urgent. A hotshot sells speed and access, not capacity, and booking it on heavy non-urgent freight wastes both.'],
      ['Do you handle the paperwork and invoicing?', 'Yes — carrier packets, rate confirmations, BOLs and PODs collected, invoice packets built and factoring submissions sent, the same as on any other equipment on the desk.'],
      ['Do I keep my own authority?', 'Yes. Your authority, your insurance, your drivers, and you approve every load before it is booked.'],
    ],
    siblings: ['flatbed', 'ltl-partial', 'step-deck'],
    guides: [['truck-dispatch-for-small-fleets', 'Truck Dispatch for Small Fleets'], ['how-do-truck-dispatchers-get-paid', 'How Do Truck Dispatchers Get Paid?']],
  },

  'car-hauler': {
    name: 'Car Hauler Dispatch',
    short: 'Car Hauler',
    blurb: 'Auto transport fleets — per-unit economics, auction windows, and the damage inspection that decides every claim.',
    title: 'Car Hauler Dispatch Service for Fleets | Badass Logistics',
    description: 'Car hauler dispatch for trucking companies running 4+ trucks. Open and enclosed auto transport, auction and dealer windows, per-unit rate work and damage inspection discipline.',
    tag: 'car hauler dispatch — fleets of 4+',
    hero: '/assets/img/brokerage-freight.jpg',
    annots: ['9 UNITS LOADED', 'INSPECTION SIGNED', 'AUCTION TUE', 'ENCLOSED ✓'],
    h1: 'Car Hauler Dispatch for <span class="y">Auto Transport Fleets</span>',
    lead: 'Car hauling is priced per unit and lost per claim. Our desk dispatches auto transport fleets of four trucks and up — filling the deck against auction and dealer windows, and holding the line on the inspection discipline that decides who pays when a car arrives with a scratch.',
    quick: 'Car hauler dispatch is load sourcing and rate work for a trucking company running open or enclosed auto transport equipment. Badass Logistics dispatches car hauling fleets of four or more power units. The desk builds full decks against auction and dealer schedules and enforces the condition-report discipline that protects the fleet on damage claims.',
    whatH2: 'Why car hauling is priced differently from everything else',
    what: [
      'Every other equipment type on this desk is priced per load. Car hauling is priced per unit, which means a truck running with two empty slots is losing money on a load that still looks like a load. Filling the deck, and filling it with units that route together, is the whole job.',
      'The second difference is claims. A car is inspected at pickup and inspected again at delivery, and the gap between those two reports is where every dispute lives. A fleet with sloppy condition reports pays for damage it did not cause, repeatedly, and no rate makes that back.',
    ],
    freightH2: 'Typical car hauling work on the desk',
    freight: [
      ['auction', 'Auction runs', 'Units moving out of auctions on schedules that do not move for anybody.'],
      ['dealer', 'Dealer trades &amp; transfers', 'Inventory moving between dealer groups and rooftops.'],
      ['fleet', 'Fleet &amp; remarketing moves', 'Lease returns, rental rotations and remarketing units in volume.'],
      ['enclosed', 'Enclosed &amp; high-value', 'Specialty, classic and high-value units where the trailer is part of the product.'],
    ],
    deskH2: 'What our desk does differently on auto transport',
    desk: [
      { h: 'Decks built, not loads booked', p: 'We plan the whole deck — which units load in what order, where each one comes off, and how the route sequences — instead of booking units one at a time and hoping they fit together. Two empty slots on a nine-car deck is a bad week.' },
      { h: 'Auction and dealer windows drive the plan', p: 'Auction sale days and dealer receiving hours are fixed points the schedule has to hit. We build around them rather than discovering on Tuesday morning that a lot closed at noon.' },
      { h: 'Condition reports treated as the claims defence they are', p: 'Photographed, signed inspections at load and at delivery, every unit, no exceptions. The fleets that lose money on car hauling are almost always the ones that let this slide when they were running late.' },
      { h: 'Inoperable units flagged before dispatch', p: 'A non-running unit needs a winch and changes both loading time and deck position. It gets identified and priced before the truck arrives, not negotiated in an auction lot.' },
    ],
    rateH2: 'What moves a car hauler rate',
    rates: [
      'Units per load, and whether the deck fills or runs with empty slots',
      'Open versus enclosed, and the value of the units on board',
      'Inoperable units needing a winch, and where they sit on the deck',
      'Pickup and delivery windows — auction sale days and dealer receiving hours',
      'Route sequencing, and how many separate delivery points the deck carries',
    ],
    faq: [
      ['Do you dispatch car hauler fleets?', 'Yes — car hauler dispatch for auto transport companies running four or more power units under their own authority. Never single-truck owner-operators. <a href="/quote-dispatch">Apply for fleet dispatch →</a>'],
      ['How is car hauling priced compared to other freight?', 'Per unit rather than per load, which changes the whole planning problem. A deck running with empty slots loses money on a trip that still looks like a full load, so the desk\'s job is filling and sequencing the deck, not just finding freight.'],
      ['Do you handle damage claims?', 'We handle the discipline that decides them: photographed, signed condition reports at load and delivery on every unit, kept with the load file. Most car-hauling damage disputes are settled by whichever side has the better record.'],
      ['Can you dispatch enclosed auto transport?', 'Yes. Enclosed work is a different rate structure and a different customer — high-value, specialty and classic units where the trailer is part of what the customer is buying.'],
      ['Do I keep my own authority and insurance?', 'Yes. Your authority, your insurance, your drivers, and you approve every load before it is booked.'],
    ],
    siblings: ['dry-van', 'power-only', 'hotshot'],
    guides: [['truck-dispatcher-vs-freight-broker', 'Truck Dispatcher vs Freight Broker'], ['how-do-truck-dispatchers-get-paid', 'How Do Truck Dispatchers Get Paid?']],
  },

  'ltl-partial': {
    name: 'LTL &amp; Partial Dispatch',
    short: 'LTL / Partial',
    blurb: 'Partial truckload fleets — linear feet, co-loading two or three partials into one truck, and reclass exposure.',
    title: 'LTL &amp; Partial Truckload Dispatch for Fleets | Badass Logistics',
    description: 'LTL and partial truckload dispatch for trucking companies running 4+ trucks. Linear-foot pricing, co-loading partials, accessorial recovery and freight-class reclass exposure.',
    tag: 'ltl &amp; partial dispatch — fleets of 4+',
    hero: '/assets/img/loads/load-pallet-racking.jpg',
    annots: ['14 LINEAR FT', 'CO-LOADED x2', 'CLASS 70', 'ACCESSORIALS BILLED'],
    h1: 'LTL &amp; Partial Dispatch for <span class="y">Volume Fleets</span>',
    lead: 'Partial truckload is the freight that is too big for LTL and too small for a truck — and it is the only equipment type where a dispatcher can make a load pay twice. We dispatch partial and volume fleets of four trucks and up, pricing by linear feet and co-loading where the freight and the route allow.',
    quick: 'LTL and partial truckload dispatch is load sourcing for a trucking company hauling shipments that fill part of a trailer. Badass Logistics dispatches partial fleets of four or more power units. The desk prices by linear feet rather than by mile, co-loads compatible partials into one truck where routing allows, and pursues accessorials that otherwise go unbilled.',
    whatH2: 'Why partials are a different pricing problem',
    what: [
      'A partial is typically six to eighteen pallets: too much freight to hand to an LTL carrier without the cost climbing past a truckload rate, too little to justify one. The shipper picks partial truckload because it avoids the terminal network — the freight is loaded once and delivered once, with none of the handling that generates LTL damage.',
      'For the fleet, the unit of sale is not the mile, it is the linear foot. A partial that takes fourteen feet of deck leaves forty feet for something else, and the desk that finds that something else has turned one rate into two on the same fuel. That is where partial truckload actually makes money.',
    ],
    freightH2: 'Typical partial and volume freight on the desk',
    freight: [
      ['palletized', 'Palletized partials', 'Six to eighteen pallets moving direct, without an LTL terminal network.'],
      ['machinery', 'Machinery &amp; crated equipment', 'Single machines and crated assemblies, including freight from our own rigging jobs.'],
      ['volume', 'Volume LTL', 'Shipments large enough that an LTL quote stops making sense.'],
      ['coload', 'Co-load candidates', 'Compatible partials that route together and can share one truck.'],
    ],
    deskH2: 'What our desk does differently on partial freight',
    desk: [
      { h: 'Priced by linear feet, not by the mile', p: 'The question on a partial is what the freight costs you in deck space and what is left over. A rate quoted per mile on a fourteen-foot shipment either overcharges the customer or gives away the remaining deck.' },
      { h: 'Co-loading planned deliberately', p: 'Two partials that route together on one truck is the single biggest margin lever in this freight. It takes a desk actively looking for the second shipment while the first is still being quoted, and confirming the two are compatible before either is committed.' },
      { h: 'Freight class and reclass exposure checked', p: 'Density, dimensions and NMFC class decide what a shipment should cost, and a reclass after delivery is money out of a settled load. We confirm dimensions and class up front instead of taking the shipper\'s number on faith.' },
      { h: 'Accessorials pursued rather than absorbed', p: 'Liftgate, residential, inside delivery, limited access and appointment fees are earned work on partial freight, and they go unbilled constantly. They get recorded on the load and billed with the invoice packet.' },
    ],
    rateH2: 'What moves a partial truckload rate',
    rates: [
      'Linear feet of deck consumed, and how much usable space is left',
      'Whether the shipment can co-load with another partial on the same route',
      'Freight class and density, and the reclass exposure if dimensions are wrong',
      'Accessorials — liftgate, residential, inside delivery, limited access',
      'Number of stops, and how far each one sits off the through route',
    ],
    faq: [
      ['Do you dispatch partial truckload fleets?', 'Yes — LTL and partial truckload dispatch for trucking companies running four or more power units under their own authority. Never single-truck owner-operators. <a href="/quote-dispatch">Apply for fleet dispatch →</a>'],
      ['What is the difference between LTL and partial truckload?', 'LTL moves through a terminal network and gets handled several times; partial truckload is loaded once and delivered once on a truck that is carrying other freight alongside it. Our guide on <a href="/blog/ltl-vs-ftl-freight">LTL vs FTL freight</a> covers where each one makes sense.'],
      ['How does co-loading work?', 'Two or more compatible partials that route together share one truck. It is the biggest margin lever in this freight, and it only happens if the desk is looking for the second shipment while the first is still being quoted.'],
      ['Who pays if the freight class is wrong?', 'The carrier usually eats it unless the discrepancy is documented, which is why we confirm dimensions and density before quoting rather than accepting the shipper\'s class on faith.'],
      ['Do you bill accessorials?', 'Yes — liftgate, residential, inside delivery, limited access and appointment fees are recorded on the load as they happen and billed with the invoice packet.'],
    ],
    siblings: ['dry-van', 'hotshot', 'power-only'],
    guides: [['ltl-vs-ftl-freight', 'LTL vs FTL Freight'], ['how-do-truck-dispatchers-get-paid', 'How Do Truck Dispatchers Get Paid?']],
  },
};

const ORDER = ['dry-van', 'reefer', 'flatbed', 'step-deck', 'conestoga', 'rgn-lowboy', 'power-only', 'hotshot', 'car-hauler', 'ltl-partial'];

// ---------- shared blocks ----------
const HUB_URL = '/services/truck-dispatch/equipment';

function headBlock({ title, description, url, hero, extraSchema = [] }) {
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${strip(title)}</title>
<meta name="description" content="${esc(strip(description))}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#141414">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(strip(title))}">
<meta property="og:description" content="${esc(strip(description))}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${DOMAIN}${hero}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(strip(title))}">
<meta name="twitter:description" content="${esc(strip(description))}">
<meta name="twitter:image" content="${DOMAIN}${hero}">
${headAssets()}
${extraSchema.map(s => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`).join('\n')}
<link rel="preload" as="image" href="${hero}" fetchpriority="high">`;
}

const ctaBand = (h2, p) => `
<section class="bg-paper" style="border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);"><div class="wrap prose" style="text-align:center;">
  <h2>${h2}</h2>
  <p>${p}</p>
  <div class="cta-row" style="margin-top:22px;justify-content:center;"><a class="btn" href="/quote-dispatch">Apply for Fleet Dispatch</a> <a class="btn btn-ghost" href="tel:${PHONE_HREF}">${PHONE}</a></div>
</div></section>`;

// ---------- equipment page ----------
function equipmentPage(slug, e) {
  const url = `${DOMAIN}/services/truck-dispatch/${slug}`;
  const rel = `services/truck-dispatch/${slug}.html`;
  assertImg(e.hero, slug);

  const svcSchema = {
    '@context': 'https://schema.org', '@type': 'Service',
    serviceType: strip(e.name),
    name: strip(e.name),
    provider: { '@type': 'Organization', '@id': `${DOMAIN}/#organization`, name: 'Badass Logistics', telephone: '+1-307-284-1332', url: `${DOMAIN}/` },
    areaServed: { '@type': 'Country', name: 'United States' },
    audience: { '@type': 'BusinessAudience', name: 'Trucking companies operating 4 or more power units' },
    description: strip(e.quick),
    url,
  };
  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${DOMAIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Truck Dispatch', item: `${DOMAIN}/services/truck-dispatch` },
      { '@type': 'ListItem', position: 3, name: 'Dispatch by Equipment', item: `${DOMAIN}${HUB_URL}` },
      { '@type': 'ListItem', position: 4, name: strip(e.name), item: url },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: e.faq.map(([q, a]) => ({ '@type': 'Question', name: strip(q), acceptedAnswer: { '@type': 'Answer', text: strip(a) } })),
  };
  const webPage = { '@context': 'https://schema.org', '@type': 'WebPage', url, name: strip(e.title), speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.answer-box'] } };

  const guides = (e.guides || []).filter(([g]) => liveGuide(g));
  const siblings = (e.siblings || []).filter(s => EQUIPMENT[s]);

  return `<!DOCTYPE html>
<html lang="en">
<head>
${headBlock({ title: e.title, description: e.description, url, hero: e.hero, extraSchema: [svcSchema, breadcrumb, faqSchema, webPage] })}
</head>
<body>
${topbar()}
${header()}

<div class="wrap breadcrumb"><a href="/">Home</a> / <a href="/services/truck-dispatch">Truck Dispatch</a> / <a href="${HUB_URL}">Equipment</a> / ${strip(e.short)}</div>

<section class="page-hero photo" style="background-image:url('${e.hero}')"><div class="wrap">
  <span class="section-tag hand">// ${e.tag}</span>
  <h1>${e.h1}</h1>
  <p class="lead">${e.lead}</p>
  <div class="cta-row" style="margin-top:24px;"><a class="btn" href="/quote-dispatch">Apply for Fleet Dispatch</a></div>
</div>
  ${(e.annots || []).slice(0, 4).map((a, i) => `<span class="annot hand ${i === 0 ? 'tag warn ' : ''}${['a1', 'a4', 'a3', 'a6'][i]}">${a}</span>`).join('\n  ')}
</section>

<section><div class="wrap prose">
  <div class="answer-box"><p><strong>Quick answer:</strong> ${e.quick}</p></div>
  <h2>${e.whatH2}</h2>
  ${e.what.map(p => `<p>${p}</p>`).join('\n  ')}
</div></section>

<section class="bg-paper" style="border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);"><div class="wrap">
  <span class="section-tag hand">what the desk books</span>
  <h2 class="section-title">${e.freightH2}</h2>
  <div class="cap-grid">
    ${e.freight.map(([k, h, p]) => `<div class="cap"><div class="k">${k}</div><h3>${h}</h3><p>${p}</p></div>`).join('\n    ')}
  </div>
</div></section>

<section class="notes-bg">
  <span class="bgnote" style="top:10%;right:5%;transform:rotate(-4deg)">YOU APPROVE EVERY LOAD</span>
  <span class="bgnote" style="bottom:12%;left:4%;transform:rotate(4deg)">MIN. 4 POWER UNITS</span>
  <div class="wrap prose">
  <span class="section-tag hand">the desk</span>
  <h2>${e.deskH2}</h2>
  ${e.desk.map(d => `<h3>${d.h}</h3>\n  <p>${d.p}</p>`).join('\n  ')}
</div></section>

<section class="bg-paper notes-bg" style="border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);">
  <span class="bgnote" style="top:10%;right:5%;transform:rotate(-4deg)">NO FLAT RATES</span>
  <div class="wrap prose">
  <span class="section-tag hand">rate work</span>
  <h2>${e.rateH2}</h2>
  <p>Every load is negotiated against the lane and the work the freight actually takes. These are the factors the desk argues from — no rate sheet, and no number quoted before we know your fleet:</p>
  <ul class="checklist" style="margin-bottom:18px;">${e.rates.map(r => `<li><span>${r}</span></li>`).join('')}</ul>
</div></section>

<section><div class="wrap prose">
  <span class="section-tag hand">how this works</span>
  <h2>What stays yours</h2>
  <p>You keep your operating authority, your insurance and your drivers. You approve every load before it is booked — no forced dispatch. Hiring, maintenance, and your safety and compliance program stay in-house; the desk plugs into your company rather than replacing it.</p>
  <p>Badass Logistics is an industrial <a href="/services/rigging">rigging</a> company first, which is where the freight advantage comes from: our own projects generate loads that need covering, and <a href="/services/project-freight">project freight</a> between sites moves through our licensed broker and carrier partners. Badass holds no operating authority and owns no trucks — your fleet hauls the freight, our desk finds and papers it.</p>
  <p>See the full <a href="/services/truck-dispatch">fleet dispatch service</a>, or browse <a href="${HUB_URL}">dispatch by equipment type</a>.</p>
</div></section>

<section class="bg-paper" style="border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);"><div class="wrap">
  <span class="section-tag hand">other equipment</span>
  <h2 class="section-title">Dispatch for other equipment</h2>
  <div class="grid-services" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin-top:22px;">
    ${siblings.map(s => `<a class="svc-card" href="/services/truck-dispatch/${s}"><div class="num">// dispatch</div><h3>${EQUIPMENT[s].short}</h3><p>${EQUIPMENT[s].blurb}</p><span class="more">${strip(EQUIPMENT[s].name)} →</span></a>`).join('\n    ')}
  </div>
</div></section>
${guides.length ? `
<section><div class="wrap">
  <span class="section-tag hand">From the field guide</span>
  <h2 class="section-title">Straight answers from our blog</h2>
  <div class="grid-services" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
    ${guides.map(([g, t]) => `<a class="svc-card" href="/blog/${g}"><span class="num hand" style="margin-top:22px;">field guide</span><h3>${t}</h3><span class="more">Read the guide</span></a>`).join('\n    ')}
  </div>
</div></section>` : ''}

<section class="notes-bg"><div class="wrap prose">
  <span class="section-tag hand">questions</span>
  <h2>${strip(e.short)} dispatch FAQ</h2>
  ${e.faq.map(([q, a]) => `<h3>${q}</h3>\n  <p>${a}</p>`).join('\n  ')}
</div></section>
${ctaBand(`Running four ${strip(e.short).toLowerCase()} trucks or more?`, 'Tell us your fleet, your equipment and the lanes you want to run. We\'ll set up an onboarding call and get your trucks covered.')}

${footer(rel)}
</body>
</html>
`;
}

// ---------- hub page ----------
function hubPage() {
  const url = `${DOMAIN}${HUB_URL}`;
  const rel = 'services/truck-dispatch/equipment.html';
  const hero = '/assets/img/dispatch-agent.jpg';
  assertImg(hero, 'equipment');

  const title = 'Truck Dispatch by Equipment Type | Badass Logistics';
  const description = 'Dispatch desks for van, reefer, flatbed, step deck, Conestoga, RGN, power only, hotshot, car hauler and partial fleets — trucking companies running 4+ trucks.';

  const itemList = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: 'Truck dispatch by equipment type',
    itemListElement: ORDER.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: strip(EQUIPMENT[s].name), url: `${DOMAIN}/services/truck-dispatch/${s}` })),
  };
  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${DOMAIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Truck Dispatch', item: `${DOMAIN}/services/truck-dispatch` },
      { '@type': 'ListItem', position: 3, name: 'Dispatch by Equipment', item: url },
    ],
  };
  const faq = [
    ['Which equipment types do you dispatch?', 'Dry van, reefer, flatbed, step deck, Conestoga, RGN and lowboy, power only, hotshot, car hauler, and LTL and partial truckload — for trucking companies running four or more power units.'],
    ['Do you dispatch owner-operators?', 'No. The desk is built around fleets of four power units and up, because planning reloads across several trucks at once is what makes dispatch work as a system rather than as load-finding.'],
    ['Do you dispatch in my city or state?', 'Dispatch is not a local service and we do not run city dispatch pages. Your fleet runs wherever the freight goes; the desk works nationally and plans lanes around where your trucks actually are.'],
    ['Do you book oversize or permitted loads?', 'No. Every desk here books legal-weight, legal-dimension freight. Permits, route surveys, escorts and superloads are outside what we arrange — that service line was retired in 2026.'],
    ['Does Badass Logistics own trucks?', 'No. Badass Logistics is an industrial rigging company that holds no operating authority and owns no trucks. Our rigging and project work generates freight, which moves through our licensed broker and carrier partners — and the dispatch desk covers fleets that own their own equipment.'],
    ['Do I keep my own authority?', 'Yes. Your authority, your insurance and your drivers stay yours, and you approve every load before it is booked. No forced dispatch.'],
  ];
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: strip(q), acceptedAnswer: { '@type': 'Answer', text: strip(a) } })) };
  const webPage = { '@context': 'https://schema.org', '@type': 'WebPage', url, name: title, speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.answer-box'] } };

  return `<!DOCTYPE html>
<html lang="en">
<head>
${headBlock({ title, description, url, hero, extraSchema: [itemList, breadcrumb, faqSchema, webPage] })}
</head>
<body>
${topbar()}
${header()}

<div class="wrap breadcrumb"><a href="/">Home</a> / <a href="/services/truck-dispatch">Truck Dispatch</a> / Equipment</div>

<section class="page-hero photo" style="background-image:url('${hero}')"><div class="wrap">
  <span class="section-tag hand">// dispatch by equipment — fleets of 4+</span>
  <h1>Truck Dispatch by <span class="y">Equipment Type</span></h1>
  <p class="lead">A van dispatcher and a flatbed dispatcher are not doing the same job. Pick the equipment your fleet runs and see what our desk actually does with it — the freight it targets, the rate factors it argues from, and the work it takes off your office.</p>
  <div class="cta-row" style="margin-top:24px;"><a class="btn" href="/quote-dispatch">Apply for Fleet Dispatch</a></div>
</div>
  <span class="annot hand tag warn a1">MIN. 4 POWER UNITS</span>
  <span class="annot hand a4">NO FORCED DISPATCH</span>
  <span class="annot hand a3">YOU KEEP YOUR AUTHORITY</span>
</section>

<section><div class="wrap prose">
  <div class="answer-box"><p><strong>Quick answer:</strong> Badass Logistics dispatches trucking companies running four or more power units across ten equipment types — dry van, reefer, flatbed, step deck, Conestoga, RGN and lowboy, power only, hotshot, car hauler, and LTL and partial truckload. Every desk books legal-weight, legal-dimension freight, you keep your own authority, and you approve every load before it is booked.</p></div>
  <h2>Why equipment decides how a fleet gets dispatched</h2>
  <p>The equipment a fleet runs changes what a dispatcher has to know before a load is ever booked. A reefer load lives or dies on a set point written into the rate confirmation. A flatbed load has an hour of tarping in it that somebody is paying for, whether or not the rate says so. A partial is sold by the linear foot. A car hauler is sold by the unit. Treating all of that as "find a load, book a load" is how fleets end up with revenue that looks fine and margin that does not.</p>
  <p>So the desk is organised by equipment, not by geography. Dispatch is not a local service — your trucks run wherever the freight goes — and we deliberately do not publish city dispatch pages, because a page promising dispatch in one metro would be telling a fleet owner something untrue about how their business works.</p>
</div></section>

<section class="bg-paper" style="border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);"><div class="wrap">
  <span class="section-tag hand">ten desks</span>
  <h2 class="section-title">Dispatch by equipment</h2>
  <p class="section-intro">Each one covers what the freight is, what our desk does differently with it, and what moves the rate.</p>
  <div class="grid-services" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));margin-top:22px;">
    ${ORDER.map((s, i) => `<a class="svc-card" href="/services/truck-dispatch/${s}"><div class="num">// ${String(i + 1).padStart(2, '0')}</div><h3>${EQUIPMENT[s].short}</h3><p>${EQUIPMENT[s].blurb}</p><span class="more">${strip(EQUIPMENT[s].name)} →</span></a>`).join('\n    ')}
  </div>
</div></section>

<section class="notes-bg"><div class="wrap prose">
  <span class="section-tag hand">the limit, stated plainly</span>
  <h2>What this desk does not book</h2>
  <p>No permitted oversize loads, no superloads, no escorted moves, no route surveys. Badass Logistics retired its heavy haul service line in 2026 and does not run it through the dispatch desk instead. Every equipment desk above books legal-weight, legal-dimension freight.</p>
  <p>No owner-operators either. Four power units is the floor, because dispatch stops being planning and starts being load-finding below it. And no city or state dispatch pages — see the <a href="/services/truck-dispatch">fleet dispatch service</a> for how the desk actually works across a fleet.</p>
</div></section>

<section><div class="wrap prose">
  <span class="section-tag hand">questions</span>
  <h2>Dispatch by equipment FAQ</h2>
  ${faq.map(([q, a]) => `<h3>${q}</h3>\n  <p>${a}</p>`).join('\n  ')}
</div></section>
${ctaBand('Running four trucks or more?', 'Tell us your fleet size, your equipment and your home base. We\'ll set up an onboarding call and get your trucks covered.')}

${footer(rel)}
</body>
</html>
`;
}

// ---------- build ----------
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const built = [];
for (const slug of ORDER) {
  const e = EQUIPMENT[slug];
  if (!e) throw new Error(`ORDER lists ${slug} with no EQUIPMENT entry`);
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.html`), equipmentPage(slug, e));
  built.push({ slug, url: `/services/truck-dispatch/${slug}`, name: strip(e.name) });
}
fs.writeFileSync(path.join(OUT_DIR, 'equipment.html'), hubPage());

// pillar grid (sentinel)
if (fs.existsSync(PILLAR)) {
  let p = fs.readFileSync(PILLAR, 'utf8');
  const S = `<!--${SENTINEL}_START-->`, E = `<!--${SENTINEL}_END-->`;
  if (p.includes(S) && p.includes(E)) {
    const cards = ORDER.map(s =>
      `    <a class="svc-card" href="truck-dispatch/${s}"><div class="num">// dispatch</div><h3>${EQUIPMENT[s].short}</h3><p>${EQUIPMENT[s].blurb}</p><span class="more">${strip(EQUIPMENT[s].name)} →</span></a>`
    ).join('\n');
    p = p.replace(new RegExp(`${S}[\\s\\S]*?${E}`), `${S}\n${cards}\n  ${E}`);
    fs.writeFileSync(PILLAR, p);
  } else {
    console.log(`  ! ${SENTINEL} sentinel not found on the truck-dispatch pillar — grid not injected`);
  }
}

fs.writeFileSync(path.join(ROOT, 'data/dispatch-equipment.json'), JSON.stringify({
  generated: new Date().toISOString().slice(0, 10),
  hub: HUB_URL,
  count: built.length,
  pages: built,
}, null, 2) + '\n');

console.log(`✓ Built ${built.length} dispatch × equipment pages + 1 hub (${HUB_URL})`);
console.log(`✓ Updated truck-dispatch pillar grid + data/dispatch-equipment.json`);
