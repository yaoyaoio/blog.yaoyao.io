---
title: 使用 Zlibrary 和 Telegram 创建私人电子书下载机器人
date: 2023-03-08
author: 耀耀
layout: Post
useHeaderImage: true # 是否在博客中显示封面图（可选，默认：false）
headerImage: /img/in-post/cover-zlib-tg.webp # 博客封面图（必须，即使上一项选了 false，因为图片也需要在首页显示）
headerMask: rgba(40,57,101, .4)  # 封面图遮罩（可选）
headerImageCredit: Ideun Kim # 图片来源，比如图片作者的名字（可选，只在 "useHeaderImage: true" 时有效）
headerImageCreditLink: https://www.artstation.com/artwork/8wNkQx  # 图片来源的链接（可选，只在 "useHeaderImage: true" 时有效）
---

为了创建一个私人的电子书下载机器人，我们需要使用 Zlibrary 和 Telegram 应用程序。在本文中，我们将详细介绍如何创建一个电子书下载机器人。

## 申请 Telegram 机器人

首先，我们需要在 Telegram 上申请一个机器人。请按照以下步骤执行：

1. 打开 Telegram 应用程序并搜索 `@BotFather` 。
2. 在对话框中发送 `/start` 并按照指示操作。
3. 我们根据提示在对话框中发送 `/newbot` 您将被要求提供您的机器人名称和用户名。请确保您的机器人名称以 `_bot` 结尾，例如 `mybook_bot`。
4. `BotFather` 将向您发送一个 `HTTP API Token`。请保存这个 `Token`，因为它将用于在 `Zlibrary` 中设置您的机器人。

如同所示：

![创建机器人|1000](https://i.yaoyao.io/blog/tg-newbot.png)

## 与 Zlibrary 绑定

首先，我们需要在 [Zlibrary](https://singlelogin.me) 注册账号。请按照以下步骤执行：

1. 先到官网注册账号： [https://singlelogin.me](https://singlelogin.me/)
2. 注册成功后会跳转到 `Zlibrary` 首页。随便找本书点击跳转到对应详情页面。
3. 点击 `Send to`  选择 `Telegram`  复制上个步骤生成的 `HTTP API Token`

如图所示：

![登录注册|1000](https://i.yaoyao.io/blog/zlib-dashboard.png)

![图书详情|1000](https://i.yaoyao.io/blog/zlib-book-desc.png)

![链接TG|1000](https://i.yaoyao.io/blog/zlib-connect-tg.png)



## 使用机器人

请在 Telegram 应用程序中搜索您创建的机器人的用户名，例如 `mybook_bot`。然后，您可以开始与机器人交互。直接发送您需要的电子书。请注意，这是一个私人机器人，只有您可以访问它。

如图所示：

![搜索图书|1000](https://i.yaoyao.io/blog/tg-bot-search-book.png)

## 最后

这篇文章主要靠 `Notion AI` 完成。
