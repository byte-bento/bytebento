# ByteBento 🍱

A real-time tech news dashboard powered by Cloudflare Workers. ByteBento aggregates headlines from top tech sources, filters them by publisher, and lets users save articles to read later — all with a fast, minimalist interface.

## 🌐 Live Site
[https://bytebento.com](https://bytebento.com)

## 🔍 Why I Built It
I wanted a distraction-free way to check tech news headlines from multiple trusted sources in one place - and I used it as a learning project to explore Cloudflare Workers, fetch APIs, and structure readable UIs.

## 🛠 Tech Stack
- **Cloudflare Workers** – for serverless API fetching and routing
- **JavaScript (vanilla)** – no frameworks, just focused DOM handling
- **HTML/CSS** – custom styles, dark mode support, and flexible layout
- **LocalStorage** – to save “read later” articles with export support
- **GitHub** – version control and issue tracking

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
/workers → Cloudflare Worker scripts
/src → Static site content
/scripts → Utility tools (RSS parsing, filtering, etc.)
