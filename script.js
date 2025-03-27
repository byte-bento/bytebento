const PROXY_URL = 'https://bytebento-techmeme-worker.tough-bed6922.workers.dev';
const FALLBACK_IMAGE = './assets/fallback.jpg';

window.onload = () => {
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
      newsContainer.innerHTML = `<p>❌ Error loading news. Please try again later.</p>`;
    }
  }

  function isValidImage(url) {
    return url && /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  }

  function formatDate(timestamp) {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return '';
    }
  }

  function cleanHeadline(title) {
    return title.replace(/\s*\(([^)]+\/[^)]+)\)$/, '');
  }

  function extractSource(title) {
    const match = title.match(/\(([^)]+\/[^)]+)\)$/);
    return match ? match[1] : '';
  }

  function displayNews(articles) {
    newsContainer.innerHTML = '';
    articles.forEach(article => {
      const imageUrl = isValidImage(article.thumbnail) ? article.thumbnail : FALLBACK_IMAGE;
      const title = cleanHeadline(article.title || '');
      const source = extractSource(article.title || '');
      const time = article.publishedAt ? formatDate(article.publishedAt) : '';

      const newsItem = document.createElement('article');
      newsItem.innerHTML = `
        <h2><a href="${article.url}" target="_blank">${title}</a></h2>
        <img src="${imageUrl}" alt="Article image" />
        ${source ? `<p><strong>Source:</strong> ${source}</p>` : ''}
        ${time ? `<p><strong>Published:</strong> ${time}</p>` : ''}
        <button class="save-btn" data-url="${article.url}" data-title="${title}" data-description="">⭐ Read Later</button>
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

  setInterval(fetchNews, 10 * 60 * 1000);

  const toggleBtn = document.getElementById('toggle-saved');
  const savedContainer = document.getElementById('saved-container');
  const toggleIcon = document.getElementById('toggle-icon');
  if (toggleBtn && savedContainer) {
    toggleBtn.addEventListener('click', () => {
      savedContainer.classList.toggle('collapsed');
      toggleIcon.textContent = savedContainer.classList.contains('collapsed') ? '▼' : '▲';
    });
  }

  fetchNews();
  renderSavedArticles();
};
