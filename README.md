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

**A fast, minimalist tech news aggregator powered by Cloudflare Workers.** ByteBento aggregates headlines in real-time from top tech sources, filters them by publisher, and lets users save articles to read later or export in JSON.

## 🌐 Live Site
🔗 [https://bytebento.com](https://bytebento.com)

## ✨ Features
- 📰 **Real-time headlines** from multiple tech sources (Ars Technica, Hacker News, Product Hunt, etc.)
- 🎛 **Source filtering** for quick focus
- 💾 **Read Later** list with **export/download** functionality
- 🌙 **Dark mode** & **Focus mode** for distraction-free reading
- 🔁 **Graceful fallbacks** if any source is down
- ⚡️ **Lightning-fast** serverless architecture

## 🛠 Tech Stack

🌀 **Hosted entirely via Cloudflare Workers** – combines serverless API logic and static content delivery in a single deployment.

- **Platform & Hosting:** Cloudflare Workers (API + static assets)
- **Language & Frameworks:** Vanilla JavaScript, HTML, CSS
- **Storage:** Browser LocalStorage
- **Version Control:** Git & GitHub
- **No frameworks, no build step** — just clean, readable code!

## 🏁 Getting Started

**Prerequisites**
- [Node.js](https://nodejs.org/en) (for local Worker simulation, optional)
- [Wrangler CLI](https://developers.cloudflare.com/workers/cli-wrangler/) (install instructions and CLI reference)
- A free [Cloudflare account](https://dash.cloudflare.com/sign-up) with Workers enabled

**Installation**

1. **Clone the repo**
  ```git clone https://github.com/byte-bento/bytebento.git
  cd bytebento```

2. **Install Wrangler (if not already)**
  ```npm install -g @cloudflare/wrangler```

**Development**
> You can preview the site and Workers locally using Wrangler.

```# Log into Cloudflare
wrangler login

# Simulate Workers + static assets locally
wrangler dev```

Open [http://127.0.0.1:8787](http://127.0.0.1:8787) in your browser to see live changes.

**Deployment**
Once you're happy with changes:
```# Publish to your Cloudflare account
wrangler publish```

---

## 🧭 Planned Features

These features are in the works or on the roadmap - tracked over on the [GitHub Issues](https://github.com/johnnyfivepi/bytebento/issues) page:

- 🔍 Live search to filter articles by keyword
- 🧵 Add more tech news sources (including RSS-based ones)
- 📝 About page or mini changelog to track progress

---

## 🤝 Contributing

Want to improve ByteBento or suggest a new feature? Awesome! We welcome all kinds of contributions! To get started:

1. **Fork** the repository
2. **Clone** your fork and create a new branch (git checkout -b feature/awesome-new-thing)
3. **Commit** your changes with descriptive messages
4. **Push** to your fork (```git push origin feature/awesome-new-thing```)
5. **Open a Pull Request** against ```main``` with a description of your changes

Please also:

- Review [existing issues](https://github.com/byte-bento/bytebento/issues) and add your thoughts
- Label any bugs you find or feature ideas you want to tackle
- Follow consistent code style (ESLint rules if you introduce new JS)

🪄 Whether it’s code, docs, or just ideas - contributions of all kinds are appreciated, so thank you for helping make ByteBento better!

---

## 📁 Repo Structure
<pre>/workers → Cloudflare Worker scripts
/src → Static site content
/scripts → Utility tools (RSS parsing, filtering, etc.)</pre>

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).  
Feel free to use, share, and remix—just give credit where it’s due.

---

## 🙏 Acknowledgements

- Inspired by the simplicity of serverless dashboards
- Thanks to Cloudflare Workers for the magic edge compute
- Hats off to all open-source libraries and contributors
- Made with ☕, 🧠, and 💻
