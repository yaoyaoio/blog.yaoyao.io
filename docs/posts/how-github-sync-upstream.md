---
title: 如何在 Github 中同步上游仓库
author: 耀耀
date: 2023-03-13
layout: Post
useHeaderImage: true # 是否在博客中显示封面图（可选，默认：false）
headerImage: /img/in-post/cover-github-sync.webp # 博客封面图（必须，即使上一项选了 false，因为图片也需要在首页显示）
headerMask: rgba(40,57,101, .4)  # 封面图遮罩（可选）
headerImageCredit: Ideun Kim # 图片来源，比如图片作者的名字（可选，只在 "useHeaderImage: true" 时有效）
headerImageCreditLink: https://www.artstation.com/artwork/8wNkQx  # 图片来源的链接（可选，只在 "useHeaderImage: true" 时有效）
---

## 前言

在 Github 上 Fork 一个仓库后，如果上游仓库发生了变化，为了保持当前仓库的更新，如何将上游仓库的变化同步到当前仓库中呢？

## 开始

下面我以 [linux](https://github.com/torvalds/linux) 为例。你可以随便找个项目测一下。

### Fork 仓库

我们点击 `Fork` 按钮

![https://i.yaoyao.io/blog/github-fork-linux.png](https://i.yaoyao.io/blog/github-fork-linux.png)

点击 `Create fork` 将该仓库复制到我的名下

![https://i.yaoyao.io/blog/giuhub-fork-linux-to-me.png](https://i.yaoyao.io/blog/giuhub-fork-linux-to-me.png)

### 克隆仓库

在你的电脑本地克隆你账户下的该仓库

```bash
git clone https://github.com/yaoyaoio/linux.git
cd linux
```

### 添加上游仓库

```bash
git remote add upstream https://github.com/torvalds/linux.git
```

### 查看远程分支

```bash
git remote -v
```

### 从上游仓库获取最新

```bash
git fetch upstream
```

### 切换到当前仓库的 `main`  分支

```bash
git checkout main
```

### 将上游仓库的更改合并到当前仓库中

```bash
git merge upstream/main
```

## 总结

以下内容由 `Notion AI` 生成

1. 首先，使用命令 `git remote add upstream <上游仓库地址>` 添加上游仓库的远程地址。
2. 使用命令 `git remote -v` 确认是否已经添加了上游仓库的远程地址。
3. 使用命令 `git fetch upstream` 从上游仓库中获取最新的更改。
4. 切换到当前仓库的主分支，并使用命令 `git merge upstream/main` 将上游仓库的更改合并到当前仓库中。
5. 如果存在冲突，需要手动解决冲突。
6. 使用命令 `git push` 提交更改。

注意：同步上游仓库时，一定要确保当前仓库中没有未提交的更改，否则可能会导致冲突。
