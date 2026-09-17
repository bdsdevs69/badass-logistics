/* ===========================================================
   Badass Logistics — service taxonomy (single source of truth)

   Positioning (2026-09 revamp):
     1. RIGGING is the business. Every kind of industrial rigging.
     2. PROJECT FREIGHT comes out of the rigging work — container to
        warehouse, crating, dedicated lanes. Project-based only, never
        one-off loads. Badass holds no MC authority: transport runs on
        licensed broker and carrier partners managed inside the project.
     3. TRUCK DISPATCH for fleets of 4+ trucks. No owner-operators.
   Heavy haul is retired as a service line (see data/redirects.json).

   Nav, footer, related-service grids, the homepage and llms.txt all
   read from here, so a service is added or renamed in ONE place.
   =========================================================== */

const FAMILIES = {
  rigging:  { label: 'Rigging',         pillar: 'rigging',         email: 'rigging@badasslogistics.com' },
  freight:  { label: 'Project Freight', pillar: 'project-freight', email: 'freight@badasslogistics.com' },
  dispatch: { label: 'Truck Dispatch',  pillar: 'truck-dispatch',  email: 'dispatch@badasslogistics.com' },
};

// order = display order in menus and grids
const SERVICES = [
  // ---- rigging (primary) ----
  { slug: 'rigging',                       family: 'rigging',  label: 'Industrial Rigging',                 short: 'Industrial Rigging' },
  { slug: 'machinery-moving',              family: 'rigging',  label: 'Machinery Moving',                   short: 'Machinery Moving' },
  { slug: 'plant-relocation',              family: 'rigging',  label: 'Factory & Plant Relocation',         short: 'Plant Relocation' },
  { slug: 'machinery-removal',             family: 'rigging',  label: 'Machinery Removal & Decommissioning', short: 'Machinery Removal' },
  { slug: 'mri-medical-equipment-rigging', family: 'rigging',  label: 'Medical Equipment & MRI Rigging',    short: 'MRI & Medical' },
  { slug: 'lab-equipment-movers',          family: 'rigging',  label: 'Lab & Precision Equipment Movers',   short: 'Lab & Precision' },
  { slug: 'cnc-machine-movers',            family: 'rigging',  label: 'CNC Machine Movers',                 short: 'CNC Machine Movers' },
  { slug: 'printing-press-movers',         family: 'rigging',  label: 'Printing Press Movers',              short: 'Printing Press Movers' },
  { slug: 'crane-services',                family: 'rigging',  label: 'Crane & Rigging Services',           short: 'Crane & Rigging' },
  { slug: 'heavy-lift-rigging',            family: 'rigging',  label: 'Jacking, Skidding & Gantry Lifts',   short: 'Jacking & Skidding' },
  { slug: 'millwright-services',           family: 'rigging',  label: 'Millwright & Machine Installation',  short: 'Millwright Services' },
  { slug: 'forklift-loading-unloading',    family: 'rigging',  label: 'Machinery Loading & Unloading',      short: 'Loading & Unloading' },
  { slug: 'data-center-rigging',           family: 'rigging',  label: 'Data Center Rigging',                short: 'Data Center Rigging' },
  { slug: 'hvac-chiller-rigging',          family: 'rigging',  label: 'Chiller, Boiler & HVAC Rigging',     short: 'Chiller & Boiler' },
  { slug: 'transformer-generator-rigging', family: 'rigging',  label: 'Transformer & Generator Moving',     short: 'Transformers & Generators' },
  // ---- project freight ----
  { slug: 'project-freight',               family: 'freight',  label: 'Project Freight',                    short: 'Project Freight' },
  { slug: 'container-to-warehouse',        family: 'freight',  label: 'Container to Warehouse',             short: 'Container to Warehouse' },
  { slug: 'crating-packing',               family: 'freight',  label: 'Industrial Crating & Packing',       short: 'Crating & Packing' },
  { slug: 'dedicated-lanes',               family: 'freight',  label: 'Dedicated Lanes & Project FTL',      short: 'Dedicated Lanes & FTL' },
  // ---- dispatch ----
  { slug: 'truck-dispatch',                family: 'dispatch', label: 'Truck Dispatch for Trucking Companies', short: 'Truck Dispatch' },
];

const bySlug = Object.fromEntries(SERVICES.map(s => [s.slug, s]));
const inFamily = (fam) => SERVICES.filter(s => s.family === fam);

// Which department mailbox a page should show, from its site path.
function emailForPath(rel) {
  const m = rel.match(/^services\/([a-z0-9-]+)/);
  if (m && bySlug[m[1]]) return FAMILIES[bySlug[m[1]].family].email;
  if (/^quote-dispatch/.test(rel)) return FAMILIES.dispatch.email;
  if (/^quote-project-freight/.test(rel)) return FAMILIES.freight.email;
  return 'info@badasslogistics.com';
}

module.exports = { FAMILIES, SERVICES, bySlug, inFamily, emailForPath };
