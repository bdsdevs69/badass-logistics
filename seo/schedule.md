# Tue/Fri build-out — 2026-09-22 → 2026-10-23

Ten runs. Every one ships hard. Analysis rides along, never its own run.
Edit this file — it beats everything below.

## Target state by 23 Oct

| | now | after |
|---|---|---|
| service × city (rigging) | 352 | **853** |
| rigging services with city coverage | 4 of 15 | **15 of 15** |
| dispatch pages | 1 | **31**, all non-geo |
| blog articles | 69 | **~143** |
| total indexable pages | 661 | **~1,250** |

---

## Two things the data killed, before you read the runs

**1. Equipment × city is a trap — do not build it.** I was going to add 10
equipment types × 30 metros = 300 pages. The 90-day data says no: equipment
queries pull 629 impressions and **almost none carry a city** — "lathe" 152
impressions across 15 queries, zero with a city. Equipment demand is national
and how-to shaped. And we already have the proof: `cnc-machine-movers` IS an
equipment×city matrix and it is the **worst performer on the site at 50%
indexed**. Building 300 more would repeat that mistake at four times the scale.
Equipment gets *articles* and national service pages instead.

**0. MEASURED 2026-09-21 — the stub number was understated.** `scripts/stub-traffic.js`
says **133 retired pages still earn 6,879 impressions and 52 clicks**, which is roughly
half of everything this site earns, all landing on pages that bounce the visitor away.
`/services/dispatching` sits at **position 5.7** — the best ranking on the site — on a stub.
Run 4 below says "~2,000 stub impressions"; the real recoverable figure is larger. But only
part of it is ours to take: trailer and fleet-operations queries are fleet owners choosing
what to run, which is the 4+ truck dispatch buyer, and those are worth recovering. The
heavy-haul service pages, oversize-permit guides, pilot-car and superload posts are demand
for a motor carrier we retired in 2026 — leave those stubbed. Recovering a URL means deleting
its rule from `data/redirects.json`; `build-redirects.js` runs after the generators and will
re-stub anything still listed. Two were recovered on 21 Sep as the pattern:
`step-deck-vs-drop-deck-trailers` (1,729 impr, pos 17.5) and
`how-to-load-and-secure-a-conestoga-trailer` (543, pos 13.9).

**2. The biggest quick win is trailer content, routed through dispatch.**
Comparison demand is 220 impressions and it is almost entirely trailer
comparisons — "step deck vs drop deck" 60 impressions at position 12, "drop
deck vs step deck" 54 at position 7. Add the stubs: `/blog/step-deck-vs-drop-deck-trailers`
alone holds **1,729 impressions**. That is ~2,000 impressions of live demand
currently landing on retired heavy-haul pages.

This is not reviving heavy haul. **We dispatch flatbed, step deck, reefer and
Conestoga fleets** — "step deck dispatch services" is already a live query at
position 15. Trailer content belongs to dispatch, on-brand, and recovers the
traffic. Biggest single unlock identified this month.

**3. AEO is wide open.** 56 question-shaped queries, 324 impressions, **zero
clicks**. And LLM-shaped queries are already showing: *"what are the best plant
relocation companies for large-scale manufacturing moves in the united states?"*
(25 impressions) and *"industrial relocation contractors vs in-house facilities
teams — which companies are worth hiring?"* (position 7). That is AI search
asking our exact question and getting someone else's answer.

---

## Runs

