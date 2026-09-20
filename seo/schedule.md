# Tue/Fri plan — 2026-09-22 → 2026-10-23

Ten runs. Written 2026-09-21 so Sam can edit it before any of it happens.
Edit this file directly — the runs read it, and it wins over anything below.

**No cron change needed.** `badass-seo-semiweekly` is already `0 11 * * 2,5`
(Tue/Fri 11:00). Monday stays the Ads run (`badass-ads-weekly`, 18:05) and
**ads are out of scope here.**

## The shape of the month, and why

The Search Console data from 2026-09-21 says the constraint is **position and
CTR on pages that already exist**, not missing pages: 9,979 impressions, 120
clicks, 116 of them brand. So the month is weighted toward making the existing
352 pages earn, and **wave 2 expansion does not start until run 9 proves the
retitle worked.**

Everything hinges on **Tue 20 Oct** — the 4-week re-measure of the baseline in
`seo/log.md` (29 days after it was set). Two decisions are gated on it: whether
wave 2 starts, and whether `cnc-machine-movers` consolidates.

**Sweep counter:** 2026-09-21 already did most of a wide sweep — coverage,
indexation per matrix, positions 5–15, the 397 uncovered queries. The only
piece missing was the AI-citation check. So the counter restarts there and the
next sweep is run 4.

---

| # | Date | Post | Second thing |
|---|---|---|---|
| 1 | Tue 22 Sep | forklift-vs-crane | Backfill the queue from GSC |
| 2 | Fri 25 Sep | machinery-move-survey | Savannah + Charleston depth |
| 3 | Tue 29 Sep | data-center | `sectors:` batch 1 (30 metros) |
| 4 | Fri 2 Oct | — | **WIDE SWEEP** |
| 5 | Tue 6 Oct | transformer-into-building | `sectors:` batch 2 (58 metros) |
| 6 | Fri 9 Oct | backfilled #1 | Internal-link mesh |
| 7 | Tue 13 Oct | backfilled #2 | Schema cleanup |
| 8 | Fri 16 Oct | backfilled #3 | Quiet run — content only |
| 9 | Tue 20 Oct | — | **THE MEASUREMENT + 3 decisions** |
| 10 | Fri 23 Oct | — | Act on the verdict |

---

## Run 1 — Tue 22 Sep · content + queue backfill
- **Post:** `forklift-vs-crane-for-machine-loading`. Next in the queue, and the
  crane post from run 2 wants the link back.
- **Backfill the content queue.** Down to 4 items, which is the routine's own
  threshold. Source is the 397 uncovered GSC queries — not a brainstorm. Target
  10+ items, each carrying the impression count that justifies it.

## Run 2 — Fri 25 Sep · content + the port cluster
- **Post:** `what-is-a-machinery-move-survey`.
- **Savannah + Charleston deep pass.** 1,771 impressions between them at
  positions 20–30, zero clicks — the densest unserved demand on the site. Four
  pages get real local depth: the port, the terminals, the industrial corridors,
  what actually moves there. This is the clean test of whether *depth* moves a
  page that is already indexed and ranking.

## Run 3 — Tue 29 Sep · content + sector data
- **Post:** `how-to-move-a-data-center`.
- **`sectors: []` batch 1 — 30 metros.** No dataset supplies this; it is
  per-metro research from real anchors (health systems, data-centre campuses,
  print plants, utility territories). Wave 3 cannot be honest without it. Each
  entry names its anchor.

## Run 4 — Fri 2 Oct · WIDE SWEEP (no post)
- Coverage and "Crawled – currently not indexed", per matrix.
- Positions 5–15, re-pulled.
- **First read on the retitle.** Ten days in, so signal only, not a verdict. If
  the "rigging contractors" cluster has not moved off position 26 at all, say so
  — do not start explaining it away.
- Ask ChatGPT and Perplexity two money questions; note whether the site is
  cited. The piece the 21 Sep sweep missed, and the only honest AEO scoreboard
  without paid tools.

