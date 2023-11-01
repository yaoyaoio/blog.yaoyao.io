---
title: 使用 群晖 NAS 和 Calibre-Web 搭建个人图书馆
date: 2022-12-21
author: 耀耀
layout: post
headerImage: /img/in-post/cover-nas-library.webp # 博客封面图（必须，即使上一项选了 false，因为图片也需要在首页显示）
---

---

## 背景

如果你是一个爱书之人，那么你可能会收集大量的电子书。
但是，如果你的电脑硬盘空间不足，或者你想要在多个设备上访问你的图书馆，那么你需要一个更好的解决方案。
在这篇文章中，我将向你介绍如何使用群晖 NAS 和 Calibre-Web 来搭建一个个人图书馆，让你随时随地阅读你的电子书。
**（以上内容由 Notion AI 生成）**

## 我的环境

- 我的电脑: `MacBook Pro (14-inch, 2021)`, `Ventura 13.2`, `M1 Max (ARM64,aarch64)`
- 我的 NAS：群晖 `DS1522+`, `DSM 7.1.1-42962 Update 2`
- calibre-web 镜像：`linuxserver/calibre-web:0.6.19`

## 部署 Calibre-Web

### 搜索镜像并下载

在群晖 DSM 中，打开 `Docker` 套件，在 ` 注册表 ` 中搜索 `calibre-web`，并选择对应的镜像及版本下载：

在这里 我选择的是： `linuxserver/calibre-web` 版本为： `0.6.19`

点击 ` 选择 ` 后即可会自动下载

