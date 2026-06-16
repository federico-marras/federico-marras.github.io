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
const themeToggle = document.querySelector("#theme-toggle");
const siteHeader = document.querySelector("#site-header");
const navMenuToggle = document.querySelector("#nav-menu-toggle");
const navLinks = document.querySelectorAll(".nav-link");
const rotatingKeyword = document.querySelector("#rotating-keyword");
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

  keywordIndex = (keywordIndex + 1) % rotatingKeywords.length;
  rotatingKeyword.textContent = rotatingKeywords[keywordIndex];
}

function renderDemoTrackingEvent() {
  const payload = {
    event: "cta_click",
    area: "homepage_hero",
    label: "Simula click CTA"
  };

  pushTrackingEvent(payload.event, payload);
  demoTrackingOutput.textContent = `dataLayer.push(${JSON.stringify(payload, null, 2)});`;
}

function initRevealOnScroll() {
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
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  localStorage.setItem("theme", theme);
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  applyTheme(savedTheme || "dark");
}

function closeMobileNav() {
  if (!siteHeader || !navMenuToggle) {
    return;
  }

  const icon = navMenuToggle.querySelector("span");
  siteHeader.classList.remove("is-open");
  navMenuToggle.setAttribute("aria-expanded", "false");
  navMenuToggle.setAttribute("aria-label", "Apri menu");
  if (icon) {
    icon.textContent = "☰";
  }
}

function toggleMobileNav() {
  if (!siteHeader || !navMenuToggle) {
    return;
  }

  const icon = navMenuToggle.querySelector("span");
  const isOpen = siteHeader.classList.toggle("is-open");
  navMenuToggle.setAttribute("aria-expanded", String(isOpen));
  navMenuToggle.setAttribute("aria-label", isOpen ? "Chiudi menu" : "Apri menu");
  if (icon) {
    icon.textContent = isOpen ? "×" : "☰";
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

  setActiveNavLink();
}

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

searchInput.addEventListener("input", () => {
  hasInteractedWithArticles = true;
  renderArticles();
  pushTrackingEvent("article_search", { search_term: searchInput.value });
});

sortInput.addEventListener("change", () => {
  hasInteractedWithArticles = true;
  renderArticles();
  pushTrackingEvent("article_sort_change", { sort_mode: sortInput.value });
});

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  pushTrackingEvent("theme_toggle", { theme: nextTheme });
});

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

demoTrackingButton.addEventListener("click", renderDemoTrackingEvent);

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("scroll", setActiveNavLink, { passive: true });
window.addEventListener("resize", setActiveNavLink);
setInterval(rotateKeyword, 2200);

initTheme();
initNavigation();
initRevealOnScroll();
renderCategoryFilters();
renderArticles();
updateScrollProgress();
pushTrackingEvent("page_view");
