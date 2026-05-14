(function(){
  "use strict";

  var API = "https://api.safetychecktestltd.co.uk";

  function getToken(){
    return (
      localStorage.getItem("sct_admin_token") ||
      localStorage.getItem("sctAdminToken") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("token") ||
      ""
    );
  }

  function cleanText(v){
    return String(v == null ? "" : v).trim();
  }

  function first(){
    for(var i = 0; i < arguments.length; i++){
      var v = cleanText(arguments[i]);
      if(v) return v;
    }
    return "";
  }

  function quoteToJobPayload(quote){
    quote = quote || {};

    var contactName = first(
      quote.contactName,
      quote.name,
      quote.customerName,
      quote.fullName,
      quote.requesterName,
      quote.clientName,
      "Customer"
    );

    var email = first(
      quote.email,
      quote.customerEmail,
      quote.requesterEmail,
      quote.clientEmail
    );

    var phone = first(
      quote.phone,
      quote.phoneNumber,
      quote.customerPhone,
      quote.requesterPhone,
      quote.clientPhone
    );

    var businessName = first(
      quote.businessName,
      quote.companyName,
      quote.organisationName,
      quote.organizationName
    );

    var serviceType = first(
      quote.serviceType,
      quote.service,
      quote.jobType,
      quote.quoteType,
      "General Quote"
    );

    var postcode = first(
      quote.postcode,
      quote.postCode,
      quote.zip,
      "-"
    );

    var address = [
      first(quote.addressLine1, quote.address, quote.siteAddress),
      first(quote.addressLine2),
      first(quote.townCity, quote.city)
    ].filter(Boolean).join(", ");

    var quoteId = first(quote._id, quote.id, quote.quoteId);

    return {
      quoteId: quoteId,
      source: "quote_request",
      sourceQuoteId: quoteId,
      title: serviceType + " - " + contactName,
      serviceType: serviceType,
      status: "new",
      priority: quote.urgentJob === "yes" ? "urgent" : "normal",
      contactName: contactName,
      requesterName: contactName,
      customerName: contactName,
      businessName: businessName,
      organisationName: businessName,
      email: email,
      requesterEmail: email,
      phone: phone,
      requesterPhone: phone,
      postcode: postcode,
      sitePostcode: postcode,
      address: address,
      siteAddress: address,
      description: first(
        quote.additionalNotes,
        quote.notes,
        quote.description,
        "Job created from quote request"
      ),
      quoteSnapshot: quote
    };
  }

  async function api(path, options){
    var token = getToken();
    if(!token){
      throw new Error("Admin token missing. Log in again first.");
    }

    var res = await fetch(API.replace(/\/$/, "") + path, {
      method: options && options.method ? options.method : "GET",
      headers: Object.assign({
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }, options && options.headers ? options.headers : {}),
      body: options && options.body ? options.body : undefined
    });

    var raw = await res.text();
    var data = {};
    try { data = raw ? JSON.parse(raw) : {}; }
    catch(e){ data = { message: raw || "Non JSON API response" }; }

    if(!res.ok || data.ok === false){
      throw new Error(data.message || data.error || ("Request failed HTTP " + res.status));
    }

    return data;
  }

  async function createJobFromQuote(quote){
    var payload = quoteToJobPayload(quote);

    var endpoints = [
      "/api/admin/jobs",
      "/api/admin/portal-jobs"
    ];

    var lastErr = null;

    for(var i = 0; i < endpoints.length; i++){
      try{
        var data = await api(endpoints[i], {
          method: "POST",
          body: JSON.stringify(payload)
        });

        return {
          ok: true,
          endpoint: endpoints[i],
          data: data,
          payload: payload
        };
      }catch(err){
        lastErr = err;
      }
    }

    throw lastErr || new Error("Could not create job from quote");
  }

  function decodeMaybeQuote(input){
    if(!input) return {};

    if(typeof input === "object") return input;

    var str = String(input);

    try { return JSON.parse(str); } catch(e){}

    try { return JSON.parse(decodeURIComponent(str)); } catch(e){}

    try { return JSON.parse(atob(str)); } catch(e){}

    return {};
  }

  async function assignQuoteToJob(input){
    var quote = decodeMaybeQuote(input);

    if(!quote || Object.keys(quote).length === 0){
      alert("Could not read this quote. Please click View Details first or refresh admin.");
      return;
    }

    var label = first(
      quote.contactName,
      quote.name,
      quote.customerName,
      quote.email,
      quote.serviceType,
      quote._id,
      "this quote"
    );

    if(!confirm("Create job from quote: " + label + "?")) return;

    try{
      var result = await createJobFromQuote(quote);
      localStorage.setItem("sctQuoteAssignDraft", JSON.stringify(result.payload));
      localStorage.setItem("sctPortalAssignDraft", JSON.stringify(result.payload));
      alert("Job created from quote. Opening Employees Panel so you can assign it.");
      window.location.href = "/admin-employees/?t=" + Date.now();
    }catch(err){
      console.error("Assign job failed", err);

      try{
        var fallbackPayload = quoteToJobPayload(quote);
        localStorage.setItem("sctQuoteAssignDraft", JSON.stringify(fallbackPayload));
        localStorage.setItem("sctPortalAssignDraft", JSON.stringify(fallbackPayload));
        alert("Job draft saved. Opening Employees Panel. Error was: " + (err.message || err));
        window.location.href = "/admin-employees/?t=" + Date.now();
      }catch(e){
        alert("Assign Job failed: " + (err.message || err));
      }
    }
  }

  window.sctAssignQuoteToJob = assignQuoteToJob;
  window.assignQuoteToJob = assignQuoteToJob;
  window.assignJobFromQuote = assignQuoteToJob;
  window.handleAssignJob = assignQuoteToJob;

  document.addEventListener("click", function(e){
    var btn = e.target && e.target.closest ? e.target.closest("button,a") : null;
    if(!btn) return;

    var txt = cleanText(btn.textContent).toLowerCase();
    if(txt !== "assign job") return;

    var raw = btn.getAttribute("data-quote") || btn.getAttribute("data-job") || btn.getAttribute("data-quote-json");

    if(raw){
      e.preventDefault();
      e.stopPropagation();
      assignQuoteToJob(raw);
      return;
    }

    var card = btn.closest("[data-quote], [data-quote-json], [data-id], .quote-card, .quote, .card");
    if(card){
      raw = card.getAttribute("data-quote") || card.getAttribute("data-quote-json");
      if(raw){
        e.preventDefault();
        e.stopPropagation();
        assignQuoteToJob(raw);
      }
    }
  }, true);
})();
