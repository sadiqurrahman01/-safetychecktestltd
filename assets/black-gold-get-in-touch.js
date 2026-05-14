(function () {
  if (window.__SCT_BLACK_GOLD_GET_IN_TOUCH__) return;
  window.__SCT_BLACK_GOLD_GET_IN_TOUCH__ = true;

  function clean(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function removeOldButtons() {
    Array.prototype.slice.call(document.querySelectorAll(
      "#sct-get-it-moving-partner-button, #sct-get-it-moving-button-row, #sct-get-it-moving-inline-button, #sct-get-it-moving-final-button, #final-getitmoving-contact-button"
    )).forEach(function (el) {
      el.remove();
    });

    Array.prototype.slice.call(document.querySelectorAll("a, span, p, div")).forEach(function (el) {
      var text = clean(el.textContent).toLowerCase();
      var href = String(el.getAttribute && el.getAttribute("href") || "").toLowerCase();

      if (
        href.indexOf("getitmoving.co.uk") !== -1 ||
        text === "opens sister company website" ||
        text === "book removals / flatbed" ||
        text === "book removals / flatbed with get it moving"
      ) {
        el.remove();
      }
    });
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
      '<div class="bg-contact-shell">',
      '  <div class="bg-contact-copy">',
      '    <div class="bg-contact-badge">GET IN TOUCH</div>',
      '    <h2>Need removals, flatbed van support or site logistics?</h2>',
      '    <p>Removals, flatbed van support and site logistics can also be arranged through our sister company, Get It Moving.</p>',
      '  </div>',
      '  <div class="bg-contact-side">',
      '    <div class="bg-contact-details">',
      '      <a class="bg-detail" href="tel:03306335588">',
      '        <span>Call us</span>',
      '        <strong>03306335588</strong>',
      '      </a>',
      '      <a class="bg-detail" href="mailto:info@safetychecktestltd.co.uk">',
      '        <span>Email us</span>',
      '        <strong>info@safetychecktestltd.co.uk</strong>',
      '      </a>',
      '    </div>',
      '    <div class="bg-contact-buttons">',
      '      <a class="bg-btn bg-btn-dark" href="https://wa.me/447379264328" target="_blank" rel="noopener">Message on WhatsApp</a>',
      '      <a class="bg-btn bg-btn-gold" href="https://www.getitmoving.co.uk" target="_blank" rel="noopener">Book Removals / Flatbed</a>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join("");
  }

  function mount() {
    removeOldButtons();

    var section = findContactSection();
    if (!section) return;

    if (section.querySelector(".bg-contact-shell")) return;

    section.innerHTML = buildHtml();
    section.classList.add("black-gold-contact-section");
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
