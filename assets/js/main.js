const articles = [
  {
    title: "Checklist QA per un A/B test in Adobe Target",
    category: "Adobe Target",
    description:
      "Controlli essenziali su audience, experience, eventi analytics, fallback e comportamento responsive.",
    readingTime: "7 min",
    status: "Published",
    slug: "checklist-qa-adobe-target"
  },
  {
    title: "Come scegliere la primary metric di un esperimento",
    category: "CRO",
    description:
      "Un criterio pratico per collegare ipotesi, comportamento utente, metrica primaria e guardrail.",
    readingTime: "6 min",
    status: "Published",
    slug: "primary-metric-ab-test"
  },
  {
    title: "MutationObserver negli esperimenti Adobe Target",
    category: "JavaScript",
    description:
      "Come applicare experience su DOM che cambia dopo il caricamento, evitando loop e duplicazioni.",
    readingTime: "8 min",
    status: "Published",
    slug: "mutationobserver-adobe-target"
  },
  {
    title: "Tracking strategy: prima gli eventi, poi il report",
    category: "Tracking",
    description:
      "Note su naming, data layer, ownership e verifiche prima di affidare un esperimento ai dati.",
    readingTime: "5 min",
    status: "Draft",
    slug: "tracking-strategy-eventi-report"
  },
  {
    title: "Adobe Data Collection: regole leggibili nel tempo",
    category: "Adobe Data Collection",
    description:
      "Una struttura mentale per mantenere regole, data elements e condizioni comprensibili anche mesi dopo.",
    readingTime: "6 min",
    status: "In progress",
    slug: "adobe-data-collection-regole"
  },
  {
    title: "Sample ratio mismatch: segnali da non ignorare",
    category: "Analytics",
    description:
      "Perché controllare la distribuzione del traffico è utile prima di interpretare uplift e confidence.",
    readingTime: "4 min",
    status: "Draft",
    slug: "sample-ratio-mismatch"
  }
];

const rotatingKeywords = [
  "Adobe Target",
  "Adobe Analytics",
  "JavaScript",
  "CRO",
  "Tracking Strategy",
  "A/B Testing"
];

const articleGrid = document.querySelector("#articles-grid");
const searchInput = document.querySelector("#article-search");
const sortInput = document.querySelector("#article-sort");
const filterContainer = document.querySelector("#category-filters");
const emptyState = document.querySelector("#empty-state");
const progressBar = document.querySelector("#scroll-progress");
const siteHeader = document.querySelector("#site-header");
const navMenuToggle = document.querySelector("#nav-menu-toggle");
const navLinks = document.querySelectorAll(".nav-link");
const rotatingKeyword = document.querySelector("#rotating-keyword");
const heroOrbit = document.querySelector("#hero-orbit");
const demoTrackingButton = document.querySelector("#demo-tracking-button");
const demoTrackingOutput = document.querySelector("#demo-tracking-output code");
const revealTargets = document.querySelectorAll(".section-shell, .signal-band");
const sectionLinks = Array.from(navLinks).filter((link) => {
  const href = link.getAttribute("href");
  return href && href.startsWith("#") && document.querySelector(href);
});

window.dataLayer = window.dataLayer || [];

let selectedCategory = "Tutti";
let hasInteractedWithArticles = false;
let keywordIndex = 0;
const mobileNavBreakpoint = 820;

function pushTrackingEvent(eventName, payload = {}) {
  window.dataLayer.push({
    event: eventName,
    page_type: "homepage",
    timestamp: new Date().toISOString(),
    ...payload
  });
}

function getCategories() {
  return ["Tutti", ...new Set(articles.map((article) => article.category))];
}

function normalizeText(value) {
  return value.trim().toLowerCase();
}

function articleMatchesSearch(article, query) {
  const searchableText = `${article.title} ${article.category} ${article.description}`;
  return normalizeText(searchableText).includes(query);
}

function renderCategoryFilters() {
  if (!filterContainer) {
    return;
  }

  filterContainer.innerHTML = getCategories()
    .map(
      (category) => `
        <button class="filter-button" type="button" data-category="${category}" aria-pressed="${category === selectedCategory}">
          ${category}
        </button>
      `
    )
    .join("");
}

function renderArticles() {
  if (!articleGrid || !searchInput || !sortInput || !emptyState) {
    return;
  }

  const query = normalizeText(searchInput.value);
  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === "Tutti" || article.category === selectedCategory;
    return matchesCategory && articleMatchesSearch(article, query);
  });

  const sortedArticles = [...filteredArticles].sort((first, second) => {
    const sortMode = sortInput.value;
    if (sortMode === "title") {
      return first.title.localeCompare(second.title);
    }
    if (sortMode === "category") {
      return first.category.localeCompare(second.category);
    }
    if (sortMode === "readingTime") {
      return parseInt(first.readingTime, 10) - parseInt(second.readingTime, 10);
    }
    return articles.indexOf(first) - articles.indexOf(second);
  });

  articleGrid.innerHTML = sortedArticles
    .map((article) => {
      const isStaticArticle = [
        "checklist-qa-adobe-target",
        "primary-metric-ab-test",
        "mutationobserver-adobe-target"
      ].includes(article.slug);
      const href = isStaticArticle ? `/articles/${article.slug}.html` : "#articles";

      return `
        <article class="article-card" data-status="${article.status}">
          <div class="article-meta">
            <span class="pill">${article.category}</span>
            <span>${article.readingTime}</span>
            <span>${article.status}</span>
          </div>
          <h3>${article.title}</h3>
          <p>${article.description}</p>
          <a href="${href}" data-article-slug="${article.slug}" aria-label="Leggi ${article.title}">Leggi nota</a>
        </article>
      `;
    })
    .join("");

  emptyState.hidden = sortedArticles.length > 0 || !hasInteractedWithArticles;
}

