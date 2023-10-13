---
title: 使用 Surge && Mac mini 构建家庭网关
date: 2023-04-11
author: 耀耀 # 博客作者（可选，不填的话会使用 `themeConfig.personalInfo.name`）
useHeaderImage: true # 是否在博客中显示封面图（可选，默认：false）
headerImage: https://i.yaoyao.io/blog/unsplash-macmini-1.jpg # 博客封面图（必须，即使上一项选了 false，因为图片也需要在首页显示）
headerMask: rgba(40,57,101, .4)  # 封面图遮罩（可选）
headerImageCredit: Ed Orozco # 图片来源，比如图片作者的名字（可选，只在 "useHeaderImage: true" 时有效）
headerImageCreditLink: https://unsplash.com/photos/IITaO-_w58A  # 图片来源的链接（可选，只在 "useHeaderImage: true" 时有效）
catalog: true # 是否启用右侧目录，会覆写 `themeConfig.catalog`（可选，默认：false）
hide: false # 是否在首页和标签页博客列表中隐藏这篇博客（可选，默认：false）
---
---

## 前言

自从去年开始，我一直在使用 `Surge for Mac` 和 `Surge for iOS`，我发现它们非常棒。 它们允许我捕获网络流量并根据规则进行路由到不同梯子/机场。还可以在工作中使用它进行抓包。 今年三月，`Surge` 老板宣布了一个名为 `Surge Ponte` 的新功能，类似于 `Tailsacle`。我试用了一下， 发现这个功能在网关上使用会更好。有了 `Surge Ponte`，我现在可以在离家时连接到家庭网络。 为了进行 `Surge 网关` 和 `Surge Ponte` 的实验，我借了一台 `Mac mini`。


## 我的设备

- Mac mini 2020, Apple M1, 16GB Memory, 1TB SSD, 1Gb Ethernet。
- 一根六类网线。
- Surge for Mac 5、Surge for iOS 5.4.0。
- MacBook Pro、iPhone 14 Pro、若干内网设备。
- 若干个机场。

## 设置静态 IP

如果让 `Mac mini` 开启 `DHCP 服务器` 和 `网关模式`。需要 `Mac mini` 使用有线网络，并且配置 `静态 IP`。 我使用 一根六类网线 将 `Mac mini` 和我的 `WIFI 路由器` 进行连接。我家的 `WIFI 路由器 IP` 为 `10.10.0.1`，子网掩码为 `255.255.0.0`。所以在这里我的 `Mac mini` 使用 `10.10.0.2`。

在 `Mac mini` 上左上角点击 `苹果图标` 选择 `系统偏好设置` 在选择 `网络` ，在 `网络` 界面里 `左侧` 选择 `以太网`。在右侧进行以下配置：

配置 IPv4：`手动`

路由器：`10.10.0.1` （WIFI 路由器（网关）

IP 地址：`10.10.0.2`

最后点击 `应用`

