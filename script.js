const SOURCES = [
  { name: "Techmeme", url: "https://bytebento-techmeme-worker.tough-bed6922.workers.dev" },
  { name: "Ars Technica", url: "https://bytebento-ars-worker.tough-bed6922.workers.dev" },
  { name: "Hacker News", url: "https://bytebento-hn-worker.tough-bed6922.workers.dev" },
  { name: "Product Hunt", url: "https://bytebento-ph-worker.tough-bed6922.workers.dev" },
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
      if (!allArticles.length) {
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

      // Article card
      const newsItem = document.createElement('article');

      // Title
      const title = document.createElement('h2');
      title.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;

      // Badge
      const badge = document.createElement('span');
      badge.classList.add('source-badge');
      badge.textContent = source;

      // Source-based color class for badge
      const sourceClass = {
        'Techmeme': 'source-techmeme',
        'Ars Technica': 'source-arstechnica',
        'Hacker News': 'source-hackernews',
        'Product Hunt': 'source-producthunt'
      }[source];
      if (sourceClass) badge.classList.add(sourceClass);

      // Info paragraph (hidden in regular mode, shown in Focus Mode)
      const info = document.createElement('p');
      info.innerHTML = `
        <strong class="info-source">${source}</strong>
        <span class="info-time">${timestamp}</span>
      `;
      if (sourceClass) info.classList.add(sourceClass);

      // Read Later button
      const saveBtn = document.createElement('button');
      saveBtn.classList.add('save-btn');
      saveBtn.setAttribute('data-url', article.url);
      saveBtn.setAttribute('data-title', article.title);
      saveBtn.setAttribute('data-description', '');
      saveBtn.setAttribute('data-source', article.source);
      saveBtn.setAttribute('data-date', article.date);
      saveBtn.textContent = '⭐ Read Later';

      // Build footer and append badge, info, button
      const footer = document.createElement('div');
      footer.classList.add('card-footer');
      footer.appendChild(badge);
      footer.appendChild(info);
      footer.appendChild(saveBtn);

      // Assemble card
      newsItem.appendChild(title);
      newsItem.appendChild(footer);
      newsContainer.appendChild(newsItem);
    });

    // Attach save handlers
    document.querySelectorAll('.save-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const url         = btn.dataset.url;
        const title       = btn.dataset.title;
        const description = btn.dataset.description;
        const source      = btn.dataset.source;
        const dateRaw     = btn.dataset.date;

        const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
        if (!saved.some(a => a.url === url)) {
          saved.push({ title, url, description, source, dateRaw });
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
    document.querySelectorAll('#filter-buttons button').forEach(btn => {
      const source = btn.dataset.source;
      const filtered = source === 'All'
        ? allArticles
        : allArticles.filter(a => a.source === source);

      btn.addEventListener('click', () => displayNews(filtered));

      const sourceClass = {
        'Techmeme': 'source-techmeme',
        'Ars Technica': 'source-arstechnica',
        'Hacker News': 'source-hackernews',
        'Product Hunt': 'source-producthunt'
      }[source];

      btn.classList.add('filter-btn');
      if (sourceClass) btn.classList.add(sourceClass);
    });
  }

  function renderSavedArticles() {
    const savedContainer = document.getElementById('saved-container');
    if (!savedContainer) return;

    const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    savedContainer.innerHTML = '';

    saved.forEach(article => {
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
      document.body.classList.toggle('focus-mode');
      localStorage.setItem('focus', focusSwitch.checked ? 'on' : 'off');
    });
  }

  // Saved Articles toggle/collapse handlers remain unchanged...

  setInterval(fetchNews, 10 * 60 * 1000);
  fetchNews();
  renderSavedArticles();
};
