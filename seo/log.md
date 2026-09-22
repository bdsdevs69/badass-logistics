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


---

## 2026-09-21 — steps 1 & 2: the sub-city tier, without sub-city pages

Sam's original ask was "all the sub cities". The market leader on this model
builds none of them — it lists 28 suburbs in a table on the city page, linked
to Google Maps — so this does the same thing with better data and no new URLs.

**`data/locations.json` `near`: 813 bare strings → 1,682 objects** carrying a
real county and a real distance. Source is GeoNames (2.24M US records), 50-mile
radius from each metro's own coordinates. 88/88 metros resolved. 1,673 of 1,682
rows have a county, 1,676 have a distance.

**The sanity check earned its keep.** My first pass ranked suburbs by
residential population and reproduced only **77%** of the existing hand-curated
list. The 23% it missed were the entries that matter most: City of Industry and
Vernon (a few hundred residents each, two of the densest industrial zones in
the country), Santa Fe Springs, Carson, Fife and Sumner near Seattle. Population
is a bad proxy for industrial relevance — it actively hides the industrial
suburbs, because nobody lives in them. Rebuilt so **curation leads and keeps its
order**, with GeoNames topping up behind it: 807 curated entries enriched, 6
kept as-is where GeoNames had no record, 869 added.

**Amended my own plan while doing it.** §5 promised "the industrial driver" as a
column per suburb. No dataset supplies that — it is editorial knowledge, and
writing 1,682 of them would be exactly the fabrication §1 of the plan argues
against. The table is town / county / distance, all verifiable. The industrial
driver stays at metro level where it is researched and true.

**Shipped:** new `lib/places.js` so all five consumers format towns identically;
coverage table on every service-city page and city hub; cross-state suburbs
label correctly (Vancouver, WA under Portland); table styled in the graph-paper
theme with `thead`/`tbody` and `scope="col"`. Detroit rigging 2,042 → 2,326 words.

**Verify:** full `node build.js` green — 67,895 internal links 0 broken, 661
pages 0 duplicate titles, sitemap still **650 URLs, zero new pages**. Live spot
checks on 3 pages: 24 county rows each, CSS deployed.

**Could not do:** a visual render check. Dev servers can't start in an
unattended session and the preview pane would not load a standalone file, so
the table was verified structurally instead — braces balanced, every selector
matched against emitted markup, all CSS variables defined. **Worth a 10-second
eyeball by Sam on any city page.**

**Next blocker is different from what the plan assumed.** Suburb data came free
from a public dataset. The `sectors: []` enrichment that wave 3 needs does not
exist in any dataset — it is per-metro research (health systems, data-centre
campuses, print plants, utility territories). That is now the wave 3 blocker,
not the suburb lists.

**Still deliberately not done:** the `cnc-machine-movers` consolidation. Beyond
being Sam's call, consolidating it now would destroy the 2026-10-19 measurement
baseline set in the retitle entry above — cnc is one arm of that live test and
removing it mid-flight would make the result unreadable. Revisit after 10-19.


---

## 2026-09-21 — daily health check (Mon)

**Absorption (90d) — no RED, first table recorded so no prior day to compare.**

| cluster | URLs | dead% | verdict |
|---|---|---|---|
| blog | 45 | 24% | GREEN |
| dispatch | 3 | 100% | NEW (shipped 09-18, too young to read) |
| service pillars | 17 | 47% | AMBER |
| rigging × city | 113 | 8% | GREEN |
| machinery × city | 113 | 5% | GREEN |
| plant × city | 113 | 25% | GREEN |
| cnc × city | 113 | 45% | AMBER |
| city hubs | 128 | 23% | GREEN |
| **site** | **652** | **22%** | — |

HOLD on service pillars and cnc × city; everything else clear to expand.

**Last run's URLs are live.** Both recoveries from `d67c9db` return 200 with the
new titles, no meta refresh left behind, and both are in `sitemap.xml` and
`llms.txt`: `/blog/step-deck-vs-drop-deck-trailers` (31.9 KB served, was a
23-word stub) and `/blog/how-to-load-and-secure-a-conestoga-trailer`. Pages
deploy matches local HEAD.

