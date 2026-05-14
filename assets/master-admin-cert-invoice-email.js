(function () {
  if (window.__SCT_CERT_INVOICE_EMAIL_PANEL__) return;
  window.__SCT_CERT_INVOICE_EMAIL_PANEL__ = true;

  var jobs = [];

  function clean(v) {
    return String(v || "").replace(/\s+/g, " ").trim();
  }

  function getToken() {
    try {
      return (
        localStorage.getItem("sct_admin_token") ||
        sessionStorage.getItem("sct_admin_token") ||
        localStorage.getItem("adminToken") ||
        sessionStorage.getItem("adminToken") ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        new URLSearchParams(location.search).get("token") ||
        ""
      );
    } catch (e) {
      return "";
    }
  }

  function apiBase() {
    try {
      var saved = localStorage.getItem("sct_api_base");
      if (saved) return saved.replace(/\/+$/, "");
    } catch (e) {}
    return "https://api.safetychecktestltd.co.uk";
  }

  async function api(path, options) {
    var token = getToken();

    options = options || {};
    options.headers = Object.assign({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    }, options.headers || {});

    var res = await fetch(apiBase() + path, options);
    var text = await res.text();
    var data = text ? JSON.parse(text) : {};

    if (!res.ok || data.ok === false) {
      throw new Error(data.message || data.error || "Request failed");
    }

    return data;
  }

  function jobId(job) {
    return job._id || job.id || job.jobId || "";
  }

  function jobTitle(job) {
    return clean(job.title || job.jobTitle || job.serviceType || job.jobType || job.service || "Untitled job");
  }

  function jobRecipient(job) {
    return clean(
      job.invoice?.recipientEmail ||
      job.requesterEmail ||
      job.clientEmail ||
      job.customerEmail ||
      job.email ||
      job.assignedToEmail ||
      ""
    );
  }

  function jobLabel(job) {
    return [
      jobTitle(job),
      job.jobType || job.serviceType || job.service || "",
      job.postcode || "",
      job.status ? "Status: " + job.status : "",
      jobRecipient(job) ? "Email: " + jobRecipient(job) : ""
    ].filter(Boolean).join(" — ");
  }

  async function loadJobs() {
    var data = await api("/api/admin/jobs", { method: "GET" });
    jobs = data.jobs || data.items || data.data || [];
    jobs = jobs.filter(function (j) { return jobId(j); });
    return jobs;
  }

  function setMsg(msg, bad) {
    var el = document.getElementById("sct-cert-invoice-msg");
    if (!el) return;
    el.style.color = bad ? "#b91c1c" : "#166534";
    el.textContent = msg || "";
  }

  function selectedJob() {
    var select = document.getElementById("sct-cert-invoice-job");
    if (!select) return null;
    return jobs.find(function (j) { return jobId(j) === select.value; }) || null;
  }

  function selectedTo() {
    var input = document.getElementById("sct-cert-invoice-to");
    return clean(input ? input.value : "");
  }

  function fillRecipientFromJob() {
    var job = selectedJob();
    var input = document.getElementById("sct-cert-invoice-to");
    if (!job || !input) return;
    input.value = jobRecipient(job);
  }

  function populateJobs() {
    var select = document.getElementById("sct-cert-invoice-job");
    if (!select) return;

    select.innerHTML = jobs.length
      ? jobs.map(function (job) {
          return '<option value="' + jobId(job) + '">' + jobLabel(job).replace(/</g, "&lt;") + '</option>';
        }).join("")
      : '<option value="">No jobs loaded</option>';

    fillRecipientFromJob();
  }

  async function refreshJobs() {
    try {
      setMsg("Loading jobs...", false);
      await loadJobs();
      populateJobs();
      setMsg("Loaded " + jobs.length + " job(s). Choose a job, confirm recipient email, then send.", false);
    } catch (err) {
      setMsg(err.message || "Failed to load jobs", true);
    }
  }

  async function sendJobEmail(type) {
    var job = selectedJob();
    if (!job) {
      setMsg("Please select a job first.", true);
      return;
    }

    var to = selectedTo();
    if (!to) {
      setMsg("Please enter recipient email first.", true);
      return;
    }

    var endpoint = type === "certificate"
      ? "/api/admin/jobs/" + encodeURIComponent(jobId(job)) + "/send-certificate"
      : "/api/admin/jobs/" + encodeURIComponent(jobId(job)) + "/send-invoice";

    var label = type === "certificate" ? "certificate" : "invoice";

    try {
      setMsg("Sending " + label + " email...", false);

      var data = await api(endpoint, {
        method: "POST",
        body: JSON.stringify({
          to: to,
          recipientEmail: to
        })
      });

      setMsg(
        (type === "certificate" ? "Certificate" : "Invoice") +
        " email sent successfully to " +
        (data.sentTo || to) +
        ".",
        false
      );
    } catch (err) {
      setMsg(err.message || "Failed to send " + label + " email", true);
    }
  }

  function makePanel() {
    var panel = document.createElement("div");
    panel.id = "sct-cert-invoice-panel";
    panel.style.cssText = [
      "border:1px solid #bbf7d0",
      "background:#f0fdf4",
      "border-radius:16px",
      "padding:16px",
      "margin:18px 0",
      "box-shadow:0 8px 20px rgba(15,23,42,.08)"
    ].join(";");

    panel.innerHTML = [
      '<div style="font-size:18px;font-weight:800;color:#0f172a;margin-bottom:6px;">Send Certificate / Invoice Email</div>',
      '<div style="font-size:13px;color:#475569;margin-bottom:12px;">Choose a completed job, confirm the customer email, then send the certificate or invoice.</div>',
      '<label style="display:block;font-size:13px;font-weight:700;color:#334155;">Select job<br><select id="sct-cert-invoice-job" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:10px;margin-top:6px;"></select></label>',
      '<label style="display:block;font-size:13px;font-weight:700;color:#334155;margin-top:12px;">Recipient email<br><input id="sct-cert-invoice-to" type="email" placeholder="customer@example.com" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:10px;margin-top:6px;box-sizing:border-box;"></label>',
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;">',
      '  <button id="sct-send-cert-btn" type="button" style="background:#16a34a;color:#fff;border:0;border-radius:10px;padding:10px 14px;font-weight:800;cursor:pointer;">Send Certificate Email</button>',
      '  <button id="sct-send-invoice-btn" type="button" style="background:#2563eb;color:#fff;border:0;border-radius:10px;padding:10px 14px;font-weight:800;cursor:pointer;">Send Invoice Email</button>',
      '  <button id="sct-cert-refresh-btn" type="button" style="background:#fff;color:#0f172a;border:1px solid #cbd5e1;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer;">Reload Jobs</button>',
      '</div>',
      '<div id="sct-cert-invoice-msg" style="font-size:13px;margin-top:10px;color:#334155;"></div>'
    ].join("");

    return panel;
  }

  function wirePanel() {
    var select = document.getElementById("sct-cert-invoice-job");
    var certBtn = document.getElementById("sct-send-cert-btn");
    var invBtn = document.getElementById("sct-send-invoice-btn");
    var refreshBtn = document.getElementById("sct-cert-refresh-btn");

    if (select && !select.__wired) {
      select.__wired = true;
      select.addEventListener("change", fillRecipientFromJob);
    }

    if (certBtn && !certBtn.__wired) {
      certBtn.__wired = true;
      certBtn.addEventListener("click", function () { sendJobEmail("certificate"); });
    }

    if (invBtn && !invBtn.__wired) {
      invBtn.__wired = true;
      invBtn.addEventListener("click", function () { sendJobEmail("invoice"); });
    }

    if (refreshBtn && !refreshBtn.__wired) {
      refreshBtn.__wired = true;
      refreshBtn.addEventListener("click", refreshJobs);
    }
  }

  function isJobsPage() {
    var text = document.body ? document.body.innerText || "" : "";
    return text.indexOf("Jobs Portal") !== -1 && text.indexOf("Create Job") !== -1;
  }

  function mountPanel() {
    if (!isJobsPage()) return;
    if (document.getElementById("sct-cert-invoice-panel")) return;

    var directAssignPanel = document.getElementById("sct-master-direct-assign-panel");
    var panel = makePanel();

    if (directAssignPanel && directAssignPanel.parentElement) {
      directAssignPanel.parentElement.insertBefore(panel, directAssignPanel.nextSibling);
    } else {
      document.body.insertBefore(panel, document.body.firstChild);
    }

    wirePanel();
    refreshJobs();
  }

  setInterval(mountPanel, 1000);
  setTimeout(mountPanel, 400);
})();
