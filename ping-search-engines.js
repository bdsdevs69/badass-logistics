#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — tell the search engines we shipped

   GitHub Pages has no ping hook, so after a content push the site
   just waits to be recrawled. URL Inspection on 2026-08-11 showed the
   trailer hubs were last crawled 2026-07-14 — nearly a month stale,
   and still reporting referringUrls=1, i.e. Google's picture of them
   predated the Aug 7 link mesh entirely. New pages sat unseen.

   This does the two things that actually move the needle:
     1. IndexNow  -> Bing + Yandex, near-immediate (feeds Copilot)
     2. Sitemaps.submit -> Google, nudges a sitemap re-download

   Google has no supported "recrawl this URL" API for regular pages
   (the Indexing API is JobPosting/BroadcastEvent only), so the
   sitemap resubmit plus real inbound links is the honest lever.

   RUN:
     node ping-search-engines.js                 # everything new or changed since the last successful submit
     node ping-search-engines.js /services/x /blog/y   # explicit paths
     node ping-search-engines.js --all           # every URL in the sitemap (use sparingly)
     node ping-search-engines.js --dry-run       # print the selection, submit nothing

   WHY THIS IS NOT "TODAY'S LASTMOD" ANY MORE (2026-09-23):
   It used to select URLs whose lastmod was today. That silently loses work.
   The 2026-09-22 run shipped 17 pages and never pinged; the next morning the
   default selection was empty, because by then those URLs were stamped
   *yesterday*. They were invisible to the tool that exists to find them, and
   Google's last sitemap read still showed the pre-run URL count. A missed ping
   has to stay visible until it is actually done, so selection is now "what the
   search engines have not been told about", tracked in data/ping-state.json as
   url -> the lastmod we last submitted. New URL, or changed lastmod, means it
   is owed a ping — however many days ago it shipped.

   Needs gsc-key.json for the Google half; the IndexNow half works
   without it. IndexNow key file lives at the repo root and must stay
   reachable at https://badasslogistics.com/<key>.txt
   =========================================================== */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const DOMAIN = 'https://badasslogistics.com';
const HOST = 'badasslogistics.com';
const INDEXNOW_KEY = 'e83558048c9c1b4d6767f314ca9cb757';
const SITE = 'sc-domain:badasslogistics.com';
const SITEMAP = `${DOMAIN}/sitemap.xml`;
const KEY_PATH = process.env.GSC_KEY || path.join(ROOT, 'gsc-key.json');
const STATE_PATH = path.join(ROOT, 'data', 'ping-state.json');

// IndexNow caps a submission at 10,000 URLs; we stay well under by default.
const MAX_URLS = 10000;

function sitemapUrls() {
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)]
    .map(m => ({ loc: m[1], lastmod: m[2] || '' }));
}

// url -> the lastmod value that was in the sitemap when we last submitted it.
function readState() {
  try { return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')).submitted || {}; }
  catch { return {}; }
}

function writeState(submitted) {
  const sorted = Object.fromEntries(Object.keys(submitted).sort().map(k => [k, submitted[k]]));
  fs.writeFileSync(STATE_PATH, JSON.stringify({
    _note: 'Written by ping-search-engines.js. url -> the sitemap lastmod at the time we last told the search engines about it. A URL missing here, or carrying a different lastmod, is owed a ping. Delete this file to force a full resubmit.',
    updated: new Date().toISOString(),
    submitted: sorted,
  }, null, 2) + '\n');
}

function pickUrls(argv) {
  const paths = argv.filter(a => !a.startsWith('--'));
  if (paths.length) return paths.map(p => (p.startsWith('http') ? p : DOMAIN + (p.startsWith('/') ? p : '/' + p)));

  const all = sitemapUrls();
  if (argv.includes('--all')) return all.map(u => u.loc);

  // Default: everything the search engines have not been told about yet —
  // never submitted, or submitted under a different lastmod. Unlike the old
  // "lastmod === today" rule this does not expire, so a run that forgets to
  // ping is picked up by the next one instead of being lost. The generators
  // keep lastmod stable per page (they stamp only what they rewrite), so a
  // plain rebuild does not re-fire the whole site.
  const state = readState();
  return all.filter(u => state[u.loc] !== u.lastmod).map(u => u.loc);
}

async function googleToken() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const b64 = b => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const now = Math.floor(Date.now() / 1000);
  const claim = { iss: key.client_email, scope: 'https://www.googleapis.com/auth/webmasters', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 };
  const input = `${b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64(JSON.stringify(claim))}`;
  const jwt = `${input}.${b64(crypto.createSign('RSA-SHA256').update(input).sign(key.private_key))}`;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });
  const j = await res.json();
  if (!j.access_token) throw new Error(`token request failed: ${JSON.stringify(j)}`);
  return j.access_token;
}

