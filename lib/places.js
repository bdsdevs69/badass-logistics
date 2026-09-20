/* ===========================================================
   Badass Logistics — nearby-town helpers

   data/locations.json `near` holds objects, not strings:
     { name, county?, mi?, st? }   st only when it differs from the metro

   The list is curated-first: the hand-picked industrial suburbs come
   first and in their original order, because residential population is
   a bad proxy for industrial relevance — City of Industry and Vernon
   have a few hundred residents each and are two of the densest
   industrial zones in the country. Everything after them is topped up
   from GeoNames by population within 50 miles, and county and distance
   are real values from that dataset, not estimates.

   NOTHING here invents a place. A town with no county or distance is
   one GeoNames had no record for; it renders with just its name.
   =========================================================== */

// "Vancouver, WA" when it crosses a state line, otherwise just the town.
const label = (t) => (typeof t === 'string' ? t : t.st ? `${t.name}, ${t.st}` : t.name);

// Plain names, for cards and intro sentences.
const names = (near, n) => (near || []).slice(0, n === undefined ? undefined : n).map(label);

// The coverage table. Columns collapse when the data isn't there, so a
// metro whose towns lack counties still renders cleanly.
function coverageTable(near, limit = 24) {
  const rows = (near || []).slice(0, limit);
  if (!rows.length) return '';
  const anyCounty = rows.some(t => t.county);
  const anyMi = rows.some(t => t.mi !== undefined);
  const head = `<thead><tr><th scope="col">Town</th>${anyCounty ? '<th scope="col">County</th>' : ''}${anyMi ? '<th scope="col">From downtown</th>' : ''}</tr></thead>`;
  const body = rows.map(t => `<tr><td>${label(t)}</td>${anyCounty ? `<td>${t.county ? t.county + ' County' : '—'}</td>` : ''}${anyMi ? `<td>${t.mi !== undefined ? Math.round(t.mi) + ' mi' : '—'}</td>` : ''}</tr>`).join('\n      ');
  return `<div class="table-wrap"><table class="towns-table">\n    ${head}\n    <tbody>\n      ${body}\n    </tbody>\n  </table></div>`;
}

module.exports = { label, names, coverageTable };
