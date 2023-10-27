---
title: 在 Ubuntu22.04 上使用 minikube 和 Docker 运行 Kubernetes
date: 2023-03-03
author: 耀耀
en: Running Kubernetes using minikube and Docker on Ubuntu
layout: Post
useHeaderImage: true # 是否在博客中显示封面图（可选，默认：false）
headerImage: /img/in-post/ideun-kim-220908-morning.webp # 博客封面图（必须，即使上一项选了 false，因为图片也需要在首页显示）
headerMask: rgba(40,57,101, .4)  # 封面图遮罩（可选）
headerImageCredit: Ideun Kim # 图片来源，比如图片作者的名字（可选，只在 "useHeaderImage: true" 时有效）
headerImageCreditLink: https://www.artstation.com/artwork/8wNkQx  # 图片来源的链接（可选，只在 "useHeaderImage: true" 时有效）
catalog: true # 是否启用右侧目录，会覆写 `themeConfig.catalog`（可选，默认：false）
hide: false # 是否在首页和标签页博客列表中隐藏这篇博客（可选，默认：false）
---

---

## 背景

原因是这几天想在本地测 eBPF，需要一个 Kubernetes 集群。
发现 minikube 用的人比较多，所以就试了一下。
然后在我的开发虚拟机（Ubuntu）上也部署了一套。

## 我的环境

- 我的电脑: `MacBook Pro (14-inch, 2021)`, `Ventura 13.2`, `M1 Max (ARM64,aarch64)`
- 本地 Linux 环境: `Ubuntu 22.04.2 LTS` in `Parallels Desktop 18 for Mac`

## 安装 Docker

我这里使用阿里云提供的镜像源作为安装 `Docker` 加速

### 安装依赖

```bash
sudo apt-get update 
sudo apt -y install apt-transport-https ca-certificates curl software-properties-common
```

### 安装 GPG 证书

```bash
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
```

### 写入软件源信息

```bash
# 我在 Macbook 上使用 PD 运行的 Ubuntu, 所以这地方需要改为对应架构的 arch=arm64
// ARM64 
sudo add-apt-repository "deb [arch=arm64] <https://download.docker.com/linux/ubuntu> $(lsb_release -cs) stable"
// AMD64
sudo add-apt-repository "deb [arch=amd64] <https://download.docker.com/linux/ubuntu> $(lsb_release -cs) stable"
```

### 更新并安装

```bash
sudo apt-get -y update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugins docker-compose-plugins
```

### Hello World

安装完成后，您可以通过以下命令验证 Docker 是否已正确安装。

```bash
sudo docker run hello-world
```

如果安装成功，将会返回一个欢迎信息。现在，您已经成功地在 Ubuntu 上安装了 Docker。

```bash
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (arm64v8)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

### 查看 Docker 版本

```bash
# 执行
sudo docker -v
# 输出结果
Docker version 23.0.1, build a5ee5b1
```

## 安装 minikube

### 下载和安装

```bash
# 下载 minikube 官方软件包
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-arm64
# 安装 minikube
sudo install minikube-linux-arm64 /usr/local/bin/minikube
```

### 设置普通用户启动

使用 `docker` 作为驱动时，不允许使用 `root` 用户启动 `minikube`，需要以当前 ` 普通用户 ` 启动 `minikube`。
所以当使用普通用户时，不能使用 `sudo` 来启动，要不然会报错，所以要将当前用户加入 `docker` 组。

将当前用户加入 docker 组，不需要指定用户名，$USER 变量可获取当前用户名

```bash
sudo usermod -aG docker $USER && newgrp docker
```

查看当前用户信息，当前用户已加入 id 为 999 的 docker 组

```bash
# 执行
id
# 输出结果
uid=1001(yaoyao) gid=1001(yaoyao) groups=1001(yaoyao),27(sudo),999(docker)
```

## 创建 Kubernetes 集群

```bash
# 不加 sudo
minikube start \
--driver=docker \
--container-runtime=containerd \
--image-repository="https://registry.cn-hangzhou.aliyuncs.com/google_containers"
```

输出结果

```bash
😄  minikube v1.29.0 on Ubuntu 22.04 (arm64)
✨  Using the docker driver based on user configuration
📌  Using Docker driver with root privileges
👍  Starting control plane node minikube in cluster minikube
🚜  Pulling base image ...
💾  Downloading Kubernetes v1.26.1 preload ...
    > preloaded-images-k8s-v18-v1...:  331.38 MiB / 358.48 MiB  92.44% 24.23 Mi❗  minikube was unable to download gcr.io/k8s-minikube/kicbase:v0.0.37, but successfully downloaded docker.io/kicbase/stable:v0.0.37 as a fallback image
    > preloaded-images-k8s-v18-v1...:  358.48 MiB / 358.48 MiB  100.00% 25.37 M
🔥  Creating docker container (CPUs=2, Memory=2200MB) ...
📦  Preparing Kubernetes v1.26.1 on containerd 1.6.15 ...
    ▪ Generating certificates and keys ...
    ▪ Booting up control plane ...
    ▪ Configuring RBAC rules ...
🔗  Configuring CNI (Container Networking Interface) ...
    ▪ Using image gcr.io/k8s-minikube/storage-provisioner:v5
🌟  Enabled addons: storage-provisioner, default-storageclass
🔎  Verifying Kubernetes components...
💡  kubectl not found. If you need it, try: 'minikube kubectl -- get pods -A'
🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
```

### 查看安装状态

```bash
# 执行
minikube status
# 输出结果
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

### 查看 Pod 状态

```bash
# 执行
minikube kubectl -- get nodes -A
# 执行结果
    > kubectl.sha256:  64 B / 64 B [-------------------------] 100.00% ? p/s 0s
    > kubectl:  44.31 MiB / 44.31 MiB [------------] 100.00% 25.15 MiB p/s 2.0s
NAME       STATUS   ROLES           AGE    VERSION
minikube   Ready    control-plane   112s   v1.26.1
```

## 和集群交互

### 使用 `minikube kubectl`

```bash
minikube kubectl -- get pods -A
```

配置别名，方便操作

当前会话临时设置别名

```bash
alias kubectl="minikube kubectl --"
```

当前用户永久设置别名

```bash
# 添加别名配置
echo "alias kubectl='minikube kubectl --'" >> ~/.bashrc
# 使配置生效
source ~/.bashrc
```
