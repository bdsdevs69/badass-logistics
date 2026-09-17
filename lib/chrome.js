/* ===========================================================
   Badass Logistics — shared site chrome (topbar, header, footer)

   Every page on the site gets its header and footer from here.
   Generators call these directly; apply-chrome.js swaps them into
   hand-written pages as the last write step of `node build.js`.
   All links are root-absolute so the markup is identical at any depth.
   =========================================================== */
const { FAMILIES, SERVICES, inFamily, emailForPath } = require('./taxonomy');

const PHONE = '(307) 284-1332';
const PHONE_HREF = '3072841332';

const menu = (fam) => inFamily(fam)
  .map(s => `<a href="/services/${s.slug}">${s.short}</a>`).join('');

function topbar() {
  return `<div class="topbar"><div class="wrap"><div>📍 88 locations nationwide &nbsp;·&nbsp; <strong>All 50 states</strong> &nbsp;·&nbsp; Riggers first</div><div><a href="tel:${PHONE_HREF}">📞 ${PHONE}</a> &nbsp;·&nbsp; <a href="/contact"><strong>Get a Quote</strong></a></div></div></div>`;
}

function header() {
  return `<header class="site-header"><div class="wrap">
  <a class="logo" href="/"><span class="brand"><span class="l1">BADASS</span><span class="l2">LOGISTICS</span></span></a>
  <button class="nav-toggle" aria-label="Menu" onclick="document.getElementById('nav').classList.toggle('open')">☰</button>
  <nav class="main" id="nav">
    <a href="/">Home</a>
    <div class="nav-drop"><a href="/services/rigging">Rigging</a><div class="drop drop-2col">${menu('rigging')}</div></div>
    <div class="nav-drop"><a href="/services/project-freight">Project Freight</a><div class="drop">${menu('freight')}</div></div>
    <a href="/services/truck-dispatch">Truck Dispatch</a>
    <a href="/locations">Locations</a>
    <a href="/blog/">Blog</a>
    <a href="/about">About</a>
    <a class="btn" style="font-size:14px;padding:9px 16px;box-shadow:3px 3px 0 var(--ink)" href="/contact">Get a Quote</a>
  </nav>
</div></header>`;
}

function footer(rel = '') {
  const email = emailForPath(rel);
  const links = (fam) => inFamily(fam).map(s => `<a href="/services/${s.slug}">${s.label}</a>`).join('');
  return `<footer><div class="wrap"><div class="cols">
  <div><h4>Badass Logistics</h4><p style="opacity:.85;max-width:300px;">Riggers first. Every kind of industrial rigging — machinery moving, plant relocation, MRI and medical equipment, crane lifts, millwright work — plus project freight for the jobs we rig, and truck dispatch for fleets of 4+ trucks.</p></div>
  <div><h4>Rigging Services</h4>${links('rigging')}</div>
  <div><h4>Project Freight</h4>${links('freight')}<h4 style="margin-top:22px;">Fleets</h4>${links('dispatch')}</div>
  <div><h4>Company</h4><a href="/about">About Us</a><a href="/locations">Locations</a><a href="/blog/">Blog</a><a href="/trailer-selector">Trailer Selector</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a></div>
</div><div class="covstrip">Coverage: <a href="/locations/texas">Texas</a> · <a href="/locations/california">California</a> · <a href="/locations/florida">Florida</a> · <a href="/locations/georgia">Georgia</a> · <a href="/locations/illinois">Illinois</a> · <a href="/locations/ohio">Ohio</a> · <a href="/locations/pennsylvania">Pennsylvania</a> · <a href="/locations/new-york">New York</a> · <a href="/locations"><strong>All 88 locations →</strong></a></div><div class="footer-nap"><span class="nap-name">Badass Logistics</span><span>1001 S Main St, STE 500, Kalispell, MT 59901</span><span><a href="tel:${PHONE_HREF}">${PHONE}</a></span><span><a href="mailto:${email}">${email}</a></span></div>
<div class="legal"><span>© 2022–2026 Badass Logistics. All rights reserved.</span><span class="hand">riggers first. made to move heavy things.</span></div></div></footer>`;
}

// Common <head> tail: fonts, icons, stylesheet. Root-absolute.
function headAssets() {
  return `<link rel="sitemap" type="application/xml" href="https://badasslogistics.com/sitemap.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Architects+Daughter&family=Barlow:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Architects+Daughter&family=Barlow:wght@400;500;600;700&display=swap"></noscript>
<link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon.png">
<link rel="icon" type="image/x-icon" sizes="48x48" href="/favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
<link rel="stylesheet" href="/css/styles.css">`;
}

module.exports = { topbar, header, footer, headAssets, PHONE, PHONE_HREF, FAMILIES, SERVICES };
