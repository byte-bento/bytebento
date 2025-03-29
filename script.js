console.log("🚀 ByteBento script loaded!");

const SOURCES = [
  {
    name: "Techmeme",
    url: "https://bytebento-techmeme-worker.tough-bed6922.workers.dev",
  },
  
  {
    name: "Ars Technica",
    url: "https://bytebento-ars-worker.tough-bed6922.workers.dev",
  },
];

const FALLBACK_IMAGE = 'assets/fallback.jpg';

window.onload = () => {
  const newsContainer = document.getElementById('news-container');

  async function fetchNews() {
    console.info("📰 Fetching from sources...");
    newsContainer.innerHTML = '<p>Loading the latest tech news...</p>';

    try {
      const results = await Promise.all(
        SOURCES.map(async (source) => {
          try {
            const res = await fetch(source.url);
            const json = await res.json();
            if (json.status === 'ok') {
              console.log(`✅ ${source.name} returned ${json.articles.length} articles`);
              console.log(`${source.name} articles:`, json.articles);
              return json.articles;
            } else {
              throw new Error(json.message || 'Unknown error');
            }
          } catch (err) {
            console.error(`❌ Error fetching from ${source.url}:`, err);
            return [];
          }
        })
      );

      const allArticles = results.flat();
      if (allArticles.length === 0) {
        newsContainer.innerHTML = '<p>No articles available. Check back soon!</p>';
        return;
      }

      // Sort newest first
      allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
      displayNews(allArticles);

      const stampEl = document.getElementById('last-updated');
      if (stampEl) {
        stampEl.textContent = `🕒 Last updated: ${new Date().toLocaleString()}`;
      }
    } catch (err) {
      console.error("💥 Unexpected error:", err);
      newsContainer.innerHTML = '<p>Something went wrong. Please try again later.</p>';
    }
  }

  function isValidImage(url) {
    return url && /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  }

  function displayNews(articles) {
    newsContainer.innerHTML = '';
    articles.forEach(article => {
      const imageUrl = isValidImage(article.thumbnail) ? article.thumbnail : FALLBACK_IMAGE;
      const timestamp = article.date ? new Date(article.date).toLocaleString() : '';
      const source = article.source || 'Unknown';

      const newsItem = document.createElement('article');
      newsItem.innerHTML = `
        <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
        <img src="${imageUrl}" alt="Article image" />
        <p><strong>📍 ${source}</strong> | 🕒 ${timestamp}</p>
        <button class="save-btn" data-url="${article.url}" data-title="${article.title}" data-description="">⭐ Read Later</button>
      `;
      newsContainer.appendChild(newsItem);
    });

    const saveButtons = document.querySelectorAll('.save-btn');
    saveButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-url');
        const title = btn.getAttribute('data-title');
        const description = btn.getAttribute('data-description');

        const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
        if (!saved.some(article => article.url === url)) {
          saved.push({ title, url, description });
          localStorage.setItem('savedArticles', JSON.stringify(saved));
          alert('Article saved!');
          renderSavedArticles();
        } else {
          alert('Already saved!');
        }
      });
    });
  }

  function renderSavedArticles() {
    const savedContainer = document.getElementById('saved-container');
    if (!savedContainer) return;

    const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    savedContainer.innerHTML = '';

    saved.forEach(article => {
      const item = document.createElement('article');
      item.innerHTML = `
        <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
        <p>${article.description || ''}</p>
      `;
      savedContainer.appendChild(item);
    });
  }

  document.getElementById('refresh-btn')?.addEventListener('click', fetchNews);

  const themeSwitch = document.getElementById('theme-switch');
  if (themeSwitch) {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
      themeSwitch.checked = true;
    }
    themeSwitch.addEventListener('change', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', themeSwitch.checked ? 'dark' : 'light');
    });
  }

  const toggleBtn = document.getElementById('toggle-saved');
  const savedContainer = document.getElementById('saved-container');
  const toggleIcon = document.getElementById('toggle-icon');
  if (toggleBtn && savedContainer) {
    toggleBtn.addEventListener('click', () => {
      savedContainer.classList.toggle('collapsed');
      toggleIcon.textContent = savedContainer.classList.contains('collapsed') ? '▼' : '▲';
    });
  }

  setInterval(fetchNews, 10 * 60 * 1000); // auto-refresh every 10 minutes
  fetchNews();
  renderSavedArticles();
};
