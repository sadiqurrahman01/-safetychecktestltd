(function () {
  const data = window.SCT_GALLERY_DATA || { boards: [], works: [], trades: [] };

  const boardGrid = document.querySelector("#projectBoards");
  const workGrid = document.querySelector("#workGallery");
  const tradeGrid = document.querySelector("#tradeGallery");

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

  function card(item, big) {
    const title = esc(item.title || item.name || "Project photo");
    const label = esc(item.label || item.stage || item.category || "Project");
    const src = esc(item.src || item.url || "");
    const category = esc(item.category || "project");
    const stage = esc(item.stage || "after");

    return `
      <article class="gallery-card ${big ? "gallery-card-large" : ""}" data-category="${category}" data-stage="${stage}">
        <button class="gallery-image-btn" type="button" data-src="${src}" data-title="${title}">
          <img src="${src}" alt="${title}" loading="lazy">
          <span class="gallery-badge">${label}</span>
        </button>
        <div class="gallery-card-body">
          <h3>${title}</h3>
          <p>${esc(item.description || label)}</p>
        </div>
      </article>
    `;
  }

  function render() {
    if (boardGrid) {
      boardGrid.innerHTML = (data.boards || []).map((item) => card(item, true)).join("");
    }

    if (workGrid) {
      workGrid.innerHTML = (data.works || []).map((item) => card(item, false)).join("");
    }

    if (tradeGrid) {
      tradeGrid.innerHTML = (data.trades || []).map((item) => card(item, true)).join("");
    }

    if (workGrid && !workGrid.innerHTML.trim()) {
      workGrid.innerHTML = `
        <div class="empty-gallery">
          <h3>No gallery photos found</h3>
          <p>Gallery data exists, but no photos were loaded. Check gallery-data.js and assets/gallery.</p>
        </div>
      `;
    }

    bindLightbox();
  }

  function bindFilters() {
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter || "all";
        document.querySelectorAll("#workGallery .gallery-card").forEach((cardEl) => {
          const category = cardEl.dataset.category;
          const stage = cardEl.dataset.stage;
          const show = filter === "all" || filter === category || filter === stage;
          cardEl.style.display = show ? "" : "none";
        });
      });
    });
  }

  function bindLightbox() {
    let lightbox = document.querySelector("#galleryLightbox");

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

    document.querySelectorAll(".gallery-image-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        img.src = btn.dataset.src;
        img.alt = btn.dataset.title;
        caption.textContent = btn.dataset.title;
        lightbox.classList.add("open");
      });
    });

    close.addEventListener("click", () => lightbox.classList.remove("open"));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) lightbox.classList.remove("open");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    render();
    bindFilters();
  });
})();
