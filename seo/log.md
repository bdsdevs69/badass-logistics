# SEO run log

Semi-weekly runs per `seo/routine.md`. Newest entry at the bottom.
Run count matters: every fourth run does the wider sweep instead of
just the per-run checks.

---

## 2026-09-18 — run 1

**Shipped:** `blog/how-to-move-a-linear-accelerator` — first medical-cluster
item off the queue. 1,772 body words, 6 FAQ entries, 10 H2s, question-shaped.
Links to medical rigging, machinery removal, crane services, heavy-lift
rigging, the MRI post, the CT post and the relocation checklist. Queue item
flipped to done; 11 todo items remain, so no backfill needed yet.

**Verify:** `node build.js` full chain, all checks passed — city mesh 352/352,
67,226 internal links with 0 broken, 0 links to retired URLs, 0 duplicate
titles, 0 heavy-haul leakage, sitemap 643 URLs 0 bad, phone + department email
on 654/654 pages.

**Checks:**
- New URL returns 200 live (404 on first poll, 200 after the Pages deploy).
  `/services/mri-medical-equipment-rigging` and `/blog/how-to-move-an-mri-machine`
  both 200, neither a stub. `/services/heavy-haul` still serves its redirect stub.
- Post is in the live `sitemap.xml` and the live `llms.txt`.
- All three JSON-LD blocks parse on the live page: Article, BreadcrumbList,
  FAQPage with 6 entries. Quick-answer box rendered, canonical self-referencing.
- IndexNow: HTTP 200 accepted, 638 URLs.

**Fixed along the way:** `scripts/check-content.js` — the step-2 gate in the
routine — only ever looked in `content/services/`, so running it on a blog slug
errored out and no blog post had ever actually been gated. It now validates a
`content/blog-new/<slug>.js` module against the routine's own non-negotiables
(tldr 40-70 words, 4-6 FAQ entries, 1,200-2,000 body words, hero image exists,
relative links resolve) plus the same positioning lint as service pages.
Service-page checking is unchanged.

**Not done / needs Sam:**
- Google sitemap resubmit. `gsc-key.json` is still only on the old M2 machine,
  so `ping-search-engines.js` skipped the Google half. **Submit `sitemap.xml`
  by hand in the Search Console UI.** Copying that key over would close this
  out permanently.
- No Search Console data available to this run, so the positions 5-15 sweep and
  the city-page indexation rule are untouched. Both belong to run 4.
- Minor, cosmetic: `build-sitemap.js` derives `lastmod` from UTC, and runs
  happen in the early hours PKT, so a page built today gets yesterday's date.
  Harmless — noting it so it isn't chased later as a bug.


---

## 2026-09-18 — run 1b (same day, extra batch)

Sam pushed back on one post per run, so the rest of the medical cluster went
out the same night. The one-post cadence in `seo/routine.md` is the file's own
rule, not a constraint of the run — worth deciding whether that rule still
stands, because the queue drains four times faster at this pace.

**Shipped:** three more posts, closing the medical cluster the queue
front-loaded as a paid theme.

| slug | words | FAQ |
|---|---|---|
| `how-to-move-an-x-ray-machine` | 1,422 | 5 |
| `hospital-equipment-relocation-guide` | 1,272 | 6 |
| `how-much-does-it-cost-to-move-medical-equipment` | 1,290 | 5 |

All four medical posts cross-link to each other and into the MRI and CT posts,
so the cluster now has an internal mesh instead of four orphans hanging off the
service page. Queue items flipped to done — 8 todo remain, all machinery and
crane. Next up is `how-to-move-an-injection-molding-machine`.

**Gate caught two real problems** on the cost post before it shipped — a 169
char description and a 1,129 word body, both under the routine's own
non-negotiables. Fixed by tightening the description and adding the storage
and staging section. That is the new blog branch of `scripts/check-content.js`
doing exactly what it was added for, on its first run.

**Verify:** full `node build.js`, all checks passed — 67,474 internal links
0 broken, 657 pages 0 duplicate titles, sitemap 646 URLs 0 bad.

**Checks:** all three URLs 200 live after the Pages deploy. Article,
BreadcrumbList and FAQPage all parse on each; quick-answer box rendered on all
three. All three present in the live `sitemap.xml` and `llms.txt`. IndexNow
HTTP 200 accepted, 640 URLs.

**Still needs Sam:** the Search Console sitemap resubmit by hand — four new
URLs now, not one. `gsc-key.json` is still only on the M2.

**Next run:** `how-to-move-an-injection-molding-machine` (machinery cluster).
**Run 4 is the wider sweep.**


---

## 2026-09-18 — run 2

**Shipped:** four posts, taken in queue order off the machinery and crane
clusters. Batch pace rather than one-per-run, per Sam's pushback in run 1b.

| slug | words | FAQ |
|---|---|---|
| `how-to-move-an-injection-molding-machine` | 1,750 | 6 |
| `switchgear-and-substation-equipment-moving` | 1,581 | 6 |
| `crane-rental-vs-rigging-company` | 1,463 | 6 |
| `how-to-move-a-compressor` | 1,608 | 6 |

All four cleared `scripts/check-content.js` with **zero warnings** — first time
a batch has gone through the gate clean on the first pass. The crane post is
deliberately decision-stage: it is the page the crane ad group has been missing,
and it answers "crane rental or rigging company" without needing a price.

Queue items flipped to done. **4 todo remain** (`forklift-vs-crane-for-machine-loading`,
`what-is-a-machinery-move-survey`, `how-to-move-a-data-center`,
`how-to-move-a-transformer-into-a-building`) — exactly at the routine's backfill
threshold, so the next run should add topics, and they need to come from Search
Console impressions rather than a brainstorm. That is blocked on the same missing
GSC access as everything else below.

**One link removed:** the crane post originally linked forward to
`forklift-vs-crane-for-machine-loading`, which is still a queue item. The gate
caught it as a link to a missing blog. Repointed at the forklift loading service
page. Worth remembering that forward links to unwritten queue items will always
fail the gate — write the linked post first or link the service page.

**Verify:** full `node build.js` chain, all checks passed — city mesh 352/352,
67,807 internal links 0 broken, 0 links to retired URLs, 661 pages 0 duplicate
titles and 0 duplicate descriptions, 0 heavy-haul leakage, sitemap 650 URLs 0 bad,
phone + department email on 661/661.

**Checks:**
- All four URLs 200 live after the Pages deploy (404 on the first poll, 200 on
  the second). Not stubs — canonical self-referencing, full body served.
  `/services/crane-services` and `/blog/how-to-move-a-linear-accelerator` both 200.
  `/services/heavy-haul` still serves its redirect stub as intended.
- All four present in the live `sitemap.xml` (650 URLs) and the live `llms.txt`.
- Article, BreadcrumbList and FAQPage all parse on all four live pages, 6 FAQ
  entries each. Quick-answer box rendered on all four.
- IndexNow: HTTP 200 accepted, 16 URLs (new + changed only this run).

**Still needs Sam:**
- **Submit `sitemap.xml` by hand in the Search Console UI** — four more new URLs.
  `gsc-key.json` is still only on the M2, so `ping-search-engines.js` skipped the
  Google half again. This is the third run in a row it has been skipped; copying
  that one file over closes it permanently and also unblocks the queue backfill.

**Not done:** the wider sweep — Search Console coverage, the city-page indexation
rule, positions 5-15, and the AI-citation spot check. **Run 4 is the sweep**, and
it needs Search Console access to be worth anything.

**Next run:** `forklift-vs-crane-for-machine-loading` (pairs with the crane post
shipped today, and that post wants the link back).
