(function () {
  if (window.__SCT_FINAL_CONTACT__) return;
  window.__SCT_FINAL_CONTACT__ = true;

  function clean(v) {
    return String(v || "").replace(/\s+/g, " ").trim();
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

  function buildContact() {
    return [
      '<div class="sct-final-contact-box">',
      '  <div class="sct-final-contact-copy">',
      '    <div class="sct-final-kicker">GET IN TOUCH</div>',
      '    <h2>Need removals, flatbed van support or site logistics?</h2>',
      '    <p>Removals, flatbed van support and site logistics can also be arranged through our sister company, <strong>Get It Moving</strong>.</p>',
      '  </div>',

      '  <div class="sct-final-contact-actions">',
      '    <div class="sct-final-contact-methods">',
      '      <a class="sct-final-method" href="tel:03306335588">',
      '        <span>Call us</span>',
      '        <strong>03306335588</strong>',
      '      </a>',
      '      <a class="sct-final-method" href="mailto:info@safetychecktestltd.co.uk">',
      '        <span>Email us</span>',
      '        <strong>info@safetychecktestltd.co.uk</strong>',
      '      </a>',
      '    </div>',

      '    <div class="sct-final-buttons">',
      '      <a class="sct-final-btn sct-final-whatsapp" href="https://wa.me/447379264328" target="_blank" rel="noopener">Message on WhatsApp</a>',
      '      <a class="sct-final-btn sct-final-moving" href="https://www.getitmoving.co.uk" target="_blank" rel="noopener">Book Removals / Flatbed</a>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join("");
  }

  function removeDuplicates() {
    Array.prototype.slice.call(document.querySelectorAll("a")).forEach(function (a) {
      var href = String(a.getAttribute("href") || "").toLowerCase();
      var text = clean(a.textContent).toLowerCase();

      if (
        href.indexOf("getitmoving.co.uk") !== -1 ||
        text === "book removals / flatbed with get it moving" ||
        text === "book removals / flatbed"
      ) {
        a.remove();
      }
    });
  }

  function mount() {
    var section = findContactSection();
    if (!section) return;

    if (section.querySelector(".sct-final-contact-box")) return;

    removeDuplicates();
    section.innerHTML = buildContact();
    section.classList.add("sct-final-contact-section");
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
