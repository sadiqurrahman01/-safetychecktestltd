(function () {
  if (window.__SCT_ASSIGN_JOB_SAFE_V2__) return;
  window.__SCT_ASSIGN_JOB_SAFE_V2__ = true;

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

    for (var i = 0; i < 12 && node; i += 1) {
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
      var divs = titleEl.parentElement.querySelectorAll("div");
      if (divs.length) contactLine = clean(divs[0].innerText);
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

  function nativeSetValue(el, value) {
    if (!el) return false;

    var proto = el.tagName === "TEXTAREA"
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;

    if (el.tagName === "SELECT") {
      proto = window.HTMLSelectElement.prototype;
    }

    var descriptor = Object.getOwnPropertyDescriptor(proto, "value");
    if (descriptor && descriptor.set) {
      descriptor.set.call(el, value);
    } else {
      el.value = value;
    }

    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  function findControlNearLabel(labelWords) {
    var labels = Array.prototype.slice.call(document.querySelectorAll("label"));
    var wanted = labelWords.map(function (x) { return x.toLowerCase(); });

    for (var i = 0; i < labels.length; i += 1) {
      var txt = clean(labels[i].textContent).toLowerCase();
      var ok = wanted.some(function (word) { return txt.indexOf(word) !== -1; });
      if (!ok) continue;

      if (labels[i].htmlFor) {
        var byId = document.getElementById(labels[i].htmlFor);
        if (byId) return byId;
      }

      var box = labels[i].parentElement;
      if (box) {
        var control = box.querySelector("input, textarea, select");
        if (control) return control;
      }

      var next = labels[i].nextElementSibling;
      if (next && next.matches && next.matches("input, textarea, select")) return next;
    }

    return null;
  }

  function fillJobForm(draft) {
    nativeSetValue(findControlNearLabel(["company", "organisation", "business"]), draft.companyName);
    nativeSetValue(findControlNearLabel(["job type", "service type"]), draft.jobType);
    nativeSetValue(findControlNearLabel(["title", "job title"]), draft.title);
    nativeSetValue(findControlNearLabel(["description", "details"]), draft.description);
    nativeSetValue(findControlNearLabel(["budget", "amount", "price"]), String(draft.budget || ""));
    nativeSetValue(findControlNearLabel(["address line 1", "address"]), draft.addressLine1);
    nativeSetValue(findControlNearLabel(["address line 2"]), draft.addressLine2);
    nativeSetValue(findControlNearLabel(["town", "city"]), draft.townCity);
    nativeSetValue(findControlNearLabel(["postcode", "post code"]), draft.postcode);
  }

  function clickJobsTabThenFill(draft) {
    var deadline = Date.now() + 6000;

    function tryClickJobs() {
      var buttons = Array.prototype.slice.call(document.querySelectorAll("button"));
      var jobsButton = buttons.find(function (btn) {
        return clean(btn.textContent).toLowerCase() === "jobs";
      });

      if (jobsButton) {
        jobsButton.click();

        setTimeout(function () {
          fillJobForm(draft);
          alert("Jobs tab opened. Check the job details, then press Create Job.");
        }, 500);

        return;
      }

      if (Date.now() < deadline) {
        setTimeout(tryClickJobs, 150);
        return;
      }

      alert("Quote copied, but I could not find the Jobs tab. Please click Jobs manually.");
    }

    tryClickJobs();
  }

  document.addEventListener("click", function (event) {
    var button = event.target && event.target.closest ? event.target.closest("button") : null;
    if (!button) return;

    if (clean(button.textContent) !== "Assign Job") return;

    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();

    var draft;

    try {
      var card = findQuoteCard(button);
      draft = buildDraftFromCard(card);

      localStorage.setItem("sctQuoteAssignDraft", JSON.stringify(draft));
      localStorage.setItem("sctPortalAssignDraft", JSON.stringify(draft));
    } catch (err) {
      draft = {
        companyName: "",
        jobType: "Safety Check Test Quote",
        title: "Safety Check Test Quote Job",
        description: "Created from quote using Assign Job.",
        budget: 0,
        urgent: false,
        addressLine1: "",
        addressLine2: "",
        townCity: "",
        postcode: ""
      };
    }

    clickJobsTabThenFill(draft);
  }, true);
})();
