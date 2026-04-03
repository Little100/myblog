---
title: 如何建構我的部落格？
description: 建構 Little100's 的部落格模板
date: 2026-03-31
lastEdited: 2026-03-31
author: Little100
readMinutes: 4
tags: ["教程",]
icon: "avatar.png"
---
~~我的部落格非常花俏，獲得了你的喜愛，所以你要建構差不多的部落格😠，我不管我就是這麼認為的。~~

## 準備工作

 - 一個 GitHub 帳號
 - 會一點 Markdown 語法
 - Node.js 已安裝
 - 有一點點英語水平或翻譯器
 - 有問題會先去搜尋＋詢問 AI
 - 有合適的編輯器（比如 VS Code）
 - 有 Git

## 開始

### 1. 複製倉庫
首先點擊右上角 GitHub 圖標或[點擊這裡](https://github.com/Little100/blog)跳轉到我的部落格倉庫，點擊 fork，一路無腦下一步，直到看到倉庫正常顯示內容。

### 2. 本地編輯
如果下載了 Git 則直接打開命令列輸入 git clone 你的 fork 倉庫的 url，例如：

```bash
git clone https://github.com/YourUsername/blog.git
```

如果沒有則需要前往你的倉庫頁面點擊 Code，點擊最下面的按鈕（Download ZIP），解壓到你喜歡的位置。

### 3. 編輯內容

需要修改 config.json 的部分內容為你喜歡的內容，比如名字等等，如果你不確定哪一部分該修改你可以詢問 AI。

所有的文章內容全部會在 public/content/{lang}/ 內，並且內建了多個模板可以查看。

### 4. 本地測試

你需要從終端中輸入如下程式碼進行本地測試：

```bash
npm install
npm run dev
```

如果發現有缺失文章等問題可以嘗試：

```bash
npm run build
npm run dev
```

### 5. 正式部署

如果本地部署沒有任何問題，那麼現在就可以部署了，首先你需要先進入部落格的倉庫，點擊 Settings → Pages → Build and Deployment → Source → GitHub Actions → Save，

然後切換到 Settings → Secrets and variables → Actions → Variables → New repository variable → Name: VITE_BASE → Value: / → Add variable → Save

然後登陸 git（具體操作請自行搜尋），然後輸入：

```bash
git add .
git commit -m "你的提交訊息"
git push origin main
```

如果一切順利，那麼你就可以在 GitHub Pages 上看到你的部落格了，網址是 `https://你的github用戶名.github.io/blog/`

### 選項 — 開啟 Giscus 評論

首先你需要訪問到 [Giscus 官網](https://giscus.app/)，往下翻找到倉庫 → 2. giscus app 已安裝的位置 點擊藍色的 giscus 或者直接[點擊這裡](https://github.com/apps/giscus)安裝 giscus

安裝完成後返回到你的部落格倉庫頁面，點擊 Settings → 往下翻 → Discussions → 勾選

接著返回 [Giscus 官網](https://giscus.app/)，找到倉庫：填寫你的 GitHub 用戶名／你的部落格倉庫名稱，例如 Little100/blog，然後點擊下一步，選擇你喜歡的主題，點擊下一步，在下方可以看到類似於：

```html
<script src="https://giscus.app/client.js"
        data-repo="[在此輸入倉庫]"
        data-repo-id="[在此輸入倉庫 ID]"
        data-category="[在此輸入分類名]"
        data-category-id="[在此輸入分類 ID]"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="zh-TW"
        crossorigin="anonymous"
        async>
</script>
```

你需要獲取 data-repo、data-repo-id、data-category、data-category-id 這四個欄位，放到 config.json 中的 giscus 設定中，完成後推送，至此一切完成，可以享受了！

!meme[得意17]
