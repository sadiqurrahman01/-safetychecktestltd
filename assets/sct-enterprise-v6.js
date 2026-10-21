
/* SAFETY CHECK TEST LTD - ENTERPRISE V6 PREVIEW */
(function () {
  'use strict';

  var images = [
    '/assets/gallery/building-refurbishment/building-refurbishment-project-14.jpg',
    '/assets/gallery/exterior-after/finished-exterior-and-patio-works-10.jpg',
    '/assets/gallery/exterior-after/finished-exterior-and-patio-works-4.jpg',
    '/assets/gallery/building-refurbishment/building-refurbishment-project-1.jpg'
  ];

  var timer = null;

  function mountSlideshow() {
    var hero = document.querySelector('.sct-enterprise-hero-v5');

    if (!hero || hero.querySelector('.sct-v6-slideshow')) return;

    var shell = document.createElement('div');
    shell.className = 'sct-v6-slideshow';
    shell.setAttribute('aria-hidden', 'true');

    images.forEach(function (src, index) {
      var slide = document.createElement('div');
      slide.className = 'sct-v6-slide';

      if (index === 0) slide.classList.add('is-active');

      slide.style.backgroundImage = 'url("' + src + '")';
      shell.appendChild(slide);
    });

    hero.insertBefore(shell, hero.firstChild);

    var slides = shell.querySelectorAll('.sct-v6-slide');
    var current = 0;

    var reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    if (reducedMotion.matches) return;

    timer = window.setInterval(function () {
      if (document.hidden || !shell.isConnected) return;

      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }, 5500);
  }

  function mountNavigation() {
    var header = document.querySelector('header');
    if (!header) return;

    var nav = header.querySelector('nav');
    if (!nav) return;

    nav.classList.add('sct-v6-nav');

    if (!nav.id) {
      nav.id = 'sct-v6-primary-navigation';
    }

    if (header.querySelector('.sct-v6-menu-button')) {
      return;
    }

    var requiredLinks = [
      ['Home', '#home'],
      ['Services', '#services'],
      ['Quote', '#quote-wizard'],
      ['Gallery', 'gallery.html'],
      ['About', '#about'],
      ['Contact', '#contact'],
      ['Staff Login', '/employee/'],
      ['Client Portal', '/portal/']
    ];

    var existingLinks = Array.from(
      nav.querySelectorAll('a')
    );

    requiredLinks.forEach(function (item) {
      var label = item[0];
      var href = item[1];

      var matchingLink = existingLinks.find(function (link) {
        var currentHref = link.getAttribute('href') || '';

        return (
          currentHref === href ||
          currentHref.replace(/^\//, '') ===
            href.replace(/^\//, '')
        );
      });

      if (matchingLink) {
        matchingLink.textContent = label;
        matchingLink.setAttribute('href', href);
      } else {
        var newLink = document.createElement('a');
        newLink.href = href;
        newLink.textContent = label;
        nav.appendChild(newLink);
      }
    });

    var portalLinks = header.querySelector(
      '.sct-v6-portal-links'
    );

    if (portalLinks) {
      portalLinks.remove();
    }

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'sct-v6-menu-button';
    button.textContent = '☰ Menu';

    button.setAttribute(
      'aria-controls',
      nav.id
    );

    button.setAttribute(
      'aria-expanded',
      'false'
    );

    button.setAttribute(
      'aria-label',
      'Open navigation menu'
    );

    function closeMenu() {
      nav.classList.remove('is-open');
      button.textContent = '☰ Menu';

      button.setAttribute(
        'aria-expanded',
        'false'
      );

      button.setAttribute(
        'aria-label',
        'Open navigation menu'
      );
    }

    button.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');

      button.textContent = isOpen
        ? '✕ Close'
        : '☰ Menu';

      button.setAttribute(
        'aria-expanded',
        String(isOpen)
      );

      button.setAttribute(
        'aria-label',
        isOpen
          ? 'Close navigation menu'
          : 'Open navigation menu'
      );
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });

    header.insertBefore(button, nav);
  }


  function mountSafeContractorBadges() {
    var badgeSrc =
      '/assets/safecontractor-approved-clean.png';

    function makeBadge(id, className) {
      var wrapper = document.createElement('div');
      wrapper.id = id;
      wrapper.className = className;

      var image = document.createElement('img');
      image.src = badgeSrc;
      image.alt = 'SafeContractor Approved';
      image.loading = 'lazy';

      var copy = document.createElement('div');
      copy.className = 'sct-v6-accreditation-copy';

      var title = document.createElement('strong');
      title.textContent = 'SafeContractor Approved';

      var certificate = document.createElement('span');
      certificate.textContent = 'Certificate MX8819';

      copy.appendChild(title);
      copy.appendChild(certificate);

      wrapper.appendChild(image);
      wrapper.appendChild(copy);

      return wrapper;
    }

    var about = document.querySelector(
      '.sct-enterprise-about-v5'
    );

    if (
      about &&
      !document.getElementById('sct-v6-about-safecontractor')
    ) {
      about.appendChild(
        makeBadge(
          'sct-v6-about-safecontractor',
          'sct-v6-accreditation sct-v6-about-accreditation'
        )
      );
    }

    var legal = document.getElementById('sct-legal-v5');

    if (
      legal &&
      !document.getElementById('sct-v6-footer-safecontractor')
    ) {
      legal.insertAdjacentElement(
        'beforebegin',
        makeBadge(
          'sct-v6-footer-safecontractor',
          'sct-v6-accreditation sct-v6-footer-accreditation'
        )
      );
    }
  }

  function mount() {
    mountSlideshow();
    mountNavigation();
    mountSafeContractorBadges();
  }

  function start() {
    mount();

    [250, 650, 1200, 2200, 3500, 5200].forEach(function (delay) {
      window.setTimeout(mount, delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
