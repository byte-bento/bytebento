const ENDPOINTS = [
  "https://bytebento-techmeme-worker.tough-bed6922.workers.dev",
  "https://bytebento-verge-worker.tough-bed6922.workers.dev",
  "https://dawn-forest-65f6.tough-bed6922.workers.dev" // Ars Technica
];

const FALLBACK_IMAGE = "./assets/fallback.jpg";

window.onload = () => {
  const newsContainer = document.getElementById("news-container");

  async function fetchNews() {
    try {
      newsContainer.innerHTML = "<p>Loading fresh articles...</p>";
      console.log("🚀 Fetching from sources...");

      const allArticles = [];

      for (const url of ENDPOINTS) {
        console.log(`🌐 Trying to fetch from: ${url}`);
        try {
          const res = await fetch(url);
          const data = await res.json();
          console.log(`✅ Got response from ${url}:`, data);

          if (data.status === "ok" && Array.isArray(data.articles)) {
            allArticles.push(...data.articles);
          } else {
            console.warn(`⚠️ Invalid article structure from ${url}:`, data);
          }
        } catch (innerErr) {
          console.error(`❌ Fetch failed for ${url}:`, innerErr);
        }
      }

      console.log("📦 Total articles:", allArticles.length);
      if (allArticles.length === 0) {
        newsContainer.innerHTML =
          "<p>No articles found at the moment. 🕵️‍♀️</p>";
        return;
      }

      const sorted = allArticles.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      displayNews(sorted);

      const stampEl = document.getElementById("last-updated");
      if (stampEl) {
        stampEl.textContent = `🕒 Last updated: ${new Date().toLocaleString()}`;
      }
    } catch (error) {
      console.error("💥 Error in fetchNews():", error);
      newsContainer.innerHTML = `<p>🚨 Failed to load news articles.</p>`;
    }
  }

  function isValidImage(url) {
    return url && /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  }

  function displayNews(articles) {
    newsContainer.innerHTML = "";
    articles.forEach((article) => {
      const imageUrl = isValidImage(article.thumbnail)
        ? article.thumbnail
        : FALLBACK_IMAGE;

      const formattedDate = article.date
        ? new Date(article.date).toLocaleString()
        : "";

      const newsItem = document.createElement("article");
      newsItem.innerHTML = `
        <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
        <img src="${imageUrl}" alt="Article image" />
        <p><strong>📍 ${article.source || "Unknown"}</strong> ${
        formattedDate ? ` | ⏱ ${formattedDate}` : ""
      }</p>
        <button class="save-btn" data-url="${article.url}" data-title="${article.title}" data-description="">⭐ Read Later</button>
      `;
      newsContainer.appendChild(newsItem);
    });

    const saveButtons = document.querySelectorAll(".save-btn");
    saveButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const url = btn.getAttribute("data-url");
        const title = btn.getAttribute("data-title");
        const description = btn.getAttribute("data-description");

        const saved = JSON.parse(localStorage.getItem("savedArticles") || "[]");
        const exists = saved.some((article) => article.url === url);
        if (!exists) {
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

  setInterval(fetchNews, 10 * 60 * 1000);

  const toggleBtn = document.getElementById("toggle-saved");
  const savedContainer = document.getElementById("saved-container");
  const toggleIcon = document.getElementById("toggle-icon");
  if (toggleBtn && savedContainer) {
    toggleBtn.addEventListener("click", () => {
      savedContainer.classList.toggle("collapsed");
      toggleIcon.textContent = savedContainer.classList.contains("collapsed")
        ? "▼"
        : "▲";
    });
  }

  fetchNews();
  renderSavedArticles();
};
