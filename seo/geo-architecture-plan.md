# Geo architecture plan — rigging-first location × service, dispatch off-grid

Drafted 2026-09-18 in response to: *all locations × all services, majorly
rigging, "{service} rigging in {city}, {state}" with all the sub-cities;
dispatch handled differently because it is not city-specific.*

This is a plan, not a build. Nothing in it has been generated yet.

---

## 1. The literal ask, priced out

| | Pages |
|---|---|
| 15 rigging services × 88 cities | **1,320** |
| …plus 813 sub-cities × 15 services | **12,195** |
| **Total if built literally** | **~13,500** |
| Current site | 661 |
| Market leader on this exact model (Rigging-Busters, US) | ~400 |

Two things are true at once. The **service × city model is right** and is
already working for us. The **sub-city tier is the one thing that would sink
the domain**, and the leader in this niche does not build it either.

The binding constraint on this site is not page count. The July audit found
the problem is the **link graph and authority**, not page quality — Memphis
ranked #2 and #47 on identical templates. Authority is a fixed pool that gets
divided across indexed URLs. Going from 661 to 13,500 pages divides the same
authority twenty ways, on a domain that already cannot get all 352 city pages
crawled. That is why this plan expands to **~850 service × city pages** rather
than 1,320, and to **zero** sub-city pages.

Every one of the 15 rigging services still gets city coverage. The difference
is *which* cities each one gets, and the answer is "the ones where that
industry actually exists" rather than all 88 for everything.

---

## 2. What the research says

| Finding | Evidence | Consequence |
|---|---|---|
| The programmatic leader runs **8 services × ~50 US cities ≈ 400 URLs** | rigging-busters.com sitemap: `machinery-movers-{city}`, `industrial-rigging-services-{city}-{st}`, `factory-and-plant-relocation-services-{city}`, `lab-and-medical-equipment-movers-{city}`, `forklift-moving-service-{city}`, `cnc-machine-movers-{city}`, `printing-press-movers-{city}`, `electrical-transformer-moving-services-{city}` | Our 8 highest-value matrices should mirror theirs. That set is market-validated, not guessed |
| They build **no sub-city pages at all** | `/locations/` hierarchy is Country → City, nothing below. Their Houston page lists **28 suburbs in a table linked to Google Maps** — external links, not internal pages | Sub-cities get *covered*, never *paged*. This is the proven pattern |
| Google's doorway policy describes the sub-city tier precisely | Spam policies, doorway abuse: "Having multiple domain names or pages targeted at specific regions or cities that funnel users to one page" | 12,195 suburb pages funnelling to one quote form is the textbook example. Not a grey area |
| Our pages are already **deeper** than the leader's | Detroit rigging page: 2,042 words, 14 H2s. Their Houston rigging page: ~1,200–1,500 words, 3 FAQs | Depth is not the gap. **Breadth of services** and **thinness of suburb coverage** are |
| Our suburb coverage is the weak spot | Detroit page names 10 suburbs, **once each, unlinked**. Theirs names 28 in a structured table | This is exactly where "all the sub-cities" should land — and it needs no new URLs |
| The matrix **is indexing — measured, 2026-09-21** | Search Console, 90d: rigging **94%** (83/88), machinery-moving **93%** (82/88), plant-relocation **75%**, cnc-machine-movers **50%**. Overall 275/352 = **78%** earning impressions | Kill switch is 40% dark; overall 22%. **Wave 2 cleared.** But cnc-machine-movers breaches the rule alone and gets consolidated, not expanded — see §4 |
| **Non-brand search earns almost nothing** | 90d: 120 clicks total, **116 brand, 4 non-brand**, against 9,979 impressions in 28d. Pages like `/services/machinery-moving/omaha-ne` hold 691 impressions at position 67.5, Savannah 607 at 21.0 | The constraint is position and CTR on pages that already exist, not missing pages. **Fix the existing matrix before building wave 2** — this outranks the whole expansion in priority |
| Retired stubs were absorbing the demand | 133 redirect stubs pulled **6,879 impressions in 90d**, all titled `Moved: /a → /b`. Fixed 2026-09-21 | Some of the "missing" performance was never missing — it was landing on dead URLs with debug titles |
| One verified GBP = one local pack | GBP is a single verified profile; ads research confirms "machinery movers near me" is owned by the map pack | City pages compete in the **organic block below the pack**. Winnable: "{service} {city}", "{service} companies in {city}". Not winnable: "{service} near me" outside the GBP metro. Title and H1 should target the former |
| Volume is concentrated in a few terms | Keyword Planner: crane and rigging services 1,600/mo · machinery movers 590 · rigging services 390 · millwright services 320 · medical equipment movers 210 · CNC movers 40 | Wave order follows volume, not alphabet |
| `metros.json` cannot drive a medical matrix | Its `industry` field is written for manufacturing. Matching medical/pharma/biotech returns **1 of 88 metros**; energy returns 18, aerospace 14, auto 11, port/distribution 32 | Sector-matched waves need a **data enrichment step first** (§6). This is a real prerequisite, not a formality |