![搜索及下载镜像|1000](https://i.yaoyao.io/blog/nas-calibre-web-download.png)

### 创建容器

在 ` 容器 `  中点击 ` 新增 ` 选择对应版本的镜像点击 ` 下一步 `

![创建容器选择镜像|1000](https://i.yaoyao.io/blog/nas-calibre-web-create.png)

### 配置容器网络

在这里我选择了和 Docker Host 相同的网络 你也可以选择 Birdge 然后把 8083 端口暴露出来

![配置容器网络|1000](https://i.yaoyao.io/blog/nas-calibre-web-network.png)

### 容器常规设置

在这里我勾选了 ` 启用自动重新启动 ` 然后点击 ` 高级设置 `

![容器常规设置|1000](https://i.yaoyao.io/blog/nas-calibre-web-basic-set.png)

### 配置容器环境变量

![高级设置配置环境变量|1000](https://i.yaoyao.io/blog/nas-calibre-web-env-set.png)

|变量|值|说明|
|---|---|---|
|TZ|  Asia/Shanghai|时区配置|
|DOCKER_MODS | linuxserver/mods: universal-calibre|电子书转换能力|
|OAUTHLIB_RELAX_TOKEN_SCOPE |1 | 允许 Google OAUTH 工作|
|https_proxy| `http://127.0.0.1:7890`|配置了自己的代理方便下载 |

**注**：这些都是可选配置

配置完之后点击 ` 保存 ` 然后再点击 ` 下一步 `

### 容器存储空间设置

共享文件夹的创建请点击 [这里查看](#创建共享文件夹)

![存储空间设置|1000](https://i.yaoyao.io/blog/nas-calibre-web-volume.png)

| 本地文件夹             | 装载路径 | 说明         |
| --- | --- | --- |
| /docker/calibre/books  | /books   | 书籍存放目录 |
| /docker/calibre/config | /config  | 配置目录     |

然后点击 ` 下一步 `

### 容器创建最后

此处可以看一下自己配置有没有问题 如果有问题点击 ` 上一步 ` 如果没问题则点击 ` 完成 `

![摘要|1000](https://i.yaoyao.io/blog/nas-calibre-web-more.png)

### 查看启动日志

这个地方会慢一些

![查看启动日志](https://i.yaoyao.io/blog/nas-calibre-web-run-log.png)

## 访问及管理 Calibre-Web 服务

### 使用浏览器访问

使用浏览器打开 `http://{你的群晖地址}:8083`

默认登录账号为：`admin/admin123`

![访问服务](https://i.yaoyao.io/blog/nas-calibre-web-browser.png)

### 配置数据库路径

输入 `/books` 即可

![配置数据库路径](https://i.yaoyao.io/blog/nas-calibre-web-db-config.png)

如果出现 `DB Location is not Valid, Please Enter Correct Path` 请点击 [这里查看](#常见问题)

### 配置语言

点击右上角 `admin` 然后修改 ` 语言 `

![配置语言](https://i.yaoyao.io/blog/nas-calibre-web-lang-set.png)

其他配置自己摸索吧 这里就不多讲了。

## 创建共享文件夹

打开 ` 控制面板 ` 在 ` 共享文件夹 ` 里 创建名为 `docker` 的文件夹 其余设置均为默认

打开 `File Station` 在 docker 文件夹中创建名为 `calibre` 的文件夹

并且在 `calibre` 文件夹中创建 名为 `books` 和 `config` 两个文件夹

`calibre` 文件夹及权限配置如图所示：

![创建共享文件夹|1000](https://i.yaoyao.io/blog/nas-calibre-web-sharefile.png)

## 使用第三方 douban 接口作为元数据提供者

虽然 0.6.19 版本重新提供了 `douban` 接口。`metadata_provider` 目录下有好几种元数据提供者，但是我这一直刷新不出来 索性还是用第三方提供的接口吧

![|1000](https://i.yaoyao.io/blog/nas-calibre-web-get-matadata-error.png)

我用的是 `https://github.com/fugary/calibre-web-douban-api` 提供的接口

### 配置

打开 `File Station` 在 docker/calibre 下创建名为 `metadata_provider` 的文件夹
然后将 `NewDouban.py` 放到了该文件夹下

![豆瓣目录|1000](https://i.yaoyao.io/blog/nas-calibre-web-douban.png)

将该 `calibre-web` 容器停止 然后编辑该容器

![编辑|1000](https://i.yaoyao.io/blog/nas-calibre-web-edit-volume.png)

| 本地文件夹 | 装载路径 |
| ------ | -------- |
|  /docker/calibre/metadata_provider  |  /app/calibre-web/cps/metadata_provider |

然后启动点击 ` 保存 ` 并启动该容器

### 测试一下

在页面随便找本书点击 ` 获取元数据 `

![获取元数据](https://i.yaoyao.io/blog/nas-calibre-web-get-metadata.png)

## FAQ

### advocate 模块问题

如果在页面中保存书籍元数据时会提示 advocate 模块不存在

原因是没有正确安装该模块

解决办法：

进入容器中执行

```bash
cd /app/calibre-web/
pip3 install -r requirements.txt
```

![安装依赖](https://i.yaoyao.io/blog/nas-calibre-web-pip-requirements.png)

如果在页面中保存书籍元数据时会提示 `Error editing book: Proxies cannot be used with Advocate`

原因是配置了代理和该模块冲突

解决办法：

可以将 `https_proxy` 从环境变量中去掉 或
给容器添加环境变量 `CALIBRE_LOCALHOST=true`

### 使用 pip 会提示  `ModuleNotFoundError: No module named 'distutils.cmd'`

如果在容器里使用 pip 出现了 `ModuleNotFoundError: No module named 'distutils.cmd'`

解决办法：

进入容器中执行

```bash
apt-get install python3-distutils -y
```

![安装 Python 依赖](https://i.yaoyao.io/blog/nas-calibre-web-apt-python3-distutils.png)

### google scholar 模块问题

我在运行 calibre-web 的时候 该模块会导致我的整个流程卡住

解决办法：

进入容器中卸载该模块

```bash
pip uninstall scholarly -y
```

### PyQt 问题

如果出现以下错误

`Failed to import PyQt module: PyQt6.QtWebEngineCore with error: libXtst.so.6:
cannot open shared object file: No such file or directory`

解决办法：

进入容器中执行

```bash
apt update
apt upgrade libgl1-mesa-glx libxdamage1 libegl1 libxkbcommon0 libopengl0 -y
```

### 数据库路径配置错误

如果出现 `DB Location is not Valid, Please Enter Correct Path`

原因是因为 /books/ 目录下需要一个 `metadata.db`

可以用电脑下载 `calibre` 应用 初始配置会生成一个 `metadata.db` 然后将 `metadata.db`  放到 `books` 文件夹下

![配置错误](https://i.yaoyao.io/blog/nas-calibre-web-matadatadb-file.png)

然后在页面重新配置数据库路径即可

## 参考资料

- <https://github.com/gshang2017/docker/issues/120>
- <https://www.cnblogs.com/sexintercourse/p/16927455.html>
- <https://fugary.com/?p=203>

## 最后

自己尝试吧 有问题可以留言。。。
