(function () {
  function addGalleryLink() {
    document.querySelectorAll("nav").forEach(function (nav) {
      var hasGallery = Array.from(nav.querySelectorAll("a")).some(function (a) {
        return String(a.textContent || "").trim().toLowerCase() === "gallery";
      });

      if (hasGallery) return;

      var links = Array.from(nav.querySelectorAll("a"));
      var quotes = links.find(function (a) {
        return String(a.textContent || "").trim().toLowerCase() === "quotes";
      });

      var gallery = document.createElement("a");
      gallery.href = "gallery.html";
      gallery.textContent = "Gallery";

      if (quotes && quotes.getAttribute("style")) {
        gallery.setAttribute("style", quotes.getAttribute("style"));
      }

      if (quotes && quotes.parentNode) {
        quotes.parentNode.insertBefore(gallery, quotes.nextSibling);
      } else {
        nav.appendChild(gallery);
      }
    });
  }

  addGalleryLink();
  document.addEventListener("DOMContentLoaded", addGalleryLink);
  window.addEventListener("load", addGalleryLink);
  setTimeout(addGalleryLink, 500);
  setTimeout(addGalleryLink, 1500);
  setTimeout(addGalleryLink, 3000);

  new MutationObserver(addGalleryLink).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
