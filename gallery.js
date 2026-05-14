(function () {
  function data() {
    return window.SCT_GALLERY_DATA || { boards: [], works: [], trades: [] };
  }

  function esc(v) {
    return String(v || "").replace(/[&<>"']/g, function (m) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[m];
    });
  }

  function card(item, large) {
    var src = item.src || "";
    if (!src) return "";

    var title = esc(item.title || "Project photo");
    var label = esc(item.label || "Project");
    var desc = esc(item.description || label);
    var category = esc(item.category || "project");
    var stage = esc(item.stage || "after");

    return ''
      + '<article class="gallery-card ' + (large ? 'gallery-card-large' : '') + '" data-category="' + category + '" data-stage="' + stage + '">'
      + '<button class="gallery-image-btn" type="button" data-src="' + esc(src) + '" data-title="' + title + '">'
      + '<img src="' + esc(src) + '" alt="' + title + '" loading="lazy">'
      + '<span class="gallery-badge">' + label + '</span>'
      + '</button>'
      + '<div class="gallery-card-body">'
      + '<h3>' + title + '</h3>'
      + '<p>' + desc + '</p>'
      + '</div>'
      + '</article>';
  }

  function render() {
    var galleryData = data();

    var boards = document.getElementById("projectBoards");
    var works = document.getElementById("workGallery");
    var trades = document.getElementById("tradeGallery");

    if (boards) boards.innerHTML = (galleryData.boards || []).map(function (x) { return card(x, true); }).join("");
    if (works) works.innerHTML = (galleryData.works || []).map(function (x) { return card(x, false); }).join("");
    if (trades) trades.innerHTML = (galleryData.trades || []).map(function (x) { return card(x, true); }).join("");

    if (works && !works.innerHTML.trim()) {
      works.innerHTML = '<div class="empty-gallery"><h3>No gallery photos found</h3><p>The uploaded photo files are not being loaded.</p></div>';
    }

    bindFilters();
    bindLightbox();
  }

  function bindFilters() {
    document.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.onclick = function () {
        document.querySelectorAll(".filter-btn").forEach(function (b) {
          b.classList.remove("active");
        });

        btn.classList.add("active");

        var filter = btn.dataset.filter || "all";

        document.querySelectorAll("#workGallery .gallery-card").forEach(function (el) {
          var show =
            filter === "all" ||
            el.dataset.category === filter ||
            el.dataset.stage === filter;

          el.style.display = show ? "" : "none";
        });
      };
    });
  }

  function bindLightbox() {
    var lightbox = document.getElementById("galleryLightbox");

    if (!lightbox) {
      lightbox = document.createElement("div");
      lightbox.id = "galleryLightbox";
      lightbox.className = "gallery-lightbox";
      lightbox.innerHTML =
        '<button class="gallery-lightbox-close" type="button">×</button>'
        + '<img src="" alt="">'
        + '<p></p>';
      document.body.appendChild(lightbox);
    }

    var img = lightbox.querySelector("img");
    var caption = lightbox.querySelector("p");
    var close = lightbox.querySelector(".gallery-lightbox-close");

    document.querySelectorAll(".gallery-image-btn").forEach(function (btn) {
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

  render();
})();
