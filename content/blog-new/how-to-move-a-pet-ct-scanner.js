module.exports = {
  slug: 'how-to-move-a-pet-ct-scanner',
  cat: 'Medical Rigging',
  hero: 'loads/ct-mri-scanner-enclosed-air-ride.jpg',
  date: '2026-09-27',
  title: 'How to Move a PET/CT Scanner: Survey, Release & Rigging',
  desc: 'Moving a PET/CT scanner starts in the hot lab, not the gantry. Radiation survey, sealed source transfer, decay-in-storage, and what a rigger can and cannot touch.',
  dek: 'A PET/CT gantry rigs like any large imaging system. What gets a job stopped is the radioactive material sitting next to it and inside it — and that has its own crew and its own paperwork.',
  tldr: 'A PET/CT scanner cannot be touched by a rigging crew until the facility\'s radiation safety officer surveys the room, transfers or decays any radioactive material, and issues a written release. The gantry itself often holds sealed calibration sources that need licensed handling, and the hot lab next door — generators, dose calibrator, unit doses — is decommissioned as its own project before the scanner ever gets crated.',
  keywords: 'pet ct moving, nuclear medicine equipment relocation, pet scanner rigging, hot lab decommissioning, radioactive material survey, pet ct scanner relocation',
  body: `
<p>A PET/CT scanner reads like two machines because it is two machines — a CT gantry that produces radiation only while it is energized, and a PET detector ring that produces nothing on its own but sits inside a department built around handling unsealed radioactive drugs. The rigging on the gantry itself is close to any large imaging system move. What is different, and what decides the schedule, is everything the radiation program has to close out before a rigger is allowed anywhere near the room.</p>

<figure>
  <img class="post-img" src="../assets/img/loads/ct-mri-scanner-enclosed-air-ride.jpg" alt="Large imaging scanner wrapped and staged for enclosed air-ride transport" loading="lazy" width="1050" height="1400">
  <figcaption class="hand" style="font-size:16px;opacity:.8;">The gantry ships like any other imaging system. Getting to that point is the part that is different.</figcaption>
</figure>

<h2>What makes a PET/CT move different from moving a plain CT scanner?</h2>
<p>The radioactive material in the department, not the gantry weight. A standalone CT scanner is cleared for rigging as soon as it is powered down and locked out — it holds no source and makes radiation only while energized. A PET/CT suite adds an unsealed-byproduct-material program: F-18 fluorodeoxyglucose doses drawn daily, a hot lab where those doses are prepared and measured, a dose calibrator, and in most departments one or more sealed check sources used to test that calibrator every morning. None of that runs under the same rules as a CT room, and all of it has to be resolved before the imaging equipment is treated as a routine rig-out.</p>
<p>The practical effect is that a PET/CT relocation is really two projects running side by side: a radiation decommissioning project inside the department, run by the radiation safety officer (RSO) and a licensed source-services contractor where sealed sources are involved, and an equipment rigging project that starts once the first project signs off.</p>

<h2>What has to happen before a PET/CT scanner can be touched?</h2>
<p>A written radiation release from the site's RSO, and it is not a formality — it is the gate. Before a rigger opens a panel or breaks a bolt, the RSO surveys the gantry, the hot lab, and the uptake and injection rooms with a calibrated survey meter, pulls wipe samples and counts them for removable contamination, and confirms every reading is at or below the facility's release limits. Any unsealed material still in the department — unused doses, generator eluate, contaminated sharps and swabs — is transferred to a licensed recipient or decayed to background and disposed of as ordinary waste, and the disposal is logged. Only after that survey is documented and signed does the release exist, and riggers work from that document, not from someone's assurance that the room is "probably fine."</p>
<p>If the facility holds its license through the NRC or an Agreement State, the license itself may need amending or the byproduct material line removed before the account is closed out, and that paperwork runs on its own timeline — weeks, not days, in a lot of jurisdictions. Build that lead time into the relocation date before it gets set in a hospital-wide project plan.</p>

<h2>Does the scanner itself hold a radioactive source?</h2>
<p>Often, yes — and this is the detail that gets missed because it sits inside the machine rather than in a visible container. Many PET/CT systems use a sealed rod or pin source, commonly germanium-68 or cesium-137 depending on platform and age, mounted inside the gantry and used for daily quality control and normalization scans. That source is itemized on the facility's radioactive materials license as a sealed source, it gets its own periodic leak test, and it does not become "empty" just because the machine is unplugged. Germanium-68 has a roughly 271-day half-life, so waiting it out is not a practical option the way it is for the short-lived doses in the hot lab.</p>
<p>Before the gantry can be de-installed, that source is removed and transferred by the OEM field service engineer or a licensed source-services contractor, logged as a transfer on both facilities' license records, and the empty source holder is documented as such. A rigging crew does not remove, handle, or ship a sealed source under any circumstance — that is licensed work, separate from the equipment move, and it has to be complete before the gantry is scheduled for de-install.</p>

<div class="keyfacts">
  <h3>What has to be confirmed before rigging is scheduled</h3>
  <ul>
    <li>Written RSO survey and release for the gantry room, hot lab, and any uptake or injection rooms</li>
    <li>Whether the gantry carries a sealed calibration source, and confirmation it has been transferred by a licensed contractor</li>
    <li>Disposition of all unsealed material — transferred, decayed in storage, or disposed of and logged</li>
    <li>Status of the site's radioactive materials license or license amendment, if the department is closing</li>
    <li>Wipe test results on hot lab surfaces, the dose calibrator, syringe shields, and any fume hood or sink used for waste</li>
    <li>Whether lead or lead-doped shielding in the walls will be disturbed, and who surveys it afterward</li>
  </ul>
</div>

<h2>How is the hot lab decommissioned separately from the scanner?</h2>
<p>As its own smaller project, on its own timeline, usually finishing before the gantry work even starts. The hot lab is where unit doses arrive or are compounded, where the dose calibrator lives, and where any on-site generator — a germanium-68/gallium-68 generator for PET tracer production, for instance — is housed and eventually returned to the manufacturer or transferred to a licensed recipient. Decommissioning that room means removing or transferring every source of unsealed activity, wipe-testing every bench, hood interior, sink trap, and floor area where a spill could have occurred, and running direct radiation surveys with a calibrated Geiger-Müller or similar instrument over the whole space. Short-lived contamination is frequently handled by decay-in-storage: F-18 has a half-life of about 110 minutes, so material held for roughly ten half-lives — under a day — decays to background and can be surveyed out and disposed of as ordinary waste, with the decay period and final survey logged. Sealed sources and generators do not get this option; they leave the building as a transfer, not a decay.</p>
<p>Only once the hot lab passes its own survey does the RSO extend the release to cover the equipment work, because a hot lab that still reads above background sitting fifteen feet from a rigging crew is the same problem whether or not the gantry itself is clean.</p>

<h2>What shielding is built into a PET/CT suite, and does it affect the move?</h2>
<p>Yes, and it is a different shielding problem than a standard x-ray or CT room. Injection and uptake rooms where patients wait after receiving an FDG dose are commonly lined with lead or lead-doped drywall, and control areas and adjacent occupied spaces are shielded to keep dose rates within limits for people who are not undergoing the procedure. If a wall carrying that shielding has to be opened to move equipment or a hot lab fixture out, the same rule applies as on any shielded medical room: the opening is planned so the shielding can be restored and lapped rather than butted, and the room gets a fresh survey once it goes back together. As with a shielded x-ray room, the better answer is almost always one more step of disassembly through the door rather than a cut in a lead-lined wall.</p>

<h2>Who is allowed to do what on this job?</h2>
<p>Three separate scopes, and keeping them separate is what keeps the schedule honest. The RSO and, where sealed sources are involved, a licensed source-services contractor own the radiation side — surveys, wipe tests, transfers, disposal logging, and the written release. The OEM field service engineer owns de-installation of the gantry proper: powering it down, disconnecting it, and pulling any source holder once it has been cleared. The rigging crew owns everything from the moment a component is confirmed clear and disconnected to the moment it is set on the truck or the new floor — skating the gantry out of the room, protecting the path, crating the detector electronics, and loading for transport. None of those three groups does another group's job, and a rigger who is asked to "just pull that source housing to save a trip" says no and waits for the license transfer to close.</p>

<h2>How is a cleared PET/CT scanner rigged and shipped?</h2>
<p>Once released, it moves like any large imaging system. The gantry comes apart into the detector ring, the patient couch, the CT tube and generator assembly, and control cabinets, following the OEM's disassembly sequence rather than a generic rigging plan. The detector electronics are the fragile, high-value end and get padded and crated with shock indicators, the same standard used on MRI and CT moves. Components ride low on machinery skates through doorways and any tight corridor turns, and once on the dock everything ships enclosed and air-ride, blocked and braced so nothing shifts, with transport between sites arranged through our licensed broker and carrier partners.</p>
<p>The one thing worth flagging before loading: if the release documentation and any transfer records for a sealed source are traveling with the equipment to a receiving facility, they go in a folder that stays with the paperwork for the machine, not buried in a crate. The receiving site's RSO will ask for them before the gantry is even unloaded.</p>

<h2>How long does a PET/CT relocation actually take?</h2>
<p>Longer than the rigging suggests, because the radiation program sets the front end of the schedule and the rigging crew works inside whatever window is left. A realistic sequence runs: hot lab wind-down and decay-in-storage of short-lived waste, wipe testing and survey of the hot lab, transfer of any generator and sealed calibration source by a licensed contractor, RSO survey and written release of the gantry room, OEM de-install, rig-out, and then shipping. The equipment portion — de-install through loading — is often a matter of days once the release exists. The radiation side, especially if a license amendment or a sealed-source transfer has to clear another jurisdiction's paperwork, is routinely the longer half of the job. Plan the equipment schedule around the radiation schedule, not the other way around.</p>

<div class="takeaways">
  <h3>Bottom line</h3>
  <ul>
    <li>Nothing gets touched until the RSO surveys the room and issues a written release — that document is the gate, not a formality.</li>
    <li>The gantry often carries a sealed calibration source of its own; that is licensed work for the OEM or a source-services contractor, never the rigging crew.</li>
    <li>The hot lab is decommissioned as its own project — generators and unsealed doses transferred or decayed, every surface wipe-tested.</li>
    <li>Shielded injection and uptake rooms follow the same rule as any lead-lined room: avoid cutting the wall if disassembly through the door will work.</li>
    <li>Once released, the gantry rigs and ships like any large imaging system — the schedule risk is almost entirely on the radiation side, not the lift.</li>
  </ul>
</div>

<p>Planning a PET/CT relocation, a nuclear medicine department closure, or a hot lab decommission alongside the equipment move? This is core <a href="../services/mri-medical-equipment-rigging.html">medical and imaging equipment rigging</a>, and it runs alongside <a href="../services/lab-equipment-movers.html">lab equipment moving</a> wherever generators, dose calibrators, and hot lab fixtures are part of the scope. Send the model numbers, the survey status, and the route out of the building, and we will build the rigging plan around your RSO's timeline — <a href="../contact.html">start here</a>.</p>
`,
  faq: [
    { q: 'Can a rigging crew touch a PET/CT scanner before the radiation survey is done?', a: 'No. A written release from the facility\'s radiation safety officer has to exist first, based on a direct radiation survey and wipe testing of the gantry room, hot lab, and any uptake or injection rooms. Riggers work from that document, and nothing gets disconnected or crated before it is issued.' },
    { q: 'Does the PET/CT gantry itself contain a radioactive source?', a: 'Often, yes. Many systems use a sealed calibration source — commonly germanium-68 or cesium-137 — mounted inside the gantry for daily quality control scans. It is itemized on the facility\'s radioactive materials license and has to be removed and transferred by the OEM or a licensed source-services contractor before the gantry can be de-installed. A rigging crew never handles a sealed source.' },
    { q: 'How is the hot lab decommissioned separately from the scanner?', a: 'The hot lab is treated as its own project: unsealed doses and any generator are transferred to a licensed recipient or, for short-lived material like F-18, decayed in storage for roughly ten half-lives until it reads at background. Every bench, hood, sink, and floor area is then wipe-tested and surveyed before the room is released, independent of the imaging equipment schedule.' },
    { q: 'How long does F-18 take to decay to background?', a: 'F-18 has a half-life of about 110 minutes, so material held for roughly ten half-lives — under 24 hours — decays to background and can be surveyed out and disposed of as ordinary waste. Sealed calibration sources do not have this option; germanium-68, for example, has a roughly 271-day half-life and has to be transferred rather than waited out.' },
    { q: 'Do PET/CT rooms need shielded walls, and does that affect the move?', a: 'Yes, injection and uptake rooms are commonly lined with lead or lead-doped drywall to control dose rates in adjacent occupied spaces. If a shielded wall has to be opened to move equipment out, the opening has to be planned so the shielding can be re-lapped and re-surveyed afterward — one more step of disassembly through the door is almost always cheaper than cutting and restoring a lead-lined wall.' },
    { q: 'How long does a full PET/CT relocation take?', a: 'The equipment portion is usually a matter of days once the room is released. The radiation side is usually the longer half — hot lab wind-down, decay-in-storage, wipe testing, sealed-source transfer, and any license amendment can run weeks depending on the jurisdiction. Schedule the rigging around the radiation program\'s timeline, not the reverse.' },
  ],
  related: [
    { h: 'Medical & Imaging Equipment Rigging', u: '../services/mri-medical-equipment-rigging.html' },
    { h: 'Lab Equipment Movers', u: '../services/lab-equipment-movers.html' },
    { h: 'How to Move a Linear Accelerator', u: 'how-to-move-a-linear-accelerator.html' },
    { h: 'How to Move an X-Ray Machine, C-Arm or Radiography Room', u: 'how-to-move-an-x-ray-machine.html' },
  ],
};
