(function () {
  if (window.__SCT_CONTACT_SECTION_NEAT__) return;
  window.__SCT_CONTACT_SECTION_NEAT__ = true;

  function clean(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function findContactSection() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll("section, article, div"));
    var matches = nodes.filter(function (el) {
      var text = clean(el.innerText || el.textContent || "");
      return (
        text.indexOf("GET IN TOUCH") !== -1 &&
        text.indexOf("03306335588") !== -1 &&
        text.indexOf("info@safetychecktestltd.co.uk") !== -1 &&
        text.indexOf("Message on WhatsApp") !== -1
      );
    });

    if (!matches.length) return null;

    matches.sort(function (a, b) {
      return clean(a.innerText || "").length - clean(b.innerText || "").length;
    });

    return matches[0];
  }

  function buildContactHtml() {
    return [
      '<div class="sct-contact-polished">',
      '  <div class="sct-contact-left">',
      '    <div class="sct-contact-kicker">GET IN TOUCH</div>',
      '    <h2>Need help with compliance, property works or site logistics?</h2>',
      '    <p>Contact Safety Check Test Ltd for electrical, fire, gas, plumbing, maintenance and building support. For removals, flatbed van support and site logistics, you can also book through our sister company, Get It Moving.</p>',
      '  </div>',
      '  <div class="sct-contact-right">',
      '    <div class="sct-contact-methods">',
      '      <a class="sct-contact-method" href="tel:03306335588">',
      '        <span>Call us</span>',
      '        <strong>03306335588</strong>',
      '      </a>',
      '      <a class="sct-contact-method" href="mailto:info@safetychecktestltd.co.uk">',
      '        <span>Email us</span>',
      '        <strong>info@safetychecktestltd.co.uk</strong>',
      '      </a>',
      '    </div>',
      '    <div class="sct-contact-actions">',
      '      <a class="sct-contact-btn sct-whatsapp" href="https://wa.me/447379264328" target="_blank" rel="noopener">Message on WhatsApp</a>',
      '      <a class="sct-contact-btn sct-moving" href="https://www.getitmoving.co.uk" target="_blank" rel="noopener">Book Removals / Flatbed</a>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join("");
  }

  function removeOldHelperButtons() {
    Array.prototype.slice.call(document.querySelectorAll(
      "#sct-get-it-moving-partner-button, #sct-get-it-moving-button-row, #sct-get-it-moving-inline-button, #sct-get-it-moving-final-button"
    )).forEach(function (el) {
      el.remove();
    });
  }

  function mount() {
    removeOldHelperButtons();

    var section = findContactSection();
    if (!section) return;
    if (section.querySelector(".sct-contact-polished")) return;

    section.innerHTML = buildContactHtml();
    section.classList.add("sct-contact-section-fixed");
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
