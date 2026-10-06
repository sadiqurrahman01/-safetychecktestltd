(function () {
'use strict';

var KEY = 'sct_consent_v1';
var VERSION = 2;
var ADDRESS =
  'Level 18, 40 Bank Street, Canary Wharf, London, E14 5NR';

function esc(value) {
  return String(value).replace(/[&<>"']/g, function (c) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[c];
  });
}

function removeOldAdditions() {
  [
    'sct-trust-strip',
    'sct-trust-pill',
    'sct-site-legal',
    'sct-inline-legal',
    'sct-enterprise-trust'
  ].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.remove();
  });
}

function mountEnterpriseTrust() {
  if (document.getElementById('sct-enterprise-trust')) return;

  var root = document.getElementById('root');
  if (!root) return;

  var hero = root.querySelector('section');

  if (!hero) {
    hero = root.firstElementChild;
  }

  if (!hero) return;

  var card = document.createElement('div');
  card.id = 'sct-enterprise-trust';

  card.innerHTML =
    '<img class="sct-sc-seal" ' +
      'src="/assets/safecontractor-approved.webp" ' +
      'alt="SafeContractor Approved">' +

    '<div class="sct-sc-details">' +
      '<span class="sct-sc-eyebrow">Independent contractor approval</span>' +
      '<strong>SafeContractor Approved</strong>' +
      '<span class="sct-sc-cert">Certificate MX8819</span>' +
    '</div>' +

    '<a class="sct-sc-verify" ' +
      'href="https://www.ssipportal.org.uk/" ' +
      'target="_blank" rel="noopener noreferrer">' +
      'Verify accreditation' +
      '<span aria-hidden="true">↗</span>' +
    '</a>';

  hero.appendChild(card);
}

function findContactSection() {
  var contact = document.getElementById('contact');

  if (contact) return contact;

  var headings = Array.prototype.slice.call(
    document.querySelectorAll('h1,h2,h3,h4')
  );

  var heading = headings.find(function (el) {
    return (el.textContent || '').trim().toUpperCase() === 'GET IN TOUCH';
  });

  return heading ? heading.closest('section') : null;
}

function mountAddress() {
  if (document.getElementById('sct-office-address')) return;

  var contact = findContactSection();
  if (!contact) return;

  var card = document.createElement('div');
  card.id = 'sct-office-address';

  card.innerHTML =
    '<span class="sct-office-title">Head Office</span>' +
    '<address>' + esc(ADDRESS) + '</address>';

  contact.appendChild(card);
}

function findFooter() {
  var footer = document.querySelector('footer');
  if (footer) return footer;

  var nodes = Array.prototype.slice.call(
    document.querySelectorAll('div,p,section')
  );

  return nodes.find(function (el) {
    var text = el.textContent || '';

    return (
      text.indexOf('© 2026 Safety Check Test Ltd') !== -1 &&
      el.children.length < 15
    );
  }) || null;
}

function mountFooterLinks() {
  if (document.getElementById('sct-footer-legal')) return;

  var footer = findFooter();
  if (!footer) return;

  var links = document.createElement('div');
  links.id = 'sct-footer-legal';

  links.innerHTML =
    '<a href="/privacy.html">Privacy Notice</a>' +
    '<span aria-hidden="true">•</span>' +
    '<a href="/cookies.html">Cookie Policy</a>' +
    '<span aria-hidden="true">•</span>' +
    '<button type="button" data-sct-cookie-settings>' +
      'Cookie Settings' +
    '</button>';

  footer.appendChild(links);
}

function readConsent() {
  try {
    var c = JSON.parse(localStorage.getItem(KEY) || 'null');

    return c && c.version === VERSION ? c : null;
  } catch (e) {
    return null;
  }
}

function activate(category) {
  document.querySelectorAll(
    'script[type="text/plain"][data-sct-consent="' +
    category +
    '"]:not([data-sct-activated])'
  ).forEach(function (oldScript) {
    var script = document.createElement('script');

    Array.prototype.slice.call(oldScript.attributes).forEach(
      function (a) {
        if (
          a.name !== 'type' &&
          a.name !== 'data-sct-consent' &&
          a.name !== 'data-sct-activated'
        ) {
          script.setAttribute(a.name, a.value);
        }
      }
    );

    script.text = oldScript.text || oldScript.textContent || '';
    oldScript.setAttribute('data-sct-activated', '1');
    script.setAttribute('data-sct-activated', '1');

    oldScript.parentNode.insertBefore(
      script,
      oldScript.nextSibling
    );
  });
}

function applyConsent(c) {
  if (!c) return;

  if (c.analytics) activate('analytics');
  if (c.marketing) activate('marketing');

  window.dispatchEvent(
    new CustomEvent('sct:consent', { detail: c })
  );
}