![https://i.yaoyao.io/blog/mac-eth-set-env.png](https://i.yaoyao.io/blog/mac-eth-set-env.png)

## 配置 DHCP 服务

在这里，我将 DHCP 功能从 WIFI 路由器转移到了 `Mac mini` 上的 `Surge` 。因此，需要先关闭 WIFI 路由器上的 DHCP 功能。然后在 `Mac mini` 上启用 `Surge` 上的 DHCP 功能。因为每个人的 WIFI 路由器设备不一样，所以在 WIFI 路由器上关掉 DHCP 功能就不演示了。让我们从 `Surge` 开始吧。

### 开启 DHCP 服务

`Surge` 开启 `DHCP` 功能有 2 种方式：

第一种：`Surge 界面` 中左侧选择 `概览` 右侧会出现 `DHCP 服务器` 然后点击它

第二种：`Surge 界面` 中左侧选择 `设备` 右侧会出现 `DHCP 服务器` 然后点击它

在这里我选择了 `第一种` 方式。

在这里 `Sugre` 会提示你一些信息，你可以仔细看一下，了解一下它的功能及需要满足的需求，如果没什么问题就点击 `下一步`。

![https://i.yaoyao.io/blog/surge-for-mac-dhcp-start.png](https://i.yaoyao.io/blog/surge-for-mac-dhcp-start.png)

### 选择网络设备

如果 `Mac mini` 使用无线网络，这里的选择框会为空，当 `Mac mini` 接入有线网络之后在这里就能选择 `Ethernet` 网络设备。选择完之后。请点击 `下一步`。

![https://i.yaoyao.io/blog/surge-for-mac-dhcp-eth.png](https://i.yaoyao.io/blog/surge-for-mac-dhcp-eth.png)

### 检查 DHCP

这里会进行检查，如果上面配置没问题，这里可以很快就通过进行下一步了。

![https://i.yaoyao.io/blog/surge-for-mac-dhcp-check.png](https://i.yaoyao.io/blog/surge-for-mac-dhcp-check.png)

### 配置 DHCP 网络参数

在这里，您可以配置与 `DHCP` 相关的网络参数。如果没有特殊的需求，您可以不进行任何更改。如果您想更改 `DNS 地址` 或 `DHCP 可分配的 IP 段`，您可以进行修改。完成后，请点击 `完成`。

![https://i.yaoyao.io/blog/surge-for-mac-dhcp-set.png](https://i.yaoyao.io/blog/surge-for-mac-dhcp-set.png)

### 查看设备

一旦上述配置正确，您就可以在 `Surge` 的界面中在左侧点击 `设备`，查看局域网中已经使用 `Surge DHCP` 服务的设备列表。如果您的电脑不在该列表中，可以尝试重启 Wi-Fi 或重启网卡。

![https://i.yaoyao.io/blog/surge-for-mac-dev-list.png](https://i.yaoyao.io/blog/surge-for-mac-dev-list.png)

## 开启网关模式

如果使用 `Surge` 作为网关来接管局域网内其他所有设备的网络请求，需要开启增强模式。并修改被接管设备的网关和子网掩码等信息。

### 启动增强模式

`Surge` 开启增强模式有 2 种方式：

第一种：`Surge 界面` 中左侧选择 `活动` 右侧会出现 `增强模式` 然后点击它

第二种：`Surge 界面` 中左侧选择 `概览` 右侧会出现 `增强模式` 然后点击它

在这里我选择了 `第一种` 方式。

在这里 `Surge` 会提示一些说明。如果没什么问题请点击 `继续`。

![https://i.yaoyao.io/blog/surge-for-mac-enhanced-start.png](https://i.yaoyao.io/blog/surge-for-mac-enhanced-start.png)

如果开启成功。`概览` 界面会显示增强模式已激活。

![https://i.yaoyao.io/blog/surge-for-mac-overview.png](https://i.yaoyao.io/blog/surge-for-mac-overview.png)

### 手动接管设备

如果将某个设备的网关改为 `Sugre` 接管。需要在设备列表。右键点击该设备。选择 `使用 Surge 作为网关`。如果您的目标不在该列表中，可以尝试重启 Wi-Fi 或重启网卡。

![https://i.yaoyao.io/blog/surge-for-mac-dev-gw-1.png](https://i.yaoyao.io/blog/surge-for-mac-dev-gw-1.png)

### 选择由 Surge 接管

在这里会提示如果使用 `Surge` 接管的一些说明。如果没问题。点击 `继续`。

![https://i.yaoyao.io/blog/surge-for-mac-dev-gw-2.png](https://i.yaoyao.io/blog/surge-for-mac-dev-gw-2.png)

### 重启被接管设备网络

我在我的 `MacBook Pro` 上手动对 `WIFI` 进行重启。

![https://i.yaoyao.io/blog/surge-for-mac-dev-gw-3.png](https://i.yaoyao.io/blog/surge-for-mac-dev-gw-3.png)

### 查看被接管设备流量

当设备被 `Surge` 接管之后 可以查看该设备的流量信息。在左下角 `请求查看器` 里可以查看该设备的请求信息。

![https://i.yaoyao.io/blog/surge-for-mac-dev-gw-4.png](https://i.yaoyao.io/blog/surge-for-mac-dev-gw-4.png)

### 设置固定 IP

如果要将某个设备的 IP 设置为固定 IP，需要在设备列表，右键点击该设备，选择 `设置固定 IP 地址`。

![https://i.yaoyao.io/blog/surge-for-mac-dev-set-static-ip-1.png](https://i.yaoyao.io/blog/surge-for-mac-dev-set-static-ip-1.png)

设置 IP 地址，将出现一个输入框。只需输入所需的 IP 地址，然后单击 `分配`。然后重启该设备 WIFI 。即可获得固定 IP 。

![https://i.yaoyao.io/blog/surge-for-mac-dev-set-static-ip-2.png](https://i.yaoyao.io/blog/surge-for-mac-dev-set-static-ip-2.png)

## 管理 Surge

### 管理配置文件

`Surge for Mac` 默认情况下会将 `配置存储路径` 设置为 `/Users/{用户名}/Library/Application Support/Surge/Profiles` ，但是因为我不希望每次对 `Mac mini` 上的 `Surge` 修改配置文件时需要接显示器鼠标键盘。因为毕竟当成软路由来用，肯定是放在角落里。所以我在 `iCloud` 里创建了 `Surge` 目录，然后将 `配置存储路径` 改为 `iCloud/Surge` 存储。并且设置 `当配置被从外部程序或远端修改后自动重新载入`。这样我在其他苹果设备上对该配置文件修改后。就可以自动生效了。

![https://i.yaoyao.io/blog/surge-for-mac-profile.png](https://i.yaoyao.io/blog/surge-for-mac-profile.png)

`iCloud/Surge` 文件夹也可以由`Surge for iOS` 自动创建。步骤为`iPhone` → `Surge for iOS` → `更多` → `配置同步` → `iCloud 云盘`。默认就会在`iCloud`里创建`Surge`文件夹。

![https://i.yaoyao.io/blog/surge-for-ios-profile-sync.png](https://i.yaoyao.io/blog/surge-for-ios-profile-sync.png)

使用`Mac Book Pro` 可以在 `iCloud` 中看到 `Surge` 文件夹。

![https://i.yaoyao.io/blog/surge-for-mac-icloud.png](https://i.yaoyao.io/blog/surge-for-mac-icloud.png)

我在 `Mac Book Pro` 上使用 `vscode` 管理 `Surge` 配置文件。

![https://i.yaoyao.io/blog/surge-config-vscode.png](https://i.yaoyao.io/blog/surge-config-vscode.png)

### 远程管理

在 `Mac mini` 上开启 `远程控制器` 和 `HTTP API` 。这样在 `MacBook Pro` 上使用 `Surge` 进行链接，查看请求信息等。并且可以在 `iPhone` 上使用 `Surge for iOS` 对 `Mac mini` 上的 `Surge for Mac` 进行配置修改等。

开启远程控制器并设置访问密码

![https://i.yaoyao.io/blog/surge-for-mac-settings-remote.png](https://i.yaoyao.io/blog/surge-for-mac-settings-remote.png)

在其他Mac设备上可以配置`连接到其他设备` 。配置新的控制台。保存并连接。

![https://i.yaoyao.io/blog/surge-for-mac-connent-remote.png](https://i.yaoyao.io/blog/surge-for-mac-connent-remote.png)

在 `iPhone`上可以在工具里配置远程控制器。远程管理网关。

![https://i.yaoyao.io/blog/surge-for-ios-remote-controller.png](https://i.yaoyao.io/blog/surge-for-ios-remote-controller.png)

## 代理策略&&规则

### 代理策略

我这里将自建的梯子全都放到了代理中。如果有的梯子协议不被Surge支持。可以考虑在本机运行一个客户端暴露SOCK5协议端口。在从Surge里创建一个代理转发到这个端口上。

我将策略组分为五种： 机场、自建、地区、业务、默认。

![https://i.yaoyao.io/blog/surge-for-mac-policy-list.png](https://i.yaoyao.io/blog/surge-for-mac-policy-list.png)

### 规则

我把规则进行分类、使用 `# > 注释内容` 作为注释标明不同类型。并且使每个规则都使用不同的策略。这样有个好处是如果我希望使用HK节点访问Google，不需要在这里重新将规则更换HK策略。而是在策略里对Google策略进行修改即可。

![https://i.yaoyao.io/blog/surge-for-mac-rule-list.png](https://i.yaoyao.io/blog/surge-for-mac-rule-list.png)

## Surge Ponte

`Surge Ponte` 是一种在运行 `Surge Mac` 和 `iOS` 设备之间的私有 mesh 网络。使用 `Surge Ponte` 可以将所有的苹果设备全部放在一个局域网内。让使用者成为真正的数字游民。无论在哪都可以访问其他苹果设备。更多内容可以查看 [Surge Ponte 指引](https://kb.nssurge.com/surge-knowledge-base/v/zh/guidelines/ponte)

### 启用 Surge Ponte

在 `Surge 界面` 中左侧选择 `概览` 右侧会出现 `Surge Ponte` 然后点击它

![https://i.yaoyao.io/blog/surge-for-mac-ponte-start.png](https://i.yaoyao.io/blog/surge-for-mac-ponte-start.png)

### 通过代理进行 NAT 穿透

Surge 会测试当前网络的 NAT 类型。我这里选择 `通过代理进行 NAT 穿透`

![https://i.yaoyao.io/blog/surge-for-mac-ponte-select-2.png](https://i.yaoyao.io/blog/surge-for-mac-ponte-select-2.png)

因为我选择了通过代理的 NAT 穿透。所以我这里选择一个支持 UDP 中继的代理。这个地方要注意，作为中继代理即需要支持UDP也要支持FULL CONE NAT才行。要不然检测时候会失败。

![https://i.yaoyao.io/blog/surge-for-mac-ponte-select-2-proxy.png](https://i.yaoyao.io/blog/surge-for-mac-ponte-select-2-proxy.png)

为当前设备选择一个名称，例如 MyMacMini。名称不区分大小写，只能包含字母、数字、下划线和连字符。

![https://i.yaoyao.io/blog/surge-for-mac-ponte-uname.png](https://i.yaoyao.io/blog/surge-for-mac-ponte-uname.png)

设置完成后。这里会显示就绪状态。使用 iOS 设备就可以使用它了。

![https://i.yaoyao.io/blog/surge-for-mac-ponte-wait.png](https://i.yaoyao.io/blog/surge-for-mac-ponte-wait.png)

![https://i.yaoyao.io/blog/surge-for-mac-ponte-ready.png](https://i.yaoyao.io/blog/surge-for-mac-ponte-ready.png)

## 总览

这里显示了我目前开启的服务。

![https://i.yaoyao.io/blog/surge-for-mac-overview-ponte.png](https://i.yaoyao.io/blog/surge-for-mac-overview-ponte.png)

## 常见问题

### 被接管的设备不要手动设置DNS

如果手动设置DNS。会导致无法被网关正常接管和无法使用网关策略。并且在网关上无法看到域名。

## 参考资料

- [https://qust.me/post/MacSurgeRouter/#2-配置-surge-dhcp-接管网络](https://qust.me/post/MacSurgeRouter/#2-%E9%85%8D%E7%BD%AE-surge-dhcp-%E6%8E%A5%E7%AE%A1%E7%BD%91%E7%BB%9C)
- [https://nssurge.zendesk.com/hc/zh-cn/articles/4566381481497-为什么-TCP-请求仅能看到-IP-无法看到域名](https://nssurge.zendesk.com/hc/zh-cn/articles/4566381481497-%E4%B8%BA%E4%BB%80%E4%B9%88-TCP-%E8%AF%B7%E6%B1%82%E4%BB%85%E8%83%BD%E7%9C%8B%E5%88%B0-IP-%E6%97%A0%E6%B3%95%E7%9C%8B%E5%88%B0%E5%9F%9F%E5%90%8D)
- [https://blog.indigo.codes/2020/04/24/home-network-deployment/](https://blog.indigo.codes/2020/04/24/home-network-deployment/)
- [https://kb.nssurge.com/surge-knowledge-base/v/zh/](https://kb.nssurge.com/surge-knowledge-base/v/zh/)
- h[ttps://github.com/CareyWang/sub-web](https://github.com/CareyWang/sub-web)
- [https://github.com/blackmatrix7/ios_rule_script/tree/master/rule/Surge](https://github.com/blackmatrix7/ios_rule_script/tree/master/rule/Surge)
- [https://book.surge.ga/surge-ios/](https://book.surge.ga/surge-ios/)
- [https://github.com/Rabbit-Spec/Surge](https://github.com/Rabbit-Spec/Surge)