---

## 3. The architecture — five tiers, four of them pages

```
T0  /services/{service}                      20 pages   national authority
T1  /services/{service}/{state}              ~120       state roll-up
T2  /locations/{city}-{st}                    88        all services in one city
T3  /services/{service}/{city}-{st}          ~850       the money pages
T4  sub-cities                                 0        CONTENT, never URLs
```

T2 already exists and is currently under-used — it is the natural home for
"all services in this city" and the best internal-link distributor we have.
Every T3 page links up to its T2 hub and sideways to the other services in
the same city. That sideways mesh is what the leader does with its "Other
Services in Houston" block, and it is how authority reaches deep pages.

**URL structure does not change.** `/services/rigging/detroit-mi` already
matches the winning pattern. Churning URLs on an authority-constrained domain
costs more than any naming gain.

---

## 4. Rigging expansion — three waves, ~850 pages

### Wave 1 — shipped (352), one matrix now failing its gate
`rigging` (94% indexed) · `machinery-moving` (93%) · `plant-relocation` (75%)
× all 88 — keep, plus the §5 suburb upgrade.

**`cnc-machine-movers` is at 50% indexed and breaches the 40%-dark rule.**
Under the standing policy it consolidates into its state hubs rather than
expanding. It is also the thinnest-demand matrix in the set: "cnc machine
movers" is 40/mo nationally. Consolidating it frees crawl budget for the
waves below — which is the whole argument of §1 working in our favour.

### Wave 2 — volume-led (276 new)

| Service | Cities | Why | Anchor volume |
|---|---|---|---|
| `millwright-services` | 88 | Low competition, strongly local intent, pairs with every machine we set | 320/mo |
| `machinery-removal` | 88 | Uncovered demand per the Sep strategy; SERP is riggers next to junk haulers | below floor, but SERP is weak |
| `crane-services` | 60 | Biggest term in the whole account. Crane fleets own it nationally — city pages are the flank | 1,600/mo |
| `forklift-loading-unloading` | 40 | Leader runs `forklift-moving-service-{city}`; market-validated | 10/mo + validated |

### Wave 3 — sector-matched, not blanket (225 new)

Each service goes only to metros where that sector genuinely exists. That
match **is** the anti-doorway defence: the page exists because there are
machines of that type in that city, and the copy can prove it.

| Service | Cities | Match rule |
|---|---|---|
| `heavy-lift-rigging` | 50 | Top 50 by metro rank — gantry/jacking work follows plant density |
| `hvac-chiller-rigging` | 40 | Metros with large commercial/institutional building stock |
| `transformer-generator-rigging` | 35 | Energy/utility/petrochem metros (18 matched today) + data-centre metros |
| `mri-medical-equipment-rigging` | 30 | Health-system density — **needs new data (§6)** |
| `lab-equipment-movers` | 25 | Biotech/university/pharma corridors — **needs new data (§6)** |
| `printing-press-movers` | 25 | Print/packaging/paper metros (3 matched today, needs widening) |
| `data-center-rigging` | 20 | Data-centre metros (5 matched today, needs widening) |

