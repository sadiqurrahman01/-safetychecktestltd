(function () {
  if (window.__SCT_MASTER_DIRECT_ASSIGN__) return;
  window.__SCT_MASTER_DIRECT_ASSIGN__ = true;

  var jobs = [];
  var employees = [];

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

  function apiBases() {
    var bases = [];

    try {
      var saved = localStorage.getItem("sct_api_base");
      if (saved) bases.push(saved);
    } catch (e) {}

    bases.push("https://api.safetychecktestltd.co.uk");
    bases.push(location.origin);

    return bases
      .map(function (x) { return String(x || "").replace(/\/+$/, ""); })
      .filter(function (x, i, arr) { return x && arr.indexOf(x) === i; });
  }

  async function apiFetch(path, options) {
    var token = getToken();
    var lastError;

    options = options || {};
    options.headers = Object.assign(
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      options.headers || {}
    );

    var bases = apiBases();

    for (var i = 0; i < bases.length; i += 1) {
      var url = bases[i] + path;

      try {
        var res = await fetch(url, options);
        var text = await res.text();
        var data = text ? JSON.parse(text) : {};

        if (res.ok && (data.ok === undefined || data.ok === true)) {
          data.__base = bases[i];
          return data;
        }

        lastError = new Error(data.message || data.error || "API failed: " + res.status);
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error("API request failed");
  }

  function getEmployeeId(emp) {
    return emp._id || emp.id || emp.employeeId || emp.userId || "";
  }

  function getEmployeeName(emp) {
    return clean(emp.name || emp.fullName || emp.displayName || emp.firstName || emp.email || "Employee");
  }

  function getEmployeeEmail(emp) {
    return clean(emp.email || emp.workEmail || emp.loginEmail || "");
  }

  function getJobId(job) {
    return job._id || job.id || job.jobId || "";
  }

  function getJobTitle(job) {
    return clean(job.title || job.jobTitle || job.serviceType || job.jobType || job.service || "Untitled job");
  }

  function getJobService(job) {
    return clean(job.jobType || job.serviceType || job.service || "N/A");
  }

  function getJobPostcode(job) {
    return clean(job.postcode || job.sitePostcode || job.location?.postcode || "");
  }

  function getJobLabel(job) {
    var parts = [
      getJobTitle(job),
      getJobService(job) !== "N/A" ? getJobService(job) : "",
      getJobPostcode(job),
      job.status ? "Status: " + job.status : "",
      job.assignedToName ? "Assigned: " + job.assignedToName : ""
    ].filter(Boolean);

    return parts.join(" — ");
  }

  async function loadData() {
    var empData = await apiFetch("/api/admin/employees", { method: "GET" });
    var jobData = await apiFetch("/api/admin/jobs", { method: "GET" });

    employees = empData.employees || empData.users || empData.items || empData.data || [];
    jobs = jobData.jobs || jobData.items || jobData.data || [];

    employees = employees.filter(function (emp) {
      return getEmployeeId(emp) && getEmployeeEmail(emp);
    });

    jobs = jobs.filter(function (job) {
      return getJobId(job);
    });

    return { employees: employees, jobs: jobs };
  }

  async function assignJob(job, emp) {
    var jobId = getJobId(job);
    var employeeId = getEmployeeId(emp);
    var employeeName = getEmployeeName(emp);
    var employeeEmail = getEmployeeEmail(emp);

    if (!jobId) throw new Error("Missing job ID");
    if (!employeeId) throw new Error("Missing employee ID");
    if (!employeeEmail) throw new Error("Missing employee email");

    var assignPayload = {
      jobId: jobId,
      employeeId: employeeId,
      assignedEmployeeId: employeeId,
      assignedToId: employeeId,
      employeeName: employeeName,
      employeeEmail: employeeEmail,
      assignedToName: employeeName,
      assignedToEmail: employeeEmail,
      assignedToRole: "employee",
      employeeStatus: "assigned",
      status: "assigned"
    };

    var patchPayload = {
      title: job.title || job.jobTitle || getJobTitle(job),
      description: job.description || "",
      urgent: !!job.urgent,
      addressLine1: job.addressLine1 || job.siteAddress || "",
      addressLine2: job.addressLine2 || "",
      townCity: job.townCity || job.city || "",
      postcode: job.postcode || "",
      budget: Number(job.budget || job.quoteAmount || job.amount || 0),
      status: "assigned",
      assignedToName: employeeName,
      assignedToEmail: employeeEmail,
      assignedToRole: "employee",
      assignedEmployeeId: employeeId,
      employeeId: employeeId,
      employeeStatus: "assigned",
      adminNotes: job.adminNotes || ""
    };

    var attempts = [
      { method: "POST", path: "/api/admin/jobs/" + encodeURIComponent(jobId) + "/assign", body: assignPayload },
      { method: "PATCH", path: "/api/admin/jobs/" + encodeURIComponent(jobId) + "/assign", body: assignPayload },
      { method: "POST", path: "/api/admin/jobs/assign", body: assignPayload },
      { method: "PATCH", path: "/api/admin/jobs/" + encodeURIComponent(jobId), body: patchPayload }
    ];

    var lastError;

    for (var i = 0; i < attempts.length; i += 1) {
      try {
        return await apiFetch(attempts[i].path, {
          method: attempts[i].method,
          body: JSON.stringify(attempts[i].body)
        });
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error("Failed to assign job");
  }

  function makePanel() {
    var panel = document.createElement("div");
    panel.id = "sct-master-direct-assign-panel";
    panel.style.cssText = [
      "border:1px solid #bfdbfe",
      "background:#eff6ff",
      "border-radius:16px",
      "padding:16px",
      "margin:18px 0",
      "box-shadow:0 8px 20px rgba(15,23,42,.08)"
    ].join(";");

    panel.innerHTML = [
      '<div style="font-size:18px;font-weight:800;color:#0f172a;margin-bottom:6px;">Direct Assign Job to Employee</div>',
      '<div style="font-size:13px;color:#475569;margin-bottom:12px;">Master Admin can choose any live job and assign it directly to an employee.</div>',
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:end;">',
      '  <label style="display:block;font-size:13px;font-weight:700;color:#334155;">Select job<br><select id="sct-direct-job" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:10px;margin-top:6px;"></select></label>',
      '  <label style="display:block;font-size:13px;font-weight:700;color:#334155;">Select employee<br><select id="sct-direct-employee" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:10px;margin-top:6px;"></select></label>',
      '</div>',
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;">',
      '  <button id="sct-direct-assign-btn" type="button" style="background:#2563eb;color:#fff;border:0;border-radius:10px;padding:10px 14px;font-weight:800;cursor:pointer;">Assign Selected Job</button>',
      '  <button id="sct-direct-refresh-btn" type="button" style="background:#fff;color:#0f172a;border:1px solid #cbd5e1;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer;">Reload Jobs & Employees</button>',
      '</div>',
      '<div id="sct-direct-msg" style="font-size:13px;margin-top:10px;color:#334155;"></div>'
    ].join("");

    return panel;
  }

  function setMsg(msg, isError) {
    var el = document.getElementById("sct-direct-msg");
    if (!el) return;

    el.style.color = isError ? "#b91c1c" : "#166534";
    el.textContent = msg || "";
  }

  function populateSelects() {
    var jobSelect = document.getElementById("sct-direct-job");
    var empSelect = document.getElementById("sct-direct-employee");

    if (!jobSelect || !empSelect) return;

    jobSelect.innerHTML = jobs.length
      ? jobs.map(function (job) {
          return '<option value="' + getJobId(job) + '">' + getJobLabel(job).replace(/</g, "&lt;") + '</option>';
        }).join("")
      : '<option value="">No jobs loaded</option>';

    empSelect.innerHTML = employees.length
      ? employees.map(function (emp) {
          var label = getEmployeeName(emp) + " — " + getEmployeeEmail(emp);
          return '<option value="' + getEmployeeId(emp) + '">' + label.replace(/</g, "&lt;") + '</option>';
        }).join("")
      : '<option value="">No employees loaded</option>';
  }

  async function refreshPanel() {
    try {
      setMsg("Loading jobs and employees...", false);
      await loadData();
      populateSelects();
      setMsg("Loaded " + jobs.length + " job(s) and " + employees.length + " employee(s).", false);
    } catch (err) {
      setMsg(err.message || "Failed to load jobs/employees", true);
    }
  }

  function clickMasterRefresh() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll("button"));
    var refresh = buttons.find(function (btn) {
      return clean(btn.textContent).toLowerCase() === "refresh";
    });

    if (refresh) refresh.click();
  }

  function wirePanel() {
    var refreshBtn = document.getElementById("sct-direct-refresh-btn");
    var assignBtn = document.getElementById("sct-direct-assign-btn");

    if (refreshBtn && !refreshBtn.__wired) {
      refreshBtn.__wired = true;
      refreshBtn.addEventListener("click", refreshPanel);
    }

    if (assignBtn && !assignBtn.__wired) {
      assignBtn.__wired = true;
      assignBtn.addEventListener("click", async function () {
        var jobId = document.getElementById("sct-direct-job").value;
        var empId = document.getElementById("sct-direct-employee").value;

        var job = jobs.find(function (j) { return getJobId(j) === jobId; });
        var emp = employees.find(function (e) { return getEmployeeId(e) === empId; });

        if (!job) {
          setMsg("Please select a job.", true);
          return;
        }

        if (!emp) {
          setMsg("Please select an employee.", true);
          return;
        }

        assignBtn.disabled = true;
        assignBtn.textContent = "Assigning...";

        try {
          await assignJob(job, emp);
          setMsg("Job assigned successfully to " + getEmployeeName(emp) + ".", false);

          setTimeout(function () {
            clickMasterRefresh();
            refreshPanel();
          }, 800);
        } catch (err) {
          setMsg(err.message || "Failed to assign job", true);
        } finally {
          assignBtn.disabled = false;
          assignBtn.textContent = "Assign Selected Job";
        }
      });
    }
  }

  function isJobsPage() {
    var text = document.body ? document.body.innerText || "" : "";
    return text.indexOf("Jobs Portal") !== -1 && text.indexOf("Create Job") !== -1;
  }

  function mountPanel() {
    if (!isJobsPage()) return;
    if (document.getElementById("sct-master-direct-assign-panel")) return;

    var labels = Array.prototype.slice.call(document.querySelectorAll("label"));
    var firstCreateJobLabel = labels.find(function (label) {
      return clean(label.textContent).toLowerCase().indexOf("company / organisation") !== -1;
    });

    var target = firstCreateJobLabel ? firstCreateJobLabel.closest("div") : null;

    while (target && target.parentElement && clean(target.innerText).indexOf("Create Job") === -1) {
      target = target.parentElement;
    }

    var panel = makePanel();

    if (target && target.parentElement) {
      target.parentElement.insertBefore(panel, target);
    } else {
      document.body.insertBefore(panel, document.body.firstChild);
    }

    wirePanel();
    refreshPanel();
  }

  setInterval(mountPanel, 1000);
  setTimeout(mountPanel, 300);
})();
