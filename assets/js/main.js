const articles = [
  {
    title: "Checklist QA per un A/B test in Adobe Target",
    category: "Adobe Target",
    description:
      "Controlli essenziali su audience, experience, eventi analytics, fallback e comportamento responsive.",
    readingTime: "7 min",
    slug: "checklist-qa-adobe-target"
  },
  {
    title: "Come scegliere la primary metric di un esperimento",
    category: "CRO",
    description:
      "Un criterio pratico per collegare ipotesi, comportamento utente, metrica primaria e guardrail.",
    readingTime: "6 min",
    slug: "primary-metric-ab-test"
  },
  {
    title: "MutationObserver negli esperimenti Adobe Target",
    category: "JavaScript",
    description:
      "Come applicare experience su DOM che cambia dopo il caricamento, evitando loop e duplicazioni.",
    readingTime: "8 min",
    slug: "mutationobserver-adobe-target"
  },
  {
    title: "Tracking strategy: prima gli eventi, poi il report",
    category: "Tracking",
    description:
      "Note su naming, data layer, ownership e verifiche prima di affidare un esperimento ai dati.",
    readingTime: "5 min",
    slug: "tracking-strategy-eventi-report"
  },
  {
    title: "Adobe Data Collection: regole leggibili nel tempo",
    category: "Adobe Data Collection",
    description:
      "Una struttura mentale per mantenere regole, data elements e condizioni comprensibili anche mesi dopo.",
    readingTime: "6 min",
    slug: "adobe-data-collection-regole"
  },
  {
    title: "Sample ratio mismatch: segnali da non ignorare",
    category: "Analytics",
    description:
      "Perché controllare la distribuzione del traffico è utile prima di interpretare uplift e confidence.",
    readingTime: "4 min",
    slug: "sample-ratio-mismatch"
  }
];

const articleGrid = document.querySelector("#articles-grid");
const searchInput = document.querySelector("#article-search");
const filterContainer = document.querySelector("#category-filters");
const emptyState = document.querySelector("#empty-state");
const progressBar = document.querySelector("#scroll-progress");
const themeToggle = document.querySelector("#theme-toggle");

window.dataLayer = window.dataLayer || [];

let selectedCategory = "Tutti";
let hasInteractedWithArticles = false;

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

  articleGrid.innerHTML = filteredArticles
    .map((article) => {
      const isStaticArticle = [
        "checklist-qa-adobe-target",
        "primary-metric-ab-test",
        "mutationobserver-adobe-target"
      ].includes(article.slug);
      const href = isStaticArticle ? `/articles/${article.slug}.html` : "#articles";

      return `
        <article class="article-card">
          <div class="article-meta">
            <span class="pill">${article.category}</span>
            <span>${article.readingTime}</span>
          </div>
          <h3>${article.title}</h3>
          <p>${article.description}</p>
          <a href="${href}" data-article-slug="${article.slug}" aria-label="Leggi ${article.title}">Leggi nota</a>
        </article>
      `;
    })
    .join("");

  emptyState.hidden = filteredArticles.length > 0 || !hasInteractedWithArticles;
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
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));
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

window.addEventListener("scroll", updateScrollProgress, { passive: true });

initTheme();
renderCategoryFilters();
renderArticles();
updateScrollProgress();
pushTrackingEvent("page_view");