function writeConsent(value) {
  var c = {
    version: VERSION,
    necessary: true,
    analytics: !!value.analytics,
    marketing: !!value.marketing,
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch (e) {}

  applyConsent(c);
  return c;
}

function createBanner() {
  var existing = document.getElementById('sct-cookie-banner');
  if (existing) return existing;

  var banner = document.createElement('section');
  banner.id = 'sct-cookie-banner';

  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-labelledby', 'sct-cookie-title');

  banner.innerHTML =
    '<div class="sct-cookie-inner">' +
      '<div class="sct-cookie-copy">' +
        '<strong id="sct-cookie-title">Privacy choices</strong>' +
        '<p>' +
          'We use necessary storage to operate this website. ' +
          'Optional technologies only run with your permission. ' +
          '<a href="/cookies.html">Cookie Policy</a>' +
        '</p>' +
      '</div>' +

      '<div class="sct-cookie-actions">' +
        '<button type="button" data-sct-accept ' +
          'class="sct-cookie-primary">Accept</button>' +
        '<button type="button" data-sct-reject ' +
          'class="sct-cookie-secondary">Reject</button>' +
        '<button type="button" data-sct-manage ' +
          'class="sct-cookie-link">Settings</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(banner);
  return banner;
}

function createModal() {
  var existing = document.getElementById('sct-cookie-modal');
  if (existing) return existing;

  var modal = document.createElement('div');
  modal.id = 'sct-cookie-modal';
  modal.hidden = true;

  modal.innerHTML =
    '<div class="sct-cookie-panel" role="dialog" ' +
         'aria-modal="true" aria-labelledby="sct-settings-title">' +

      '<div class="sct-modal-head">' +
        '<div>' +
          '<span>Privacy preferences</span>' +
          '<h2 id="sct-settings-title">Cookie settings</h2>' +
        '</div>' +
        '<button type="button" data-sct-close ' +
          'class="sct-modal-close" aria-label="Close">×</button>' +
      '</div>' +

      '<p class="sct-modal-copy">' +
        'Control which optional technologies may run on this website.' +
      '</p>' +

      '<div class="sct-pref-row">' +
        '<div><strong>Necessary</strong>' +
        '<small>Core website and privacy preference functions.</small></div>' +
        '<input type="checkbox" checked disabled>' +
      '</div>' +

      '<div class="sct-pref-row">' +
        '<div><strong>Analytics</strong>' +
        '<small>Helps measure website usage.</small></div>' +
        '<input id="sct-consent-analytics" type="checkbox">' +
      '</div>' +

      '<div class="sct-pref-row">' +
        '<div><strong>Marketing</strong>' +
        '<small>Optional marketing technologies.</small></div>' +
        '<input id="sct-consent-marketing" type="checkbox">' +
      '</div>' +

      '<div class="sct-modal-actions">' +
        '<button type="button" data-sct-save ' +
          'class="sct-cookie-primary">Save choices</button>' +
        '<button type="button" data-sct-reject ' +
          'class="sct-cookie-secondary">Reject optional</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(modal);
  return modal;
}

function openSettings() {
  var c = readConsent() || {
    analytics: false,
    marketing: false
  };

  var modal = createModal();

  modal.querySelector(
    '#sct-consent-analytics'
  ).checked = !!c.analytics;

  modal.querySelector(
    '#sct-consent-marketing'
  ).checked = !!c.marketing;

  modal.hidden = false;
}

function closeSettings() {
  var modal = document.getElementById('sct-cookie-modal');
  if (modal) modal.hidden = true;
}

function hideBanner() {
  var banner = document.getElementById('sct-cookie-banner');
  if (banner) banner.hidden = true;
}

function wire() {
  document.addEventListener('click', function (event) {
    var target = event.target.closest(
      '[data-sct-accept],' +
      '[data-sct-reject],' +
      '[data-sct-manage],' +
      '[data-sct-cookie-settings],' +
      '[data-sct-save],' +
      '[data-sct-close]'
    );

    if (!target) return;

    if (target.matches('[data-sct-accept]')) {
      writeConsent({
        analytics: true,
        marketing: true
      });

      hideBanner();
      closeSettings();
      return;
    }

    if (target.matches('[data-sct-reject]')) {
      writeConsent({
        analytics: false,
        marketing: false
      });

      hideBanner();
      closeSettings();
      return;
    }

    if (
      target.matches(
        '[data-sct-manage],[data-sct-cookie-settings]'
      )
    ) {
      openSettings();
      return;
    }

    if (target.matches('[data-sct-save]')) {
      var modal = createModal();

      writeConsent({
        analytics:
          modal.querySelector('#sct-consent-analytics').checked,
        marketing:
          modal.querySelector('#sct-consent-marketing').checked
      });

      hideBanner();
      closeSettings();
      return;
    }

    if (target.matches('[data-sct-close]')) {
      closeSettings();
    }
  });
}

function refresh() {
  removeOldAdditions();

  if (!document.getElementById('root')) return;

  mountEnterpriseTrust();
  mountAddress();
  mountFooterLinks();
}

function start() {
  wire();
  refresh();

  var consent = readConsent();

  if (consent) {
    applyConsent(consent);
  } else {
    createBanner();
  }

  var root = document.getElementById('root');

  if (root) {
    var observer = new MutationObserver(function () {
      refresh();
    });

    observer.observe(root, {
      childList: true,
      subtree: true
    });
  }

  setTimeout(refresh, 400);
  setTimeout(refresh, 1200);
  setTimeout(refresh, 2500);

  window.SCTConsent = {
    get: readConsent,
    open: openSettings,
    reset: function () {
      try {
        localStorage.removeItem(KEY);
      } catch (e) {}

      location.reload();
    }
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}

})();
