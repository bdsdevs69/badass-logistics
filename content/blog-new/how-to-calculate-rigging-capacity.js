module.exports = {
  slug: 'how-to-calculate-rigging-capacity',
  cat: 'Rigging',
  hero: 'rigging-hero.jpg',
  date: '2026-09-27',
  title: 'How to Calculate Rigging Capacity: Sling Angle, D/d, WLL',
  desc: 'How to calculate rigging capacity: the sling angle tension multiplier, D/d ratio, shackle and hook ratings, and why the weakest part sets the whole limit.',
  dek: 'The crane is rarely the weak link. Here is how sling angle, bend ratio, and hardware ratings actually set what a rig can lift.',
  tldr: 'Rigging capacity is set by whichever component in the rig is weakest, not by the load\'s bare weight or the crane\'s chart. Sling angle multiplies leg tension above the load\'s actual share as the angle drops from vertical; a tight D/d ratio cuts a sling\'s rated strength when it bends around something too small; and shackles lose capacity the moment they\'re side-loaded. Calculate each and rig to the lowest number.',
  keywords: 'how to calculate rigging capacity, sling angle factor, rigging capacity calculation, wire rope sling capacity, D/d ratio, sling tension multiplier',
  body: `
<p>Ask what a rig can lift and most people quote the crane's chart or the sling's flat rating stamped on the tag. Neither number is the answer by itself. A rig is a chain of parts — sling, shackle, hook, and the geometry connecting them to the load — and the capacity of that chain is whatever its weakest link allows at the angle it's actually working, not what any single component reads when new and pulled straight.</p>

<h2>How do you calculate rigging capacity for a lift?</h2>
<p>You calculate the tension each leg of rigging actually carries, apply the derating for how it's bent or angled, and compare that against the rated capacity of every component in the load path — sling, shackle, hook, master link. The lowest surviving number after derating is the rig's real capacity, regardless of what any one piece is stamped for. Skip a step and the rig can look fine on paper while one component is already working past its limit.</p>
<p>The inputs that matter are the load's actual weight and center of gravity, the number of legs and the angle each one makes with the horizontal, the diameter of whatever each sling bends around, and the rated capacity of every piece of hardware in the path. Get any one of those wrong and the arithmetic downstream is wrong with it.</p>

<h2>How does sling angle change the load on each leg?</h2>
<p>Sling angle multiplies the tension in each leg above its simple share of the load, and the multiplier gets steep fast as the angle drops from vertical. A perfectly vertical sling carries exactly its share of the load. Tilt that same sling to an angle from the horizontal and the leg now carries the load's share <em>plus</em> a component of tension needed to pull the load sideways toward center — tension that does no useful lifting but still has to run through the sling and every fitting below it.</p>
<div class="keyfacts">
  <h3>Sling angle tension factors (angle measured from horizontal)</h3>
  <ul>
    <li><strong>90° (vertical):</strong> factor 1.00 — leg tension equals the load's plain share</li>
    <li><strong>60°:</strong> factor 1.15</li>
    <li><strong>45°:</strong> factor 1.41</li>
    <li><strong>30°:</strong> factor 2.00 — each leg now carries double its share</li>
  </ul>
  <p>Leg tension = (load ÷ number of legs) × angle factor. A 4,000-lb load on two slings, each running vertically, puts 2,000 lb on each leg. Lay those same two slings out to 30° from horizontal and each leg is now carrying 4,000 lb — the whole load, twice over, split between two legs instead of once between two.</p>
</div>
<p>That's why 30° from horizontal is the floor most rigging standards allow and 45° is treated as a practical minimum on anything with real margin to lose. Below 30°, the factor keeps climbing without limit as the angle flattens further — a sling nearly laid over flat is trying to carry tension that has nowhere reasonable to go, and it's usually the hardware, not the wire rope, that gives first.</p>

<h2>What is D/d ratio, and why does it cut sling capacity?</h2>
<p>D/d ratio compares the diameter of whatever a sling bends around — a shackle bow, a lifting lug, the load's own edge — to the diameter of the sling itself, and a tight ratio quietly derates the sling below its tag rating before the load ever comes into it. Wire rope sling capacities are established assuming the rope bends around something at least 25 times its own diameter. Wrap that same rope around a pin or lug only a few times its diameter and the outer wires stretch further than the inner ones on the same bend, so they take a disproportionate share of the load instead of sharing it evenly across the strand.</p>
<p>The practical effect: a sling choked or basketed around something skinny — a small-diameter shackle pin, a sharp lifting eye, a corner instead of a lug — can lose a meaningful fraction of its rated strength with the tag number unchanged, because the tag assumes the generous bend the sling was tested with. This is the reason lift plans specify shackle size relative to sling diameter, and why a rigger sizes the pin the sling rides on rather than just matching the shackle's WLL to the load.</p>

<h2>How are shackles and hooks rated for a lift?</h2>
<p>Shackles and hooks carry a stamped working load limit that assumes the load pulls straight through the bow, in line with the pin — and that rating drops fast the moment the pull comes in at an angle instead. A shackle loaded in line, through the centerline of the bow, carries its full rated capacity. Load it at 45° off that line and the rated capacity is commonly derated to roughly 70%; at 90° — a full side load, pulling across the bow instead of through it — that can fall to around half the stamped rating. The shackle hasn't gotten weaker; the bow is simply no longer the shape the rating was tested for, and the pin sees bending loads it wasn't sized to carry.</p>
<p>Hooks fail the same way for a different reason: a hook's rated capacity assumes the load hangs at the throat, in the hook's own plane. A sling that walks out toward the point, or a multi-leg pick that pulls the hook sideways, opens the throat under leverage the rating never accounted for. Both problems are geometry problems, not strength problems, and both are avoidable by keeping every piece of hardware loaded the way its rating assumes — straight through the bow, centered in the throat.</p>

<h2>Why does center of gravity change which numbers matter?</h2>
<p>Center of gravity decides how much of the total load each leg actually has to carry before the angle factor even gets applied, and an off-center load can put most of the weight on one leg while the others carry almost nothing. The simple "load ÷ number of legs" math in the keyfacts box above only holds when the load is symmetric and rigged from points equidistant from the center of gravity. Move the CG off-center — a gearbox on one end of a frame, a motor mounted high on one side — and the leg nearest the heavy end can end up carrying well over its "equal share," even before sling angle multiplies it further.</p>
<p>This is also why pre-lift weight and CG work matters more than the angle math itself: an angle calculation run against the wrong per-leg share is precise and wrong at the same time. A trial lift a few inches off the deck, watching which leg goes taut first and whether the load hangs level, is the field check that catches a bad CG assumption before the load is in the air.</p>

<h2>Why does the weakest component set the whole rig's capacity?</h2>
<p>A rig is only as strong as its weakest link because every part carries the same tension in series — the load doesn't know or care which component is undersized, it just finds whichever one gives first. A crane rated well past the load, wire rope slings rated comfortably above the leg tension, and a single undersized shackle at the bottom of the pick still fails at the shackle. Oversizing everything except one component buys nothing; the rig's real capacity is the lowest rated number left standing after every derating has been applied to every part.</p>
<p>In practice that means working the calculation backward from the load to the hook, checking each component in turn — sling rated capacity at the working angle, shackle rated capacity at the actual pull angle, D/d ratio at every bend, hook rating against how the load actually hangs in it — and flagging whichever one comes out lowest. That component, not the crane's <a href="rigging-load-charts-explained.html">load chart</a>, is what actually limits the pick.</p>

<h2>What does a full rigging capacity calculation look like in practice?</h2>
<p>Take a 12,000-lb machine rigged with two wire rope slings from a single overhead point, legs spread to 45° from horizontal. Each leg's plain share is 6,000 lb. Apply the 45° angle factor of 1.41 and each leg is actually carrying about 8,460 lb — 41% more than the flat division suggests. Now check what each leg bends around: if the sling is choked through a lifting lug only a few times the rope's diameter instead of the generous bend its rating assumes, its effective capacity for that pick is lower than the tag number, and the 8,460-lb leg tension has to clear that reduced number, not the one on the tag.</p>
<p>Then check the shackles connecting each sling to the lug. If they're pulling in line, their full stamped rating applies against that same 8,460 lb. If the rigging geometry pulls them off-axis — a common result of an asymmetric lug or a spreader that isn't quite centered — their effective rating drops to roughly 70% or 50% of the tag number depending on how far off-line the pull runs, and now the shackle, not the sling, may be the component setting the ceiling. The finished calculation isn't one number pulled off one tag; it's four or five numbers, each derated for how that specific piece is actually loaded on this specific pick, with the lowest one winning.</p>

<div class="takeaways">
  <h3>Bottom line</h3>
  <ul>
    <li>Rigging capacity is the lowest surviving rated number after derating every component for how it's actually loaded — not the flat tag rating on any one piece.</li>
    <li>Sling angle multiplies leg tension above the load's plain share as the angle drops from vertical: roughly 1.15× at 60°, 1.41× at 45°, 2.0× at 30°.</li>
    <li>D/d ratio derates a sling when it bends around something smaller than the generous radius its rating was tested with — sizing the pin or lug matters as much as sizing the sling.</li>
    <li>Shackles and hooks are rated for in-line pulls; side-loading a shackle can cut its capacity by roughly 30-50%, and pulling a hook off-plane opens the throat.</li>
    <li>Center of gravity decides each leg's actual share before angle factors even apply — get the CG wrong and the rest of the math is precise and wrong together.</li>
  </ul>
</div>

<p>Running this calculation on a machine with an uncertain weight or center of gravity is where a <a href="what-is-a-critical-lift.html">critical lift</a> plan earns its keep — the numbers get worked out and checked before the load leaves the ground, not adjusted on the fly once a leg comes up short. See our <a href="../services/rigging.html">rigging services</a> for engineered picks and machine setting, or <a href="../services/heavy-lift-rigging.html">jacking, skidding, and gantry rigging</a> when the geometry rules out a crane pick entirely. For the broader landscape of what rigging covers, see <a href="types-of-rigging.html">types of rigging</a>.</p>
`,
  faq: [
    { q: 'How do you calculate sling tension at an angle?', a: 'Divide the total load by the number of sling legs to get each leg\'s plain share, then multiply by the angle factor for the angle measured from horizontal: 1.00 at 90° (vertical), 1.15 at 60°, 1.41 at 45°, and 2.00 at 30°. The result is the actual tension that leg carries, which is higher than its plain share at any angle below vertical.' },
    { q: 'What is a safe sling angle for rigging?', a: 'Most rigging standards treat 30° from horizontal as the floor and 45° or higher as the practical working range. Below 30°, the tension multiplier keeps rising sharply as the angle flattens, and the hardware at the bottom of the sling is usually what gives first, not the wire rope itself.' },
    { q: 'What is D/d ratio in rigging?', a: 'D/d ratio compares the diameter of whatever a sling bends around — a shackle pin, a lifting lug, an edge — to the diameter of the sling. Wire rope sling ratings assume a generous bend, commonly 25 times the rope\'s diameter. Bending the sling around something much smaller reduces its effective strength below the number on the tag.' },
    { q: 'Does side-loading a shackle reduce its capacity?', a: 'Yes. A shackle\'s stamped working load limit assumes the pull runs in line through the bow. Loaded at roughly 45° off that line, capacity commonly drops to around 70% of rated; at a full 90° side load, it can fall to around half. The shackle isn\'t weaker — the bow and pin are no longer loaded the way the rating assumes.' },
    { q: 'Why does the weakest rigging component set the whole rig\'s capacity?', a: 'Every component in a rig carries the same tension in series, so the load fails wherever the weakest part gives first, regardless of how strong everything else is. Oversizing the crane or the slings buys nothing if one shackle or one tight bend is undersized for the actual angle and load path.' },
    { q: 'Why does center of gravity matter to a rigging capacity calculation?', a: 'Center of gravity determines how much of the total load each leg carries before any angle factor is applied. An off-center load can put most of the weight on one leg while others carry little, so an angle calculation run against an assumed equal split can be precise and still wrong if the CG estimate is off.' },
  ],
  related: [
    { h: 'Rigging Services', u: '../services/rigging.html' },
    { h: 'Jacking, Skidding & Gantry Rigging', u: '../services/heavy-lift-rigging.html' },
    { h: 'Types of Rigging', u: 'types-of-rigging.html' },
    { h: 'Crane Load Charts Explained', u: 'rigging-load-charts-explained.html' },
    { h: 'What Is a Critical Lift?', u: 'what-is-a-critical-lift.html' },
  ],
};