## Run 5 — Tue 6 Oct · content + sector data
- **Post:** `how-to-move-a-transformer-into-a-building` — last of the original queue.
- **`sectors: []` batch 2** — the remaining 58 metros.

## Run 6 — Fri 9 Oct · content + internal-link mesh
- **Post:** first item off the backfilled queue.
- **Internal-linking mesh.** Ranked #1 on the pending roadmap from the July
  audit and the direct lever on the authority problem that audit found —
  Memphis ranked #2 and #47 on identical templates, which is a link-graph
  difference, not a content one.

## Run 7 — Tue 13 Oct · content + schema cleanup
- **Post:** next backfilled item.
- **Schema cleanup**, roadmap item 2. Audit what every page type emits; fix
  what is wrong or duplicated; make the Service / LocalBusiness / FAQPage
  blocks agree with each other.

## Run 8 — Fri 16 Oct · quiet run
- **Post only.** Deliberately light, four days before the measurement — nothing
  that would muddy it.

## Run 9 — Tue 20 Oct · THE MEASUREMENT (no post)
This run decides the next quarter. Re-pull the baseline from `seo/log.md`:

| page | was (2026-09-21) | target |
|---|---|---|
| machinery-moving/omaha-ne | 691 impr · pos 67.5 · 0 clicks | a click, or pos < 50 |
| machinery-moving/savannah-ga | 607 · 21.0 · 0 | clicks > 0 |
| machinery-moving/charleston-sc | 496 · 29.8 · 0 | pos < 25 |
| rigging/savannah-ga | 362 · 25.6 · 0 | pos < 20 |
| rigging/akron-oh | 101 · 18.0 · 0 | clicks > 0 |
| **site non-brand clicks** | **4 of 120** | **> 10** |

Then three decisions, written plainly in the log:

1. **Did the retitle work?** If non-brand clicks have not moved and the
   contractors cluster is still at 26 — the title theory was wrong, the problem
   is authority, and the next month is links and depth, not pages. Write that
   down rather than retitling again.
2. **Wave 2: go or hold.** Only starts if the retitle showed movement.
3. **`cnc-machine-movers`: consolidate or keep.** At 50% indexed against a
   40%-dark kill switch. Held until now because consolidating mid-experiment
   would have made this measurement unreadable. Sam's call, data in front of him.

## Run 10 — Fri 23 Oct · act on the verdict
- **If the retitle worked:** wave 2 service #1 — `millwright-services` × 88.
  One service, then an 8-week gate before the next. Not all four at once.
- **If it did not:** no new pages. Rewrite the weakest 20 city pages with real
  job facts, and put to Sam the one thing only he can supply — real project
  stories with equipment, weights, cities and photos. That is the competitors'
  #1 trust signal and the thing no amount of generated text substitutes for.

---

## Standing checklist, every content run
1. `node scripts/check-content.js <slug>` — the gate, before anything else
2. `node build.js` — **always the full chain, never a bare generator**
3. Commit, push, `node ping-search-engines.js`
4. New URL 200 and not a stub; in `sitemap.xml` and `llms.txt`; Article +
   FAQPage schema parse on the live page
5. Append to `seo/log.md`, push

## Out of scope all month
- **Google Ads** — `badass-ads-weekly`, Monday 18:05, separate task
- **New location pages** — matrix is capped; sub-cities are covered on the city
  page and never get their own URLs
- **Dispatch geo pages** — dispatch stays off the geo grid entirely
- **Backlink chasing** — last audit came back 67 of 96 toxic; off-site
  auto-posting is off limits

## What would change this plan mid-month
- Non-brand clicks move sharply either way before run 9 → bring the measurement
  forward and act sooner
- Any matrix drops below 60% indexed → stop adding, consolidate that matrix
- A manual action or coverage collapse in Search Console → everything else stops
- **Sam edits this file → that wins over all of the above**
