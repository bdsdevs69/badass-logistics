#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — blog generator
   Reads data/site.json + the POSTS array below and writes:
     - blog/<slug>.html      (one article per post, full schema)
     - blog/index.html       (the blog hub)
   Keep POST slugs in sync with BLOG_POSTS in build-locations.js
   (that file owns the sitemap). Re-run:  node build-blog.js
   =========================================================== */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/site.json'), 'utf8'));
const OG = `${site.domain}/assets/img/og-default.jpg`;

const chrome = require('./lib/chrome');
const NAV = `\n${chrome.topbar()}\n${chrome.header()}`;

const BLOG_CSS = `<style>
  .blog-hero { padding:60px 0 30px; border-bottom:3px solid var(--ink); background:var(--paper,#f7f4ea); }
  .post { max-width:820px; margin:0 auto; }
  .post .meta { font-family:"Barlow",sans-serif; font-weight:600; font-size:14px; letter-spacing:.5px; text-transform:uppercase; color:var(--yellow-deep); margin-bottom:10px; }
  .post-body h2 { font-family:"Anton",sans-serif; font-size:30px; margin:38px 0 12px; line-height:1.15; }
  .post-body h3 { font-size:22px; margin:26px 0 8px; }
  .post-body p, .post-body li { font-size:18px; line-height:1.7; }
  .post-body ul { margin:10px 0 10px 22px; }
  .post-body li { margin-bottom:7px; }
  .post-body a { color:var(--yellow-deep); text-decoration:underline; font-weight:600; }
  .keyfacts { border:3px solid var(--ink); box-shadow:var(--shadow); background:var(--white); padding:22px 26px; margin:26px 0; }
  .keyfacts h3 { margin-top:0; }
  .post-img { width:100%; border:3px solid var(--ink); box-shadow:var(--shadow); margin:8px 0 6px; display:block; }
  .blog-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:22px; margin-top:30px; }
  .blog-card { border:3px solid var(--ink); box-shadow:var(--shadow); background:var(--white); text-decoration:none; color:var(--ink); display:flex; flex-direction:column; overflow:hidden; transition:transform .08s; }
  .blog-card:hover { transform:translate(-2px,-2px); }
  .blog-card .thumb { height:160px; background-size:cover; background-position:center; border-bottom:3px solid var(--ink); }
  .blog-card .pad { padding:18px 20px 22px; }
  .blog-card .cat { font-family:"Barlow",sans-serif; font-weight:700; font-size:12px; letter-spacing:1px; text-transform:uppercase; color:var(--yellow-deep); }
  .blog-card h3 { font-family:"Anton",sans-serif; font-size:21px; line-height:1.2; margin:6px 0 8px; }
  .blog-card p { font-size:15px; opacity:.85; margin:0; }
  .related { border-top:3px solid var(--ink); margin-top:46px; padding-top:24px; }
  .related a { display:inline-block; margin:0 10px 10px 0; background:var(--ink); color:var(--white); padding:8px 14px; box-shadow:3px 3px 0 var(--yellow-deep); text-decoration:none; font-weight:700; font-size:15px; }
  .related a:hover { background:var(--yellow-deep); color:var(--ink); }
  .tldr { border:3px solid var(--ink); background:var(--yellow,#ffd21e); box-shadow:var(--shadow); padding:18px 24px; margin:6px 0 30px; }
  .tldr-tag { display:block; font-size:14px; letter-spacing:1px; text-transform:uppercase; opacity:.75; margin-bottom:4px; }
  .tldr p { font-size:19px; line-height:1.6; font-weight:600; margin:0; }
  .post-body figure { margin:26px 0; }
  .post-body figure img { width:100%; height:auto; border:3px solid var(--ink); box-shadow:var(--shadow); display:block; }
  .post-body figcaption { font-family:"Barlow",sans-serif; font-size:14px; opacity:.72; margin-top:8px; font-style:italic; }
  .post-body .takeaways { border-left:6px solid var(--yellow-deep); background:var(--paper,#f7f4ea); padding:16px 22px; margin:24px 0; }
  .post-body .takeaways h3 { margin:0 0 8px; font-size:18px; text-transform:uppercase; letter-spacing:.5px; }
  .post-body .takeaways li { margin-bottom:6px; }
</style>`;

