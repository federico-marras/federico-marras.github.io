const articles = [
  {
    title: "Checklist QA per Adobe Target prima del go-live",
    category: "QA",
    description:
      "Una checklist pratica per validare audience, varianti, tracking e fallback prima di attivare un esperimento.",
    readingTime: "7 min",
    slug: "checklist-qa-adobe-target"
  },
  {
    title: "Come scegliere la primary metric in un A/B test",
    category: "Experimentation",
    description:
      "Un metodo essenziale per scegliere una metrica primaria che rappresenti il comportamento utente e non solo il rumore.",
    readingTime: "6 min",
    slug: "primary-metric-ab-test"
  },
  {
    title: "MutationObserver con Adobe Target su pagine dinamiche",
    category: "JavaScript",
    description:
      "Quando il DOM cambia dopo il caricamento, MutationObserver aiuta a rendere le modifiche piu robuste e controllabili.",
    readingTime: "8 min",
    slug: "mutationobserver-adobe-target"
  }
];

const articleGrid = document.querySelector("#articles-grid");
const searchInput = document.querySelector("#article-search");
const filterContainer = document.querySelector("#category-filters");
const emptyState = document.querySelector("#empty-state");
const currentYear = document.querySelector("#current-year");

let selectedCategory = "Tutti";

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
    .map(
      (article) => `
        <article class="article-card">
          <div class="article-meta">
            <span class="pill">${article.category}</span>
            <span>${article.readingTime}</span>
          </div>
          <h3>${article.title}</h3>
          <p>${article.description}</p>
          <a href="articles/${article.slug}.html" aria-label="Leggi ${article.title}">Leggi articolo</a>
        </article>
      `
    )
    .join("");

  emptyState.hidden = filteredArticles.length > 0;
}

filterContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) {
    return;
  }

  selectedCategory = button.dataset.category;
  renderCategoryFilters();
  renderArticles();
});

searchInput.addEventListener("input", renderArticles);

currentYear.textContent = new Date().getFullYear();
renderCategoryFilters();
renderArticles();
