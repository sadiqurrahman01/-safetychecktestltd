(function () {
  if (window.__SCT_GET_IT_MOVING_WHATSAPP_SIDE_RESTORE__) return;
  window.__SCT_GET_IT_MOVING_WHATSAPP_SIDE_RESTORE__ = true;

  function clean(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function removeOldMovingButtons() {
    Array.prototype.slice.call(document.querySelectorAll(
      "#sct-get-it-moving-partner-button, #sct-get-it-moving-button-row, #sct-get-it-moving-inline-button, #sct-get-it-moving-final-button"
    )).forEach(function (el) {
      el.remove();
    });

    Array.prototype.slice.call(document.querySelectorAll("a, span, p, div")).forEach(function (el) {
      var text = clean(el.textContent).toLowerCase();
      var href = String(el.getAttribute && el.getAttribute("href") || "").toLowerCase();

      if (
        href.indexOf("getitmoving.co.uk") !== -1 ||
        text === "opens sister company website" ||
        text === "book removals / flatbed with get it moving"
      ) {
        el.remove();
      }
    });
  }

  function findWhatsAppButton() {
    var els = Array.prototype.slice.call(document.querySelectorAll("a, button"));
    return els.find(function (el) {
      var text = clean(el.textContent).toLowerCase();
      var href = String(el.getAttribute("href") || "").toLowerCase();

      return text.indexOf("message on whatsapp") !== -1 ||
             href.indexOf("wa.me") !== -1 ||
             href.indexOf("whatsapp") !== -1;
    });
  }

  function makeMovingButton(whatsapp) {
    var a = document.createElement("a");
    a.id = "sct-get-it-moving-final-button";
    a.href = "https://www.getitmoving.co.uk";
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "Book Removals / Flatbed with Get It Moving";

    if (whatsapp) {
      a.className = whatsapp.className || "";
      a.style.cssText = whatsapp.style.cssText || "";
    }

    a.style.display = "inline-flex";
    a.style.alignItems = "center";
    a.style.justifyContent = "center";
    a.style.textDecoration = "none";
    a.style.fontWeight = "900";

    if (!a.style.minHeight) a.style.minHeight = "48px";
    if (!a.style.padding) a.style.padding = "0 20px";
    if (!a.style.borderRadius) a.style.borderRadius = "999px";
    if (!a.style.background) a.style.background = "linear-gradient(135deg,#0b4db8,#2563eb)";
    if (!a.style.color) a.style.color = "#ffffff";
    if (!a.style.boxShadow) a.style.boxShadow = "0 14px 26px rgba(37,99,235,.24)";

    return a;
  }

  function mount() {
    removeOldMovingButtons();

    if (document.getElementById("sct-get-it-moving-final-button")) return;

    var whatsapp = findWhatsAppButton();
    if (!whatsapp || !whatsapp.parentElement) return;

    var row = whatsapp.parentElement;
    row.style.display = "flex";
    row.style.flexWrap = "wrap";
    row.style.gap = "12px";
    row.style.alignItems = "center";

    row.appendChild(makeMovingButton(whatsapp));
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
