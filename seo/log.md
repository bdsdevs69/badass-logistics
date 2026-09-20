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


---

## 2026-09-21 — Search Console access restored + the stub fix it exposed

Not a content run. The M2 was formatted, so `gsc-key.json` was gone for good —
this was the run that got it back and then acted on what it showed.

**Credential.** The service account survived the format: `badass-gsc-reader@…`
was still on the property with Full permission, so this was a key reissue, not
a rebuild. Installed gcloud, reissued the key into the repo root (gitignored,
chmod 600), and deleted the orphaned 2026-07-12 key that the M2 had held —
confirmed gone (IAM returns 404 on it, 200 on the new one). Both halves of
`ping-search-engines.js` work now; `204 ✓ resubmitted` is the first successful
Google sitemap submit since the M2 died. Google had last pulled the sitemap on
2026-09-17 at 642 URLs, four days and 8 URLs stale. Details and the reissue
one-liner are in `seo/routine.md`, which no longer tells the run to submit by
hand. Full write-up in the GSC access memory.

**First look at 90 days of data:**

| | |
|---|---|
| sitemap URLs | 650 |
| earning impressions | 504 (78%) |
| earning zero | 146 (22%) |
| clicks | 120 — **116 brand, 4 non-brand** |

Service × city indexation, which the geo plan was gated on: rigging 94%,
machinery-moving 93%, plant-relocation 75%, **cnc-machine-movers 50%**.
Overall 78% against a 40%-dark kill switch, so wave 2 is cleared — but
**cnc-machine-movers breaches the rule on its own** and under the standing
policy gets consolidated into state hubs rather than expanded.

**The real finding: 133 retired redirect stubs were pulling 6,879 impressions
over 90 days**, led by `/blog/step-deck-vs-drop-deck-trailers` at 1,729 and
`/services/heavy-haul` at 613. Every one of them was titled
`Moved: /a → /b` — a debug string, served to searchers, guaranteeing 0% CTR.

URL Inspection showed why the noindex on them wasn't helping: heavy-haul,
multi-axle-transport and step-deck-vs-drop-deck-trailers all came back
**"Submitted and indexed"** after crawls on 2026-09-06..12. The noindex was
doing nothing except contradicting the canonical — noindex says drop this URL,
canonical says fold it into that one, and the noindex blocks the consolidation
the canonical exists to get.

Fixed in `build-redirects.js`: stubs now inherit the destination's title and
description, keep the canonical and the instant meta refresh, and carry no
robots directive. 149 stubs rewritten, verified live.

**A theory I had that turned out wrong**, recorded so nobody re-runs it: the
13 canonical targets showing zero impressions (project-freight, crane-services,
heavy-lift-rigging, truck-dispatch, dedicated-lanes) looked like noindex
contamination bleeding into live pages. It wasn't — `git log` shows every one
of them was created 2026-09-17, so the 90-day window covers a single day of
their existence. URL Inspection confirms all five are indexed and healthy.

**Verify:** full `node build.js` after the change, all checks passed —
67,807 internal links 0 broken, 661 pages 0 duplicate titles, sitemap 650 URLs
0 bad, 149 stubs intact. `build.js` itself needed no change: its verify already
excludes stubs at line 69. I patched it first on a misreading and reverted.

**Checks:** all four sample stubs live with the destination's title, no
noindex, description present. Controls (`/services/project-freight`,
`/services/rigging/detroit-mi`, `/blog/how-to-move-a-compressor`) all 200 and
unchanged. Sitemap still 650 with zero stubs in it. IndexNow 200 on the 16
highest-impression stubs; sitemap resubmitted, Google now reading 650 URLs.

**Worth Sam's attention:**
- **4 non-brand clicks out of 120.** 9,979 impressions in 28 days converting
  almost entirely on brand. That is a position-and-CTR problem, not a coverage
  problem, and it argues for fixing what exists before building wave 2.
- **Savannah and Charleston are a genuine unserved cluster** — "rigging
  contractors savannah ga" 139 impressions at position 23, and a dozen more
  like it. Those pages exist and rank on page 2-3.
