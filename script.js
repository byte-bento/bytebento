const PROXY_URL = 'https://bytebento-proxy.tough-bed6922.workers.dev';

window.onload = () => {
  const newsContainer = document.getElementById('news-container');

  async function fetchNews() {
    try {
      newsContainer.innerHTML = '<p>Loading fresh articles...</p>';
      console.log('Fetching from proxy:', PROXY_URL);

      const response = await fetch(PROXY_URL);
      const data = await response.json();

      // Check for NewsAPI rate limit error in response body
      if (data.status === 'error' && data.code === 'rateLimited') {
        newsContainer.innerHTML = '<p>🚫 Rate limit reached. News updates will resume soon!</p>';
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Response from proxy:', data);
      displayNews(data.articles);

      // ⏰ Update timestamp after fetch
      const stampEl = document.getElementById('last-updated');
      if (stampEl) {
        stampEl.textContent = `🕒 Last updated: ${new Date().toLocaleString()}`;
      }

    } catch (error) {
      console.error('Error fetching news:', error);
      let message = 'Failed to load news articles.';
      newsContainer.innerHTML = `<p>${message}</p>`;
    }
  }

  function displayNews(articles) {
    newsContainer.innerHTML = '';
    articles.forEach(article => {
      const newsItem = document.createElement('article');
      newsItem.innerHTML = `
        <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
        <img src="${article.urlToImage || ''}" alt="${article.title}" />
        <p>${article.description || ''}</p>
        <button class="save-btn" data-url="${article.url}" data-title="${article.title}" data-description="${article.description || ''}">⭐ Read Later</button>
      `;
      newsContainer.appendChild(newsItem);
    });

    // ⭐ Handle save buttons
    const saveButtons = document.querySelectorAll('.save-btn');
    saveButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-url');
        const title = btn.getAttribute('data-title');
        const description = btn.getAttribute('data-description');

        const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
        const exists = saved.some(article => article.url === url);
        if (!exists) {
          saved.push({ title, url, description });
          localStorage.setItem('savedArticles', JSON.stringify(saved));
          alert('Article saved!');
          renderSavedArticles(); // Update saved articles display
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

  // 🔄 Refresh button listener
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      fetchNews();
    });
  }

  // 🌓 Dark mode toggle logic
  const themeSwitch = document.getElementById('theme-switch');
  if (themeSwitch) {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
      themeSwitch.checked = true;
    }
    themeSwitch.addEventListener('change', () => {
      if (themeSwitch.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // ⏰ Auto-refresh news every 10 minutes
  setInterval(() => {
    console.log("⏰ Auto-refreshing news...");
    fetchNews();
  }, 10 * 60 * 1000); // 10 minutes

  // 📌 Toggle Saved Articles (Collapsible)
  const toggleBtn = document.getElementById('toggle-saved');
  const savedContainer = document.getElementById('saved-container');
  const toggleIcon = document.getElementById('toggle-icon');
  if (toggleBtn && savedContainer) {
    toggleBtn.addEventListener('click', () => {
      savedContainer.classList.toggle('collapsed');
      toggleIcon.textContent = savedContainer.classList.contains('collapsed') ? '▼' : '▲';
    });
  }

  // 🔃 Initial load: fetch news and render saved articles
  fetchNews();
  renderSavedArticles();
};
