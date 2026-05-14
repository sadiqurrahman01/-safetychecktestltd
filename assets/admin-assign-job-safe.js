(function () {
  if (window.__SCT_ASSIGN_JOB_SAFE__) return;
  window.__SCT_ASSIGN_JOB_SAFE__ = true;

  function clean(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function moneyToNumber(value) {
    var match = String(value || "").match(/£\s*([0-9]+(?:\.[0-9]+)?)/);
    return match ? Number(match[1]) : 0;
  }

  function getTextAfter(label, text) {
    var re = new RegExp(label + "\\s*:\\s*([^\\n]+)", "i");
    var match = String(text || "").match(re);
    return match ? clean(match[1]) : "";
  }

  function findQuoteCard(button) {
    var node = button;

    for (var i = 0; i < 10 && node; i += 1) {
      var text = node.innerText || "";
      if (
        text.indexOf("Print Quote") !== -1 &&
        text.indexOf("Delete Quote") !== -1 &&
        text.indexOf("Postcode:") !== -1
      ) {
        return node;
      }
      node = node.parentElement;
    }

    return button.closest("div") || button;
  }

  function buildDraftFromCard(card) {
    var text = card.innerText || "";
    var titleEl = card.querySelector("h3");
    var serviceType = clean(titleEl ? titleEl.innerText : "Quote Request");

    var contactLine = "";
    if (titleEl && titleEl.parentElement) {
      var lines = titleEl.parentElement.querySelectorAll("div");
      if (lines.length) contactLine = clean(lines[0].innerText);
    }

    var postcode = getTextAfter("Postcode", text).replace(/Estimate.*$/i, "").trim();
    var estimateText = getTextAfter("Estimate", text);
    var budget = moneyToNumber(estimateText);
    var created = getTextAfter("Created", text);

    var safeJobType = serviceType && serviceType !== "Quote Request"
      ? serviceType
      : "Safety Check Test Quote";

    return {
      companyName: "",
      jobType: safeJobType,
      title: safeJobType + " Job",
      description: [
        "Created from quote using Assign Job.",
        contactLine ? "Contact: " + contactLine : "",
        postcode && postcode !== "-" ? "Postcode: " + postcode : "",
        created ? "Quote created: " + created : "",
        "Check the original quote details before final assignment."
      ].filter(Boolean).join("\n"),
      budget: budget || 0,
      urgent: false,
      addressLine1: "",
      addressLine2: "",
      townCity: "",
      postcode: postcode && postcode !== "-" ? postcode : ""
    };
  }

  function openJobsTab() {
    var base = location.pathname.indexOf("/admin") === 0 ? "/admin/" : "/";
    location.href = base + "?tab=jobs&t=" + Date.now();
  }

  document.addEventListener("click", function (event) {
    var button = event.target && event.target.closest ? event.target.closest("button") : null;
    if (!button) return;

    if (clean(button.textContent) !== "Assign Job") return;

    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();

    try {
      var card = findQuoteCard(button);
      var draft = buildDraftFromCard(card);

      localStorage.setItem("sctQuoteAssignDraft", JSON.stringify(draft));
      localStorage.setItem("sctPortalAssignDraft", JSON.stringify(draft));

      alert("Quote copied into the job form. Opening Jobs tab now. Check the details, then press Create Job.");
    } catch (err) {
      alert("Opening Jobs tab. If details are missing, copy them from the quote manually.");
    }

    openJobsTab();
  }, true);

  function openRequestedTabFromUrl() {
    try {
      var params = new URLSearchParams(location.search);
      var tab = clean(params.get("tab")).toLowerCase();
      if (!tab) return;

      var names = {
        overview: "Overview",
        quotes: "Quotes",
        jobs: "Jobs",
        completion: "Completion",
        employees: "Employees",
        audits: "Audits",
        users: "Users",
        settings: "Settings"
      };

      var wanted = names[tab] || tab;
      var stopAt = Date.now() + 5000;

      function retry() {
        var buttons = Array.prototype.slice.call(document.querySelectorAll("button"));
        var match = buttons.find(function (btn) {
          return clean(btn.textContent).toLowerCase() === String(wanted).toLowerCase();
        });

        if (match) {
          match.click();
          return;
        }

        if (Date.now() < stopAt) {
          setTimeout(retry, 150);
        }
      }

      retry();
    } catch (err) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", openRequestedTabFromUrl);
  } else {
    openRequestedTabFromUrl();
  }
})();
