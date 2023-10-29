---
title: 如何在 Ubuntu 20 04 运行 WireGuard
author: 耀耀
date: 2023-03-20
tags:
- Ubuntu
- WireGuard
layout: Post
useHeaderImage: true # 是否在博客中显示封面图（可选，默认：false）
headerImage: /img/in-post/cover-ubuntu-wg.webp # 博客封面图（必须，即使上一项选了 false，因为图片也需要在首页显示）
headerMask: rgba(40,57,101, .4)  # 封面图遮罩（可选）
headerImageCredit: Ideun Kim # 图片来源，比如图片作者的名字（可选，只在 "useHeaderImage: true" 时有效）
headerImageCreditLink: https://www.artstation.com/artwork/8wNkQx  # 图片来源的链接（可选，只在 "useHeaderImage: true" 时有效）
---

本文介绍了如何在 Ubuntu 20.04 上运行 WireGuard VPN 协议，包括安装 WireGuard、生成密钥对、编写 WireGuard 配置、启动 WireGuard、将客户端添加到服务端等步骤。WireGuard 相比其他 VPN 协议更简单、更快速、更安全，适用于 Linux、Windows、macOS、Android 和 iOS 等平台。更多详细信息，请参阅 [WireGuard 官方文档](https://www.wireguard.com/quickstart/) 。

## 我的环境

我使用两台腾讯云轻量级服务器，在本地使用一台 `Mac` 运行 `Surge` 作为客户端。

我的电脑: `MacBook Pro (14-inch, 2021)`, `Ventura 13.2`, `M1 Max (ARM64,aarch64)`

远程 Linux 环境: `Ubuntu 20.04 LTS(5.4.0-121-generic)` in `Tencent Cloud`

## 前置条件

### 内核依赖

使用 `WireGuard` 需要 Linux 内核版本 4.1 或更高版本。在 `Ubuntu 20.04` 中，内核版本符合要求，因此可以直接安装并使用 `WireGuard`。

如果您不确定内核是否支持，可以使用 `modinfo wireguard` 查看

```bash
// 执行命令
modinfo wireguard
// 输出结果
filename:       /lib/modules/5.4.0-121-generic/kernel/wireguard/wireguard.ko
...
```

### 私有 IP 段

WireGuard 组网的 IP 段需要选择私有 IP 段，不要使用公网 IP 段。并且不能和你使用的网络 IP 段冲突，例如，您可以使用 `192.168.x.x` 或 `10.x.x.x` 等私有 IP 段。在本文档中，我使用 `192.168.100.1/24` 做为 WireGuard 私有段。 中继节点的 IP 地址为 `192.168.100.1`，Peer 节点的 IP 地址为 `192.168.100.2` 。Mac 的 IP 地址为 `192.168.100.3`

### 保证唯一

在 WireGuard 网络中，每一个 Peer 设备都对应一个 IP、一个公钥、一个私钥，需要保证不能冲突。并且在 WireGuard 中，需要手动给各个设备分配 IP。

### 防火墙

如果你的服务器在云服务提供商，你需要在安全组中放开以下配置的端口.，例如：`udp 51820`。

如果在服务器上使用 `ufw`，请关闭 `ufw` 或开放下面配置的端口。 例如：`udp 51820`。

## 中继节点 与 Peer 节点

在 WireGuard 协议中，中继节点使用一台服务器来整合所有对等节点的流量并将其路由到互联网，从而实现虚拟专用网络（VPN）连接。对等节点是指使用 WireGuard 协议的客户端设备，它们之间可以直接通信，而无需通过中继节点。对等节点可以是任何支持 WireGuard 协议的设备，例如计算机、手机、路由器等等。在 WireGuard 中，中继节点和对等节点的配置方式也略有不同。中继节点需要配置 WireGuard 服务器，生成密钥对，编写 WireGuard 配置文件，设置内核参数，关闭防火墙等。而对等节点则需要生成自己的密钥对，编写 WireGuard 配置文件，将配置文件发送给 WireGuard 服务器，然后启动 WireGuard 客户端即可连接到 WireGuard 中。

**在本文中，我认为中继节点可以理解为服务端，而 Peer 节点则可以理解为客户端。因此，当文中出现“中继节点”一词时，可以将其理解为服务端；当出现“Peer 节点”一词时，可以将其理解为客户端。反之亦然。**

## 配置中继节点

### 安装 WireGuard

```bash
sudo apt update && sudo apt install wireguard
```

### **生成密钥对**

```bash
wg genkey | sudo tee /etc/wireguard/privatekey | wg pubkey | sudo tee /etc/wireguard/publickey
```

或者使用以下命令

```bash
sudo mkdir /etc/wireguard
cd /etc/wireguard
wg genkey | tee privatekey
wg pubkey < privatekey > publickey
```

生成的私钥将保存在 `/etc/wireguard/privatekey` 中，公钥将保存在 `/etc/wireguard/publickey` 中。

`tee`  命令用于读取标准输入的数据，并将其内容输出成文件。

您可以使用 `cat` 命令查看私钥和公钥。**切记不要泄露私钥给任何一个人。**

### 编写 WireGuard **配置**

WireGuard 使用 [INI](https://zh.wikipedia.org/wiki/INI%E6%96%87%E4%BB%B6) 语法作为其配置文件格式。配置文件可以放在任何路径下，但必须通过绝对路径引用。默认路径是 `/etc/wireguard/wg0.conf`。

配置文件的命名形式必须为 `${WireGuard 接口的名称}.conf`。通常情况下 WireGuard 接口名称以 `wg` 为前缀，并从 `0` 开始编号，但你也可以使用其他名称，只要符合正则表达式 `^[a-zA-Z0-9_=+.-]{1,15}$`。在这里我使用 `wg0` 作为配置文件名称。

创建配置文件

```bash
sudo vim /etc/wireguard/wg0.conf
```

添加以下内容

```bash
[Interface]
Address = 192.168.100.1/24
SaveConfig = true
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
ListenPort = 51820
PrivateKey = {这是你上面生成的私钥}
```

 字段说明:

- `Address`：`wg0` 接口的 IPv4 或 IPv6 的地址。请使用保留给私有网络范围内的 IP 地址。不要和你已经使用的网络段冲突。
- `SaveConfig`：在 WireGuard 关闭时自动保存配置。
- `PostUp`：在 WireGuard 启动后执行的命令 。
- `PostDown`：在 WireGuard 关闭后执行的命令。
- `ListenPort`：WireGuard 服务器监听的端口。
- `PrivateKey`：WireGuard 服务器的私钥。

`PostUp` 和 `PostDown` 中的网络接口名称需要替换真实的也就是 `-A POSTROUTING` 后面的 `eth0`。您可以通过以下 ip 命令方式轻松找到可访问网络的接口。

```bash
ip -o -4 route show to default | awk '{print $5}'
```

### 配置内核参数

为了让 WireGuard 中继节点转发数据包，需要设置内核参数 `net.ipv4.ip_forward=1` 和 `net.ipv4.conf.all.proxy_arp=1`。其中，`net.ipv4.ip_forward=1` 允许 Linux 内核将数据包从一个网络接口转发到另一个网络接口，`net.ipv4.conf.all.proxy_arp=1` 则允许 Linux 内核在本地网络中拦截 ARP 请求并向请求方提供本地主机的 MAC 地址，从而实现数据包的转发。

打开配置文件

```bash
sudo vim /etc/sysctl.conf
```

新增以下内容

```bash
net.ipv4.ip_forward=1
net.ipv4.conf.all.proxy_arp = 1
```

生效配置

```bash
sudo sysctl -p /etc/sysctl.conf
```

### 关闭防火墙

由于在 `Ubuntu 20.04` 上默认使用的是 `ufw` 防火墙，需要使用以下命令关闭防火墙。

```bash
sudo ufw disable
```

### 启动 WireGuard

```bash
// 执行命令
sudo wg-quick up wg0
// 输出结果
[#] ip link add wg0 type wireguard
[#] wg setconf wg0 /dev/fd/63
[#] ip -4 address add 192.168.100.1/24 dev wg0
[#] ip link set mtu 1420 up dev wg0
[#] iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

### 检查状态

```bash
// 执行命令
sudo wg show wg0
// 输出结果
interface: wg0
  public key: {你的公钥}
  private key: (hidden)
  listening port: 51820
  fwmark: 0xca6c
```

### 设置开机自启

```bash
sudo systemctl enable wg-quick@wg0.service
```

## 配置 Peer 节点

现在，您已经在 `Ubuntu 20.04` 上成功运行了 `WireGuard 中继节点 `，下一步是配置 `Peer 节点 `。您可以在任何支持 `WireGuard` 协议的设备上安装客户端，例如 Windows、macOS、Android、iOS、路由器等等。这里提供的是 `Ubuntu 20.04` 客户端的安装过程。

### 安装 WireGuard

```bash
sudo apt update && sudo apt install wireguard
```

### 生成密钥对

```bash
wg genkey | sudo tee /etc/wireguard/privatekey | wg pubkey | sudo tee /etc/wireguard/publickey
// 或者使用以下命令
mkdir /etc/wireguard
cd /etc/wireguard
wg genkey | tee privatekey
wg pubkey < privatekey > publickey
```

### 编写 WireGuard **配置**

创建配置文件：

```bash
sudo vim /etc/wireguard/wg0.conf
```

添加以下内容：

```bash
[Interface]
Address = 192.168.100.2/24
PrivateKey = {这是你上面生成的私钥}

[Peer]
PublicKey = {这是你在中继节点上生成的公钥}
Endpoint = {你的 WireGuard 中继节点公网 IP}:51820
AllowedIPs = 192.168.100.1/32
PersistentKeepalive = 21
```

字段说明:

- `Address`：客户端的 IP 地址。
- `PrivateKey`：客户端的私钥。
- `PublicKey`：服务器上的公钥。
- `Endpoint`：服务器的 IP 地址和端口，这个 IP 地址是公网可访问的 IP 地址。
- `AllowedIPs`：客户端可以访问的 IP 地址范围。
- `PersistentKeepalive`：客户端发送心跳包的频率，单位为秒。

### 启动 WireGuard

```bash
sudo wg-quick up wg0
```

现在您已经成功配置了 WireGuard 客户端。

## 将 Peer 节点添加到中继节点

### 通过编辑配置文件添加

要将 Peer 节点添加到中继节点上，您需要将 Peer 节点的公钥添加到中继节点的配置文件中。，

在中继节点上编辑 `/etc/wireguard/wg0.conf` 文件

```bash
sudo vim /etc/wireguard/wg0.conf
```

将以下内容添加到文件末尾保存并退出。

```bash
[Peer]
PublicKey = {这是你在Peer 节点上生成的公钥}
AllowedIPs = 192.168.100.2/32
```

### 通过命令行工具添加

```bash
sudo wg set wg0 peer {Peer 节点公钥} allowed-ips {Peer 节点IP}
// 例如
sudo wg set wg0 peer xxxxxx allowed-ios 192.168.100.2
```

现在您的 Peer 节点应该能够成功连接到中继节点了。

## 在中继节点查看状态

您可以在中继节点使用以下命令查看当前的连接状态：

```bash
sudo wg show
```

该命令将输出当前连接的 Peer 节点信息，包括公钥、网络接口名称（例如 `wg0`）、IP 地址、数据流量等。

```bash
interface: wg0
  public key: {中继节点公钥}
  private key: (hidden)
  listening port: 51820
  fwmark: 0xca6c

peer: {Peer 节点公钥}
  endpoint: {Peer 节点公网IP}:64886
  allowed ips: 192.168.100.2/32
  latest handshake: 1 minute, 44 seconds ago
  transfer: 40.12 KiB received, 10.00 KiB sent
```

您可以在中继节点使用 ping 访问 Peer 节点：

```bash
// 执行命令
ping -c 3 192.168.100.2
// 输出结果
PING 192.168.100.2 (192.168.100.2) 56(84) bytes of data.
64 bytes from 192.168.100.2: icmp_seq=1 ttl=63 time=8.50 ms
```

## 最后

没有最后。。。
