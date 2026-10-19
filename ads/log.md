# Google Ads — weekly review log

Account **788-067-9748** · owner **abdul.samad9k@gmail.com**.
Newest entry at the top. Playbook: `ads/review.md`. Blueprint: `ads/campaigns.json`.

---

## 2026-10-20 — Follow-up check: yesterday's fixes held, nothing changed

Scheduled run, one day after the full 2026-10-19 review. Sam was present. **Sam confirmed
Fleet Dispatch stays paused** ("let it the dispatch paused and dont need that"). Do not
propose re-enabling it, or rebuilding a dispatch campaign, in future runs.

`node ads/check-ads.js --live`: all 15 final URLs and sitelinks returned 200. Blueprint valid.
The only warning is the known "$660 of $880 allocated" (Fleet's freed $10/day).

### Campaign table (30 days, 20 Sep – 19 Oct, all networks)

The totals match the 2026-10-19 entry to the cent: Sunday 18 Oct does not serve, and the
19 Oct partial day had not posted into the 30-day view yet.

| Campaign | Budget | Impr. | CTR | Clicks | Cost | Conv. | CPA |
|---|---|---|---|---|---|---|---|
| Crane & Rigging | $15 | 4,081 | 4.61% | 188 | $409.76 | 5 | $81.95 |
| Machinery & Medical Equipment | $15 | 3,441 | 6.31% | 217 | $403.02 | 6 | $67.17 |
| Fleet Dispatch | paused | 6,461 | 3.30% | 213 | $268.78 | 0 | — |

Today, Mon 19 Oct ET (partial, the first day after the changes): Crane 287 impr / 5 cl /
$19.43. Machinery 62 impr / 0 cl / $0. Account total $29.36, so ~$9.93 came from Fleet
Dispatch before yesterday's pause took effect.

### Verified (nothing changed)

- **Networks:** both campaigns' settings panels read **"Google Search Network"**, with Manual
  CPC and $15.00/day. The network segment for today shows **no Display row at all**.
  Search partners still shows impressions today (Crane 62, Machinery 6) but **$0 / 0 clicks**.
  These are from the morning hours before the setting saved. Confirm next run that
  Partners reads 0 impressions from 20 Oct on.
- **Fleet Dispatch** is absent from the enabled-campaigns view and the account budget row
  reads $30.00/day, so the pause holds.

### Not done, and why

- **No bid, budget, negative or ad changes.** One partial serving day since yesterday's
  changes is not data. Machinery's new $6.00 bid and Medical's $8.50 need at least a
  week before lost-IS(rank) and CPA can be read against them.
- **Freed $10/day not reallocated**, and the medical keyword expansion and the Crane
  negatives were not added. All three are still waiting on Sam (see 2026-10-19).
- **Search terms not re-pulled.** Same 30-day window as yesterday, already reviewed.

### Next run (Mon 26 Oct), check first

1. Network segment from 20 Oct: Display and Search partners should both read 0.
2. Machinery lost-IS(rank) (was 63%) and CPA at the $6.00 bid.
3. Whether Sam has decided on the freed $10/day.

---

## 2026-10-19 — Display leak found, Fleet Dispatch paused, two bids raised

Scheduled Monday run, with Sam present partway through. Window **19 Sep – 18 Oct 2026**
(30 days, ET). First review since the $40/day raise. **No runs happened on 28 Sep,
5 Oct or 12 Oct**, so this is four weeks of data with nobody watching.

`node ads/check-ads.js --live`: all 15 final URLs and sitelinks returned 200.
Conversions are real: 10 "Request quote" (the shared /thanks page fires the label on
every quote form, including /quote-dispatch) + 1 phone-call lead.

### Campaign table (30 days, all networks, as Google reports it)

| Campaign | Budget | Impr. | CTR | Clicks | Cost | Conv. | CPA | Search IS | Lost IS rank | Lost IS budget |
|---|---|---|---|---|---|---|---|---|---|---|
| Crane & Rigging | $15 | 4,081 | 4.61% | 188 | $409.76 | 5 | $81.95 | <10% | 20.60% | 76.19% |
| Machinery & Medical Equipment | $15 | 3,441 | 6.31% | 217 | $403.02 | 6 | $67.17 | 16.83% | 63.11% | 20.06% |
| Fleet Dispatch | $10 | 6,461 | 3.30% | 213 | $268.78 | **0** | — | <10% | 49.93% | 41.95% |
| **Account** | $40 | 13,983 | 4.42% | 618 | $1,081.55 | 11 | $98.32 | | | |

**Google Search only** (Network segment) — the real performance once the leak is removed:

| Campaign | Impr. | CTR | Clicks | Cost | Conv. | CPA |
|---|---|---|---|---|---|---|
| Crane & Rigging | 1,661 | 5.36% | 89 | $343.81 | 5 | **$68.76** |
| Machinery & Medical Equipment | 1,183 | 5.83% | 69 | $318.40 | 6 | **$53.07** |

Ad groups (30 days): Machinery Moving 120 cl / $295.45 / 4 conv · Crane & Rigging Services
117 / $275.03 / 4 · CNC 52 / $50.81 / 1 · Medical & Imaging 45 / $56.76 / 1 ·
Crating, Loading & Handling 42 / ~$27.70 / 0 (all of it Display — every Crating keyword
has 0 clicks) · Industrial Rigging & Millwright 29 / $107 / 1.

### The one thing that matters this week

**Display Network and Search Partners were switched ON in both live campaigns**, against
the blueprint's "Search only". In 30 days Display took **$132.01 for 236 clicks and 0
conversions**, and Partners took **$18.56 for 11 clicks and 0 conversions**. That is
$150.57 (18.5%) of the two campaigns' spend producing nothing. It is also why keywords
explained only 231 of 618 clicks, and why Crating "had 42 clicks" while none of its
keywords had any. The 2026-09-23 review listed network settings as "not verified". They
had drifted.

### Changed (each verified after save)

1. **Fleet Dispatch → Paused.** Sam's instruction ("stop the dispatch ads at all"). It
   also meets the playbook rule: 0 conversions on 213 clicks / $268.78. Paused rather than
   removed, so its 90 negatives and its history survive if it ever comes back. The
   account budget row now reads $30.00/day.
2. **Crane & Rigging networks → Google Search Network only.** Unticked Search partners
   and Display. Verified: the settings row reads "Google Search Network".
3. **Machinery & Medical Equipment networks → Google Search Network only.** Same edit,
   same verification.
4. **Machinery Moving bid $4.50 → $6.00.** Its converting keywords were "Below first page
   bid": heavy machinery movers ($11.35), industrial equipment movers ($17.03), machinery
   movers ($11.35), machinery moving company ($11.35). Campaign lost-IS(rank) was 63%.
   Google's bid simulator: $6.00 ≈ +1.3 conv/week for +$112/week; $6.75 ≈ +1.9 for
   +$167. Took $6.00 as the step.
5. **Medical & Imaging Equipment bid $7.00 → $8.50.** Clears the $7.90 first-page bid on
   "medical equipment movers", the ad group's one converting keyword. Average CPC was
   $1.26, so the bid sets a ceiling, not the price.

Repo: `campaigns.json` carries the new bids, `status: "paused"` on Fleet Dispatch, and a
`networkNote`. `check-ads.js` now leaves paused campaigns out of the budget sum. It
warns "$660 of $880 allocated", which is accurate: $10/day is free and waiting on Sam.

### Not done, and why

- **Budget not reallocated.** The freed $10/day was going to go $5 to Crane (76% lost to
  budget) and $5 to Machinery. The tool's permission check blocked the edit because
  Sam had not asked for a budget move. The change was cancelled with nothing typed, and
  both budgets were verified still at $15.00. **Sam's decision.** Turning Display off
  also frees ~$5/day inside the existing budgets, so it may be enough on its own.
- **Medical keyword expansion not added.** Sam asked to improve medical. The proposal is
  below. The same permission check blocked further navigation in the account, so it was
  left for Sam's go-ahead.
- **No Crane & Rigging negatives added**, for the same reason. Candidates are all 0-click /
  $0 except `mi jack products inc` ($3.91): `liebherr`, `broderson`, `"mi jack"`,
  `"crane operator"` (phrase only, so "crane rental with operator" stays clean), and
  `"stevedoring"`. Do **not** negative `overhead crane` or `gantry crane`: riggers install
  those.
- **Crane bids not raised.** Crane loses 76% to *budget* and 21% to rank. More bid on a
  budget-capped campaign buys fewer clicks.
- **No ad copy edits.** The problem was where the ads showed (Display), not what they
  said. Search-only CTRs are 5.4–5.8%.
- **Manual CPC kept.** No campaign is near 15 conversions in 30 days.
- **Search terms:** 504 visible terms, but they cover only ~29 clicks. Google hides the
  rest below its privacy threshold, so search-term negatives can only ever be partial
  here.

### Why medical looks weak (for Sam)

Medical is not underperforming per click. On Search it converts at roughly the account
rate, and its $56.76 CPA is second-best in the account. **It is short on volume.**
The keyword research puts the whole category at ~75 searches a month across the 20
metros. Four of its 12 keywords are "Not eligible — low search volume" (mri machine
movers, linear accelerator removal, imaging equipment movers, plus machine shop
relocation in CNC). Better ads cannot create searches. The levers are:

1. **More keywords** (proposed): `"medical equipment rigging"`, `"mri installation"`,
   `"mri removal"`, `"imaging equipment relocation"`, `"hospital equipment moving"`,
   `"medical imaging equipment movers"`, and possibly `"laboratory equipment movers"`.
   Lab moves are the same rigging job with far more volume, if Sam wants that work.
2. **Wider geography for medical only.** Hospitals buy MRI/CT moves from anywhere, so 20
   metros starves it. This needs medical split into its own campaign with a national or
   state-level target. That is a structural change, so it is Sam's call.

### Next run, check first

1. Network segment: Display and Partners should read $0.
2. Did Machinery's lost-IS(rank) fall from 63%, and did CPA hold under ~$100 at $6.00?
3. Is the Medical keyword "medical equipment movers" still below first page at $8.50?

---

## 2026-09-23 (later) — daily cap raised $25 → $40 on Sam's call

Follow-up to the review below, same day. Sam overrode the standing
"never exceed $25.00/day" rule after reading the budget-constraint finding.
Asked him to pick the number rather than guessing at it; he chose $40/day.

| Campaign | Was | Now | Verified |
|---|---|---|---|
| Crane & Rigging | $10.00/day | **$15.00/day** | ✓ after full page reload |
| Machinery & Medical Equipment | $10.00/day | **$15.00/day** | ✓ after full page reload |
| Fleet Dispatch | $5.00/day | **$10.00/day** | ✓ after full page reload |
| **Account total** | $25.00/day | **$40.00/day** | ✓ |

$40.00/day × 22 billable weekdays = **$880/mo** (was $550).

### Why

The review below found all three campaigns losing **42–52% of impressions to
budget**, not to rank — each had already overdelivered past its daily cap on its
single serving day and still ran out. Bids could not fix that; only the cap
could. Split keeps the two rigging/machinery campaigns level at $15 and gives
Fleet Dispatch $10, preserving the rough 1.5 : 1.5 : 1 shape of the old
$10/$10/$5.

### Repo synced to match

- `ads/campaigns.json` — `dailyBudget` 10/10/5 → **15/15/10**;
  `monthlyBudget` 550 → **880**; `sharedSettings.scheduleNote` updated.
- `ads/review.md` — header budget line, the account table, and the
  "keep the three daily budgets summing to $25.00/day or less" rule all moved
  to $40.00/day. Section retitled to the 2026-09-23 budget raise.
- `ads/check-ads.js` — no change needed; it reads the cap from
  `plan.monthlyBudget`. Re-ran `--live`: **$40.00/day = $880.00/mo of $880,
  blueprint valid**, all 15 URLs still 200.

### Gotchas hit, for the next run

- **Google interrupted the first save with a "Confirm it's you" identity
  check.** It needed only a confirm click — no password, no 2FA. But the budget
  panel behind it **silently discarded the entry**: the row still read $10.00
  afterwards. Had to redo the edit from scratch. Add this to the list of ways
  Google's panels throw away input — verify the row value after *every* budget
  save, and expect the auth prompt once per session on the first write action.
- Budget edits are two clicks, not one: hover the row, then click the pencil
  that appears next to the budget. The first click only raises the tooltip.

### Not changed

Bids, negatives, keywords, ad copy, schedule, targeting — all untouched, for
the reasons in the review below. Still **Manual CPC** on all three; the raise
does not change the bidding rule. The 60-click reallocation bar still has not
been met, so the split above is a proportional scale-up, not a reallocation
based on performance.

### Watch next week

The raise is untested. What to check on Monday:

1. **Did lost IS (budget) actually fall?** If it is still ~50% at $40/day, the
   metros are deeper than the budget can reach and the next lever is narrowing
   geography, not more money.
2. **Did CPC inflate?** Crane & Rigging already pays $3.13 against a $4.00 ad
   group bid. More budget on the same bids should buy more clicks at a similar
   CPC; if CPC climbs instead, the extra budget is being spent on worse auctions.
3. **Cost is now real.** $880/mo against 0 conversions to date. If the build is
   still at zero after a full week at $40/day, that is ~60+ clicks and the
   reallocation rule finally has the evidence it needs to fire.

---

## 2026-09-23 — first review after the 2026-09-21 rebuild

Scheduled Monday run. Data window **23 Aug – 21 Sept 2026** (Google's "last 30
days", anchored to the account's Eastern clock).

### Campaign table — 30 days

| Campaign | Status | Budget | Impr | Clicks | CTR | Cost | Conv | CPA | Srch IS | Lost IS (rank) | Lost IS (budget) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Crane & Rigging | Enabled | $10.00/day | 195 | 6 | 3.08% | $19.57 | 0 | — | <10% | 40.91% | **52.49%** |
| Machinery & Medical Equipment | Enabled | $10.00/day | 113 | 17 | 15.04% | $19.94 | 0 | — | 10.85% | 39.15% | **50.00%** |
| Fleet Dispatch | Enabled | $5.00/day | 356 | 21 | 5.90% | $8.48 | 0 | — | <10% | 48.91% | **42.39%** |
| **Live total** | | **$25.00/day** | **664** | **44** | **6.63%** | **$47.99** | **0** | **—** | | | |
| Search - Rigging & Heavy Haul - Leads | Removed | — | 1,820 | 87 | 4.78% | $170.21 | 2.00 | $85.11 | <10% | 78.98% | 17.16% |
| Logistics Service Near You (PMax) | Removed | — | 0 | 0 | — | $0.00 | 0 | — | — | — | — |
| **Account total** | | | **2,484** | **131** | **5.27%** | **$218.20** | **2.00** | **$109.10** | <10% | 77.51% | 18.49% |

### Ad group detail

| Ad group | Campaign | Clicks | Impr | CTR | Avg CPC | Cost |
|---|---|---|---|---|---|---|
| Dispatch For Fleets | Fleet Dispatch | 21 | 356 | 5.90% | $0.40 | $8.48 |
| Medical & Imaging Equipment | Machinery & Medical | 13 | 65 | 20.00% | $0.17 | $2.17 |
| Crane & Rigging Services | Crane & Rigging | 5 | 122 | 4.10% | $3.13 | $15.64 |
| CNC & Machine Tools | Machinery & Medical | 2 | 12 | 16.67% | $4.43 | $8.86 |
| Machinery Moving | Machinery & Medical | 2 | 36 | 5.56% | $4.46 | $8.91 |
| Industrial Rigging & Millwright | Crane & Rigging | 1 | 37 | 2.70% | $3.93 | $3.93 |
| Crating, Loading & Handling | Crane & Rigging | 0 | 36 | 0.00% | — | $0.00 |

### The one thing that matters this week

**The account's 2 conversions and $85.11 CPA belong entirely to the *removed*
heavy-haul campaign.** The rebuilt structure has 0 conversions on 44 clicks and
$47.99. Anyone reading the account summary will think the rebuild is converting;
it is not — it has barely run.

**All live spend happened on a single day, Monday 21 Sept.** Verified on the ad
schedule report, not inferred: Fleet Dispatch shows 21 clicks / 356 impr /
$8.48 against "Mondays, 07:00–21:00" and 0 on all four other rows. The three
campaigns are ~1 serving day old, which is why nothing below was changed.

**All three campaigns are budget-capped, not rank-capped.** Lost IS to *budget*
is 52.49% / 50.00% / 42.39% — higher than lost-to-rank on the two rigging
campaigns. Every campaign also overdelivered past its daily budget on its one
serving day (Google's 2x allowance: Crane $19.57 on $10, Machinery $19.94 on
$10, Fleet $8.48 on $5) and *still* lost roughly half of available impressions
to budget. This is the mirror image of the old account, where $1.96 CPC under
the top-of-page price threw away 72.8% of impressions to rank. The binding
constraint is now the $25.00/day cap itself.

### Changed

**Nothing in the account at the time of this review.** No budget moved, no bid
moved, no negative added, no keyword paused, no ad edited. One documentation fix
in the repo (below).

> **Superseded the same day** — see the 2026-09-23 (later) entry above: Sam
> raised the daily cap to $40.00/day ($15 / $15 / $10) after reading the
> budget-constraint finding.

- `ads/campaigns.json` — `rules[7]` said "Stay on Manual CPC until a campaign
  has **30+** conversions in 30 days". `ads/review.md` and the standing brief
  both say **15+**, for that campaign alone. Aligned the blueprint to 15 so a
  future run does not read the wrong threshold off the source of truth. Flagged
  for Sam to overrule if 30 was deliberate — it is moot either way until a
  campaign converts at all.

### Deliberately not done, and why

- **No budget reallocation.** The rule is 0 conversions on **60+ clicks** in 30
  days. Top campaign has 21 clicks. At 44 clicks total across the account, a
  budget cut would be acting on noise.
- **No bid changes.** The playbook raises bids when lost-to-rank is high *and*
  lost-to-budget is low. Here lost-to-budget is the larger loss on two of three
  campaigns. Raising bids against a budget-capped campaign buys fewer clicks for
  the same money — it would make the problem worse, not better.
- **Stayed on Manual CPC.** 0 conversions account-wide on the live build. Not
  remotely close to the 15-in-30-days bar.
- **No negatives added.** Search terms, 30 days, live campaigns only: 40 terms,
  51 impressions, **1 click, $4.41 total**. The single billable term was
  `cnc moving company` (Machinery / CNC & Machine Tools, 100% CTR) — exactly the
  customer we want, not a negative candidate. Every other term had 0 clicks and
  $0 cost, most on 1–2 impressions. Nothing has cost money, so nothing earned a
  negative.
- **Did not negative the competitor-brand queries.** `barnhart crane and rigging
  memphis tn`, `all crane charleston wv`, `bay crane`, `carrier crane`,
  `the prolift rigging company`, `masthead rigging`. All 0 clicks / $0. Competitor
  brand traffic can convert in rigging, and 1 impression is not evidence. Revisit
  if any of them starts taking clicks.
- **Did not negative `ac crane operator`, `davit cranes`, `hiab crane`,
  `crane sales and service kansas city`.** These lean toward crane hire-a-person
  or crane *purchase* rather than hiring a rigging crew, but all are 0 clicks /
  $0 on 1–2 impressions. Watch list, not action list.
- **Did not touch ad copy.** The Ads table flags three ads as "Average" ad
  strength (Medical & Imaging Equipment, Machinery Moving, Industrial Rigging &
  Millwright). Opened two of them in the ad editor: both report **Headlines
  15/15, Descriptions 4/4, Ad strength "Excellent"** with all five
  recommendation checks green. **The table's Ad strength column is stale for
  these 1-day-old ads.** Headlines are already at the 15 maximum, so there is
  nothing to add even if it were real. Cancelled out of both editors without
  saving — saving would have spawned a new ad version and reset the stats for
  nothing. Do not re-litigate this next week unless the editor itself says
  below Good.

### Verified against `ads/campaigns.json` — account and file agree

- `node ads/check-ads.js --live` — clean. All 15 final URLs and sitelinks 200.
  Budget $25.00/day = $550/mo of $550. Blueprint valid.
- 3 enabled campaigns, budgets $10 / $10 / $5, all **Manual CPC**.
- 7 ad groups, one RSA each, 15 headlines + 4 descriptions per ad.
- Ad schedule **Mon–Fri 07:00–21:00** on all three, Sat/Sun absent. The
  playbook's "day dropdown silently stays on All days" gotcha did **not** bite
  this rebuild.
- Both retired campaigns (heavy haul, `Logistics Service Near You` PMax) are
  **Removed** and spent $0 in the window.
- 6 account-level sitelinks attached, confirmed on a Machinery campaign ad.
- Fleet Dispatch carries **90 campaign-level negatives**, including all four
  permanently-required guard terms with variants: `cdl`, `"hot shot"` +
  `hotshot`, `new authority`, `owner operator` + `owner operators` +
  `owner-operator`, plus `"one truck"` and `"single truck"`. **Zero leakage** of
  any of them in the search terms report — the list is doing its job.
- No negative from `sharedNegatives.neverAdd` was added (`free`, `ontario`,
  bare `oilfield`, `badass logistics`, exact `[crane rental]`).

### Not verified this run

Location targeting (20 metros), network settings (Search only / partners off),
and per-ad-group max CPCs were not re-checked in the UI. They were set in the
2026-09-21 rebuild and nothing in the data suggests drift. Worth a spot-check
next run.

### For next week

The three campaigns will have ~5 serving days by then — still thin, but enough
to start reading. Two things to look at:

1. **Crane & Rigging is the weak campaign on early signal**: 3.08% CTR and
   $3.13 avg CPC against Machinery & Medical's 15.04% CTR. If that gap survives
   a real week, it is the reallocation candidate — but wait for the 60-click bar.
2. **Medical & Imaging Equipment is bid $7.00 and paying $0.17.** 20% CTR, 13
   clicks for $2.17. If that holds it is the cheapest quality traffic in the
   account and the thin medical stream may deserve more room.

The open strategic question for Sam is whether $25.00/day is still the right
cap, given all three campaigns are now losing ~half their impressions to budget
rather than to rank. That is a decision, not a playbook rule — not changed here.
