# Google Ads — weekly review log

Account **788-067-9748** · owner **abdul.samad9k@gmail.com**.
Newest entry at the top. Playbook: `ads/review.md`. Blueprint: `ads/campaigns.json`.

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

**Nothing in the account.** No budget moved, no bid moved, no negative added, no
keyword paused, no ad edited. One documentation fix in the repo (below).

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
