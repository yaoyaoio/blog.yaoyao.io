---
title: 如何在 Ubuntu 上配置 eBPF 开发环境
date: 2023-03-30
author: 耀耀
isHome: true
useHeaderImage: true
headerImage: /img/in-post/cover-ebpf.webp
headerMask: rgba(40,57,101, .4)
headerImageCredit: Ideun Kim
headerImageCreditLink: https://www.artstation.com/artwork/8wNkQx
---

## 我的环境

我的电脑: `MacBook Pro (14-inch, 2021)`, `Ventura 13.2`, `M1 Max (ARM64,aarch64)`

本地 Linux 开发环境: `Ubuntu 22.04.2 LTS (5.15.0-60-generic)` in `Parallels Desktop 18 for Mac`

在这里我建议选择大于 `5.0.0` 内核版本的 `Linux` 发行版。可以使用阿里云、腾讯云、Google、AWS、等公有云上的 `Ubuntu`。也可以在你本地电脑上使用 `Parallels Desktop 18 for Mac`、`Vargrant`、等工具创建 `Ubuntu` 虚拟机。

下面安装过程均在 `Ubuntu 22.04.2 LTS (5.15.0-60-generic)` 进行测试。

## 一键安装

如果没有特殊需求或者只是在尝试学习使用 `eBPF` 可以使用以下命令安装：

```shell
sudo apt install -y make clang llvm libelf-dev libbpf-dev bpfcc-tools libbpfcc-dev
sudo apt install -y linux-tools-$(uname -r) linux-headers-$(uname -r) linux-tools-common
```

## LLVM & CLANG

### 默认安装

```bash
sudo apt install clang llvm lld libclang-dev libllvm llvm-dev
```

### 使用官方源安装

你可以使用添加官方源的方式在 `Ubuntu` 上安装指定版本的 `LLVM`：

安装 GPG 证书

```shell
wget -O - https://apt.llvm.org/llvm-snapshot.gpg.key|sudo apt-key add -
```

写入软件源信息，将下面内容添加到 `/etc/apt/sources.list`

```shell
deb http://apt.llvm.org/jammy/ llvm-toolchain-jammy main
deb-src http://apt.llvm.org/jammy/ llvm-toolchain-jammy main
# 15
deb http://apt.llvm.org/jammy/ llvm-toolchain-jammy-15 main
deb-src http://apt.llvm.org/jammy/ llvm-toolchain-jammy-15 main
# 16
deb http://apt.llvm.org/jammy/ llvm-toolchain-jammy-16 main
deb-src http://apt.llvm.org/jammy/ llvm-toolchain-jammy-16 main
```

更新

```shell
sudo apt-get update
```

安装 `LLVM` 工具链

```shell
sudo apt install -y clang-15 lldb-15 lld-15 clangd-15
```

### 使用官方脚本安装（推荐）

默认安装

```shell
wget https://apt.llvm.org/llvm.sh
chmod +x llvm.sh
sudo ./llvm.sh
```

指定版本号

```shell
wget https://apt.llvm.org/llvm.sh
chmod +x llvm.sh
sudo ./llvm.sh 15
```

默认安装所有工具链

```shell
wget https://apt.llvm.org/llvm.sh
chmod +x llvm.sh
sudo ./llvm.sh all
```

指定版本安装所有工具链

```shell
wget https://apt.llvm.org/llvm.sh
chmod +x llvm.sh
sudo ./llvm.sh 16 all
```

