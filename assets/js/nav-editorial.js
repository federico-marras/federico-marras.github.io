(function () {
  "use strict";

  var mobileNavBreakpoint = 820;
  var siteHeader = document.getElementById("site-header");
  var navMenuToggle = document.getElementById("nav-menu-toggle");
  var navActions = document.querySelector(".nav-actions");
  var mobileNavPanel = document.getElementById("mobile-nav-panel");
  var themeToggle = document.getElementById("theme-toggle");

  function removeThemeToggle() {
    if (themeToggle && themeToggle.parentNode) {
      themeToggle.parentNode.removeChild(themeToggle);
    }
    document.documentElement.removeAttribute("data-theme");
  }

  function buildHamburgerButton() {
    if (!navMenuToggle || !navActions) return;

    navMenuToggle.innerHTML = "";
    navMenuToggle.className = "nav-icon-btn nav-menu-btn";
    navMenuToggle.setAttribute("type", "button");
    navMenuToggle.setAttribute("aria-label", "Apri menu");
    navMenuToggle.setAttribute("aria-expanded", "false");
    navMenuToggle.setAttribute("aria-controls", "mobile-nav-panel");

    var lines = document.createElement("span");
    lines.className = "hamburger-lines";
    lines.setAttribute("aria-hidden", "true");

    for (var index = 0; index < 3; index += 1) {
      lines.appendChild(document.createElement("span"));
    }

    navMenuToggle.appendChild(lines);
  }

  function renderMobileLinks() {
    if (!mobileNavPanel) return;

    var links = [
      ["Metodo", "#method"],
      ["Competenze", "#competences"],
      ["Casi studio", "#case-studies"],
      ["Articoli", "#articles"],
      ["Tracking Lab", "#tracking-demo"]
    ];

    mobileNavPanel.innerHTML = links
      .map(function (item) {
        return '<a class="nav-link" href="' + item[1] + '">' + item[0] + "</a>";
      })
      .join("");
  }

  function getSectionLinks() {
    return Array.prototype.slice.call(document.querySelectorAll(".nav-link")).filter(function (link) {
      var href = link.getAttribute("href");
      return href && href.indexOf("#") === 0 && document.querySelector(href);
    });
  }

  function updateHeaderState() {
    if (!siteHeader) return;
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  function closeMobileNav() {
    if (!siteHeader || !navMenuToggle) return;
    siteHeader.classList.remove("is-open");
    document.body.classList.remove("nav-lock");
    navMenuToggle.setAttribute("aria-expanded", "false");
    navMenuToggle.setAttribute("aria-label", "Apri menu");
  }

  function toggleMobileNav() {
    if (!siteHeader || !navMenuToggle) return;
    var isOpen = siteHeader.classList.toggle("is-open");
    document.body.classList.toggle("nav-lock", isOpen);
    navMenuToggle.setAttribute("aria-expanded", String(isOpen));
    navMenuToggle.setAttribute("aria-label", isOpen ? "Chiudi menu" : "Apri menu");
    updateHeaderState();
  }

  function closeMobileNavAboveBreakpoint() {
    if (window.innerWidth > mobileNavBreakpoint) {
      closeMobileNav();
    }
  }

  function setActiveNavLink() {
    var scrollPosition = window.scrollY + 150;
    var activeId = "";
    var sectionLinks = getSectionLinks();

    sectionLinks.forEach(function (link) {
      var section = document.querySelector(link.getAttribute("href"));
      if (section && section.offsetTop <= scrollPosition) {
        activeId = section.id;
      }
    });

    Array.prototype.slice.call(document.querySelectorAll(".nav-link")).forEach(function (link) {
      link.classList.toggle("is-active", Boolean(activeId) && link.getAttribute("href") === "#" + activeId);
    });
  }

  removeThemeToggle();
  buildHamburgerButton();
  renderMobileLinks();

  if (navMenuToggle) {
    navMenuToggle.addEventListener("click", toggleMobileNav);
  }

  document.addEventListener("click", function (event) {
    if (event.target.closest(".mobile-nav-panel .nav-link")) {
      closeMobileNav();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMobileNav();
    }
  });

  window.addEventListener("scroll", updateHeaderState, { passive: true });
  window.addEventListener("scroll", setActiveNavLink, { passive: true });
  window.addEventListener("resize", closeMobileNavAboveBreakpoint);
  window.addEventListener("resize", setActiveNavLink);

  updateHeaderState();
  setActiveNavLink();
})();
