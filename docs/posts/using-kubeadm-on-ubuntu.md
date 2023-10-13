---
title: 在 Ubuntu 22.04 上使用 kubeadm  运行 kubernetes
date: 2022-05-26 # 博客发表日期（可选）
author: 耀耀 # 博客作者（可选，不填的话会使用 `themeConfig.personalInfo.name`）
layout: Post # 必须
useHeaderImage: true # 是否在博客中显示封面图（可选，默认：false）
headerImage: /img/in-post/ideun-kim-220908-morning.webp # 博客封面图（必须，即使上一项选了 false，因为图片也需要在首页显示）
headerMask: rgba(40,57,101, .4)  # 封面图遮罩（可选）
headerImageCredit: Jeremy Fenske # 图片来源，比如图片作者的名字（可选，只在 "useHeaderImage: true" 时有效）
headerImageCreditLink: https://www.artstation.com/artwork/nLY0K  # 图片来源的链接（可选，只在 "useHeaderImage: true" 时有效）
catalog: true # 是否启用右侧目录，会覆写 `themeConfig.catalog`（可选，默认：false）
hide: false # 是否在首页和标签页博客列表中隐藏这篇博客（可选，默认：false）
---

---

## 我的环境

- 我的电脑: `MacBook Pro (14-inch, 2021)`, `Ventura 13.2`, `M1 Max (ARM64,aarch64)`
- 本地 Linux 环境: `Ubuntu 22.04.2 LTS` in `Parallels Desktop 18 for Mac`

## 主机信息

4 台主机信息

```bash
cat /etc/hosts |grep home
10.211.55.9  home-01 # master
10.211.55.5  home-02 # node
10.211.55.11 home-03 # node
10.211.55.12 home-04 # node
```

操作系统版本

```bash
# uname -a
Linux home-01 5.15.0-60-generic #66-Ubuntu SMP Fri Jan 20 14:34:57 UTC 2023 aarch64 aarch64 aarch64 GNU/Linux
# cat /etc/os-release
PRETTY_NAME="Ubuntu 22.04.2 LTS"
NAME="Ubuntu"
VERSION_ID="22.04"
VERSION="22.04.2 LTS (Jammy Jellyfish)"
VERSION_CODENAME=jammy
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
UBUNTU_CODENAME=jammy
```

## 基础操作

所有机器都需要执行

### 修改主机名

记得把主机信息加到 /etc/hosts 文件中

```bash
sudo hostnamectl set-hostname {主机名}
```

### 关闭 swap

```bash
sudo swapoff -a
```

### 加载内核模块

```bash
modprobe br_netfilter
```

### 修改内核参数

#### 新增相关配置

```bash
cat << EOF > /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
user.max_user_namespaces=28633
EOF
```

#### 生效配置

```bash
sudo sysctl -p /etc/sysctl.d/99-kubernetes-cri.conf
```

### 修改 DNS

禁用 `systemd-resolved.service` 此处手动管理 `/etc/resolv.conf`

```bash
systemctl disable --now systemd-resolved.service
# 执行
cat /etc/resolv.conf
# 输出结果
nameserver 114.114.114.114
nameserver 8.8.8.8
```

## 安装 `Kubeadm`

我这里使用阿里云提供的镜像源作为安装 `Kubeadm` 加速

### 安装依赖

```bash
sudo apt-get update && api install vim curl -y
sudo apt-get install -y apt-transport-https
```

### 安装 GPG 证书

```bash
sudo curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add -
```

### 写入软件源信息

```bash
sudo cat <<EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
EOF
```

### 更新并安装

```bash
sudo apt update
sudo apt-get install -y kubelet kubeadm kubectl
```

## 安装 Containerd

我这里使用阿里云提供的镜像源作为安装 `Containerd` 加速

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
# AMD64
sudo add-apt-repository "deb [arch=amd64] <https://download.docker.com/linux/ubuntu> $(lsb_release -cs) stable"
```

### 更新并安装

```bash
# 卸载 docker
sudo apt-get remove docker-ce docker.io docker
# 安装 containerd
sudo apt install -y containerd.io
```

### 配置 Containerd

#### 生成配置文件

```bash
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml
```

#### 使用 systemd 作为容器的 cgroup driver

```bash
vim /etc/containerd/config.toml
# SystemdCgroup = true
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

#### 配置 Containerd 开机启动

```bash
systemctl enable containerd --now
```

### 启动 Containerd

```bash
sudo systemctl start containerd
```

## 创建 Kubernetes 集群

### 在 master 上执行

```bash
sudo kubeadm init --pod-network-cidr 172.16.0.0/16  \
--apiserver-advertise-address=10.211.55.9 \
--image-repository registry.cn-hangzhou.aliyuncs.com/google_containers \
--cri-socket /run/containerd/containerd.sock
```

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

初始化成功后会生成节点加入集群的命令 在其他节点上执行该命令

### 在 node 上执行

```bash
kubeadm join 10.211.55.9:6443 --token mldghy.xtf4a0u9bw8ltsvu --discovery-token-ca-cert-hash sha256:2b0f87c543d77e0b8f843db47c95985febe17a19de747b064720097db9b9535c
```

## 部署 Flannel 组件

我使用的是 Vxlan 模式

在 master 上执行

下载配置文件

```bash
wget https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
```

修改配置文件 只修改 Network 和 Backend Type

```bash
data:
  cni-conf.json: |
    {
      "name": "cbr0",
      "cniVersion": "0.3.1",
      "plugins": [
        {
          "type": "flannel",
          "delegate": {
            "hairpinMode": true,
            "isDefaultGateway": true
          }
        },
        {
          "type": "portmap",
          "capabilities": {
            "portMappings": true
          }
        }
      ]
    }
  net-conf.json: |
    {
      "Network": "172.16.0.0/16",
      "Backend": {
        "Type": "vxlan"
      }
    }
---
```

执行

```bash
kubectl apply -f kube-flannel.yaml
```

## 查看集群状态

```bash
# 执行
kubectl get nodes -o wide
# 输出结果
NAME      STATUS   ROLES           AGE    VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION      CONTAINER-RUNTIME
home-01   Ready    control-plane   15d    v1.24.0   10.211.55.9    <none>        Ubuntu 20.04.3 LTS   5.13.0-25-generic   containerd://1.6.4
home-02   Ready    <none>          15d    v1.24.0   10.211.55.5    <none>        Ubuntu 20.04.3 LTS   5.13.0-25-generic   containerd://1.6.4
home-03   Ready    <none>          15d    v1.24.0   10.211.55.11   <none>        Ubuntu 20.04.3 LTS   5.13.0-25-generic   containerd://1.6.4
home-04   Ready    <none>          5d6h   v1.24.0   10.211.55.12   <none>        Ubuntu 20.04.3 LTS   5.13.0-25-generic   containerd://1.6.4
```

## FAQ

可以在每台机器上让 kubelet 开机启动

```bash
sudo systemctl enable kubelet.service
```

涉及 DNS 问题可以考虑关掉 DNS 管理服务
参考 [https://icloudnative.io/posts/resolvconf-tutorial/](https://icloudnative.io/posts/resolvconf-tutorial/)