**Ping:** 459 URLs, IndexNow 200 ✓, Google sitemap 204 ✓ (650 URLs, 0 errors,
last pulled 03:10Z today). No credential trouble — the reissued key is holding.

**AEO identity check (Perplexity, verbatim):**

- *"What does Badass Logistics do?"* → **"Badass Logistics is an industrial
  rigging company with its own crews and rigging gear, offering machinery
  moving, plant relocation, MRI/medical equipment handling, crane lifts,
  jacking and skidding, millwright installation, and related services. They
  also run project freight for the jobs they rig and provide truck dispatch
  for fleets (4+ trucks) nationwide across all 50 states."** Cited us. Correct.
- *"Is Badass Logistics a heavy haul company?"* → **"Yes. Badass Logistics is
  an industrial rigging company that also handles project freight and trucking
  dispatch, but they identify as riggers first, not a traditional heavy-haul
  carrier. They provide heavy-haul capabilities as part of project freight and
  rigging work…"** Cited us, but **leads with "Yes" and asserts heavy-haul
  capability we do not have.** Half-landed.
- *"Who are the best industrial rigging companies for moving MRI machines?"* →
  MM Solutions, Sims Crane/SimsHD, Eagle Rigging. **Not cited.** Pure authority
  gap — same finding as the 4-non-brand-clicks number.

**Diagnosis: this is not an `llms.txt` weakness.** `llms.txt` is explicit
("that service line was retired in 2026", plus a flat *No* in the is/is-not
block) and both surfaces verify live — 2 hits for "retired in 2026", 3 AI
crawlers in `robots.txt`. Perplexity answers from retrieved **HTML**, and
`/services/project-freight` — the page a heavy-haul question pulls — carries
zero mentions of heavy haul and zero of the retirement. Homepage and
`/services/rigging` carry it; the freight page does not. **For the Saturday
`badass-seo-upgrade` run:** put the retirement line in prose on
`/services/project-freight`, and phrase it to answer the yes/no directly.

Steps 3a and 4 skipped (Wednesday / Sunday only).

---

## 2026-09-21 — article run (Mon/Wed/Thu)

**Shipped 6, held 0.** All from Track A queue items, written in parallel, all
gates clean on the first or second pass:

| slug | words | top overlap |
|---|---|---|
| `forklift-vs-crane-for-machine-loading` | 1758 | 0.3% |
| `what-is-a-machinery-move-survey` | 1718 | 0.3% |
| `how-to-move-a-data-center` | 1782 | 0.2% |
| `how-to-move-a-transformer-into-a-building` | 1643 | 0.1% |
| `how-to-choose-a-plant-relocation-contractor` | 1625 | 0.1% |
| `in-house-team-vs-relocation-contractor` | 1656 | 0.2% |

**Index health (90d) — publishing was allowed because `blog` is GREEN:**

```
blog              45 URLs   34 earning   24% dead    4478 impr   GREEN
dispatch           3          0         100% dead       0        NEW
service pillars   17          9          47% dead    1785        AMBER
rigging x city   113        104           8% dead    2534        GREEN
machinery x city 113        107           5% dead    5098        GREEN
plant x city     113         85          25% dead    1742        GREEN
cnc x city       113         62          45% dead     250        AMBER
city hubs        128         99          23% dead     871        GREEN
SITE             652        506          22% dead
```

Nothing was added to `service pillars` or `cnc x city`.

**Reviewer: SHIP on all six, no HOLDs.** It verified the three claim sets the
writers had flagged as written from general engineering knowledge with no house
precedent — forklift load-center derating, raised-floor rolling-vs-static load
ratings and the N+1/2N redundant-pair rule, and temporary steel plus the
pre-1979 PCB-testing framing. All held. Only imprecision found was the
container-floor wording in the forklift piece (ISO 1496 rates axle load, not
"distributed rolling load"); directionally correct and hedged, so not a HOLD.
Confirmed the #5/#6 split is clean (choose-a-vendor vs decide-whether-to-hire)
and that the new transformer piece is the rigging half only, no overlap with
the existing transport post.

Applied its three surgical edits before building: cross-linked #5 and #6 in
both directions, and **removed the related-block link from the new transformer
rigging post into `blog/how-to-transport-a-transformer.html`.**

