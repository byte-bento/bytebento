const SOURCES = [
  {
    name: "Techmeme",
    url: "https://bytebento-techmeme-worker.tough-bed6922.workers.dev",
  },
  {
    name: "Ars Technica",
    url: "https://bytebento-ars-worker.tough-bed6922.workers.dev",
  },
  {
    name: "Hacker News",
    url: "https://bytebento-hn-worker.tough-bed6922.workers.dev",
  },
  {
    name: "Product Hunt",
    url: "https://bytebento-ph-worker.tough-bed6922.workers.dev",
  }
];

window.onload = () => {
  const newsContainer = document.getElementById('news-container');

  async function fetchNews() {
    console.info("📰 Fetching from sources...");
    newsContainer.innerHTML = '<p>Loading fresh articles...</p>';

    try {
      const results = await Promise.all(
        SOURCES.map(async (source) => {
          try {
            const res = await fetch(source.url);
            const json = await res.json();
            if (json.status === 'ok') {
              console.log(`✅ ${source.name} returned ${json.articles.length} articles`);
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

      allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
      displayNews(allArticles);
      setupFilterButtons(allArticles);

      const stampEl = document.getElementById('last-updated');
      if (stampEl) {
        stampEl.textContent = `🕒 Last updated: ${new Date().toLocaleString()}`;
      }
    } catch (err) {
      console.error("💥 Unexpected error:", err);
      newsContainer.innerHTML = '<p>Something went wrong. Please try again later.</p>';
    }
  }

  function displayNews(articles) {
    newsContainer.innerHTML = '';
    articles.forEach(article => {
      const timestamp = article.date ? new Date(article.date).toLocaleString() : '';
      const source = article.source || 'Unknown';

      const newsItem = document.createElement('article');

      const title = document.createElement('h2');
      title.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;

      const badge = document.createElement('span');
      badge.classList.add('source-badge');
      badge.textContent = source;

      const sourceClass = {
        'Techmeme': 'source-techmeme',
        'Ars Technica': 'source-arstechnica',
        'Hacker News': 'source-hackernews',
        'Product Hunt': 'source-producthunt'
      }[source];

      if (sourceClass) badge.classList.add(sourceClass);

      const info = document.createElement('p');
      info.innerHTML = `
        <strong class="info-source">${source}</strong>
        <span class="info-time">${timestamp}</span>
      `;
      // give the <p> the same source-class so we can color it
      if (sourceClass) {
      info.classList.add(sourceClass);
      }

      const saveBtn = document.createElement('button');
      saveBtn.classList.add('save-btn');
      saveBtn.setAttribute('data-url', article.url);
      saveBtn.setAttribute('data-title', article.title);
      saveBtn.setAttribute('data-description', '');
      saveBtn.setAttribute('data-source', article.source);
      saveBtn.setAttribute('data-date', article.date);
      saveBtn.textContent = '⭐ Read Later';

      newsItem.appendChild(title);
      newsItem.appendChild(badge);
      newsItem.appendChild(info);
      newsItem.appendChild(saveBtn);
      newsContainer.appendChild(newsItem);
    });

    const saveButtons = document.querySelectorAll('.save-btn');
    saveButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-url');
        const title = btn.getAttribute('data-title');
        const description = btn.getAttribute('data-description');
        const source = btn.getAttribute('data-source');
        const dateRaw = btn.getAttribute('data-date');

        const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
        if (!saved.some(article => article.url === url)) {
          saved.push({ title, url, description, source, dateRaw  });
          localStorage.setItem('savedArticles', JSON.stringify(saved));
          alert('Article saved to read later!');
          renderSavedArticles();
        } else {
          alert('Already saved!');
        }
      });
    });
  }

  function setupFilterButtons(allArticles) {
    const filterButtons = document.querySelectorAll('#filter-buttons button');
    filterButtons.forEach(btn => {
      const source = btn.getAttribute('data-source');
      const filtered = source === 'All' ? allArticles : allArticles.filter(a => a.source === source);

      btn.addEventListener('click', () => {
        displayNews(filtered);
      });

      const sourceClass = {
        'Techmeme': 'source-techmeme',
        'Ars Technica': 'source-arstechnica',
        'Hacker News': 'source-hackernews',
        'Product Hunt': 'source-producthunt'
      }[source];

      if (sourceClass) {
        btn.classList.add('filter-btn', sourceClass);
      } else {
        btn.classList.add('filter-btn');
      }
    });
  }

function renderSavedArticles() {
  const savedContainer = document.getElementById('saved-container');
  if (!savedContainer) return;

  const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
  savedContainer.innerHTML = '';

  saved.forEach(article => {
    // Format the raw date string
    const when = article.dateRaw
      ? new Date(article.dateRaw).toLocaleString()
      : '';

    const item = document.createElement('article');
    item.innerHTML = `
      <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
      <p><strong>${article.source}</strong> | 🕒 ${when}</p>
      ${article.description ? `<p>${article.description}</p>` : ''}
    `;
    savedContainer.appendChild(item);
  });
}

  document.getElementById('refresh-btn')?.addEventListener('click', fetchNews);

  // ── Dark Mode toggle ──
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

  // ── Focus Mode toggle ──
  const focusSwitch = document.getElementById('focus-switch');
  if (focusSwitch) {
    if (localStorage.getItem('focus') === 'on') {
      document.body.classList.add('focus-mode');
      focusSwitch.checked = true;
    }
    focusSwitch.addEventListener('change', () => {
      console.log("🔄 Focus switch changed – before:", document.body.classList.value);
      document.body.classList.toggle('focus-mode');
      console.log("🔄 Focus switch changed – after:", document.body.classList.value);
      localStorage.setItem('focus', focusSwitch.checked ? 'on' : 'off');
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

  const exportBtn = document.getElementById('export-saved');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
      if (saved.length === 0) {
        alert('No saved articles to export.');
        return;
      }
      const blob = new Blob([JSON.stringify(saved, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'saved-articles.json';
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  const clearBtn = document.getElementById('clear-saved');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all saved articles?')) {
        localStorage.removeItem('savedArticles');
        renderSavedArticles();
      }
    });
  }

  setInterval(fetchNews, 10 * 60 * 1000); // Auto-refresh every 10 minutes
  fetchNews();
  renderSavedArticles();

  document.querySelectorAll('a.affiliate-link').forEach(link => {
    link.addEventListener('click', () => {
      gtag('event', 'click', {
        event_category: 'Affiliate',
        event_label: link.href,
      });
    });
  });
};
