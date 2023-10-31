---
title: 在 Mac 上使用 minikube 和 Podman 运行 Kubernetes
date: 2023-03-01
author: 耀耀
layout: Post
useHeaderImage: true # 是否在博客中显示封面图（可选，默认：false）
headerImage: /img/in-post/cover-minikube.png # 博客封面图（必须，即使上一项选了 false，因为图片也需要在首页显示）
headerMask: rgba(40,57,101, .4)  # 封面图遮罩（可选）
headerImageCredit: Ideun Kim # 图片来源，比如图片作者的名字（可选，只在 "useHeaderImage: true" 时有效）
headerImageCreditLink: https://www.artstation.com/artwork/8wNkQx  # 图片来源的链接（可选，只在 "useHeaderImage: true" 时有效）
en: Running Kubernetes using minikube and Podman on Mac
---

---

## 背景

原因是这几天想在本地测 eBPF，需要一个 Kubernetes 集群。
发现 minikube 用的人比较多，所以就试了一下。
没有使用 `Docker for Mac` 的原因就是讨厌这个项目。

## 我的环境

- 我的电脑: `MacBook Pro (14-inch, 2021)`, `Ventura 13.2`, `M1 Max (ARM64,aarch64)`

## Podman

更详细的 [文档](https://podman.io/)

### 安装 Podman

```bash
brew install podman
```

### 查看版本信息

```bash
podman version
# 输出结果
Client:       Podman Engine
Version:      4.4.2
API Version:  4.4.2
Go Version:   go1.20.1
Git Commit:   74afe26887f814d1c39925a1624851ef3590e79c
Built:        Thu Feb 23 23:59:21 2023
OS/Arch:      darwin/arm64

Server:       Podman Engine
Version:      4.4.1
API Version:  4.4.1
Go Version:   go1.19.5
Built:        Thu Feb  9 18:57:43 2023
OS/Arch:      linux/arm64
```

### 运行 Podman Machine

```bash
# 初始化 Podman Machine 的虚拟机环境
podman machine init --cpus 2 --memory 4096 --disk-size 4
# 启动虚拟机环境
podman machine start
# 查看虚拟机列表
podman machine list
# 输出结果
NAME                     VM TYPE     CREATED       LAST UP            CPUS        MEMORY      DISK SIZE
podman-machine-default*  qemu        10 hours ago  Currently running  2           4.295GB     42.95GB
```

### Hello World

在这里 我使用 `hello-world` 镜像测一下 Podman 是否能正常使用。

```bash
podman run hello-world
# 输出结果
!... Hello Podman World ...!

         .--"--.
       / -     - \
      / (O)   (O) \
   ~~~| -=(,Y,)=- |
    .---. /`  \   |~~
 ~/  o  o \~~~~.----. ~~
  | =(X)= |~  / (O (O) \
   ~~~~~~~  ~| =(Y_)=-  |
  ~~~~    ~~~|   U      |~~

Project:   https://github.com/containers/podman
Website:   https://podman.io
Documents: https://docs.podman.io
Twitter:   @Podman_io
```

## minikube

更详细的 [文档](https://minikube.sigs.k8s.io/docs/)

### 安装 minikube

```bash
brew install minikube
```

### 查看版本信息

```bash
minikube version
# 输出结果
minikube version: v1.29.0
commit: ddac20b4b34a9c8c857fc602203b6ba2679794d3
```

## 创建 Kubernetes 集群

- 我在 `Mac` 上安装使用 `minikube` 默认安装 `kubernetes version` 为 `1.26.1` 会失败 原因是阿里云没有同步该版本（2022-03-01 ）。
- `minikube v1.29.0` 默认使用 `kicbase: v0.0.37`，这个镜像阿里云也没有同步 所以我使用了 `kicbase: v0.0.36`。
- 如果网络上没有问题。可以直接用国外的镜像和源。这样可以直接使用最新版本的镜像。

### 国内

如果网络差点意思就使用国内的源

```bash
minikube start \ 
--driver=podman \
--container-runtime=containerd \
--image-mirror-country=cn \
--kubernetes-version=1.26.0 \
--base-image=registry.cn-hangzhou.aliyuncs.com/google_containers/kicbase:v0.0.36
```

### 国外

如果网络畅通无阻

```bash
minikube start \
--driver=podman \
--container-runtime=containerd
```

输出结果

```bash
😄  minikube v1.29.0 on Darwin 13.2 (arm64)
✨  Using the podman (experimental) driver based on user configuration
✅  Using image repository registry.cn-hangzhou.aliyuncs.com/google_containers
📌  Using rootless Podman driver
👍  Starting control plane node minikube in cluster minikube
🚜  Pulling base image ...
    > registry.cn-hangzhou.aliyun...:  347.52 MiB / 347.52 MiB  100.00% 4.64 Mi
E0301 21:08:02.911942   24959 cache.go:188] Error downloading kic artifacts:  not yet implemented, see issue #8426
🔥  Creating podman container (CPUs=2, Memory=3851MB) ...
📦  Preparing Kubernetes v1.26.0 on containerd 1.6.9 ...
    > kubectl.sha256:  64 B / 64 B [-------------------------] 100.00% ? p/s 0s
    > kubeadm.sha256:  64 B / 64 B [-------------------------] 100.00% ? p/s 0s
    > kubelet.sha256:  64 B / 64 B [-------------------------] 100.00% ? p/s 0s
    > kubectl:  44.31 MiB / 44.31 MiB [--------------] 100.00% 3.79 MiB p/s 12s
    > kubelet:  111.34 MiB / 111.34 MiB [------------] 100.00% 6.62 MiB p/s 17s
    > kubeadm:  43.31 MiB / 43.31 MiB [--------------] 100.00% 2.52 MiB p/s 17s
    ▪ Generating certificates and keys ...
    ▪ Booting up control plane ...
    ▪ Configuring RBAC rules ...
🔗  Configuring CNI (Container Networking Interface) ...
    ▪ Using image registry.cn-hangzhou.aliyuncs.com/google_containers/storage-provisioner:v5
🔎  Verifying Kubernetes components...
🌟  Enabled addons: storage-provisioner, default-storageclass
🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
```

### 查看集群状态

```bash
# 使用 Mac 环境下的 kubectl 查看集群状态
# 可以使用 brew install kubectl 安装 kubectl
kubectl get nodes
# 输出结果
NAME       STATUS   ROLES           AGE     VERSION
minikube   Ready    control-plane   4m17s   v1.26.0
# 使用 minikube kubectl 查看集群状态
minikube kubectl -- get nodes -A
# 输出结果
    > kubectl.sha256:  64 B / 64 B [-------------------------] 100.00% ? p/s 0s
    > kubectl:  50.78 MiB / 50.78 MiB [------------] 100.00% 33.50 MiB p/s 1.7s
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   77m   v1.26.0
```

### 删除集群

```bash
minikube delete --all --purge
# 如果本地还管理其他集群，不要执行该操作。
rm -rf ~/.kube
rm -rf ~/.minikube
```

### 重启集群

如果 Mac 关机 重启后重新执行该命令即可。

```bash

podman machine start

minikube start \
--driver=podman \
--container-runtime=containerd  \
--image-mirror-country=cn \
--kubernetes-version=1.26.0 \
--base-image=registry.cn-hangzhou.aliyuncs.com/google_containers/kicbase:v0.0.36
```

输出结果

```bash
😄  minikube v1.29.0 on Darwin 13.2.1 (arm64)
🆕  Kubernetes 1.26.1 is now available. If you would like to upgrade, specify: --kubernetes-version=v1.26.1
✨  Using the podman (experimental) driver based on existing profile
👍  Starting control plane node minikube in cluster minikube
🚜  Pulling base image ...
E0302 19:52:38.602523    2690 cache.go:188] Error downloading kic artifacts:  not yet implemented, see issue #8426
🔄  Restarting existing podman container for "minikube" ...
📦  Preparing Kubernetes v1.26.0 on containerd 1.6.9 ...
🔗  Configuring CNI (Container Networking Interface) ...
🔎  Verifying Kubernetes components...
    ▪ Using image docker.io/kubernetesui/dashboard:v2.7.0
    ▪ Using image registry.cn-hangzhou.aliyuncs.com/google_containers/storage-provisioner:v5
    ▪ Using image docker.io/kubernetesui/metrics-scraper:v1.0.8
💡  Some dashboard features require the metrics-server addon. To enable all features please run:

    minikube addons enable metrics-server

🌟  Enabled addons: storage-provisioner, default-storageclass, dashboard
🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
```
