# Weekly Google Ads review — Badass Logistics

Run every **Monday**. Budget is $40.00/day across three campaigns on a
weekday-only schedule — about $880/month — so a week of drift is a
quarter of the month. The whole job should take one pass.

Account **788-067-9748**, owner **abdul.samad9k@gmail.com**.
`ads/campaigns.json` is the source of truth for what the account is
*supposed* to look like — if the account and the file disagree, decide
which one is right and update the other in the same run.

## What the account is, as of the 2026-09-23 budget raise

| Campaign | Daily | Ad groups (Manual CPC bid) | Landing page |
|---|---|---|---|
| Crane & Rigging | $15.00 | Crane & Rigging Services $4.00 · Industrial Rigging & Millwright $4.00 · Crating, Loading & Handling $3.50 | /quote-crane, /quote-rigging |
| Machinery & Medical Equipment | $15.00 | Machinery Moving $4.50 · CNC & Machine Tools $4.50 · Medical & Imaging Equipment $7.00 | /quote-machinery, /quote-medical |
| Fleet Dispatch | $10.00 | Dispatch For Fleets $3.00 | /quote-dispatch |

All three run **Monday–Friday, 07:00–21:00, account time zone ET**, on
**Manual CPC**, targeting the **20 GBP metros** (canonical
`City, State, United States` form), and carry their own negative lists.

That window looks wide on purpose. Google applies **one** schedule in the
account's Eastern clock to every metro, so 07:00–21:00 ET is 7am–9pm
Eastern, 6am–8pm Central, 5am–7pm Denver and **4am–6pm Phoenix**. The
earlier 07:00–19:00 band cut Phoenix off at 4pm local and Denver at 5pm.
Do not narrow the evening back without checking what it costs the two
western metros — the early-morning western hours bill nothing because
nobody is searching, so the band is cheaper than it looks.

