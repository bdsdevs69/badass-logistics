# Mon/Fri plan — 2026-09-21 → 2026-10-23

Ten sessions. Written 2026-09-21 so Sam can edit it before it runs.
Edit this file directly; the runs read it.

**Cadence change needed:** the `badass-seo-semiweekly` task is currently
`0 11 * * 2,5` (Tue/Fri). This plan assumes **Mon/Fri** — say the word and
I'll flip the cron. Monday already has `badass-ads-weekly` at 18:05; the SEO
run is 11:00, so they coexist. **Ads stays out of scope here either way.**

## The shape of the month, and why

The data from 2026-09-21 says the constraint is **position and CTR on pages
that already exist**, not missing pages: 9,979 impressions, 120 clicks, 116 of
them brand. So the month is weighted toward making the existing 352 pages earn,
and **wave 2 expansion does not start until 19 Oct proves the retitle worked.**

Everything hinges on one date. **Mon 19 Oct** is the 4-week re-measure of the
baseline in `seo/log.md`. Two decisions are gated on it: whether wave 2 starts,
and whether `cnc-machine-movers` consolidates.

---

## Sessions

### ✅ Mon 21 Sep — done
Search Console access restored, 149 redirect stubs fixed, city matrix retitled
on query data, 1,682-town suburb coverage shipped. Logged.

### Fri 25 Sep — content + queue backfill
- **Post:** `forklift-vs-crane-for-machine-loading`. It is next in the queue and
  the crane post shipped in run 2 wants the link back.
- **Backfill the content queue.** It is down to 4 items, which is the routine's
  own threshold. Now that Search Console works, the 397 uncovered queries are
  the source — not a brainstorm. Target 10+ items, each with the impression
  count that justifies it.
- Standing checks.

### Mon 28 Sep — content + the port cluster
- **Post:** `what-is-a-machinery-move-survey`.
- **Savannah + Charleston deep pass.** Between them 1,771 impressions at
  positions 20–30 and zero clicks — the densest unserved demand on the site.
  Four pages get genuine local depth: the port, the terminals, the industrial
  corridors, what actually moves there. This is the test of whether depth moves
  a page that is already indexed and ranking.
- Standing checks.

### Fri 2 Oct — content + sector data (wave 3 blocker)
- **Post:** `how-to-move-a-data-center`.
- **`sectors: []` research, batch 1 — 30 metros.** No dataset supplies this;
  it is per-metro research from real anchors (health systems, data-centre
  campuses, print plants, utility territories). Wave 3 cannot be honest without
  it. Written to `data/metros.json` with the anchor named for each entry.
- Standing checks.

### Mon 5 Oct — WIDE SWEEP (every 4th run)
- Search Console coverage; the "Crawled – currently not indexed" count on
  service-city pages, per matrix.
- Positions 5–15 — the cheapest wins, re-pulled.
- **First read on the retitle.** Two weeks in, so signal only, not a verdict.
  If the "rigging contractors" cluster has not moved off position 26 at all,
  say so; do not start explaining it away.
- Ask ChatGPT and Perplexity two money questions, note whether the site is
  cited. Only honest AEO scoreboard available without paid tools.
- No post this run. The sweep is the work.

### Fri 9 Oct — content + sector data batch 2
- **Post:** `how-to-move-a-transformer-into-a-building` (last of the original queue).
- **`sectors: []` batch 2** — remaining 58 metros.
- Standing checks.

### Mon 12 Oct — content + internal-link mesh
- **Post:** first item off the backfilled queue.
- **Internal-linking mesh.** Ranked #1 on the pending roadmap from the July
  audit, and it is the direct lever on the authority problem that audit
  identified — Memphis ranked #2 and #47 on identical templates, which is a
  link-graph difference, not a content one.
- Standing checks.

### Fri 16 Oct — content + schema cleanup
- **Post:** next backfilled item.
- **Schema cleanup**, roadmap item 2. Audit what every page type emits, fix
  what is wrong or duplicated, make sure the Service/LocalBusiness/FAQPage
  blocks agree with each other.
- Standing checks.

### Mon 19 Oct — THE MEASUREMENT
No post. This session decides the next quarter.

Re-pull the baseline table from `seo/log.md` (2026-09-21 entry):

| page | was | target |
|---|---|---|
| machinery-moving/omaha-ne | 691 impr, pos 67.5, 0 clicks | any click, or position < 50 |
| machinery-moving/savannah-ga | 607, 21.0, 0 | clicks > 0 |
| machinery-moving/charleston-sc | 496, 29.8, 0 | position < 25 |
| rigging/savannah-ga | 362, 25.6, 0 | position < 20 |
| rigging/akron-oh | 101, 18.0, 0 | clicks > 0 |
| **site non-brand clicks** | **4 of 120** | **> 10** |

Then three decisions, stated plainly in the log:

1. **Did the retitle work?** If non-brand clicks have not moved and the
   contractors cluster is still at 26 — the title theory was wrong, the problem
   is authority, and the month after this one is links and depth, not pages.
   Write that down rather than retitling again.
2. **Wave 2: go or hold.** Only starts if 0b showed movement.
3. **`cnc-machine-movers`: consolidate or keep.** It is at 50% indexed against
   a 40%-dark kill switch. Held until now because consolidating mid-experiment
   would have made the measurement unreadable. Sam's call, with the data in front
   of him.

### Fri 23 Oct — act on the verdict
Whichever way 19 Oct goes:
- **If the retitle worked:** wave 2 service #1 — `millwright-services` × 88.
  One service, then an 8-week gate before the next. Not all four at once.
- **If it did not:** pivot to authority and depth. No new pages. Rewrite the
  weakest 20 city pages with real job facts, and put the case to Sam for the
  one thing only he can supply — real project stories with equipment, weights
  and photos, which is the competitors' #1 trust signal and the thing no
  amount of generated text substitutes for.

---

## Standing checklist, every content run

1. `node scripts/check-content.js <slug>` — gate before anything else
2. `node build.js` — **always the full chain, never a bare generator**
3. Commit, push, `node ping-search-engines.js`
4. New URL returns 200 and is not a stub; in `sitemap.xml` and `llms.txt`;
   Article + FAQPage schema parse on the live page
5. Append to `seo/log.md`, push

## Out of scope all month

- **Google Ads** — that is `badass-ads-weekly`, Monday 18:05, separate task
- **New location pages** — the matrix is capped; sub-cities are covered on the
  city page and never get their own URLs
- **Dispatch geo pages** — dispatch stays off the geo grid entirely
- **Backlink chasing** — last audit came back 67 of 96 toxic; off-site
  auto-posting is off limits

## What would make me change this plan mid-month

- Non-brand clicks move sharply either way before 19 Oct → bring the
  measurement forward and act sooner
- A matrix drops below 60% indexed → stop adding, consolidate that matrix
- Search Console shows a manual action or a coverage collapse → everything
  else stops
- Sam edits this file → that wins over everything above
