---
title: このブログの作り方
description: Little100 のブログテンプレート構築ガイド
date: 2026-03-31
lastEdited: 2026-04-04
author: Little100
readMinutes: 4
tags: ["チュートリアル"]
icon: "avatar.png"
---

~~私のブログはかなり派手で、あなたのお気に入りになる…そう信じています 😠~~

## 準備

 - GitHub アカウントがある
 - Markdown の基本がわかる
 - Node.js が入っている
 - 英語が少しできる、または翻訳ツールを使える
 - 困ったらまず検索と AI に聞く習慣がある
 - 適当なエディタがある（例：VS Code）
 - Git が入っている

## 始めよう

### 1. リポジトリをフォークする

右上の GitHub アイコンをクリックするか、[こちら](https://github.com/Little100/blog)から私のブログリポジトリを開き、**Fork** を押して手順に従ってください。リポジトリの中身が普通に表示されれば成功です。

### 2. ローカルで取得する

Git が入っていればターミナルで次のようにします。

```bash
git clone https://github.com/YourUsername/blog.git
```

Git がない場合は、リポジトリページの **Code** を開き（環境によっては翻訳で変な語に化けることがありますが、緑のボタンだと思えば大丈夫です）、一番下の **Download ZIP** で ZIP を落として、好きな場所に解凍してください。

### 3. コンテンツを編集する

`config.json` の名前など、自分用に変えたい箇所を書き換えます。どこを触ればいいか迷ったら AI に聞いてください。

記事本文はすべて `public/content/{言語コード}/` 以下にあります。同梱のサンプル記事も参考にしてください。

### 4. ローカルで動作確認

ターミナルで次を実行します。

```bash
npm install
npm run dev
```

記事が足りないなどの不具合が出たら、次も試してください。

```bash
npm run build
npm run dev
```

### 5. デプロイ

ローカルで問題なければデプロイの準備は OK です。ブログのリポジトリで **Settings → Pages → Build and deployment → Source → GitHub Actions → Save** の順に設定します。

続けて **Settings → Secrets and variables → Actions → Variables → New repository variable** で、名前に `VITE_BASE`、値に `/` を入れて保存します。

Git にログインしたうえで（手順は各自検索してください）、次を実行します。

```bash
git add .
git commit -m "あなたのコミットメッセージ"
git push origin main
```

うまくいけば GitHub Pages で `https://your-username.github.io/blog/` のように公開されます。

### 任意 — Giscus コメントを有効にする

まず [Giscus のサイト](https://giscus.app/) を開き、下の方の手順に従ってリポジトリを選びます。**giscus** アプリのインストールは[こちら](https://github.com/apps/giscus)からも行えます。

インストール後、ブログのリポジトリで **Settings → Discussions** を有効にします。

もう一度 [Giscus](https://giscus.app/) に戻り、リポジトリ名（例：`Little100/blog`）を入力してテーマを選ぶと、ページ下部に次のような埋め込みコードが表示されます。

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

`data-repo`、`data-repo-id`、`data-category`、`data-category-id` の 4 つを `config.json` の giscus 設定に転記してプッシュすれば完了です。

!meme[得意17]