Assets: the **rigging set** (6 sitelinks, 6 callouts, one "Service
catalog" structured snippet) sits at **account level** so it covers both
rigging campaigns. The **dispatch set** (4 sitelinks, 6 callouts, its
own "Service catalog" snippet) sits at **campaign level on Fleet
Dispatch**, which overrides the account set — a fleet owner does not
need a "Lifts to 200,000+ Lbs" callout.

Both retired campaigns (heavy haul, the old rigging campaign) are
**Removed**. Their old campaign-level assets still appear in the Assets
table with an Eligible status; that is cosmetic — a removed campaign
cannot serve, so leave them alone rather than hunting them down.

## Before opening a browser

```bash
node ads/check-ads.js --live
```

Catches over-length copy, budget drift past the cap, retired heavy-haul
wording, a missing per-ad-group bid, and any landing page that has
started 404ing. A dead final URL is the single most expensive thing that
can silently happen here.

## Getting into the account

`switch_browser` and have Sam click **Connect** in the Chrome signed in
as abdul.samad9k@gmail.com. Do not trust the `list_connected_browsers`
device-id → label mapping; it reshuffles between runs and has landed on
the wrong Google profile before. The session also drops mid-task fairly
often — just re-run `switch_browser` and carry on.

## The review, in order

**1. Pull 30 days, not 7.** At this budget a 7-day window is 20–40
clicks spread over three campaigns, which is noise. Use 30 days for
every decision; use 7 days only to confirm a change from last week took
effect.

**2. Campaign table first.** Record for each campaign: impressions,
search impression share (and the lost-to-rank share), CTR, clicks, cost,
conversions, CPA. Impression share lost to *rank* is the number that
diagnosed the old account — $1.96 average CPC sat under the top-of-page
price and threw away 72.8% of impressions. If lost-to-rank is high and
lost-to-budget is low, **raise the ad group's bid; do not raise the
budget.** The reallocation rule:

- A campaign with **0 conversions on 60+ clicks in 30 days** gets its
  budget cut by a third, and the third moves to the best CPA campaign.
  (At the proven ~3.3% conversion rate, 60 clicks with zero leads is
  roughly a 1-in-100 fluke, not bad luck.)
- A campaign under **$100 CPA** gets first claim on any freed budget.
- Never take a campaign below $1.50/day — under that Google stops
  serving it consistently and the data becomes meaningless.
- Keep the three daily budgets summing to **$40.00/day or less**, which
  `check-ads.js` enforces at 22 billable weekdays a month.

**3. Search terms, 30 days, sorted by cost.** Add negatives for anything
that is not a company trying to hire a rigging, machinery, crane or
fleet-dispatch crew. Put genuinely global junk in the shared
**BL - Global Negatives** list; put theme-specific junk on the campaign.
Then mirror whatever you added into `ads/campaigns.json` so the file
stays true.

Four negatives are **permanently off limits** — the reasons are in
`campaigns.json` under `sharedNegatives.neverAdd`, and all four have
been proposed and rejected before: `free`, `ontario`, bare `oilfield`,
and the `badass logistics` brand term.

**4. Check the dispatch campaign's terms specifically.** The head of
that market is "truck dispatch services for owner operators" and "for
new authority" — both of which we do not serve. Those four terms
(`owner operator`, `new authority`, `hot shot`, `cdl`) are already
negatives on Fleet Dispatch. If close variants are getting through, the
campaign negative list needs widening, not the budget.

The qualification lives in the **ad copy**, not on the website. Ads say
built for fleets of 4+ trucks; the site stays open, because a three-
truck fleet that grows is still a lead worth taking a call from.

**5. Keyword tab before pausing anything.** A search term at 0% CTR does
*not* mean the keyword that matched it is bad — a phrase keyword also
picks up productive long-tail. Check the keyword's own row. If the
keyword is fine and only the bare query is junk, add the query as an
**exact-match negative** instead of pausing the keyword.

**6. Ad strength.** Any ad below "Good" gets headlines added until it
clears. The lever that actually works is using the ad group's own
keywords verbatim as headlines. Ad strength only recalculates after the
field loses focus.

**7. Bidding — Manual CPC, deliberately.** Do not switch to Maximize
clicks or any automated strategy yet. Below roughly 30 conversions a
month an automated bidder has no signal, and Maximize clicks is exactly
how the old account let heavy haul take 74% of spend for zero
conversions. A campaign earns the move to Maximize conversions once *it*
has 15+ conversions in 30 days — not the account total.

Bids move per ad group, against the top-of-page estimate on its own
keyword row. Medical & Imaging Equipment is bid high ($7.00) on purpose:
the whole medical cluster is ~210 searches a month, so it cannot absorb
a budget — it buys position on a thin stream of high-value queries.

## Log the run

Append a dated block to `ads/log.md`: the campaign table, what was
added or paused, what was deliberately not done and why. The "why not"
notes are the ones that stop a future run from re-litigating a decision
that was already made and tested.

## UI gotchas that keep costing time

- Search terms path is `/aw/keywords/searchterms` — no hyphen. The
  hyphenated URL 404s.
- **Negatives cannot be bulk-uploaded.** `Campaign Negative Phrase`,
  `Negative Phrase` and bare `Negative` were all rejected as Criterion
  Types across three upload cycles. Use the Negative keywords panel and
  paste one per line; punctuation carries the match type.
- The negative-keyword panel is dismissed by scrolling after you type.
  Sequence: click FAB → scroll down → click textarea → type → click
  Save, with no scrolling in between.
- A multi-line paste into the add-keyword box silently drops lines.
  Verify every keyword landed and re-add the missing ones one at a time.
- **Bulk upload needs an `EU political ads` column with a bare `No`.**
  A sentence in that cell is rejected; a missing column produced 159
  errors in one go. Locations must be the full
  `Houston, Texas, United States` form, and ad-schedule rows are
  silently ignored by the uploader — set the schedule in the UI.
- **Uploaded campaigns arrive Eligible even with `Status: Paused` in
  the sheet.** Check and pause immediately after every upload.
- The bulk-selection bar's **Edit → Enable does nothing**. Use the row's
  own status dot → menu → Enable. Clicking the small arrow *on* the dot
  applies Enable with no menu and no confirmation — that is how the
  retired heavy-haul campaign got switched back on for a few seconds.
- The ad-schedule day dropdown silently stays on "All days" while the
  times save fine. Set the day first, then verify it stuck.
- In the sitelink form, **Tab shifts focus by one field**. Click each
  field explicitly, and re-screenshot after expanding a panel because
  the whole page shifts.
- Structured snippet headers come from Google's own list. There is no
  plain "Services" — use **Service catalog**.
- After heavy use the panel controls (the uploader FAB, the
  negative-keyword FAB) stop rendering. Full page reload → one click →
  long wait is the reliable recovery.
- Date-picker text fields ignore typed dates. Click the calendar days.
- The campaigns table's horizontal scroll ignores scroll events — drag
  the scrollbar to reach the Conversions column.
- Rapid reloads of `/aw/*` deep links trigger a rate-limit error page.
  Wait ~30s and reload.
- The "+ new ad group" wizard's "Save and continue" does not reliably
  commit. Check the ad groups list actually shows the new group.
- `mcp__claude-in-chrome__navigate` is blocked from badasslogistics.com.
  Use WebFetch to verify landing pages.