// ---------------------------------------------------------------------------
// POSTS — each `body` is the article HTML; everything else is wrapped for you.
// ---------------------------------------------------------------------------
const POSTS = [
  {
    slug: 'how-to-move-an-mri-machine',
    cat: 'Specialized Rigging',
    hero: 'mri-real.jpg',
    date: '2026-05-26',
    title: 'How to Move an MRI Machine: Rigging, Transport & Reinstallation',
    desc: 'Moving an MRI scanner is a rigging job, not a furniture move. Magnet weight, cryogens, shock/tilt sensitivity, tight-access crane-ins, and how the move actually gets done.',
    dek: 'An MRI is heavy, fragile, and ruthlessly sensitive to shock and tilt. We have moved them — here is how it really works.',
    body: `
<p>An MRI scanner is one of the hardest things you can ask a crew to move. It is heavy — a magnet can run from roughly 5,000 to well over 12,000 lbs — and at the same time it is delicate, expensive, and intolerant of shock, tilt, and temperature swings. Move it wrong and you are not paying for a scuffed crate; you are paying to re-cool a magnet or replace a multi-hundred-thousand-dollar machine. This is rigging and engineering, not a two-guys-and-a-dolly job.</p>

<figure>
  <img class="post-img" src="../assets/img/mri-real.jpg" alt="MRI scanner shrink-wrapped, chained, and secured on a flatbed during a Badass Logistics rigging and transport job at a hospital" loading="lazy" width="1500" height="1000">
  <figcaption class="hand" style="font-size:16px;opacity:.8;">One of our own MRI moves — scanner wrapped, secured, and ready to roll.</figcaption>
</figure>

<h2>Why an MRI move is different</h2>
<ul>
  <li><strong>The magnet.</strong> The superconducting magnet is the heart — and the hazard. Many moves are done with the magnet at field-off / ramped-down state, coordinated with the OEM, and some require managing or recovering <strong>cryogens (liquid helium)</strong>.</li>
  <li><strong>Shock and tilt limits.</strong> Manufacturers set strict shock-and-tilt thresholds. We use monitored, controlled lifts and air-ride transport to stay inside them, and often ship with shock indicators on the crate.</li>
  <li><strong>The fringe field.</strong> Until it is de-energized, the magnet's field is a serious safety issue around ferrous tools and equipment. Planning respects that.</li>
  <li><strong>It rarely fits the door.</strong> MRIs were often installed before the walls went up. Getting one out can mean removing windows or wall panels, or craning it in or out through the roof.</li>
</ul>

<h2>How the move actually gets done</h2>
<h3>1. Site survey and path of travel</h3>
<p>We measure everything: the machine, every doorway, corridor, elevator, and turn between the magnet room and the truck — plus floor loading along the route. Nothing is guessed. If the path does not work at ground level, we plan a crane-in or crane-out.</p>
<h3>2. Rigging the magnet out</h3>
<p>The magnet is jacked, skated, and rolled along an engineered path on air skates or rollers, or lifted under control with a gantry or crane. Tight-access and rooftop jobs get a planned <a href="../services/crane-services.html">crane lift</a>, and the transport is run as <a href="../services/project-freight.html">project freight</a> so the crane, the truck, and the crew all show up on the same plan.</p>
<h3>3. Transport</h3>
<p>The scanner ships secured and shock-monitored on air-ride equipment, climate-considered, and routed to avoid rough roads where we can. Transport runs as project freight on air-ride partner equipment, planned with the rigging — one accountable team from the hospital floor to the new suite.</p>
<h3>4. Set, place, and hand off</h3>
<p>At the destination we reverse the process — rig it in, set it on its pad, level it — and hand off to the OEM service team for ramp-up, calibration, and clinical sign-off.</p>

<div class="keyfacts">
  <h3>What drives MRI move cost</h3>
  <p>Magnet weight and model · whether it craned in/out or rolled out a door · distance and access on both ends · crane and rigging gear required · OEM coordination and cryogen handling · how much wall/window/roof work the path needs.</p>
</div>

<h2>What should you look for in an MRI rigging company?</h2>
<p>Look for a crew that treats the move as engineering, not muscle. In our MRI rigging work, the path of travel is surveyed before rig day — every doorway, corridor, elevator, and floor-load rating between the magnet room and the truck gets measured, and if the path does not work at ground level we plan a crane-in or crane-out instead of forcing it. The magnet itself — typically 5,000 to over 12,000 lbs for a superconducting unit — rides skates or rollers along that planned path, ships secured on air-ride equipment, and the whole schedule is coordinated with the OEM's field service engineers around ramp-down and cryogen handling. We have rigged and hauled MRI and medical equipment at live hospital sites on tight clinical timelines — the photos in this guide are from our own moves. See the <a href="../services/rigging.html">MRI &amp; medical equipment rigging</a> section of our rigging service for more.</p>

<p>Moving a scanner, CT, or other imaging equipment? <a href="../contact.html">Send us the model, the floor, and the dates</a> — we'll plan the lift.</p>
`,
    faq: [
      { q: 'How much does it cost to move an MRI machine?', a: 'It depends on the magnet weight and model, the access on both ends (door-out vs. crane-in), distance, the rigging gear required, and OEM/cryogen coordination. Send the model and a site photo for an accurate quote.' },
      { q: 'Can you crane an MRI onto a hospital roof or upper floor?', a: 'Yes. When the path of travel does not work at ground level, we plan and execute a crane-in or crane-out, coordinated with the transport schedule and the OEM service schedule.' },
      { q: 'Do you handle the helium and magnet ramp-down?', a: 'Magnet ramp-down/ramp-up and cryogen work are coordinated with the manufacturer\'s field service engineers. We handle the rigging, securement, transport, and placement around that schedule.' },
    ],
    related: [
      { h: 'Industrial Rigging', u: '../services/rigging.html' },
      { h: 'MRI &amp; Medical Equipment Rigging', u: '../services/mri-medical-equipment-rigging.html' },
      { h: 'What Is Industrial Rigging?', u: 'what-is-industrial-rigging.html' },
      { h: 'Get a Quote', u: '../contact.html' },
    ],
  },

  {
    slug: 'what-is-industrial-rigging',
    cat: 'Rigging',
    hero: 'rigging-hero.jpg',
    date: '2026-06-06',
    title: 'What Is Industrial Rigging? A Plain-English Guide',
    desc: 'Industrial rigging explained: what riggers do, the equipment they use (cranes, gantries, jacks, skates, slings), common jobs, and why every lift is an engineering problem.',
    dek: 'Rigging is how heavy machines get lifted, moved, and set without wrecking the machine, the floor, or anyone nearby.',
    body: `
<p><strong>Industrial rigging</strong> is the planning and physical work of lifting, moving, and setting heavy machinery and equipment — safely, precisely, and usually in spaces that were never designed to get the thing in or out. If a load is too heavy for a forklift, too valuable to risk, or too awkward to muscle, you call a rigger.</p>

<h2>What riggers actually do</h2>
<p>A rigging crew moves loads that ordinary material handling can't. That breaks down into three jobs:</p>
<ul>
  <li><strong>Lift</strong> — get the load off the ground or off its foundation under full control.</li>
  <li><strong>Move</strong> — transport it across a shop floor, through a building, or onto a truck.</li>
  <li><strong>Set</strong> — place it exactly where it needs to go, then level and anchor it to spec.</li>
</ul>

<h2>What equipment does a rigger use?</h2>
<ul>
  <li><strong>Cranes and gantries</strong> — for vertical lifts, from shop gantries to large mobile cranes.</li>
  <li><strong>Hydraulic jacks and gantry systems</strong> — to raise enormous loads in controlled increments where a crane can't reach.</li>
  <li><strong>Skates, rollers, and air skates</strong> — to slide heavy machines across a floor with precision.</li>
  <li><strong>Slings, shackles, and spreader bars</strong> — the hardware that actually connects the load to the lift, sized to the weight and the rigging plan.</li>
  <li><strong>Forklifts and versa-lifts</strong> — for the smaller end of the work.</li>
</ul>

<h2>Common rigging jobs</h2>
<ul>
  <li><strong>Machinery moving</strong> — relocating a single CNC machine, press, or generator.</li>
  <li><strong>Plant relocation</strong> — disconnecting, moving, and reinstalling an entire production line or facility.</li>
  <li><strong>Equipment installation (millwright work)</strong> — setting, leveling, and anchoring new machinery to manufacturer tolerances.</li>
  <li><strong>Specialized loads</strong> — sensitive equipment like <a href="how-to-move-an-mri-machine.html">MRI scanners and medical imaging</a> that demand monitored, shock-controlled handling.</li>
</ul>

<h2>Why it's an engineering problem first</h2>
<p>At Badass Logistics, every lift starts on paper before anyone touches the load. A proper plan accounts for the load's <strong>weight and center of gravity</strong>, crane <strong>load charts</strong> and radius, sling angles and rated capacities, and the <strong>floor loading</strong> along the path of travel. Skip that and you get dropped loads, cracked floors, and hurt people. That is why we measure dimensions, weights, and clearances — and why we treat every lift like the engineering job it is.</p>

<div class="keyfacts">
  <h3>Rigging vs. transport — what's the difference?</h3>
  <p>Rigging is the lifting, moving, and setting of the load. Transport is getting it over the road to the next site. The handoff between them is where jobs usually go wrong — which is why we plan the freight with the rigging as <a href="../services/project-freight.html">project freight</a>, so your machine gets rigged, moved, and set under one plan by one accountable team.</p>
</div>

<p>Got a machine that needs moving? <a href="../services/rigging.html">See our rigging service</a> or <a href="../contact.html">send us the specs and the site</a>.</p>
`,
    faq: [
      { q: 'What is the difference between rigging and transport?', a: 'Rigging is lifting, moving, and setting a heavy load — often in tight spaces. Transport is moving it over the road between sites. We plan both as one project so one team owns the whole move.' },
      { q: 'How heavy a load can a rigging crew move?', a: 'From a single pallet to presses and machinery over 200,000 lbs. The lift is matched to engineered rigging and the right equipment for the weight, dimensions, and access.' },
      { q: 'Do I need a rigger or a regular mover?', a: 'If the load is too heavy for a forklift, too valuable to risk, or too awkward to handle through your space, you need a rigger. Riggers bring the engineering, the gear, and the plan that ordinary movers don\'t.' },
    ],
    related: [
      { h: 'Industrial Rigging', u: '../services/rigging.html' },
      { h: 'How to Move an MRI Machine', u: 'how-to-move-an-mri-machine.html' },
      { h: 'Types of Rigging', u: 'types-of-rigging.html' },
      { h: 'Get a Quote', u: '../contact.html' },
    ],
  },

  {
    slug: 'truck-dispatcher-vs-freight-broker',
    cat: 'Dispatch',
    hero: 'dispatch-hero.jpg',
    date: '2026-06-09',
    title: 'Truck Dispatcher vs Freight Broker: What\'s the Difference?',
    desc: 'Dispatchers and brokers are not the same thing. Who each one works for, what they legally can and cannot do, and which one a trucking company actually needs.',
    dek: 'They both touch loads and rates — but a dispatcher works for you, the carrier. A broker is the middleman. That difference is the whole point.',
    body: `
<p>Trucking companies get pitched by both "dispatchers" and "brokers," and the terms get blurred constantly. They are not the same role, and the difference is not just semantics — it changes who is on your side, who is legally responsible for what, and how you get paid.</p>

<h2>The short version</h2>
<div class="keyfacts">
  <h3>The core difference</h3>
  <p>A <strong>truck dispatcher</strong> works <em>for the carrier</em> — they are your agent, finding and booking loads on your behalf. A <strong>freight broker</strong> is the <em>middleman between the shipper and the carrier</em>, arranging transportation as an independent party. One works for you; the other sits between you and the freight.</p>
</div>

<h2>What a freight broker is</h2>
<p>A freight broker connects shippers who have freight with carriers who have trucks. Brokers operate under <strong>FMCSA broker authority</strong> (an MC number) and must carry <strong>financial security</strong> — a surety bond (BMC-84) or trust fund (BMC-85) — set by federal rule. They contract with the shipper, mark up the freight, and pay the carrier — and the spread between those two numbers is their margin. A good broker brings volume and handles the shipper relationship; the tradeoff is that they sit between you and the rate.</p>

<h2>What a truck dispatcher does</h2>
<p>A dispatcher is the carrier's back office. Working as <em>your</em> agent, a dispatcher will:</p>
<ul>
  <li><strong>Find and book loads</strong> that fit your truck, your lanes, and your home time</li>
  <li><strong>Negotiate rates</strong> on your behalf — pushing the rate up, not marking it down</li>
  <li><strong>Handle the paperwork</strong> — rate confirmations, carrier packets, BOLs, and follow-up</li>
  <li><strong>Plan routing</strong> to cut deadhead and keep the truck loaded</li>
  <li><strong>Deal with brokers and shippers</strong> so the driver can focus on driving</li>
</ul>
<p>A dispatcher acting purely as the carrier's agent generally does not need its own broker authority, because it is not brokering freight to third parties — it is representing one carrier.</p>

<h2>Which one do you need?</h2>
<p>If you run trucks and you want someone <strong>on your side of the table</strong> — keeping your wheels turning, fighting for your rate, and taking the admin off your plate — that is dispatching. If you are a shipper trying to move freight and you want someone to find capacity, that is a broker.</p>

<h2>How we dispatch</h2>
<p>Our <a href="../services/truck-dispatch.html">dispatch desk</a> works for trucking companies running <strong>4 or more trucks</strong>. You are the client, not the freight: the desk sources loads, negotiates the rate up, and handles the paperwork, 24/7, so your drivers can focus on driving. If you are still dispatching your own fleet, <a href="truck-dispatch-for-small-fleets.html">truck dispatch for small fleets</a> covers when handing it off starts to pay.</p>

<p><a href="../contact.html">Talk to us about dispatch</a> and we'll keep your trucks loaded and rolling.</p>
`,
    faq: [
      { q: 'Is a truck dispatcher the same as a freight broker?', a: 'No. A dispatcher works for the carrier as their agent — finding loads and negotiating rates on the carrier\'s behalf. A broker is an independent middleman between shipper and carrier, operating under FMCSA broker authority and backed by a federally required bond or trust.' },
      { q: 'Does a truck dispatcher need an MC number or broker authority?', a: 'A dispatcher acting solely as the carrier\'s agent generally does not need its own broker authority, because it represents one carrier rather than brokering freight to third parties.' },
      { q: 'Do dispatchers get you better rates?', a: 'A good dispatcher negotiates on your behalf to push the rate up and reduce deadhead, and charges you a flat fee or percentage — versus a broker, whose margin comes from the spread between the shipper\'s rate and yours.' },
    ],
    related: [
      { h: 'Truck Dispatch for Fleets', u: '../services/truck-dispatch.html' },
      { h: 'Truck Dispatch for Small Fleets', u: 'truck-dispatch-for-small-fleets.html' },
      { h: 'Freight Broker vs Forwarder vs 3PL', u: 'freight-broker-vs-forwarder-vs-3pl.html' },
      { h: 'Get a Quote', u: '../contact.html' },
    ],
  },

  {
    slug: 'ltl-vs-ftl-freight',
    cat: 'Freight & Trucking',
    hero: 'brokerage-dryvan.jpg',
    date: '2026-06-10',
    title: 'LTL vs FTL Freight: Which One Actually Saves You Money?',
    desc: 'Less-than-truckload vs full truckload, explained with real decision rules: weight and pallet thresholds, transit time, handling risk, and when partial loads beat both.',
    dek: 'LTL is cheaper until it isn\'t. The real decision comes down to pallet count, fragility, and how much you care about the calendar.',
    body: `
<p>Every shipper learns the LTL-vs-FTL decision the expensive way: either paying for a whole truck they didn't fill, or watching a "cheap" LTL shipment arrive late, re-handled, and dinged. The rules of thumb below are how dispatchers actually make the call.</p>

<h2>The difference in one minute</h2>
<p><strong>FTL (full truckload)</strong>: the entire trailer is yours. One pickup, one delivery, nobody else's freight on board. <strong>LTL (less-than-truckload)</strong>: you pay for the space you use, and the carrier fills the rest of the trailer with other shippers' freight, routing everything through cross-dock terminals along the way.</p>

<h2>When LTL wins</h2>
<ul>
  <li><strong>1–6 pallets, under ~5,000 lbs.</strong> This is LTL's sweet spot — you'd be paying for 40 feet of empty deck on an FTL.</li>
  <li><strong>Flexible delivery windows.</strong> Terminal routing adds days and variability; if the date is soft, the savings are real.</li>
  <li><strong>Durable, well-packaged freight.</strong> LTL freight gets forklifted at every terminal. Crated and banded survives; shrink-wrap-and-hope doesn't.</li>
</ul>

<h2>When FTL wins</h2>
<ul>
  <li><strong>10+ pallets or 15,000+ lbs.</strong> At that volume the per-pallet math usually flips to FTL outright.</li>
  <li><strong>Tight deadlines.</strong> FTL is door-to-door with no terminal stops — the transit time is the drive time.</li>
  <li><strong>Fragile, high-value, or hard-to-replace freight.</strong> Zero re-handling means dramatically less damage risk. If a damaged shipment shuts your line down, FTL is cheap insurance.</li>
  <li><strong>Anything that can't be stacked or mixed</strong> — hazmat combinations, overlength pieces, freight that needs the doors opened once.</li>
</ul>

<div class="keyfacts">
  <h3>The middle path: partial / volume loads</h3>
  <p>Got 6–12 pallets? A <strong>partial truckload</strong> shares a trailer like LTL but skips the terminals — your freight stays on one truck with one or two other direct shipments. Cheaper than FTL, gentler and faster than LTL. It's one of the most underused options in freight.</p>
</div>

<h2>The hidden LTL costs people forget</h2>
<p>LTL pricing runs on freight class, dimensions, and accessorials — and the surprises live in the accessorials: liftgate fees, residential delivery, limited-access pickups, reweigh corrections, and detention. A quoted LTL rate can grow 30–40% by the time it hits your invoice. When you compare against FTL or partial, compare <em>landed</em> cost, not the base quote.</p>

<h2>How we run it</h2>
<p>On our <a href="../services/project-freight.html">project freight</a> jobs we plan FTL, LTL, and partial side by side, in dry van, reefer, and flatbed, and pick whichever the math favors for each shipment in the project. When a project has enough loads, it gets <a href="../services/dedicated-lanes.html">dedicated capacity</a> instead. Either way you get one plan instead of three vendors.</p>

<p><a href="../contact.html">Send us the pallet count, weight, and lane</a> — we'll price it both ways.</p>
`,
    faq: [
      { q: 'At what weight should I switch from LTL to FTL?', a: 'As a rule of thumb, shipments over roughly 10–12 pallets or 15,000 lbs usually price better as full truckload — and partial truckload often wins in the 6–12 pallet middle zone. Compare landed cost including accessorials, not base rates.' },
      { q: 'Why did my LTL shipment take so long?', a: 'LTL freight routes through carrier terminals where it is unloaded, sorted, and reloaded between trucks. Each cross-dock adds time and variability. FTL and partial loads skip terminals entirely.' },
      { q: 'What is partial truckload?', a: 'A shared trailer without terminal handling — your freight rides with one or two other direct shipments and stays on the same truck door to door. It typically beats LTL on speed and damage risk and beats FTL on price for 6–12 pallets.' },
    ],
    related: [
      { h: 'What Is Drayage?', u: 'what-is-drayage.html' },
      { h: 'Dedicated Lanes &amp; Project FTL', u: '../services/dedicated-lanes.html' },
      { h: 'Get a Quote', u: '../contact.html' },
    ],
  },

  {
    slug: 'what-is-drayage',
    cat: 'Freight & Trucking',
    hero: 'loads/load-reels-container.jpg',
    date: '2026-06-10',
    title: 'What Is Drayage? Container Trucking From Port to Door, Explained',
    desc: 'Drayage is the short-haul truck move that gets shipping containers from ports and rail ramps to warehouses. How it works, what per diem and demurrage really mean, and how to avoid the fees.',
    dek: 'Your container crossed the ocean for cheap. The last 40 miles is where the fees hide — and where drayage saves or costs you thousands.',
    body: `
<p><strong>Drayage</strong> is the short-haul trucking that moves shipping containers between a port or rail ramp and a nearby warehouse, yard, or doorstep. It's the shortest leg of an international shipment and routinely the most operationally painful — because it's where ocean schedules, terminal appointments, chassis availability, and free-time clocks all collide.</p>

<h2>How a drayage move works</h2>
<p>Drayage is the short-haul truck move that picks up your shipping container from a port terminal or rail ramp and delivers it to your warehouse — usually within about 50 miles. A credentialed driver with a TWIC card and a terminal appointment picks the box up on a chassis inside the port's free-time window, then either live-unloads at your dock or drops the container for a later pickup. The critical variable is not the truck rate; it is whether the box moves before free time expires. Miss that window and demurrage charges from the terminal and per-diem charges from the ocean carrier start stacking up for every container, every day. Step by step, it looks like this:</p>
<ul>
  <li><strong>Your container discharges</strong> from the vessel (or arrives at the rail ramp) and the terminal makes it available for pickup.</li>
  <li><strong>The clock starts.</strong> Terminals give a few free days ("free time") before storage charges — <strong>demurrage</strong> — begin accruing daily.</li>
  <li><strong>A drayage driver with port credentials</strong> (TWIC card, terminal appointments, UIIA interchange agreement) picks up the box on a chassis.</li>
  <li><strong>The container is delivered</strong> to your dock — either live-unloaded while the driver waits, or dropped and picked up later.</li>
  <li><strong>The empty goes back.</strong> Keep the container or chassis past the rental free time and <strong>per diem / detention</strong> charges stack daily until it's returned.</li>
</ul>

<div class="keyfacts">
  <h3>The fee glossary that saves you money</h3>
  <p><strong>Demurrage:</strong> the terminal charging you for the container sitting at the port past free time.<br>
  <strong>Per diem (detention):</strong> the ocean carrier charging you for keeping their container/chassis out too long.<br>
  <strong>Chassis split:</strong> an extra trip because the chassis wasn't where the container was.<br>
  Demurrage and per diem are charged per container, per day — and they compound fast over a weekend.</p>
  <p class="hand" style="font-size:13px;opacity:.7;margin-top:8px;">Last reviewed June 2026</p>
</div>

<h2>Why drayage goes wrong</h2>
<p>Almost every drayage horror story is a timing story: the container discharged Friday, free time ran out Tuesday, nobody had an appointment until Thursday. A good drayage operation watches vessel ETAs, books terminal appointments before the box hits the ground, secures the chassis, and lines up your dock door — so the container moves inside free time and the fee clocks never start.</p>

<h2>Drayage + everything after it</h2>
<p>A container rarely ends its journey at the first warehouse. We handle the dray, the <a href="ltl-vs-ftl-freight.html">LTL/FTL distribution</a> after deconsolidation, and — when what's inside the box is a machine — the <a href="../services/rigging.html">rigging</a> to take it off the floor and set it in place. Port cities like <a href="../locations/houston-tx.html">Houston</a>, <a href="../locations/charleston-sc.html">Charleston</a>, <a href="../locations/norfolk-va.html">Norfolk</a>, and <a href="../locations/los-angeles-ca.html">Los Angeles</a> are exactly where our drayage and heavy work overlap.</p>

<p>Got boxes hitting a port? <a href="../contact.html">send us the ETA and the delivery address</a> — we'll keep the clocks at zero.</p>
`,
    faq: [
      { q: 'What is the difference between drayage and trucking?', a: 'Drayage is a specialized subset of trucking: short-haul container moves to and from ports and rail ramps, requiring port credentials (TWIC), terminal appointments, interchange agreements, and chassis management that ordinary OTR trucking doesn\'t involve.' },
      { q: 'What is the difference between demurrage and per diem?', a: 'Demurrage is charged by the terminal for the container sitting at the port past free time. Per diem (detention) is charged by the ocean carrier for keeping the container or chassis out past its return window. Both accrue daily.' },
      { q: 'How much does drayage cost?', a: 'The truck move itself is priced by distance, port, and whether it\'s a live unload or a drop. The real budget risk is the fee side — demurrage, per diem, and chassis charges — which good scheduling avoids entirely.' },
    ],
    related: [
      { h: 'LTL vs FTL Freight', u: 'ltl-vs-ftl-freight.html' },
      { h: 'All Locations', u: '../locations.html' },
      { h: 'Get a Quote', u: '../contact.html' },
    ],
  },

  {
    slug: 'how-to-move-a-cnc-machine',
    cat: 'Rigging',
    hero: 'loads/load-machine-loadout.jpg',
    date: '2026-06-10',
    title: 'How to Move a CNC Machine Without Wrecking It',
    desc: 'Moving a CNC machine or machining center: OEM prep, rigging with toe jacks and skates, why you never lift from the wrong points, transport on air-ride, and re-leveling at the destination.',
    dek: 'A CNC machine is a precision instrument that weighs as much as a truck. Moving one is equal parts paperwork, physics, and patience.',
    body: `
<p>A CNC machine is the worst combination of properties a load can have: extremely heavy (5,000 to 60,000+ lbs), top-heavy with a high center of gravity, full of precision-ground surfaces that hold tolerances in ten-thousandths — and usually parked in the middle of a working shop with 30 inches of clearance on either side. This is precisely the job <a href="what-is-industrial-rigging.html">industrial rigging</a> exists for.</p>

<h2>Before anything moves: machine prep</h2>
<ul>
  <li><strong>Power down and lock out</strong> — electrical disconnect by a qualified electrician, air and coolant lines drained and capped.</li>
  <li><strong>Secure the moving axes.</strong> The spindle head, table, and tool changer get brought to their transport positions and locked with the OEM's shipping brackets or fabricated bracing. An unsecured axis sliding mid-lift can destroy ways and ballscrews.</li>
  <li><strong>Remove what should travel separately</strong> — tooling, chip conveyor, probes, sheet-metal guarding that blocks rigging points.</li>
  <li><strong>Photograph and document everything</strong> — connections, leveling-foot positions, alignment references — so reassembly isn't archaeology.</li>
</ul>

<h2>The lift: where machines get ruined</h2>
<p>CNC machines have <strong>designated lift points</strong> in the manual, and only those. Lift from the casting in the wrong place — or worse, pry under the sheet metal — and you twist the machine's geometry; it'll power on fine and never cut straight again. The standard rigging sequence:</p>
<ul>
  <li><strong>Toe jacks</strong> raise the machine inches at a time from the proper jacking points.</li>
  <li><strong>Machine skates</strong> (or air skates on delicate floors) go underneath, and the machine rolls along a planned, floor-load-checked path.</li>
  <li>Where a vertical lift is needed, it's a <strong>gantry or crane pick from the manual's lift points</strong>, slings padded and angles kept inside spec, with the high center of gravity respected at every step.</li>
</ul>

<div class="keyfacts">
  <h3>The numbers that matter</h3>
  <p>Weight and C.G. from the manual, not a guess · doorway and path clearances measured to the inch · floor capacity along the route · lift points per the OEM · transport on air-ride only · re-level at destination to the builder's spec before first cut.</p>
</div>

<h2>Transport and reinstallation</h2>
<p>Machining centers ride <strong>air-ride trailers</strong>, tarped or shrink-wrapped against weather, often with shock indicators on the crate. Moves between facilities run as <a href="../services/project-freight.html">project freight</a>, timed so the rigging crew is waiting when the truck arrives. At the destination the process reverses — skate in, set on the new pad, then <strong>level to the manufacturer's spec</strong> and recommission. Leveling isn't cosmetic: machine geometry, circularity, and positioning accuracy all start from a level casting.</p>

<p>One crew that rigs it out, hauls it, and sets it back down — that's the whole point of doing <a href="../services/rigging.html">rigging</a> and transport under one roof. Moving a VMC, lathe, or a whole machine shop? <a href="../contact.html">Send us the model list and both floor plans</a> — we'll plan the move machine by machine.</p>
`,
    faq: [
      { q: 'How much does it cost to move a CNC machine?', a: 'Drivers are machine weight and size, rigging complexity at both ends (clearances, floor capacity, crane vs. skate), distance, and OEM prep requirements. A small VMC across town is a different job than a 40,000-lb horizontal machining center across the country — send the model and both site layouts for a real number.' },
      { q: 'Can I move a CNC machine with a forklift?', a: 'Only if the manual explicitly allows fork lifting at designated points and the truck has the capacity at that load center — many machines are too heavy, too top-heavy, or have no safe fork pockets. Lifting from the wrong points can permanently distort machine geometry.' },
      { q: 'Does a CNC machine need to be re-leveled after a move?', a: 'Yes, always. The machine must be set on its new foundation and leveled to the builder\'s specification before cutting — geometry, accuracy, and repeatability all depend on it. Plan for leveling and recommissioning time in the move schedule.' },
    ],
    related: [
      { h: 'Industrial Rigging', u: '../services/rigging.html' },
      { h: 'What Is Industrial Rigging?', u: 'what-is-industrial-rigging.html' },
      { h: 'How to Move an MRI Machine', u: 'how-to-move-an-mri-machine.html' },
      { h: 'Get a Quote', u: '../contact.html' },
    ],
  },


  {
    slug: 'how-to-transport-a-ct-scanner',
    cat: 'Specialized Rigging',
    hero: 'loads/ct-scanner-medical-imaging-move.jpg',
    date: '2026-06-29',
    title: 'How to Transport a CT Scanner Without a Six-Figure Mistake',
    desc: 'A CT scanner is heavy, precision-aligned, and worth more than the truck it rides in. Moving one means de-installing to OEM spec, rigging each component out through tight hospital corridors, air-ride transport, and reinstallation with recalibration. Here is the process.',
    dek: 'Heavy, delicate, and worth more than the truck. Here is how a CT scanner comes off its pad, out of the building, and back online.',
    tldr: 'Transporting a CT scanner means de-installing the gantry and table to the manufacturer\'s procedure, protecting and rigging each component through the building on skates, hauling on an enclosed air-ride trailer with shock and tilt indicators, then reinstalling and coordinating OEM recalibration on site. It is a rigging job first and a trucking job second.',
    keywords: 'transport CT scanner, move CT scanner, medical imaging equipment moving, CT gantry rigging, hospital equipment relocation',
    body: `
<p>A CT scanner does not move like furniture. The gantry alone can run several thousand pounds, the components are precision-aligned, and the whole system is worth more than most of the vehicles on the road. Move it wrong and you are not paying for a repair — you are paying for a replacement plus the downtime of a dark imaging suite. Here is how it is done right.</p>

<h2>It is a rigging job, not a delivery</h2>
<p>The truck is the easy part. The hard part is getting a multi-thousand-pound gantry out of an imaging suite that was built <em>around</em> it — through doorways, around corners, down corridors never meant for something that size. That is <a href="../services/rigging.html">industrial rigging</a>: skates, stair-climbers, gantry lifts, and door-and-path measurements taken to the inch before anything moves.</p>

<h2>1. De-install to the manufacturer's procedure</h2>
<p>Imaging OEMs publish a de-installation procedure for a reason. The gantry and patient <strong>table</strong> come apart into defined transport components, covers come off or get protected, and moving locks go on to keep the rotating assembly from turning in transit. Skip a step here and alignment gets destroyed before the machine ever reaches the dock.</p>

<figure>
  <img src="../assets/img/loads/ct-scanner-medical-imaging-move.jpg" alt="GE Optima CT scanner gantry and patient table prepared for de-installation and rigging out of a hospital imaging suite" loading="lazy" width="1050" height="1400">
  <figcaption>A GE Optima CT scanner staged for de-install — gantry and table separated and prepped before the rig-out.</figcaption>
</figure>

<h2>2. Rig it out of the building</h2>
<p>Each component gets padded, wrapped, and moved on <strong>air-cushion skates or a stair-climber</strong> along the surveyed path. Floor protection goes down, door frames get protected, and the crew controls every pivot. This is where the clearances you measured on paper meet the real corner — and why the survey happens first.</p>

<h2>3. Transport on air-ride, monitored</h2>
<p>Imaging equipment rides on <strong>air-ride suspension</strong> only — the entire point is to keep road shock off precision components. The load is blocked, braced, and secured upright, usually with <strong>shock and tilt indicators</strong> on the crate so anyone can see if it was dropped or laid over. Sensitive electronics travel enclosed and shielded, not open to the weather.</p>

<figure>
  <img src="../assets/img/loads/ct-mri-scanner-enclosed-air-ride.jpg" alt="CT scanner shrink-wrapped and secured on lift equipment inside an enclosed air-ride trailer for hospital transport" loading="lazy" width="800" height="600">
  <figcaption>Scanner secured upright inside an enclosed trailer on air-ride — shock kept off the components, weather kept out.</figcaption>
</figure>

<h2>4. Reinstall and recalibrate</h2>
<p>At the destination the process reverses: rig in along a surveyed path, set on the pad, reassemble, and remove the moving locks. Then the <strong>OEM field engineer recalibrates</strong> and the scanner is re-qualified before it images a single patient. Our job is to deliver it undamaged and on schedule so recommissioning starts on time.</p>

<div class="takeaways">
  <h3>What actually matters</h3>
  <ul>
    <li>Follow the OEM de-install procedure — moving locks and defined components, not shortcuts.</li>
    <li>Survey the path and rig each piece out on skates; measure clearances to the inch.</li>
    <li>Air-ride, enclosed, upright, with shock and tilt indicators — every mile.</li>
    <li>Coordinate reinstall with the OEM engineer so recalibration starts on time.</li>
  </ul>
</div>

<p>Moving a CT, an <a href="how-to-move-an-mri-machine.html">MRI</a>, a C-arm, or a whole imaging department? Our <a href="../services/rigging.html">rigging</a> and <a href="../services/machinery-moving.html">machinery moving</a> crews handle medical imaging start to finish. <a href="../contact.html">Send the model and the site details</a> and we will build the plan.</p>
`,
    faq: [
      { q: 'How much does a CT scanner weigh?', a: 'It varies by model, but the gantry alone commonly runs from roughly 2,000 to over 4,500 pounds, plus the patient table and covers. That weight, combined with tight imaging-suite clearances, is why moving one is a rigging job rather than a straight delivery.' },
      { q: 'Can a CT scanner be moved without the manufacturer?', a: 'The physical de-install, rigging, transport, and reinstall are handled by a specialized rigging crew, but the final recalibration and re-qualification are performed by the OEM field engineer. Coordinating both is part of planning the move so the scanner comes back online on schedule.' },
      { q: 'What kind of truck moves a CT scanner?', a: 'An enclosed, air-ride trailer. Air-ride suspension keeps road shock off the precision components, the enclosure protects against weather and road grit, and the load rides upright and braced, usually with shock and tilt indicators on the crate.' },
    ],
    related: [
      { h: 'Industrial Rigging', u: '../services/rigging.html' },
      { h: 'How to Move an MRI Machine', u: 'how-to-move-an-mri-machine.html' },
      { h: 'Machinery Moving', u: '../services/machinery-moving.html' },
      { h: 'Get a Quote', u: '../contact.html' },
    ],
  },

  {
    slug: 'white-glove-freight-and-custom-crating',
    cat: 'Specialized Freight',
    hero: 'loads/crating-shrink-wrap-electrical-equipment.jpg',
    date: '2026-07-01',
    title: 'White-Glove Freight and Custom Crating, Explained',
    desc: 'Sensitive, high-value, or fragile equipment does not ship on a standard pallet and a prayer. White-glove freight means custom crating, cushioning, enclosed air-ride transport, and hand placement at the far end. Here is what you are actually paying for.',
    dek: 'When "it got there" is not good enough. Custom crating, cushioning, air-ride, and a careful set-down — how fragile, high-value freight actually ships.',
    tldr: 'White-glove freight is a service level, not a truck: fragile or high-value equipment gets custom crating and cushioning, shrink-wrap and moisture protection, enclosed air-ride transport, and hand placement (curbside, inside, or to the exact spot) at delivery — with the packaging engineered to the item, not stuffed into a standard box.',
    keywords: 'white glove freight, custom crating, shrink wrap freight, fragile equipment shipping, inside delivery, air ride transport',
    body: `
<p>Some freight cannot ride on a standard pallet wrapped in a few turns of stretch film. A sensitive electrical cabinet, a piece of lab equipment, a control console — anything fragile, precise, or expensive needs packaging built for it and handling that treats it like it matters. That service level has a name: <strong>white-glove freight</strong>. Here is what it actually includes.</p>

<figure>
  <img src="../assets/img/loads/crating-shrink-wrap-electrical-equipment.jpg" alt="Badass Logistics crew member shrink-wrapping and crating a sensitive electrical enclosure before loading for transport" loading="lazy" width="600" height="800">
  <figcaption>Custom crating in progress — the enclosure is wrapped and cased to its shape before it ever sees a truck.</figcaption>
</figure>

<h2>Custom crating, built to the item</h2>
<p>White-glove starts with a crate <strong>engineered to the load</strong>, not a stock box it half-fits. That means a wooden crate or skid sized to the equipment, internal blocking so nothing shifts, and foam or cushioning wherever impact or vibration would do damage. Heavy items get a base a forklift or pallet jack can actually pick from the right points.</p>

<h2>Wrap, cushion, and protect</h2>
<p>Inside the crate, the equipment gets <strong>shrink-wrap and moisture barriers</strong> against road spray and humidity, corner and edge protection, and cushioning tuned to how fragile it is. For electronics and machined surfaces, that protection is the difference between plug-in-and-go and a warranty claim.</p>

<figure>
  <img src="../assets/img/loads/white-glove-crated-equipment-delivery.jpg" alt="Crated and shrink-wrapped electrical equipment staged on pallets at a curbside white-glove delivery" loading="lazy" width="800" height="600">
  <figcaption>Crated, wrapped, and palletized for a controlled set-down — packaging engineered to the item, not the truck.</figcaption>
</figure>

<h2>Enclosed, air-ride transport</h2>
<p>White-glove freight rides <strong>enclosed and on air-ride</strong> — out of the weather and off the road shock. It is blocked and braced so it cannot walk around the trailer, and high-value shipments can travel with shock indicators so any rough handling is visible on arrival. It is the same standard we hold for <a href="how-to-move-an-mri-machine.html">medical imaging</a> and precision machinery.</p>

<h2>Delivery that does not stop at the tailgate</h2>
<p>Standard freight ends when the pallet hits the dock. White-glove goes further: <strong>curbside, threshold, inside, or spot placement</strong> depending on what you booked, with the crew handling the last few feet as carefully as the last few hundred miles. Packaging and debris can be removed on request so you are left with the equipment, ready to install.</p>

<figure>
  <img src="../assets/img/loads/palletized-equipment-curbside-unload.jpg" alt="Palletized, shrink-wrapped industrial equipment and a metal control cabinet set down for curbside unloading" loading="lazy" width="800" height="600">
  <figcaption>The last few feet handled with the same care as the haul — set down where it needs to go, not just dropped at a dock.</figcaption>
</figure>

<div class="takeaways">
  <h3>What "white glove" buys you</h3>
  <ul>
    <li>A crate engineered to the item — blocking, foam, and a liftable base.</li>
    <li>Shrink-wrap, moisture barriers, and cushioning against road shock and weather.</li>
    <li>Enclosed, air-ride transport, blocked and braced, shock-indicator optional.</li>
    <li>Placement past the tailgate — curbside, inside, or to the exact spot.</li>
  </ul>
</div>

<p>Have something fragile, high-value, or one-of-a-kind to move? Our rigging and <a href="../services/machinery-moving.html">machinery moving</a> crews crate it, haul it, and set it down right. <a href="../contact.html">Tell us what it is and where it is going.</a></p>
`,
    faq: [
      { q: 'What does white-glove freight mean?', a: 'It is a premium handling level for fragile, high-value, or sensitive shipments. It typically includes custom crating and cushioning, enclosed air-ride transport, and hand placement at delivery — curbside, inside, or to a specific spot — instead of a standard drop at a loading dock.' },
      { q: 'What is custom crating?', a: 'A shipping crate built to the specific item instead of a stock box. It is sized to the equipment with internal blocking, foam or cushioning where needed, moisture protection, and a base that can be safely lifted by forklift or pallet jack from the correct points.' },
      { q: 'Does white-glove include inside delivery?', a: 'It can. Depending on the service level you book, delivery ranges from curbside set-down to threshold, inside, or exact-spot placement, with packaging and debris removed on request so the equipment is left ready to install.' },
    ],
    related: [
      { h: 'Machinery Moving', u: '../services/machinery-moving.html' },
      { h: 'How to Move an MRI Machine', u: 'how-to-move-an-mri-machine.html' },
      { h: 'Get a Quote', u: '../contact.html' },
    ],
  },

  {
    slug: 'blocking-bracing-and-dunnage-explained',
    cat: 'How It\'s Done',
    hero: 'loads/blocking-bracing-dunnage-box-truck.jpg',
    date: '2026-06-25',
    title: 'Blocking, Bracing and Dunnage: How Heavy Loads Ride Safe',
    desc: 'Straps get the credit, but blocking and bracing do the work. Dunnage, chocks, cradles, and shoring stop a load from shifting long before a tie-down is tensioned. Here is how cargo is actually kept still in a moving trailer.',
    dek: 'Straps get the credit; blocking and bracing do the work. How dunnage, chocks, and shoring keep a heavy load from ever moving.',
    tldr: 'Blocking and bracing physically stop cargo from moving; tie-downs only hold it against the blocking. Riggers use hardwood dunnage, chocks, cleats, cradles, and shoring to lock a load fore-aft and side-to-side, then add straps or chains rated to at least half the cargo weight. The goal is a load that cannot shift on a hard brake, a sharp turn, or a rough road.',
    keywords: 'blocking and bracing, dunnage, cargo securement, load shifting, chocks, shoring, freight bracing',
    howto: {
      name: 'How to Block and Brace a Heavy Load',
      steps: [
        { name: 'Assess the load', text: 'Identify the load weight, center of gravity, and contact surfaces to decide bearing points and which directions it can move.' },
        { name: 'Set the dunnage', text: 'Lay hardwood dunnage to create level bearing points and fill the gaps under and around the load.' },
        { name: 'Block fore and aft', text: 'Nail chocks and cleats to the deck to stop the load from sliding forward under braking or backward on grades.' },
        { name: 'Brace side to side', text: 'Add shoring, bracing bars, or cradles to stop lateral movement in curves and crosswinds.' },
        { name: 'Add tie-downs', text: 'Strap or chain the load to rated points with total capacity of at least half the cargo weight, using edge protectors.' },
      ],
    },
    body: `
<p>Walk past a loaded flatbed and you notice the straps. But straps are the last thing that goes on, and on their own they do not stop a heavy load from moving — they hold it against something. That something is <strong>blocking and bracing</strong>, and it is the part of securement that actually keeps cargo still. Here is how it works.</p>

<h2>Blocking and bracing vs. tie-downs</h2>
<p>The two do different jobs. <strong>Blocking and bracing</strong> physically fill the space around a load so it cannot slide or tip — wedges, chocks, and structure that stop motion. <strong>Tie-downs</strong> (straps and chains) then clamp the load down against that structure. Rely on straps alone and a heavy machine can still rock, walk, and load-shift on a hard stop. Block it first, and the straps only have to keep it seated.</p>

<figure>
  <img src="../assets/img/loads/blocking-bracing-dunnage-box-truck.jpg" alt="Wooden dunnage, pallets, and blocking used to brace machinery inside a box truck to prevent shifting in transit" loading="lazy" width="640" height="480">
  <figcaption>Hardwood dunnage and blocking filling the gaps so nothing can slide — inside a real Badass Logistics load-out.</figcaption>
</figure>

<h2>The tools of the trade</h2>
<ul>
  <li><strong>Dunnage.</strong> Hardwood beams and blocks that carry weight, fill gaps, and create bearing points. The backbone of most bracing.</li>
  <li><strong>Chocks and cleats.</strong> Wedges nailed to a wooden deck that stop wheels, skids, and rounded loads from rolling or sliding.</li>
  <li><strong>Cradles and racks.</strong> Shaped supports for coils, pipe, tanks, and anything that will not sit flat on its own.</li>
  <li><strong>Shoring and bracing bars.</strong> Structure that braces a load against the trailer walls or a bulkhead in a van or box truck.</li>
  <li><strong>Edge protectors and friction mats.</strong> Save straps from sharp corners and add grip so the load resists sliding in the first place.</li>
</ul>

<h2>Fore-aft, side-to-side, and up</h2>
<p>A proper job controls movement in <strong>every direction</strong>. Hard braking throws a load forward; acceleration and hills push it back; curves and crosswinds shove it sideways; rough road tries to bounce it up. Each of those gets its own blocking or tie-down so no single event can start the load moving. Federal rules put a number on the down-force — total tie-down working load limit of at least half the cargo weight — but the blocking is what makes that number mean something.</p>

<figure>
  <img src="../assets/img/loads/enclosed-trailer-machinery-loaded.jpg" alt="Machinery and shrink-wrapped equipment blocked and braced inside an enclosed box trailer for damage-free transport" loading="lazy" width="640" height="480">
  <figcaption>Machinery braced and seated inside an enclosed trailer — blocked so it cannot walk, then secured.</figcaption>
</figure>

<h2>Why it matters more than the strap count</h2>
<p>A load that shifts is how equipment gets damaged, how trailers get unbalanced, and how cargo ends up on the shoulder. Good blocking and bracing is invisible when it works and obvious when it does not. It is also the difference between a machine that arrives ready to install and one that arrives with a cracked casting. This is standard on every <a href="how-to-prepare-a-machine-for-shipping.html">machine shipment</a> and <a href="what-is-industrial-rigging.html">rigging</a> job we run.</p>

<div class="takeaways">
  <h3>The short version</h3>
  <ul>
    <li>Blocking and bracing stop movement; tie-downs hold the load against it.</li>
    <li>Dunnage, chocks, cradles, and shoring are the tools — matched to the load.</li>
    <li>Control every direction: forward, back, sideways, and up.</li>
    <li>Tie-down capacity of at least half the cargo weight is the floor, not the plan.</li>
  </ul>
</div>

<p>Want your load braced like it matters? <a href="../contact.html">Tell us what you are shipping</a> and our crews will build the securement around it.</p>
`,
    faq: [
      { q: 'What is the difference between blocking and bracing?', a: 'Blocking uses wedges, chocks, and dunnage to fill the space under and around a load so it cannot slide; bracing adds structure — shoring, bars, cradles — that holds the load against the trailer or a bulkhead. Together they stop movement so tie-downs only have to keep the load seated.' },
      { q: 'What is dunnage in shipping?', a: 'Dunnage is the hardwood beams, blocks, and boards used to support cargo, fill gaps, create bearing points, and keep a load off the deck. It is the backbone of most blocking and bracing on flatbeds, vans, and box trucks.' },
      { q: 'How many straps does a load need?', a: 'Federal rules require total tie-down working load limit of at least half the cargo weight, with a minimum number based on length and weight. But strap count alone does not secure a load — proper blocking and bracing is what stops it from shifting in the first place.' },
    ],
    related: [
      { h: 'How to Prepare a Machine for Shipping', u: 'how-to-prepare-a-machine-for-shipping.html' },
      { h: 'What Is Industrial Rigging?', u: 'what-is-industrial-rigging.html' },
      { h: 'Industrial Crating &amp; Packing', u: '../services/crating-packing.html' },
      { h: 'Get a Quote', u: '../contact.html' },
    ],
  },


  {
    slug: 'how-much-does-it-cost-to-move-a-cnc-machine',
    cat: 'Machinery Moving',
    hero: 'loads/enclosed-trailer-machinery-loaded.jpg',
    date: '2026-06-30',
    title: 'What Drives the Cost of Moving a CNC Machine?',
    desc: 'There is no flat rate to move a CNC machine — the price is built from weight and size, rigging complexity at both ends, distance, transport type, and prep. Here are the levers that decide the number, and how to get an accurate quote.',
    dek: 'No flat rate, no guesswork. The real levers behind a CNC machine move — and how to get a number you can trust.',
    tldr: 'The cost of moving a CNC machine is driven by its weight and dimensions, the rigging complexity at both ends (clearances, floor capacity, crane vs. skate), the distance and transport type (air-ride vs. flatbed), and prep like disconnection, crating, and re-leveling. A small VMC across town and a 40,000-lb machining center across the country are different jobs — send the model and both site layouts for a real quote.',
    keywords: 'cost to move a CNC machine, CNC machine moving cost, machinery moving quote, CNC relocation, machine rigging cost',
    body: `
<p>Ask "what does it cost to move a CNC machine" and the honest answer is the same as for any rigging job: <strong>it depends on the machine and the two buildings it moves between</strong>. A benchtop mill and a 40,000-pound horizontal machining center are not the same job and should not carry the same price. What you can do is understand the levers — because once you know what drives the number, you can hand us the details that get you an accurate quote on the first call. We do not post flat rates, because a flat rate on a job this variable is just a wrong number waiting to happen.</p>

<h2>What actually drives the price</h2>
<ul>
  <li><strong>Weight and size.</strong> Heavier, larger machines need bigger rigging gear, more crew, and sometimes a crane instead of skates. Weight also decides the trailer the carrier partner sends and how the machine is loaded out.</li>
  <li><strong>Rigging at both ends.</strong> This is the big one. Tight doorways, stairs, mezzanines, low ceilings, soft or weight-limited floors, and a long push from the machine pad to the truck all add labor and equipment. An easy dock-to-dock move and a machine buried three corners deep in an old building are worlds apart.</li>
  <li><strong>Distance and transport type.</strong> Loaded miles matter, and so does how it rides — a precision machine on an air-ride enclosed trailer is a different cost than an open flatbed.</li>
  <li><strong>Disconnection and prep.</strong> Draining coolant and hydraulics, retracting axes, protecting the control, and setting shipping brackets per the manual. Some shops do this themselves; some want it handled.</li>
  <li><strong>Crating and protection.</strong> Large or delicate machines may need <a href="white-glove-freight-and-custom-crating.html">custom crating</a>, shrink-wrap, and shock protection.</li>
  <li><strong>Reinstall and leveling.</strong> Setting the machine on its new pad and <strong>leveling it to the builder's spec</strong> — because geometry and accuracy start from a level casting — is part of most moves.</li>
</ul>

<figure>
  <img src="../assets/img/loads/crating-shrink-wrap-electrical-equipment.jpg" alt="Sensitive machine control enclosure being shrink-wrapped and crated before a machinery move" loading="lazy" width="600" height="800">
  <figcaption>Prep and crating are real cost drivers — how a machine is protected depends on how sensitive it is.</figcaption>
</figure>

<h2>How to get an accurate quote</h2>
<p>Give us these and we can turn a real number around fast:</p>
<ul>
  <li>Machine <strong>make, model, weight, and dimensions</strong> (the spec sheet is perfect).</li>
  <li><strong>Both site layouts</strong> — doorway widths, path to the truck, stairs or elevators, floor type, and dock access.</li>
  <li>Whether you need <strong>disconnection, crating, and re-leveling</strong> or just the transport.</li>
  <li><strong>Pickup and delivery</strong> locations and your target dates.</li>
  <li>A few <strong>photos</strong> of the machine and the path out — they answer a dozen questions at once.</li>
</ul>
<p>That is the same information our crews use to size the rigging gear, spec the trailer, and price the labor. The more precise you are, the tighter the quote — and the fewer surprises on move day.</p>

<h2>Can you make it cheaper?</h2>
<p>Sometimes. Doing your own disconnection and reconnection saves labor if your team is set up for it. Flexible dates let us schedule efficiently. And a clear path out — cleared aisles, a removed door, a known floor rating — cuts the rigging time that drives a big share of the cost. We will tell you straight where the savings are and where cutting a corner will cost you a machine.</p>

<div class="takeaways">
  <h3>The short version</h3>
  <ul>
    <li>No flat rate — weight, rigging difficulty, distance, and prep set the price.</li>
    <li>Rigging at both ends (clearances, floors, crane vs. skate) is usually the biggest lever.</li>
    <li>Send the model, both site layouts, and photos for an accurate quote.</li>
    <li>Level to spec at the destination — it is part of a proper move, not an extra.</li>
  </ul>
</div>

<p>Moving one machine or a whole shop? Our <a href="../services/cnc-machine-movers.html">CNC machine movers</a> and <a href="../services/machinery-moving.html">machinery moving</a> crews rig it, haul it, and set it back to spec. <a href="../contact.html">Send the model list and both floor plans</a> for a real number. For the how-to side, see <a href="how-to-move-a-cnc-machine.html">how to move a CNC machine without wrecking it</a>.</p>
`,
    faq: [
      { q: 'How much does it cost to move a CNC machine?', a: 'There is no flat rate. The cost is built from the machine\'s weight and size, the rigging difficulty at both ends (doorways, floors, stairs, crane vs. skate), the distance and transport type, and prep like disconnection, crating, and re-leveling. Send the model and both site layouts for an accurate quote.' },
      { q: 'What makes a CNC move more expensive?', a: 'Rigging difficulty is usually the biggest factor: tight or upstairs locations, weight-limited floors, low ceilings, and a long push to the truck all add labor and equipment. Heavier machines, air-ride transport, custom crating, and full disconnect-and-reinstall service also raise the price.' },
      { q: 'Can I save money by preparing the machine myself?', a: 'Often, yes. Handling your own disconnection and reconnection, clearing the path out, and being flexible on dates all reduce the labor and time that drive the cost — as long as the prep is done correctly to protect the machine.' },
    ],
    related: [
      { h: 'CNC Machine Movers', u: '../services/cnc-machine-movers.html' },
      { h: 'How to Move a CNC Machine', u: 'how-to-move-a-cnc-machine.html' },
      { h: 'Machinery Moving', u: '../services/machinery-moving.html' },
      { h: 'Get a Quote', u: '../contact.html' },
    ],
  },

  {
    slug: 'plant-relocation-checklist',
    cat: 'Plant Relocation',
    hero: 'loads/gooseneck-flatbed-industrial-tanks.jpg',
    date: '2026-07-02',
    title: 'Plant Relocation Checklist: What a Quote Needs to Cover',
    desc: 'The plant relocation checklist: what a comparable relocation quote must include, what to have ready before you ask for one, and how a process plant move differs from a discrete-manufacturing move.',
    dek: 'A relocation quote is only as good as what the estimator was given. Here is the checklist — including what the quote itself has to cover.',
    tldr: 'A comparable plant relocation quote needs the same inputs from every bidder: a full asset list with weights, dimensions and utilities, exit and receiving-site access, the required production restart date, and a clear scope split on disconnect and reconnect. Have that survey done before you request one. A process plant — piping, tanks, skidded equipment, live utilities — needs a shutdown-sequenced plan a discrete-manufacturing quote does not.',
    keywords: 'plant relocation quote, process plant relocation, manufacturing location checklist, plant relocation, factory move, facility relocation, machinery moving, industrial move, production line move',
    howto: {
      name: 'How to Relocate a Plant',
      steps: [
        { name: 'Survey and tag assets', text: 'Walk the facility and inventory every machine with its weight, dimensions, utilities, and exit path; tag each asset and map it to the new floor plan.' },
        { name: 'Sequence the move', text: 'Build the schedule backward from production so the equipment needed first at the new site is set first and shut down last at the old site.' },
        { name: 'Disconnect and prep', text: 'Power down, lock out, drain, and disconnect each machine, set shipping brackets, and label everything to match the new floor plan.' },
        { name: 'Rig and transport', text: 'Rig each machine out along its surveyed path and load it on the right trailer for its size and sensitivity, sequenced as project freight in install order.' },
        { name: 'Set and recommission', text: 'Rig machines into place, level to the manufacturer spec, reconnect utilities, and recommission in production order.' },
      ],
    },
    body: `
<p>Relocating a plant is not one heroic heavy lift — it is <strong>dozens of moves in the right order</strong>, run so the business loses as little production as possible. The machines are the easy part. The hard part is sequencing: what comes down first, what ships when, and what has to be running again by Monday. A plant relocation quote is a promise to manage that sequencing, and it is only as reliable as what the requesting company hands over before asking for a number. Here is the checklist we work from — starting with the quote itself.</p>

<figure>
  <img src="../assets/img/loads/gooseneck-flatbed-industrial-tanks.jpg" alt="Industrial process equipment loaded on a gooseneck flatbed during a plant relocation" loading="lazy" width="1024" height="576">
  <figcaption>One asset of many — plant relocation is this, repeated in a planned sequence across a whole facility.</figcaption>
</figure>

<h2>What does a plant relocation quote need to include to be comparable?</h2>
<p>Two quotes for the same relocation are only comparable if they were built on the same inputs and cover the same scope. At minimum, a quote worth comparing states:</p>
<ul>
  <li><strong>The asset list it priced against</strong> — how many machines, their weights and dimensions, and whether that came from a real survey or an estimate from a floor plan.</li>
  <li><strong>What's in scope and what isn't.</strong> Rigging and transport only, or does the number also cover disconnect, reconnect, leveling, and recommissioning? A cheaper quote that excludes reconnection is not actually cheaper.</li>
  <li><strong>The access and site conditions it assumes</strong> — exit path at the old site, receiving-dock and floor-loading conditions at the new one, and whether a crane pick is assumed anywhere in the route.</li>
  <li><strong>The production restart date it's built around.</strong> A quote that doesn't reference your downtime window wasn't built as a sequencing plan — it was priced as a generic haul.</li>
  <li><strong>Who is responsible for OEM disconnect and reconnect</strong> on equipment where that has to be a manufacturer or authorized technician, and how that work is coordinated against the freight and rigging schedule.</li>
  <li><strong>The trailer and equipment assumptions</strong> behind the number — flatbed or step-deck for heavy iron, enclosed air-ride for anything precision, and how many loads that implies.</li>
</ul>
<p>If a quote is silent on any of these, it isn't wrong — it's incomplete, and an incomplete quote can't be weighed fairly against one that spells all of it out.</p>

<h2>What should you have ready before requesting a quote?</h2>
<p>The single biggest driver of quote accuracy is whether the requesting company can hand over a real survey instead of a guess. Before asking for a number, have on hand:</p>
<ul>
  <li><strong>An asset list</strong> with weight, footprint, and utility connections (power, air, water, data, process lines) for every machine moving.</li>
  <li><strong>Current and new floor plans</strong>, with each asset mapped to where it lands at the new site.</li>
  <li><strong>Access measurements at both ends</strong> — doorways, aisles, dock heights, floor load ratings, and any freight elevator or ramp the load has to pass through.</li>
  <li><strong>The required production restart date</strong>, or the downtime window the business can actually absorb.</li>
  <li><strong>Clarity on who handles disconnect and reconnect</strong> — in-house maintenance, the equipment OEM, or the relocation crew — for at least the equipment that's warranty-sensitive.</li>
  <li><strong>Site readiness at the destination</strong> — are pads, foundations, and utilities already live, or does the schedule depend on construction finishing on time?</li>
</ul>
<p>A company that can hand over this list gets quotes back that are close to the final number. A company that can't gets estimates with wide contingency built in, because the estimator is pricing the unknowns along with the move.</p>

<h2>What makes a plant relocation quote unreliable?</h2>
<p>A few patterns show up consistently in quotes that don't hold up once the move starts:</p>
<ul>
  <li><strong>No site walk and no asset list behind it.</strong> A number built off a square-footage figure or a phone description is a guess with a price attached, not an estimate.</li>
  <li><strong>A flat per-load or per-mile rate with no sequencing behind it.</strong> A relocation with forty machines and a tight downtime window is a scheduling problem with rigging jobs inside it — a rate that only prices the rigging is missing the part that actually drives cost.</li>
  <li><strong>Scope that's undefined.</strong> If the quote doesn't say whether disconnect, reconnect, and leveling are included, assume they aren't, and get that in writing before comparing it to a number that does include them.</li>
  <li><strong>No allowance for what's actually being moved.</strong> A quote for a process plant that reads identically to a quote for a discrete-manufacturing plant — same line items, same generic language — usually means the estimator didn't account for what's different about a process facility (below).</li>
</ul>

<h2>1. Survey and tag every asset</h2>
<p>Before anything moves, the facility gets walked and inventoried: every machine, its weight and dimensions, its utilities (power, air, water, data), and its condition. Each asset is <strong>tagged</strong> and mapped to a spot on the new floor plan. This is also where the exit path for each machine gets measured — doorways, aisles, docks, floor ratings.</p>

<h2>2. Sequence the move around production</h2>
<p>This is where a plant move is won or lost. The schedule is built <strong>backward from production</strong>: whatever needs to be running first at the new site is planned to arrive and be set first, which often means it is the <em>last</em> thing shut down at the old site. Non-critical and warehouse items move first as a dry run; the production line moves in a tight, staged window.</p>

<figure>
  <img src="../assets/img/loads/heavy-haul-industrial-enclosures-flatbed.jpg" alt="Large industrial equipment secured on a flatbed trailer during a staged plant relocation" loading="lazy" width="1131" height="848">
  <figcaption>Production equipment staged and moved in sequence — the plan decides load order, not the loading dock.</figcaption>
</figure>

<h2>3. Disconnect and prep</h2>
<p>Machines get powered down, locked out, drained, and disconnected from utilities — often with the plant's maintenance team or the OEM handling the technical side. Axes are retracted, shipping brackets set, controls protected, and everything <strong>labeled to match the new floor plan</strong> so reconnection is not a guessing game.</p>

<h2>4. Rig, load, and transport</h2>
<p>Each machine is rigged out along its surveyed path and loaded on the <strong>right trailer for its size and sensitivity</strong> — flatbed or step-deck for the heavy iron, enclosed air-ride for anything precision or delicate. Loads run as <a href="../services/project-freight.html">project freight</a> — often on <a href="../services/dedicated-lanes.html">dedicated lanes</a> for the length of the move. The convoy is sequenced so machines arrive in install order, not in a pile.</p>

<h2>5. Set, level, and recommission</h2>
<p>At the new site, machines are rigged into place, set on their pads, and <strong>leveled to spec</strong>, then reconnected to utilities and recommissioned in production order. The goal the whole way through: the line comes back up on schedule, not "eventually."</p>

<h2>How is a process plant relocation different from a discrete-manufacturing move?</h2>
<p>The checklist above applies to both, but a <strong>process plant</strong> — chemical, food, pharma, or any facility built around continuous flow through piping, tanks, and skidded process units — adds work at almost every step that a discrete-manufacturing plant moving individual machines and workstations doesn't carry:</p>
<ul>
  <li><strong>Piping is part of the asset list, not just the machines.</strong> Process piping has to be tagged, matched to isometric drawings, drained, and often cut and flanged at defined points rather than simply unbolted. Reconnection depends on those tags matching the drawings at the new site — mislabeled piping is one of the most common causes of a slow restart.</li>
  <li><strong>Tanks and vessels have to be drained and purged before they move</strong>, and depending on what they held, that can mean a cleaning or inerting step that a discrete-manufacturing move never encounters. This has to be scheduled into the sequence, not treated as a disconnect formality.</li>
  <li><strong>Skidded process equipment moves as a unit.</strong> Skid-mounted packages — reactors, pumps, heat exchangers, control panels on a common frame — are rigged and shipped as an assembly to preserve the alignment between components. Breaking a skid apart to move it piece by piece usually costs more in re-commissioning than it saves in transport.</li>
  <li><strong>Utility tie-ins go beyond power.</strong> A discrete-manufacturing quote is mostly about electrical and maybe compressed air. A process plant quote has to account for steam, process gas, chemical feed lines, and instrumentation air — utilities that plant engineering, not just facilities staff, has to sign off on at both ends.</li>
  <li><strong>Sequencing is built around a shutdown or turnaround window</strong>, not just off-hours. Process lines are often interdependent in ways a row of standalone machines isn't — one unit down can mean the whole line is down — so the survey has to map those dependencies before the sequence is set, and the receiving site's utility tie-ins need to be live and tested before startup, not just its floor space ready.</li>
</ul>
<p>A quote that doesn't distinguish between these two kinds of facilities is a sign the estimator priced the move as generic rigging and haul rather than as the plant it actually is.</p>

<div class="takeaways">
  <h3>The checklist, condensed</h3>
  <ul>
    <li>A comparable quote states its asset list, scope, access assumptions, restart date, and disconnect/reconnect ownership.</li>
    <li>Have a real survey, floor plans, access measurements, and a restart date ready before requesting quotes.</li>
    <li>Survey, weigh, and tag every asset; map it to the new floor plan.</li>
    <li>Sequence backward from production — last out is first back online.</li>
    <li>Disconnect and label so reconnection is not guesswork.</li>
    <li>Match each machine to the right trailer; sequence the freight in install order.</li>
    <li>Set, level to spec, reconnect, and recommission in order.</li>
    <li>Process plants add piping, tank draining, skid handling, and utility tie-ins a discrete-manufacturing move doesn't carry.</li>
  </ul>
</div>

<p>Planning a move? Our <a href="../services/plant-relocation.html">plant relocation</a> and <a href="../services/machinery-moving.html">machinery moving</a> crews handle the survey, the sequence, the <a href="../services/rigging.html">rigging</a>, and the transport as one project. <a href="../contact.html">Send us your asset list and both floor plans</a> and we will build the move plan.</p>
`,
    faq: [
      { q: 'What should a plant relocation quote include?', a: 'A quote worth comparing states the asset list it was priced against, what\'s in scope (rigging and transport only, or also disconnect, reconnect, and leveling), the access and site conditions it assumes, the production restart date it\'s built around, and who is responsible for OEM disconnect and reconnect. A quote silent on these isn\'t necessarily wrong, but it can\'t be fairly compared to one that spells them out.' },
      { q: 'What do I need to have ready before requesting a plant relocation quote?', a: 'An asset list with weight, footprint, and utility connections for every machine; current and new floor plans; access measurements at both ends; the required production restart date or downtime window; and clarity on who handles disconnect and reconnect. The more of a real survey you can hand over, the closer the quote will land to the final number.' },
      { q: 'How is relocating a process plant different from a discrete-manufacturing move?', a: 'A process plant adds piping that has to be tagged and matched to isometric drawings, tanks and vessels that need draining or purging before they move, skidded equipment that ships as a unit to preserve alignment, and utility tie-ins — steam, process gas, chemical feed, instrumentation air — beyond electrical. Sequencing is built around a shutdown or turnaround window because process lines are often interdependent in a way standalone machines aren\'t.' },
      { q: 'How do you minimize downtime in a plant relocation?', a: 'By sequencing the move backward from production. The equipment that must run first at the new site is planned to arrive and be set first — which usually means it is the last thing shut down at the old site — while non-critical items move first. Careful labeling and a staged convoy keep reconnection fast.' },
      { q: 'How long does it take to relocate a plant?', a: 'It depends on the number and size of machines, the complexity of disconnection and reinstallation, and how much downtime the business can absorb. A tightly sequenced move can shrink the production gap significantly; the survey and asset list are what let us give a realistic schedule.' },
      { q: 'Who disconnects and reconnects the machines?', a: 'The technical disconnection and reconnection are typically handled by the plant\'s maintenance team or the equipment OEM, while our crews handle rigging, loading, transport, and setting machines on their new pads. We coordinate the sequence so both sides line up.' },
    ],
    related: [
      { h: 'Plant Relocation', u: '../services/plant-relocation.html' },
      { h: 'How to Choose a Plant Relocation Contractor', u: 'how-to-choose-a-plant-relocation-contractor.html' },
      { h: 'Machinery Moving', u: '../services/machinery-moving.html' },
      { h: 'Industrial Rigging', u: '../services/rigging.html' },
      { h: 'Get a Quote', u: '../contact.html' },
    ],
  },
  {
    slug: "how-to-prepare-a-machine-for-shipping",
    cat: "Machinery Moving",
    hero: "loads/white-glove-crated-equipment-delivery.jpg",
    date: "2026-07-02",
    title: "How to Prepare a Machine for Shipping: The Pre-Move Checklist",
    desc: "A blunt pre-shipping checklist for machinery: drain the coolant, lock every axis, set shipping brackets, verify weight and dimensions, clear the path out.",
    dek: "The truck is the easy part. Machine moves are won or lost in the week before it arrives — here is the prep work, straight from the dispatch desk.",
    tldr: "Before the riggers arrive: verify true weight and shipped dimensions off the data plate, drain the coolant sump, home and mechanically lock every axis, pull tooling and the control pendant, install shipping brackets, grease and wrap the ways and spindle, photograph everything, and clear a measured path to the door.",
    keywords: ["how to prepare a machine for shipping", "machine shipping preparation", "CNC shipping brackets", "drain coolant before shipping", "machinery moving checklist", "machine rigging prep"],
    howto: {"name": "Prepare a Machine for Shipping in 6 Steps", "steps": [{"name": "Confirm weight and dimensions", "text": "Pull the weight from the data plate or the manufacturer's spec sheet and measure the machine as it will ship, including the skid and anything still bolted on. These numbers decide the trailer, the rigging plan, and whether the machine ships whole or in sections."}, {"name": "Drain coolant and loose fluids", "text": "Pump the coolant sump dry, empty the chip conveyor tray, and remove chips. Follow the manual on hydraulic and lube reservoirs — some drain, some ship sealed. Dispose of used coolant per local regulations."}, {"name": "Home, retract, and lock every axis", "text": "Send each axis to the transport position the manual specifies, then lock it mechanically with the factory axis locks or solid wood blocking so nothing drifts under road vibration."}, {"name": "Remove or secure loose items", "text": "Empty the tool carousel and turret, remove chuck jaws and probes, dismount the control pendant and monitors, and band or bolt every door and cover shut. Bag and label all hardware."}, {"name": "Set shipping brackets and protect precision surfaces", "text": "Bolt in the factory shipping brackets on the spindle head and counterweight, coat exposed ways with way oil or grease, and wrap the spindle nose. No brackets? Tell the movers ahead of time so they can block and brace."}, {"name": "Document and clear the path", "text": "Photograph all four sides, the data plate, and every existing mark. Then measure doorways and aisles against shipped dimensions, verify floor capacity along the route, and clear the aisle before the crew arrives."}]},
    body: "<p>Most machine moves don't go sideways on the truck. They go sideways in the week before the truck shows up &mdash; coolant still in the sump, a toolchanger left loaded, a machine nobody actually weighed. From the dispatch desk, the pattern is consistent: shops that prep load out in a morning; shops that don't burn a full day and sometimes a spindle. Here is the checklist we wish every shop worked through before a <a href=\"../services/machinery-moving.html\">machinery move</a>.</p>\n\n<h2>Start with the real weight and dimensions</h2>\n<p>Every downstream decision &mdash; trailer type, rigging gear, crew size, loadout method &mdash; hangs on two numbers you should nail down first. The legal envelope on US highways is generally <strong>8'6\" wide, 13'6\" tall, about 53' of trailer length, and 80,000 lbs gross</strong>. A machine that pushes the load past any of those thresholds changes the plan: a step-deck instead of a flatbed, or taking the machine down into sections so each piece ships as standard freight. Pull the weight off the data plate or the manufacturer's spec sheet, never from memory. Then measure the machine as it will actually ship &mdash; on its skid, with brackets and anything still bolted to it. \"Around nine feet tall\" is not a dimension. It is a low bridge waiting to happen.</p>\n\n<h2>Drain coolant and loose fluids</h2>\n<p>Standing coolant is the most common prep failure we see. It sloshes, it leaks through door seams onto the trailer deck, and on a tilted machine it finds the electrical cabinet. Pump the sump dry, empty the chip conveyor tray, and pull the chips &mdash; wet swarf is dead weight you don't want and a cleanup you really don't want. Hydraulic and lube reservoirs are machine-specific: some manufacturers say drain, some say leave sealed. Check the manual and tell your move coordinator which way you went. Dispose of used coolant per local regulations, not down the floor drain.</p>\n\n<h2>Home, retract, and lock every axis</h2>\n<p>Under power, the servos hold everything where it belongs. On a trailer, nothing holds anything. Send each axis to the position the manual specifies for transport &mdash; typically Z fully retracted, the table centered or at a stated coordinate &mdash; then lock it mechanically. That means the factory <strong>shipping brackets</strong> on the spindle head and counterweight if you still have them, or solid wood blocking and steel banding if you don't. Vertical machining centers are the classic failure: an unbraced head walking down its ballscrew across hundreds of miles of expansion joints. If the brackets are long gone, say so up front &mdash; a competent <a href=\"../services/rigging.html\">rigging crew</a> can block and brace on site, but only if they know before load day.</p>\n\n<h2>Strip the loose stuff</h2>\n<p>Anything that can move, will. Empty the tool carousel and the turret. Remove chuck jaws, vises, tailstock centers, and probes. Dismount the control pendant and any monitor on an articulating arm &mdash; pendants shear off in transit, and a replacement is a lead-time problem, not a parts-counter problem. Band or bolt every door, cover, and sheet-metal panel shut; painter's tape is not securement. Bag the hardware, label the bags, and tape them inside the electrical cabinet. If it ships loose, it ships crated &mdash; not rattling around inside the enclosure.</p>\n\n<figure><img src=\"../assets/img/loads/crating-shrink-wrap-electrical-equipment.jpg\" alt=\"Electrical control equipment crated and shrink-wrapped for machinery shipping\" loading=\"lazy\" width=\"600\" height=\"800\"><figcaption>Controls, pendants, and loose panels ship crated and shrink-wrapped &mdash; never loose inside the machine.</figcaption></figure>\n\n<h2>Protect the precision surfaces</h2>\n<p>Exposed ways, ballscrews, and the spindle taper are what make the machine worth moving in the first place. Coat exposed way surfaces with way oil or a light grease. Wrap the spindle nose and put a plug or a covered tool in the taper. If the machine rides an open deck, settle the shrink-wrap and tarping plan with the movers before load day &mdash; road film and rain on bare cast iron is corrosion, and corrosion on a way surface is a rebuild conversation. This matters double for <a href=\"../services/cnc-machine-movers.html\">CNC equipment</a>, where thousandths are the product.</p>\n\n<h2>Photograph everything</h2>\n<p>Before anyone touches the machine, shoot it: all four sides, the data plate, the control screen showing hours, every existing ding, close-ups of the ways and spindle. Two minutes with a phone establishes condition at pickup and ends every condition argument at delivery before it starts. Shoot again after prep, with brackets and banding visible, so the receiving end knows exactly what to remove and where.</p>\n\n<h2>Clear the path out</h2>\n<p>The crew can move the machine; they cannot move your building. Measure every doorway, dock, and aisle against the shipped dimensions &mdash; height on the skid included. Confirm the floor along the route takes the point loads of machine skates under full weight. Clear the aisle of pallets, benches, and product the day before, not while the crew stands there. If the machine has to come out through a wall panel or over a dock edge at an angle, that is planning, not improvisation &mdash; flag it when you <a href=\"../contact.html\">request a quote</a>, and read <a href=\"how-to-move-a-cnc-machine.html\">how to move a CNC machine</a> for what happens on the rigging side once your prep is done.</p>\n\n<div class=\"takeaways\"><h3>Bottom line</h3><ul>\n<li>Verified weight and shipped dimensions drive the trailer, the rigging plan, and the loadout &mdash; pull them from the data plate and a tape measure, not memory.</li>\n<li>Drain the coolant, lock every axis, and bracket the spindle head. Transport vibration destroys anything left free to move.</li>\n<li>Pendant off, tooling out, doors banded, photos of everything &mdash; before the crew arrives, not after.</li>\n<li>Missing shipping brackets and tight exit paths are solvable, but only if the movers know before load day.</li>\n</ul></div>",
    faq: [{"q": "Do I need to drain the hydraulic oil too, or just the coolant?", "a": "Coolant always comes out — it sloshes, leaks, and contaminates everything it touches. Hydraulic and way-lube reservoirs are machine-specific: some manufacturers require draining, others want the sealed system left alone so it doesn't ingest air or debris. Check the manual for your exact model and tell the move coordinator what you did, so the crew knows what is still wet."}, {"q": "What if I no longer have the factory shipping brackets?", "a": "It happens constantly — brackets get scrapped years before the machine sells. A competent rigging crew can fabricate wood blocking and steel banding on site to immobilize the spindle head, counterweight, and axes. The only unforgivable version is a free-floating head nobody mentioned. Flag missing brackets when you book the move, not when the truck is at the dock."}, {"q": "Who handles prep — the shop or the machinery movers?", "a": "Split responsibility, and it should be in writing. The movers handle rigging, loading, securement, and transport coordination. Internal prep — fluids, tooling removal, axis locks, brackets — is typically the shop's job or a hired service tech's, because it requires powering the machine and knowing its controls. Confirm the scope line by line before load day so nothing falls in the gap."}],
    related: [{"h": "Machinery Moving", "u": "../services/machinery-moving.html"}, {"h": "CNC Machine Movers", "u": "../services/cnc-machine-movers.html"}, {"h": "How to Move a CNC Machine", "u": "how-to-move-a-cnc-machine.html"}, {"h": "Get a Quote", "u": "../contact.html"}],
  },
  {
    slug: "machine-leveling-and-alignment",
    cat: "Specialized Rigging",
    hero: "loads/enclosed-trailer-machinery-loaded.jpg",
    date: "2026-07-02",
    title: "Machine Leveling and Alignment After a Move (and Why It Matters)",
    desc: "Why a machine cuts bad parts until it's re-leveled to the builder's spec after a move: bed twist, circularity, foundations, thermal drift, and test cuts.",
    dek: "Accuracy specs are written for a level casting. Set the machine down wrong and the geometry goes with it — here's what re-leveling actually restores.",
    tldr: "Every accuracy spec on a machine tool assumes the casting is leveled to the builder's installation spec. After a move, twist in the base shows up as taper, out-of-round bores, and lost squareness. Re-level on the correct pads with a precision level, respect the foundation and settling time, then prove the machine with a test cut before releasing production.",
    keywords: ["machine leveling after a move", "machine tool alignment", "precision machinist level", "leveling pads and feet", "machine foundation and anchoring", "bed twist and taper", "requalification test cut"],
    body: "<p>A machine that held tenths at the old plant and can't hold two thou at the new one usually isn't damaged. It's twisted. Machine tools are built on one quiet assumption: the casting sits the way the builder's assembly floor had it — ways scraped, gibs fitted, squareness verified with the bed dead level. Set that same casting on a slab that's off across the footprint and you've changed the machine's geometry without touching a single component.</p><p>From the dispatch desk, leveling is the handoff. Our job on a <a href=\"../services/machinery-moving.html\">machinery moving</a> project is to land the machine on its marks, on the correct pads, over a floor that can carry it. Your millwright or the OEM tech brings it back to spec. Here's why that second half decides whether the move actually worked.</p><h2>Geometry starts with a level casting</h2><p>Every number on the builder's accuracy sheet — positioning, repeatability, circularity, squareness — was measured with the machine leveled per the installation manual. Level isn't about gravity or coolant drainage. It's the reference state for the entire geometry stack: twist the base and the ways twist with it, and everything riding on those ways inherits the error.</p><p>The symptoms are predictable. A lathe bed with twist cuts taper — the classic two-collar test bar mics fat on one end no matter how good the operator is. A machining center with a racked base loses squareness between axes, so circular interpolation turns bores into subtle ovals; a ballbar plot shows it as a tilted ellipse long before the CMM flags a bad part. Positioning accuracy goes with it, because the scales and screws are now measuring travel along a bent reference.</p><figure><img src=\"../assets/img/loads/load-machine-loadout.jpg\" alt=\"Rigging crew loading out a machining center — placement at the new facility is the start of installation, not the end\" loading=\"lazy\" width=\"1200\" height=\"800\"><figcaption>Set-down is the start of installation, not the finish. Accuracy comes back when the machine is re-leveled and requalified to the builder's spec.</figcaption></figure><h2>Feet, pads, and what carries the weight</h2><p>How the machine meets the floor matters as much as where. Builders specify the support system for a reason:</p><ul><li><strong>Three-point mounts</strong> self-define a plane — the machine can sit out of level, but the floor can't twist it. Common on smaller, stiff-casting machines.</li><li><strong>Multi-point jack screws and wedge pads</strong> are the opposite case. On a long-bed lathe or grinder with ten or twelve support points, twist gets dialed in or out one foot at a time, following the builder's sequence and load pattern.</li><li><strong>Isolation pads</strong> are spec'd for the machine's weight and vibration profile. Soft rubber under a machine the builder wants on steel wedges will let it walk out of level as it runs.</li></ul><p>Reusing whatever the machine sat on at the old plant is a gamble. Pads take a set, wedges disappear during teardown, and the new slab is not the old slab.</p><h2>The level itself</h2><p>A carpenter's level has no business near this work. Precision machinist levels are graduated in fractions of a thousandth of an inch per foot — sensitive enough that a person walking past moves the bubble — and electronic levels read finer still and log the numbers. The manual says where they go: machined reference surfaces, the table, the ways, checked in both axes. Never sheet-metal covers. If the installation crew shows up with a torpedo level, the machine is being positioned, not leveled.</p><h2>Foundation and anchoring</h2><p>The best leveling job dies on a bad slab. Builders publish foundation requirements — thickness, reinforcement, sometimes an isolated pour cut off from forklift traffic — and a machine expected to hold real tolerance needs them honored. A cracked or thin slab flexes under the machine and under everything that drives past it. Anchoring is machine-specific: some castings must be anchored and grouted to reach rated accuracy, while others are meant to float on their mounts, and hard-bolting those warps the base. Slab evaluation, coring, and grout cure time are schedule items and real cost drivers on a relocation — far cheaper to plan than to discover.</p><h2>Thermal movement and settling</h2><p>Level on installation day is not level three weeks later. Concrete compresses under new point loads, so the level should be rechecked after the machine has been sitting — ideally running — for a couple of weeks. Temperature moves things too: a machine measured cold at seven in the morning is not the machine cutting warm at noon, and accuracy specs are written for thermal equilibrium. Shops holding tight tolerances recheck seasonally, because the building itself moves.</p><h2>Requalifying with a test cut</h2><p>A centered bubble is a precondition, not proof. After leveling comes geometry — tram the spindle, sweep the table, run a ballbar or laser where the work demands it — and after geometry comes the only verdict that counts: a test cut in the material you actually run. Bore a hole and measure roundness. Face a surface and check flatness. Turn the test bar and mic both ends. The machine is back in service when the part says so, not when the bubble does.</p><p>If a relocation is coming, plan the set-down and the requalification as one schedule, not two. Badass Logistics coordinates the <a href=\"../services/rigging.html\">rigging</a>, transport, and placement so the machine lands where the millwright needs it. Read <a href=\"how-to-move-a-cnc-machine.html\">How to Move a CNC Machine</a> for the transport side, or <a href=\"../contact.html\">get a quote</a> to talk through your move.</p><div class=\"takeaways\"><h3>Bottom line</h3><ul><li>Every accuracy spec assumes the casting is leveled to the builder's installation spec — a twisted base makes bad parts with nothing visibly broken.</li><li>Use the builder's specified pads, support points, and leveling sequence. Reused or wrong mounts are a common cause of post-move drift.</li><li>Precision machinist or electronic levels only, on machined reference surfaces, in both axes.</li><li>Recheck level after the slab and machine settle under load, and again seasonally for tight-tolerance work.</li><li>Requalify with geometry checks and a test cut before releasing production — the part is the proof.</li></ul></div>",
    faq: [{"q": "Does a machine need re-leveling if it only moved across the shop?", "a": "Yes. Any pick and set changes the support conditions — different slab section, disturbed pads, new load distribution. The move distance is irrelevant; the casting is now sitting on a different plane than the one its geometry was qualified on. Short moves skip the truck, not the leveling."}, {"q": "Do riggers level the machine, or does a millwright?", "a": "Both, in sequence. The rigging crew places the machine on its marks, on the correct pads, and rough-levels it so it sits stable and safe. Precision leveling to the builder's spec and geometry requalification are millwright or OEM service work. The mistake is treating them as separate projects — coordinate them as one schedule so the machine isn't sitting idle between crews."}, {"q": "How soon after installation should level be rechecked?", "a": "After the slab has taken the new point loads and the machine has run — commonly a couple of weeks of production. Concrete compresses, pads seat, and the building's temperature cycle shows up in the readings. For tight-tolerance work, many shops put a seasonal recheck on the maintenance calendar."}],
    related: [{"h": "Machinery Moving", "u": "../services/machinery-moving.html"}, {"h": "CNC Machine Movers", "u": "../services/cnc-machine-movers.html"}, {"h": "How to Move a CNC Machine", "u": "how-to-move-a-cnc-machine.html"}, {"h": "Industrial Rigging", "u": "../services/rigging.html"}],
  },
  {
    slug: "what-is-a-millwright",
    cat: "Specialized Rigging",
    hero: "rigging-hero.jpg",
    date: "2026-07-02",
    title: "What Is a Millwright — and Where They Fit in a Machine Move",
    desc: "What millwrights do — install, level, align, dismantle, and reassemble precision machinery — how the trade differs from rigging, and when a move needs both.",
    dek: "Riggers move the mass. Millwrights make the machine run again. Here is where the line sits between the two trades — and why most production machine moves need both.",
    tldr: "Millwrights install, level, align, dismantle, and reassemble precision machinery. Riggers move the weight. A rigging scope ends when the machine sits on its new footprint; a millwright scope ends when it holds tolerance under load. Any machine going back into production needs both trades, sequenced in the right order under one plan.",
    keywords: ["millwright", "millwright vs rigger", "machinery installation", "machine leveling and alignment", "machinery moving", "plant relocation", "industrial rigging"],
    body: "<p>A machine move is really two jobs. The first is moving mass: getting a 38,000-pound machining center off its foundation, across the floor, onto a trailer, and set down at the new plant without dropping it or racking the frame. The second is making that machine produce parts again — level, aligned, anchored, and holding tolerance. Riggers own the first job. Millwrights own the second. A steady share of the calls that hit our dispatch desk asking for one actually need both, so here is the plain-English version of who does what.</p><h2>What a millwright actually does</h2><p>A millwright is a precision industrial mechanic. The trade sits between heavy construction and machining: strong enough to wrestle a gearbox into position, precise enough to measure the result in thousandths of an inch. On a machine move, the work breaks into five buckets:</p><ul><li><strong>Installation.</strong> Setting the machine on its foundation, placing and torquing anchor bolts, shimming the base, and grouting where the spec calls for it.</li><li><strong>Leveling.</strong> Bringing the machine bed level and flat with machinist levels and laser instruments. This is not carpenter-level work — precision machine tools are commonly leveled to tolerances measured in thousandths of an inch per foot. A bed that sits twisted cuts scrap, wears unevenly, and drifts out of spec.</li><li><strong>Alignment.</strong> Shaft and coupling alignment between motors, gearboxes, and driven equipment using dial indicators or laser rigs. Misalignment kills bearings quietly, months after the move.</li><li><strong>Dismantling.</strong> Taking a machine apart for transport the right way: draining fluids, blocking axes and counterweights, match-marking mating parts, capping lines, and documenting the teardown so reassembly is not a guessing game.</li><li><strong>Reassembly and startup support.</strong> Putting it back together, verifying geometry, and supporting first power-up so the machine goes back to making parts instead of warranty claims.</li></ul><h2>What rigging covers — and where the line sits</h2><p>Rigging is the discipline of moving heavy loads under control. A rigging crew works out weight and center of gravity, selects the crane, gantry, forklift, or skate system, plans the travel path, checks floor loading, and executes the pick and the set. Riggers answer one question: how do we move this safely. Millwrights answer a different one: how does this run again.</p><p>The overlap is real — many millwrights carry rigging qualifications, and good machinery-moving crews field people who do both. But the finish line differs. A rigging scope is complete when the machine sits on its new footprint. A millwright scope is complete when the spindle runs true under load. If your scope of work stops at \"set in place,\" nobody on the job owns the second part — and that gap is where recommissioning problems live.</p><h2>How both trades sequence through a machine move</h2><ul><li><strong>Millwright first.</strong> Disconnect power, air, coolant, and data with the plant's electricians; drain and cap; block moving elements; pull whatever must come off for transport.</li><li><strong>Riggers out.</strong> Lift or skate the machine off its foundation, travel it to the dock, and load it with proper blocking and securement.</li><li><strong>Transport.</strong> Most dismantling decisions are trailer decisions. Stay inside the general legal envelope — roughly 8'6\" wide, 13'6\" tall, and 80,000 pounds gross — and the machine moves as standard freight. Go over, and the shipment gets harder to book and slower to move. Pulling a column or splitting a press bed is often what keeps each piece standard freight.</li><li><strong>Riggers in.</strong> Offload, travel to the final footprint, and set the machine on its foundation.</li><li><strong>Millwright last.</strong> Reassemble, anchor, grout, level, align, reconnect, and support startup.</li></ul><figure><img src=\"../assets/img/rigging-crane.jpg\" alt=\"Crane and rigging crew lifting industrial machinery during a machine move\" loading=\"lazy\" width=\"1200\" height=\"800\"><figcaption>Rigging gets the machine on and off the truck. Millwright work is everything before the pick and after the set.</figcaption></figure><h2>When a job needs both — and when rigging alone is enough</h2><p>Plan on both trades when the machine is going back into production: CNC machining centers, grinders, presses, injection molders, and anything with an alignment-critical drivetrain or a leveling spec in the install manual. Production lines add sequencing on top — machines have to come back online in the order the process runs.</p><p>Rigging alone can be enough when the machine is skidded and self-contained, headed to storage or auction rather than production, or when the buyer's own maintenance team handles recommissioning. Be honest about which case you are in. \"We'll level it ourselves later\" works fine for a shop press and badly for a five-axis machining center.</p><h2>What drives cost and schedule</h2><p>No two machine moves price the same, but the drivers are consistent: how much dismantling the machine needs to travel legally, how tight the leveling and alignment spec is, whether the foundation needs anchors or grout with cure time, whether the OEM requires certified installation to keep the warranty intact, and how narrow the downtime window is. One coordinated plan covering rigging, transport, and millwright work beats three contractors pointing at each other.</p><p>That coordination is the job at Badass Logistics: we scope the move, line up the rigging and millwright crews, arrange the transport leg, and sequence the handoffs so the machine that left your floor making parts arrives ready to do the same.</p><div class=\"takeaways\"><h3>Bottom line</h3><ul><li>Riggers move the mass; millwrights make the machine run. One scope ends at set-in-place, the other at holds-tolerance.</li><li>Any machine returning to production needs millwright work: leveling, alignment, anchoring, startup support.</li><li>Dismantling is usually a transport decision — staying inside roughly 8'6\" wide, 13'6\" tall, and 80,000 pounds gross keeps the load legal.</li><li>Put both trades in one coordinated scope so no gap opens between machine set and machine running.</li></ul></div>",
    faq: [{"q": "Is a millwright the same as a rigger?", "a": "No. Rigging is moving heavy loads under control — picks, travel paths, securement. Millwright work is precision: installing, leveling, aligning, and reassembling machinery so it runs in spec. Many pros carry both skill sets, but the scopes end in different places, and your contract should name both."}, {"q": "Do I need a millwright if the machine is only going into storage?", "a": "Usually not for the move itself — rigging and transport handle a skidded, self-contained machine fine. But a proper millwright teardown before storage, with fluids drained, axes blocked, and parts match-marked, makes the eventual reinstall far cleaner and faster."}, {"q": "Who handles the transport leg between plants?", "a": "That is a freight coordination job. Badass Logistics arranges the trucking alongside the rigging and millwright crews and sequences all three, so the trailer shows up when the machine is ready to load and the install crew is waiting at the other end."}],
    related: [{"h": "Machinery Moving", "u": "../services/machinery-moving.html"}, {"h": "Industrial Rigging", "u": "../services/rigging.html"}, {"h": "What Is Industrial Rigging?", "u": "what-is-industrial-rigging.html"}, {"h": "Plant Relocation", "u": "../services/plant-relocation.html"}],
  },
  {
    slug: "how-to-move-a-lathe",
    cat: "Machinery Moving",
    hero: "loads/load-machine-loadout.jpg",
    date: "2026-07-03",
    title: "How to Move a Metal Lathe Without Twisting the Bed",
    desc: "How to move a metal lathe without twisting the bed: weights, rigging points, tailstock and chuck prep, skating, air-ride vs flatbed, and re-leveling to spec.",
    dek: "Long, headstock-heavy, and allergic to twist — a lathe move is won or lost at the rigging points and finished with a machinist level.",
    tldr: "Rig a lathe from the bed casting or factory lift points — never the ways, leadscrew, or feed rod. Pull the chuck, tailstock, and steady rests, lock the carriage at the headstock, skate on three points of support, ship precision machines air-ride, and re-level both ends of the bed to matching readings before the first cut.",
    keywords: "how to move a metal lathe, lathe rigging, engine lathe transport, machinery skates, lathe bed twist, machinery moving, air-ride machinery transport",
    howto: {"name": "How to Move a Metal Lathe", "steps": [{"name": "Document and weigh", "text": "Pull the builder's plate and manual. Record weight, swing, distance between centers, and overall length, and locate the factory lift points. Note that the headstock end carries well over half the weight."}, {"name": "Strip the machine", "text": "Remove the chuck, steady rests, follow rests, and tooling and crate them separately. Remove the tailstock or lock and strap it at the far end. Run the carriage tight to the headstock, lock it, and strap it. Oil and wrap the ways."}, {"name": "Rig from the casting", "text": "Sling the bed casting with hardwood softeners and a spreader bar, or set padded forks under the bed from the tailstock end or the back. Never load the ways, leadscrew, feed rod, or chip pan. Center the lift on the headstock bias."}, {"name": "Skate on three points", "text": "Toe-jack the machine only as high as needed and set two skates under the headstock end and one steerable skate under the tailstock end. Three points cannot rock the bed into a twist. Sweep the route and walk it slow."}, {"name": "Load and secure", "text": "Use an air-ride trailer for toolroom and CNC-grade lathes; a flatbed or step deck with solid blocking works for rough heavy engine lathes. Chain through the base or foot holes, never over the bed. Shrink wrap and tarp against road spray."}, {"name": "Re-level and verify", "text": "At destination, set a precision machinist level across the ways at both ends and adjust the leveling screws until the readings match, removing all twist. Take a light test cut and measure for taper, then recheck the level after the machine settles."}]},
    body: "<p>A lathe is one long precision casting with everything else bolted to it. Every cut the machine will ever make rides on the geometry ground into that bed at the factory. Twist it during a move — wrong lift point, uneven skating, a hard set-down — and the machine turns a taper into every part until somebody re-levels it. Here is how our <a href=\"../services/machinery-moving.html\">machinery moving</a> crews handle them: nothing touches the ways from door to door.</p>\n\n<h2>Know what you are moving</h2>\n<p>\"Metal lathe\" covers a huge range. A 12x36 bench machine weighs a few hundred pounds. A 14x40 engine lathe typically runs 2,000 to 3,000 pounds. A Monarch 10EE toolroom lathe packs over 3,000 pounds into the footprint of a desk, and turret lathes and hollow-spindle oilfield machines run 10,000 to 20,000 pounds and beyond. Pull the builder's plate and manual before anyone touches the machine. Nearly every lathe rides legal — inside 8'6\" wide, 13'6\" tall, and 80,000 pounds gross — so the problem is rarely the truck. It is geometry.</p>\n<p>One number matters more than gross weight: headstock bias. The headstock — spindle, gearbox, motor — puts well over half the weight at one end. The center of gravity is nowhere near the middle of the bed, and every lift, skate, and tie-down decision starts there.</p>\n\n<h2>Rig from the casting, never the ways</h2>\n<p>The ways are the finished surfaces the carriage and tailstock ride on. Nothing bears on them. No slings, no forks, no chains, no boots. Same rule for the leadscrew, feed rod, and control rod running along the front of the bed — a forklift coming in from the operator side will bend all three before the driver feels a thing.</p>\n<ul>\n<li><strong>Slings:</strong> around the bed casting between headstock and carriage and near the tailstock end, with hardwood softeners, run to a spreader bar so they pull vertical instead of pinching the ways.</li>\n<li><strong>Forklift:</strong> padded forks under the bed or base webs from the back or the tailstock end, load centered on the headstock bias — not the middle of the bed.</li>\n<li><strong>Factory points:</strong> many lathes have cast lifting bosses or threaded lift holes. If the manual shows them, use them.</li>\n</ul>\n\n<h2>Strip it before it rolls</h2>\n<p><strong>Chuck:</strong> comes off. A large four-jaw hangs serious weight cantilevered off the spindle nose, and every pothole hammers that leverage into the spindle bearings. On a threaded nose it can also unscrew itself in transit. It rides in its own crate.</p>\n<p><strong>Tailstock:</strong> remove and crate it, or lock it down hard at the far end of the bed and strap it. A loose tailstock is a battering ram on rails.</p>\n<p><strong>Steady rests and follow rests:</strong> off, wrapped, crated. <strong>Carriage:</strong> run it up tight to the headstock, lock it, strap it — rolling mass over the center of gravity, not loose at mid-bed.</p>\n<p>Then coat the ways in way oil or rust preventive and wrap the machine. Bare cast iron flash-rusts in one humid night on the road.</p>\n\n<figure><img src=\"../assets/img/loads/crating-shrink-wrap-electrical-equipment.jpg\" alt=\"Industrial equipment shrink-wrapped and crated for machinery transport\" loading=\"lazy\" width=\"600\" height=\"800\"><figcaption>Everything you strip off the lathe — chuck, tailstock, steady rests — gets wrapped and crated, and rides separately from the machine.</figcaption></figure>\n\n<h2>Skate on three points, not four</h2>\n<p>Machinery skates get the lathe to the door, and this is where beds get twisted. Three points of support cannot rock: two skates under the headstock end, one steerable skate under the tailstock. Four skates on a floor that is not dead flat means the bed spends part of the trip bridging a diagonal — twist, applied under full machine weight. Toe-jack under the casting, lift only as high as the skates need, sweep the route, walk it slow.</p>\n\n<h2>Air-ride van or flatbed</h2>\n<p>A toolroom or CNC-grade lathe wants an air-ride trailer — the suspension soaks up the shock loads a stiff-sprung deck passes straight into the spindle bearings and ways. A rough heavy engine lathe travels fine on a flatbed or step deck with solid blocking, chained through the base or foot holes — never over the bed, never near the leadscrew. Shrink wrap under a tarp keeps road spray off the machined surfaces either way. The same discipline applies to machining centers — see <a href=\"how-to-move-a-cnc-machine.html\">how to move a CNC machine</a>.</p>\n\n<h2>Re-level to spec or the move is not finished</h2>\n<p>Setting the lathe on the new floor is not the end of the job. Put a precision machinist level — typical sensitivity 0.0005 inches per 10 inches per division — across the ways at the headstock end, then the tailstock end, and adjust the leveling screws until both readings match. Matching matters more than absolute level: equal readings mean no twist. Then prove it with metal — a light cut on a test bar, measured for taper. Recheck after a week or two as the machine settles. Full procedure in our <a href=\"machine-leveling-and-alignment.html\">machine leveling and alignment</a> guide, or <a href=\"../contact.html\">get a quote</a> and we bring the level.</p>\n\n<div class=\"takeaways\"><h3>Bottom line</h3><ul>\n<li>Nothing touches the ways, the leadscrew, or the feed rod — rig from the bed casting or the factory lift points.</li>\n<li>Chuck, tailstock, steady rests: off the machine and crated. Carriage locked tight against the headstock.</li>\n<li>The headstock carries well over half the weight — plan every lift, skate, and chain around that bias.</li>\n<li>Three points of support beat four on any floor that is not dead flat.</li>\n<li>The move is done when a machinist level reads the same at both ends of the bed and a test cut runs true.</li>\n</ul></div>",
    faq: [{"q": "Can you move a metal lathe with a forklift?", "a": "Yes, if the forks go under the bed casting or base — padded, approaching from the back or the tailstock end, never from the operator side where the leadscrew and feed rod run. Set the load center on the headstock end, which carries well over half the weight, and never lift against the ways or the chip pan."}, {"q": "Does the chuck have to come off before shipping a lathe?", "a": "Yes. A heavy chuck cantilevered off the spindle nose turns every road shock into a hammer blow on the spindle bearings, and on a threaded spindle nose it can spin itself loose in transit. Pull it, crate it, and ship it alongside the tailstock, steady rests, and tooling."}, {"q": "How do you check a lathe for bed twist after a move?", "a": "Set a precision machinist level across the ways at the headstock end and again at the tailstock end, then adjust the leveling screws until both readings match — equal readings mean the bed carries no twist. Confirm with a light test cut on a bar and measure for taper. Recheck the level after a week or two as the machine settles into the floor."}],
    related: [{"h": "Machinery Moving", "u": "../services/machinery-moving.html"}, {"h": "CNC Machine Movers", "u": "../services/cnc-machine-movers.html"}, {"h": "How to Move a CNC Machine", "u": "how-to-move-a-cnc-machine.html"}, {"h": "Machine Leveling and Alignment", "u": "machine-leveling-and-alignment.html"}],
  },
];