- **Retired heavy-haul demand is still substantial** — oversize/overweight/
  multi-axle queries across Minneapolis, Detroit, Indiana, Phoenix, Pittsburgh.
  Deliberately not served. Noting it, not chasing it.


---

## 2026-09-21 — step 0b: retitle the city matrix on query data

The geo plan's new first step — fix what already ranks before building more.
Driven entirely by the Search Console data that came back the same day, not by
a brainstorm.

**What the query data said.** Head-noun demand across 90 days, all of it at
zero clicks:

| phrase | impressions | avg position | on the site before today? |
|---|---|---|---|
| machinery moving | 1,324 | 38.9 | yes |
| plant / factory relocation | 1,077 | 53.6 | yes |
| machinery movers | 1,036 | 30.9 | yes |
| heavy machinery movers | 475 | 38.8 | retired wording |
| equipment movers | 459 | 46.3 | partly |
| **rigging contractors** | **358** | **26.5** | **no — word appeared nowhere** |
| rigging company/companies | 286 | 20.6 | yes |
| **riggers / rigger** | **233** | **27.5** | **no** |
| industrial rigging | 206 | 15.0 | yes |

The pattern is clean: **the terms already in our titles rank best (industrial
rigging 15.0, rigging company 20.6); the ones missing rank worst (contractors
26.5, riggers 27.5).** "rigger akron oh" alone is 100 impressions at position 17.

**Changes shipped, all in `build-service-cities.js` so the matrix stays generated:**

1. **Rigging title** → `Rigging Company & Contractors in {City}, {ST}`. Keeps the
   two proven terms, adds the 358-impression miss.
2. **Machinery title** → `Machinery Moving Company in {City}, {ST}`. Leads with
   the weaker term (23-24) since H1 and description already carry "machinery
   movers" (14-20), so both are covered.
3. **"Heavy Equipment Moving" removed from 88 machinery city titles.** It was
   retired as a service name on 2026-09-18 for reading as heavy haul, and
   survived only because `check-content.js` lints `content/services` and never
   this generator. Worth a guard later.
4. **Descriptions were one boilerplate line across all 352 pages.** Each service
   now has its own carrying the vocabulary its queries use, 146-163 chars.
5. **New rigging FAQ on all 88 city pages** — "Are you a rigging contractor or a
   machinery mover?" — putting both missing terms in real prose rather than meta
   alone, and linking the crane-rental post shipped in run 2. FAQPage schema now
   6 entries.

**Verify:** full `node build.js`, all green — 67,895 internal links 0 broken,
661 pages 0 duplicate titles and 0 duplicate descriptions, sitemap 650 URLs
0 bad. All seven highest-impression pages confirmed live with the new titles.
IndexNow 200 on the 16 demand-carrying URLs, sitemap resubmitted.

**BASELINE — re-measure on or after 2026-10-19 (4 weeks).** This is the point
of the change and it is falsifiable:

| page | impr (90d) | position | clicks |
|---|---|---|---|
| /services/machinery-moving/omaha-ne | 691 | 67.5 | 0 |
| /services/machinery-moving/savannah-ga | 607 | 21.0 | 0 |
| /services/machinery-moving/charleston-sc | 496 | 29.8 | 0 |
| /services/rigging/savannah-ga | 362 | 25.6 | 0 |
| /services/rigging/charleston-sc | 260 | 31.6 | 0 |
| /services/machinery-moving/tulsa-ok | 203 | 12.3 | 0 |
| /services/rigging/akron-oh | 101 | 18.0 | 0 |
| **site non-brand clicks** | — | — | **4 of 120** |

If non-brand clicks have not moved off 4 and the "rigging contractors" cluster
is still at position 26 with no clicks in four weeks, the title theory is wrong
and the problem is authority, not wording — which is what §1 of the geo plan
argues anyway. Say so in the log rather than retitling again.

**Deliberately not done:** the `cnc-machine-movers` consolidation. It is at 50%
indexed and breaches the 40%-dark rule, so under the standing policy it should
fold into its state hubs — but that removes 88 live pages and is Sam's call, not
a routine action. Flagged, not executed.
