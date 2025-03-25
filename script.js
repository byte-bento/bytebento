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

    // Attach click listeners to save buttons
    const saveButtons = document.querySelectorAll('.save-btn');
    saveButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const article = {
          url: btn.getAttribute('data-url'),
          title: btn.getAttribute('data-title'),
          description: btn.getAttribute('data-description')
        };

        // Get saved articles
        let saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');

        // Prevent duplicates
        if (!saved.some(a => a.url === article.url)) {
          saved.push(article);
          localStorage.setItem('savedArticles', JSON.stringify(saved));
          alert('✅ Saved for later!');
          displaySavedArticles(); // 🧠 REFRESH the Saved Articles display
        } else {
          alert('🔁 Already saved!');
        }
      });
    });
  }

  function displaySavedArticles() {
    const savedContainer = document.getElementById('saved-container');
    const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');

    if (!saved.length) {
      savedContainer.innerHTML = '<p>No saved articles yet.</p>';
      return;
    }

    savedContainer.innerHTML = '';
    saved.forEach(article => {
      const articleDiv = document.createElement('article');
      articleDiv.innerHTML = `
        <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
        <p>${article.description || ''}</p>
      `;
      savedContainer.appendChild(articleDiv);
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

  // 🔃 Initial load
  fetchNews();
  displaySavedArticles(); // Load saved articles on first visit
};