// New guides from the 2026-09 revamp live one-per-file in content/blog-new/.
const NEW_DIR = path.join(ROOT, 'content/blog-new');
if (fs.existsSync(NEW_DIR)) {
  fs.readdirSync(NEW_DIR).filter(f => f.endsWith('.js')).sort()
    .forEach(f => POSTS.push(require(path.join(NEW_DIR, f))));
}

// Safety net: any link still pointing at a retired URL is rewritten to where
// that URL now redirects (data/redirects.json), so posts never link a stub.
const RETIRED = Object.entries(JSON.parse(fs.readFileSync(path.join(ROOT, 'data/redirects.json'), 'utf8')).rules)
  .filter(([from]) => !from.includes('*'));
function remapRetired(html) {
  for (const [from, to] of RETIRED) {
    const slug = from.split('/').pop();
    const dir = from.startsWith('/blog/') ? '' : '../' + from.split('/').slice(1, -1).join('/') + (from.split('/').length > 2 ? '/' : '');
    const variants = from.startsWith('/blog/')
      ? [`href="${slug}.html"`, `href=\"${slug}.html\"`, `href="/blog/${slug}"`]
      : [`href="${dir}${slug}.html"`, `href="${from}"`];
    const target = from.startsWith('/blog/') && to.startsWith('/blog/') ? `${to.split('/').pop()}.html` : `..${to}.html`;
    for (const v of variants) html = html.split(v).join(`href="${target}"`);
  }
  return html;
}

