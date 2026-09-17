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
    desc: 'Dispatchers and brokers are not the same thing. Who each one works for, what they legally can and cannot do, and which one an owner-operator actually needs.',
    dek: 'They both touch loads and rates — but a dispatcher works for you, the carrier. A broker is the middleman. That difference is the whole point.',
    body: `
<p>Owner-operators get pitched by both "dispatchers" and "brokers," and the terms get blurred constantly. They are not the same role, and the difference is not just semantics — it changes who is on your side, who is legally responsible for what, and how you get paid.</p>

<h2>The short version</h2>
<div class="keyfacts">
  <h3>The core difference</h3>
  <p>A <strong>truck dispatcher</strong> works <em>for the carrier</em> — they are your agent, finding and booking loads on your behalf. A <strong>freight broker</strong> is the <em>middleman between the shipper and the carrier</em>, arranging transportation as an independent party. One works for you; the other sits between you and the freight.</p>
</div>

<h2>What a freight broker is</h2>
<p>A freight broker connects shippers who have freight with carriers who have trucks. Brokers operate under <strong>FMCSA broker authority</strong> (an MC number) and are required to carry a <strong>$75,000 surety bond (BMC-84)</strong>. They contract with the shipper, mark up the freight, and pay the carrier — and the spread between those two numbers is their margin. A good broker brings volume and handles the shipper relationship; the tradeoff is that they sit between you and the rate.</p>

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
<p>If you are an owner-operator or small fleet and you want someone <strong>on your side of the table</strong> — keeping your wheels turning, fighting for your rate, and taking the admin off your plate — that is dispatching. If you are a shipper trying to move freight and you want someone to find capacity, that is a broker.</p>

<h2>How we dispatch</h2>
<p>A truck dispatcher works <em>for the carrier</em> — you are the client, not the freight. A dispatching service sources loads, negotiates the rate up, and handles the paperwork, 24/7, so the driver can focus on driving.</p>

<p><a href="../contact.html">Talk to us about dispatch</a> and we'll keep your trucks loaded and rolling.</p>
`,
    faq: [
      { q: 'Is a truck dispatcher the same as a freight broker?', a: 'No. A dispatcher works for the carrier as their agent — finding loads and negotiating rates on the carrier\'s behalf. A broker is an independent middleman between shipper and carrier, operating under FMCSA broker authority and a $75,000 bond.' },
      { q: 'Does a truck dispatcher need an MC number or broker authority?', a: 'A dispatcher acting solely as the carrier\'s agent generally does not need its own broker authority, because it represents one carrier rather than brokering freight to third parties.' },
      { q: 'Do dispatchers get you better rates?', a: 'A good dispatcher negotiates on your behalf to push the rate up and reduce deadhead, and charges you a flat fee or percentage — versus a broker, whose margin comes from the spread between the shipper\'s rate and yours.' },
    ],
    related: [
      { h: 'About Badass Logistics', u: '../about.html' },
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
<p>Drayage is the short-haul truck move that picks up your shipping container from a port terminal or rail ramp and delivers it to your warehouse — usually within about 50 miles. A credentialed driver with a TWIC card and a terminal appointment picks the box up on a chassis inside the port's free-time window, then either live-unloads at your dock or drops the container for a later pickup. The critical variable is not the truck rate; it is whether the box moves before free time expires. Miss that window and demurrage charges from the terminal and per-diem charges from the ocean carrier start stacking daily — typically $75 to several hundred dollars per container, per day. Step by step, it looks like this:</p>
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
  These run from roughly $75 to several hundred dollars per container per day — and they compound fast over a weekend.</p>
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
    slug: 'how-to-ship-industrial-machinery-on-a-flatbed',
    cat: 'Project Freight',
    hero: 'loads/heavy-haul-industrial-enclosures-flatbed.jpg',
    date: '2026-06-27',
    title: 'How to Ship Large Industrial Machinery on a Flatbed',
    desc: 'Shipping oversized industrial equipment on a flatbed comes down to five things: the right trailer, a real load plan, blocking and bracing, secure tie-downs, and permits. Here is how a heavy, awkward machine gets from plant to plant intact.',
    dek: 'Big, heavy, awkward — and it still has to ride legal and arrive undamaged. Here is how oversized machinery moves on a flatbed, step by step.',
    tldr: 'To ship large industrial machinery on a flatbed: pick a trailer that keeps the load under 13\'6" tall (flatbed, step deck, or RGN), center the weight over the axles, block and brace against movement in every direction, strap or chain to the load\'s rated points, tarp against weather, and permit any dimension over legal limits before the wheels turn.',
    keywords: 'ship industrial machinery, flatbed shipping, heavy equipment transport, oversized machinery, load securement, machinery moving',
    howto: {
      name: 'How to Ship Large Industrial Machinery on a Flatbed',
      totalTime: 'P2D',
      steps: [
        { name: 'Spec the trailer', text: 'Choose a flatbed, step deck, or RGN based on the load height and weight so the shipment stays within the 13\'6" legal height and axle limits.' },
        { name: 'Build the load plan', text: 'Position the machine so its weight sits over the trailer axles with a low, centered center of gravity before loading.' },
        { name: 'Block and brace', text: 'Stop movement in every direction with hardwood dunnage, chocks, cleats, and cradles before applying any tie-down.' },
        { name: 'Secure to rated points', text: 'Strap or chain the load to its engineered lash points or skid, with total tie-down capacity of at least half the cargo weight, using edge protectors.' },
        { name: 'Tarp and mark', text: 'Tarp or shrink-wrap weather-sensitive equipment and add OVERSIZE LOAD banners, flags, and lights if any dimension exceeds legal limits.' },
        { name: 'Permit and route', text: 'Pull oversize and overweight permits for every state on the route, survey for clearances, and book pilot cars where required.' },
      ],
    },
    body: `
<p>A CNC machine, a dust collector the size of a truck, a transformer, a fabricated skid — sooner or later it has to leave the plant on a truck. Flatbed shipping is how most oversized industrial equipment moves, and the difference between a clean delivery and a wrecked machine is all in the prep. Here is exactly how our crews put a big, heavy, awkward load on a deck and get it there legal and intact.</p>

<figure>
  <img src="../assets/img/loads/flatbed-industrial-dust-collectors-strapped.jpg" alt="Row of industrial dust-collector housings crated on wooden skids and strapped down across a gooseneck flatbed trailer" loading="lazy" width="1131" height="848">
  <figcaption>Five industrial units, crated on skids, blocked and strapped as one stable load — a real Badass Logistics flatbed haul.</figcaption>
</figure>

<h2>1. Spec the right trailer</h2>
<p>Trailer choice comes down to two numbers: <strong>height</strong> and <strong>weight</strong>. A standard flatbed sits about five feet off the ground, so anything much over 8'6" tall on a flatbed blows past the 13'6" legal height. Drop to a <strong>step deck</strong> and you gain roughly a foot of legal height; drop to an <strong>RGN (double-drop)</strong> and you gain several feet in the well for the tallest machines. Heavier than a standard axle setup can legally carry? Now you are into multi-axle RGNs and weight permits. The deck gets matched to the load — our <a href="../trailer-selector.html">trailer selector</a> walks through the options.</p>

<h2>2. Build the load plan before anything moves</h2>
<p>Where the machine sits on the deck is not eyeballed. The weight has to sit <strong>over the trailer axles</strong> to stay within axle limits, with the center of gravity low and centered so the rig tracks straight. For an off-center or top-heavy machine, that plan also decides where the blocking goes and which tie-down points carry the load. Get it wrong and you either overload an axle or watch the load shift on the first hard brake.</p>

<h2>3. Block, brace, and cradle</h2>
<p>Securement starts with stopping movement in every direction before a single strap goes on. That means <strong>hardwood dunnage</strong> under and around the load, chocks and cleats nailed to the deck, and cradles for anything round or tippy. Crated machinery rides on its skid; uncrated machinery gets bearing points that match its frame — never its sheet metal.</p>

<figure>
  <img src="../assets/img/loads/flatbed-load-securement-yellow-straps.jpg" alt="Yellow ratchet straps, edge protectors, and wood dunnage securing crated industrial equipment to a flatbed deck" loading="lazy" width="1131" height="848">
  <figcaption>Straps to the rated points, edge protection on every corner, dunnage carrying the weight — securement you can see.</figcaption>
</figure>

<h2>4. Strap or chain to rated points</h2>
<p>Federal cargo-securement rules set the floor: total tie-down capacity has to be at least <strong>half the cargo weight</strong>, and heavy machinery needs tie-downs rated for the job. <strong>Straps</strong> handle crated and lighter loads; <strong>chains and binders</strong> handle heavy iron and anything that has to be pinned hard to the deck. Tie to the machine's <strong>engineered lift and lash points</strong> or its skid — never over a control panel, a casting, or thin sheet metal. Edge protectors keep straps from cutting on sharp corners.</p>

<h2>5. Tarp and mark it</h2>
<p>Weather-sensitive equipment gets <strong>tarped or shrink-wrapped</strong> — electronics, machined surfaces, and painted housings do not travel naked through road spray and grit. If any dimension crosses a legal limit, the load also gets <strong>OVERSIZE LOAD banners, flags, and lights</strong>, with the exact marker requirements riding on the permit.</p>

<figure>
  <img src="../assets/img/loads/gooseneck-flatbed-industrial-tanks.jpg" alt="Industrial enclosures loaded on a gooseneck flatbed trailer, deck height chosen to keep a tall load within legal limits" loading="lazy" width="1024" height="576">
  <figcaption>Deck choice is a legal decision: the right trailer keeps a tall load under the 13'6" line without a height permit.</figcaption>
</figure>

<h2>6. Permit the load and survey the route</h2>
<p>Anything over 8'6" wide, 13'6" tall, about 53' long, or 80,000 lbs gross needs a permit in <strong>every state it passes through</strong>, and wide or tall loads may need pilot cars. The route gets surveyed for low bridges, weight-restricted roads, and tight turns before dispatch — the shortest line on the map is not always the legal one. Permits and escorts are the carrier's job on the road, but on a project they belong in the schedule from day one, because permits are lead time.</p>

<div class="takeaways">
  <h3>Bottom line</h3>
  <ul>
    <li>Trailer is chosen by height and weight — flatbed, step deck, or RGN.</li>
    <li>Weight rides over the axles; the load plan comes before the load.</li>
    <li>Block and brace first, then strap or chain to rated points.</li>
    <li>Tarp the sensitive stuff; permit and survey anything oversized.</li>
  </ul>
</div>

<p>Have a machine that needs to move? This is exactly what our <a href="../services/machinery-moving.html">machinery moving</a> and <a href="../services/project-freight.html">project freight</a> teams plan every week. <a href="../contact.html">Send the dimensions, weight, and a photo</a> and we will spec the trailer and quote the lane.</p>
`,
    faq: [
      { q: 'What trailer is used to ship heavy industrial machinery?', a: 'It depends on height and weight. A standard flatbed works for loads under about 8\'6" tall; a step deck adds roughly a foot of legal height; an RGN (double-drop) carries the tallest and heaviest machines in its low well. Weight beyond standard limits moves on multi-axle RGNs with overweight permits.' },
      { q: 'How is a machine secured on a flatbed?', a: 'It is blocked and braced with dunnage, chocks, and cradles to stop movement, then strapped or chained to its rated lash points or skid. Federal rules require total tie-down capacity of at least half the cargo weight, plus edge protection and, for heavy iron, chains and binders.' },
      { q: 'Do I need a permit to ship a large machine?', a: 'Only if it crosses a legal limit — over 8\'6" wide, 13\'6" tall, about 53\' long, or 80,000 lbs gross. Then it needs an oversize and/or overweight permit for every state on the route, and wide or tall loads may require pilot cars. Those permits and escorts are planned into the project schedule before the truck is booked.' },
    ],
    related: [
      { h: 'Machinery Moving', u: '../services/machinery-moving.html' },
      { h: 'Project Freight', u: '../services/project-freight.html' },
      { h: 'Trailer Selector Tool', u: '../trailer-selector.html' },
      { h: 'Industrial Crating &amp; Packing', u: '../services/crating-packing.html' },
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
<p>A load that shifts is how equipment gets damaged, how trailers get unbalanced, and how cargo ends up on the shoulder. Good blocking and bracing is invisible when it works and obvious when it does not. It is also the difference between a machine that arrives ready to install and one that arrives with a cracked casting. This is standard on every <a href="how-to-ship-industrial-machinery-on-a-flatbed.html">machinery haul</a> and <a href="what-is-industrial-rigging.html">rigging</a> job we run.</p>

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
      { h: 'How to Ship Industrial Machinery', u: 'how-to-ship-industrial-machinery-on-a-flatbed.html' },
      { h: 'What Is Industrial Rigging?', u: 'what-is-industrial-rigging.html' },
      { h: 'Industrial Crating &amp; Packing', u: '../services/crating-packing.html' },
      { h: 'Get a Quote', u: '../contact.html' },
    ],
  },

  {
    slug: 'enclosed-vs-flatbed-transport',
    cat: 'Trailers & Equipment',
    hero: 'loads/step-deck-industrial-air-handlers.jpg',
    date: '2026-06-26',
    title: 'Enclosed vs Flatbed Transport: Which One Does Your Equipment Need?',
    desc: 'Flatbed is faster to load and handles oversized freight; enclosed protects sensitive equipment from weather, road grit, and eyes. The right call depends on size, fragility, and value. Here is how to choose.',
    dek: 'Weather and security, or size and access? The honest trade-offs between enclosed and flatbed for machinery and freight.',
    tldr: 'Choose flatbed when the load is large, heavy, or oversized and can handle the weather — it loads from any side and carries dimensions no box can. Choose enclosed (dry van, box truck, or air-ride) when the equipment is sensitive, high-value, or must stay clean and out of sight. Size and access push you to flatbed; fragility, value, and weather push you to enclosed.',
    keywords: 'enclosed vs flatbed, dry van vs flatbed, machinery transport, air ride transport, equipment shipping options',
    body: `
<p>Two loads, two very different answers. One is a 40-foot fabricated skid that will never fit in a box; the other is a rack of electronics that cannot get rained on. "Enclosed or flatbed?" is one of the first questions we ask, because the trailer decides how your equipment travels, what it costs, and whether it arrives clean. Here is how to choose.</p>

<figure>
  <img src="../assets/img/loads/step-deck-industrial-air-handlers.jpg" alt="Large industrial air-handling units strapped on a step-deck flatbed trailer staged in a gravel yard" loading="lazy" width="1131" height="848">
  <figcaption>Some loads only go one way: oversized industrial units on a step deck, open and accessible from every side.</figcaption>
</figure>

<h2>When flatbed wins</h2>
<p>Flatbed — and its cousins step deck and RGN — is the answer when <strong>size and access</strong> drive the move:</p>
<ul>
  <li><strong>Oversized or over-height loads</strong> that no box could ever enclose.</li>
  <li><strong>Heavy machinery</strong> that has to be craned or forklifted on from the side or top.</li>
  <li><strong>Long, wide, or awkward</strong> freight — structural steel, tanks, fabricated skids.</li>
  <li><strong>Fast loading</strong> from any angle, which matters on tight dock schedules.</li>
</ul>
<p>The trade-off: the load is exposed to weather and road grit unless it is tarped, and it is out in the open for anyone to see.</p>

<h2>When enclosed wins</h2>
<p>Enclosed transport — dry van, box truck, or air-ride — is the answer when <strong>protection and discretion</strong> matter:</p>
<ul>
  <li><strong>Sensitive equipment</strong> — electronics, medical imaging, precision machinery — that cannot take weather or shock.</li>
  <li><strong>High-value or proprietary</strong> freight you would rather not advertise on the highway.</li>
  <li><strong>Clean-required</strong> loads that must arrive free of dust, spray, and grime.</li>
  <li><strong>Air-ride</strong> when vibration is the enemy, as it is with <a href="how-to-transport-a-ct-scanner.html">imaging equipment</a>.</li>
</ul>
<p>The trade-off: you are limited to what fits through the doors and inside the box, and loading is usually from the rear only.</p>

<figure>
  <img src="../assets/img/loads/enclosed-trailer-machinery-loaded.jpg" alt="Machinery and shrink-wrapped equipment loaded and braced inside an enclosed trailer, protected from weather and view" loading="lazy" width="640" height="480">
  <figcaption>The other answer: sensitive equipment braced inside an enclosed trailer, out of the weather and out of sight.</figcaption>
</figure>

<h2>Enclosed vs flatbed at a glance</h2>
<div class="keyfacts">
  <h3>Quick comparison</h3>
  <p><strong>Pick flatbed for:</strong> oversized, heavy, long, or awkward loads · top and side loading · crane and forklift access · anything that will not fit in a box.<br>
  <strong>Pick enclosed for:</strong> weather-sensitive, high-value, or fragile equipment · air-ride for vibration-sensitive gear · security and discretion · clean delivery.</p>
</div>

<h2>Still not sure?</h2>
<p>The deciding questions are simple: <strong>Does it fit in a box? Can it get wet? How fragile and how valuable is it?</strong> If it is too big for a van, flatbed it and tarp what needs covering. If it fits and it is delicate, enclose it — air-ride if vibration is a risk. When a load sits on the line, we will tell you which way we would send it and why. Compare the deck options with our <a href="../trailer-selector.html">trailer selector</a>.</p>

<div class="takeaways">
  <h3>Decide in one line</h3>
  <ul>
    <li>Too big for a box or needs crane/side access → flatbed.</li>
    <li>Fragile, high-value, or must stay clean and unseen → enclosed.</li>
    <li>Vibration-sensitive → enclosed on air-ride.</li>
    <li>Exposed on a flatbed? Tarp it. Oversized? Permit it.</li>
  </ul>
</div>

<p>Tell us the load and we will match the trailer. <a href="../contact.html">Send dimensions, weight, and how fragile it is</a> for a straight recommendation and a quote.</p>
`,
    faq: [
      { q: 'Is flatbed or enclosed transport better for machinery?', a: 'It depends on the machine. Oversized or crane-loaded machinery goes on a flatbed, step deck, or RGN because it will not fit in a box and needs top or side access. Sensitive, high-value, or weather-vulnerable machinery goes enclosed, often on air-ride to control vibration.' },
      { q: 'Does flatbed freight get protected from weather?', a: 'Yes, when needed. Weather-sensitive flatbed loads are tarped or shrink-wrapped to keep off rain, spray, and grit. But if a load must stay perfectly clean, dry, or out of sight, enclosed transport is the safer choice.' },
      { q: 'What is air-ride transport?', a: 'Air-ride is an enclosed trailer with air suspension that cushions the load against road shock and vibration. It is the standard for medical imaging, electronics, and precision machinery, where vibration — not just impact — can cause damage.' },
    ],
    related: [
      { h: 'Project Freight', u: '../services/project-freight.html' },
      { h: 'Trailer Selector Tool', u: '../trailer-selector.html' },
      { h: 'Machinery Moving', u: '../services/machinery-moving.html' },
      { h: 'White-Glove Freight & Crating', u: 'white-glove-freight-and-custom-crating.html' },
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
  <li><strong>Weight and size.</strong> Heavier, larger machines need bigger rigging gear, more crew, and sometimes a crane instead of skates. Weight also decides the trailer and whether the load needs permits.</li>
  <li><strong>Rigging at both ends.</strong> This is the big one. Tight doorways, stairs, mezzanines, low ceilings, soft or weight-limited floors, and a long push from the machine pad to the truck all add labor and equipment. An easy dock-to-dock move and a machine buried three corners deep in an old building are worlds apart.</li>
  <li><strong>Distance and transport type.</strong> Loaded miles matter, and so does how it rides — a precision machine on an <a href="enclosed-vs-flatbed-transport.html">air-ride enclosed trailer</a> is a different cost than an open flatbed.</li>
  <li><strong>Disconnection and prep.</strong> Draining coolant and hydraulics, retracting axes, protecting the control, and setting shipping brackets per the manual. Some shops do this themselves; some want it handled.</li>
  <li><strong>Crating and protection.</strong> Oversized or delicate machines may need <a href="white-glove-freight-and-custom-crating.html">custom crating</a>, shrink-wrap, and shock protection.</li>
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
    title: 'Plant Relocation: The Checklist for Moving an Entire Facility',
    desc: 'Moving a plant is not one big move — it is dozens of coordinated moves in the right order, with the least downtime. Here is the checklist: survey and tag, sequence by production priority, disconnect, rig, transport, and recommission.',
    dek: 'Moving a whole facility is a sequencing problem, not a muscle problem. The checklist for relocating a plant with the least downtime.',
    tldr: 'A plant relocation is planned backward from production: survey and tag every asset, sequence the move so the last machine out is the first back online, then disconnect, rig, transport on the right trailers, and recommission in order. Downtime — not distance — is the real cost, so the plan protects the production schedule first.',
    keywords: 'plant relocation, factory move, facility relocation, machinery moving, industrial move, production line move',
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
<p>Relocating a plant is not one heroic heavy lift — it is <strong>dozens of moves in the right order</strong>, run so the business loses as little production as possible. The machines are the easy part. The hard part is sequencing: what comes down first, what ships when, and what has to be running again by Monday. Here is the checklist we work from.</p>

<figure>
  <img src="../assets/img/loads/gooseneck-flatbed-industrial-tanks.jpg" alt="Industrial process equipment loaded on a gooseneck flatbed during a plant relocation" loading="lazy" width="1024" height="576">
  <figcaption>One asset of many — plant relocation is this, repeated in a planned sequence across a whole facility.</figcaption>
</figure>

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
<p>Each machine is rigged out along its surveyed path and loaded on the <strong>right trailer for its size and sensitivity</strong> — flatbed and RGN for the heavy iron, <a href="enclosed-vs-flatbed-transport.html">enclosed air-ride</a> for anything precision or delicate. Loads run as <a href="../services/project-freight.html">project freight</a> — often on <a href="../services/dedicated-lanes.html">dedicated lanes</a> for the length of the move. The convoy is sequenced so machines arrive in install order, not in a pile.</p>

<h2>5. Set, level, and recommission</h2>
<p>At the new site, machines are rigged into place, set on their pads, and <strong>leveled to spec</strong>, then reconnected to utilities and recommissioned in production order. The goal the whole way through: the line comes back up on schedule, not "eventually."</p>

<div class="takeaways">
  <h3>The checklist, condensed</h3>
  <ul>
    <li>Survey, weigh, and tag every asset; map it to the new floor plan.</li>
    <li>Sequence backward from production — last out is first back online.</li>
    <li>Disconnect and label so reconnection is not guesswork.</li>
    <li>Match each machine to the right trailer; sequence the freight in install order.</li>
    <li>Set, level to spec, reconnect, and recommission in order.</li>
  </ul>
</div>

<p>Planning a move? Our <a href="../services/plant-relocation.html">plant relocation</a> and <a href="../services/machinery-moving.html">machinery moving</a> crews handle the survey, the sequence, the <a href="../services/rigging.html">rigging</a>, and the transport as one project. <a href="../contact.html">Send us your asset list and both floor plans</a> and we will build the move plan.</p>
`,
    faq: [
      { q: 'How do you minimize downtime in a plant relocation?', a: 'By sequencing the move backward from production. The equipment that must run first at the new site is planned to arrive and be set first — which usually means it is the last thing shut down at the old site — while non-critical items move first. Careful labeling and a staged convoy keep reconnection fast.' },
      { q: 'How long does it take to relocate a plant?', a: 'It depends on the number and size of machines, the complexity of disconnection and reinstallation, and how much downtime the business can absorb. A tightly sequenced move can shrink the production gap significantly; the survey and asset list are what let us give a realistic schedule.' },
      { q: 'Who disconnects and reconnects the machines?', a: 'The technical disconnection and reconnection are typically handled by the plant\'s maintenance team or the equipment OEM, while our crews handle rigging, loading, transport, and setting machines on their new pads. We coordinate the sequence so both sides line up.' },
    ],
    related: [
      { h: 'Plant Relocation', u: '../services/plant-relocation.html' },
      { h: 'Machinery Moving', u: '../services/machinery-moving.html' },
      { h: 'Industrial Rigging', u: '../services/rigging.html' },
      { h: 'Get a Quote', u: '../contact.html' },
    ],
  },
  {
    slug: "how-to-move-a-press-brake",
    cat: "Machinery Moving",
    hero: "loads/step-deck-industrial-air-handlers.jpg",
    date: "2026-07-02",
    title: "How to Move a Press Brake Without Wrecking It",
    desc: "Press brakes are top-heavy machines that tip before they warn you. Ram locking, rigging points, skates, trailer choice, and securement — from the dispatch desk.",
    dek: "A press brake doesn't fall over slowly. Here's the full playbook for moving a top-heavy machine — from locking the ram to the first test bend at the new address.",
    tldr: "Press brakes carry most of their weight in the top third of the frame, so tipping is the main risk in any move. Lock and block the ram, pull the tooling, rig only from the engineered frame points, skate slowly on rated equipment, and measure loaded height before booking a trailer — a step deck or RGN often keeps a tall brake legal. The move isn't finished until the machine is re-leveled and test bends run clean.",
    keywords: ["how to move a press brake", "press brake rigging", "machinery moving", "press brake transport", "machine skates", "step deck trailer", "press brake leveling"],
    howto: {"name": "How to Move a Press Brake Without Tipping It", "steps": [{"name": "Verify weight and center of gravity", "text": "Pull the manufacturer's rigging print or manual. Nameplate weight rarely includes added tooling, backgauge upgrades, or sheet followers. If no CoG data exists, treat the machine as top-heavy by default and rig accordingly."}, {"name": "Lock and block the ram", "text": "Lower the ram onto hardwood blocking or to the manufacturer's shipping position, engage mechanical safety locks if fitted, and strap the ram to the frame so it cannot drift. Remove all punches and dies and crate them separately."}, {"name": "Rig from engineered frame points", "text": "Lift only from the machined holes or lifting eyes in the side frames, using rated shackles and slings, with a spreader bar where geometry requires vertical pulls. Never fork under the bed unless the manufacturer shows rated fork pockets."}, {"name": "Skate it slowly", "text": "Raise the machine an inch at a time with toe jacks, cribbing as you go. Use skates rated well above machine weight, keep the load centered, lay steel plate over joints and soft floor, and never side-load the machine to steer it."}, {"name": "Load low and chain it down", "text": "Measure true loaded height first. If the machine goes over 13'6\" on a flatbed, spec a step deck or RGN. Chain directly to the frame lift points over hardwood dunnage, keeping every chain off the ram and cylinders."}, {"name": "Set, level, and test", "text": "Level the bed along and across with a machinist level to spec, shim and anchor per the manual, re-check after settling, verify ram parallelism and crowning, and run test bends across the full bed before production."}]},
    body: "<p>A press brake is one of the worst machines in a fab shop to move casually. The footprint is narrow front to back, the frame is tall, and most of the mass — ram, hydraulic cylinders, crown, drive — sits in the top third of the machine. That geometry means a press brake doesn't slide or drop when a move goes wrong. It tips. And a tipping press brake gives you almost no warning and no chance to stop it.</p><p>Here's how we plan these moves from the dispatch desk, and what we tell shops before the riggers show up.</p><h2>Start with real weight and a real center of gravity</h2><p>Press brakes run from a few thousand pounds for a small machine to well north of 100,000 pounds for big tandem hydraulics. The nameplate is a starting point, not an answer — it usually reflects the machine as it left the factory, before tooling racks, sheet followers, upgraded backgauges, and light curtains were bolted on.</p><p>The center of gravity matters more than the number. On most hydraulic brakes it sits well above mid-height because the cylinders, crown, and ram all live at the top. Get the manufacturer's rigging print if it exists; it shows lift points and CoG. If it doesn't, your rigger should treat the machine as top-heavy by default.</p><h2>Lock the ram or don't move it</h2><p>An unlocked hydraulic ram drifts once pressure bleeds off, and a ram that shifts in transit changes the machine's balance while it's chained to a moving trailer. Before the machine leaves its anchors:</p><ul><li><strong>Lower the ram</strong> onto hardwood blocking on the bed, or to the manufacturer's specified shipping position.</li><li><strong>Engage mechanical safety locks</strong> where fitted, and strap the ram to the frame so it cannot creep.</li><li><strong>Pull the tooling.</strong> Punches and dies ship separately, boxed and labeled. Never transport a brake with tooling in the clamps.</li><li><strong>Secure or remove the backgauge</strong>, disconnect and cap lines per the manual, and strap down the control pendant.</li></ul><h2>Rig the frame, not the bed</h2><p>Most press brakes have engineered lifting points — machined holes through the side frames or lifting eyes on the housings. Those are the only places a crane or gantry should pick from: rated shackles in the frame holes, slings sized for the actual load, and a spreader bar when the geometry needs it, so the slings pull vertical instead of crushing inward against the cylinders.</p><p>Forks under the bed are how brakes get tipped and beds get sprung. Unless the manufacturer specifically shows fork pockets with a rated capacity, keep forklifts on the tooling crates and nothing else.</p><h2>Skating: slow is the whole technique</h2><p>Inside the building, machinery skates are usually the right call, and the rules that keep a top-heavy machine upright on them are boring and absolute. Toe jacks lift an inch at a time with cribbing following the load up. Skates are rated comfortably above machine weight and placed so the load is centered. Steel plate goes over expansion joints, trench covers, and any floor you don't trust. Push slow, pull straight, and never side-load the machine to steer it. Every degree of dock slope or ramp is tilt added to a machine already living near its tipping point.</p><h2>Trailer choice is a height problem first</h2><p>The legal envelope on most US routes is roughly 8'6\" wide, 13'6\" tall, and 80,000 pounds gross. Height is what usually bites on a press brake. A standard flatbed deck sits around five feet off the pavement, so a machine much over eight and a half feet tall goes over-height the moment it's loaded. A step deck buys back roughly a foot and a half of that; an RGN, with its well down near two feet, can keep even a tall brake inside the legal envelope.</p><p>Nail down true loaded height before the truck is booked, because it drives everything downstream: whether permits are needed, which states want escorts, and whether the route has to be checked for low structures. Those are the real cost drivers on a press brake move — dimensions, not miles.</p><figure><img src=\"../assets/img/loads/blocking-bracing-dunnage-box-truck.jpg\" alt=\"Hardwood blocking, bracing, and dunnage supporting heavy cargo on a trailer deck\" loading=\"lazy\" width=\"640\" height=\"480\"><figcaption>Hardwood dunnage under the frame spreads a press brake's weight across the deck and gives the chains something to pull the machine down onto.</figcaption></figure><h2>Securement: chains, dunnage, and nothing on the ram</h2><p>Heavy machinery rides on chains and binders, not straps, tied directly to the same frame holes used for rigging. Federal securement rules generally require the combined working load limit of the tiedowns to reach at least half the cargo weight — on a top-heavy machine, competent carriers go past that minimum. Hardwood dunnage under the frame spreads the load across the deck. Keep every chain off the ram, the cylinders, and any machined surface, and protect the bed and ram faces from road weather — a corroded bed face is a rework bill waiting at the destination.</p><h2>The move isn't done until it's re-leveled</h2><p>A press brake bends accurately because its bed is flat, level, and untwisted. Transport, skating, and a new slab all change that. On the other end: set the machine, level along and across the bed with a machinist level to the manufacturer's spec, shim, anchor if the manual calls for it, then let it settle and re-check. Verify ram parallelism and crowning, then run test bends across the full bed length before production parts. If test parts show angle variation end to end, the machine is twisted — and the fix is leveling, not the controller.</p><div class=\"takeaways\"><h3>Bottom line</h3><ul><li>Press brakes are top-heavy by design; tipping, not dropping, is the failure mode to plan against.</li><li>Lock and block the ram, pull the tooling, and rig only from the engineered frame points.</li><li>Loaded height decides the trailer — step decks and RGNs exist for exactly this machine.</li><li>Chain to the frame over hardwood dunnage; nothing bears on the ram, cylinders, or machined surfaces.</li><li>The move ends at the first good test bend, not at delivery — budget time for leveling and calibration.</li></ul></div>",
    faq: [{"q": "Can you move a press brake with a forklift?", "a": "Only if the manufacturer documents rated fork pockets and the truck has the capacity at that load center — and most press brakes have neither. Forking under the bed of a top-heavy machine is a common cause of tipped brakes and sprung beds. The standard methods are machinery skates with toe jacks, or a crane or gantry picking from the engineered frame holes."}, {"q": "Does a press brake move need oversize permits?", "a": "It depends on the loaded dimensions, not the machine alone. The general legal envelope is 8'6\" wide, 13'6\" tall, and 80,000 pounds gross, and height is the usual trigger: a tall brake on a standard flatbed can go over-height even though the same machine rides legal on a step deck or RGN. Measuring true height before booking the trailer is what keeps permits, escorts, and route restrictions to a minimum."}, {"q": "Why does a press brake have to be re-leveled after a move?", "a": "Bend accuracy depends on a flat, untwisted bed. Transport stress and a new floor both introduce twist, which shows up as angle variation from one end of a part to the other. After setting the machine, it should be leveled to the manufacturer's spec with a machinist level, allowed to settle, re-checked, and verified with test bends across the full bed length before production runs."}],
    related: [{"h": "Machinery Moving", "u": "../services/machinery-moving.html"}, {"h": "Industrial Rigging", "u": "../services/rigging.html"}, {"h": "How to Move a CNC Machine", "u": "how-to-move-a-cnc-machine.html"}, {"h": "Blocking, Bracing & Dunnage", "u": "blocking-bracing-and-dunnage-explained.html"}],
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
    howto: {"name": "Prepare a Machine for Shipping in 6 Steps", "steps": [{"name": "Confirm weight and dimensions", "text": "Pull the weight from the data plate or the manufacturer's spec sheet and measure the machine as it will ship, including the skid and anything still bolted on. These numbers decide the trailer, the rigging plan, and whether permits are needed."}, {"name": "Drain coolant and loose fluids", "text": "Pump the coolant sump dry, empty the chip conveyor tray, and remove chips. Follow the manual on hydraulic and lube reservoirs — some drain, some ship sealed. Dispose of used coolant per local regulations."}, {"name": "Home, retract, and lock every axis", "text": "Send each axis to the transport position the manual specifies, then lock it mechanically with the factory axis locks or solid wood blocking so nothing drifts under road vibration."}, {"name": "Remove or secure loose items", "text": "Empty the tool carousel and turret, remove chuck jaws and probes, dismount the control pendant and monitors, and band or bolt every door and cover shut. Bag and label all hardware."}, {"name": "Set shipping brackets and protect precision surfaces", "text": "Bolt in the factory shipping brackets on the spindle head and counterweight, coat exposed ways with way oil or grease, and wrap the spindle nose. No brackets? Tell the movers ahead of time so they can block and brace."}, {"name": "Document and clear the path", "text": "Photograph all four sides, the data plate, and every existing mark. Then measure doorways and aisles against shipped dimensions, verify floor capacity along the route, and clear the aisle before the crew arrives."}]},
    body: "<p>Most machine moves don't go sideways on the truck. They go sideways in the week before the truck shows up &mdash; coolant still in the sump, a toolchanger left loaded, a machine nobody actually weighed. From the dispatch desk, the pattern is consistent: shops that prep load out in a morning; shops that don't burn a full day and sometimes a spindle. Here is the checklist we wish every shop worked through before a <a href=\"../services/machinery-moving.html\">machinery move</a>.</p>\n\n<h2>Start with the real weight and dimensions</h2>\n<p>Every downstream decision &mdash; trailer type, rigging gear, crew size, route, permits &mdash; hangs on two numbers you should nail down first. The legal envelope on US highways is generally <strong>8'6\" wide, 13'6\" tall, about 53' of trailer length, and 80,000 lbs gross</strong>. A machine that pushes the load past any of those thresholds changes the plan: step-deck or RGN instead of flatbed, permit lead time, possibly escorts. Pull the weight off the data plate or the manufacturer's spec sheet, never from memory. Then measure the machine as it will actually ship &mdash; on its skid, with brackets and anything still bolted to it. \"Around nine feet tall\" is not a dimension. It is a low bridge waiting to happen.</p>\n\n<h2>Drain coolant and loose fluids</h2>\n<p>Standing coolant is the most common prep failure we see. It sloshes, it leaks through door seams onto the trailer deck, and on a tilted machine it finds the electrical cabinet. Pump the sump dry, empty the chip conveyor tray, and pull the chips &mdash; wet swarf is dead weight you don't want and a cleanup you really don't want. Hydraulic and lube reservoirs are machine-specific: some manufacturers say drain, some say leave sealed. Check the manual and tell your move coordinator which way you went. Dispose of used coolant per local regulations, not down the floor drain.</p>\n\n<h2>Home, retract, and lock every axis</h2>\n<p>Under power, the servos hold everything where it belongs. On a trailer, nothing holds anything. Send each axis to the position the manual specifies for transport &mdash; typically Z fully retracted, the table centered or at a stated coordinate &mdash; then lock it mechanically. That means the factory <strong>shipping brackets</strong> on the spindle head and counterweight if you still have them, or solid wood blocking and steel banding if you don't. Vertical machining centers are the classic failure: an unbraced head walking down its ballscrew across hundreds of miles of expansion joints. If the brackets are long gone, say so up front &mdash; a competent <a href=\"../services/rigging.html\">rigging crew</a> can block and brace on site, but only if they know before load day.</p>\n\n<h2>Strip the loose stuff</h2>\n<p>Anything that can move, will. Empty the tool carousel and the turret. Remove chuck jaws, vises, tailstock centers, and probes. Dismount the control pendant and any monitor on an articulating arm &mdash; pendants shear off in transit, and a replacement is a lead-time problem, not a parts-counter problem. Band or bolt every door, cover, and sheet-metal panel shut; painter's tape is not securement. Bag the hardware, label the bags, and tape them inside the electrical cabinet. If it ships loose, it ships crated &mdash; not rattling around inside the enclosure.</p>\n\n<figure><img src=\"../assets/img/loads/crating-shrink-wrap-electrical-equipment.jpg\" alt=\"Electrical control equipment crated and shrink-wrapped for machinery shipping\" loading=\"lazy\" width=\"600\" height=\"800\"><figcaption>Controls, pendants, and loose panels ship crated and shrink-wrapped &mdash; never loose inside the machine.</figcaption></figure>\n\n<h2>Protect the precision surfaces</h2>\n<p>Exposed ways, ballscrews, and the spindle taper are what make the machine worth moving in the first place. Coat exposed way surfaces with way oil or a light grease. Wrap the spindle nose and put a plug or a covered tool in the taper. If the machine rides an open deck, settle the shrink-wrap and tarping plan with the movers before load day &mdash; road film and rain on bare cast iron is corrosion, and corrosion on a way surface is a rebuild conversation. This matters double for <a href=\"../services/cnc-machine-movers.html\">CNC equipment</a>, where thousandths are the product.</p>\n\n<h2>Photograph everything</h2>\n<p>Before anyone touches the machine, shoot it: all four sides, the data plate, the control screen showing hours, every existing ding, close-ups of the ways and spindle. Two minutes with a phone establishes condition at pickup and ends every condition argument at delivery before it starts. Shoot again after prep, with brackets and banding visible, so the receiving end knows exactly what to remove and where.</p>\n\n<h2>Clear the path out</h2>\n<p>The crew can move the machine; they cannot move your building. Measure every doorway, dock, and aisle against the shipped dimensions &mdash; height on the skid included. Confirm the floor along the route takes the point loads of machine skates under full weight. Clear the aisle of pallets, benches, and product the day before, not while the crew stands there. If the machine has to come out through a wall panel or over a dock edge at an angle, that is planning, not improvisation &mdash; flag it when you <a href=\"../contact.html\">request a quote</a>, and read <a href=\"how-to-move-a-cnc-machine.html\">how to move a CNC machine</a> for what happens on the rigging side once your prep is done.</p>\n\n<div class=\"takeaways\"><h3>Bottom line</h3><ul>\n<li>Verified weight and shipped dimensions drive the trailer, the rigging plan, and permits &mdash; pull them from the data plate and a tape measure, not memory.</li>\n<li>Drain the coolant, lock every axis, and bracket the spindle head. Transport vibration destroys anything left free to move.</li>\n<li>Pendant off, tooling out, doors banded, photos of everything &mdash; before the crew arrives, not after.</li>\n<li>Missing shipping brackets and tight exit paths are solvable, but only if the movers know before load day.</li>\n</ul></div>",
    faq: [{"q": "Do I need to drain the hydraulic oil too, or just the coolant?", "a": "Coolant always comes out — it sloshes, leaks, and contaminates everything it touches. Hydraulic and way-lube reservoirs are machine-specific: some manufacturers require draining, others want the sealed system left alone so it doesn't ingest air or debris. Check the manual for your exact model and tell the move coordinator what you did, so the crew knows what is still wet."}, {"q": "What if I no longer have the factory shipping brackets?", "a": "It happens constantly — brackets get scrapped years before the machine sells. A competent rigging crew can fabricate wood blocking and steel banding on site to immobilize the spindle head, counterweight, and axes. The only unforgivable version is a free-floating head nobody mentioned. Flag missing brackets when you book the move, not when the truck is at the dock."}, {"q": "Who handles prep — the shop or the machinery movers?", "a": "Split responsibility, and it should be in writing. The movers handle rigging, loading, securement, and transport coordination. Internal prep — fluids, tooling removal, axis locks, brackets — is typically the shop's job or a hired service tech's, because it requires powering the machine and knowing its controls. Confirm the scope line by line before load day so nothing falls in the gap."}],
    related: [{"h": "Machinery Moving", "u": "../services/machinery-moving.html"}, {"h": "CNC Machine Movers", "u": "../services/cnc-machine-movers.html"}, {"h": "How to Move a CNC Machine", "u": "how-to-move-a-cnc-machine.html"}, {"h": "Get a Quote", "u": "../contact.html"}],
  },
  {
    slug: "how-to-transport-a-transformer",
    cat: "Specialized Rigging",
    hero: "heavyhaul-load.jpg",
    date: "2026-07-02",
    title: "How to Transport a Transformer: Trailer, Permits, and Rigging by Weight Class",
    desc: "Transformers ship upright on flatbeds, step-decks, RGNs, or multi-axle trailers by weight, with impact recorders, tilt limits, and rigging planned at both ends.",
    dek: "A transformer is the one load where a single hard bump can total the cargo without leaving a mark on it. Here is how the move actually gets planned, from the dispatch desk.",
    tldr: "Transformers move upright, always. Match the trailer to the shipping weight: flatbed for distribution units, step-deck when height gets tight, RGN for heavy substation units, multi-axle platforms for large power transformers. Mount tri-axial impact recorders, secure only at manufacturer tie-down points, pull overweight permits early, and plan the rigging at both ends before the truck is booked.",
    keywords: "transformer transport, transformer rigging, transformer shipping, impact recorder, RGN trailer, transformer rigging, oversize load permits",
    howto: {"name": "How to Transport a Power Transformer", "steps": [{"name": "Pull the nameplate and transport drawing", "text": "Get the shipping weight (with or without oil), dimensions, center of gravity, designated lift points, and the manufacturer's tilt limit. Every downstream decision comes off this sheet."}, {"name": "Match the unit to the trailer", "text": "Run the height math off deck height and the weight math off axle count. Flatbed for distribution units, step-deck when height is tight, RGN for heavy substation units, multi-axle platform for large power transformers."}, {"name": "Book permits and survey the route", "text": "Overweight is usually the trigger before oversize. File state-by-state permits, order bridge analysis where required, and drive or desk-survey the route for low wires, weak structures, and turn radii."}, {"name": "Rig it on and keep it level", "text": "Crane or gantry lift using the manufacturer's lift lugs only, with spreader bars to control sling angles. The unit stays within its tilt limit through the entire pick."}, {"name": "Mount recorders and secure the load", "text": "Fix a tri-axial impact recorder to the tank and chain the unit at its designated tie-down points. Never bear on radiators, bushings, or conservator piping."}, {"name": "Offload, read the recorder, then sign", "text": "Reverse the rigging plan at destination, download the impact recorder, and inspect before anyone signs a clean delivery receipt. The readout is your evidence either way."}]},
    body: "<p>A transformer is not general freight. It is top-heavy, it is often full of mineral oil, and the core-and-coil assembly inside the tank does not tolerate impact. You can drop a crate of steel fittings off a dock and lose nothing. Put a hard shock into a transformer and you can shift windings, crack porcelain, and buy yourself a factory teardown — with zero visible damage on the outside of the tank.</p><p>That is why transformer moves get planned backwards from the nameplate, not forwards from the truck. Here is how we run them.</p><h2>Why a transformer is its own problem</h2><p>Three things separate a transformer from ordinary machinery. <strong>First, the center of gravity sits high</strong> — the core and coils are dense and mounted well up in the tank, so the load wants to tip. <strong>Second, many units ship wet.</strong> Smaller transformers travel filled with insulating oil, which adds real weight and can slosh; large power transformers are typically drained and shipped under a dry-air or nitrogen blanket, then filled on site. <strong>Third, the internals are shock-sensitive.</strong> Manufacturers publish g-force limits and tilt limits for transit, and warranty claims routinely hinge on whether the move stayed inside them.</p><h2>Weight classes and the trailer that matches</h2><p>Trailer selection is weight and height math, nothing else. Working buckets:</p><ul><li><strong>Pad-mount and distribution units:</strong> a few hundred pounds up to several tons. Standard flatbed, fully legal load. The job is securement and upright handling, not permits.</li><li><strong>Small substation transformers:</strong> roughly five to twenty-plus tons. Flatbed or step-deck. Watch height — a flatbed deck sits around five feet off the ground, so a tall unit can push past the 13'6\" legal ceiling. A step-deck buys back over a foot of clearance.</li><li><strong>Power transformers in the mid range:</strong> once the combined rig approaches the 80,000 lb federal gross limit, you are into overweight permitting and a removable gooseneck (RGN) or lowboy, often with flip axles added to spread the load.</li><li><strong>Large power transformers:</strong> multi-axle platform trailers, dual-lane configurations, and superload-class permitting with route surveys and bridge engineering. Some long legs move by rail with trucks handling the first and last miles.</li></ul><figure><img src=\"../assets/img/loads/load-oversize-tank.jpg\" alt=\"Oversize transformer tank secured upright on a multi-axle trailer\" loading=\"lazy\" width=\"1200\" height=\"800\"><figcaption>The tank rides upright and chained at the manufacturer's tie-down points — never off radiators or bushings.</figcaption></figure><h2>Impact recorders and the upright rule</h2><p>Every serious transformer move carries a tri-axial impact recorder bolted to the tank. It logs shock events in all three axes for the entire trip, and it gets downloaded at delivery before anyone signs. If the manufacturer's g-limit was exceeded, the receiver knows before the unit is energized — not after a failure in service.</p><p>The upright rule is absolute. Transformers travel vertical, inside a tilt tolerance that is often only a few degrees. Laying one over can displace the core, damage internal bracing, and disturb the oil or gas blanket. If a unit will not fit upright on a flatbed, the answer is a lower deck, not a lower angle.</p><h2>Permits: weight drives the file</h2><p>Most transformer permit work is triggered by weight before dimensions. Anything pushing the rig past 80,000 lbs gross needs overweight permits in every state it crosses, and axle loadings have to satisfy each state's bridge formula — which is why axles get added even when the trailer could technically carry the weight. Dimensional permits stack on top when the unit exceeds 8'6\" wide or 13'6\" tall on the trailer. Escorts, curfews, and route restrictions all flow from the permit file. The short version: permits are lead time, and lead time is booked before the truck is.</p><h2>Rigging on and rigging off</h2><p>The lift is planned from the transport drawing. Slings go on the manufacturer's lift lugs — nowhere else — with spreader bars sized to keep sling angles inside spec. Depending on site access, that means a hydraulic crane, a gantry system over the pad, or jack-and-slide for the final set. Bushings and radiators are usually removed and crated separately on larger units, because they are the first things to break and the last things you want load-bearing. Securement follows the same logic: chains to designated tie-down points, with <a href=\"blocking-bracing-and-dunnage-explained.html\">blocking and bracing</a> carrying the base, never the cooling fins. Both ends of the move — <a href=\"../services/project-freight.html\">the freight</a> and <a href=\"../services/transformer-generator-rigging.html\">the rigging</a> — get coordinated as one plan, because a trailer the destination crane cannot unload is a planning failure, not bad luck.</p><div class=\"takeaways\"><h3>Bottom line</h3><ul><li>Transformers ride upright, inside the manufacturer's tilt limit, every mile.</li><li>Trailer choice is weight and height math: flatbed, step-deck, RGN, then multi-axle platform as the numbers climb.</li><li>Tri-axial impact recorders travel on the tank and get read before sign-off.</li><li>Overweight permitting usually triggers before oversize — file early, route around weak bridges.</li><li>Rig only from designated lift lugs and tie-down points; radiators and bushings carry nothing.</li></ul></div><p>Moving a transformer soon? Send us the nameplate data and the transport drawing and we will coordinate the trailer, permits, and rigging at both ends. <a href=\"../contact.html\">Get a quote</a>.</p>",
    faq: [{"q": "Can a transformer be shipped lying on its side?", "a": "No. Transformers travel upright within a manufacturer-specified tilt tolerance, often only a few degrees. Laying a unit over can shift the core-and-coil assembly, damage internal bracing, and disturb the oil or gas blanket. If it will not clear 13'6\" upright on a flatbed, the fix is a lower deck — step-deck or RGN — not a lower angle."}, {"q": "Do transformers ship full of oil?", "a": "Smaller distribution and substation units typically ship filled with insulating oil, which adds meaningful weight to the trailer math. Large power transformers are usually drained and shipped under a dry-air or nitrogen blanket, with the oil processed and filled on site. The nameplate and transport drawing state the actual shipping condition and weight — plan from those, not the installed weight."}, {"q": "When does a transformer move need permits?", "a": "When the loaded rig exceeds 80,000 lbs gross, or the load exceeds 8'6\" wide or 13'6\" tall on the trailer. Weight is the usual trigger for transformers. Overweight permits are issued state by state, axle loadings must satisfy each state's bridge formula, and the largest units fall into superload territory with route surveys, escorts, and bridge engineering."}],
    related: [{"h": "Transformer & Generator Rigging", "u": "../services/transformer-generator-rigging.html"}, {"h": "Industrial Rigging", "u": "../services/rigging.html"}, {"h": "Jacking, Skidding & Gantry Lifts", "u": "../services/heavy-lift-rigging.html"}, {"h": "Blocking, Bracing & Dunnage", "u": "blocking-bracing-and-dunnage-explained.html"}],
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
    body: "<p>A machine move is really two jobs. The first is moving mass: getting a 38,000-pound machining center off its foundation, across the floor, onto a trailer, and set down at the new plant without dropping it or racking the frame. The second is making that machine produce parts again — level, aligned, anchored, and holding tolerance. Riggers own the first job. Millwrights own the second. A steady share of the calls that hit our dispatch desk asking for one actually need both, so here is the plain-English version of who does what.</p><h2>What a millwright actually does</h2><p>A millwright is a precision industrial mechanic. The trade sits between heavy construction and machining: strong enough to wrestle a gearbox into position, precise enough to measure the result in thousandths of an inch. On a machine move, the work breaks into five buckets:</p><ul><li><strong>Installation.</strong> Setting the machine on its foundation, placing and torquing anchor bolts, shimming the base, and grouting where the spec calls for it.</li><li><strong>Leveling.</strong> Bringing the machine bed level and flat with machinist levels and laser instruments. This is not carpenter-level work — precision machine tools are commonly leveled to tolerances measured in thousandths of an inch per foot. A bed that sits twisted cuts scrap, wears unevenly, and drifts out of spec.</li><li><strong>Alignment.</strong> Shaft and coupling alignment between motors, gearboxes, and driven equipment using dial indicators or laser rigs. Misalignment kills bearings quietly, months after the move.</li><li><strong>Dismantling.</strong> Taking a machine apart for transport the right way: draining fluids, blocking axes and counterweights, match-marking mating parts, capping lines, and documenting the teardown so reassembly is not a guessing game.</li><li><strong>Reassembly and startup support.</strong> Putting it back together, verifying geometry, and supporting first power-up so the machine goes back to making parts instead of warranty claims.</li></ul><h2>What rigging covers — and where the line sits</h2><p>Rigging is the discipline of moving heavy loads under control. A rigging crew works out weight and center of gravity, selects the crane, gantry, forklift, or skate system, plans the travel path, checks floor loading, and executes the pick and the set. Riggers answer one question: how do we move this safely. Millwrights answer a different one: how does this run again.</p><p>The overlap is real — many millwrights carry rigging qualifications, and good machinery-moving crews field people who do both. But the finish line differs. A rigging scope is complete when the machine sits on its new footprint. A millwright scope is complete when the spindle runs true under load. If your scope of work stops at \"set in place,\" nobody on the job owns the second part — and that gap is where recommissioning problems live.</p><h2>How both trades sequence through a machine move</h2><ul><li><strong>Millwright first.</strong> Disconnect power, air, coolant, and data with the plant's electricians; drain and cap; block moving elements; pull whatever must come off for transport.</li><li><strong>Riggers out.</strong> Lift or skate the machine off its foundation, travel it to the dock, and load it with proper blocking and securement.</li><li><strong>Transport.</strong> Most dismantling decisions are trailer decisions. Stay inside the general legal envelope — roughly 8'6\" wide, 13'6\" tall, and 80,000 pounds gross — and the machine moves as standard freight. Go over, and the move needs oversize permits, defined routes, and sometimes escorts. Pulling a column or splitting a press bed is often what keeps a load legal.</li><li><strong>Riggers in.</strong> Offload, travel to the final footprint, and set the machine on its foundation.</li><li><strong>Millwright last.</strong> Reassemble, anchor, grout, level, align, reconnect, and support startup.</li></ul><figure><img src=\"../assets/img/rigging-crane.jpg\" alt=\"Crane and rigging crew lifting industrial machinery during a machine move\" loading=\"lazy\" width=\"1200\" height=\"800\"><figcaption>Rigging gets the machine on and off the truck. Millwright work is everything before the pick and after the set.</figcaption></figure><h2>When a job needs both — and when rigging alone is enough</h2><p>Plan on both trades when the machine is going back into production: CNC machining centers, grinders, presses, injection molders, and anything with an alignment-critical drivetrain or a leveling spec in the install manual. Production lines add sequencing on top — machines have to come back online in the order the process runs.</p><p>Rigging alone can be enough when the machine is skidded and self-contained, headed to storage or auction rather than production, or when the buyer's own maintenance team handles recommissioning. Be honest about which case you are in. \"We'll level it ourselves later\" works fine for a shop press and badly for a five-axis machining center.</p><h2>What drives cost and schedule</h2><p>No two machine moves price the same, but the drivers are consistent: how much dismantling the machine needs to travel legally, how tight the leveling and alignment spec is, whether the foundation needs anchors or grout with cure time, whether the OEM requires certified installation to keep the warranty intact, and how narrow the downtime window is. One coordinated plan covering rigging, transport, and millwright work beats three contractors pointing at each other.</p><p>That coordination is the job at Badass Logistics: we scope the move, line up the rigging and millwright crews, arrange the transport leg, and sequence the handoffs so the machine that left your floor making parts arrives ready to do the same.</p><div class=\"takeaways\"><h3>Bottom line</h3><ul><li>Riggers move the mass; millwrights make the machine run. One scope ends at set-in-place, the other at holds-tolerance.</li><li>Any machine returning to production needs millwright work: leveling, alignment, anchoring, startup support.</li><li>Dismantling is usually a transport decision — staying inside roughly 8'6\" wide, 13'6\" tall, and 80,000 pounds gross keeps the load legal.</li><li>Put both trades in one coordinated scope so no gap opens between machine set and machine running.</li></ul></div>",
    faq: [{"q": "Is a millwright the same as a rigger?", "a": "No. Rigging is moving heavy loads under control — picks, travel paths, securement. Millwright work is precision: installing, leveling, aligning, and reassembling machinery so it runs in spec. Many pros carry both skill sets, but the scopes end in different places, and your contract should name both."}, {"q": "Do I need a millwright if the machine is only going into storage?", "a": "Usually not for the move itself — rigging and transport handle a skidded, self-contained machine fine. But a proper millwright teardown before storage, with fluids drained, axes blocked, and parts match-marked, makes the eventual reinstall far cleaner and faster."}, {"q": "Who handles the transport leg between plants?", "a": "That is a freight coordination job. Badass Logistics arranges the trucking alongside the rigging and millwright crews and sequences all three, so the trailer shows up when the machine is ready to load and the install crew is waiting at the other end."}],
    related: [{"h": "Machinery Moving", "u": "../services/machinery-moving.html"}, {"h": "Industrial Rigging", "u": "../services/rigging.html"}, {"h": "What Is Industrial Rigging?", "u": "what-is-industrial-rigging.html"}, {"h": "Plant Relocation", "u": "../services/plant-relocation.html"}],
  },
  {
    slug: "what-is-project-cargo",
    cat: "Freight & Trucking",
    hero: "brokerage-flatbed.jpg",
    date: "2026-07-02",
    title: "What Is Project Cargo? Moving Oversized, Complex Shipments",
    desc: "What project cargo is, why it's different from standard freight, and how oversized multi-piece industrial moves get engineered, permitted, and coordinated.",
    dek: "Project cargo isn't a big truckload. It's an engineered program of permits, trailers, rigging, and sequencing — and if one piece slips, the whole project feels it.",
    tldr: "Project cargo is large, high-value, usually multi-piece freight tied to a capital project — plant builds, energy equipment, process vessels. Unlike standard freight, it has to be engineered before it's booked: route surveys, state-by-state permits, specialized trailers, rigging at both ends, and a delivery sequence dictated by the install schedule. One coordinator owns the whole chain from drawing to final set.",
    keywords: "project cargo, project freight, oversized freight, breakbulk shipping, rigging, plant relocation, freight coordination",
    body: "<p>Ask ten people in freight what project cargo is and you'll get ten answers. From the dispatch desk, the definition is simple: project cargo is any shipment that has to be <strong>engineered instead of just booked</strong>. It's the big, heavy, high-value, usually multi-piece freight tied to a capital project — a plant build, a substation, a mine expansion, a refinery turnaround — where the cargo, the route, the equipment, and the delivery order all get planned as one program.</p><p>Standard freight lives inside the legal envelope: roughly 8'6\" wide, 13'6\" tall, about 53' of trailer, and 80,000 lbs gross vehicle weight. You book a truck, it loads, it delivers. Project cargo breaks that model in at least one direction — a single piece that blows past the envelope, or forty pieces that only work if they arrive in the right sequence.</p><h2>What actually qualifies as project cargo</h2><ul><li><strong>Energy equipment</strong> — turbines, generators, transformers, wind tower sections, nacelles</li><li><strong>Process equipment</strong> — pressure vessels, reactors, columns, boilers, heat exchangers</li><li><strong>Heavy machinery</strong> — presses, crushers, mills, kilns, complete production lines</li><li><strong>Fabricated structures</strong> — bridge girders, modular skids, pre-assembled pipe racks, storage tanks</li></ul><p>Size isn't the only trigger. A <a href=\"../services/plant-relocation.html\">plant relocation</a> that fills forty trailers is project cargo even when most loads are legal-dimension, because the machining centers have to land before the walls close in and the press line has to arrive in install order. The moment sequencing matters, you've left standard freight territory.</p><figure><img src=\"../assets/img/loads/gooseneck-flatbed-industrial-tanks.jpg\" alt=\"Industrial tanks chained and secured on a gooseneck flatbed trailer for a multi-piece project cargo move\" loading=\"lazy\" width=\"1024\" height=\"576\"><figcaption>Industrial tanks secured on a gooseneck flatbed — one truckload out of many on a typical multi-piece project move.</figcaption></figure><h2>Five things that separate it from standard freight</h2><p><strong>1. Engineering comes first.</strong> Before any truck gets booked, someone verifies the piece's weight, dimensions, and center of gravity against deck ratings and axle spacing. Overweight loads trigger axle-loading calculations. The heaviest moves can require engineered bridge reviews in some states. Lift plans get drawn for both ends before a wheel turns.</p><p><strong>2. The equipment is specialized.</strong> RGNs, multi-axle lowboys, stretch flatbeds, hydraulic platform trailers, dolly systems — the trailer is chosen off the drawing, not off what's parked nearby. A tall vessel that clears on a double-drop won't clear on a standard flatbed, and an overweight load may need extra axles just to spread the footprint legally.</p><p><strong>3. Permits and escorts rule the calendar.</strong> Every state issues its own oversize/overweight permits with its own approved routes, curfews, escort rules, and travel windows. Tall loads can require a height pole car and utility crews to lift wires. Permits get sequenced across every state on the route — one denial or route restriction can reroute the entire move.</p><p><strong>4. Multiple modes, one plan.</strong> The heaviest piece may ride barge or rail while everything else runs over the road, with a laydown yard and a crane transfer in between. Every mode change is its own rigging job with its own lift plan.</p><p><strong>5. Rigging is part of the shipment, not an afterthought.</strong> Pieces get disconnected, skated out of buildings, lifted, blocked, and secured at origin — then set by crane or gantry at destination, often into a scheduled window the installation crew is standing by for. A late piece doesn't just cost a delivery date; it idles millwrights and crane time.</p><h2>How an end-to-end move gets coordinated</h2><p>It starts with data: verified dimensions, weights, drawings, and center-of-gravity marks for every piece — not estimates off a spec sheet. Then the route survey, which for the biggest pieces means physically driving the route, measuring bridge clearances, and checking turn radii at every interchange. Equipment gets matched to each piece, permits get filed state by state, and escort and utility work gets scheduled around curfews and travel windows.</p><p>Then execution: rigging crews load out at origin, trucks run their permitted windows, and the destination crane sets each piece in install order. The value of one <a href=\"../services/project-freight.html\">project freight</a> team is that carriers, riggers, permit services, and the site schedule all answer to one plan. When the schedule moves, one desk re-sequences everything instead of five vendors pointing at each other.</p><h2>What drives the cost</h2><p>No two project moves price the same, but the drivers are consistent: how far the piece exceeds the legal envelope (which dictates axle count, permits, and escorts), how many states the route crosses, whether bridge engineering or route modifications are required, the crane and rigging scope at both ends, laydown or storage between modes, and how compressed the schedule is. Weight and width cost money. Surprises cost more. The cheapest project move is the one measured correctly the first time.</p><div class=\"takeaways\"><h3>Bottom line</h3><ul><li>Project cargo is freight that has to be engineered, not just booked — oversized, overweight, high-value, or sequence-critical multi-piece moves.</li><li>Anything past 8'6\" wide, 13'6\" tall, ~53' long, or 80,000 lbs gross leaves standard freight and enters permit territory.</li><li>Permits, escorts, route surveys, and rigging windows drive the schedule — start with verified dimensions and weights, not estimates.</li><li>One coordinator owning carriers, riggers, and permits end to end is what keeps a forty-load program on sequence.</li></ul></div><p>Planning a plant build, equipment install, or multi-piece industrial move? Start with the drawings and <a href=\"../contact.html\">get a quote</a> — or if your load fits on a single trailer, read our guide on <a href=\"how-to-ship-industrial-machinery-on-a-flatbed.html\">shipping industrial machinery on a flatbed</a>.</p>",
    faq: [{"q": "Is project cargo the same thing as heavy haul?", "a": "No. Heavy haul is one discipline inside project cargo — moving a single overdimensional or overweight piece on specialized trailers. Project cargo is the whole program: multiple pieces, multiple trailers or modes, rigging at both ends, and a delivery sequence tied to an installation schedule. A single transformer move is heavy haul; that transformer plus the switchgear, skids, and control buildings arriving in set order is project cargo."}, {"q": "How far in advance should a project cargo move be planned?", "a": "As early as possible — ideally while the equipment is still being fabricated. The longest lead items are permits and engineering on the heaviest pieces: superload permits, bridge reviews, and utility coordination for wire lifts all take longer than booking trucks. Route surveys can also change the plan entirely, so locking dimensions and weights early prevents re-permitting later."}, {"q": "Does every piece in a project move need oversize permits?", "a": "No. Only pieces that exceed the legal envelope — generally 8'6\" wide, 13'6\" tall, about 53' long, or 80,000 lbs gross — need oversize/overweight permits. Legal-dimension pieces move as standard freight. But they still get sequenced into the same delivery plan, because the install schedule doesn't care which loads were permitted."}],
    related: [{"h": "Project Freight", "u": "../services/project-freight.html"}, {"h": "Plant Relocation", "u": "../services/plant-relocation.html"}, {"h": "How to Ship Industrial Machinery on a Flatbed", "u": "how-to-ship-industrial-machinery-on-a-flatbed.html"}],
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
    body: "<p>A lathe is one long precision casting with everything else bolted to it. Every cut the machine will ever make rides on the geometry ground into that bed at the factory. Twist it during a move — wrong lift point, uneven skating, a hard set-down — and the machine turns a taper into every part until somebody re-levels it. Here is how our <a href=\"../services/machinery-moving.html\">machinery moving</a> crews handle them: nothing touches the ways from door to door.</p>\n\n<h2>Know what you are moving</h2>\n<p>\"Metal lathe\" covers a huge range. A 12x36 bench machine weighs a few hundred pounds. A 14x40 engine lathe typically runs 2,000 to 3,000 pounds. A Monarch 10EE toolroom lathe packs over 3,000 pounds into the footprint of a desk, and turret lathes and hollow-spindle oilfield machines run 10,000 to 20,000 pounds and beyond. Pull the builder's plate and manual before anyone touches the machine. Nearly every lathe rides legal — inside 8'6\" wide, 13'6\" tall, and 80,000 pounds gross — so the problem is rarely permits. It is geometry.</p>\n<p>One number matters more than gross weight: headstock bias. The headstock — spindle, gearbox, motor — puts well over half the weight at one end. The center of gravity is nowhere near the middle of the bed, and every lift, skate, and tie-down decision starts there.</p>\n\n<h2>Rig from the casting, never the ways</h2>\n<p>The ways are the finished surfaces the carriage and tailstock ride on. Nothing bears on them. No slings, no forks, no chains, no boots. Same rule for the leadscrew, feed rod, and control rod running along the front of the bed — a forklift coming in from the operator side will bend all three before the driver feels a thing.</p>\n<ul>\n<li><strong>Slings:</strong> around the bed casting between headstock and carriage and near the tailstock end, with hardwood softeners, run to a spreader bar so they pull vertical instead of pinching the ways.</li>\n<li><strong>Forklift:</strong> padded forks under the bed or base webs from the back or the tailstock end, load centered on the headstock bias — not the middle of the bed.</li>\n<li><strong>Factory points:</strong> many lathes have cast lifting bosses or threaded lift holes. If the manual shows them, use them.</li>\n</ul>\n\n<h2>Strip it before it rolls</h2>\n<p><strong>Chuck:</strong> comes off. A large four-jaw hangs serious weight cantilevered off the spindle nose, and every pothole hammers that leverage into the spindle bearings. On a threaded nose it can also unscrew itself in transit. It rides in its own crate.</p>\n<p><strong>Tailstock:</strong> remove and crate it, or lock it down hard at the far end of the bed and strap it. A loose tailstock is a battering ram on rails.</p>\n<p><strong>Steady rests and follow rests:</strong> off, wrapped, crated. <strong>Carriage:</strong> run it up tight to the headstock, lock it, strap it — rolling mass over the center of gravity, not loose at mid-bed.</p>\n<p>Then coat the ways in way oil or rust preventive and wrap the machine. Bare cast iron flash-rusts in one humid night on the road.</p>\n\n<figure><img src=\"../assets/img/loads/crating-shrink-wrap-electrical-equipment.jpg\" alt=\"Industrial equipment shrink-wrapped and crated for machinery transport\" loading=\"lazy\" width=\"600\" height=\"800\"><figcaption>Everything you strip off the lathe — chuck, tailstock, steady rests — gets wrapped and crated, and rides separately from the machine.</figcaption></figure>\n\n<h2>Skate on three points, not four</h2>\n<p>Machinery skates get the lathe to the door, and this is where beds get twisted. Three points of support cannot rock: two skates under the headstock end, one steerable skate under the tailstock. Four skates on a floor that is not dead flat means the bed spends part of the trip bridging a diagonal — twist, applied under full machine weight. Toe-jack under the casting, lift only as high as the skates need, sweep the route, walk it slow.</p>\n\n<h2>Air-ride van or flatbed</h2>\n<p>A toolroom or CNC-grade lathe wants an air-ride trailer — the suspension soaks up the shock loads a stiff-sprung deck passes straight into the spindle bearings and ways. A rough heavy engine lathe travels fine on a flatbed or step deck with solid blocking, chained through the base or foot holes — never over the bed, never near the leadscrew. Shrink wrap under a tarp keeps road spray off the machined surfaces either way. The same discipline applies to machining centers — see <a href=\"how-to-move-a-cnc-machine.html\">how to move a CNC machine</a>.</p>\n\n<h2>Re-level to spec or the move is not finished</h2>\n<p>Setting the lathe on the new floor is not the end of the job. Put a precision machinist level — typical sensitivity 0.0005 inches per 10 inches per division — across the ways at the headstock end, then the tailstock end, and adjust the leveling screws until both readings match. Matching matters more than absolute level: equal readings mean no twist. Then prove it with metal — a light cut on a test bar, measured for taper. Recheck after a week or two as the machine settles. Full procedure in our <a href=\"machine-leveling-and-alignment.html\">machine leveling and alignment</a> guide, or <a href=\"../contact.html\">get a quote</a> and we bring the level.</p>\n\n<div class=\"takeaways\"><h3>Bottom line</h3><ul>\n<li>Nothing touches the ways, the leadscrew, or the feed rod — rig from the bed casting or the factory lift points.</li>\n<li>Chuck, tailstock, steady rests: off the machine and crated. Carriage locked tight against the headstock.</li>\n<li>The headstock carries well over half the weight — plan every lift, skate, and chain around that bias.</li>\n<li>Three points of support beat four on any floor that is not dead flat.</li>\n<li>The move is done when a machinist level reads the same at both ends of the bed and a test cut runs true.</li>\n</ul></div>",
    faq: [{"q": "Can you move a metal lathe with a forklift?", "a": "Yes, if the forks go under the bed casting or base — padded, approaching from the back or the tailstock end, never from the operator side where the leadscrew and feed rod run. Set the load center on the headstock end, which carries well over half the weight, and never lift against the ways or the chip pan."}, {"q": "Does the chuck have to come off before shipping a lathe?", "a": "Yes. A heavy chuck cantilevered off the spindle nose turns every road shock into a hammer blow on the spindle bearings, and on a threaded spindle nose it can spin itself loose in transit. Pull it, crate it, and ship it alongside the tailstock, steady rests, and tooling."}, {"q": "How do you check a lathe for bed twist after a move?", "a": "Set a precision machinist level across the ways at the headstock end and again at the tailstock end, then adjust the leveling screws until both readings match — equal readings mean the bed carries no twist. Confirm with a light test cut on a bar and measure for taper. Recheck the level after a week or two as the machine settles into the floor."}],
    related: [{"h": "Machinery Moving", "u": "../services/machinery-moving.html"}, {"h": "CNC Machine Movers", "u": "../services/cnc-machine-movers.html"}, {"h": "How to Move a CNC Machine", "u": "how-to-move-a-cnc-machine.html"}, {"h": "Machine Leveling and Alignment", "u": "machine-leveling-and-alignment.html"}],
  },
  {
    slug: "how-to-ship-a-generator",
    cat: "Machinery Moving",
    hero: "loads/load-oversize-tank.jpg",
    date: "2026-07-03",
    title: "How to Ship an Industrial Generator: Trailer, Rigging, and Securement by Weight Class",
    desc: "Gensets ship upright on the base frame — flatbed, step-deck, or RGN by weight, with fuel run down, chains on the skid, and state permits for oversize units.",
    dek: "From 50 kW towables to 2 MW containerized plants: pick the trailer by weight, lift and chain the base frame, run the fuel down, and permit anything past the legal envelope.",
    tldr: "Gensets ship upright on the base frame — flatbed to about 45,000 lbs, step-deck for tall enclosures, RGN beyond that. Run the fuel tank down, lift and chain the skid (never the enclosure), and pull per-state permits once the load passes 8'6\" wide, 13'6\" tall, or 80,000 lbs gross.",
    keywords: "ship industrial generator, genset transport, generator shipping, generator rigging, skid-mounted genset, oversize load permits, generator rigging",
    howto: {"name": "How to Ship an Industrial Generator", "steps": [{"name": "Pull the spec plate data", "text": "Record dry weight, wet weight, length, width, and height with the enclosure on, plus base tank capacity. Measure the widest point including louvers and lift lugs — quotes and permits are only as good as these numbers."}, {"name": "Run down fuel and prep the unit", "text": "Drain or run the base tank to near empty, disconnect and tape the battery terminals, cap the vents, latch every enclosure door, and check for fluid weeps."}, {"name": "Match the trailer to weight and height", "text": "Flatbed to roughly 45,000 lbs of cargo, step-deck when enclosure height plus deck height busts 13'6\", RGN or multi-axle lowboy for heavier or taller prime-power units."}, {"name": "Lift from the base frame", "text": "Forklift through the skid's fork pockets, or crane with a spreader bar shackled into the rated base-frame lift points. Never lift by the enclosure unless it has a verified rated lifting bail."}, {"name": "Chain the skid, then block and brace", "text": "Minimum four direct chains to the skid's tie-down points with an aggregate working load limit of at least half the cargo weight, hardwood dunnage under the rails, and edge protection everywhere chain meets steel."}, {"name": "Permit and schedule oversize units", "text": "Anything over 8'6\" wide, 13'6\" tall, or 80,000 lbs gross needs a permit from every state on the route. Measure after loading and give big packages a week of lead time."}]},
    body: "<p>A genset is a diesel engine, an alternator, and a steel base frame that usually doubles as the fuel tank. That base frame is the only part built to be lifted, chained, and hauled — ship it like general freight and you pay in dented enclosures, cracked isolators, and a warranty fight.</p>\n\n<h2>Know the weight class first</h2>\n<p>Generator moves sort into three buckets, and everything — trailer, loading gear, permits — flows from the bucket:</p>\n<ul>\n<li><strong>Portable and towable units (under roughly 5,000 lbs).</strong> The 20&ndash;50 kW rental and light-tower class. Flatbed, hotshot, or even LTL with a forklift on both ends.</li>\n<li><strong>Commercial standby gensets (5,000&ndash;25,000 lbs).</strong> The 100&ndash;500 kW skid and enclosure units behind hospitals and telecom sites. Flatbed or step-deck territory.</li>\n<li><strong>Prime-power and data-center class (25,000 lbs and up).</strong> The 750 kW to 2 MW+ packages, often in 20&ndash;40 ft sound-attenuated enclosures or ISO containers. Step-decks, RGNs, and multi-axle lowboys, usually with a crane at both ends.</li>\n</ul>\n<p>Pull the spec plate before you ask for a quote: dry weight, wet weight, length-width-height with the enclosure on, and base tank capacity. \"About the size of a pickup\" gets you the wrong trailer.</p>\n\n<h2>Fuel and fluids: run it down</h2>\n<p>Diesel weighs roughly 7 lbs per gallon, so a full 1,000-gallon base tank adds about 7,000 lbs — enough to change the trailer, the axle math, and whether the load is legal at all. Most carriers want the tank near empty; some receivers require it dry with documentation.</p>\n<ul>\n<li>Run the tank down or pump it out before pickup.</li>\n<li>Coolant and oil normally stay in, but cap every vent and check for weeps.</li>\n<li>Disconnect the batteries, tape the terminals, and latch every enclosure door.</li>\n</ul>\n\n<h2>Skid vs. enclosure: the skid does the work</h2>\n<p>The base frame is structural steel, engineered for lifting and tie-down. The enclosure is thin sheet metal over acoustic foam. Every lift and every chain goes to the skid — never to panels, roof rails, or door hinges.</p>\n<p>Some enclosures carry a rated single-point lifting bail — use it only if the data plate confirms the rating. Otherwise rig the base frame with a spreader bar so slings clear the walls. Open-skid units rig easier but need tarps or a Conestoga over the control panel and alternator.</p>\n\n<h2>Trailer choice by weight and height</h2>\n<ul>\n<li><strong>Flatbed:</strong> up to roughly 45,000 lbs of cargo. Deck sits near 5 ft, so the enclosure can stand about 8'6\" before hitting the 13'6\" legal ceiling.</li>\n<li><strong>Step-deck:</strong> same weight class, but the lower deck (around 3'6\") buys roughly 10 ft of cargo height. The default for taller enclosures.</li>\n<li><strong>RGN / lowboy:</strong> for units past roughly 40,000 lbs or 10 ft tall. The well sits near 24 inches, and added axles carry gross weights past 80,000 lbs under permit.</li>\n</ul>\n<p>The legal envelope: 8'6\" wide, 13'6\" tall, about 53 ft long, 80,000 lbs gross. Radiator packages blow the width limit more often than people expect — measure the widest point, louvers and lugs included.</p>\n\n<figure><img src=\"../assets/img/loads/flatbed-load-securement-yellow-straps.jpg\" alt=\"Skid-mounted industrial equipment chained and strapped to a flatbed trailer with edge protection\" loading=\"lazy\" width=\"1131\" height=\"848\"><figcaption>Securement goes to the base frame — with edge protection anywhere webbing or chain touches painted steel.</figcaption></figure>\n\n<h2>Loading: forklift, crane, or rigging crew</h2>\n<p>Under about 10,000 lbs, a properly rated forklift handles it — forks through the skid's fork pockets, not under the tank. Up to 25,000 lbs you are into a large-capacity lift truck or a crane with a spreader bar and rated shackles in the base-frame lift points. Above that, plan on a crane at both ends, or a <a href=\"../services/machinery-moving.html\">machinery moving</a> crew with gantries and skates when the unit starts or ends inside a building. The lift crew needs lift points, center of gravity (offset toward the engine end), and spreader dimensions before the truck shows up.</p>\n\n<h2>Securement: chain the frame</h2>\n<p>Chains and binders go to the skid's designated tie-down points or lift lugs — minimum four direct tie-downs, with an aggregate working load limit of at least half the cargo weight under federal securement rules. Straps over the enclosure roof are how you buy a new enclosure. Block the rails against slide, keep hardwood dunnage under the frame, and protect every edge — full method in our <a href=\"blocking-bracing-and-dunnage-explained.html\">blocking, bracing, and dunnage guide</a>.</p>\n\n<h2>Permits for the big units</h2>\n<p>Once the loaded dimensions pass 8'6\" wide or 13'6\" tall, or gross weight passes 80,000 lbs, every state on the route issues its own oversize/overweight permit with its own routing, travel hours, and escort thresholds. Permit dimensions must match the load exactly — measure after loading, not off the brochure. Plan it a week out like a <a href=\"how-to-transport-a-transformer.html\">transformer move</a>, not a day — and plan the <a href=\"../services/transformer-generator-rigging.html\">rigging at both ends</a> with it.</p>\n\n<div class=\"takeaways\"><h3>Bottom line</h3><ul>\n<li>The base frame is the shipping structure. Lift it, chain it, and block it there — never on the enclosure.</li>\n<li>Run the fuel down — a full base tank can add thousands of pounds.</li>\n<li>Flatbed to roughly 45,000 lbs, step-deck for tall enclosures, RGN or lowboy with permits beyond the 8'6\" x 13'6\" x 80,000-lb envelope.</li>\n<li>Big units need a rigging plan and per-state permits before pickup day — built on spec-plate numbers, not guesses.</li>\n</ul></div>\n\n<p>Got a genset to move — 50 kW towable or containerized 2 MW plant? Send the spec plate data and both site conditions, and we build the trailer, rigging, and permit plan around it. <a href=\"../contact.html\">Get a quote</a>.</p>",
    faq: [{"q": "Do I have to drain the fuel before shipping a generator?", "a": "Run the base tank down to near empty at minimum. Diesel adds roughly 7 lbs per gallon to the shipped weight, a full tank can push the load over legal gross, and sloshing fuel works against securement. Some receivers require the tank fully drained with documentation, so confirm before pickup day."}, {"q": "Can a generator ship on its side or on end?", "a": "No. Gensets ship upright on the base frame, period. Tipping one dumps oil and coolant where they don't belong, wrecks the vibration isolators, and can starve bearings on the next start. If height is the problem, the fix is a lower deck — step-deck or RGN — not laying the machine over."}, {"q": "Does the enclosure come off for transport?", "a": "Usually no. The enclosure protects the unit in transit and most are engineered to stay on. It ships separately only when total height can't be solved with a lower trailer, and that's a factory or millwright job — not something to improvise at the dock."}],
    related: [{"h": "Machinery Moving", "u": "../services/machinery-moving.html"}, {"h": "Transformer & Generator Rigging", "u": "../services/transformer-generator-rigging.html"}, {"h": "How to Transport a Transformer", "u": "how-to-transport-a-transformer.html"}, {"h": "Blocking, Bracing & Dunnage", "u": "blocking-bracing-and-dunnage-explained.html"}],
  },
  {
    slug: "freight-broker-vs-forwarder-vs-3pl",
    cat: "Freight & Trucking",
    hero: "brokerage-hero.jpg",
    date: "2026-07-03",
    title: "Freight Broker vs Freight Forwarder vs 3PL: What's the Difference?",
    desc: "Freight broker vs forwarder vs 3PL, in plain English: who arranges your freight, who takes possession of it, who runs your whole supply chain — and which you need.",
    dek: "Three roles that get used interchangeably and shouldn't be. Here's who does what — from the dispatch desk.",
    tldr: "A freight broker arranges transport by matching your load to a carrier — they never touch the freight. A freight forwarder takes possession of the goods, consolidates and re-ships them (the usual choice for international/ocean/air). A 3PL is broader: they run outsourced logistics — warehousing, fulfillment, and transport — as an ongoing partner. Broker for a load, forwarder to cross a border, 3PL to run your supply chain.",
    keywords: "freight broker vs freight forwarder, freight broker vs 3pl, 3pl vs freight broker, what is a freight forwarder, freight brokerage, logistics",
    body: "<p>\"Freight broker,\" \"freight forwarder,\" and \"3PL\" get thrown around like synonyms on quote requests every week. They're not. The difference comes down to one question: <strong>who takes possession of your freight, and how much of your logistics do they run?</strong></p>\n<h2>Freight broker: the matchmaker</h2>\n<p>A freight broker <strong>arranges the transport but never takes possession of the goods</strong>. They connect you (the shipper) with a carrier that has the right equipment, insurance, and lane — and handle the booking, the paperwork, the rate, and the coordination as a single point of contact. On specialized freight — heavy haul, oversize, sensitive equipment — a good broker earns their keep by knowing which carriers can actually run your load and handling the permits and escorts. The freight goes straight from your dock onto the carrier's truck; the broker orchestrates it.</p>\n<figure><img src=\"../assets/img/brokerage-dryvan.jpg\" alt=\"Freight trailers at a distribution yard illustrating brokered transport\" loading=\"lazy\" width=\"1200\" height=\"800\"><figcaption>A broker matches your load to the right carrier and coordinates the move — without ever taking possession of the freight.</figcaption></figure>\n<h2>Freight forwarder: takes possession</h2>\n<p>A freight forwarder <strong>takes possession of your goods</strong> and manages their movement — often consolidating multiple shipments, handling documentation, customs, and re-shipping. Forwarders are the standard for <strong>international freight</strong>: ocean and air, customs clearance, container consolidation, and the hand-offs between modes and borders. The key legal difference from a broker is that the forwarder handles the cargo itself rather than just arranging a carrier to.</p>\n<h2>3PL: runs your logistics</h2>\n<p>A third-party logistics provider (3PL) is the broadest of the three. A 3PL <strong>runs outsourced logistics as an ongoing partner</strong> — which can include warehousing, inventory, order fulfillment, and transportation management, not just a single move. Where a broker solves one load and a forwarder moves goods across a border, a 3PL is who a company hands its whole supply-chain operation to. Many 3PLs include brokerage and forwarding among their services.</p>\n<h2>Which one do you need?</h2>\n<ul>\n  <li><strong>Broker</strong> — you have freight to move (especially specialized, heavy, or oversized) and want someone to find the right carrier and run the move.</li>\n  <li><strong>Forwarder</strong> — your freight is crossing borders, going ocean or air, or needs consolidation and customs handling.</li>\n  <li><strong>3PL</strong> — you want to outsource ongoing logistics: warehousing, fulfillment, and transportation as a managed operation.</li>\n</ul>\n<p>Badass Logistics is none of the three: we're a rigging company that runs <a href=\"../services/project-freight.html\">project freight</a> for the jobs we rig — <a href=\"../services/machinery-moving.html\">machinery moves</a>, relocations, and installs — and a <a href=\"../services/truck-dispatch.html\">dispatch desk</a> for trucking fleets. Related reading: <a href=\"truck-dispatcher-vs-freight-broker.html\">dispatcher vs. freight broker</a>.</p>\n<div class=\"takeaways\"><h3>Bottom line</h3><ul>\n  <li>Broker: arranges transport, never touches the freight. Best for moving a load.</li>\n  <li>Forwarder: takes possession, consolidates, clears customs. Best for international.</li>\n  <li>3PL: runs outsourced logistics end to end — warehousing, fulfillment, transport.</li>\n  <li>The dividing line is possession of the goods and scope of what they manage.</li>\n</ul></div>\n<p>Need freight moved or an oversized load coordinated? <a href=\"../contact.html\">Send us the details</a> for a fast quote.</p>",
    faq: [{"q": "What is the difference between a freight broker and a freight forwarder?", "a": "A freight broker arranges transport by matching your load to a carrier but never takes possession of the goods. A freight forwarder takes possession of the freight, often consolidates it, handles documentation and customs, and re-ships it — which is why forwarders are the standard for international ocean and air freight."}, {"q": "Is a 3PL the same as a freight broker?", "a": "No. A freight broker arranges individual moves. A 3PL (third-party logistics provider) runs outsourced logistics as an ongoing partner — which can include warehousing, inventory, fulfillment, and transportation management. Many 3PLs offer brokerage as one of their services, but a broker is not a full 3PL."}, {"q": "Which do I need to move a piece of heavy equipment?", "a": "A freight broker — specifically one that handles heavy haul. For a domestic oversized or heavy load, a broker finds the carrier with the right trailer and insurance, and handles the permits, routing, and escorts. A forwarder is for international/multi-modal freight, and a 3PL is for outsourcing ongoing logistics operations."}],
    related: [{"h": "Truck Dispatcher vs Freight Broker", "u": "truck-dispatcher-vs-freight-broker.html"}, {"h": "LTL vs FTL Freight", "u": "ltl-vs-ftl-freight.html"}, {"h": "Get a Quote", "u": "../contact.html"}],
  },
  {
    slug: "how-to-move-a-boiler-or-chiller",
    cat: "Machinery Moving",
    hero: "loads/load-oversize-tank.jpg",
    date: "2026-07-03",
    title: "How to Move an Industrial Boiler or Chiller",
    desc: "How to move an industrial boiler or chiller: weight and rigging, roof and mechanical-room access, trailer choice, upright handling, and reconnection.",
    dek: "Big, heavy, and usually boxed into a mechanical room. Here's how boilers and chillers actually get moved.",
    tldr: "Boilers and chillers are heavy, awkward, and often installed in tight mechanical rooms or on roofs — so the rigging (getting it out) is the hard part, not the haul. Drain and disconnect, rig it out on skates or by crane, keep it upright, move it on a flatbed or step deck by weight and height, and set it for reconnection.",
    keywords: "how to move a boiler, how to move a chiller, industrial chiller transport, boiler rigging, mechanical room equipment moving, HVAC equipment transport",
    howto: {"name": "How to Move a Boiler or Chiller", "steps": [{"name": "Get weight, dimensions, and access", "text": "Pull the operating and dry weights and measure the unit, then measure the path out — doorways, corridors, roof access, and the crane picking point. Access usually decides the whole plan."}, {"name": "Drain, disconnect, and prep", "text": "Have the trades drain water and refrigerant per code, disconnect electrical, gas, and piping, and cap lines. Chillers hold refrigerant that must be recovered by a licensed tech before the unit moves."}, {"name": "Rig it out", "text": "Skate or gantry the unit through the mechanical room, or crane it off the roof. Rig from the frame or designated lift points, keep it level, and protect coils, tubes, and controls."}, {"name": "Load by weight and height", "text": "Flatbed or step deck for most units; a step deck buys height for a tall chiller. Keep the unit upright, block and brace the base, and chain to the frame, not the shell or coils."}, {"name": "Set and reconnect", "text": "Rig into the new mechanical room or roof pad, set level on its supports, and hand off to the trades for piping, electrical, refrigerant charge, and startup."}]},
    body: "<p>Boilers and chillers are classic rigging problems: heavy machines installed in the worst possible place to get something out of — a basement mechanical room, a penthouse, or a rooftop behind a screen wall. The truck is the easy part. Getting the unit out and the new one in is the job.</p>\n<h2>Access decides the plan</h2>\n<p>Before weight or trailer, the first question is <strong>how does it get out</strong>. A rooftop chiller usually comes off by crane — which means a lift plan, a pick point, and street or lot access for the crane. A basement boiler comes out on <strong>skates through corridors and up a ramp or freight elevator</strong>, or through a knocked-out wall panel. Measure the path to the inch: doorways, turns, ceiling height, floor ratings. Many of these units were set before the walls closed in, so the exit is tighter than the entrance ever was.</p>\n<figure><img src=\"../assets/img/loads/crating-shrink-wrap-electrical-equipment.jpg\" alt=\"Industrial mechanical equipment wrapped and prepped for a rigging move out of a plant room\" loading=\"lazy\" width=\"600\" height=\"800\"><figcaption>Coils, tubes, and controls get protected — the shell and fins carry nothing during the rig-out.</figcaption></figure>\n<h2>Drain, disconnect, recover</h2>\n<p>Before anything moves, the trades drain the water side, disconnect electrical, gas, and piping, and cap the lines. <strong>Chillers hold refrigerant</strong> that has to be recovered by a licensed technician before the unit travels — that's a code and environmental requirement, not an option. Getting these disconnects sequenced with the rigging crew keeps the move from stalling.</p>\n<h2>Rigging and transport</h2>\n<p>The unit gets rigged from its <strong>frame or designated lift points</strong>, kept level, and moved on air skates or by crane. Coils, fin tubes, gauges, and control panels are fragile — they get protected and never carry load. On the truck, most boilers and chillers ride a <strong>flatbed or step deck</strong> chosen by weight and height (a tall chiller wants the step deck's lower deck), <strong>upright</strong>, blocked and braced at the base, chained to the frame. This is the same <a href=\"../services/rigging.html\">rigging</a> and <a href=\"../services/machinery-moving.html\">machinery moving</a> discipline as any heavy plant equipment.</p>\n<h2>Set and reconnect</h2>\n<p>At the destination the unit is rigged into the mechanical room or onto the roof pad, set level on its supports, and handed back to the trades for piping, electrical, refrigerant charge, and startup. Level matters — a chiller or boiler that isn't sitting right on its supports can strain connections and mounts.</p>\n<div class=\"takeaways\"><h3>Bottom line</h3><ul>\n  <li>Access — roof crane or skate-out through the building — decides the whole plan.</li>\n  <li>Drain, disconnect, and recover refrigerant (licensed) before the unit moves.</li>\n  <li>Rig from the frame or lift points; protect coils, tubes, and controls.</li>\n  <li>Move upright on a flatbed or step deck by weight and height; set level for reconnection.</li>\n</ul></div>\n<p>Moving a boiler, chiller, or a whole mechanical room? <a href=\"../contact.html\">Send the unit specs and both site layouts</a> and we'll plan the rig-out, haul, and set.</p>",
    faq: [{"q": "How do you get a rooftop chiller down?", "a": "Usually by crane. That means a lift plan with a rated crane, a clear pick point, and street or lot access for the crane to set up. The chiller is rigged from its frame or lift points, kept level, and lowered to a trailer staged below. Basement units come out on skates instead."}, {"q": "Does the refrigerant have to be removed before moving a chiller?", "a": "Yes. Refrigerant must be recovered by a licensed technician before the unit is transported — it's a code and environmental requirement. This is sequenced with the disconnect and rigging work so the move doesn't stall waiting on it."}, {"q": "What trailer moves an industrial boiler or chiller?", "a": "Most ride a flatbed or step deck chosen by weight and height — a step deck's lower deck buys clearance for a tall chiller. The unit travels upright, blocked and braced at the base, and chained to the frame, never to the shell or coils."}],
    related: [{"h": "Machinery Moving", "u": "../services/machinery-moving.html"}, {"h": "Industrial Rigging", "u": "../services/rigging.html"}, {"h": "How to Ship a Generator", "u": "how-to-ship-a-generator.html"}, {"h": "Blocking, Bracing & Dunnage", "u": "blocking-bracing-and-dunnage-explained.html"}],
  },
  {
    slug: "how-to-move-a-milling-machine",
    cat: "Machinery Moving",
    hero: "loads/load-machine-loadout.jpg",
    date: "2026-07-03",
    title: "How to Move a Milling Machine (Bridgeport & Knee Mills)",
    desc: "How to move a milling machine: weight and top-heavy geometry, rigging points, ram and table prep, skating, air-ride transport, and re-leveling to spec.",
    dek: "Top-heavy and precise — a mill move is won at the rigging points and finished with a level. From the dispatch desk.",
    tldr: "Knee mills like a Bridgeport run 2,000–2,500 lbs and are top-heavy, so tipping is the risk. Lower the knee and retract the table, pull the vise and tooling, lift only from the ram or factory points, skate on a low centered load, ship precision mills air-ride, and re-level the base to spec before cutting.",
    keywords: "how to move a milling machine, bridgeport mill moving, knee mill transport, mill rigging, machinery moving, machine leveling",
    howto: {"name": "How to Move a Milling Machine", "steps": [{"name": "Document and weigh", "text": "Pull the weight and dimensions and find the factory lift points. A standard knee mill runs 2,000–2,500 lbs; larger bed and CNC mills run much heavier. Note that the head and ram put the weight up high."}, {"name": "Lower the knee and secure the table", "text": "Run the knee all the way down, retract the ram in, center and lock the table, and strap the head so nothing can shift. Remove the vise, chuck, tooling, and the DRO or pendant."}, {"name": "Rig from the ram or base", "text": "Sling under the ram with a spreader and softeners, or use the factory lifting points — never the table, ways, or dials. Keep the pick centered on the top-heavy geometry."}, {"name": "Skate it low and slow", "text": "Toe-jack and set skates under the base with the load centered, keep it low, plate over floor joints, and never side-load the machine to steer it. Top-heavy machines tip, they don't slide."}, {"name": "Ship air-ride and re-level", "text": "Precision and CNC mills ride air-ride, chained to the base and wrapped against weather. At the destination, level the base with a machinist level and requalify with a test cut before production."}]},
    body: "<p>A milling machine — a Bridgeport-style knee mill or a bigger bed or CNC mill — is a precision casting with a heavy head bolted up high. That geometry makes it top-heavy, and top-heavy machines tip when a move goes wrong. Here's how our crews keep them upright and cutting true.</p>\n<h2>Weight up high is the whole problem</h2>\n<p>A standard knee mill runs <strong>2,000 to 2,500 pounds</strong>; larger bed mills and CNC machining centers run far heavier. On any of them, the <strong>head, ram, and motor sit near the top</strong>, so the center of gravity is high and the machine wants to tip long before it wants to slide. Every lift, skate, and tie-down decision starts from that.</p>\n<figure><img src=\"../assets/img/loads/crating-shrink-wrap-electrical-equipment.jpg\" alt=\"Precision machine tool wrapped and prepped for a rigging move\" loading=\"lazy\" width=\"600\" height=\"800\"><figcaption>Vise, tooling, DRO, and pendant come off and ship separately — the ways and dials carry nothing.</figcaption></figure>\n<h2>Prep before it moves</h2>\n<p>Bring the weight down and lock everything: <strong>run the knee all the way down</strong>, retract the ram, center and lock the table, and strap the head so it can't shift on the road. Remove the vise, chuck, tooling, DRO, and pendant — they hang weight in the wrong places and shear off in transit. Coat the ways with way oil and wrap them.</p>\n<h2>Rig from the ram, never the ways</h2>\n<p>The safe pick is a <strong>sling under the ram</strong> with a spreader bar and softeners, or the machine's factory lifting points if it has them. Nothing bears on the table, the ways, the leadscrews, or the handwheels — those are the parts that make the machine worth moving. Keep the lift centered on the top-heavy geometry so it doesn't want to swing.</p>\n<h2>Skate, ship, and re-level</h2>\n<p>Inside the building, <strong>machinery skates</strong> under the base, load kept low and centered, moving slow with steel plate over any floor joint. On the truck, precision and CNC mills ride <strong>air-ride</strong> to keep road shock off the spindle and ways, chained to the base and wrapped against weather. At the destination it's not done until it's re-leveled: set the base, <a href=\"machine-leveling-and-alignment.html\">level it to the builder's spec</a>, and prove it with a test cut. This is the same discipline we run <a href=\"how-to-move-a-cnc-machine.html\">moving a CNC machine</a> or <a href=\"how-to-move-a-lathe.html\">a lathe</a>.</p>\n<div class=\"takeaways\"><h3>Bottom line</h3><ul>\n  <li>Knee mills are top-heavy — tipping, not sliding, is the failure mode.</li>\n  <li>Drop the knee, retract the ram, lock the table, and pull the vise and tooling.</li>\n  <li>Rig from the ram or factory points; nothing touches the ways or dials.</li>\n  <li>Air-ride for precision mills, then re-level to spec and test-cut before production.</li>\n</ul></div>\n<p>Moving a mill, a machine shop, or a full production floor? It's core <a href=\"../services/machinery-moving.html\">machinery moving</a> and <a href=\"../services/cnc-machine-movers.html\">CNC moving</a> work — <a href=\"../contact.html\">send the model and both floor layouts</a>.</p>",
    faq: [{"q": "How much does a Bridgeport milling machine weigh?", "a": "A standard Bridgeport-style knee mill runs roughly 2,000 to 2,500 pounds, with the head, ram, and motor concentrated near the top. Larger bed mills and CNC machining centers weigh considerably more. The high, top-heavy weight is why tipping is the main risk in a move."}, {"q": "Where do you lift a milling machine from?", "a": "From a sling under the ram with a spreader bar and softeners, or the machine's factory lifting points if it has them. Never lift by the table, the ways, the leadscrews, or the handwheels — those precision surfaces carry no load, and the pick stays centered on the top-heavy geometry."}, {"q": "Does a milling machine need re-leveling after a move?", "a": "Yes. Once the mill is set on its new floor, the base is leveled to the builder's specification with a machinist level and the machine is requalified with a test cut before production. A base that isn't level makes inaccurate parts with nothing visibly wrong."}],
    related: [{"h": "How to Move a CNC Machine", "u": "how-to-move-a-cnc-machine.html"}, {"h": "How to Move a Lathe", "u": "how-to-move-a-lathe.html"}, {"h": "Machine Leveling and Alignment", "u": "machine-leveling-and-alignment.html"}, {"h": "CNC Machine Movers", "u": "../services/cnc-machine-movers.html"}],
  },
  {
    slug: "how-to-transport-a-storage-tank",
    cat: "Specialized Rigging",
    hero: "loads/load-storage-tank.jpg",
    date: "2026-07-03",
    title: "How to Transport a Storage Tank or Pressure Vessel",
    desc: "How to transport a storage tank or pressure vessel: diameter-driven oversize permits, trailer and cradle choice, saddle support, escorts, and superload routing.",
    dek: "Diameter makes it oversize before it's even loaded. Here's how tanks and vessels move — from the dispatch desk.",
    tldr: "Tanks and vessels are oversize by diameter and often by length — so most are permitted loads. They ride cradled in saddles on a flatbed, step deck, or multi-axle trailer chosen by weight and height, secured against rolling, with permits and escorts in every state. Large-diameter vessels move as engineered superloads.",
    keywords: "how to transport a storage tank, pressure vessel transport, tank hauling, oversize tank shipping, vessel rigging, heavy haul tank",
    howto: {"name": "How to Transport a Storage Tank", "steps": [{"name": "Get diameter, length, and weight", "text": "Diameter drives width and height on the trailer, length drives permits and overhang, and weight drives the trailer and axle count. Empty and shipped weights both matter — tanks ship empty and purged."}, {"name": "Choose the trailer and deck height", "text": "Flatbed or step deck for smaller tanks, lowboy or multi-axle for large or heavy vessels. Deck height plus tank diameter has to clear 13'6\"–14' or the load is over-height and permitted."}, {"name": "Cradle and support in saddles", "text": "The tank rides in shaped saddles or cradles matched to its diameter so the round body can't roll and the shell isn't point-loaded. Nozzles, manways, and fittings get protected."}, {"name": "Secure against rolling", "text": "Chain or strap over the saddles and to the frame, block the ends, and protect the shell at every contact point. A round load that shifts is a runaway."}, {"name": "Permit, survey, and escort", "text": "Pull oversize permits for every state on the route, survey for low bridges and tight turns, and stage escorts by width and height. Large-diameter vessels route as superloads."}]},
    body: "<p>Storage tanks and pressure vessels are among the most common oversized loads on the road — and among the easiest to get wrong, because a round steel body doesn't sit still on a flat deck. Here's how tanks and vessels move.</p>\n<h2>Diameter makes it oversize</h2>\n<p>A tank's <strong>diameter drives both width and height</strong> on the trailer, and most process and storage vessels are wide enough that they're oversize the moment they're loaded. Length adds permit and overhang issues; weight decides the trailer and how many axles it needs. The legal envelope is 8'6\" wide, 13'6\"–14' tall (state-dependent), and 80,000 lbs gross — a mid-size vessel can bust all three. Tanks ship <strong>empty and purged</strong>; both the empty weight and the loaded height off the deck matter.</p>\n<figure><img src=\"../assets/img/loads/load-oversize-tank.jpg\" alt=\"Oversized storage tank cradled and secured on a trailer\" loading=\"lazy\" width=\"1200\" height=\"800\"><figcaption>The round body rides in shaped saddles so it can't roll and the shell isn't point-loaded.</figcaption></figure>\n<h2>Trailer and cradle</h2>\n<p>Smaller tanks ride a <strong>flatbed or step deck</strong>; large or heavy vessels move on a <strong>lowboy or multi-axle trailer</strong> that keeps the diameter under the height limit and spreads the weight. The critical piece is the support: the tank sits in <strong>shaped saddles or cradles matched to its diameter</strong>, so the round body is held from rolling and the shell isn't taking load on a single point. Nozzles, manways, and fittings get protected or removed.</p>\n<h2>Securement: stop the roll</h2>\n<p>A cylinder wants to roll, so securement is built around that: <strong>chains or straps over the saddles and down to the frame</strong>, end blocking, and shell protection at every contact point. This is textbook <a href=\"blocking-bracing-and-dunnage-explained.html\">blocking and bracing</a> — the cradles and blocking do the work, the tie-downs hold it against them.</p>\n<h2>Permits, escorts, and superloads</h2>\n<p>Because diameter usually breaks the width and height limits, tank moves are <strong>permitted in every state</strong>, with pilot cars added by width and a height-pole car for tall loads. Large-diameter columns and vessels — refinery and process equipment — move as engineered superloads with route surveys and bridge review. The <a href=\"../services/heavy-lift-rigging.html\">rigging at each end</a> matters just as much as the trip.</p>\n<div class=\"takeaways\"><h3>Bottom line</h3><ul>\n  <li>Diameter drives width and height — most tanks are oversize before they're loaded.</li>\n  <li>Ship empty and purged; cradle the tank in saddles matched to its diameter.</li>\n  <li>Secure against rolling — chains over the saddles, end blocking, shell protection.</li>\n  <li>Permits and escorts in every state; large vessels route as superloads.</li>\n</ul></div>\n<p>Moving a tank or vessel? Send the diameter, length, and weight and we'll spec the trailer, cradle, permits, and escorts — <a href=\"../contact.html\">get a quote</a>.</p>",
    faq: [{"q": "Why is a storage tank considered an oversize load?", "a": "Because its diameter usually exceeds the 8'6\" legal width and, combined with the deck height, the 13'6\"–14' height limit. Most process and storage vessels are oversize the moment they're loaded, which means permits and often escorts in every state on the route."}, {"q": "How is a round tank kept from rolling on a trailer?", "a": "It rides in shaped saddles or cradles matched to its diameter, chained or strapped over the saddles and down to the frame, with the ends blocked. The cradles and blocking hold the round body from rolling and spread the load so the shell isn't point-loaded."}, {"q": "Do storage tanks ship full or empty?", "a": "Empty and purged. Product weight would change the trailer and axle math and create a shifting-load hazard, and many contents can't legally travel in a tank being relocated. Both the empty shipping weight and the loaded height off the deck drive the trailer choice."}],
    related: [{"h": "Jacking, Skidding & Gantry Lifts", "u": "../services/heavy-lift-rigging.html"}, {"h": "Crane Service & Critical Lifts", "u": "../services/crane-services.html"}, {"h": "Blocking, Bracing & Dunnage", "u": "blocking-bracing-and-dunnage-explained.html"}, {"h": "Project Freight", "u": "../services/project-freight.html"}],
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
