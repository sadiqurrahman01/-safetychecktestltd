(function () {
  function getGalleryData() {
    return window.SCT_GALLERY_DATA || { boards: [], works: [], trades: [] };
  }

  function esc(value) {
    return String(value || "").replace(/[&<>"']/g, function (m) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[m];
    });
  }

  function makeCard(item, large) {
    const src = item.src || item.url || "";
    if (!src) return "";

    const title = esc(item.title || "Project photo");
    const label = esc(item.label || item.stage || item.category || "Project");
    const desc = esc(item.description || label);
    const category = esc(item.category || "project");
    const stage = esc(item.stage || "after");

    return `
      <article class="gallery-card ${large ? "gallery-card-large" : ""}" data-category="${category}" data-stage="${stage}">
        <button class="gallery-image-btn" type="button" data-src="${esc(src)}" data-title="${title}">
          <img src="${esc(src)}" alt="${title}" loading="lazy">
          <span class="gallery-badge">${label}</span>
        </button>
        <div class="gallery-card-body">
          <h3>${title}</h3>
          <p>${desc}</p>
        </div>
      </article>
    `;
  }

  function renderGallery() {
    const data = getGalleryData();

    const boards = document.getElementById("projectBoards");
    const works = document.getElementById("workGallery");
    const trades = document.getElementById("tradeGallery");

    if (boards) boards.innerHTML = (data.boards || []).map(item => makeCard(item, true)).join("");
    if (works) works.innerHTML = (data.works || []).map(item => makeCard(item, false)).join("");
    if (trades) trades.innerHTML = (data.trades || []).map(item => makeCard(item, true)).join("");

    bindFilters();
    bindLightbox();
  }

  function bindFilters() {
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.onclick = function () {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter || "all";

        document.querySelectorAll("#workGallery .gallery-card").forEach(card => {
          const category = card.dataset.category;
          const stage = card.dataset.stage;
          const show = filter === "all" || filter === category || filter === stage;
          card.style.display = show ? "" : "none";
        });
      };
    });
  }

  function bindLightbox() {
    let lightbox = document.getElementById("galleryLightbox");

    if (!lightbox) {
      lightbox = document.createElement("div");
      lightbox.id = "galleryLightbox";
      lightbox.className = "gallery-lightbox";
      lightbox.innerHTML = `
        <button class="gallery-lightbox-close" type="button">×</button>
        <img src="" alt="">
        <p></p>
      `;
      document.body.appendChild(lightbox);
    }

    const img = lightbox.querySelector("img");
    const caption = lightbox.querySelector("p");
    const close = lightbox.querySelector(".gallery-lightbox-close");

    document.querySelectorAll(".gallery-image-btn").forEach(btn => {
      btn.onclick = function () {
        img.src = btn.dataset.src;
        img.alt = btn.dataset.title;
        caption.textContent = btn.dataset.title;
        lightbox.classList.add("open");
      };
    });

    close.onclick = function () {
      lightbox.classList.remove("open");
    };

    lightbox.onclick = function (e) {
      if (e.target === lightbox) lightbox.classList.remove("open");
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderGallery);
  } else {
    renderGallery();
  }
})();
