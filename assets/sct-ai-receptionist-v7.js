
(function () {
  "use strict";

  const DEFAULT_ENDPOINT =
    "https://api.safetychecktestltd.co.uk/api/sct-ai/chat";

  const endpoint = window.SCT_AI_ENDPOINT || DEFAULT_ENDPOINT;

  const SCT_SERVICE_CATALOGUE = {
  "Electrical & Testing": [
    "EICR / Fixed Wire Testing",
    "PAT Testing",
    "Electrical Installations",
    "Electrical Repairs",
    "Consumer Unit Upgrades",
    "Emergency Electrical Call-outs",
    "Electrical Maintenance"
  ],
  "Fire & Life Safety": [
    "Fire Risk Assessments",
    "Fire Alarm Installation",
    "Fire Alarm Servicing",
    "Fire Extinguisher Servicing",
    "Emergency Lighting",
    "Fire Door Inspections",
    "Fire Safety Compliance"
  ],
  "Gas & Heating": [
    "Landlord Gas Safety CP12",
    "Domestic Boiler Servicing",
    "Boiler Repairs",
    "Commercial Heating",
    "Gas Fault Diagnosis",
    "Powerflushing",
    "Heating Maintenance"
  ],
  "HVAC & F-Gas": [
    "F-Gas Leak Checks",
    "Air Conditioning Servicing",
    "Refrigeration Maintenance",
    "HVAC Maintenance",
    "Ventilation Systems",
    "Commercial AC Inspections"
  ],
  "Plumbing & Drainage": [
    "Plumbing Repairs",
    "Leak Detection",
    "Emergency Plumbing",
    "Bathroom Plumbing",
    "Drain Clearance",
    "Drainage Surveys"
  ],
  "Construction & Refurbishment": [
    "General Construction",
    "Building Refurbishment",
    "Property Renovation",
    "Kitchen Fitting",
    "Bathroom Renovation",
    "Building Extensions",
    "Structural Works"
  ],
  "Decorating & Finishes": [
    "Painting and Decorating",
    "Plastering",
    "Rendering",
    "Wall and Floor Tiling",
    "Drylining",
    "Insulation"
  ],
  "Carpentry & Building": [
    "Carpentry",
    "Joinery",
    "Door Repairs",
    "Flooring Installation",
    "Bricklaying",
    "Masonry"
  ],
  "Roofing & External Works": [
    "Roof Repairs",
    "Roof Replacement",
    "Guttering",
    "External Property Works",
    "Groundworks",
    "Landscaping",
    "Fencing"
  ],
  "Scaffolding & Access": [
    "Scaffolding Enquiries",
    "Access Equipment",
    "Working at Height Services"
  ],
  "Demolition & Strip-out": [
    "Non-structural Strip-out",
    "Demolition Enquiries",
    "Site Clearance"
  ],
  "Facilities & Property": [
    "Planned Preventive Maintenance",
    "Reactive Property Repairs",
    "Multi-site Maintenance",
    "Property Compliance",
    "Facilities Management",
    "Landlord Compliance"
  ],
  "Environmental & Specialist": [
    "Asbestos Survey Enquiries",
    "Hazardous Waste Enquiries",
    "Environmental Services",
    "Specialist Site Works"
  ],
  "Commercial & Contracts": [
    "Commercial Maintenance Contracts",
    "Estate Agent Portfolios",
    "Schools and Education",
    "Housing Provider Contracts",
    "Government Tenders",
    "Rail and Restricted Sites",
    "Construction Subcontracting"
  ],
  "Emergency Call-outs": [
    "Emergency Electrical Repairs",
    "Emergency Plumbing",
    "Urgent Property Maintenance",
    "Urgent Gas Safety Enquiries",
    "Emergency Building Repairs"
  ]
};

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function mount() {
    if (document.getElementById("sct-ai-widget")) return;

    const root = createElement("div", "sct-ai-root");
    root.id = "sct-ai-widget";

    root.innerHTML = `
      <button
        type="button"
        class="sct-ai-launcher"
        aria-label="Open SCT Receptionist"
        aria-controls="sct-ai-panel"
        aria-expanded="false"
      >
        <span class="sct-ai-launcher-icon" aria-hidden="true">
          <img src="/assets/sct-ai-logo-black-v7.png" alt="">
        </span>
        <span>Chat with SCT</span>
      </button>

      <section
        id="sct-ai-panel"
        class="sct-ai-panel"
        aria-label="Safety Check Test AI Receptionist"
        hidden
      >
        <header class="sct-ai-header">
          <div class="sct-ai-brand">
            <img
              src="/assets/sct-ai-logo-black-v7.png"
              class="sct-ai-brand-logo"
              alt="Safety Check Test Ltd logo"
            >
            <div>
              <strong>SCT Receptionist</strong>
              <small>Safety Check Test Ltd</small>
            </div>
          </div>
          <button
            type="button"
            class="sct-ai-close"
            aria-label="Close chat"
          >×</button>
        </header>

        <div class="sct-ai-disclaimer">
          Automated service guidance.
          Do not enter sensitive personal information.
          All quotations require SCT review.
        </div>

        <div
          class="sct-ai-messages"
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
        ></div>


        <div class="sct-ai-quick-actions"
             aria-label="Popular SCT services">
          <button type="button"
                  data-sct-prompt="Electrical Services">
            Electrical
          </button>
          <button type="button"
                  data-sct-prompt="PAT Testing">
            PAT Testing
          </button>
          <button type="button"
                  data-sct-prompt="EICR Fixed Wire Testing">
            EICR
          </button>
          <button type="button"
                  data-sct-prompt="Fire Safety Services">
            Fire Safety
          </button>
          <button type="button"
                  data-sct-prompt="Gas and Heating">
            Gas
          </button>
          <button type="button"
                  data-sct-prompt="F-Gas and Air Conditioning">
            F-Gas
          </button>
          <button type="button"
                  data-sct-prompt="Construction and Refurbishment">
            Construction
          </button>
          <button type="button"
                  data-sct-prompt="Property Maintenance">
            Maintenance
          </button>
        </div>

        <details class="sct-ai-catalogue">
          <summary>Browse SCT Service Categories</summary>

          <div class="sct-ai-catalogue-content">
            <label for="sct-ai-category">
              Service Category
            </label>
            <select id="sct-ai-category"></select>

            <label for="sct-ai-service">
              Select Service
            </label>
            <select id="sct-ai-service"></select>

            <button
              type="button"
              class="sct-ai-service-select">
              Ask SCT About This Service
            </button>

            <small>
              Services are subject to scope, availability,
              competence and SCT quotation approval.
            </small>
          </div>
        </details>

        <form class="sct-ai-form">
          <label for="sct-ai-input">Your message</label>
          <textarea
            id="sct-ai-input"
            rows="2"
            maxlength="1200"
            placeholder="How can SCT help you?"
            required
          ></textarea>

          <button type="submit" class="sct-ai-send">
            Send message
          </button>
        </form>

        <footer class="sct-ai-footer">
          <a href="/booking.html">
            Request a quotation
          </a>
          <span>Final prices require approval</span>
        </footer>
      </section>
    `;

    document.body.appendChild(root);

    const launcher = root.querySelector(".sct-ai-launcher");
    const panel = root.querySelector(".sct-ai-panel");
    const close = root.querySelector(".sct-ai-close");
    const messages = root.querySelector(".sct-ai-messages");
    const form = root.querySelector(".sct-ai-form");
    const input = root.querySelector("#sct-ai-input");
    const send = root.querySelector(".sct-ai-send");

    let pending = false;

    function addMessage(kind, value) {
      const bubble = createElement(
        "div",
        "sct-ai-message sct-ai-" + kind,
        value
      );
      messages.appendChild(bubble);
      messages.scrollTop = messages.scrollHeight;
      return bubble;
    }

    addMessage(
      "notice",
      "Welcome to Safety Check Test Ltd. Ask about our services or use the quotation link below. This automated receptionist provides general service guidance."
    );

    function toggle(open) {
      panel.hidden = !open;
      launcher.setAttribute("aria-expanded", String(open));
      if (open) input.focus();
      else launcher.focus();
    }

    launcher.addEventListener("click", function () {
      toggle(panel.hidden);
    });

    close.addEventListener("click", function () {
      toggle(false);
    });

    panel.addEventListener("keydown", function (event) {
      if (event.key === "Escape") toggle(false);
    });

    root.querySelectorAll("[data-sct-prompt]").forEach(function (button) {
      button.addEventListener("click", function () {
        input.value = "I need help with " +
          button.getAttribute("data-sct-prompt") +
          ". What services can SCT provide?";
        input.focus();
      });
    });


    const categorySelect =
      root.querySelector("#sct-ai-category");

    const serviceSelect =
      root.querySelector("#sct-ai-service");

    const serviceButton =
      root.querySelector(".sct-ai-service-select");

    Object.keys(SCT_SERVICE_CATALOGUE).forEach(
      function (category) {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      }
    );

    function updateServiceOptions() {
      serviceSelect.replaceChildren();

      const category = categorySelect.value;
      const available =
        SCT_SERVICE_CATALOGUE[category] || [];

      available.forEach(function (service) {
        const option = document.createElement("option");
        option.value = service;
        option.textContent = service;
        serviceSelect.appendChild(option);
      });
    }

    categorySelect.addEventListener(
      "change",
      updateServiceOptions
    );

    updateServiceOptions();

    serviceButton.addEventListener("click", function () {
      const selected = serviceSelect.value;

      if (!selected) return;

      input.value =
        "I would like information about " +
        selected +
        " from Safety Check Test Ltd. " +
        "Please explain the service and how to " +
        "request a quotation for human review.";

      input.focus();
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (pending) return;

      const message = input.value.trim();

      if (!message || message.length > 1200) return;

      pending = true;
      send.disabled = true;
      input.disabled = true;

      addMessage("customer", message);
      input.value = "";

      const progress = addMessage(
        "status",
        "Checking your enquiry..."
      );

      const controller = new AbortController();
      const timer = setTimeout(function () {
        controller.abort();
      }, 16000);

      try {

        const q = message.toLowerCase();

        let reply =
          "Safety Check Test Ltd can review your " +
          "requirements. Please use Request a quotation " +
          "to contact our team.";

        if (/immediate danger|gas leak|smell gas|fire emergency/.test(q)) {
          reply = "If there is immediate danger, move to " +
            "a safe location and contact the appropriate " +
            "emergency services. Do not attempt unsafe repairs.";
        } else if (/margin|commission|engineer pay|supplier cost|internal rate/.test(q)) {
          reply = "Internal commercial information is confidential.";
        } else if (/price|pricing|cost|quote|quotation|vat|hourly|day rate/.test(q)) {
          reply = "Please request a quotation. SCT will review " +
            "your requirements and confirm applicable charges " +
            "and VAT before approval.";
        } else {
          const services = Object.entries(
            SCT_SERVICE_CATALOGUE
          );

          for (const [category, items] of services) {
            const match = items.find(
              item => q.includes(item.toLowerCase())
            );

            if (match || q.includes(category.toLowerCase())) {
              reply = "SCT welcomes enquiries about " +
                (match || category) +
                ". Please request a quotation so our team " +
                "can confirm scope and availability.";
              break;
            }
          }
        }

        const data = {
          ok: true,
          reply: reply,
          estimateApproved: false
        };

        progress.remove();

        addMessage("assistant", data.reply);

      } catch (_) {
        progress.remove();

        addMessage(
          "error",
          "The AI service is currently unavailable. " +
          "Please use Request a quotation to contact SCT."
        );
      } finally {
        clearTimeout(timer);
        pending = false;
        send.disabled = false;
        input.disabled = false;
        input.focus();
      }
    });

    console.info("SCT Receptionist interface mounted");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
