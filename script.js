const PROXY_URL = 'https://bytebento-proxy.tough-bed6922.workers.dev';
const newsContainer = document.getElementById('news-container');

async function fetchNews() {
  try {
    console.log('Fetching from proxy:', PROXY_URL);

    const response = await fetch(PROXY_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response from proxy:', data);

    // ✅ We now trust that data.articles is legit
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

fetchNews();
