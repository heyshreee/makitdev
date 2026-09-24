/* ==========================================================================
   makitdev — contributors page renderer
   Reads window.MDK_CONTRIBUTORS (defined in assets/data/contributors.js)
   and builds the contributor cards. No fetch, no server required, so the
   page works when opened directly from disk. No dependencies.

   Cards are injected after main.js has run, so this file also handles the
   scroll-reveal for the cards it adds.
   ========================================================================== */

(function () {
  "use strict";

  var grid = document.getElementById("contributors-grid");
  if (!grid) {
    return;
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  var FALLBACK_CONTRIBUTORS = [
    {
      name: "Sriram",
      username: "heyshreee",
      role: "Founder & Maintainer",
      contribution: "Core architecture, developer tools, and open-source infrastructure.",
      category: "Maintainers",
      github: "https://github.com/heyshreee",
      avatar: "https://avatars.githubusercontent.com/u/206909485?v=4"
    },
    {
      name: "SriRamFevenz",
      username: "SriRamFevenz",
      role: "Core Contributor",
      contribution: "Core development, software utilities, and open experiments.",
      category: "Contributors",
      github: "https://github.com/SriRamFevenz",
      avatar: "https://avatars.githubusercontent.com/u/142327897?v=4"
    }
  ];

  function avatarUrl(contributor) {
    var base =
      contributor.avatar ||
      "https://github.com/" + encodeURIComponent(contributor.username) + ".png";
    var sep = base.indexOf("?") === -1 ? "?" : "&";
    return base + sep + "s=144";
  }

  function githubUrl(contributor) {
    return (
      contributor.github ||
      "https://github.com/" + encodeURIComponent(contributor.username)
    );
  }

  function card(contributor) {
    var li = document.createElement("li");
    li.className = "contributor reveal";

    var img = document.createElement("img");
    img.className = "contributor-avatar";
    img.src = avatarUrl(contributor);
    img.alt = contributor.name || contributor.username;
    img.width = 144;
    img.height = 144;
    img.loading = "lazy";

    var body = document.createElement("div");
    body.className = "contributor-body";

    var head = document.createElement("div");
    head.className = "contributor-head";

    var meta = document.createElement("div");
    var name = document.createElement("h3");
    name.className = "contributor-name";
    name.textContent = contributor.name || ("@" + contributor.username);
    var handle = document.createElement("p");
    handle.className = "contributor-handle";
    handle.textContent = "@" + contributor.username;
    meta.appendChild(name);
    meta.appendChild(handle);

    var link = document.createElement("a");
    link.className = "contributor-link tlink";
    link.href = githubUrl(contributor);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.appendChild(document.createTextNode("GitHub"));
    var arrow = document.createElement("span");
    arrow.className = "arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "\u2197";
    link.appendChild(arrow);

    head.appendChild(meta);
    head.appendChild(link);
    body.appendChild(head);

    if (contributor.role) {
      var role = document.createElement("p");
      role.className = "contributor-role";
      role.textContent = contributor.role;
      body.appendChild(role);
    }

    if (contributor.contribution) {
      var desc = document.createElement("p");
      desc.className = "contributor-desc";
      desc.textContent = contributor.contribution;
      body.appendChild(desc);
    }

    li.appendChild(img);
    li.appendChild(body);
    return li;
  }

  function reveal(items) {
    if (!items.length) {
      return;
    }
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("in-view");
      });
      return;
    }
    var io = new window.IntersectionObserver(
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
    items.forEach(function (el) {
      io.observe(el);
    });
  }

  function showEmpty(message) {
    var p = document.createElement("p");
    p.className = "statement-copy";
    p.textContent = message;
    grid.parentNode.insertBefore(p, grid);
    grid.textContent = "";
  }

  function renderList(list) {
    if (!Array.isArray(list) || !list.length) {
      showEmpty("No contributors listed yet.");
      return;
    }
    grid.textContent = "";
    var cards = list.map(card);
    cards.forEach(function (el) {
      grid.appendChild(el);
    });
    reveal(cards);
  }

  var data = window.MDK_CONTRIBUTORS;

  if (Array.isArray(data) && data.length) {
    renderList(data);
  } else if (Array.isArray(FALLBACK_CONTRIBUTORS) && FALLBACK_CONTRIBUTORS.length) {
    renderList(FALLBACK_CONTRIBUTORS);
  } else {
    showEmpty("No contributors listed yet.");
  }
})();