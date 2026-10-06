(function () {
'use strict';

var VERSION = '20261006-enterprise-v51';
var PRIVACY_KEY = 'sct_privacy_v51';
var ADDRESS =
  'Level 18, 40 Bank Street, Canary Wharf, London, E14 5NR';

function norm(v) {
  return String(v || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function exact(selector, text) {
  var nodes = document.querySelectorAll(selector);

  for (var i = 0; i < nodes.length; i++) {
    if (norm(nodes[i].textContent) === text) {
      return nodes[i];
    }
  }

  return null;
}

function containsSmallest(selector, text) {
  var result = [];

  document.querySelectorAll(selector).forEach(function (el) {
    var value = norm(el.textContent);

    if (
      value.indexOf(text) !== -1 &&
      value.length < 700
    ) {
      result.push(el);
    }
  });

  result.sort(function (a, b) {
    return norm(a.textContent).length -
           norm(b.textContent).length;
  });

  return result[0] || null;
}

function sectionOf(el) {
  if (!el) return null;

  return (
    el.closest('section') ||
    el.closest('main > div') ||
    el.parentElement
  );
}

/* ---------------------------------------------------------
   HEADER COMPANY LOGO
--------------------------------------------------------- */

function improveHeaderLogo() {
  var header = document.querySelector('header');

  if (!header) {
    var nav = document.querySelector('nav');
    header = nav ? nav.parentElement : null;
  }

  if (!header) return;

  header.classList.add('sct-header-enterprise');

  var images = header.querySelectorAll('img');
  var logo = null;

  for (var i = 0; i < images.length; i++) {
    var src = String(
      images[i].getAttribute('src') || ''
    ).toLowerCase();

    var alt = String(
      images[i].getAttribute('alt') || ''
    ).toLowerCase();

    if (
      src.indexOf('logo') !== -1 ||
      alt.indexOf('safety check') !== -1
    ) {
      logo = images[i];
      break;
    }
  }

  if (!logo && images.length) {
    logo = images[0];
  }

  if (logo) {
    logo.src =
      '/assets/sct-header-logo-tight.png?' +
      VERSION;

    logo.classList.add('sct-header-logo-enterprise');

    if (logo.parentElement) {
      logo.parentElement.classList.add(
        'sct-header-logo-wrap'
      );
    }
  }
}

/* ---------------------------------------------------------
   HERO / CONTRACTOR POSITIONING
--------------------------------------------------------- */

function findHeroHeading() {
  var headings =
    document.querySelectorAll('#root h1');

  for (var i = 0; i < headings.length; i++) {
    var text = norm(headings[i].textContent);

    if (
      text.indexOf(
        'Electrical, Fire, Property & Building Services Across London'
      ) !== -1 ||
      text.indexOf(
        'Construction, Property & Compliance Contractor Across London'
      ) !== -1
    ) {
      return headings[i];
    }
  }

  return headings[0] || null;
}

function rewriteHero() {
  var h1 = findHeroHeading();

  if (!h1) return;

  var hero = sectionOf(h1);

  if (!hero) return;

  hero.classList.add('sct-enterprise-hero-v5');

  h1.textContent =
    'Construction, Property & Compliance Contractor Across London';

  /*
   * Requested position:
   * SafeContractor logo on a NEW LINE immediately after the H1.
   */
  if (!document.getElementById('sct-hero-safecontractor')) {
    var accreditation = document.createElement('div');

    accreditation.id = 'sct-hero-safecontractor';

    accreditation.innerHTML =
      '<a ' +
        'href="https://www.ssipportal.org.uk/" ' +
        'target="_blank" ' +
        'rel="noopener noreferrer" ' +
        'class="sct-hero-sc-link" ' +
        'aria-label="Validate Safety Check Test Ltd SafeContractor approval">' +

        '<img ' +
          'src="/assets/safecontractor-approved-clean.png?' +
          VERSION +
          '" ' +
          'alt="SafeContractor Approved" ' +
          'class="sct-hero-sc-badge">' +

      '</a>' +

      '<div class="sct-hero-sc-copy">' +
        '<strong>SafeContractor Approved</strong>' +
        '<span>Certificate MX8819</span>' +
      '</div>';

    h1.insertAdjacentElement(
      'afterend',
      accreditation
    );
  }

  var paragraphs = hero.querySelectorAll('p');

  for (var i = 0; i < paragraphs.length; i++) {
    var text = norm(paragraphs[i].textContent);

    if (
      text.indexOf('Safety Check Test Ltd supports') !== -1
    ) {
      paragraphs[i].textContent =
        'Safety Check Test Ltd delivers construction, refurbishment, planned ' +
        'and reactive maintenance, electrical, fire, gas, plumbing and ' +
        'property compliance services for landlords, managing agents, ' +
        'housing providers and commercial clients across London.';

      paragraphs[i].classList.add(
        'sct-hero-intro-v5'
      );

      break;
    }
  }

  var strap = containsSmallest(
    'div,p,span',
    'Qualified Multi-Trade Team'
  );

  if (strap) {
    strap.textContent =
      'Multi-Trade Contractor • Construction & Refurbishment • ' +
      'Property Maintenance • Compliance Services';

    strap.classList.add('sct-enterprise-strap-v5');
  }
}

/* ---------------------------------------------------------
   CONTRACTOR CAPABILITY BAND
--------------------------------------------------------- */

function mountContractorBand() {
  if (document.getElementById('sct-contractor-band-v5')) {
    return;
  }

  var h1 = findHeroHeading();
  var hero = sectionOf(h1);

  if (!hero || !hero.parentNode) return;

  var band = document.createElement('section');

  band.id = 'sct-contractor-band-v5';

  band.innerHTML =
    '<div class="sct-contractor-band-shell">' +

      '<article>' +
        '<span>01</span>' +
        '<div>' +
          '<strong>Construction & Refurbishment</strong>' +
          '<p>' +
            'Building works, refurbishments, kitchens, bathrooms, ' +
            'extensions, finishes and property improvements.' +
          '</p>' +
        '</div>' +
      '</article>' +

      '<article>' +
        '<span>02</span>' +
        '<div>' +
          '<strong>Planned & Reactive Maintenance</strong>' +
          '<p>' +
            'Property repairs, planned works and responsive contractor ' +
            'support for managed buildings and portfolios.' +
          '</p>' +
        '</div>' +
      '</article>' +

      '<article>' +
        '<span>03</span>' +
        '<div>' +
          '<strong>Compliance & Safety</strong>' +
          '<p>' +
            'Electrical, fire, gas and wider property compliance delivered ' +
            'through appropriately qualified or registered operatives.' +
          '</p>' +
        '</div>' +
      '</article>' +

      '<article>' +
        '<span>04</span>' +
        '<div>' +
          '<strong>Commercial & Managed Property</strong>' +
          '<p>' +
            'Contractor support for landlords, agents, businesses, housing ' +
            'providers and multi-site property requirements.' +
          '</p>' +
        '</div>' +
      '</article>' +

    '</div>';

  hero.insertAdjacentElement(
    'afterend',
    band
  );
}

/* ---------------------------------------------------------
   SERVICES
--------------------------------------------------------- */

function nearestQuoteCard(heading) {
  var node = heading;

  for (var level = 0; node && level < 6; level++) {
    var actions =
      node.querySelectorAll ?
        node.querySelectorAll('a,button') :
        [];

    for (var i = 0; i < actions.length; i++) {
      if (
        norm(actions[i].textContent) === 'Get Quote'
      ) {
        return node;
      }
    }

    node = node.parentElement;
  }

  return heading.parentElement;
}

function rewriteCard(oldTitle, newTitle, description) {
  var heading = exact(
    'h2,h3,h4,h5,strong',
    oldTitle
  );

  if (!heading) return;

  heading.textContent = newTitle;

  var card = nearestQuoteCard(heading);

  if (!card) return;

  var paragraphs = card.querySelectorAll('p');

  var best = null;

  for (var i = 0; i < paragraphs.length; i++) {
    if (
      norm(paragraphs[i].textContent).length > 45
    ) {
      best = paragraphs[i];
      break;
    }
  }

  if (best) {
    best.textContent = description;
  }
}

function rewriteServices() {
  var heading = exact(
    'h1,h2,h3,h4',
    'Choose the service you want priced'
  );

  if (heading) {
    heading.textContent =
      'Construction, Property & Compliance Services';

    var section = sectionOf(heading);

    if (section) {
      section.classList.add(
        'sct-enterprise-services-v5'
      );

      var ps = section.querySelectorAll('p');

      for (var i = 0; i < ps.length; i++) {
        if (
          norm(ps[i].textContent)
            .indexOf('Use the smart quote wizard') !== -1
        ) {
          ps[i].textContent =
            'Request pricing for individual works, planned maintenance ' +
            'or a wider contractor scope. Larger projects, multi-site ' +
            'requirements and specialist works are reviewed against the ' +
            'full scope before final pricing.';
          break;
        }
      }
    }
  }

  rewriteCard(
    'Building Works / Refurbishment',
    'Construction & Refurbishment',
    'Multi-trade construction and refurbishment for residential, ' +
    'commercial and managed properties, including kitchens, bathrooms, ' +
    'internal works, finishes, external works and wider improvement scopes.'
  );

  rewriteCard(
    'Property Maintenance',
    'Planned & Reactive Property Maintenance',
    'Responsive repairs, planned maintenance, void works and ongoing ' +
    'contractor support for landlords, managing agents, commercial sites ' +
    'and managed property portfolios.'
  );

  rewriteCard(
    'Compliance Package',
    'Property Compliance & Maintenance',
    'A coordinated contractor solution for property compliance and ' +
    'maintenance requirements. Regulated work is carried out by ' +
    'appropriately qualified or registered operatives.'
  );

  rewriteCard(
    'Garden & External Works',
    'External Works & Property Improvements',
    'Fencing, patios, external repairs, hard landscaping and wider ' +
    'property improvement works priced against the agreed project scope.'
  );
}

/* ---------------------------------------------------------
   WHY CHOOSE / ABOUT
--------------------------------------------------------- */

function rewriteWhyChoose() {
  var heading = exact(
    'h2,h3,h4',
    'A complete quote system for your services'
  );

  if (!heading) return;

  heading.textContent =
    'A contractor built around projects, properties and ongoing works';

  var section = sectionOf(heading);

  if (section) {
    section.classList.add('sct-enterprise-why-v5');
  }
}

function rewriteAbout() {
  var heading = containsSmallest(
    'h2,h3',
    'Qualified electrical, fire, maintenance and building support across London'
  );

  if (!heading) return;

  heading.textContent =
    'Multi-trade construction, maintenance and compliance delivery';

  var section = sectionOf(heading);

  if (!section) return;

  section.classList.add('sct-enterprise-about-v5');

  var paragraphs = section.querySelectorAll('p');

  for (var i = 0; i < paragraphs.length; i++) {
    var text = norm(paragraphs[i].textContent);

    if (
      text.indexOf('Safety Check Test Ltd supports') !== -1
    ) {
      paragraphs[i].textContent =
        'Safety Check Test Ltd provides coordinated contractor support ' +
        'across construction, refurbishment, maintenance and compliance. ' +
        'We work with landlords, managing agents, commercial clients, ' +
        'housing providers and property teams on both planned and reactive ' +
        'requirements.';
      break;
    }
  }
}

/* ---------------------------------------------------------
   HEAD OFFICE
--------------------------------------------------------- */

function mountOfficeCard() {
  if (document.getElementById('sct-office-card-v5')) {
    return;
  }

  var contact = document.getElementById('contact');

  if (!contact) return;

  var actions =
    contact.querySelector('.sct-contact-actions');

  if (!actions) return;

  var office = document.createElement('div');

  office.id = 'sct-office-card-v5';
  office.className = 'sct-contact-card';

  office.innerHTML =
    '<span>Head Office</span>' +
    '<b>' +
      ADDRESS +
    '</b>';

  var buttons =
    actions.querySelector('.sct-contact-buttons');

  if (buttons) {
    actions.insertBefore(office, buttons);
  } else {
    actions.appendChild(office);
  }
}

/* ---------------------------------------------------------
   FOOTER / PRIVACY LINKS
--------------------------------------------------------- */

function mountLegal() {
  if (document.getElementById('sct-legal-v5')) {
    return;
  }

  var nodes =
    document.querySelectorAll(
      'footer, section, div'
    );

  var footer = null;

  for (var i = nodes.length - 1; i >= 0; i--) {
    var text = norm(nodes[i].textContent);

    if (
      text.indexOf('© 2026 Safety Check Test Ltd') !== -1 &&
      text.length < 1600
    ) {
      footer = nodes[i];
      break;
    }
  }

  if (!footer) return;

  var legal = document.createElement('div');

  legal.id = 'sct-legal-v5';

  legal.innerHTML =
    '<a href="/privacy.html">Privacy Notice</a>' +
    '<span>•</span>' +
    '<a href="/cookies.html">Cookie Policy</a>' +
    '<span>•</span>' +
    '<button type="button" data-sct-cookie-settings>' +
      'Cookie Settings' +
    '</button>';

  footer.appendChild(legal);
}

/* ---------------------------------------------------------
   COOKIES / PRIVACY
--------------------------------------------------------- */

function readPrivacy() {
  try {
    var value = JSON.parse(
      localStorage.getItem(PRIVACY_KEY) || 'null'
    );

    if (value && value.version === 51) {
      return value;
    }
  } catch (e) {}

  return null;
}

function saveEssentialChoice() {
  var value = {
    version: 51,
    essential: true,
    analytics: false,
    marketing: false,
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(
      PRIVACY_KEY,
      JSON.stringify(value)
    );
  } catch (e) {}

  return value;
}

function mountCookieBanner() {
  if (
    document.body.classList.contains('sct-policy-page')
  ) {
    return;
  }

  if (readPrivacy()) return;

  if (
    document.getElementById('sct-cookie-banner-v5')
  ) {
    return;
  }

  var banner = document.createElement('aside');

  banner.id = 'sct-cookie-banner-v5';

  banner.setAttribute(
    'aria-label',
    'Cookie and privacy notice'
  );

  banner.innerHTML =
    '<div class="sct-cookie-copy-v5">' +
      '<strong>Privacy & cookies</strong>' +
      '<p>' +
        'We use essential browser storage to operate this website and ' +
        'remember your privacy choice. Optional analytics and advertising ' +
        'cookies are not currently enabled. ' +
        '<a href="/cookies.html">Learn more</a>.' +
      '</p>' +
    '</div>' +

    '<div class="sct-cookie-actions-v5">' +
      '<button type="button" ' +
        'class="sct-cookie-continue-v5" ' +
        'data-sct-cookie-continue>' +
        'Accept essential' +
      '</button>' +

      '<button type="button" ' +
        'class="sct-cookie-settings-v5" ' +
        'data-sct-cookie-settings>' +
        'Settings' +
      '</button>' +
    '</div>';

  document.body.appendChild(banner);
}

function openCookieSettings() {
  var modal =
    document.getElementById('sct-cookie-modal-v5');

  if (modal) {
    modal.hidden = false;
    return;
  }

  modal = document.createElement('div');

  modal.id = 'sct-cookie-modal-v5';

  modal.innerHTML =
    '<div class="sct-cookie-panel-v5" ' +
         'role="dialog" ' +
         'aria-modal="true" ' +
         'aria-labelledby="sct-cookie-heading-v5">' +

      '<div class="sct-cookie-modal-head-v5">' +
        '<div>' +
          '<span>Privacy preferences</span>' +
          '<h2 id="sct-cookie-heading-v5">' +
            'Cookie settings' +
          '</h2>' +
        '</div>' +

        '<button type="button" ' +
          'data-sct-cookie-modal-close ' +
          'aria-label="Close">' +
          '×' +
        '</button>' +
      '</div>' +

      '<p class="sct-cookie-modal-intro-v5">' +
        'Safety Check Test Ltd currently uses essential browser storage. ' +
        'Optional analytics and advertising cookies are not currently ' +
        'configured on the public website.' +
      '</p>' +

      '<div class="sct-cookie-row-v5">' +
        '<div>' +
          '<strong>Essential</strong>' +
          '<small>' +
            'Required for website operation and remembering privacy choices.' +
          '</small>' +
        '</div>' +
        '<span class="sct-cookie-on-v5">Always on</span>' +
      '</div>' +

      '<div class="sct-cookie-row-v5">' +
        '<div>' +
          '<strong>Analytics</strong>' +
          '<small>No optional analytics cookies currently configured.</small>' +
        '</div>' +
        '<span class="sct-cookie-off-v5">Not used</span>' +
      '</div>' +

      '<div class="sct-cookie-row-v5">' +
        '<div>' +
          '<strong>Advertising / Marketing</strong>' +
          '<small>No optional marketing cookies currently configured.</small>' +
        '</div>' +
        '<span class="sct-cookie-off-v5">Not used</span>' +
      '</div>' +

      '<button type="button" ' +
        'class="sct-cookie-save-v5" ' +
        'data-sct-cookie-save>' +
        'Save & close' +
      '</button>' +

    '</div>';

  document.body.appendChild(modal);
}

function wirePrivacy() {
  if (
    document.documentElement
      .getAttribute('data-sct-v5-wired') === 'yes'
  ) {
    return;
  }

  document.documentElement.setAttribute(
    'data-sct-v5-wired',
    'yes'
  );

  document.addEventListener(
    'click',
    function (event) {
      var continueButton =
        event.target.closest(
          '[data-sct-cookie-continue]'
        );

      var settingsButton =
        event.target.closest(
          '[data-sct-cookie-settings]'
        );

      var saveButton =
        event.target.closest(
          '[data-sct-cookie-save]'
        );

      var closeButton =
        event.target.closest(
          '[data-sct-cookie-modal-close]'
        );

      if (continueButton) {
        saveEssentialChoice();

        var banner =
          document.getElementById(
            'sct-cookie-banner-v5'
          );

        if (banner) banner.remove();

        return;
      }

      if (settingsButton) {
        openCookieSettings();
        return;
      }

      if (saveButton) {
        saveEssentialChoice();

        var banner2 =
          document.getElementById(
            'sct-cookie-banner-v5'
          );

        if (banner2) banner2.remove();

        var modal =
          document.getElementById(
            'sct-cookie-modal-v5'
          );

        if (modal) modal.hidden = true;

        return;
      }

      if (closeButton) {
        var modal2 =
          document.getElementById(
            'sct-cookie-modal-v5'
          );

        if (modal2) modal2.hidden = true;
      }
    }
  );
}

/* ---------------------------------------------------------
   APPLY PAGE
--------------------------------------------------------- */

function applyEnterpriseLayout() {
  if (!document.getElementById('root')) return;

  improveHeaderLogo();
  rewriteHero();
  mountContractorBand();
  rewriteServices();
  rewriteWhyChoose();
  rewriteAbout();
  mountOfficeCard();
  mountLegal();
}

function start() {
  wirePrivacy();
  mountCookieBanner();

  [
    0,
    250,
    650,
    1200,
    2200,
    3500,
    5000
  ].forEach(function (delay) {
    setTimeout(
      applyEnterpriseLayout,
      delay
    );
  });

  window.SCTPrivacy = {
    open: openCookieSettings,

    reset: function () {
      try {
        localStorage.removeItem(PRIVACY_KEY);
      } catch (e) {}

      location.reload();
    }
  };
}

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    start
  );
} else {
  start();
}

})();
