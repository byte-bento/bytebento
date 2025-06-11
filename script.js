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
      const sourceClass = {
        'Techmeme': 'source-techmeme',
        'Ars Technica': 'source-arstechnica',
        'Hacker News': 'source-hackernews',
        'Product Hunt': 'source-producthunt'
      }[source];

      const newsItem = document.createElement('article');
      const title = document.createElement('h2');
      title.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
      newsItem.appendChild(title);

      if (document.body.classList.contains('focus-mode')) {
        const info = document.createElement('p');
        info.innerHTML = `
          <strong class="info-source">${source}</strong>
          <span class="info-time">${timestamp}</span>
        `;
        if (sourceClass) info.classList.add(sourceClass);
        newsItem.appendChild(info);

        const saveBtn = document.createElement('button');
        saveBtn.classList.add('save-btn');
        saveBtn.setAttribute('data-url', article.url);
        saveBtn.setAttribute('data-title', article.title);
        saveBtn.setAttribute('data-description', '');
        saveBtn.setAttribute('data-source', article.source);
        saveBtn.setAttribute('data-date', article.date);
        saveBtn.textContent = '⭐ Save';

        newsItem.appendChild(saveBtn);
        newsContainer.appendChild(newsItem);
        return;
      }

      const badge = document.createElement('span');
      badge.classList.add('source-badge');
      badge.textContent = source;
      if (sourceClass) badge.classList.add(sourceClass);

      const info = document.createElement('p');
      info.innerHTML = `
        <strong class="info-source">${source}</strong>
        <span class="info-time">${timestamp}</span>
      `;
      if (sourceClass) info.classList.add(sourceClass);

      const saveBtn = document.createElement('button');
      saveBtn.classList.add('save-btn');
      saveBtn.setAttribute('data-url', article.url);
      saveBtn.setAttribute('data-title', article.title);
      saveBtn.setAttribute('data-description', '');
      saveBtn.setAttribute('data-source', article.source);
      saveBtn.setAttribute('data-date', article.date);
      saveBtn.textContent = '⭐ Read Later';

      const footer = document.createElement('div');
      footer.classList.add('card-footer');
      footer.appendChild(badge);
      footer.appendChild(info);
      footer.appendChild(saveBtn);

      newsItem.appendChild(footer);
      newsContainer.appendChild(newsItem);
    });

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
          showToast('✅ Article saved to read later!');
          renderSavedArticles();
        } else {
          showToast('❌ Already saved!');
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
    const jumpContainer = document.getElementById('jump-to-saved-container');
    if (!savedContainer) return;

    const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    savedContainer.innerHTML = '';

    if (saved.length === 0) {
      if (jumpContainer) jumpContainer.style.display = 'none';
      return;
    }

    if (jumpContainer) jumpContainer.style.display = 'block';

    saved.forEach((article, index) => {
      const when = article.dateRaw
        ? new Date(article.dateRaw).toLocaleString()
        : '';
      const source = article.source || 'Unknown';

      const card = document.createElement('article');
      card.classList.add('saved-article');

      const title = document.createElement('h3');
      title.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;

      const info = document.createElement('p');
      info.innerHTML = `<strong>${source}</strong> | 🕒 ${when}`;

      const removeBtn = document.createElement('button');
      removeBtn.classList.add('remove-btn');
      removeBtn.setAttribute('data-index', index);
      removeBtn.textContent = '🗑 Remove';

      removeBtn.addEventListener('click', () => {
        const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
        saved.splice(index, 1);
        localStorage.setItem('savedArticles', JSON.stringify(saved));
        renderSavedArticles();
        showToast('🗑 Removed from saved articles');
      });

      card.appendChild(title);
      card.appendChild(info);
      card.appendChild(removeBtn);
      savedContainer.appendChild(card);
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

  const focusSwitch = document.getElementById('focus-switch');
  if (focusSwitch) {
    if (localStorage.getItem('focus') === 'on') {
      document.body.classList.add('focus-mode');
      focusSwitch.checked = true;
    }
    focusSwitch.addEventListener('change', () => {
      document.body.classList.toggle('focus-mode');
      localStorage.setItem('focus', focusSwitch.checked ? 'on' : 'off');
      fetchNews();
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

  setInterval(fetchNews, 10 * 60 * 1000);
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

  const jumpToSavedBtn = document.getElementById('jump-to-saved-btn');
  const savedArticlesSection = document.getElementById('saved-articles');
  if (jumpToSavedBtn && savedArticlesSection) {
    jumpToSavedBtn.addEventListener('click', () => {
      savedArticlesSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
};