**Result: all 15 rigging services have city coverage. ~850 service × city
pages, ~2× the market leader, every page justified by volume or by sector.**

---

## 5. Sub-cities — the answer is coverage, not pages

This is the part of the ask that changes shape. Sub-cities get *more*
visibility than they would as pages, and cost zero new URLs.

**Today:** `locations.json` holds 813 suburbs, ~9.2 per metro, each rendered
once in a sentence, unlinked.

**Plan:**

1. **Expand `near` to 20–30 industrial suburbs per metro** (813 → ~2,000).
   Chosen for industrial parks and corridors, not population. Sterling
   Heights and Livonia earn their place in Detroit; Birmingham does not.
2. **Render a real coverage table** on every T3 and T2 page — suburb, county,
   and the industrial driver in one line. The leader's 28-row table is the
   benchmark; the extra column beats it.
3. **Add an H2 per city page: "Rigging in the {Metro} suburbs"** — ~150 words
   naming the actual corridors and parks, not a list re-flowed into prose.
   This is what makes suburb queries land on the city page.
4. **Link suburbs outward, not inward** — Google Maps or the county
   authority, exactly as the leader does. No internal suburb URLs exist to
   link to, by design.
5. **Promotion rule instead of a sub-tier.** A suburb earns its own page by
   being promoted into `locations.json` as a **full city** — own industry,
   own `near` list, own copy — and only when GSC shows the parent city page
   already earning impressions on that suburb's name. Demand promotes a
   suburb; a list never does.

That rule is the whole safety mechanism. It means the site can eventually
have a Sugar Land page or a Sterling Heights page, and it will be a real one.

---

## 6. Data work this depends on (do first)

The sector-matched waves are only defensible if the sector data is real.

1. **Add `sectors: []` to every metro in `metros.json`** — multi-valued, from
   real anchors (health systems, universities, data-centre campuses, print
   plants, utility service territories). The current single `industry` string
   returns 1 medical metro out of 88 and cannot carry wave 3.
2. **Rebuild `near` lists** to 20–30 industrial suburbs per metro with county
   and driver.
3. **Per-service equipment vocabularies** so a `transformer-generator-rigging`
   page in Houston reads differently from one in Pittsburgh — the uniqueness
   engine already does this for 4 services and needs 11 more.

Nothing in waves 2 or 3 should generate before step 1 is done for the metros
in that wave.

---

## 7. Naming — the "{service} in {city}, {state}" formula

Standardised across every T3 page:

- **H1** — `{Service Label} in {City}, {ST}` → "Millwright Services in Detroit, MI"
- **Title** — `{Service Label} in {City}, {ST} | Badass Logistics`, ≤ 60 chars, truncating the label before the brand
- **H2 #1** — `{Service} in {City} and the surrounding {Metro} plants`
- **Suburb H2** — `{Service} in the {Metro} suburbs`
- **State roll-up H1** — `{Service Label} in {State Name}`

Deliberately *not* targeting "near me" in titles outside the GBP metro — that
query belongs to the map pack and one profile cannot win 88 of them.

---

## 8. Dispatch — off the geo grid entirely

Dispatch is not a location business. The truck is wherever the load is, so a
"truck dispatch in Toledo, OH" page has no local fact to stand on. It would be
the doorway pattern in its purest form, and it would push the brand toward
reading as a dispatch company, which the revamp explicitly rejected.

**Dispatch gets segmented on the axes carriers actually use:**

| Axis | Pages |
|---|---|
| **Fleet size** (the existing 4+ positioning) | dispatch for 4–10 trucks · 10–25 · 25+ |
| **Equipment type** — how carriers self-identify | flatbed · step deck · reefer · dry van · hotshot dispatch |
| **The real differentiator** | "Where our freight comes from" — our own rigging and project work generates loads. Freight Girlz and every load-board shop cannot say this. Straight from the competitor teardown |
| **Decision-stage** | dispatch service vs in-house dispatcher · percentage vs flat fee · dispatcher vs broker (blog exists) |
| **Blog** | 3 posts live; add only what Search Console proves |

