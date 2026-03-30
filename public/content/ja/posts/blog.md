---
title: 私のblog построить方法
description: Little100のblogテンプレート構築ガイド
date: 2026-03-31
lastEdited: 2026-03-31
author: Little100
readMinutes: 4
tags: ["教程",]
icon: "public/avatar.png"
---
~~私のblogは、とても派手で、あなたに愛される 😠, と私はそう思います。~~

## 準備

 - GitHubアカウントを持っている
 - Markdownの基本的知识がある
 - Node.jsがインストール済み
 - 基本的な英語力または翻訳ツール
 - 質問する前に検索+AIに聞く习惯がある
 - 適切なエディタがある（例：VS Code）
 - Gitがインストール済み

## 始めよう

### 1. リポジトリをクローン
右上隅のGitHubアイコンをクリックするか、[ここをクリック](https://github.com/Little100/blog)にアクセスして、私のblogリポジトリに飛び、Forkをクリック、何ステップか次へ進むと、リポジトリが正常に表示されます。

### 2. ローカル編集
Gitをインストール済みなら、ターミナルを開いて以下を入力：

```bash
git clone https://github.com/YourUsername/blog.git
```

インストールしていなければ、リポジトリページにアクセスしてCodeをクリック（Microsoft中国語翻訳では「法典」と表示される場合がありますが、無視してください）、一番下のDownload ZIPボタンをクリックし、好きな場所に解凍してください。

### 3. コンテンツの編集

`config.json`の関連箇所（名前など）を変更してください。どの部分を変更すればいいのか分からない場合は、AIに聞いてください。

すべての記事コンテンツは `public/content/{lang}/` の配下にあります。built-inテンプレートがいくつか用意されているので、参照してください。

### 4. ローカルテスト

ターミナルで以下を実行してください：

```bash
npm install
npm run dev
```

記事の欠落などの問題が発生した場合は、以下を試してください：

```bash
npm run build
npm run dev
```

### 5. デプロイ

ローカルテストに問題がなければ、デプロイの準備完了です。まず、blogリポジトリにアクセスし、Settings → Pages → Build and Deployment → Source → GitHub Actions → Save とクリックしてください。

次に Settings → Secrets and variables → Actions → Variables → New repository variable → Name: VITE_BASE → Value: / → Add variable → Save と進みます。

次にgitにログインし（やり方は検索してください）、以下を実行してください：

```bash
git add .
git commit -m "あなたのコミットメッセージ"
git push origin main
```

すべて順調であれば、GitHub Pagesでblogが公開されます： `https://your-username.github.io/blog/`

### 任意 — Giscusコメントを有効にする

まず[Giscus公式サイト](https://giscus.app/)にアクセスし、下にスクロールしてリポジトリ → 2. giscus appがインストールされている場所、青いgiscusリンクをクリックするか、[ここからインストール](https://github.com/apps/giscus)してください。

インストール後、blogリポジトリにアクセスし、Settings → 下にスクロール → Discussions → チェックを入れます。

次に[Giscus公式サイト](https://giscus.app/)に戻り、リポジトリ欄にGitHubユーザー名/リポジトリ名（例：`Little100/blog`）を入力して次へ、好きなテーマを選んで次へ進むと、下部に以下のようなコードが表示されます：

```html
<script src="https://giscus.app/client.js"
        data-repo="[リポジトリ]"
        data-repo-id="[リポジトリID]"
        data-category="[カテゴリ名]"
        data-category-id="[カテゴリID]"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="ja"
        crossorigin="anonymous"
        async>
</script>
```

`data-repo`、`data-repo-id`、`data-category`、`data-category-id`の4つのフィールドを取得し、`config.json`のgiscus設定に追加してプッシュすれば完了です！

!meme[得意17]
