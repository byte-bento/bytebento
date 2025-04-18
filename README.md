# ByteBento 🍱

![Project Type](https://img.shields.io/badge/type-project-blue)
![Platform](https://img.shields.io/badge/platform-Cloudflare%20Workers-black)
![Hosting](https://img.shields.io/badge/hosting-Cloudflare-orange)
![Focus](https://img.shields.io/badge/focus-tech%20news-9cf)
![Interface](https://img.shields.io/badge/interface-frontend--only-lightgrey)
![Architecture](https://img.shields.io/badge/architecture-serverless-yellow)
![Difficulty](https://img.shields.io/badge/difficulty-self--taught-success)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen)
![Built With](https://img.shields.io/badge/built%20with-curiosity%20%26%20caffeine-ff69b4)

A real-time tech news dashboard powered by Cloudflare Workers. ByteBento aggregates headlines from top tech sources, filters them by publisher, and lets users save articles to read later — all through a fast, minimalist interface.

## 🌐 Live Site
[https://bytebento.com](https://bytebento.com)

## 🔍 Why I Built It

I wanted a fast, distraction-free way to browse tech news - without bouncing between tabs or dealing with ad-ridden feeds. ByteBento started as a learning project to explore Cloudflare Workers and ended up becoming my go-to dashboard for checking tech world news in one place.

It’s lightweight, serverless, and doesn’t use a single framework - just readable code and clean design.

## 🛠 Tech Stack

🌀 **Hosted entirely via Cloudflare Workers** – combines serverless API logic and static content delivery in a single deployment.

- **Cloudflare Workers** – serverless API fetching, routing, and frontend delivery  
- **JavaScript (vanilla)** – no frameworks, just focused DOM handling  
- **HTML/CSS** – custom styles, dark mode support, and flexible layout  
- **LocalStorage** – save “read later” articles with export functionality  
- **GitHub** – version control and issue tracking

📌 No frameworks. No build step. Just clean, readable JavaScript and Cloudflare magic.

## ✨ Features
- 📰 Pulls real-time tech headlines from multiple trusted sources
- 🎛 Source filtering so you can zero in on what matters
- 💾 “Read Later” list with export/download option
- 🌙 Clean, minimalist layout with dark mode styling
- 🔁 Graceful fallback handling if a source is down
- ⚡️ Fast load times thanks to serverless architecture and no frameworks

## 🧭 Planned Features

These features are in the works or on the roadmap - tracked over on the [GitHub Issues page](https://github.com/johnnyfivepi/bytebento/issues):

- 🔍 Live search to filter articles by keyword
- 🧵 Add more tech news sources (including RSS-based ones)
- 📷 Smarter handling of article images and preview thumbnails
- 💡 Source-based color tags for visual clarity
- 🧹 “Clear All” and “Export Saved” buttons for Read Later
- ⏱ Optional auto-refresh every 10 minutes
- 📝 About page or mini changelog to track progress

## 🤝 Contributing

Want to improve ByteBento or suggest a new feature? Awesome!

- Check out [open issues](https://github.com/johnnyfivepi/bytebento/issues) or [start a new one](https://github.com/johnnyfivepi/bytebento/issues/new)
- Bug reports, UI suggestions, and tech news source ideas are all welcome
- If you're fixing a bug or adding a feature, feel free to fork the repo and submit a pull request

🪄 Whether it’s code, docs, or just ideas - contributions of all kinds are appreciated!

## 📁 Repo Structure
<pre>/workers → Cloudflare Worker scripts
/src → Static site content
/scripts → Utility tools (RSS parsing, filtering, etc.)</pre>

## 🧠 What I Learned
- Cloudflare Workers architecture + routing
- CORS debugging and failover handling
- Building readable, minimalist interfaces with pure JS
- Async design and user-friendly save/export patterns

## 📄 License

This project is licensed under the [MIT License](LICENSE).  
You're free to use, share, and remix - just give credit where it’s due.

---

_Made with caffeine, curiosity, and the Cloudflare edge ☕_


