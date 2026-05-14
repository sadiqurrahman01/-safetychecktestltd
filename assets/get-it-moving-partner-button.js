(function () {
  if (window.__SCT_GET_IT_MOVING_BUTTON__) return;
  window.__SCT_GET_IT_MOVING_BUTTON__ = true;

  function clean(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function makeButton() {
    var wrap = document.createElement("div");
    wrap.id = "sct-get-it-moving-partner-button";
    wrap.style.cssText = [
      "margin-top:18px",
      "display:flex",
      "flex-wrap:wrap",
      "gap:10px",
      "align-items:center"
    ].join(";");

    wrap.innerHTML = [
      '<a href="https://www.getitmoving.co.uk" target="_blank" rel="noopener" style="',
      'display:inline-flex;align-items:center;justify-content:center;',
      'min-height:48px;padding:0 20px;border-radius:999px;',
      'background:linear-gradient(135deg,#0b4db8,#2563eb);',
      'color:#ffffff;text-decoration:none;font-weight:900;',
      'box-shadow:0 14px 26px rgba(37,99,235,.24);',
      '">',
      'Book Removals / Flatbed with Get It Moving',
      '</a>',
      '<span style="font-size:13px;color:#64748b;font-weight:700;">Opens sister company website</span>'
    ].join("");

    return wrap;
  }

  function mount() {
    if (document.getElementById("sct-get-it-moving-partner-button")) return;

    var all = Array.prototype.slice.call(document.querySelectorAll("p, div, section, article"));
    var target = all.find(function (el) {
      var text = clean(el.innerText || el.textContent || "");
      return text.indexOf("Need removals, flatbed van support or site logistics?") !== -1 ||
             text.indexOf("Get It Moving") !== -1 && text.indexOf("flatbed") !== -1;
    });

    if (!target) return;

    var box = target;
    for (var i = 0; i < 5 && box.parentElement; i += 1) {
      var text = clean(box.innerText || "");
      if (
        text.indexOf("03306335588") !== -1 ||
        text.indexOf("info@safetychecktestltd.co.uk") !== -1 ||
        text.indexOf("Message on WhatsApp") !== -1
      ) {
        break;
      }
      box = box.parentElement;
    }

    box.appendChild(makeButton());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  setTimeout(mount, 700);
  setTimeout(mount, 1800);
})();
