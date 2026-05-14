(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".filter"));
    var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-card"));

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-filter") || "all";

        buttons.forEach(function (btn) {
          btn.classList.remove("active");
        });

        button.classList.add("active");

        items.forEach(function (item) {
          var category = item.getAttribute("data-category") || "";
          item.classList.toggle("is-hidden", filter !== "all" && category.indexOf(filter) === -1);
        });
      });
    });
  });
})();