(async () => {
  const argv = process.argv.slice(2);
  const dryRun = argv.includes('--dry-run');
  const urls = pickUrls(argv).slice(0, MAX_URLS);
  if (!urls.length) {
    console.log('Nothing to ping — every URL in sitemap.xml has already been submitted at its current lastmod.');
    console.log('Pass paths explicitly, or --all, if that is not what you expected.');
    return;
  }
  console.log(`Pinging ${urls.length} URL${urls.length === 1 ? '' : 's'}${dryRun ? ' (DRY RUN — nothing submitted)' : ''}\n`);
  if (dryRun) {
    for (const u of urls) console.log(`  ${u}`);
    return;
  }

  // ---- 1. IndexNow (Bing, Yandex) ----
  let indexNowOk = false;
  try {
    const res = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: `${DOMAIN}/${INDEXNOW_KEY}.txt`, urlList: urls }),
    });
    // 200 accepted, 202 accepted but key still validating, 422 = url/key mismatch.
    indexNowOk = res.status === 200 || res.status === 202;
    console.log(`IndexNow          HTTP ${res.status} ${indexNowOk ? '✓ accepted' : '✖ ' + (await res.text()).slice(0, 200)}`);
  } catch (e) {
    console.log(`IndexNow          ✖ ${e.message}`);
  }

  // Only record what was actually accepted. On a failure we deliberately leave
  // the state alone so the same URLs are still owed a ping tomorrow — the whole
  // point of the state file is that a miss stays visible.
  if (indexNowOk) {
    const lastmods = Object.fromEntries(sitemapUrls().map(u => [u.loc, u.lastmod]));
    const state = readState();
    let recorded = 0;
    for (const u of urls) {
      if (lastmods[u] === undefined) continue;   // explicit path not in the sitemap
      state[u] = lastmods[u];
      recorded++;
    }
    writeState(state);
    console.log(`                  recorded ${recorded} URL${recorded === 1 ? '' : 's'} in data/ping-state.json`);
  } else {
    console.log('                  state NOT updated — these URLs stay owed and will be retried next run');
  }

  // ---- 2. Google: resubmit the sitemap ----
  if (!fs.existsSync(KEY_PATH)) {
    console.log(`Google sitemap    – skipped (no key at ${path.relative(ROOT, KEY_PATH)})`);
    return;
  }
  try {
    const token = await googleToken();
    const base = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/sitemaps`;
    const put = await fetch(`${base}/${encodeURIComponent(SITEMAP)}`, { method: 'PUT', headers: { authorization: 'Bearer ' + token } });
    console.log(`Google sitemap    HTTP ${put.status} ${put.status === 204 ? '✓ resubmitted' : '✖ ' + (await put.text()).slice(0, 200)}`);

    const list = await (await fetch(base, { headers: { authorization: 'Bearer ' + token } })).json();
    for (const s of list.sitemap || []) {
      console.log(`  ${s.path}`);
      console.log(`    last downloaded by Google: ${s.lastDownloaded || 'never'} · ${(s.contents || []).map(c => c.submitted + ' urls').join(', ')} · ${s.errors || 0} errors, ${s.warnings || 0} warnings`);
    }
  } catch (e) {
    console.log(`Google sitemap    ✖ ${e.message}`);
  }
})();
