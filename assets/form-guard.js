// Bot guard for the quote and contact forms.
//
// The FormSubmit endpoint is deliberately NOT in the page HTML: scrapers
// harvested it and posted fake quotes straight to it. It is attached here,
// at submit time, only when a real browser ran this script, the visitor
// spent a few seconds on the page, and the hidden honeypot is empty.
//
// A genuine submit also leaves a short-lived marker that /thanks reads, so
// the Google Ads "Request quote" conversion fires once per real submission
// rather than on every load of /thanks.
(function () {
  var ENDPOINT = 'https://formsubmit.co/' + ['info', 'badasslogistics.com'].join('@');
  var MIN_MS = 3000;
  var opened = Date.now();

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
  }

  var forms = document.querySelectorAll('form[data-guard]');
  for (var i = 0; i < forms.length; i++) forms[i].addEventListener('submit', onSubmit);
})();
