const TECHMEME_URL = 'https://bytebento-techmeme-worker.tough-bed6922.workers.dev';
const VERGE_URL = 'https://bytebento-verge-worker.tough-bed6922.workers.dev';
const FALLBACK_IMAGE = '/assets/fallback.jpg'; // Make sure this path matches your project

window.onload = () => {
  const newsContainer = document.getElementById('news-container');

  async function fetchNews() {
    try {
      newsContainer.innerHTML = '<p>Loading fresh articles...</p>';
      console.log('Fetching from Techmeme:', TECHMEME_URL);
      console.log('Fetching from The Verge:', VERGE_URL);

      const [techmemeRes, vergeRes] = await Promise.all([
        fetch(TECHMEME_URL).then(res => res.json()),
        fetch(VERGE_URL).then(res => res.json())
      ]);

      const articles = [...(techmemeRes.articles || []), ...(vergeRes.articles || [])];

      if (articles.length === 0) {
        newsContainer.innerHTML = '<p>No articles found at the moment. 🕵️‍♀️</p>';
        return;
      }

      articles.sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first
      displayNews(articles);

      const stampEl = document.getElementById('last-updated');
      if (stampEl) {
        stampEl.textContent = `🕒 Last updated: ${new Date().toLocaleString()}`;
      }

    } catch (error) {
      console.error('Error fetching news:', error);
      newsContainer.innerHTML = `<p>🚫 Failed to load news articles.</p>`;
    }
  }

  function isValidImage(url) {
    return url && /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  }

  function displayNews(articles) {
    newsContainer.innerHTML = '';
    articles.forEach(article => {
      const imageUrl = isValidImage(article.thumbnail) ? article.thumbnail : FALLBACK_IMAGE;
      const formattedDate = article.date ? new Date(article.date).toLocaleString() : '';
      const cleanTitle = article.title.replace(/[-|–—]\s*(Techmeme|The Verge)$/i, '').trim();

      const newsItem = document.createElement('article');
      newsItem.innerHTML = `
        <h2><a href="${article.url}" target="_blank">${cleanTitle}</a></h2>
        <img src="${imageUrl}" alt="Article image" />
        <p class="meta">📍 ${article.source || 'Unknown Source'} ${formattedDate ? `| ⏰ ${formattedDate}` : ''}</p>
        <button class="save-btn" data-url="${article.url}" data-title="${cleanTitle}" data-description="">⭐ Read Later</button>
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

  // Refresh button
  document.getElementById('refresh-btn')?.addEventListener('click', fetchNews);

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

  // Toggle Saved Articles
  const toggleBtn = document.getElementById('toggle-saved');
  const savedContainer = document.getElementById('saved-container');
  const toggleIcon = document.getElementById('toggle-icon');
  if (toggleBtn && savedContainer) {
    toggleBtn.addEventListener('click', () => {
      savedContainer.classList.toggle('collapsed');
      toggleIcon.textContent = savedContainer.classList.contains('collapsed') ? '▼' : '▲';
    });
  }

  // Auto-refresh every 10 min
  setInterval(fetchNews, 10 * 60 * 1000);

  // Start things up
  fetchNews();
  renderSavedArticles();
};