| # | Date | Ships | Articles |
|---|---|---|---|
| 1 | Tue 22 Sep | **Guardrails into build.js** · dispatch equipment ×10 + hub · queue backfilled to 50 | 6 |
| 2 | Fri 25 Sep | **Wave 2 COMPLETE — all 4 services, 276 pages** · dispatch fleet-model ×4 | 6 |
| 3 | Tue 29 Sep | **Wave 3 COMPLETE — all 7 services, 225 pages** · `sectors:` research for all 88 metros | 6 |
| 4 | Fri 2 Oct | **Trailer recovery** — 12 dispatch trailer/comparison pages reclaiming the ~2,000 stub impressions · dispatch decision ×4 + differentiator | 8 |
| 5 | Tue 6 Oct | **AEO answer layer** — question-shaped H2s + speakable + answer blocks across every service and city page | 8 |
| 6 | Fri 9 Oct | **Internal-link mesh** across the full 1,250-page graph · schema entity graph (Organization, sameAs, Service) | 8 |
| 7 | Tue 13 Oct | **Depth pass** — top 100 pages by impressions get real local and technical substance | 8 |
| 8 | Fri 16 Oct | **Conversion** — CTAs, quote flow, per-service quote routing. 9,979 impressions need somewhere to land | 8 |
| 9 | Tue 20 Oct | Second AEO pass · **measurement folded in** · cnc decision | 8 |
| 10 | Fri 23 Oct | Double down on whatever is winning · month review | 8 |

**501 new matrix pages · 30 dispatch pages · 74 articles.**

Waves 2 and 3 land in runs 2 and 3, not spread across the month. They are
generated — a `SERVICES{}` block and a `WAVES{}` entry each. The slow part was
never the building.

---

## Dispatch — 31 pages, zero geo

`/services/dispatching` is a **redirect stub sitting at position 5.7 with 185
impressions** — the best position on the site, on a page that redirects away.

Every competitor runs the same architecture and Route One's slugs are literally
`/services/trailer-types/{type}/`: Freight Girlz, Logity, Truck Dispatch
Experts, Truck Dispatch 360. Market-validated.

- **Equipment ×10 + hub** — dry van, reefer, flatbed, step deck, Conestoga,
  RGN/lowboy, power only, hotshot, car hauler, LTL/partial
- **Trailer comparison ×12** — the step deck / drop deck / flatbed / RGN
  cluster, reclaiming stub traffic under dispatch
- **Fleet model ×4** — 4–10 trucks, 10–25, 25+, after-hours desk
- **Decision ×4** — vs in-house dispatcher, what drives cost (**factors, no
  prices**), vs freight broker, vs factoring
- **Differentiator ×1** — where our freight comes from. Our rigging work
  generates loads; load-board shops cannot say that.

Fleets of 4+ only. Never owner-operators. Never a city page.

---

## Guardrails — run 1, before the volume lands

Build-failing checks in `build.js`:
1. **No sub-city URLs** — suburbs live in the coverage table, never a page
2. **No dispatch geo URLs** — ever
3. **Uniqueness floor** — every service×city page needs ≥6 city-specific tokens
4. **Matrix cap** — per-service counts must match the declared wave
5. **Positioning lint on the generators** — `check-content.js` only covers
   `content/services`, which is how "Heavy Equipment Moving" survived on 88 city
   titles after being retired

At 1,250 pages these stop being optional. They are what lets us go fast.

## Every run
1. `check-content.js` per article → 2. **full `node build.js`** → 3. push +
`ping-search-engines.js` → 4. live 200 / sitemap / llms.txt / schema parse →
5. **GSC numbers for whatever the batch touched, into the log** → 6. push

## Run 9 measurement, folded in

| page | was 21 Sep | target |
|---|---|---|
| machinery-moving/omaha-ne | 691 impr · pos 67.5 · 0 clk | a click, or pos < 50 |
| machinery-moving/savannah-ga | 607 · 21.0 · 0 | clicks > 0 |
| rigging/savannah-ga | 362 · 25.6 · 0 | pos < 20 |
| **site non-brand clicks** | **4 of 120** | **> 25** |

## Out of scope
Ads (Monday task) · sub-city URLs · dispatch geo · backlink chasing (67 of 96
toxic) · equipment × city matrices (see above)

## The one thing only Sam can supply
Real project stories — equipment, weight, city, constraint, outcome, photos.
1,250 pages plus six real jobs beats 1,250 pages. Asked once per run.
