# Semi-weekly SEO run — Badass Logistics

Runs **Tuesday and Friday**. This file holds the per-article standards.
**`seo/schedule.md` owns the pace and the batch** — it is Sam's plan and
it wins over anything here. As of the 2026-09-22 → 2026-10-23 block that
is 6 to 8 articles per run alongside a structural batch, not one.

Everything here happens in `~/badass-logistics`.

## 1. Write the posts

Take the next `status: "todo"` items from `seo/content-queue.json` — as
many as today's row in `seo/schedule.md` calls for. Run
`node seo/check-pace.js` first: at this rate the queue empties in two
runs, and a run that starts with an empty queue writes thin posts off a
brainstorm. If it says the backlog is short, backfill with
`node gsc-gaps.js 90` before writing a word.

Write each as a module at `content/blog-new/<slug>.js`, matching the
shape of the existing ones:

```
slug, cat, hero, date, title, desc, dek, tldr, keywords, body, faq, related
```

Non-negotiables, because they are what makes these rank and get cited:

- **`tldr` is a real answer**, 40–70 words, written so it can be lifted
  whole into an AI Overview or a featured snippet. It states the answer
  in the first sentence, not a preamble.
- **`body` H2s are questions** where the query is a question. Answer
  directly in the first paragraph under each H2, then elaborate.
- **`faq` has 4–6 entries** — these become FAQPage schema.
- **Link to the service pages** named in the queue item, plus 2–3
  related posts. Blog-to-blog links are relative (`other-post.html`),
  blog-to-service go up one (`../services/x.html`).
- **1,200–2,000 words.** Under 1,200 and it reads thin against the
  competitors already ranking.
- No prices. No MC/DOT claims. Never "our trucks" or "our fleet". No
  certification claims. Freight between sites always moves "through our
  licensed broker and carrier partners".

Then flip that queue item to `"status": "done"` with `"published"` set
to the date. When the queue drops below 4 items, add more — pull them
from Search Console queries that are getting impressions with no
matching page, not from a brainstorm.

## 2. Build and verify

```bash
node scripts/check-content.js <slug>   # once per new article
node build.js
```

**Always `node build.js`** — never a single generator. The bare
generators wipe the link passes, and that has broken the live site
twice. `build.js` runs the whole chain and then gates on the verify
block: city mesh, broken links, links to retired URLs, duplicate
titles, heavy-haul leakage, redirect stubs, sitemap sanity. If verify
fails, nothing ships until it passes.

## 3. Ship and tell the engines

```bash
git add -A && git commit && git push origin main
node ping-search-engines.js
```

`ping-search-engines.js` pushes the new and changed URLs to IndexNow,
which reaches Bing, Yandex and Copilot within minutes, and resubmits the
sitemap to Google. Both halves work — `gsc-key.json` was reissued on
2026-09-21 and lives at the repo root (gitignored, chmod 600). No
hand-submitting in the Search Console UI any more.

If the Google half ever fails with a credential error, the key is a
service-account key for `badass-gsc-reader@badass-gsc-reader.iam.gserviceaccount.com`
in GCP project `badass-gsc-reader`, owned by abdul.samad9k@gmail.com.
Reissue with:

```bash
gcloud iam service-accounts keys create gsc-key.json \
  --iam-account=badass-gsc-reader@badass-gsc-reader.iam.gserviceaccount.com \
  --project=badass-gsc-reader
```

GitHub Pages takes a couple of minutes to deploy. Confirm the new URL
actually returns 200 before considering the run done.

## 4. Technical + AEO checks

Each run:

- `curl -sI` the new post and one older page. Both must be 200, not 301
  into a stub.
- Confirm the post is in `sitemap.xml` and in `llms.txt`.
- Confirm the FAQPage and Article schema render — a JSON syntax error in
  a `faq` entry silently kills the whole block.

Every **fourth** run, do the wider sweep instead of just the above:

- Search Console: coverage, and the "Crawled – currently not indexed"
  count on `/services/*/` city pages. **The standing rule from the
  revamp: if more than 40% of city pages are still unindexed 8 weeks
  after launch, consolidate the weakest matrix** rather than writing
  more of them. That deadline lands mid-November 2026.
- Check the top 20 queries for pages sitting at positions 5–15 — those
  are the cheapest wins, and usually need a better title or a direct
  answer near the top, not a new page.
- Ask an AI search engine (ChatGPT, Perplexity) two or three of the
  money questions — "who moves MRI machines", "industrial rigging
  company near me" — and note whether the site is cited. That is the
  only honest AEO scoreboard available without paid tools.

## 5. Log it

Append to `seo/log.md`: date, post shipped, verify result, what the
checks showed, and anything deliberately not done. Keep it short.

## What this run is not for

Do not touch the Google Ads account here — that is the Monday run in
`ads/review.md`. Do not add location pages; the matrix is already at 352
city pages and the quality gate on that is a hard stop, not a warning.
Do not chase backlinks: the last audit came back 67 of 96 toxic, and
off-site auto-posting is off limits.
