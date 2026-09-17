# Weekly Google Ads review — Badass Logistics

Run every **Monday**. Budget is $500/month across four campaigns, so a
week of drift is 12% of the month. The whole job should take one pass.

Account **788-067-9748**, owner **abdul.samad9k@gmail.com**.
`ads/campaigns.json` is the source of truth for what the account is
*supposed* to look like — if the account and the file disagree, decide
which one is right and update the other in the same run.

## Before opening a browser

```bash
node ads/check-ads.js --live
```

Catches over-length copy, budget drift past $500/mo, retired heavy-haul
wording, and any landing page that has started 404ing. A dead final URL
is the single most expensive thing that can silently happen here.

## Getting into the account

`switch_browser` and have Sam click **Connect** in the Chrome signed in
as abdul.samad9k@gmail.com. Do not trust the `list_connected_browsers`
device-id → label mapping; it reshuffles between runs and has landed on
the wrong Google profile before. The session also drops mid-task fairly
often — just re-run `switch_browser` and carry on.

## The review, in order

**1. Pull 30 days, not 7.** At this budget a 7-day window is 20–40
clicks spread over four campaigns, which is noise. Use 30 days for every
decision; use 7 days only to confirm a change from last week took
effect.

**2. Campaign table first.** Record for each campaign: impressions, CTR,
clicks, cost, conversions, CPA. This is the only view that shows whether
the budget split is still right. The reallocation rule:

- A campaign with **0 conversions on 60+ clicks in 30 days** gets its
  budget cut by a third, and the third moves to the best CPA campaign.
  (At the proven ~3.3% conversion rate, 60 clicks with zero leads is
  roughly a 1-in-100 fluke, not bad luck.)
- A campaign under **$100 CPA** gets first claim on any freed budget.
- Never take a campaign below $1.50/day — under that Google stops
  serving it consistently and the data becomes meaningless.
- Keep the four daily budgets summing to **$16.40/day or less**.

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
new authority" — both of which we do not serve. If those are getting
through, the campaign negative list needs widening, not the budget.

**5. Keyword tab before pausing anything.** A search term at 0% CTR does
*not* mean the keyword that matched it is bad — a phrase keyword also
picks up productive long-tail. Check the keyword's own row. If the
keyword is fine and only the bare query is junk, add the query as an
**exact-match negative** instead of pausing the keyword.

**6. Ad strength.** Any ad below "Good" gets headlines added until it
clears. The lever that actually works is using the ad group's own
keywords verbatim as headlines. Ad strength only recalculates after the
field loses focus.

**7. Bidding.** Stay on Maximize clicks. A campaign only moves to
Maximize conversions once *it* has 15+ conversions in 30 days — not the
account total. Switching early spikes CPC and cuts volume.

## Log the run

Append a dated block to `ads/log.md`: the campaign table, what was
added or paused, what was deliberately not done and why. The "why not"
notes are the ones that stop a future run from re-litigating a decision
that was already made and tested.

## UI gotchas that keep costing time

- Search terms path is `/aw/keywords/searchterms` — no hyphen. The
  hyphenated URL 404s.
- The negative-keyword panel is dismissed by scrolling after you type.
  Sequence: click FAB → scroll down → click textarea → type → click
  Save, with no scrolling in between.
- A multi-line paste into the add-keyword box silently drops lines.
  Verify every keyword landed and re-add the missing ones one at a time.
- Date-picker text fields ignore typed dates. Click the calendar days.
- The campaigns table's horizontal scroll ignores scroll events — drag
  the scrollbar to reach the Conversions column.
- Rapid reloads of `/aw/*` deep links trigger a rate-limit error page.
  Wait ~30s and reload.
- The "+ new ad group" wizard's "Save and continue" does not reliably
  commit. Check the ad groups list actually shows the new group.
- `mcp__claude-in-chrome__navigate` is blocked from badasslogistics.com.
  Use WebFetch to verify landing pages.
