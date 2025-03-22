const API_KEY = 'YOUR_NEWSAPI_KEY'; // Replace with your NewsAPI key
const newsContainer = document.getElementById('news-container');

async function fetchNews() {
  try {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=12&apiKey=${API_KEY}`);
    const data = await response.json();
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
