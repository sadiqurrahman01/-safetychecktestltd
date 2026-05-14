(function () {
  if (window.__SCT_GET_IT_MOVING_FINAL__) return;
  window.__SCT_GET_IT_MOVING_FINAL__ = true;

  function txt(el) {
    return String((el && (el.innerText || el.textContent)) || "").replace(/\s+/g, " ").trim();
  }

  function removeWrongButtons() {
    Array.prototype.slice.call(document.querySelectorAll("#sct-get-it-moving-partner-button, #sct-get-it-moving-button-row, #sct-get-it-moving-inline-button, #sct-get-it-moving-final-button")).forEach(function (el) {
      el.remove();
    });

    Array.prototype.slice.call(document.querySelectorAll("a")).forEach(function (a) {
      var href = String(a.getAttribute("href") || "").toLowerCase();
      var text = txt(a).toLowerCase();

      if (href.indexOf("getitmoving.co.uk") !== -1 || text.indexOf("book removals") !== -1 || text.indexOf("get it moving") !== -1) {
        var parent = a.parentElement;
        var grand = parent && parent.parentElement;

        a.remove();

        if (parent && txt(parent).toLowerCase().indexOf("opens sister company website") !== -1) {
          parent.remove();
        }

        if (grand && txt(grand).toLowerCase().indexOf("opens sister company website") !== -1 && txt(grand).length < 180) {
          grand.remove();
        }
      }
    });

    Array.prototype.slice.call(document.querySelectorAll("span, p, div")).forEach(function (el) {
      if (txt(el).toLowerCase() === "opens sister company website") {
        el.remove();
      }
    });
  }

  function findGetInTouchSection() {
    var sections = Array.prototype.slice.call(document.querySelectorAll("section, footer, main > div, div, article"));
    var candidates = sections.filter(function (el) {
      var text = txt(el).toLowerCase();
      return text.indexOf("get in touch") !== -1 &&
             text.indexOf("message on whatsapp") !== -1 &&
             text.indexOf("03306335588") !== -1;
    });

    if (!candidates.length) return null;

    candidates.sort(function (a, b) {
      return txt(a).length - txt(b).length;
    });

    return candidates[0];
  }

  function findWhatsAppElement(section) {
    var linksAndButtons = Array.prototype.slice.call(section.querySelectorAll("a, button"));
    var match = linksAndButtons.find(function (el) {
      var text = txt(el).toLowerCase();
      var href = String(el.getAttribute("href") || "").toLowerCase();
      return text.indexOf("message on whatsapp") !== -1 ||
             href.indexOf("wa.me") !== -1 ||
             href.indexOf("whatsapp") !== -1;
    });

    if (match) return match;

    var all = Array.prototype.slice.call(section.querySelectorAll("*"));
    return all.find(function (el) {
      return txt(el).toLowerCase() === "message on whatsapp";
    }) || null;
  }

  function makeButton(whatsapp) {
    var a = document.createElement("a");
    a.id = "sct-get-it-moving-final-button";
    a.href = "https://www.getitmoving.co.uk";
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "Book Removals / Flatbed with Get It Moving";

    if (whatsapp) {
      a.className = whatsapp.className || "";
    }

    a.style.display = "inline-flex";
    a.style.alignItems = "center";
    a.style.justifyContent = "center";
    a.style.minHeight = "48px";
    a.style.padding = "0 20px";
    a.style.borderRadius = "999px";
    a.style.textDecoration = "none";
    a.style.fontWeight = "900";
    a.style.background = "linear-gradient(135deg,#0b4db8,#2563eb)";
    a.style.color = "#ffffff";
    a.style.boxShadow = "0 14px 26px rgba(37,99,235,.24)";
    a.style.border = "0";
    a.style.marginLeft = "12px";
    a.style.marginTop = "10px";

    return a;
  }

  function mount() {
    removeWrongButtons();

    var section = findGetInTouchSection();
    if (!section) return;

    var whatsapp = findWhatsAppElement(section);
    if (!whatsapp) return;

    if (document.getElementById("sct-get-it-moving-final-button")) return;

    var button = makeButton(whatsapp);

    whatsapp.insertAdjacentElement("afterend", button);

    var parent = whatsapp.parentElement;
    if (parent) {
      parent.style.display = "flex";
      parent.style.flexWrap = "wrap";
      parent.style.gap = "12px";
      parent.style.alignItems = "center";
    }

    button.style.marginLeft = "0";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  setTimeout(mount, 500);
  setTimeout(mount, 1500);
  setTimeout(mount, 3000);
})();
