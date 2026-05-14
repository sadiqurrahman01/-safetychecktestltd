(function () {
  if (window.__SCT_TIDY_GET_IN_TOUCH__) return;
  window.__SCT_TIDY_GET_IN_TOUCH__ = true;

  function clean(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function findContactSection() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll("section, article, div"));
    var matches = nodes.filter(function (el) {
      var text = clean(el.innerText || el.textContent || "").toLowerCase();
      return (
        text.indexOf("get in touch") !== -1 &&
        text.indexOf("03306335588") !== -1 &&
        text.indexOf("info@safetychecktestltd.co.uk") !== -1 &&
        text.indexOf("message on whatsapp") !== -1
      );
    });

    if (!matches.length) return null;

    matches.sort(function (a, b) {
      return clean(a.innerText || "").length - clean(b.innerText || "").length;
    });

    return matches[0];
  }

  function buildHtml() {
    return [
      '<div class="tidy-contact-wrap">',
      '  <div class="tidy-contact-copy">',
      '    <p class="tidy-kicker">GET IN TOUCH</p>',
      '    <h2>Need removals, flatbed van support or site logistics?</h2>',
      '    <p class="tidy-text">Removals, flatbed van support and site logistics can also be arranged through our sister company, Get It Moving.</p>',
      '  </div>',

      '  <div class="tidy-contact-panel">',
      '    <div class="tidy-contact-methods">',
      '      <a class="tidy-method" href="tel:03306335588">',
      '        <span>Phone</span>',
      '        <strong>03306335588</strong>',
      '      </a>',
      '      <a class="tidy-method" href="mailto:info@safetychecktestltd.co.uk">',
      '        <span>Email</span>',
      '        <strong>info@safetychecktestltd.co.uk</strong>',
      '      </a>',
      '    </div>',

      '    <div class="tidy-actions">',
      '      <a class="tidy-btn tidy-btn-primary" href="https://wa.me/447379264328" target="_blank" rel="noopener">Message on WhatsApp</a>',
      '      <a class="tidy-btn tidy-btn-secondary" href="https://www.getitmoving.co.uk" target="_blank" rel="noopener">Book Removals / Flatbed with Get It Moving</a>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join("");
  }

  function mount() {
    var section = findContactSection();
    if (!section) return;

    if (section.querySelector(".tidy-contact-wrap")) return;

    section.innerHTML = buildHtml();
    section.classList.add("tidy-get-in-touch-section");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  setTimeout(mount, 600);
  setTimeout(mount, 1600);
  setTimeout(mount, 3000);
})();
