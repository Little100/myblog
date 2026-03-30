---
title: 如何搭建我的blog?
description: 搭建Little100's的blog模板
date: 2026-03-31
lastEdited: 2026-03-31
author: Little100
readMinutes: 4
tags: ["教程",]
icon: "public/avatar.png"
---
~~我的blog非常花哨, 得到了你的喜爱, 所以你要搭建差不多的blog😠, 我不管我就是这么认为的.~~

## 准备工作

 - 一个github账号
 - 会一点markdown语法
 - nodejs
 - 一点点英语水平或者翻译器
 - 有问题会先去搜索+询问ai
 - 有合适的编辑器(比如vscode)
 - 有git

## 开始

### 1. 克隆仓库
首先点击右上角github图标或者[点击这里](https://github.com/Little100/blog)跳转到我的blog仓库, 点击fork, 一路无脑下一步, 直到看到仓库正常显示内容。

### 2. 本地编辑
如果下载了git则直接打开命令行输入git clone 你的fork仓库的url, 例如:
```bash
git clone https://github.com/Little100/blog.git
```
如果没有则需要前往你的仓库页面点击code(中文微软翻译会变成法典), 点击最下面的按钮(Download ZIP), 解压到你喜欢的位置。

### 3. 编辑内容

需要修改config.json的部分内容为你喜欢的内容, 比如名字等等, 如果你不确定哪一部分该修改你可以询问ai.

所有的帖子内容全部会在public/content/{lang}/内, 并且内置了多个模板可以查看.

### 4. 本地测试

你需要从终端中输入如下代码进行本地测试
```bash
npm install
npm run dev
```
如果发现有缺失帖子等问题可以尝试
```bash
npm run build
npm run dev
```

### 5. 正式部署

如果本地部署没有任何问题, 那么现在就可以部署了, 首先你需要先进入blog的仓库, 点击setting -> pages -> Build and deployment -> Source -> GitHub Actions -> Save,

然后登陆git(具体操作请自行搜索), 然后输入
```bash
git add .
git commit -m "你的提交信息"
git push origin main
```

如果一切顺利, 那么你就可以在github pages上看到你的blog了, ur;是https://你的github用户名.github.io/blog/

### 可选 - 开启giscus评论

首先你需要访问到[giscus官网](https://giscus.app/), 往下翻找到仓库 -> 2. goscis app已安装的位置 点击蓝色的giscus或者直接[点击这里](https://github.com/apps/giscus)安装giscus

安装完成后返回到你的blog仓库页面, 点击setting -> 往下翻 -> Discussions -> 勾选

接着返回[giscus官网](https://giscus.app/), 找到仓库: 填写你的github用户名/你的blog仓库名称, 例如Little100/blog, 然后点击下一步, 选择你喜欢的主题, 点击下一步, 在下方可以看到类似于
```html
<script src="https://giscus.app/client.js"
        data-repo="[在此输入仓库]"
        data-repo-id="[在此输入仓库 ID]"
        data-category="[在此输入分类名]"
        data-category-id="[在此输入分类 ID]"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="zh-CN"
        crossorigin="anonymous"
        async>
</script>
```
的字段, 你需要获取data-repo, data-repo-id, data-category, data-category-id这四个字段, 放到config.json中的giscus设置中, 完成后推送, 至此一切完成, 可以享受了!

!meme[得意17]