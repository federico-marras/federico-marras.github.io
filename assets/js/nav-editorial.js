(function () {
  "use strict";

  var mobileNavBreakpoint = 820;
  var logoPath = "/assets/image/logo.png";
  var siteHeader = document.getElementById("site-header");
  var navMenuToggle = document.getElementById("nav-menu-toggle");
  var navActions = document.querySelector(".nav-actions");
  var mobileNavPanel = document.getElementById("mobile-nav-panel");
  var themeToggle = document.getElementById("theme-toggle");
  var navBrandImage = document.querySelector(".nav-brand-mark img");

  function injectLiveStyles() {
    if (document.getElementById("nav-live-fixes")) return;

    var style = document.createElement("style");
    style.id = "nav-live-fixes";
    style.textContent = [
      ".scroll-progress{z-index:2000!important;height:3px!important;}",
      ".site-header.is-scrolled{border-bottom:0!important;background:transparent!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;}",
      ".site-header.is-open{border-bottom:1px solid var(--line);background:rgba(15,17,23,.78);}"
    ].join("");
    document.head.appendChild(style);
  }

  function removeThemeToggle() {
    if (themeToggle && themeToggle.parentNode) {
      themeToggle.parentNode.removeChild(themeToggle);
    }
    document.documentElement.removeAttribute("data-theme");
  }

  function normalizeLogo() {
    if (!navBrandImage) return;
    navBrandImage.setAttribute("src", logoPath);
    navBrandImage.setAttribute("alt", "");
  }

  function buildHamburgerButton() {
    if (!navMenuToggle || !navActions) return;

    var cleanButton = navMenuToggle.cloneNode(false);
    cleanButton.className = "nav-icon-btn nav-menu-btn";
    cleanButton.setAttribute("type", "button");
    cleanButton.setAttribute("id", "nav-menu-toggle");
    cleanButton.setAttribute("aria-label", "Apri menu");
    cleanButton.setAttribute("aria-expanded", "false");
    cleanButton.setAttribute("aria-controls", "mobile-nav-panel");

    var lines = document.createElement("span");
    lines.className = "hamburger-lines";
    lines.setAttribute("aria-hidden", "true");

    for (var index = 0; index < 3; index += 1) {
      lines.appendChild(document.createElement("span"));
    }

    cleanButton.appendChild(lines);
    navMenuToggle.parentNode.replaceChild(cleanButton, navMenuToggle);
    navMenuToggle = cleanButton;
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

  function toggleMobileNav(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
      }
    }

    if (!siteHeader || !navMenuToggle) return;
    var isOpen = !siteHeader.classList.contains("is-open");
    siteHeader.classList.toggle("is-open", isOpen);
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

  injectLiveStyles();
  removeThemeToggle();
  normalizeLogo();
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
