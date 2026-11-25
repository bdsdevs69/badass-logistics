// Bot guard for the quote and contact forms, plus the copy that feeds the
// ops portal.
//
// The FormSubmit endpoint is deliberately NOT in the page HTML: scrapers
// harvested it and posted fake quotes straight to it. It is attached here,
// at submit time, only when a real browser ran this script, the visitor
// spent a few seconds on the page, and the hidden honeypot is empty.
//
// A genuine submit also leaves a short-lived marker that /thanks reads, so
// the Google Ads "Request quote" conversion fires once per real submission
// rather than on every load of /thanks.
//
// THE PORTAL COPY IS ADDITIVE AND MUST STAY THAT WAY. The email through
// FormSubmit is the lead's guaranteed path and nothing here may delay or
// block it: the copy goes out with sendBeacon, which is fire-and-forget and
// survives the page unloading, wrapped so a portal that is down, slow or
// unreachable cannot cost a real enquiry.
(function () {
  var ENDPOINT = 'https://formsubmit.co/' + ['info', 'badasslogistics.com'].join('@');
  var PORTAL = 'https://badass-ops-production.up.railway.app/api/leads';
  var MIN_MS = 3000;
  var opened = Date.now();

  // Google's click id lands on the landing page, which is usually not the
  // page the form sits on. Remember it for the session so a lead can still
  // be attributed to a campaign two clicks later.
  function remember() {
    try {
      var p = new URLSearchParams(location.search);
      ['gclid', 'utm_source', 'utm_campaign'].forEach(function (k) {
        var v = p.get(k);
        if (v) sessionStorage.setItem('bl_' + k, v.slice(0, 200));
      });
      if (!sessionStorage.getItem('bl_ref') && document.referrer &&
          document.referrer.indexOf(location.host) === -1) {
        sessionStorage.setItem('bl_ref', document.referrer.slice(0, 300));
      }
    } catch (err) {}
  }
  function recall(k) { try { return sessionStorage.getItem('bl_' + k) || ''; } catch (err) { return ''; } }

  function toPortal(form) {
    try {
      if (!navigator.sendBeacon) return;
      var out = {
        source_page: location.pathname,
        gclid: recall('gclid'),
        utm_source: recall('utm_source'),
        utm_campaign: recall('utm_campaign'),
        referrer: recall('ref')
      };
      var fields = form.querySelectorAll('input[name], textarea[name], select[name]');
      for (var i = 0; i < fields.length; i++) {
        var nm = fields[i].name;
        if (!nm || nm.charAt(0) === '_') continue;     // FormSubmit's own controls
        if (fields[i].type === 'checkbox' && !fields[i].checked) continue;
        out[nm] = String(fields[i].value || '').slice(0, 4000);
      }
      // text/plain keeps this a simple cross-origin request: no preflight,
      // which sendBeacon could not satisfy anyway.
      navigator.sendBeacon(PORTAL, new Blob([JSON.stringify(out)], { type: 'text/plain;charset=UTF-8' }));
    } catch (err) {
      // Swallowed on purpose. The email is the lead's real path.
    }
  }

  function onSubmit(e) {
    var form = e.target;
    var honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) { e.preventDefault(); return; }
    if (Date.now() - opened < MIN_MS) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      if (btn) { btn.textContent = 'One moment, then press again →'; }
      return;
    }
    form.action = ENDPOINT;
    try { localStorage.setItem('bl_quote_sent', String(Date.now())); } catch (err) {}
    toPortal(form);
  }

  remember();
  var forms = document.querySelectorAll('form[data-guard]');
  for (var i = 0; i < forms.length; i++) forms[i].addEventListener('submit', onSubmit);
})();
