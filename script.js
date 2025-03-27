const PROXY_URL = 'https://bytebento-techmeme-worker.tough-bed6922.workers.dev';
const FALLBACK_IMAGE = './assets/fallback.jpg'; // Relative path to fallback image

window.onload = () => {
  console.log('ByteBento script.js loaded – version with clean title + source under image');
  const newsContainer = document.getElementById('news-container');

  async function fetchNews() {
    try {
      newsContainer.innerHTML = '<p>Loading fresh articles...</p>';
      console.log('Fetching from Techmeme Worker:', PROXY_URL);

      const response = await fetch(PROXY_URL);
      const data = await response.json();
      console.log('Response from Worker:', data);

      if (!data.articles || data.articles.length === 0) {
        newsContainer.innerHTML = '<p>No articles found at the moment. 🕵️‍♀️</p>';
        return;
      }

      displayNews(data.articles);

      const stampEl = document.getElementById('last-updated');
      if (stampEl) {
        stampEl.textContent = `🕒 Last updated: ${new Date().toLocaleString()}`;
      }

    } catch (error) {
      console.error('Error fetching news:', error);
      newsContainer.innerHTML = `<p>⚠️ Failed to load news articles. Check console for details.</p>`;
    }
  }

  function isValidImage(url) {
    return url && /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  }

  function displayNews(articles) {
    newsContainer.innerHTML = '';
    articles.forEach(article => {
      const imageUrl = isValidImage(article.thumbnail) ? article.thumbnail : FALLBACK_IMAGE;

      const newsItem = document.createElement('article');
      newsItem.innerHTML = `
        <h2><a href="${article.url}" target="_blank">${cleanTitle(article.title)}</a></h2>
        <img src="${imageUrl}" alt="Article image" />
        <p><strong>Source:</strong> ${article.source || 'Unknown'}</p>
        <button class="save-btn" data-url="${article.url}" data-title="${article.title}" data-description="">⭐ Read Later</button>
      `;
      newsContainer.appendChild(newsItem);
    });

    document.querySelectorAll('.save-btn').forEach(btn => {
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

  function cleanTitle(title) {
    const match = title.match(/^(.*?)\s+\(([^)]+)\)$/);
    return match ? match[1] : title;
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

  // Refresh button
  document.getElementById('refresh-btn')?.addEventListener('click', fetchNews);

  // Export Saved Articles
  document.getElementById('export-saved')?.addEventListener('click', () => {
    const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    if (saved.length === 0) {
      alert('No saved articles to export.');
      return;
    }

    const blob = new Blob([JSON.stringify(saved, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `saved-articles-${new Date().toISOString()}.json`;
    a.click();

    URL.revokeObjectURL(url);
  });

  // Clear All Saved Articles
  document.getElementById('clear-saved')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all saved articles?')) {
      localStorage.removeItem('savedArticles');
      renderSavedArticles();
    }
  });

  // Dark mode toggle
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

  // Toggle Saved section
  const toggleBtn = document.getElementById('toggle-saved');
  const savedContainer = document.getElementById('saved-container');
  const toggleIcon = document.getElementById('toggle-icon');
  if (toggleBtn && savedContainer) {
    toggleBtn.addEventListener('click', () => {
      savedContainer.classList.toggle('collapsed');
      toggleIcon.textContent = savedContainer.classList.contains('collapsed') ? '▼' : '▲';
    });
  }

  // Kick things off
  fetchNews();
  renderSavedArticles();
};
