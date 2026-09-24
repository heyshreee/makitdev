/* ==========================================================================
   makitdev — minimal enhancement script
   Scroll reveals + subtle header behavior. No dependencies.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---- Reveal sections on scroll --- */
  var reveals = Array.prototype.slice.call(
    document.querySelectorAll(".reveal")
  );

  if (reveals.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ---- Subtle header treatment on scroll --- */
  var header = document.querySelector(".site-header");

  function syncHeader() {
    if (header && !reduceMotion.matches) {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
  }

  if (header && "scrollY" in window) {
    window.addEventListener("scroll", syncHeader, { passive: true });
    syncHeader();
  }
})();