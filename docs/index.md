---
layout: home
layoutClass: 'm-home-layout'

hero:
  name: YaoYao
  text: Welcome here
  tagline: 路漫漫其修远兮，吾将上下而求索。
  image:
    src: /logo.png
    alt: YaoYao
  actions:
    - text: 最新
      link: /articles
    - text: 生活
      link: /life
      theme: alt
    - text: 更多
      link: /more
      theme: alt
features:
  - icon: 📖
    title: 使用 Surge && Mac mini 构建家庭网关
    details: 通过 Surge && Mac mini 构建家庭网关，实现局域网内所有设备的网络请求都通过 Surge 进行代理。
    link: /posts/create-home-gateway-with-surge-and-mac-mini
    linkText: Read more
  - icon: 📖
    title: 如何在 Ubuntu 上配置 eBPF 开发环境
    details: 如何在 Ubuntu 上配置 eBPF 开发环境，包括安装 clang、llvm、libbpf、bpftool、bcc 等。
    link: /posts/how-to-setup-ebpf-env-on-ubuntu
    linkText: Read more
---

<style>
/*爱的魔力转圈圈*/
.m-home-layout .image-src:hover {
  transform: translate(-50%, -50%) rotate(666turn);
  transition: transform 59s 1s cubic-bezier(0.3, 0, 0.8, 1);
}

.m-home-layout .details small {
  opacity: 0.8;
}

.m-home-layout .item:last-child .details {
  display: flex;
  justify-content: flex-end;
  align-items: end;
}
</style>