function rotateKeyword() {
  if (!rotatingKeyword) {
    return;
  }

  rotatingKeyword.classList.add("is-changing");

  window.setTimeout(() => {
    keywordIndex = (keywordIndex + 1) % rotatingKeywords.length;
    rotatingKeyword.textContent = rotatingKeywords[keywordIndex];
    rotatingKeyword.classList.remove("is-changing");
  }, 220);
}

function renderDemoTrackingEvent() {
  if (!demoTrackingOutput) {
    return;
  }

  const payload = {
    event: "cta_click",
    area: "homepage_hero",
    label: "Simula click CTA"
  };

  pushTrackingEvent(payload.event, payload);
  demoTrackingOutput.textContent = `dataLayer.push(${JSON.stringify(payload, null, 2)});`;
}

function initRevealOnScroll() {
  if (!revealTargets.length || !window.IntersectionObserver) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealTargets.forEach((target) => {
    target.classList.add("reveal-on-scroll");
    observer.observe(target);
  });
}

function updateScrollProgress() {
  if (!progressBar) {
    return;
  }

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
}

function updateHeaderState() {
  if (!siteHeader) {
    return;
  }

  siteHeader.classList.toggle("is-scrolled", window.scrollY > 56);
}

function initHeroOrbitParallax() {
  if (!heroOrbit) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (prefersReducedMotion || isCoarsePointer) {
    return;
  }

  heroOrbit.addEventListener("pointermove", (event) => {
    const bounds = heroOrbit.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    heroOrbit.style.setProperty("--orbit-shift-x", `${(x * 14).toFixed(2)}px`);
    heroOrbit.style.setProperty("--orbit-shift-y", `${(y * 14).toFixed(2)}px`);
  });

  heroOrbit.addEventListener("pointerleave", () => {
    heroOrbit.style.setProperty("--orbit-shift-x", "0px");
    heroOrbit.style.setProperty("--orbit-shift-y", "0px");
  });
}

function closeMobileNav() {
  if (!siteHeader || !navMenuToggle) {
    return;
  }

  siteHeader.classList.remove("is-open");
  document.body.classList.remove("nav-lock");
  navMenuToggle.setAttribute("aria-expanded", "false");
  navMenuToggle.setAttribute("aria-label", "Apri menu");
}

function toggleMobileNav() {
  if (!siteHeader || !navMenuToggle) {
    return;
  }

  const isOpen = siteHeader.classList.toggle("is-open");
  document.body.classList.toggle("nav-lock", isOpen);
  navMenuToggle.setAttribute("aria-expanded", String(isOpen));
  navMenuToggle.setAttribute("aria-label", isOpen ? "Chiudi menu" : "Apri menu");
}

function closeMobileNavAboveBreakpoint() {
  if (window.innerWidth > mobileNavBreakpoint) {
    closeMobileNav();
  }
}

function setActiveNavLink() {
  const scrollPosition = window.scrollY + 150;
  let activeId = "";

  sectionLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section && section.offsetTop <= scrollPosition) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", Boolean(activeId) && link.getAttribute("href") === `#${activeId}`);
  });
}

function initNavigation() {
  if (navMenuToggle) {
    navMenuToggle.addEventListener("click", toggleMobileNav);
  }

  sectionLinks.forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileNav();
    }
  });

  window.addEventListener("resize", closeMobileNavAboveBreakpoint);

  setActiveNavLink();
  updateHeaderState();
}

if (filterContainer) {
  filterContainer.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) {
      return;
    }

    selectedCategory = button.dataset.category;
    hasInteractedWithArticles = true;
    renderCategoryFilters();
    renderArticles();
    pushTrackingEvent("article_filter_click", { filter_category: selectedCategory });
  });
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    hasInteractedWithArticles = true;
    renderArticles();
    pushTrackingEvent("article_search", { search_term: searchInput.value });
  });
}

if (sortInput) {
  sortInput.addEventListener("change", () => {
    hasInteractedWithArticles = true;
    renderArticles();
    pushTrackingEvent("article_sort_change", { sort_mode: sortInput.value });
  });
}

document.addEventListener("click", (event) => {
  const trackedElement = event.target.closest("[data-track], [data-article-slug]");
  if (!trackedElement) {
    return;
  }

  pushTrackingEvent("interaction_click", {
    element_id: trackedElement.dataset.track || "article_link",
    article_slug: trackedElement.dataset.articleSlug || undefined
  });
});

if (demoTrackingButton) {
  demoTrackingButton.addEventListener("click", renderDemoTrackingEvent);
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("scroll", setActiveNavLink, { passive: true });
window.addEventListener("scroll", updateHeaderState, { passive: true });
window.addEventListener("resize", setActiveNavLink);
setInterval(rotateKeyword, 3800);

initNavigation();
initHeroOrbitParallax();
initRevealOnScroll();
renderCategoryFilters();
renderArticles();
updateScrollProgress();
pushTrackingEvent("page_view");
