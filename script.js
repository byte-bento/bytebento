const PROXY_URL = 'https://bytebento-proxy.tough-bed6922.workers.dev';

window.onload = () => {
  const newsContainer = document.getElementById('news-container');

  async function fetchNews() {
    try {
      newsContainer.innerHTML = '<p>Loading fresh articles...</p>';
      console.log('Fetching from proxy:', PROXY_URL);

      const response = await fetch(PROXY_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response from proxy:', data);

      displayNews(data.articles);

      // ⏰ Update timestamp after fetch
      const stampEl = document.getElementById('last-updated');
      if (stampEl) {
        stampEl.textContent = `🕒 Last updated: ${new Date().toLocaleString()}`;
      }

    } catch (error) {
      newsContainer.innerHTML = '<p>Failed to load news articles.</p>';
      console.error('Error fetching news:', error);
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
    // Load saved theme
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

  // 💾 Save to Read Later
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('save-btn')) {
      const url = e.target.getAttribute('data-url');
      const title = e.target.getAttribute('data-title');
      const description = e.target.getAttribute('data-description');

      const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');

      // Avoid duplicates
      if (!saved.find(article => article.url === url)) {
        saved.push({ url, title, description });
        localStorage.setItem('savedArticles', JSON.stringify(saved));
        alert('Saved for later!');
      } else {
        alert('Already saved!');
      }
    }
  });

  // ⏰ Auto-refresh news every 10 minutes
  setInterval(() => {
    console.log("⏰ Auto-refreshing news...");
    fetchNews();
  }, 10 * 60 * 1000); // 10 minutes

  // 🔃 Initial news load
  fetchNews();
};
