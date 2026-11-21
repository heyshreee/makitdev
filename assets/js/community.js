/* ==========================================================================
   makitdev — GitHub rendering
   Turns public GitHub data into the hero index, the repository list,
   contributor avatars and the contributors roster. Every value rendered here
   comes from the API response or from the static roster in
   assets/data/contributors.js. Nothing is invented.
   ========================================================================== */

(function () {
  "use strict";

  var ICONS = {
    arrow:
      "M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z",
    star:
      "M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z",
    fork:
      "M224,64a32,32,0,1,0-40,31v17a8,8,0,0,1-8,8H80a8,8,0,0,1-8-8V95a32,32,0,1,0-16,0v17a24,24,0,0,0,24,24h40v25a32,32,0,1,0,16,0V136h40a24,24,0,0,0,24-24V95A32.06,32.06,0,0,0,224,64ZM48,64A16,16,0,1,1,64,80,16,16,0,0,1,48,64Zm96,128a16,16,0,1,1-16-16A16,16,0,0,1,144,192ZM192,80a16,16,0,1,1,16-16A16,16,0,0,1,192,80Z",
    check:
      "M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"
  };

  var LANGUAGE_COLORS = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572a5",
    CSS: "#563d7c",
    HTML: "#e34c26",
    Go: "#00add8",
    Rust: "#dea584",
    Shell: "#89e051",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    Ruby: "#701516",
    PHP: "#4f5d95"
  };

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text !== undefined && text !== null) {
      node.textContent = text;
    }
    return node;
  }

  function icon(name) {
    return (
      '<svg class="icon" viewBox="0 0 256 256" aria-hidden="true" focusable="false">' +
      '<path fill="currentColor" d="' +
      ICONS[name] +
      '"/></svg>'
    );
  }

  function iconNode(name) {
    var holder = document.createElement("span");
    holder.innerHTML = icon(name);
    return holder.firstChild;
  }

  function languageColor(language) {
    return LANGUAGE_COLORS[language] || "var(--ink-3)";
  }

  function formatNumber(value) {
    if (typeof value !== "number") {
      return "";
    }
    if (value < 1000) {
      return String(value);
    }
    return new Intl.NumberFormat(undefined, {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(value);
  }

  function formatDate(iso) {
    if (!iso) {
      return "";
    }
    var date = new Date(iso);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  function avatarUrl(url, login) {
    var base =
      url ||
      "https://github.com/" + encodeURIComponent(login || "") + ".png";
    return base + (base.indexOf("?") === -1 ? "?" : "&") + "s=160";
  }

  function profileUrl(person) {
    return (
      person.url ||
      "https://github.com/" + encodeURIComponent(person.login || person.username)
    );
  }

  function pad(index) {
    return String(index).padStart(2, "0");
  }

  function nameParts(repo) {
    var full = repo.fullName || repo.name || "";
    var parts = full.split("/");
    if (parts.length === 2) {
      return { owner: parts[0], name: parts[1] };
    }
    return { owner: "", name: full };
  }

  /* ---- Hero index -------------------------------------------------------- */

  function heroRow(repo, index) {
    var item = el("li", "hero-index-row");
    item.style.setProperty("--i", index);

    var parts = nameParts(repo);
    var name = el("span", "hero-index-name");
    if (parts.owner) {
      name.appendChild(el("span", "hero-index-owner", parts.owner + "/"));
    }
    name.appendChild(el("span", null, parts.name));
    item.appendChild(name);

    var meta = el("span", "hero-index-meta");
    var language = el("span", "hero-index-lang");
    var dot = el("span", "lang-dot");
    dot.style.setProperty("--lang", languageColor(repo.language));
    language.appendChild(dot);
    language.appendChild(
      el("span", null, repo.language || repo.license || "Public")
    );
    meta.appendChild(language);

    if (typeof repo.stars === "number" && repo.stars > 0) {
      var stars = el("span", "hero-index-stars");
      stars.appendChild(iconNode("star"));
      stars.appendChild(el("span", null, formatNumber(repo.stars)));
      meta.appendChild(stars);
    }

    item.appendChild(meta);
    return item;
  }

  function renderHero(list, repos) {
    list.textContent = "";
    list.removeAttribute("aria-busy");

    var count = document.getElementById("hero-repo-count");
    var state = document.getElementById("hero-index-state");

    if (!repos || !repos.length) {
      var empty = el("li", "hero-index-row");
      var link = el("a", "hero-index-link");
      link.href = "https://github.com/makitdev";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.appendChild(el("span", null, "Browse the organization on GitHub"));
      link.appendChild(iconNode("arrow"));
      empty.appendChild(link);
      list.appendChild(empty);
      if (count) {
        count.textContent = "Public repositories";
      }
      if (state) {
        state.textContent = "GitHub";
      }
      return;
    }

    repos.slice(0, 4).forEach(function (repo, index) {
      list.appendChild(heroRow(repo, index));
    });

    if (count) {
      count.textContent =
        repos.length +
        (repos.length === 1 ? " public repository" : " public repositories");
    }
    if (state) {
      state.textContent = "Live";
    }
  }

  /* ---- Repository list --------------------------------------------------- */

  function repoRow(repo, index) {
    var item = el("li", "repo reveal");
    item.style.setProperty("--reveal-delay", index * 60 + "ms");

    var link = el("a", "repo-link");
    link.href = repo.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    link.appendChild(el("span", "repo-index", pad(index + 1)));

    var main = el("span", "repo-main");
    var head = el("span", "repo-head");
    var name = el("span", "repo-name title-2");

    var parts = nameParts(repo);
    if (parts.owner) {
      name.appendChild(el("span", "repo-owner", parts.owner + "/"));
    }
    name.appendChild(el("span", null, parts.name));
    head.appendChild(name);

    var arrow = el("span", "repo-arrow");
    arrow.appendChild(iconNode("arrow"));
    head.appendChild(arrow);
    main.appendChild(head);

    main.appendChild(
      el(
        "span",
        "repo-desc body-3",
        repo.description || "No description provided yet."
      )
    );

    var meta = el("span", "repo-meta");

    if (repo.language) {
      var language = el("span", "chip");
      var dot = el("span", "lang-dot");
      dot.style.setProperty("--lang", languageColor(repo.language));
      language.appendChild(dot);
      language.appendChild(el("span", null, repo.language));
      meta.appendChild(language);
    }

    if (repo.license && repo.license !== "NOASSERTION") {
      meta.appendChild(el("span", "chip", repo.license));
    }

    if (typeof repo.stars === "number" && repo.stars > 0) {
      var stars = el("span", "chip");
      stars.appendChild(iconNode("star"));
      stars.appendChild(el("span", null, formatNumber(repo.stars)));
      meta.appendChild(stars);
    }

    if (typeof repo.forks === "number") {
      var forks = el("span", "chip");
      forks.appendChild(iconNode("fork"));
      forks.appendChild(el("span", null, formatNumber(repo.forks)));
      meta.appendChild(forks);
    }

    main.appendChild(meta);
    link.appendChild(main);
    item.appendChild(link);
    return item;
  }

  function renderRepos(list, repos, note) {
    list.textContent = "";
    list.removeAttribute("aria-busy");

    if (!repos || !repos.length) {
      var item = el("li", "repo");
      var empty = el("div", "repo-empty");
      empty.appendChild(
        el(
          "p",
          "body-3",
          "Repositories are listed on the organization page."
        )
      );
      var link = el("a", "text-link");
      link.href = "https://github.com/makitdev";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.appendChild(el("span", null, "Open github.com/makitdev"));
      link.appendChild(iconNode("arrow"));
      empty.appendChild(link);
      item.appendChild(empty);
      list.appendChild(item);

      if (note) {
        note.textContent =
          "Live GitHub data was unavailable, so nothing is counted here.";
      }
      return [];
    }

    var cards = repos.map(function (repo, index) {
      var card = repoRow(repo, index);
      list.appendChild(card);
      return card;
    });

    if (note) {
      var stamp = formatDate(repos[0].updatedAt);
      note.textContent =
        "Live data from api.github.com · " +
        repos.length +
        (repos.length === 1 ? " public repository" : " public repositories") +
        (stamp ? " · last updated " + stamp : "");
    }

    return cards;
  }

  /* ---- People: avatars --------------------------------------------------- */

  function renderPeople(list, countEl, people) {
    if (!list) {
      return;
    }

    list.textContent = "";

    (people || []).forEach(function (person) {
      var login = person.login || person.username;
      if (!login) {
        return;
      }

      var item = document.createElement("li");
      var link = document.createElement("a");
      link.href = profileUrl(person);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.title = login;

      var img = document.createElement("img");
      img.src = avatarUrl(person.avatar, login);
      img.alt = person.name || login;
      img.width = 96;
      img.height = 96;
      img.loading = "lazy";
      img.decoding = "async";

      link.appendChild(img);
      item.appendChild(link);
      list.appendChild(item);
    });

    if (countEl) {
      if (!people || !people.length) {
        countEl.textContent = "Contributors are listed on the contributors page.";
        return;
      }
      var commits = people.reduce(function (total, person) {
        return total + (person.contributions || 0);
      }, 0);
      countEl.textContent = commits
        ? people.length +
          (people.length === 1 ? " contributor · " : " contributors · ") +
          commits +
          (commits === 1 ? " commit" : " commits")
        : people.length + (people.length === 1 ? " contributor" : " contributors");
    }
  }

  /* ---- People: roster cards ---------------------------------------------- */

  function contributorCard(person) {
    var item = el("li", "contributor reveal");
    var login = person.login || person.username;

    var img = document.createElement("img");
    img.className = "contributor-avatar";
    img.src = avatarUrl(person.avatar, login);
    img.alt = person.name || login;
    img.width = 128;
    img.height = 128;
    img.loading = "lazy";
    img.decoding = "async";

    var body = el("div", "contributor-body");
    var head = el("div", "contributor-head");
    var meta = el("div");

    meta.appendChild(
      el("h3", "contributor-name title-1", person.name || "@" + login)
    );
    meta.appendChild(el("p", "contributor-handle caption-2", "@" + login));
    head.appendChild(meta);

    var link = el("a", "text-link contributor-link");
    link.href = profileUrl(person);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.appendChild(el("span", null, "GitHub"));
    link.appendChild(iconNode("arrow"));
    head.appendChild(link);
    body.appendChild(head);

    if (person.role) {
      body.appendChild(el("p", "contributor-role caption-3", person.role));
    }

    if (typeof person.contributions === "number" && person.contributions > 0) {
      body.appendChild(
        el(
          "p",
          "contributor-meta caption-5",
          person.contributions === 1
            ? "1 contribution on GitHub"
            : person.contributions + " contributions on GitHub"
        )
      );
    }

    if (person.contribution) {
      body.appendChild(el("p", "contributor-desc body-6", person.contribution));
    }

    item.appendChild(img);
    item.appendChild(body);
    return item;
  }

  function renderRoster(list, people, emptyMessage) {
    var usable = (people || []).filter(function (person) {
      return person && (person.login || person.username);
    });

    var previous = list.parentNode.querySelector(".roster-empty");
    if (previous) {
      previous.remove();
    }

    if (!usable.length) {
      list.textContent = "";
      var message = el("p", "body-3 roster-empty", emptyMessage);
      list.parentNode.insertBefore(message, list);
      list.hidden = true;
      return [];
    }

    list.hidden = false;
    list.textContent = "";

    var cards = usable.map(function (person, index) {
      var card = contributorCard(person);
      card.style.setProperty("--reveal-delay", index * 60 + "ms");
      list.appendChild(card);
      return card;
    });

    return cards;
  }

  /* ---- Page wiring ------------------------------------------------------- */

  function reveal(cards) {
    if (!cards || !cards.length || !("IntersectionObserver" in window)) {
      (cards || []).forEach(function (card) {
        card.classList.add("is-visible");
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

    cards.forEach(function (card) {
      io.observe(card);
    });
  }

  function initIndex() {
    var heroList = document.getElementById("hero-repos");
    var repoList = document.getElementById("repos");
    var peopleList = document.getElementById("people-avatars");
    var countEl = document.getElementById("people-count");

    if (!heroList && !repoList && !peopleList) {
      return;
    }

    var fallback = window.MDK_CONTRIBUTORS || [];
    var note = document.getElementById("repo-note");

    if (!window.MDKGitHub) {
      if (heroList) {
        renderHero(heroList, []);
      }
      if (repoList) {
        renderRepos(repoList, [], note);
      }
      if (peopleList) {
        renderPeople(peopleList, countEl, fallback);
      }
      return;
    }

    Promise.all([
      window.MDKGitHub.fetchRepos().catch(function () {
        return null;
      }),
      window.MDKGitHub.fetchContributors().catch(function () {
        return null;
      })
    ]).then(function (results) {
      var repos = results[0];

      if (heroList) {
        renderHero(heroList, repos || []);
      }

      if (repoList) {
        if (repos) {
          reveal(renderRepos(repoList, repos, note));
        } else {
          renderRepos(repoList, [], note);
        }
      }

      if (peopleList) {
        if (results[1] && results[1].length) {
          renderPeople(peopleList, countEl, results[1]);
        } else if (fallback.length) {
          renderPeople(peopleList, countEl, fallback);
        }
      }
    });
  }

  window.MDKCommunity = {
    renderRepos: renderRepos,
    renderPeople: renderPeople,
    renderRoster: renderRoster,
    contributorCard: contributorCard,
    reveal: reveal,
    initIndex: initIndex
  };
})();
