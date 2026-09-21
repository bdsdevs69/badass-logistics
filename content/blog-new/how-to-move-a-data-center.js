module.exports = {
  slug: 'how-to-move-a-data-center',
  cat: 'Rigging',
  hero: 'loads/enclosed-trailer-machinery-loaded.jpg',
  date: '2026-09-21',
  title: 'How to Move a Data Center: Rack Sequencing and Rigging',
  desc: 'How a data center relocation actually runs: de-stack vs roll-out racks, floor tile ratings, ramps, shock monitoring, and sequencing against the migration window.',
  dek: 'The servers are the easy part of the inventory and the hardest part of the schedule. Here is how the rigging side of a data center move actually sequences.',
  tldr: 'A data center move runs the IT migration and the physical rigging on one shared schedule, not two separate ones. Racks either roll out loaded on casters over floor rated for that rolling load, or get de-stacked and shipped empty — the call is made on weight, floor rating, and shock tolerance, not convenience. Everything sequences backward from the cutover window, and redundant pairs never move together.',
  keywords: 'data center relocation, server rack moving, data center rigging, how to move a data center, rack roll-out, data center migration logistics',
  body: `
<p>A data center move gets planned twice, by two people who rarely talk early enough. IT plans the migration: what gets imaged, what fails over, what the cutover window looks like. Facilities plans the physical move: what leaves the floor, how it travels, and what it takes to get it out the door without cracking a raised floor tile or shock-loading a chassis that was fine an hour ago. Both plans have to land on the same calendar, or the migration window closes with half the racks still on a dock.</p>

<h2>Should racks roll out loaded or get de-stacked first?</h2>
<p>It depends on the rack's weight and the floor and route between it and the truck — there is no default answer. A loaded 42U rack of blade servers and switches can run well past a thousand pounds on four small casters, and every inch of raised floor, ramp, and dock plate along its path has to be rated for that concentrated point load, not just the average load of the room. If the path clears — rated tile, a bridge over any threshold, a ramp that isn't steeper than the casters can handle, and a dock leveler rated for the weight — rolling a loaded rack out is faster and touches the gear inside less. Every connection stays made, nothing gets re-seated, and the vendor doesn't have to re-verify individual units on the other end.</p>
<p>De-stacking is the fallback when the path doesn't clear, or when the gear itself won't tolerate the ride. Storage arrays with spinning media, older UPS strings, and anything the OEM flags as shock-sensitive usually come out unit by unit, get boxed or crated, and travel braced rather than rolling on their own wheels. De-stacking also lets a crew split a rack's weight across a hand truck and a pallet instead of concentrating it on four casters crossing a floor that was never rated for it. The trade is time and touch: every unit gets disconnected, labeled, and reconnected, which is exactly the handling a roll-out avoids.</p>
<p>Most moves end up mixed — the racks on a clear, rated path near the loading area roll out loaded, and the ones behind a ramp, a narrow doorway, or a floor section that won't take the point load get de-stacked. That decision gets made room by room during the survey, not assumed for the whole hall.</p>

<h2>How is raised floor rated for rolling equipment?</h2>
<p>Raised floor tiles carry two different numbers that both matter here: a static load rating for something sitting still, and a much lower rolling or concentrated load rating for something moving across the tile on small wheels. A tile that easily holds a rack sitting in place for years can still fail under the same rack's weight concentrated onto four caster wheels crossing it, because rolling load spreads the weight over a tiny contact patch instead of the tile's full surface.</p>
<p>Before anything rolls, the path gets walked tile by tile against the manufacturer's rolling load rating, not the static one. Anywhere the rated load is close to or under the equipment's per-caster weight, steel plate or plywood bridging goes down first to spread the load across multiple tiles and the stringer grid underneath, not just the one tile under the wheel. Pedestal condition matters as much as the tile itself — a loose or corroded pedestal under a plated path fails before the tile does. Cutouts for cabling, perforated tiles for airflow, and any tile that's been swapped or shimmed get flagged and either avoided or plated over, because those are exactly where a caster finds the one weak point in an otherwise rated floor.</p>

<h2>How do you ramp equipment off a raised floor?</h2>
<p>With a ramp rated for the load and shallow enough that the casters don't bind or the rack doesn't tip. Raised floors typically sit a few inches above slab, which sounds trivial until a loaded rack meets that step edge-on. A ramp that's too steep concentrates the entire rack's weight onto the leading edge of the casters at the transition point — the same failure mode as an unrated tile, just compressed into a two-foot run. Ramps get sized to the height difference and load, secured so they can't shift under a rolling load, and the transition at both ends gets checked for any lip or gap a small caster wheel can catch.</p>
<p>Where the raised floor height varies across the hall — common in older facilities that were built out in phases — the ramp plan isn't one ramp for the room, it's a ramp and a route matched to each transition the equipment actually crosses.</p>

<h2>How is shock monitored during a data center move?</h2>
<p>With shock indicators or loggers attached to the rack or the individual unit before it leaves its position, read at delivery, and kept as part of the record the receiving team signs off against. Spinning-media storage, older UPS battery strings, and switching gear with backplane connectors are the equipment classes that fail quietly from an impact nobody flagged — the unit powers up, then drops out under load a week later. A shock log that stays under the OEM's threshold the whole trip is the evidence that lets the vendor sign off on bringing it back into production without a full re-verification.</p>
<p>The monitoring matters as much for loaded rolling moves as it does for equipment that ships between buildings on <a href="../services/data-center-rigging.html">a rigging crew's</a> skates or a truck. A rack that rolls smoothly across a hallway can still take a harder hit going over a threshold than it would on a longer, smoother highway run — shock isn't a function of distance, it's a function of the worst single event in the whole path.</p>

<h2>How do you sequence a data center move against a migration window?</h2>
<p>Backward from the cutover, not forward from the day the movers show up. The migration window — the hours where a service, an application tier, or an entire site is allowed to be down — is set by the business, and everything physical has to fit inside it or the schedule slips to the next available window, which on a live production system might be weeks out. Working backward means listing, for every rack that has to move: when it can be taken offline, how long de-racking or roll-out takes, transit time, how long it takes to re-rack and reconnect at the destination, and how long the vendor needs to bring it back into service and verify it. Add those up and compare the total against the window — if it doesn't fit, either the scope for that window shrinks or the rack gets split into a phase that isn't gated by that particular cutover.</p>
<p>The sequence inside the room also matters. Racks with cross-connects to gear that's staying put move last, so the dependency chain isn't broken any earlier than it has to be. Redundant pairs — two halves of an N+1 or 2N system — never move in the same window; one side stays live while the other relocates, and it only trades places once the moved half is verified back online. That single rule is what keeps a data center move from turning a planned maintenance window into an actual outage.</p>

<h2>What has to be ready at the destination before racks arrive?</h2>
<p>Power, cooling, and network at the exact same rack positions the migration plan assumes — not close, not "coming online this week." A rack that arrives to a PDU that isn't terminated, a CRAH unit that hasn't been commissioned, or network drops that aren't labeled to the same naming convention as the source site sits idle in the new hall, which both blocks the floor for the next phase and pushes the cutover the physical move was supposed to hit. Floor tile in the new space gets the same rolling-load check as the origin, cored for anchors where the layout calls for it, and any raised-floor height mismatch between old and new facility gets resolved with ramps sized in advance rather than improvised on delivery day.</p>
<p>For a phased build-out, or when generators, switchgear, and cooling units are still landing on a schedule tied to construction rather than IT, that receiving and staging work runs as its own coordinated phase — see <a href="../services/data-center-rigging.html">data center rigging</a> for how the infrastructure side of a new-build or retrofit sequences separately from the rack moves.</p>

<h2>What causes the most delay on data center relocations?</h2>
<p>A floor rating nobody checked, a redundant pair moved in the same window, and a destination that wasn't actually ready. The first shows up as a caster punching through a tile or a ramp failing mid-roll — always avoidable with a survey done tile by tile instead of by room average. The second turns a planned migration into an unplanned outage, because the whole point of redundancy was that one half stays live. The third is the quiet one: racks sitting crated in a corridor because the PDU wasn't terminated, aging past their shock-indicator window while the schedule burns. None of these are rigging failures in the sense of dropped equipment — they're planning failures that show up as a missed migration window.</p>

<div class="keyfacts">
  <h3>Data center move checklist</h3>
  <ul>
    <li>Roll-out vs de-stack decided per rack, based on weight, path, and shock tolerance — not by default</li>
    <li>Raised floor checked against its rolling/concentrated load rating along the actual path, not the static rating</li>
    <li>Plating or bridging placed over any tile, cutout, or pedestal below the required rating</li>
    <li>Ramps sized to height and load at every raised-floor-to-slab transition</li>
    <li>Shock indicators on before de-racking, read and logged at delivery</li>
    <li>Migration window mapped backward: offline time, transit, re-rack, vendor verification, all inside the cutover</li>
    <li>Redundant pairs never moved in the same window</li>
    <li>Destination power, cooling, and network live and labeled at the exact rack positions before delivery</li>
  </ul>
</div>

<div class="takeaways">
  <h3>Bottom line</h3>
  <ul>
    <li>Roll loaded racks only where the path is rated for the rolling load, not just the room's static rating.</li>
    <li>De-stack when the path doesn't clear or the gear won't tolerate transit.</li>
    <li>Ramp every raised-floor-to-slab step; that transition is where casters and unrated tiles both fail.</li>
    <li>Shock-log everything that rolls or ships, and keep the record for the vendor's sign-off.</li>
    <li>Sequence backward from the migration window, and never move both halves of a redundant pair at once.</li>
  </ul>
</div>

<p>Moving a hall, a phase, or a single row of racks against a live migration window? That's <a href="../services/data-center-rigging.html">data center rigging</a> for the racks, generators, and switchgear, alongside <a href="../services/lab-equipment-movers.html">lab and precision equipment moving</a> where the destination also holds vibration-sensitive test or research gear. Freight between sites moves through our licensed broker and carrier partners on air-ride equipment. Send the rack schedule, the floor plans, and your migration window and we'll build the sequence — <a href="../contact.html">start here</a>.</p>
`,
  faq: [
    { q: 'Should server racks be moved loaded or unloaded?', a: 'It depends on the rack\'s weight against the floor rating and path, not on convenience. A loaded rack rolls out on its own casters when the raised floor, ramps, and dock along the route are rated for that concentrated rolling load and the gear inside tolerates the ride. When the path doesn\'t clear, or the equipment is shock-sensitive, the rack gets de-stacked, boxed or crated, and reassembled at the destination.' },
    { q: 'How do you know if a raised floor can take a rolling rack?', a: 'Check the tile\'s rolling or concentrated load rating, not its static rating — a floor that holds a stationary rack for years can still fail under the same weight on four small caster wheels. The path gets walked tile by tile, and any tile, cutout, or pedestal below the rack\'s per-caster load gets plated or bridged before anything rolls.' },
    { q: 'How is shock monitored on a data center move?', a: 'Shock indicators or loggers are attached to the rack or unit before it leaves its position and read at delivery. The log becomes part of the record the vendor checks before signing off on bringing the equipment back into service without a full re-verification.' },
    { q: 'How do you plan a data center move around a migration cutover?', a: 'By working backward from the window: list offline time, de-racking or roll-out time, transit, re-rack time, and vendor verification for every rack, then compare the total to the window length. If it doesn\'t fit, the scope for that window shrinks rather than the plan getting compressed on the day.' },
    { q: 'Can you move one half of a redundant system while the other stays live?', a: 'That\'s the point of sequencing a redundant pair correctly — one half stays live while the other relocates, and it only trades places once the moved half is verified back online. Moving both halves of an N+1 or 2N pair in the same window turns a planned move into an unplanned outage.' },
    { q: 'What has to be ready at the new site before racks arrive?', a: 'Power, cooling, and network live, terminated, and labeled at the exact rack positions the migration plan assumes, plus a floor checked for the same rolling-load rating as the origin. Racks that arrive to an unfinished destination sit idle in the new hall and block the next phase.' },
  ],
  related: [
    { h: 'Data Center Rigging', u: '../services/data-center-rigging.html' },
    { h: 'Lab & Precision Equipment Movers', u: '../services/lab-equipment-movers.html' },
    { h: 'Switchgear & Substation Equipment Moving', u: 'switchgear-and-substation-equipment-moving.html' },
    { h: 'What Is a Critical Lift?', u: 'what-is-a-critical-lift.html' },
  ],
};
