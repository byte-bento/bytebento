const ENDPOINTS = [
  "https://bytebento-techmeme-worker.tough-bed6922.workers.dev",
  "https://bytebento-verge-worker.tough-bed6922.workers.dev",
  "https://dawn-forest-65f6.tough-bed6922.workers.dev", // Ars Technica
];

const FALLBACK_IMAGE = "./assets/fallback.jpg";

window.onload = () => {
  const newsContainer = document.getElementById("news-container");

  async function fetchNews() {
    newsContainer.innerHTML = "<p>Loading fresh articles...</p>";
    console.log("ByteBento script.js loaded – merging multiple sources");

    try {
      const allResponses = await Promise.allSettled(
        ENDPOINTS.map((url) => fetch(url).then((r) => r.json()))
      );

      const allArticles = allResponses
        .filter((res) => res.status === "fulfilled" && res.value.status === "ok")
        .flatMap((res) => res.value.articles || []);

      if (allArticles.length === 0) {
        newsContainer.innerHTML = "<p>No articles found at the moment.</p>";
        return;
      }

      // Sort articles by date (newest first)
      const sorted = allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
      displayNews(sorted);

      const stampEl = document.getElementById("last-updated");
      if (stampEl) {
        stampEl.textContent = `🕒 Last updated: ${new Date().toLocaleString()}`;
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      newsContainer.innerHTML = "<p>⚠️ Failed to load news articles.</p>";
    }
  }

  function isValidImage(url) {
    return url && /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  }

  function displayNews(articles) {
    newsContainer.innerHTML = "";
    articles.forEach((article) => {
      const imageUrl = isValidImage(article.thumbnail) ? article.thumbnail : FALLBACK_IMAGE;
      const dateStr = article.date ? new Date(article.date).toLocaleString() : "";
      const sourceStr = article.source || "Unknown Source";

      const newsItem = document.createElement("article");
      newsItem.innerHTML = `
        <h2><a href="${article.url}" target="_blank" rel="noopener">${article.title}</a></h2>
        <img src="${imageUrl}" alt="Article thumbnail" />
        <p><strong>📍 ${sourceStr}</strong> | <span>⏰ ${dateStr}</span></p>
        <button class="save-btn" data-url="${article.url}" data-title="${article.title}" data-description="">⭐ Read Later</button>
      `;
      newsContainer.appendChild(newsItem);
    });

    document.querySelectorAll(".save-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const url = btn.getAttribute("data-url");
        const title = btn.getAttribute("data-title");
        const description = btn.getAttribute("data-description");
        const saved = JSON.parse(localStorage.getItem("savedArticles") || "[]");

        if (!saved.some((a) => a.url === url)) {
          saved.push({ title, url, description });
          localStorage.setItem("savedArticles", JSON.stringify(saved));
          alert("Article saved!");
          renderSavedArticles();
        } else {
          alert("Already saved!");
        }
      });
    });
  }

  function renderSavedArticles() {
    const savedContainer = document.getElementById("saved-container");
    if (!savedContainer) return;

    const saved = JSON.parse(localStorage.getItem("savedArticles") || "[]");
    savedContainer.innerHTML = "";

    saved.forEach((article) => {
      const item = document.createElement("article");
      item.innerHTML = `
        <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
        <p>${article.description || ""}</p>
      `;
      savedContainer.appendChild(item);
    });
  }

  document.getElementById("refresh-btn")?.addEventListener("click", fetchNews);

  const themeSwitch = document.getElementById("theme-switch");
  if (themeSwitch) {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
      themeSwitch.checked = true;
    }

    themeSwitch.addEventListener("change", () => {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("theme", themeSwitch.checked ? "dark" : "light");
    });
  }

  setInterval(fetchNews, 10 * 60 * 1000); // Auto-refresh every 10 minutes

  const toggleBtn = document.getElementById("toggle-saved");
  const savedContainer = document.getElementById("saved-container");
  const toggleIcon = document.getElementById("toggle-icon");

  if (toggleBtn && savedContainer) {
    toggleBtn.addEventListener("click", () => {
      savedContainer.classList.toggle("collapsed");
      toggleIcon.textContent = savedContainer.classList.contains("collapsed") ? "▼" : "▲";
    });
  }

  fetchNews();
  renderSavedArticles();
};