// ---------------------------------------------------------------------------
const cleanUrls = s => s
  .split('badasslogistics.com/index.html').join('badasslogistics.com/')
  .split('="../index.html"').join('="/"')
  .split('="/index.html"').join('="/"')
  .split('="index.html"').join('="/"')
  .split('blog/index.html').join('blog/')
  .split('.html"').join('"')
  .split('.html#').join('#')
  .split('.html</loc>').join('</loc>');

function articleHtml(post) {
  const heroAbs = `${site.domain}/assets/img/${post.hero}`;
  const url = `${site.domain}/blog/${post.slug}.html`;
  const modified = post.updated || post.date;
  const wordCount = post.body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const faqList = post.faq.map(f => `
    <details><summary>${f.q}</summary><div class="a">${f.a}</div></details>`).join('');

  // AEO: answer-first "quick answer" box — the passage answer engines lift
  const tldrHtml = post.tldr ? `
    <div class="tldr" id="quick-answer">
      <span class="tldr-tag hand">// quick answer</span>
      <p>${post.tldr}</p>
    </div>` : '';

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title.replace(/&amp;/g, '&'),
    "description": post.desc,
    "image": [heroAbs],
    "datePublished": post.date,
    "dateModified": modified,
    "wordCount": wordCount,
    "articleSection": post.cat,
    "inLanguage": "en-US",
    "author": { "@type": "Organization", "name": site.brand, "url": site.domain + "/" },
    "publisher": {
      "@type": "Organization",
      "name": site.brand,
      "logo": { "@type": "ImageObject", "url": `${site.domain}/assets/logo.png` }
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", ".tldr", ".lead"] }
  };
  if (post.keywords) articleSchema.keywords = post.keywords;

  // AEO: HowTo schema for step-by-step posts (opt-in via post.howto)
  const howToSchema = post.howto ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": post.howto.name,
    "description": post.howto.desc || post.desc,
    "image": heroAbs,
    ...(post.howto.totalTime ? { "totalTime": post.howto.totalTime } : {}),
    "step": post.howto.steps.map((s, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": s.name,
      "text": s.text,
      "url": `${url}#step-${i + 1}`
    }))
  } : null;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${site.domain}/` },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${site.domain}/blog/index.html` },
      { "@type": "ListItem", "position": 3, "name": post.title.replace(/&amp;/g, '&'), "item": url }
    ]
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faq.map(f => ({
      "@type": "Question", "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${post.title} | Badass Logistics</title>
<meta name="description" content="${post.desc}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#141414">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${post.title}">
<meta property="og:description" content="${post.desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${heroAbs}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${post.title}">
<meta name="twitter:description" content="${post.desc}">
<meta name="twitter:image" content="${heroAbs}">
<link rel="sitemap" type="application/xml" href="${site.domain}/sitemap.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Architects+Daughter&family=Barlow:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Architects+Daughter&family=Barlow:wght@400;500;600;700&display=swap"></noscript>
<link rel="icon" href="../assets/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="../assets/apple-touch-icon.png">
<link rel="preload" as="image" href="../assets/img/${post.hero}" fetchpriority="high">
<link rel="stylesheet" href="../css/styles.css">
${BLOG_CSS}
<script type="application/ld+json">
${JSON.stringify(articleSchema, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify(breadcrumb, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify(faqSchema, null, 2)}
</script>${howToSchema ? `
<script type="application/ld+json">
${JSON.stringify(howToSchema, null, 2)}
</script>` : ''}
</head>
<body>
${NAV}

<div class="wrap breadcrumb"><a href="../index.html">Home</a> / <a href="index.html">Blog</a> / ${post.cat}</div>

<section class="page-hero photo" style="background-image:url('../assets/img/${post.hero}')"><div class="wrap">
  <span class="section-tag hand">// ${post.cat.toLowerCase()}</span>
  <h1>${post.title}</h1>
  <p class="lead">${post.dek}</p>
</div>
  <span class="annot hand tag warn a1">FIELD GUIDE</span>
  <span class="annot hand a4">BY THE CREW ✓</span>
</section>

<section class="notes-bg">
  <span class="bgnote" style="top:6%;right:4%;transform:rotate(-4deg)">REAL LOADS — REAL NUMBERS</span>
  <span class="bgnote" style="top:38%;right:6%;transform:rotate(3deg)">NO FLUFF, JUST SPECS</span>
  <span class="bgnote" style="top:70%;right:4%;transform:rotate(-3deg)">FROM THE DISPATCH DESK</span>
  <div class="wrap">
  <article class="post prose post-body">
    <p class="meta">${post.cat} · By the Badass Logistics crew · ${new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}${post.updated ? ` · Updated ${new Date(post.updated + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}</p>
    ${tldrHtml}
    ${post.body.trim()}
    <div class="faq" style="margin-top:40px;">
      <h2>Frequently asked questions</h2>
      ${faqList}
    </div>
    <div class="related">
      <strong style="display:block;margin-bottom:12px;font-family:'Anton',sans-serif;font-size:20px;">Keep reading</strong>
      ${post.related.map(r => `<a href="${r.u}">${r.h}</a>`).join('\n      ')}
    </div>
  </article>
</div></section>

<div class="cta-band"><div class="wrap" style="padding-top:56px;padding-bottom:56px;text-align:center;">
  <h2>Got something that needs rigging?</h2>
  <p>Tell us what's moving, where it's going, and the deadline. We'll plan the rest.</p>
  <a class="btn dark" href="../contact.html">Get a Free Quote</a>
</div></div>
${chrome.footer('blog/')}

</body>
</html>`;
}

function indexHtml() {
  const cards = POSTS.map(p => `
    <a class="blog-card" href="${p.slug}.html">
      <div class="thumb" style="background-image:url('../assets/img/${p.hero}')"></div>
      <div class="pad">
        <span class="cat">${p.cat}</span>
        <h3>${p.title}</h3>
        <p>${p.dek}</p>
      </div>
    </a>`).join('');

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Badass Logistics Blog",
    "url": `${site.domain}/blog/index.html`,
    "description": "Field guides on industrial rigging, machinery moving, plant relocation, project freight, and fleet dispatch from Badass Logistics.",
    "blogPost": POSTS.map(p => ({
      "@type": "BlogPosting",
      "headline": p.title.replace(/&amp;/g, '&'),
      "url": `${site.domain}/blog/${p.slug}.html`,
      "datePublished": p.date
    }))
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Rigging, Machinery Moving &amp; Project Freight Guides | Badass Logistics Blog</title>
<meta name="description" content="Field guides on industrial rigging, moving CNC and MRI machines, plant relocation, crating, project freight, and fleet truck dispatch — from the Badass Logistics crew.">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#141414">
<link rel="canonical" href="${site.domain}/blog/index.html">
<meta property="og:type" content="website">
<meta property="og:title" content="Badass Logistics Blog — Rigging, Machinery Moving &amp; Project Freight Guides">
<meta property="og:description" content="Field guides on industrial rigging, machinery moving, plant relocation, project freight, and fleet dispatch.">
<meta property="og:url" content="${site.domain}/blog/index.html">
<meta property="og:image" content="${OG}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${OG}">
<link rel="sitemap" type="application/xml" href="${site.domain}/sitemap.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Architects+Daughter&family=Barlow:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Architects+Daughter&family=Barlow:wght@400;500;600;700&display=swap"></noscript>
<link rel="icon" href="../assets/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="../assets/apple-touch-icon.png">
<link rel="stylesheet" href="../css/styles.css">
${BLOG_CSS}
<script type="application/ld+json">
${JSON.stringify(blogSchema, null, 2)}
</script>
</head>
<body>
${NAV}

<div class="wrap breadcrumb"><a href="../index.html">Home</a> / Blog</div>

<section class="page-hero notes-bg">
  <span class="bgnote" style="top:24%;right:5%;transform:rotate(-4deg)">MEASURED &amp; MOVED</span>
  <span class="bgnote" style="bottom:16%;right:9%;transform:rotate(3deg)">FIELD NOTES ✓</span>
  <div class="wrap">
  <span class="section-tag hand">// field notes</span>
  <h1>The <span class="y">Badass</span> Blog</h1>
  <p class="lead">No fluff — straight answers on rigging, moving machines, plant relocation, crating, project freight, and fleet dispatch from the crew that does this for a living.</p>
</div></section>

<section><div class="wrap">
  <div class="blog-grid">${cards}
  </div>
</div></section>

<div class="cta-band"><div class="wrap" style="padding-top:56px;padding-bottom:56px;text-align:center;">
  <h2>Got something that needs rigging?</h2>
  <p>Tell us what's moving, where it's going, and the deadline. We'll plan the rest.</p>
  <a class="btn dark" href="../contact.html">Get a Free Quote</a>
</div></div>
${chrome.footer('blog/')}

</body>
</html>`;
}

// ---- write everything ----
const outDir = path.join(ROOT, 'blog');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
POSTS.forEach(p => fs.writeFileSync(path.join(outDir, `${p.slug}.html`), cleanUrls(remapRetired(articleHtml(p)))));
fs.writeFileSync(path.join(outDir, 'index.html'), cleanUrls(indexHtml()));

console.log(`✓ Built ${POSTS.length} blog articles + index in /blog`);
POSTS.forEach(p => console.log(`   - blog/${p.slug}.html`));