如果在 `Ubuntu` 上使用 `apt` 安装 `LLVM` 的更多方法可以参考 [APT LLVM 页面](https://apt.llvm.org/)

如果你需要使用二进制包安装特定版本的 `LLVM`，可以在 [LLVM 下载页面](https://releases.llvm.org/download.html) 上下载相应的版本并手动安装。

### 查看安装路径

如果使用脚本安装，默认情况下会将工具链保存到 `/lib/llvm-{版本}/bin` 下面。并且会将所有的命令创建软连接到 `/usr/bin/` 下面

查看安装目录

```bash
ls -ls /lib/llvm-16/bin/
```

查看软连接

```bash
ls -ls /usr/bin/llvm-*
ls -ls /usr/bin/clang*
```

LLVM 可以多版本共存，但是需要切换环境变量。以免使用不符合要求的版本进行编译。我就在我的开发机器上安装了多个版本的 LLVM。

```bash
ls -l /lib/ |grep llvm
drwxr-xr-x   3 root root  4096 Mar  2 22:25 llvm-11
drwxr-xr-x   7 root root  4096 Feb 25 21:25 llvm-14
drwxr-xr-x   7 root root  4096 Mar 29 22:25 llvm-15
drwxr-xr-x   7 root root  4096 Mar 29 23:15 llvm-16
```

使用环境变量管理 LLVM 及切换默认的 LLVM

将下面内容保存到 `$HOME/.bashrc` 中 并且使用 `source $HOME/.bashrc` 生效该环境变量。

```bash
export LLVM_PATH="/lib/llvm-15"
export PATH="$LLVM_PATH/bin:$PATH"
```

使用 `update-alternatives` 管理多版本 文章最后会举例说一下这个命令的使用。

## bpf.h

`bpf.h` 是 Linux 内核的一部分，通常在安装 Linux 操作系统时就已经包含在内核中。因此，如果你已经安装了 Linux 系统，通常就已经拥有了 `bpf.h` 头文件。但是，不同的 Linux 发行版可能会有不同的内核版本和配置，因此可能会存在某些版本的内核中不包含 `bpf.h` 头文件的情况。

如果你想知道你的 Linux 上是否安装了 `bpf.h` 可以使用 `find` 命令

```shell
sudo find /usr/include/ -name bpf.h
```

输出结果

```shell
/usr/include/linux/bpf.h
```

如果没有找到 `bpf.h` 在这种情况下，你需要安装相应的 `Linux` 内核头文件包，以便在开发和编译 `eBPF` 程序时能够访问 `bpf.h` 头文件。

### 使用包管理工具安装

通常情况下，你可以使用包管理来安装 `Linux` 内核头文件包。例如，在 `Ubuntu` 系统上，你可以使用以下命令安装 `Linux` 内核头文件包：

```shell
sudo apt install linux-headers-$(uname -r)
```

这个命令将安装当前正在运行的内核版本对应的头文件包。安装完成后，你就可以在编写 `eBPF` 程序时使用 `bpf.h` 头文件了。

## libbpf

`libbpf` 是一个用于管理和操作 `eBPF` 代码的库。它提供了一组低级别的 API，用于加载、卸载和管理 `eBPF` 程序和映射，以及与内核中的 `eBPF` 子系统进行交互。

`libbpf` 库的主要功能包括：

- 加载和卸载 `eBPF` 程序和映射

- 与 `eBPF` 程序和映射进行交互，例如查看和修改它们的属性

- 与内核中的 `eBPF` 子系统进行交互，例如获取 `eBPF` 子系统的信息和状态

- 生成 `eBPF` 代码和数据的 ELF 格式文件，以便将其编译为内核模块或用户空间程序

`libbpf` 库的源代码托管在 GitHub 上，可以访问 [libbpf Github](https://github.com/libbpf/libbpf) 查看源代码。

### 安装依赖

```bash
sudo apt install pkg-config
```

### 使用源码编译安装

克隆源码

```shell
git clone https://github.com/libbpf/libbpf.git
cd libbpf
```

编译安装(默认路径)

```shell
cd src
// 编译
sudo make
// 编译安装
sudo make install
```

输出结果

```bash
INSTALL  bpf.h libbpf.h btf.h libbpf_common.h libbpf_legacy.h bpf_helpers.h bpf_helper_defs.h bpf_tracing.h bpf_endian.h bpf_core_read.h skel_internal.h libbpf_version.h usdt.bpf.h
  INSTALL  ./libbpf.pc
  INSTALL  ./libbpf.a ./libbpf.so ./libbpf.so.1 ./libbpf.so.1.2.0
```

### 使用包管理工具安装

```shell
sudo apt install libbpf-dev
```

### 查看安装路径

`libbpf` 库默认安装在 `/usr/lib` 目录下。

如果需要查看 `libbpf.so` 的具体安装位置，可以使用 `find` 命令：

```shell
sudo find /usr/lib -name libbpf.so
// or
sudo find /lib --name libbpf.so
```

头文件默认安装在 `/usr/include/bpf/` 目录下。可以使用 `ls` 命令查看：

```bash
ls -ls /usr/include/bpf/
```

## bcc

`bcc` 是一组用于 `eBPF` 开发的工具，它包括了一组用于编写和调试 `eBPF` 程序的库和命令行工具。使用 `bcc`，可以更加方便地开发和调试 `eBPF` 程序，提高开发效率和代码质量。

### 使用包管理工具安装

在 Ubuntu 上，可以使用以下命令安装 bcc：

```shell
sudo apt update
sudo apt install bpfcc-tools
```

这个命令将安装 bcc 工具集及其依赖项。

### 使用源码编译安装

如果你想自行编译 `bcc` 工具集，可以从 GitHub 上获取源代码并编译、我建议选择一个已经发布的 `release` 版本进行编译。

编译 `bcc` 工具集需要一些依赖项，包括 `clang、llvm、libelf、libbfd` 等。在编译 `bcc` 之前，需要先安装这些依赖项。

安装依赖

```bash
sudo apt install cmake
sudo apt install arping netperf iperf
sudo apt install bison flex
sudo apt install libdebuginfod-dev \
                 liblzma-dev \
                 libluajit-5.1-dev \
                 libcurl4-openssl-dev \
                 libelf-dev \
                 libedit-dev \
                 zlib1g-dev \
                 libfl-dev \
                 build-essential
```

如果你的机器没有 Python 环境则需要安装 Python。

```bash
sudo apt install python3-distutils python3
```

**请确定你已经安装了 CLANG && LLVM 工具链并已配置好默认的环境变量。如果没有安装请查看前面的内容。**

克隆仓库

```bash
git clone https://github.com/iovisor/bcc.git
```

切换到已经发布的 `release` 版本

```bash
cd bcc
git checkout tags/v0.26.0
```

编译

```bash
mkdir build; cd build
cmake .. -DCMAKE_INSTALL_PREFIX=/usr -DENABLE_LLVM_SHARED=1
make
sudo make install
```

安装 Python 模块绑定

```bash
cmake -DPYTHON_CMD=python3 .. # build python3 binding
pushd src/python/
make
sudo make install
popd
```

### 查看安装路径

我们根据以上 ` 编译 ` 步骤可以看日志输出。了解具体安装过程及安装到哪些目录。

以上命令将下载 `bcc` 源代码并编译安装 `bcc` 工具集。编译完成后，你就可以在 `/usr/share/bcc/tools` 目录下找到各种 `bcc` 工具的源代码和示例程序。比如：

可以执行 ` sudo python3 /usr/share/bcc/tools/execsnoop ` 命令来运行 `bcc` 自带的 `execsnoop` 工具。

可以使用 python3 和 bcc 库进行开发

动态库会安装到 `/usr/lib/aarch64-linux-gnu/` 目录下

```bash
ls /usr/lib/aarch64-linux-gnu/libbcc*
```

工具集会安装到 `/usr/share/bcc/` 目录下

```bash
ls -ls /usr/share/bcc/
```

头文件会安装到 `/usr/include/bcc/` 目录下

```bash
ls -ls /usr/include/bcc/
```

如果想了解更多关于 `bcc` 的信息，可以查看 [bcc GitHub](https://github.com/iovisor/bcc) 或者 [bcc 官方文档](https://github.com/iovisor/bcc/blob/master/docs/reference_guide.md) 。

## bpftool

`bpftool` 是一个用于管理和调试 `eBPF` 代码的命令行工具。它允许你查看和分析系统中运行的 `eBPF` 程序和映射，以及与内核中的 `eBPF` 子系统进行交互。更多内容可以查看 [bpftool Github](https://github.com/libbpf/bpftool)

使用 `bpftool`，你可以执行以下操作：

- 列出当前系统中所有加载的 `eBPF` 程序和映射

- 查看指定 `eBPF` 程序或映射的详细信息，例如指令集、内存布局等

- 修改 `eBPF` 程序或映射的属性，例如禁用一个程序或清空一个映射

- 将一个 `eBPF` 程序或映射导出到文件中，以便在其他系统上重新导入

- 调试 `eBPF` 程序，例如跟踪程序的控制流、访问内存等

### 使用包管理工具安装

```shell
sudo apt install -y linux-tools-$(uname -r)
```

### 使用源码编译安装

安装依赖

```shell
sudo apt install build-essential \
        libelf-dev \
        libz-dev \
        libcap-dev \
        binutils-dev \
        pkg-config
```

请确定你已经安装了 CLANG && LLVM 工具链并已配置好默认的环境变量。如果没有安装请查看前面的内容。

克隆仓库

```shell
git clone https://github.com/libbpf/bpftool.git
cd bpftool
git submodule update --init
```

编译

```shell
cd src
sudo make
```

编译结果如下

```shell
...                        libbfd: [ on  ]
...               clang-bpf-co-re: [ on  ]
...                          llvm: [ on  ]
...                        libcap: [ on  ]
...
...
CC       struct_ops.o
CC       tracelog.o
CC       xlated_dumper.o
CC       disasm.o
LINK     bpftool
```

安装到本机

```bash
sudo make install
```

默认情况下 `bpftool` 命令会安装到/`usr/local/sbin/` 下

验证命令

```shell
sudo bpftool v -p
// 输出结果
{
    "version": "7.2.0",
    "libbpf_version": "1.2",
    "features": {
        "libbfd": false,
        "llvm": true,
        "skeletons": true,
        "bootstrap": false
    }
}
```

关于 `libbfd = false` 在 [https://github.com/libbpf/bpftool/releases/tag/v7.1.0](https://github.com/libbpf/bpftool/releases/tag/v7.1.0) 版本说明如下：

增加对使用 LLVM 库（而不是 libbfd）反汇编 JIT 编译程序的支持，并默认切换到 LLVM。如果在构建 bpftool 时不存在 LLVM 库，则仍支持使用 libbfd 进行反汇编作为后备方案

Add support for disassembling JIT-compiled programs with the LLVM library (instead of libbfd), and switch to LLVM by default. Disassembling with libbfd is still supported as a fallback if the LLVM library is not present when building bpftool.

如果你想使用对 `libbfd` 的支持 可以使用 `v7.0.0` 版本。步骤如下：

克隆仓库并切换到 `v7.0.0` 版本

```shell
git clone https://github.com/libbpf/bpftool.git
cd bpftool
git submodule update --init
git checkout tags/v7.0.0
```

编译

```shell
cd src
sudo make
```

验证命令

```shell
sudo ./bpftool v -p
{
    "version": "7.0.0",
    "libbpf_version": "1.0",
    "features": {
        "libbfd": true,
        "libbpf_strict": true,
        "skeletons": true
    }
}
```

### 使用 Linux 源码编译安装安装依赖

安装依赖

```shell
sudo apt install build-essential \
        libelf-dev \
        libz-dev \
        libcap-dev \
        binutils-dev \
        pkg-config
```

如果你已经安装了 CLANG && LLVM 工具链。只要配置好默认的环境变量即可。如果没有安装请查看前面的内容

克隆仓库

在这里建议使用与当前内核版本匹配或兼容的版本。您可以通过运行 `uname -r` 来检查当前内核版本，并使用 `apt-cache search` 搜索可用的 `Linux` 源代码版本。一旦找到所需版本，就可以继续安装过程。

查看当前内核版本

```bash
uname -r
```

搜索 `Linux` 源码

```bash
sudo apt-cache search linux-source
```

安装 `Linux` 源码

默认会将源码安装到 `/usr/src/` 目录下

```shell
sudo apt install linux-source-5.15.0
```

解压

```shell
cd /usr/src/
sudo tar xf linux-source-5.15.0.tar.bz2
```

编译

```shell
cd linux-source-5.15.0/tools
cd bpf/bpftool
make
```

验证命令

```bash
sudo ./bpftool v -p
{
    "version": "5.15.87",
    "features": {
        "libbfd": true,
        "skeletons": true
    }
}
```

## linux-tools

`linux-tools` 包是 Linux 内核源码中包含的一组工具集，它包括了许多用于性能分析、调试和监测的工具，例如 perf、ftrace、bpftrace 等。这些工具可以帮助开发者深入了解系统内部的行为和性能瓶颈，从而优化程序和系统性能。

要查看当前系统中已经安装的 `linux-tools` 工具，可以使用以下命令：

```shell
dpkg -l | grep linux-tools
```

这个命令将列出当前系统中所有已安装的 `linux-tools` 包及其版本号。如果系统中没有安装 `linux-tools` 包，可以使用包管理器安装，例如在 Ubuntu 系统中可以使用以下命令安装：

```shell
sudo apt install linux-tools-$(uname -r)
```

其中，`$(uname -r)` 表示当前正在使用的内核版本号，可以保证安装的 `*linux-tools` 版本与当前内核版本相匹配。安装完成后，可以再次使用上述命令来检查 `linux-tools` 包是否已经安装成功。

需要注意的是，不同版本的 Linux 内核可能会包含不同的 `linux-tools` 工具集，且工具名称和版本也可能会有所不同。在使用 ``linux-tools` 工具时，建议先了解对应版本的工具集和使用方法，以便更好地使用和理解这些工具。

## vmlinux.h

**`vmlinux.h`** 文件是 Linux 内核的一个头文件，通常包含在 Linux 内核头文件包中。如果你想检查系统中是否安装了 **`vmlinux.h`** 文件，可以使用 `find` 命令：

```bash
find /usr/include -name vmlinux.h
```

这个命令将在 **`/usr/include`** 目录下查找 **`vmlinux.h`** 文件，如果存在，则表示系统中已经安装了 Linux 内核头文件包并且包含了 **`vmlinux.h`** 文件。如果未找到 **`vmlinux.h`** 文件，则需要安装 Linux 内核头文件包或者手动安装相应的头文件。

另外，需要注意的是，不同的 Linux 发行版可能会有不同的内核版本和配置，因此可能会存在某些版本的内核中不包含 **`vmlinux.h`** 头文件的情况。在这种情况下，你需要手动编译和安装相应的内核头文件，或者从其他渠道获取 **`vmlinux.h`** 文件。

### 生成 vmlinux.h

```bash
bpftool btf dump file /sys/kernel/btf/vmlinux format c > vmlinux.h
```

使用 `bpftool` 工具可以生成 `vimlinux.h`

## libbfd

如果你想检查是否安装了 `libbfd` 库，可以使用以下命令：

```shell
ldconfig -p | grep libbfd
```

这个命令将列出系统中所有已安装的共享库，并过滤出包含关键字 ``libbfd`` 的库。如果输出结果中包含 `libbfd`，则表示 `libbfd` 库已经安装在系统中。

另外，如果你要在程序中使用 `libbfd` 库，可以使用以下命令检查是否存在 `bfd.h` 头文件：

```shell
find /usr/include -name bfd.h
```

这个命令将在 `/usr/include` 目录下查找 `bfd.h` 文件，如果存在，则表示 `libbfd` 库已经安装在系统中并且可用于编译程序。如果未找到 `bfd.h` 文件，则需要安装 `libbfd` 库或者手动安装相应的头文件。

## Rust

### 安装 Rust

打开终端并输入以下命令以安装

```bash
sudo curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

配置临时环境变量

```bash
source $HOME/.cargo/env
```

使环境变量永久生效

```bash
echo "export PATH='$HOME/.cargo/bin:$PATH'" >> ~/.bashrc
// 或者
exho '. "$HOME/.cargo/env"' > .bashrc
// 生效
source .bashrc
```

确认已安装 Rust

```bash
rustc --version
```

以上步骤完成后，您已成功安装 Rust 。

## FAQ

### <asm/**types.h>**

如果在您的环境中找不到 `<asm/types.h>` 头文件，请根据您的内核版本和架构下载相应的内核头文件包并安装

```bash
sudo apt install linux-headers-$(uname -r)
```

如果您的内核版本或架构与上述示例不同，请相应地替换版本和架构信息。安装完成后，您应该能够在 `/usr/src/linux-headers-5.15.0-60-generic/include/asm` 目录下找到 `<types.h>` 头文件。如果仍然找不到，请参考相关文档或社区寻求帮助。

```bash
sudo ln -s /usr/include/asm /usr/include/$(uname -m)-linux-gnu/asm
```

## 编译依赖

### bpftool 依赖问题

如果在编译 bpftool 命令时候出现和 CLANG && LLVM 依赖为 off 的情况

```bash
...                        libbfd: [ on  ]
...               clang-bpf-co-re: [ off ]
...                          llvm: [ off ]
...                        libcap: [ on  ]
...
...
```

则是因为在编译时期没有找到 `llvm-config、llvm-strip、clang` 上面内容在安装 CLANG && LLVM 工具链的地方讲了如何配置环境变量。在这里我则使用 `update-alternatives` 管理这几个依赖。

`update-alternatives` 命令可以轻松地在系统中安装和管理多个版本的 `clang` 编译器。以下是一个示例，说明如何使用 `update-alternatives` 将 `clang-16` 设置为系统中的默认编译器：

首先，检查系统中是否安装了 `clang-16` 编译器。可以使用以下命令来检查：

```bash
clang-16 --version
```
如果 `clang-16` 编译器已经安装在系统中，则该命令应该输出编译器的版本信息。

使用 `update-alternatives` 命令来注册 `clang-16` 编译器。可以使用以下命令：

```bash
sudo update-alternatives --install /usr/bin/clang clang /usr/bin/clang-16 100
```
该命令将在 `/usr/bin` 目录下创建 `clang` 符号链接，并将其链接到 `clang-16` 可执行文件。100 表示此配置的优先级，表示此配置应该是优先级最高的。

现在，将 `clang-16` 编译器设置为默认编译器。可以使用以下命令：

```bash
sudo update-alternatives --set clang /usr/bin/clang-16
```

该命令将 `/usr/bin/clang` 符号链接设置为链接到 `clang-16` 可执行文件，这样系统中的所有程序都将使用 `clang-16` 编译器进行编译。

可以使用以下命令来验证 `clang` 编译器的版本：

```bash
clang --version
```
如果一切正常，该命令应该输出 `clang-16` 编译器的版本信息。

使用 `pdate-alternatives` 命令来管理不同版本的 `llvm-config` 工具，以便在需要时进行切换。以下是一个示例，说明如何在系统中安装和管理多个版本的 `llvm-config` 工具：

首先，检查系统中是否安装了 `llvm-config` 工具。可以使用以下命令来检查：

```bash
llvm-config --version
```

如果 `llvm-config` 工具已经安装在系统中，则该命令应该输出工具的版本信息。

使用 `update-alternatives` 命令来注册 `llvm-config` 工具。可以使用以下命令：

```bash
sudo update-alternatives --install /usr/bin/llvm-config llvm-config /usr/bin/llvm-config-16 100
```

该命令将在 `/usr/bin` 目录下创建 `llvm-config` 符号链接，并将其链接到 `llvm-config-16` 可执行文件。100 表示此配置的优先级，表示此配置应该是优先级最高的。

现在，将 `llvm-config-16` 工具设置为默认工具。可以使用以下命令：

```bash
sudo update-alternatives --set llvm-config /usr/bin/llvm-config-16
```

该命令将 `/usr/bin/llvm-config` 符号链接设置为链接到 `llvm-config-16` 可执行文件，这样系统中的所有程序都将使用 `llvm-config-16` 工具进行配置。

可以使用以下命令来验证 `llvm-config` 工具的版本：

```bash
llvm-config --version
```

如果一切正常，该命令应该输出 `llvm-config-16` 工具的版本信息。

使用 `update-alternatives` 命令来管理不同版本的 `llvm-strip` 工具。以下是一个示例，说明如何在系统中安装和管理多个版本的 `llvm-strip` 工具：

首先，检查系统中是否安装了 `llvm-strip` 工具。可以使用以下命令来检查：

```bash
llvm-strip --version
```

如果 `llvm-strip` 工具已经安装在系统中，则该命令应该输出工具的版本信息。

使用 `update-alternatives` 命令来注册 `llvm-strip` 工具。可以使用以下命令：

```bash
sudo update-alternatives --install /usr/bin/llvm-strip llvm-strip /usr/bin/llvm-strip-16 100
```

该命令将在 `/usr/bin` 目录下创建 `llvm-strip` 符号链接，并将其链接到 `llvm-strip-16` 可执行文件。100 表示此配置的优先级，表示此配置应该是优先级最高的。

现在，将 `llvm-strip-16` 工具设置为默认工具。可以使用以下命令：

```bash
sudo update-alternatives --set llvm-strip /usr/bin/llvm-strip-16
```

该命令将 `/usr/bin/llvm-strip` 符号链接设置为链接到 `llvm-strip-16` 可执行文件，这样系统中的所有程序都将使用 `llvm-strip-16` 工具进行配置。

可以使用以下命令来验证 `llvm-strip` 工具的版本：

```bash
llvm-strip --version
```

如果一切正常，该命令应该输出 `llvm-strip-16` 工具的版本信息。

请注意，`update-alternatives` 命令需要使用 `sudo` 权限运行，以便在系统级别创建符号链接。还需要根据您的系统设置相应的路径和权限。此外，如果您的系统中已经安装了多个版本的 LLVM 或者 CLANG  工具，则可以使用相同的方法将它们注册到 `update-alternatives 中，并在需要时进行切换。
