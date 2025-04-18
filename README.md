# ByteBento 🍱

![Project Type](https://img.shields.io/badge/type-project-blue)
![Platform](https://img.shields.io/badge/platform-Cloudflare%20Workers-black)
![Hosting](https://img.shields.io/badge/hosting-Cloudflare-orange)
![Focus](https://img.shields.io/badge/focus-tech%20news-9cf)
![Interface](https://img.shields.io/badge/interface-frontend--only-lightgrey)
![Architecture](https://img.shields.io/badge/architecture-serverless-orange)
![Difficulty](https://img.shields.io/badge/difficulty-self--taught-success)
![Status](https://img.shields.io/badge/status-active-brightgreen)

A real-time tech news dashboard powered by Cloudflare Workers. ByteBento aggregates headlines from top tech sources, filters them by publisher, and lets users save articles to read later - all with a fast, minimalist interface.

## 🌐 Live Site
[https://bytebento.com](https://bytebento.com)

## 🔍 Why I Built It
I wanted a distraction-free way to check tech news headlines from multiple trusted sources in one place - and I used it as a learning project to explore Cloudflare Workers, fetch APIs, and structure readable UIs.

## 🛠 Tech Stack

🌀 **Hosted entirely via Cloudflare Workers** – combines serverless API logic and static content delivery in a single deployment.

- **Cloudflare Workers** – serverless API fetching, routing, and frontend delivery  
- **JavaScript (vanilla)** – no frameworks, just focused DOM handling  
- **HTML/CSS** – custom styles, dark mode support, and flexible layout  
- **LocalStorage** – save “read later” articles with export functionality  
- **GitHub** – version control and issue tracking

📌 No frameworks. No build step. Just clean, readable JavaScript and Cloudflare magic.

## ✨ Features
- Source filtering (e.g. Ars Technica, Hacker News, Techmeme)
- Read Later list with export/download option
- Responsive layout and dark mode styling
- CORS handling, error fallback, and graceful degradation

## 🚧 In Progress
- Adding more news sources
- RSS parsing and thumbnail cleanup
- Scheduled auto-refresh logic

## 📁 Repo Structure
<pre>/workers → Cloudflare Worker scripts
/src → Static site content
/scripts → Utility tools (RSS parsing, filtering, etc.)</pre>

## 🧠 What I Learned
- Cloudflare Workers architecture + routing
- CORS debugging and failover handling
- Building readable, minimalist interfaces with pure JS
- Async design and user-friendly save/export patterns