Anchor term is **"truck dispatch company"** (480/mo, $1.99 entry) — not
"dispatch services for trucking companies" (30/mo at 3× the price).

**Hard rule: zero dispatch geo pages.** No city, no state, no metro. Enforced
in the build (§9) so it cannot happen by accident later.

---

## 9. Project freight — the middle case

Freight is lane-based and port-based, not city-based. It does not get the
city matrix.

- `container-to-warehouse` → **port metros only** (~12: LA/Long Beach,
  Houston, Savannah, Newark, Norfolk, Charleston, Seattle/Tacoma, Miami,
  Baltimore, Oakland, Jacksonville, New Orleans). Each has a genuinely
  different port fact to state.
- `crating-packing`, `dedicated-lanes`, `project-freight` → **national only**,
  supported by corridor content rather than city pages.

---

## 10. Guardrails to build into `build.js` verify

The expansion is only safe if the build refuses to produce the unsafe version.
New verify checks, each failing the build:

1. **No sub-city URLs.** Any generated path whose slug is not in
   `locations.json` as a full city → fail.
2. **No dispatch geo URLs.** Any `truck-dispatch/{anything}` path → fail.
3. **Uniqueness floor.** Every T3 page must contain ≥ 6 city-specific tokens
   (sector phrase, ≥ 15 named suburbs, state interstates, ≥ 2 named local
   anchors, service-specific equipment vocabulary). Below that → fail.
4. **Matrix cap.** Per-service city count must match the declared wave size.
   Silent growth → fail.
5. **Orphan check.** Every T3 page reachable within 3 clicks of the homepage
   via T0 → T1 → T2 → T3.
6. **Cross-link floor.** Every T3 page links to ≥ 5 other services in the
   same city and up to its T2 hub.

Checks 1 and 2 are the ones that make this plan enforceable after everyone
has forgotten why.

---

## 11. Sequence and the kill switch

| Step | Gate to pass before the next |
|---|---|
| 0. ~~`gsc-key.json` on this Mac~~ | ✅ **Done 2026-09-21** — key reissued, orphan revoked |
| 0b. **Fix the existing 352 before adding any** | New, and now ranked first: 4 non-brand clicks against 9,979 impressions says the matrix underperforms where it already ranks. Titles, answer-position and internal links on the pages holding impressions at positions 15-70 |
| 1. Sector + suburb data (§6) | Data review |
| 2. Suburb coverage upgrade on existing 352 + 88 | Build verify green |
| 3. Wave 2 (276 pages), one service at a time | 8 weeks, then §11 rule |
| 4. Wave 3 (225 pages), sector-matched | 8 weeks, then §11 rule |
| 5. Suburb promotions | Only on proven impressions |

**The kill switch stays, applied per wave:** if more than 40% of a wave's URLs
sit in "Crawled – currently not indexed" 8 weeks after launch, that wave gets
consolidated into its state hubs and the next wave does not start. This is
already the standing rule from the revamp and it is what makes an 850-page
matrix defensible rather than reckless.

---

## 12. What needs Sam

1. ~~`gsc-key.json` copied from the M2.~~ **Resolved 2026-09-21** — the M2 was
   formatted, so the key was reissued from the surviving service account.
   Search Console data is live and the numbers above are measured, not assumed.
2. **Sign-off on demand-tiered over blanket.** All 15 rigging services get
   city coverage either way. The question is 850 justified pages vs 1,320
   uniform ones on an authority-constrained domain.
3. **Sub-cities as coverage, not pages** — confirm. It is the one place this
   plan says no to the literal ask, and the market leader agrees with the no.
4. **Local anchors per metro**, if any exist from real jobs — industrial
   parks, plants, corridors worked. Real job facts are the only thing that
   makes 850 pages genuinely unique rather than well-templated.
