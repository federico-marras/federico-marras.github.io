(function () {
  "use strict";

  var siteHeader = document.getElementById("site-header");
  var navMenuToggle = document.getElementById("nav-menu-toggle");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var sectionLinks = navLinks.filter(function (link) {
    var href = link.getAttribute("href");
    return href && href.indexOf("#") === 0 && document.querySelector(href);
  });

  function updateHeaderState() {
    if (!siteHeader) return;
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  function closeMobileNav() {
    if (!siteHeader || !navMenuToggle) return;
    siteHeader.classList.remove("is-open");
    navMenuToggle.setAttribute("aria-expanded", "false");
    navMenuToggle.setAttribute("aria-label", "Apri menu");
  }

  function setActiveNavLink() {
    var scrollPosition = window.scrollY + 150;
    var activeId = "";

    sectionLinks.forEach(function (link) {
      var section = document.querySelector(link.getAttribute("href"));
      if (section && section.offsetTop <= scrollPosition) {
        activeId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", Boolean(activeId) && link.getAttribute("href") === "#" + activeId);
    });
  }

  if (navMenuToggle && siteHeader) {
    navMenuToggle.addEventListener("click", function () {
      var isOpen = siteHeader.classList.toggle("is-open");
      navMenuToggle.setAttribute("aria-expanded", String(isOpen));
      navMenuToggle.setAttribute("aria-label", isOpen ? "Chiudi menu" : "Apri menu");
      updateHeaderState();
    });
  }

  sectionLinks.forEach(function (link) {
    link.addEventListener("click", closeMobileNav);
  });

  window.addEventListener("scroll", updateHeaderState, { passive: true });
  window.addEventListener("scroll", setActiveNavLink, { passive: true });
  window.addEventListener("resize", setActiveNavLink);

  updateHeaderState();
  setActiveNavLink();
})();
