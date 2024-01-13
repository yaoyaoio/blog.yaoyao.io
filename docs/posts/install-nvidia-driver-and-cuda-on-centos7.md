---
title: 在 Centos7 上安装 Nvidia 驱动和 CUDA Toolkit
date: 2023-07-11
author: 耀耀
layout: post
useHeaderImage: true
headerImage: https://i.yaoyao.io/cover/cover-gpu-ai.png
hide: 
categories: env
tags:
  - env
published: 2024-01-13T19:32:00
lastUpdated: 2024-01-13T19:32:00
publish: true
---


## 前言

这是一台 Centos7.9 和 带有三块 3060 显卡的服务器。并且操作系统是最小化安装。无图形化界面。

查看操作系统信息

```bash
uname -m && cat /etc/redhat-release
```

查看显卡信息

```bash
lspci | grep -i nvidia
```

## 可选

检查当前系统版本和硬件能够升级到的驱动版本

```bash
# 安装nvida-detect
sudo yum install -y https://www.elrepo.org/elrepo-release-7.el7.elrepo.noarch.rpm
sudo yum install -y nvidia-detect
# 执行检测
nvidia-detect -v
```

## 开始

### 安装依赖

安装 Linux 内核开发包

```bash
sudo yum install -y kernel-devel-`(uname -r)` kernel-headers-`(uname -r)`
```

安装 GCC 工具链

```bash
sudo yum install -y gcc gcc-devel make
```

安装常用的工具

```bash
sudo yum install -y vim wget curl
```

安装其他依赖

```bash
sudo yum install -y mesa-libGLU freeglut
```

### 安装 Nvidia 驱动

访问 Nvidia [官方驱动下载网站](https://www.nvidia.com/Download/index.aspx)。

操作系统信息和显卡信息获取最新的 Nvidia 驱动版本。

![https://i.yaoyao.io/blog/nvidia-driver-choose.png](https://i.yaoyao.io/blog/nvidia-driver-choose.png)

点击 `Search` 跳到以下页面。

![https://i.yaoyao.io/blog/nvidia-driver-confirm.png](https://i.yaoyao.io/blog/nvidia-driver-confirm.png)

点击 `Download` 跳到以下页面。

![https://i.yaoyao.io/blog/nvidia-driver-download.png](https://i.yaoyao.io/blog/nvidia-driver-download.png)

右键复制下载链接在机器上下载驱动

```bash
wget https://us.download.nvidia.com/XFree86/Linux-x86_64/535.54.03/NVIDIA-Linux-x86_64-535.54.03.run
```

安装

```bash
sh NVIDIA-Linux-x86_64-535.54.03.run
```

验证 运行`nvidia-smi`并看到您的 GPU 名称、驱动程序版本和 CUDA 版本。这时代表已经安装成功。

```bash
nvidia-smi
```

如图所示：

![https://i.yaoyao.io/blog/nvidia-smi.png](https://i.yaoyao.io/blog/nvidia-smi.png)

### 安装 CUDA Toolkit 驱动

选择要安装的驱动版本

访问 Nvidia [CUDA Toolkit 下载网站](https://www.nvidia.com/Download/index.aspx)，选择最新的 CUDA Toolkit 驱动版本。在这里我选择了 `12.2.0(June 2023)`。

在这里 NVIDIA 驱动已经包含在`CUDA Toolkit`中，无需单独下载。

![https://i.yaoyao.io/blog/nvidia-cuda-toolkit-archive.png](https://i.yaoyao.io/blog/nvidia-cuda-toolkit-archive.png)

在这里根据您的实际操作系统选择目标平台。并且在这里我使用了`runfile`进行安装。

![https://i.yaoyao.io/blog/nvidia-cuda-toolkit-select-platform.png](https://i.yaoyao.io/blog/nvidia-cuda-toolkit-select-platform.png)

上面选择完毕后会出现下载链接及安装方法。

![https://i.yaoyao.io/blog/nvidia-cuda-toolkit-download.png](https://i.yaoyao.io/blog/nvidia-cuda-toolkit-download.png)

复制下载链接在机器上下载 CUDA Toolkit

```bash
wget https://developer.download.nvidia.com/compute/cuda/12.2.0/local_installers/cuda_12.2.0_535.54.03_linux.run
```

安装 CUDA Toolkit

```bash
sh cuda_12.2.0_535.54.03_linux.run
```

第一步 会弹出这个对话框 输入`accept` 回车即可

![https://i.yaoyao.io/blog/nvidia-cuda-install-start.png](https://i.yaoyao.io/blog/nvidia-cuda-install-start.png)

第二步 选择你要安装的驱动 如果你没有安装 Nvidia 驱动 可以选中 Driver 及版本。

如果你已经安装了 Nvidia 驱动。这里就不要勾选了。最后选中 `Install` 并回车。

![https://i.yaoyao.io/blog/nvidia-cuda-install-choose.png](https://i.yaoyao.io/blog/nvidia-cuda-install-choose.png)

安装成功后会输出以下内容。这表示 NVIDIA Driver 和 CUDA Toolkit 已安装完毕。

![https://i.yaoyao.io/blog/nvidia-cuda-install-done.png](https://i.yaoyao.io/blog/nvidia-cuda-install-done.png)

### 配置环境变量

编辑 `~/.bashrc` 文件

```bash
vim ~/.bashrc
```

写入以下内容

```bash
# add bin
export PATH=$PATH:/usr/local/cuda-12.2/bin
# add lib
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/cuda-12.2/lib64:/usr/lib/x86_64-linux-gnu
```

生效环境变量

```bash
source ~/.bashrc
```

## 验证与测试

可以使用 cuda 自带的测试样例程序进行测试

直行以下命令

```bash
/usr/local/cuda/extras/demo_suite/deviceQuery
```

deviceQuery 将输出 CUDA 的相关信息

如图所示：

![https://i.yaoyao.io/blog/nvidia-demo-devicequery.png](https://i.yaoyao.io/blog/nvidia-demo-devicequery.png)

## FAQ

1. CUDA Toolkit 的不同版本对 Nvidia 驱动版本有要求，具体可以查看这里：

    - https://docs.nvidia.com/cuda/cuda-toolkit-release-notes/index.html#cuda-toolkit-major-component-versions

2. 如果你之前安装过，需要执行卸载命令
   ```bash
   sudo /usr/bin/nvidia-uninstall
   ```
