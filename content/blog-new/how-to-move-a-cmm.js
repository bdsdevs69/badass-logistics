module.exports = {
  slug: 'how-to-move-a-cmm',
  cat: 'Machinery Moving',
  hero: 'loads/white-glove-crated-equipment-delivery.jpg',
  date: '2026-09-23',
  title: 'How to Move a CMM: Granite Table & Air Bearing Care',
  desc: 'How to move a coordinate measuring machine: granite table lifting, air bearing protection, shock monitoring in transit, environment, and requalification.',
  dek: 'A CMM measures in microns, and it will tell on a bad move whether anyone asks it to or not. Here is what the granite, the air bearings and the shock log actually need.',
  tldr: 'Moving a CMM safely means lifting the granite table only from its designated points, locking the carriage before the air bearing supply is disconnected, and running a shock or tilt logger the entire trip. After reinstall, on a temperature-stable, isolated floor, the OEM or an accredited calibration lab requalifies the machine — checking volumetric accuracy, straightness and probing repeatability — before it measures a part again.',
  keywords: 'cmm moving, coordinate measuring machine relocation, granite cmm rigging, cmm air bearing, cmm shock monitoring, cmm recalibration after move',
  body: `
<p>Most of what moves through a plant survives a rough ride better than the spec sheet admits. A CMM does not. It is, on most floors, the single most shock-sensitive asset in the building — more sensitive than the mill it inspects parts from, because the mill's job is to remove metal and the CMM's job is to measure that removal to a few microns. The granite it sits on, the air film its carriage rides on, and the calibration behind every reading it has ever produced are all things a careless lift can undo in about four seconds.</p>

<p>None of that makes a CMM move exotic. It makes it a rigging job where the sequence matters more than the muscle, and where three things — the granite, the carriage, and the paperwork that proves the machine still measures true — decide whether the CMM comes back online in a day or sits idle for a month waiting on a repair.</p>

<h2>Why is a CMM harder to move than a machine tool of similar size?</h2>
<p>Because its accuracy lives in a stone surface and an air film, not in a structural frame that shrugs off a bump. A vertical mill or a lathe has mass and stiffness working in its favor — a jolt in transit gets absorbed by the casting and shows up, if at all, as a need to re-check the level. A CMM's granite base has no give in the direction that matters: it is dimensionally stable and vibration-damping precisely because it does not flex, which also means it cannot absorb a shock the way iron does. It transmits it, straight into the surface flatness the whole machine depends on.</p>
<p>Add to that a moving carriage riding on a film of air a fraction of a hair's width thick, a probing system with its own repeatability spec, and a calibration certificate that is only valid for the exact geometric state the machine was in when it was issued, and the picture is clear: a CMM move is a metrology job with rigging attached, not the other way around.</p>

<h2>How do you lift and rig the granite table without cracking it?</h2>
<p>From the lifting points the builder designed into the base — cast-in eyes, forklift pockets, or a specified sling pattern — and nowhere else. Granite is strong in compression and almost no help in tension or impact. It carries the machine's weight fine sitting still; it does not tolerate being picked from an edge, dragged, or set down hard, because granite does not dent or bend under a bad lift the way steel does. It chips, and past a certain depth a chip in the working surface is not a repair — it is a replacement table.</p>
<p>That changes the handling in practical ways. The base gets picked level, with rigging that loads all points evenly rather than one corner taking weight first. Where the manufacturer specifies air skates or a machinery dolly for short in-building moves, that is what gets used instead of forks under an unsupported edge. And true weight gets pulled from the machine's data plate or spec sheet rather than estimated — granite is heavy for its footprint, more than people expect looking at it, and undersizing the lift gear on a guess is a common way these get dropped.</p>

<figure>
  <img class="post-img" src="../assets/img/loads/white-glove-crated-equipment-delivery.jpg" alt="Crated precision equipment staged for white-glove delivery" loading="lazy" width="800" height="600">
  <figcaption class="hand" style="font-size:16px;opacity:.8;">The granite travels crated and cushioned; the carriage travels parked and locked.</figcaption>
</figure>

<h2>What are air bearings and why do they need protecting before the machine moves?</h2>
<p>Air bearings are what let the CMM's carriage glide along the granite ways with essentially zero friction — a film of compressed air a few microns thick separates the bearing pads from the stone, so the axis moves without the metal-on-stone contact that would wear both surfaces and introduce drag error into every reading. That film only exists while the air supply is pressurized and clean. The moment air pressure is lost with the carriage unsupported, the bearing pads settle onto the granite, and a carriage that gets nudged or that drifts on residual momentum in that state can gouge the way surface — a scratch on the granite is the same failure as a chip, permanent and expensive.</p>
<p>So before the machine is touched, the carriage gets driven to its parked or home position, and the machine's transport locks or shipping blocks go in per the OEM manual — most builders publish a specific pre-move procedure for exactly this. Only after the axes are mechanically secured does the air supply get disconnected and the fittings capped. On reinstall, that sequence runs in reverse: air pressure comes back on before the transport locks come out, never after.</p>

<h2>Does a CMM need shock monitoring in transit?</h2>
<p>Yes, on any move that matters — the manufacturers that build these machines routinely require it. A tilt-and-shock indicator or a logged triaxial accelerometer travels attached to the crate or the base itself for the entire trip, not just the truck leg. Most builders publish a maximum recorded g-force — commonly a low single-digit number — above which the machine is treated as suspect and gets inspected before it runs again, regardless of how it looks on the outside.</p>
<p>That data logger is not a formality. It is the evidence that decides, after the fact, whether an unexplained accuracy problem three weeks later traces back to the move or to something else entirely. Loading it, orienting it correctly, and pulling the log at the destination before the crate is even opened is standard practice on a CMM move and worth confirming with whoever built the machine before it ships, since thresholds vary by model.</p>

<div class="keyfacts">
  <h3>What the site walk has to capture</h3>
  <ul>
    <li>Granite base weight and designated lift points from the OEM manual, not estimated</li>
    <li>Carriage type and axis travel — bridge, gantry, horizontal-arm or portable-arm — and its transport-lock procedure</li>
    <li>Air bearing supply requirements: filtration spec and pressure, for reconnection at the new site</li>
    <li>Manufacturer's shock threshold and the data logger to be used for the trip</li>
    <li>Floor and foundation at the destination: isolation, stiffness, and distance from vibration sources</li>
    <li>Room temperature control and current calibration certificate, to compare against post-move requalification</li>
  </ul>
</div>

<h2>What environment does a CMM need at the new site before it goes back to work?</h2>
<p>A stable, controlled one — temperature above almost everything else. CMM accuracy specs are written against a reference temperature, usually near normal room temperature, with a tolerance measured in a fraction of a degree, because the granite base and the machine's own structure expand and contract with heat exactly enough to matter at micron-level measurement. A room that swings with the HVAC cycle, sits near a bay door, or gets direct sun through a window will not hold a CMM's spec even if every other part of the move went perfectly.</p>
<p>Vibration is the second variable. Many CMMs, especially larger bridge and gantry machines, sit on pneumatic isolators or a dedicated isolated foundation specifically to decouple the machine from floor-borne vibration — a forklift aisle, a stamping press, or a compressor pad nearby will show up in the readings if the isolation is inadequate or the machine lands too close to the source. Humidity control matters too, mostly to protect the granite's long-term stability and the electronics, and it is worth confirming the new room meets the same spec the old one did rather than assuming any climate-controlled space is close enough.</p>
<p>Give the machine time to soak at the new location's ambient temperature before anything is measured on it — hours, not minutes, is typical guidance from most builders, longer if the machine traveled any real distance or sat in an unconditioned trailer. This is the same discipline covered for any tolerance-sensitive tool in <a href="machine-leveling-and-alignment.html">machine leveling and alignment</a>, just with a tighter tolerance band than most machine tools ever see.</p>

<h2>Does a CMM need to be recalibrated after a move?</h2>
<p>Yes — every move invalidates the existing calibration certificate, because that certificate describes the machine's geometric performance in one specific location, on one specific foundation, at one specific point in time. Once the machine has been lifted, transported and reset, that data no longer applies even if nothing visibly changed. What happens next is a requalification, performed by the OEM's field service or by an accredited calibration lab, not by the rigging crew.</p>
<p>That process typically checks volumetric accuracy across the full measuring envelope using a laser interferometer, a certified step gauge, or a ball bar, along with axis straightness, squareness between axes, and probing system repeatability. Results get compared against the manufacturer's published tolerance for that model, and a new calibration certificate is issued once the machine passes — that certificate, not a visual inspection, is what actually confirms the CMM is fit to sign off parts again. Building that requalification window into the project schedule up front avoids the common mistake of planning the move date around production needs and forgetting the machine cannot measure anything certifiable until the cal lab has been through it.</p>

<h2>How does a CMM ship between buildings or across town?</h2>
<p>Crated, cushioned and on a controlled ride, with the granite base and carriage secured exactly as described above before the crate closes. Portable and articulated-arm CMMs travel in their factory cases with the arm locked in its stowed position; bridge, gantry and horizontal-arm machines get custom crating sized to the base, with the probe, ram and any removable components crated separately from the structure they came off. Climate and shock exposure both matter more here than on a typical machine tool move, so transport between sites runs through our licensed broker and carrier partners on an enclosed, air-ride trailer rather than an open deck, with the shock logger riding attached the whole way.</p>

<div class="takeaways">
  <h3>Bottom line</h3>
  <ul>
    <li>Lift the granite only from the OEM's designated points — it chips and cracks under a bad lift, it does not dent or forgive one.</li>
    <li>Park and lock the carriage before the air bearing supply is disconnected, so it cannot drag metal against stone with no air film.</li>
    <li>Run a shock or tilt data logger for the entire trip and pull the log before the crate opens at the new site.</li>
    <li>The destination room needs temperature stability and vibration isolation before the machine goes back to work, not after.</li>
    <li>Requalification by the OEM or an accredited calibration lab — volumetric accuracy, straightness, squareness, probing repeatability — is what actually clears the machine to measure parts again, not a visual check.</li>
  </ul>
</div>

<p>Moving a CMM, a metrology lab, or an inspection department alongside the machine shop it supports? That is <a href="../services/machinery-moving.html">machinery moving</a> handled with the same discipline as any other precision asset, and it overlaps with <a href="../services/lab-equipment-movers.html">lab equipment moving</a> whenever the job crosses into a dedicated metrology or quality lab. Send the model, the granite dimensions and the room layout and we will build the plan — <a href="../contact.html">start here</a>.</p>
`,
  faq: [
    { q: 'Can a CMM be lifted with straps or chains around the granite base?', a: 'No. Granite is strong in compression but has almost no tolerance for tension or impact loading at an unsupported edge, so it gets lifted only from the cast-in eyes, forklift pockets or sling points the manufacturer designed into the base. Chains or straps wrapped around an edge concentrate load exactly where granite is weakest, and the failure mode is a chip or crack in the working surface, not a bend that can be corrected.' },
    { q: 'What happens if a CMM carriage moves without air pressure to the bearings?', a: 'The bearing pads settle onto the granite ways with no air film between them, and any movement in that state drags metal against stone. That gouges the way surface, which is a permanent accuracy loss, not something that polishes out. That is why the carriage is driven to its parked position and mechanically locked before the air supply is capped, and why air pressure is restored before the locks come out on reinstall.' },
    { q: 'Do CMMs really need a shock data logger during transport?', a: 'Yes, and most manufacturers specify it as standard practice for a reason: a tilt-and-shock indicator or a logged accelerometer is the record that proves whether an accuracy problem discovered weeks later traces back to the move. Most builders publish a maximum recorded g-force above which the machine gets inspected before use regardless of how it looks, so the logger travels with the machine for the entire trip, not just the truck leg.' },
    { q: 'Why does temperature control matter so much for a CMM after a move?', a: 'Because CMM accuracy specs are written against a reference temperature with a tolerance measured in a fraction of a degree — the granite base and the machine structure both expand and contract enough at normal HVAC swings to matter at micron-level measurement. A room near a bay door, a window with direct sun, or a cycling vent can keep the machine out of spec even after a flawless rig and a clean reinstall.' },
    { q: 'Does a CMM need to be recalibrated after every move, even a short one across the same building?', a: 'Yes. The calibration certificate describes performance at a specific location and point in time, and that no longer applies once the machine has been lifted and reset — even a short move changes the geometric conditions the certificate was issued against. Requalification by the OEM or an accredited calibration lab, covering volumetric accuracy, straightness, squareness and probing repeatability, is what clears the machine to measure parts again.' },
    { q: 'Who performs the requalification testing after a CMM move — the rigging crew?', a: 'No. Requalification is metrology work performed by the machine\'s OEM field service or an accredited calibration lab, using equipment like a laser interferometer, certified step gauge or ball bar to verify the machine against its published tolerance. The rigging and reinstall get the machine level, powered, and environmentally stable; the calibration provider is the one who signs off that it measures true again.' },
  ],
  related: [
    { h: 'Machinery Moving & Installation', u: '../services/machinery-moving.html' },
    { h: 'Lab Equipment Movers', u: '../services/lab-equipment-movers.html' },
    { h: 'Machine Leveling and Alignment', u: 'machine-leveling-and-alignment.html' },
    { h: 'How to Move a Surface Grinder', u: 'how-to-move-a-surface-grinder.html' },
  ],
};
