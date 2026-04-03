---
title: How to Build My Blog?
description: Little100's blog template setup guide
date: 2026-03-31
lastEdited: 2026-03-31
author: Little100
readMinutes: 4
tags: ["Tutorial",]
icon: "avatar.png"
---
~~My blog is so flashy and you love it, so you want to build something similar 😠, I don't care, that's just what I think.~~

## Prerequisites

 - A GitHub account
 - Basic knowledge of Markdown syntax
 - Node.js installed
 - Basic English or a translator
 - Know to search + ask AI before asking for help
 - A suitable editor (e.g., VS Code)
 - Git installed

## Getting Started

### 1. Clone the Repository
Click the GitHub icon in the top-right corner or [click here](https://github.com/Little100/blog) to go to my blog repo, click fork, follow the prompts without thinking, until the repo displays its content normally.

### 2. Local Editing
If you have Git installed, open your terminal and type:

```bash
git clone https://github.com/YourUsername/blog.git
```

If not, go to your repo page, click Code (the Chinese Microsoft translation might show "法典" — ignore that), click the Download ZIP button at the bottom, and extract it wherever you like.

### 3. Edit Content

Modify the relevant parts in `config.json` — your name, etc. If you're unsure which part to change, just ask an AI.

All post content lives under `public/content/{lang}/`. There are several built-in templates you can reference.

### 4. Local Testing

From your terminal, run:

```bash
npm install
npm run dev
```

If you encounter missing posts or other issues, try:

```bash
npm run build
npm run dev
```

### 5. Deploy

If local testing is all good, it's time to deploy. First, go to your blog repo, click Settings -> Pages -> Build and Deployment -> Source -> GitHub Actions -> Save.

Then switch to Settings -> Secrets and variables -> Actions -> Variables -> New repository variable -> Name: VITE_BASE -> Value: / -> Add variable -> Save.

Next, log into git (search online for how), then run:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

If everything goes smoothly, your blog will be live on GitHub Pages at: `https://your-username.github.io/blog/`

### Optional — Enable Giscus Comments

First, visit the [Giscus website](https://giscus.app/), scroll down to the repo section — 2. giscus app is installed — click the blue giscus link or [install it here](https://github.com/apps/giscus).

Once installed, go to your blog repo, click Settings -> scroll down -> Discussions -> check the box.

Then go back to the [Giscus website](https://giscus.app/), fill in the repo field with your GitHub username/repo name, e.g. `Little100/blog`, click next, pick your preferred theme, click next. You'll see code like this at the bottom:

```html
<script src="https://giscus.app/client.js"
        data-repo="[repo here]"
        data-repo-id="[repo ID]"
        data-category="[category name]"
        data-category-id="[category ID]"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="en"
        crossorigin="anonymous"
        async>
</script>
```

Extract `data-repo`, `data-repo-id`, `data-category`, and `data-category-id`, add them to the giscus section in `config.json`, then push. Done!

!meme[得意17]
