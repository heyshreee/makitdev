/* ==========================================================================
   makitdev — interactions
   Navigation, scroll reveals, the word by word tagline and the footer year.
   No dependencies. Everything here is progressive enhancement: with
   JavaScript off the page is still a complete, readable document.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var wide = window.matchMedia("(min-width: 901px)");

  function on(el, event, handler, opts) {
    if (el) {
      el.addEventListener(event, handler, opts);
    }
  }

  function each(list, fn) {
    Array.prototype.forEach.call(list, fn);
  }

  /* ---- Reveal on scroll -------------------------------------------------- */

  function revealObserver() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) {
      return;
    }

    if (!("IntersectionObserver" in window) || reduceMotion.matches) {
      each(items, function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    each(items, function (el) {
      io.observe(el);
    });
  }

  /* ---- Navigation -------------------------------------------------------- */

  function mobileNav() {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".nav-toggle");
    var drawer = document.getElementById("nav-drawer");
    var scrim = document.querySelector(".nav-scrim");
    if (!header || !toggle || !drawer) {
      return;
    }

    var label = toggle.querySelector(".nav-toggle-label");
    var open = false;

    drawer.inert = true;
    drawer.setAttribute("aria-hidden", "true");

    function focusables() {
      var items = [toggle];
      each(drawer.querySelectorAll("a, button"), function (el) {
        items.push(el);
      });
      return items;
    }

    function setOpen(next, returnFocus) {
      open = next;
      toggle.setAttribute("aria-expanded", String(next));
      if (label) {
        label.textContent = next ? "Close" : "Menu";
      }
      header.classList.toggle("is-open", next);
      drawer.classList.toggle("is-open", next);
      if (scrim) {
        scrim.classList.toggle("is-open", next);
      }
      document.body.classList.toggle("is-locked", next);
      drawer.inert = !next;
      drawer.setAttribute("aria-hidden", String(!next));

      if (next) {
        var first = drawer.querySelector("a, button");
        if (first) {
          window.requestAnimationFrame(function () {
            first.focus();
          });
        }
      } else if (returnFocus) {
        toggle.focus();
      }
    }

    on(toggle, "click", function () {
      setOpen(!open, false);
    });

    on(scrim, "click", function () {
      setOpen(false, true);
    });

    on(document, "keydown", function (event) {
      if (!open) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false, true);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      var items = focusables();
      if (!items.length) {
        return;
      }
      var first = items[0];
      var last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    on(drawer, "click", function (event) {
      if (event.target.closest("a")) {
        setOpen(false, false);
      }
    });

    var onBreakpoint = function (event) {
      if (event.matches && open) {
        setOpen(false, false);
      }
    };

    if (wide.addEventListener) {
      wide.addEventListener("change", onBreakpoint);
    } else if (wide.addListener) {
      wide.addListener(onBreakpoint);
    }
  }

  function scrollSpy() {
    var links = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!links.length || !("IntersectionObserver" in window)) {
      return;
    }

    var map = {};
    var sections = [];

    each(links, function (link) {
      var id = link.getAttribute("href");
      var section = document.querySelector(id);
      if (section) {
        map[section.id] = link;
        sections.push(section);
      }
    });

    if (!sections.length) {
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = map[entry.target.id];
          if (!link) {
            return;
          }
          if (entry.isIntersecting) {
            each(links, function (other) {
              other.classList.remove("is-current");
            });
            link.classList.add("is-current");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    each(sections, function (section) {
      io.observe(section);
    });
  }

  /* ---- Tagline reveal ---------------------------------------------------- */

  function taglineReveal() {
    var tagline = document.querySelector("[data-tagline]");
    if (!tagline) {
      return;
    }

    var wordsEl = tagline.querySelector("[data-tagline-words]");
    if (!wordsEl) {
      return;
    }

    var words = wordsEl.textContent.trim().split(/\s+/);
    wordsEl.textContent = "";

    words.forEach(function (word, index) {
      var span = document.createElement("span");
      span.className = "word";
      span.textContent = word;
      wordsEl.appendChild(span);
      if (index < words.length - 1) {
        wordsEl.appendChild(document.createTextNode(" "));
      }
    });

    var spans = wordsEl.querySelectorAll(".word");

    if (!("IntersectionObserver" in window) || reduceMotion.matches) {
      each(spans, function (span) {
        span.classList.add("is-lit");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-lit");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -30% 0px", threshold: 0 }
    );

    each(spans, function (span) {
      io.observe(span);
    });
  }

  /* ---- Footer year ------------------------------------------------------- */

  function currentYear() {
    var year = String(new Date().getFullYear());
    each(document.querySelectorAll("[data-year]"), function (node) {
      node.textContent = year;
    });
  }

  /* ---- Visitor count ----------------------------------------------------- */

  function visitorCount() {
    var count = document.getElementById("visitor-count");
    if (!count) {
      return;
    }

    fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageUrl: window.location.href,
        title: document.title
      })
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Visitor tracking failed");
        }
        return response.json();
      })
      .then(function (data) {
        if (typeof data.count !== "undefined") {
          count.textContent = data.count + " Visits";
        }
      })
      .catch(function () {
        count.textContent = "Visits unavailable";
      });
  }

  /* ---- Boot -------------------------------------------------------------- */

  function boot() {
    revealObserver();
    mobileNav();
    scrollSpy();
    taglineReveal();
    currentYear();
    visitorCount();

    if (window.MDKCommunity) {
      window.MDKCommunity.initIndex();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
