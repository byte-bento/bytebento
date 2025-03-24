const PROXY_URL = 'https://bytebento-proxy.tough-bed6922.workers.dev';

window.onload = () => {
  const newsContainer = document.getElementById('news-container');

  // Set last updated timestamp
  const timestamp = new Date().toLocaleString();
  const stampEl = document.getElementById('last-updated');
  if (stampEl) {
    stampEl.textContent = `🕒 Last updated: ${timestamp}`;
  }

  // Fetch and display news
  async function fetchNews() {
    try {
      console.log('Fetching from proxy:', PROXY_URL);

      const response = await fetch(PROXY_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response from proxy:', data);

      displayNews(data.articles);
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
      `;
      newsContainer.appendChild(newsItem);
    });
  }

  // 🟦 Add event listener for Refresh News button
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      fetchNews();
    });
  }

  fetchNews();
};
