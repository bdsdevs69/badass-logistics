module.exports = {
  slug: 'rigging-load-charts-explained',
  cat: 'Rigging',
  hero: 'rigging-crane.jpg',
  date: '2026-09-24',
  title: 'Crane Load Charts Explained: How to Read Capacity at Radius',
  desc: 'The number on the crane is not its capacity. Here is how to read a crane load chart, why capacity drops with radius, and where the deductions come from.',
  dek: 'The number painted on the boom is a model name, not a capacity. Here is how the chart actually decides what a crane can lift, and where the number on the page stops being the number on the hook.',
  tldr: 'A crane load chart lists rated capacity as a table, not one figure, because capacity changes with radius, boom length, and setup. To read it: find the chart page matching the crane\'s exact configuration, locate the operating radius, read the capacity at that row, then subtract the hook block and rigging weight for what the load can weigh. The number on the boom is a model name, not a rating.',
  keywords: 'crane load chart, how to read a load chart, crane capacity radius, crane capacity chart explained, crane chart deductions, load chart configuration',
  body: `
<p>Ask someone what a particular crane can lift and they will often point at the number stenciled on the boom — a 220-ton crane, a 300-ton crane — and treat that as the answer. It never is. That number is a model designation, roughly tied to the crane's maximum capacity under one specific, close-in, heavily counterweighted setup that almost never matches the job in front of it. The number that actually governs the lift lives in the load chart, and it changes by the foot.</p>

<h2>What is a crane load chart?</h2>
<p>A load chart is the table, published by the crane manufacturer, that states how much a specific crane can lift at a specific radius under a specific configuration. It is not one number — it is a grid, usually radius down one side and boom length or configuration across the top, with a rated capacity in each cell. The same crane can show a capacity of 150,000 pounds in one cell and 12,000 pounds in another, a few rows down, on the exact same machine.</p>
<p>Charts come in a few flavors depending on the crane type: outrigger charts for mobile and rough-terrain cranes (capacity varies by outrigger spread — full, mid, or minimum extension), counterweight-dependent charts for crawler and lattice-boom cranes, and charts that split by boom angle or jib configuration on tower and lattice cranes. Every one of them answers the same question — capacity at radius, for this setup — with a different set of variables governing which page or column applies.</p>

<h2>Why does capacity drop as radius increases?</h2>
<p>Because radius is a lever arm, and the crane's stability limit is a moment, not a weight. Picture the crane tipping about its front outriggers or crawler tracks. The load's weight times its horizontal distance from that tip line — the radius — is the overturning moment trying to tip the crane forward. The crane's own weight and counterweight, acting through their own distance behind the tip line, is the restoring moment holding it upright. As radius grows, the load's moment arm grows with it, so the same restoring moment can only balance a smaller weight. Move the load out from 20 feet to 40 feet and the capacity the chart allows can fall by half or more, with nothing about the crane itself having changed.</p>
<p>On larger cranes at longer radius, a second limit can take over before tipping does: structural capacity of the boom itself. The chart accounts for both and simply publishes whichever number is lower for that radius — the operator reading it does not need to know which limit is governing, only that the number in the cell is the ceiling either way.</p>

<h2>What is radius, exactly, and where is it measured from?</h2>
<p>Radius is the horizontal distance from the crane's center of rotation — its axis of rotation, not the edge of the machine or the base of the boom — out to the vertical hook line where the load hangs. It is not the boom length, and it is not the distance from the cab. On a self-propelled crane that center is roughly the middle of the turntable; on a crawler crane it is the center of the rotating bed. Get this wrong by even a few feet on a lift running near the top of the chart and the error can be the difference between a legal pick and an overload, because capacity is falling fastest in exactly that zone.</p>

<h2>How do you actually read the chart for a lift?</h2>
<ol>
  <li><strong>Confirm the crane's exact configuration.</strong> Outrigger spread (full, mid, minimum), counterweight installed, boom length, and jib or fly extension if rigged. The chart page for full outriggers and maximum counterweight is a different document from the one for a crane set up on a tighter footprint — using the wrong page is the single most common load chart mistake.</li>
  <li><strong>Establish the working radius.</strong> Not just at pick-up — check radius at the pick point, at every point along the swing path, and at the set-down point. The worst-case radius along that whole path is the one that governs, not the closest one.</li>
  <li><strong>Read down to that radius row, across to the configuration column.</strong> The number in that cell is the crane's rated gross capacity at that radius and setup — the maximum the hook can carry, including everything hanging from it.</li>
  <li><strong>Subtract deductions</strong> for the hook block, headache ball, any load block, slings, shackles, spreader or lifting beam, and — on charts that require it — the boom and jib's own weight. What remains after those deductions is the net capacity: what the actual load, the piece of equipment itself, is allowed to weigh.</li>
  <li><strong>Recheck every point of the swing</strong>, not just the pick. A crane can clear its chart at the pick point and still be short at the setting radius if the load has to travel outward to land.</li>
</ol>

<h2>What counts as a chart deduction, and why does it matter?</h2>
<p>Gross capacity, the number printed in the chart cell, is what the boom tip and hook can carry in total. It is not what the load itself can weigh. Everything between the boom tip and the load — hook block, headache ball, slings, shackles, spreader bar or lifting beam, and any below-the-hook rigging — has its own weight, and that weight comes out of the chart number before the load gets a share of it.</p>
<div class="keyfacts">
  <h3>Common deductions from gross chart capacity</h3>
  <ul>
    <li><strong>Hook block or headache ball</strong> — can run from a few hundred pounds to several tons on larger cranes</li>
    <li><strong>Slings and rigging hardware</strong> — shackles, spreader or lifting beams, softeners</li>
    <li><strong>Auxiliary or whip line</strong> if rigged and not in use for the pick</li>
    <li><strong>Jib or fly section weight</strong>, on charts where it is not already built into the base rating</li>
    <li><strong>Load handling devices</strong> — a spreader beam or below-the-hook attachment that is part of the rigging, not the load</li>
  </ul>
  <p>Net capacity is what remains for the equipment being lifted. A chart cell reading 40,000 pounds with a 1,200-pound hook block and 800 pounds of rigging leaves 38,000 pounds for the load itself — not 40,000. On a lift running close to the chart limit, skipping this step is exactly how a plan that looks fine on paper comes up short at the hook.</p>
</div>

<h2>Do outriggers and counterweight change which chart applies?</h2>
<p>Yes, and this is where charts get misread most often on mobile and rough-terrain cranes. A single crane model carries multiple outrigger charts — full extension, mid extension, minimum extension, and sometimes on-tires — because each outrigger spread gives the crane a different, smaller base to resist tipping against. A crane set up with outriggers only partially extended, because the site does not have room for full spread, is operating under a lower-capacity chart at every radius, not a derated version of the full-spread chart by some rule of thumb. There is no shortcut calculation — the correct chart page for the actual footprint the crane is sitting on is the only one that applies.</p>
<p>Counterweight works the same way on crawler and lattice-boom cranes. Every counterweight configuration the manufacturer publishes has its own chart, because counterweight is part of the restoring moment discussed above — more counterweight, more capacity at the same radius, but also more ground bearing pressure under the crane, which is its own separate check.</p>

<h2>What else on the chart limits a lift besides tipping?</h2>
<p>Wind, boom angle, and structural limits on the boom itself all appear on or alongside the chart, and any one of them can be the governing limit before tipping capacity is even reached. Manufacturers publish maximum wind speed by boom length and configuration, because a longer boom catches more wind load and loses stability faster than the chart's static numbers alone suggest. Working radius near the crane's structural boom limit — long boom, long radius — can hit that structural ceiling before the tipping-based capacity would. And multi-part reeving (the number of parts of line on the hook) has its own capacity limit tied to wire rope strength, separate from the crane's tipping chart entirely. A real lift plan checks all of these, not just the radius-versus-capacity row.</p>

<h2>Who is responsible for reading the chart correctly?</h2>
<p>The lift plan should show the chart page used, the radius at every point of the lift, and the net capacity after deductions — in writing, before the load leaves the ground, not worked out from memory once the crane is already set up. On a routine pick well inside the chart's margin, an experienced operator reading it correctly is often enough. On anything running close to rated capacity — the kind of lift that crosses into <a href="what-is-a-critical-lift.html">critical lift</a> territory — that arithmetic belongs on paper, reviewed before the crane rigs, because a chart-reading error at high utilization has no margin to absorb it.</p>

<div class="takeaways">
  <h3>Bottom line</h3>
  <ul>
    <li>The number on the crane's boom is a model name, not a capacity. The chart, not the paint, sets what the crane can lift.</li>
    <li>Capacity is a table, not a figure — it changes with radius, boom length, outrigger spread, and counterweight.</li>
    <li>Capacity falls as radius increases because tipping is governed by moment, not weight, and the load's lever arm grows with distance.</li>
    <li>Gross chart capacity is not net capacity. Hook block, rigging, and any load-handling gear come off the top before the load gets a number.</li>
    <li>Check radius at every point of the swing, not just the pick — the worst point along the path is the one that governs.</li>
  </ul>
</div>

<p>Reading a chart correctly is one part of a real lift plan — the crane configuration, ground bearing, and rigging deductions all have to line up before anything leaves the ground. See our <a href="../services/crane-services.html">crane and rigging services</a>, or <a href="../services/heavy-lift-rigging.html">jacking, skidding, and gantry lifts</a> when the job does not need a crane at all.</p>
`,
  faq: [
    { q: 'How do you read a crane load chart?', a: 'Confirm the crane\'s exact configuration (outrigger spread or counterweight, boom length), find the operating radius on the chart, read the rated capacity in that cell, then subtract the weight of the hook block, slings, and rigging hardware to get net capacity — what the load itself can weigh. Check this at every point along the swing path, not just at pick-up.' },
    { q: 'Why does crane capacity decrease as radius increases?', a: 'Because a crane\'s stability limit is a tipping moment, not a fixed weight. The load\'s weight acts through a lever arm equal to the radius, and as that radius grows, the same restoring moment from the crane\'s counterweight can only balance a smaller load. On longer booms at long radius, structural limits on the boom can also become the governing number.' },
    { q: 'What is the difference between gross and net crane capacity?', a: 'Gross capacity is the number printed in the load chart cell — the total the boom tip and hook can carry. Net capacity is what remains for the actual load after subtracting the weight of the hook block, slings, shackles, spreader or lifting beam, and any other rigging hanging below the hook. Deductions are what most people skip when a chart reading goes wrong.' },
    { q: 'Does outrigger spread change which load chart applies?', a: 'Yes. Mobile and rough-terrain cranes publish a separate chart for each outrigger extension — full, mid, and minimum spread — because each spread gives the crane a different base to resist tipping. A crane set up on partial outriggers is operating under that lower-capacity chart at every radius, not a rough estimate of the full-spread chart.' },
    { q: 'Where is crane radius measured from?', a: 'From the crane\'s center of rotation — the axis the upper structure swings around — out to the vertical hook line where the load hangs. It is not the boom length and not the distance from the operator\'s cab. Radius grows through the swing as the load moves, so it has to be checked at the pick point, along the path, and at the set point.' },
  ],
  related: [
    { h: 'Crane &amp; Rigging Services', u: '../services/crane-services.html' },
    { h: 'What Is a Critical Lift?', u: 'what-is-a-critical-lift.html' },
    { h: 'Crane Rental vs Rigging Company', u: 'crane-rental-vs-rigging-company.html' },
    { h: 'Jacking, Skidding &amp; Gantry Lifts', u: '../services/heavy-lift-rigging.html' },
  ],
};