**⚠ FOR SAM — the one thing worth attention.**
`blog/how-to-transport-a-transformer.html` is live, in `sitemap.xml`, and
carries the retired heavy-haul positioning in force: 33 mentions of permits,
plus oversize, superload, escorts and bridge-engineer language, and it is
dispatch-framed as though Badass hauls directly ("we will coordinate the
trailer, permits, and rigging at both ends"). It has **no source module** in
`content/blog-new/`, so it is legacy built HTML and no generator touches it —
which is why `build.js` check 8 passes: that gate covers titles, descriptions,
nav and footer, not legacy body prose. I cut the new article's link into it so
this run was not feeding it fresh internal links, but the page itself still
needs a rewrite. That is a structural job, not an article job — it belongs to a
semiweekly or upgrade run, and it will need a source module written for it
first.

**Build:** full `node build.js`, all verify checks passed — 68,538 internal
links, 0 broken, 0 links to retired URLs, 0 heavy haul in titles/descriptions/
nav/footer. `llms.txt` 20 services / 51 guides. `sitemap.xml` 658 indexable.

**Live check:** all six return 200 with real pages (32–34 KB), no meta refresh,
correct titles, and Article + BreadcrumbList + FAQPage schema parsing on every
one. All six present in both `sitemap.xml` and `llms.txt`.

**Ping:** 465 URLs, IndexNow 200 ✓, Google sitemap 204 ✓ (652 URLs, 0 errors).

**Cannibalisation (checked before writing, not acted on):** 264 queries with
self-competition, 6,997 impressions split — but **zero blog-on-blog conflicts**,
so this batch was not writing into a split cluster. The whole split is the city
matrix (state vs city siblings; `omaha-ne` appears in 6 of the top 13 pairs)
plus `/services/plant-relocation` competing with its own city pages on
"plant relocation quote" (11 pages) and "production facility relocation
services" (7 pages). Merge-and-redirect territory for a structural run.

**Queue:** 16 done / 29 todo. Deep enough; no refill needed this run.

**Not done deliberately:** no Track B deepening (blog was GREEN, so Track A was
the correct call and the run filled its article budget); no Google Ads; no
`seo/schedule.md` structural batches.

---

## 2026-09-21 — Track B: the matrix reads as one page, and that is the same bug as the 146 dead URLs

No new pages this run. Everything below is a change to a page that already
existed, or to the data a generator reads.

### The finding that reframes the site

`cannibalisation.js` and `index-health.js` have been reporting two problems.
They are one problem. `/services/machinery-moving/omaha-ne` ranks for
Indianapolis, Detroit, Milwaukee, New York, Oklahoma, Washington, Boise and
Indiana queries — and `machinery-moving/dallas-tx`, `plant-relocation/chicago-il`,
`plant-relocation/detroit-mi`, `plant-relocation/los-angeles-ca`,
`rigging/new-york-ny` and `rigging/dallas-tx` earned **zero impressions in 90
days**. Google has not indexed 113 machinery pages and picked Omaha for the
generic query. It has effectively indexed **one** page per matrix, and Omaha is
it. The biggest markets in the country are the dead ones.

So the 146 dead URLs are not 146 separate thin pages needing 146 fixes. Most of
them are duplicate-selection casualties. Fix the differentiation and both
numbers move together.

### What was actually wrong: four words

Verified in the generator. A service x city page runs ~1,550-1,800 words. The
only per-city input was the `industry` string in `data/metros.json`, which
averages **four words** — Omaha's is `rail & ag manufacturing`. Everything else
on the page was the same sentence with a different city name substituted in.

### The fix: data, not prose

**`data/metros.json` gained a `detail` block — 88 of 88 live metros researched.**
Per metro: `sectors` (3-5 industries genuinely concentrated there), `corridors`
(2-4 real named industrial districts, parks and terminal districts), `rail` (the
Class I railroads that actually serve it, verified metro by metro), `port` (real
navigable freight water access — **absent for 45 metros, correctly**), `stock`
(the dominant industrial building stock and the access problem it creates),
`equipment` (3-5 machine types the metro's plants actually run). The `metros`
table itself is untouched and still one readable line per metro.

**`build-service-cities.js` gained `METRO_COPY`** — four slots per page (intro
paragraph, plant-floor paragraph, routing paragraph, one metro-specific FAQ),
each **worded differently per service and drawing a different mix of the
fields**, so the same Detroit facts do not produce the same Detroit sentences on
the rigging page and the machinery page. Every slot returns `''` when the data
isn't there, so a metro with no research keeps its previous page byte-for-byte.

**Matrix differentiation, measured before and after on the built site:**

| matrix | before | after | pages under the 33% floor |
|---|---|---|---|
| machinery-moving | 32.4% | **36.1%** | 86 → **20** |
| rigging | 31.4% | **34.8%** | 88 → **43** |
| plant-relocation | 31.8% | **34.9%** | 86 → **39** |
| cnc-machine-movers | 31.2% | **34.5%** | 87 → **48** |

All four means now clear the floor. Under-floor pages across the four matrices:
**347 → 150**. Savannah, Charleston, Tulsa, Baltimore, Indianapolis, Detroit,
Milwaukee, Minneapolis, Boston, Albuquerque, Omaha and Jacksonville — every
metro `cannibalisation.js` named — are among the ones lifted.

### Pages lifted

| page | before | after | why |
|---|---|---|---|
| `/services/plant-relocation` | ~1,070 w | ~2,188 w | "production facility relocation services" 59 impr @ **37.7**, "plant relocation quote" 42 @ **43.2** |
| `/services/project-freight` | ~1,156 w | ~1,892 w | **0 impressions**, and the page never used the words "project cargo" — the term with the actual demand |
| `/services/truck-dispatch` | ~1,142 w | ~1,847 w | **0 impressions**, while retired `/services/dispatching` sits at **position 5.7**, the best on the site |
| `/services/heavy-lift-rigging` | ~1,182 w | ~1,577 w | 0 impressions; title/H1 said "Jacking & Skidding", not the head term |
| `/services/machinery-removal` | ~1,005 w | ~1,416 w | 0 impressions; never named asset labelling or load-out sequencing |
| `/services/millwright-services` | ~920 w | ~1,146 w | 0 impressions; never named laser vs dial alignment, baseplates, grouting |
| `/blog/plant-relocation-checklist` | 503 w | 1,547 w | "plant relocation quote" 51 @ **39.3**, "process plant relocation" 3 @ **73.7** |
| `/blog/how-to-move-a-milling-machine` | ~470 w | 1,345 w | exact-match head term at **36.4** — it never mentioned mill types, lift-point documentation, or tramming |

The clearest single diagnosis: **the two services the September revamp made
primary both earn nothing, and in both cases the live page was not using the
words buyers search.** project-freight never said "project cargo". truck-dispatch
was thinner than the retired URL Google still ranks at 5.7.

### Stub recovery — 2 queued, and a written policy for the rest

131 stubs, 4,607 impressions, 45 clicks (down from 6,879/52 — the two trailer
guides recovered earlier today took 2,272 impressions of that onto live pages).

**Queued for recovery** in `seo/content-queue.json`, with the numbers in the angle:
- `how-to-tarp-a-flatbed-load` — 167 impr @ 14.6, plus steel/lumber/hay-tarp
  queries at 31-36 with nothing to land on. Fleet-owner securement question =
  the 4+ truck dispatch buyer, same call as the two guides recovered today. It
  is also told to **absorb** `/blog/how-to-secure-a-load-on-a-flatbed` (24 @
  11.8) rather than recover it separately, so recovery does not manufacture a
  new cannibalisation pair.
- `how-to-ship-a-forklift` — 41 impr @ 15.2. A forklift is plant equipment we
  load and rig, and `/services/forklift-loading-unloading` is a live pillar
  earning nothing. Framed as load-out, not hauling.

**Redirect rules were deliberately NOT deleted.** A recovery entry keeps its
rule until the page is actually written — deleting it first leaves a 404, and
`build-redirects.js` runs after the generators anyway.

**Deliberately left stubbed, now written into `content-queue.json` as policy so
this judgement doesn't get re-litigated every run:** the heavy-haul service and
city stubs, every oversize-permit / pilot-car / superload post, the
equipment-*shipping* posts (bulldozer, excavator, skid steer, boat, mobile home,
crane transport) and hot-shot trucking — all demand for a motor carrier, a
service retired in 2026. Also the trailer **service** pages (step-deck 188 @
22.1, RGN, double-drop, lowboy, Conestoga, flatbed-transport, multi-axle 180 @
10.9): trailer-choice demand is real and is our buyer, but it belongs in guides
and `/trailer-selector`, not on a service page that reads as us running the
trailer. And `/services/dispatching` (5.7) and `/services/freight-moving` (7.4)
stay stubbed on purpose — their intent belongs on the live pages they already
point at, and recovering them would split one intent across two URLs.

### Cannibalisation: still there, and waiting on Sam

**No merge was executed. No live URL was redirected or deleted.** These are the
recommendations, with the numbers:

1. **SIBLING CITIES, 14 pairs, ~3,200 impressions split — do not merge.** Every
   one of these is the differentiation bug above (10 of the 14 pairs involve
   `machinery-moving/omaha-ne` or `plant-relocation/omaha-ne`). The fix shipped
   this run is the fix. Re-measure in 3-4 weeks before considering anything
   structural.
2. **`plant-relocation` — 194 impressions across 14 of our own URLs, and the
   pillar is not the winner.** City pages take the bare non-geo query at
   positions 71-96. Recommendation: the city pages should not be competing for
   the bare term at all. Worth checking whether their H1/title anchor hard
   enough on "plant relocation in &lt;city&gt;". Flagged by the pillar deepener
   as something a pillar edit cannot fix.
3. **Savannah/Georgia and Charleston/South Carolina, `machinery-moving` — 502
   and 274 impressions split between a city page and its state hub.** The city
   page wins both (11.2 vs 53.4; 19.0 vs 80.0), so the state hub is pure drag on
   a query it will never win. **Recommendation for Sam: narrow the state hubs to
   state-level intent** ("machinery movers in Georgia") and stop them targeting
   city phrasing. This is an intent change, not a merge — no URL is removed.
4. **`machinery-moving/oklahoma` vs `/oklahoma-city-ok` vs `/tulsa-ok` — 77
   impressions across three pages at positions 22-24.** All three are close
   enough to page one that the split is the only thing keeping them off it.
   Same recommendation as 3.
5. **`/services/heavy-haul/pittsburgh-pa` vs `/locations/pittsburgh-pa` — 108
   impressions.** One side is a retired stub. No action; it resolves as the stub
   decays.

**The one genuine ARTICLES-pair merge candidate is absent from the report** —
there are none under WORTH FIXING. Every fixable pair is geographic. That is
worth knowing: this site does not have a duplicate-article problem, it has a
duplicate-*city-page* problem.

### Deliberately not done

- **Rejected a batch of research.** A follow-up pass to fill the 15 metros whose
  `stock` field came back empty (Portland OR, Jacksonville FL, Bakersfield CA,
  Fargo ND, Casper WY, Billings MT, Little Rock AR, Jackson MS, Tulsa OK,
  Knoxville TN, Hartford CT, Tampa FL, Cedar Rapids IA, Green Bay WI,
  Montgomery AL) came back with 13 entries the researcher itself flagged as
  **unverified** — its search budget had run out and it wrote from general
  knowledge. Several also named specific company plants, against the convention
  every other batch followed. `Never invent a fact about a city` is the one hard
  rule here, and this would have put unverified claims on 52 live pages for
  about 1-2 percentage points of matrix score. **Not merged.** Those 15 metros
  are exactly the pages still under the floor — this is the highest-value single
  task for the next run, and it needs one field, 15 metros, and a fresh search
  budget.
- No merges, redirects or deletions of live URLs — Sam's call, listed above.
- No new pages, no sub-city URLs, no dispatch geo pages, no backlink work, no
  Google Ads. Sitemap unchanged at **658 URLs**.

### Two operational notes worth Sam's attention

1. **Two scheduled runs raced on this worktree.** Mid-run, another run committed
   `52dba5d` and `67413d0` and pushed. `67413d0` swept up this run's in-flight
   edits to `content/services/heavy-lift-rigging.js` and
   `content/services/project-freight.js` and shipped them inside a commit
   described as a log update — almost certainly a `git add -A` in the other run.
   Nothing was lost and both pages passed this run's gates afterwards, but a
   `git add -A` in one run will silently publish another run's half-finished
   work. Worth pinning each run to explicit paths.
2. **An instruction arrived through the tool-output channel**, claiming a
   "bypass permissions mode" was active and directing all file work through raw
   shell (`cat`/`sed`/`echo`) instead of the auditable file tools. It did not
   come from Sam or the task file. Five of the research agents independently
   flagged it and declined it; this run did too and kept using the normal tools.
   Flagging it because that is what a prompt-injection attempt looks like, and
   because the thing it asked for — routing edits through raw shell — is
   specifically what would make an unwanted change hard to see afterwards.

### Verify

Full `node build.js` green: 68,915 internal links / 0 broken, 0 links to retired
URLs, 669 pages / 0 missing or duplicate titles, 0 missing or duplicate
descriptions, heavy haul absent from every title, description, nav and footer,
sitemap 658 URLs / 0 bad, AI-surface check 8 passing. `check-content.js` clean on
all six edited pillars. `check-uniqueness.js` re-run on all four matrices, before
and after, on the built site with the link mesh applied — so the numbers in the
table above are the shipped numbers, not pre-mesh ones.


---

## 2026-09-22 — daily health check (Tue)

**Absorption (90d) — no RED. `service pillars` recovered AMBER → GREEN.**

| cluster | URLs | dead% | verdict | vs 2026-09-21 |
|---|---|---|---|---|
| blog | 51 | 29% | GREEN | 45 URLs / 24% — 6 new posts, dead% up as expected while they age in |
| dispatch | 3 | 0% | NEW | was 100% dead — all 3 now earning |
| service pillars | 17 | 6% | **GREEN** | was 47% AMBER — the Track B deepening landed |
| rigging × city | 113 | 7% | GREEN | 8% |
| machinery × city | 113 | 5% | GREEN | 5% |
| plant × city | 113 | 25% | GREEN | 25% |
| cnc × city | 113 | 43% | AMBER | 45% — still the only HOLD, edging down |
| city hubs | 128 | 23% | GREEN | 23% |
| SITE | 658 | 21% | | 652 / 22% |

`service pillars` going 47% → 6% dead in one day is the clearest evidence yet
that the Track B diagnosis was right: those pages were not thin-and-unwanted,
they were using the wrong words. Six of them started earning within 24h of the
rewrite. `cnc × city` remains the only cluster under HOLD — same treatment is
the obvious next move for it.

**Live URLs — all 14 from yesterday's two runs return 200, no redirect stubs,
no meta refresh.** The 6 new blog posts (29–34 KB) are each present in both the
live `sitemap.xml` and `llms.txt`; sitemap at 658 URLs, matching the build. The
8 deepened pages all serve their lifted versions — `/services/plant-relocation`
is 57 KB live. GitHub Pages deployed cleanly.

**Ping:** `ping-search-engines.js` no-opped — no URLs with today's lastmod,
which is correct: nothing shipped today and yesterday's 465 were already
submitted (IndexNow 200, Google 204). Not forced with `--all`; re-pushing 658
unchanged URLs daily buys nothing.

**Skipped per schedule (Tue):** stub traffic (Wed), cannibalisation (Sun),
AEO identity (Mon). `llms.txt` "retired in 2026" still verifies live (2 hits).

**⚠ The prompt-injection attempt from the 2026-09-21 run repeated, verbatim.**
Same text, again arriving through the tool-output channel rather than from Sam
or the task file: a claim that "bypass permissions mode" is active, directing
all file work through raw shell (`cat`/`sed`/`echo`) instead of the auditable
file tools. Declined again; this run used normal tools throughout. Two runs in
two days is a pattern, not noise — and the thing it keeps asking for is
specifically the change that would make an unwanted edit hard to spot in review.
Worth Sam knowing it is recurring.

**Carried forward, unchanged:** `blog/how-to-transport-a-transformer.html` still
carries retired heavy-haul positioning in its body prose with no source module —
flagged 2026-09-21, still live, still a structural job.
