# Tue/Fri build-out — 2026-09-22 → 2026-10-23

Ten runs. **Every run ships.** Analysis and surveys ride along with the batch;
no run spends itself on a report. Edit this file — it beats anything below.

Cron is already `0 11 * * 2,5`. Monday 18:05 is Ads, separate task, out of scope.

## Target state by 23 Oct

| | now | after |
|---|---|---|
| service × city pages (rigging) | 352 | **853** |
| rigging services with city coverage | 4 of 15 | **15 of 15** |
| dispatch pages | 1 | **19** (all non-geo) |
| blog articles | 69 | **~100** |

Rigging goes wide across every service and every location. Dispatch gets built
on a completely different axis — equipment type, fleet size, decision stage —
because a "truck dispatch in Toledo" page has no local fact to stand on.

---

## Dispatch — the missing half, and what the research says

**It was absent from the last plan. That was the gap.** Three findings:

1. **`/services/dispatching` is a redirect stub sitting at position 5.7 with 185
   impressions and 4 clicks** — the best position on the whole site, on a page
   that redirects. Dispatch demand is real and we are barely serving it.
2. **Every competitor uses the same architecture: equipment-type pages.**
   Freight Girlz, Route One Dispatch, Logity, Truck Dispatch Experts and Truck
   Dispatch 360 all run dry van / reefer / flatbed / step deck / Conestoga /
   RGN / power only pages. Route One's slugs are literally
   `/services/trailer-types/{type}/`. This is market-validated, not a guess.
3. **Our own GSC already shows the demand** even with no pages: "dry van
   dispatch services", "step deck dispatch services" (position 15),
   "flatbeds/step deck dispatch service", "dispatch service cost", "24 hour
   dispatch services", "difference between a freight factoring agent and truck
   dispatcher".

**The 19 pages:**

*Equipment (10)* — dry van · reefer · flatbed · step deck · Conestoga ·
RGN/lowboy · power only · hotshot · car hauler · LTL & partial, plus an
equipment hub.

*Fleet model (4)* — dispatch for 4–10 trucks · 10–25 · 25+ · after-hours and
weekend desk ("24 hour dispatch services" is a live query).

*Decision stage (4)* — dispatch service vs an in-house dispatcher · what drives
dispatch cost (**cost factors, no prices** — same structure as the machinery
cost post that already ranks) · dispatcher vs freight broker · dispatcher vs
factoring.

*The differentiator (1)* — **where our freight comes from.** Our rigging and
project work generates loads; load-board shops cannot say that. Straight out of
the Freight Girlz teardown and the one genuinely defensible claim we have.

**Positioning holds throughout:** fleets of 4+ only, no owner-operators, no
prices, no MC/DOT claims, never "our trucks", and no geo pages ever.

---

## Runs

| # | Date | Ships | Articles |
|---|---|---|---|
| 1 | Tue 22 Sep | Dispatch equipment pages ×10 + hub · **uniqueness gate built into build.js** · queue backfilled to 30+ from the 397 uncovered queries | 3 |
| 2 | Fri 25 Sep | Dispatch fleet-model ×4 + decision ×4 + differentiator ×1 | 4 |
| 3 | Tue 29 Sep | **Wave 2 #1** — `millwright-services` × 88 + state hubs | 3 |
| 4 | Fri 2 Oct | **Wave 2 #2** — `machinery-removal` × 88 · AI-citation spot check rides along | 3 |
| 5 | Tue 6 Oct | **Wave 2 #3** — `crane-services` × 60 · `sectors:` batch 1 (30 metros) | 3 |
| 6 | Fri 9 Oct | **Wave 2 #4** — `forklift-loading-unloading` × 40 · `sectors:` batch 2 (58) | 3 |
| 7 | Tue 13 Oct | **Wave 3A** — heavy-lift ×50, hvac-chiller ×40 · internal-link mesh | 3 |
| 8 | Fri 16 Oct | **Wave 3B** — transformer ×35, mri-medical ×30 · schema cleanup | 3 |
| 9 | Tue 20 Oct | **Wave 3C** — lab ×25, printing ×25, data-center ×20 · **measurement folded in** | 3 |
| 10 | Fri 23 Oct | Savannah/Charleston + weakest-page depth pass · month review | 4 |

**Totals: 501 new service×city pages · 19 dispatch pages · 32 articles.**

### Wave 2 and wave 3 are no longer gated on the retitle
They test different things. The retitle tests whether *titles* fix CTR on pages
that already rank; the waves test whether *new service matrices* rank at all.
Holding one for the other was over-cautious. They run in parallel and get judged
separately.

### Wave 3 stays sector-matched
A service only goes to metros where that sector exists — data-centre rigging to
data-centre metros, transformer to energy and utility metros. That match is what
makes 225 pages defensible rather than 225 templates, and it is why `sectors:`
research is scheduled ahead of wave 3 rather than after it.

---

## Guardrails, built in run 1 so volume can't go wrong quietly

These go into `build.js` verify and **fail the build**:

1. **No sub-city URLs.** Any path whose slug is not a full city in `locations.json`.
2. **No dispatch geo URLs.** Any `truck-dispatch/{anything}` path.
3. **Uniqueness floor.** Every service×city page needs ≥6 city-specific tokens
   — sector phrase, ≥15 named suburbs, state interstates, ≥2 local anchors,
   service-specific equipment vocabulary. Below that, the build stops.
4. **Matrix cap.** Per-service city counts must match the declared wave size;
   silent growth fails.
5. **Positioning lint on the generators.** `check-content.js` only lints
   `content/services` today, which is how "Heavy Equipment Moving" survived on
   88 city titles after being retired. Extend it to the generated matrix.

## Every run, standing
1. `node scripts/check-content.js <slug>` on each article
2. `node build.js` — **full chain, never a bare generator**
3. Commit, push, `node ping-search-engines.js`
4. Live: 200 and not a stub · in `sitemap.xml` and `llms.txt` · Article +
   FAQPage schema parse
5. **Analysis rides along** — pull whatever GSC numbers the batch touches and
   put them in the log entry. No separate survey run.
6. Append to `seo/log.md`, push

## Run 9 — the measurement, folded in, not instead of shipping

| page | was 21 Sep | target |
|---|---|---|
| machinery-moving/omaha-ne | 691 impr · pos 67.5 · 0 clk | a click, or pos < 50 |
| machinery-moving/savannah-ga | 607 · 21.0 · 0 | clicks > 0 |
| machinery-moving/charleston-sc | 496 · 29.8 · 0 | pos < 25 |
| rigging/savannah-ga | 362 · 25.6 · 0 | pos < 20 |
| rigging/akron-oh | 101 · 18.0 · 0 | clicks > 0 |
| **site non-brand clicks** | **4 of 120** | **> 10** |

If it has not moved, say so in the log rather than retitling again — that result
means the constraint is authority, and run 10 turns into depth and real project
facts instead of more pages.

`cnc-machine-movers` (50% indexed, breaches the 40%-dark rule) is decided here
too, with the data in front of Sam.

## Out of scope all month
- **Google Ads** — Monday task, separate
- **Sub-city URLs** — covered on the city page, never their own pages
- **Dispatch geo pages** — ever
- **Backlink chasing** — last audit 67 of 96 toxic; off-site auto-posting off limits

## The one thing only Sam can supply
Real project stories — equipment, weight, city, constraint, outcome, photos.
Competitors' #1 trust signal. 853 pages of good template plus six real jobs
beats 853 pages of good template. Ask once per run until it exists.
