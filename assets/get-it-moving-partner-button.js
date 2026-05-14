(function () {
  if (window.__SCT_GET_IT_MOVING_BUTTON_V2__) return;
  window.__SCT_GET_IT_MOVING_BUTTON_V2__ = true;

  function clean(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function removeOldWrongButton() {
    var old = document.getElementById("sct-get-it-moving-partner-button");
    if (old) old.remove();

    Array.prototype.slice.call(document.querySelectorAll("a")).forEach(function (a) {
      if (clean(a.textContent) === "Book Removals / Flatbed with Get It Moving") {
        var parent = a.parentElement;
        if (parent && parent.id === "sct-get-it-moving-partner-button") {
          parent.remove();
        }
      }
    });
  }

  function findWhatsAppButton() {
    var links = Array.prototype.slice.call(document.querySelectorAll("a, button"));
    return links.find(function (el) {
      var text = clean(el.textContent);
      var href = clean(el.getAttribute && el.getAttribute("href"));
      return text.toLowerCase().indexOf("message on whatsapp") !== -1 ||
             href.toLowerCase().indexOf("wa.me") !== -1 ||
             href.toLowerCase().indexOf("whatsapp") !== -1;
    });
  }

  function makeGetItMovingButton(whatsappButton) {
    var a = document.createElement("a");
    a.id = "sct-get-it-moving-inline-button";
    a.href = "https://www.getitmoving.co.uk";
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "Book Removals / Flatbed with Get It Moving";

    if (whatsappButton) {
      a.className = whatsappButton.className || "";
      a.style.cssText = whatsappButton.style.cssText || "";
    }

    a.style.display = "inline-flex";
    a.style.alignItems = "center";
    a.style.justifyContent = "center";
    a.style.textDecoration = "none";
    a.style.fontWeight = "800";

    if (!a.style.borderRadius) a.style.borderRadius = "999px";
    if (!a.style.minHeight) a.style.minHeight = "48px";
    if (!a.style.padding) a.style.padding = "0 20px";

    return a;
  }

  function makeButtonRow(whatsappButton) {
    var row = document.createElement("div");
    row.id = "sct-get-it-moving-button-row";
    row.style.cssText = [
      "display:flex",
      "flex-wrap:wrap",
      "gap:12px",
      "align-items:center",
      "margin-top:14px"
    ].join(";");

    return row;
  }

  function mount() {
    removeOldWrongButton();

    if (document.getElementById("sct-get-it-moving-inline-button")) return;

    var whatsappButton = findWhatsAppButton();
    if (!whatsappButton) return;

    var parent = whatsappButton.parentElement;
    if (!parent) return;

    var getMovingButton = makeGetItMovingButton(whatsappButton);

    var row;

    if (
      parent.id === "sct-get-it-moving-button-row" ||
      (
        parent.children.length <= 4 &&
        clean(parent.innerText).toLowerCase().indexOf("message on whatsapp") !== -1
      )
    ) {
      row = parent;
    } else {
      row = makeButtonRow(whatsappButton);
      parent.insertBefore(row, whatsappButton);
      row.appendChild(whatsappButton);
    }

    row.appendChild(getMovingButton);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  setTimeout(mount, 700);
  setTimeout(mount, 1800);
  setTimeout(mount, 3000);
})();
