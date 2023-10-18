import {defineConfig, HeadConfig} from "vitepress";
import {rss} from "./genFeed.js";

import {
  markdownImagePlugin,
  markdownCodeEnhancePlugin
} from "./plugin/markdownPlugin";

export default defineConfig({
  title: "YaoYao’s Blog",
  lang: "zh-CN",
  description: "路漫漫其修远兮，吾将上下而求索。",
  cleanUrls: true,
  // buildEnd: rss,
  appearance: true, // disable dark mode
  ignoreDeadLinks: true,
  base: "/",
  markdown: {
    lineNumbers: false,
    config: (md) => {
      md.use(markdownImagePlugin);
      md.use(markdownCodeEnhancePlugin);
    },
  },
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "没有关键词。",
      },
    ],
    [
      "meta",
      {
        name: "description",
        content:
          "没什么可描述的。",
      },
    ],
    [
      "script",
      {
        //async: true,
        src: "https://www.googletagmanager.com/gtag/js?id=",
      },
    ],
    [
      "script",
      {},
      "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '');",
    ],
  ],
  transformHead: ({pageData}) => {
    const head: HeadConfig[] = [];

    head.push([
      "meta",
      {property: "og:title", content: pageData.frontmatter.title},
    ]);
    head.push([
      "meta",
      {property: "og:description", content: pageData.frontmatter.title},
    ]);

    return head;
  },
  themeConfig: {
    logo: "",
    nav: [
      {text: "首页", link: "/"},
      {text: "文章", link: "/articles"},
      {text: "关于", link: "/about/"},
    ],
    socialLinks: [
      {icon: "twitter", link: "https://twitter.com/yaoyaoio"},
      {icon: "github", link: "https://github.com/yaoyaoio"},
    ],
    outline: {
      label: "本文导览",
    },
    lastUpdated: {
      text: "最后更新时间"
    },
    footer: {
      message: `<a href="https://blog.yaoyao.io/">YaoYao’s Blog</a>.`,
      copyright: `Copyright © 2015-2023 <a href="https://github.com/yaoyaoio" target="_blank">@YaoYao</a>.<br/>
      `,
    },
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    }
  },
});
