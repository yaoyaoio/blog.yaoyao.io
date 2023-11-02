import {defineConfigWithTheme} from "vitepress";

import {
  markdownImagePlugin,
  markdownCodeEnhancePlugin
} from "./plugins/markdownPlugin";

import {transformHeadMeta} from "./plugins/headPlugin";
import {ThemeConfig} from "./theme/config";
import {rss} from "./genFeed.js";


export default defineConfigWithTheme<ThemeConfig>({
  title: "YaoYao’s Blog",
  lang: "en-US",
  description: "Have a nice day.",
  cleanUrls: true,
  buildEnd: rss,
  appearance: true,
  ignoreDeadLinks: true,
  base: "/",
  markdown: {
    lineNumbers: false,
    theme: "nord",
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
            "YAOYAO,耀耀",
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
      'script',
      {async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-VTV8TERKLB'}
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-VTV8TERKLB');`
    ]
  ],
  transformHead: (context) => {
    return transformHeadMeta(context)
  },
  themeConfig: {
    logo: "",
    nav: [
      {text: "Home", link: "/"},
      {text: "Articles", link: "/articles"},
      {text: "About", link: "/about/"},
    ],
    socialLinks: [
      {icon: "twitter", link: "https://twitter.com/yaoyaoio"},
      {icon: "github", link: "https://github.com/yaoyaoio"},
    ],
    outline: {
      label: "本文导览",
    },
    lastUpdated: {
      text: "Last Updated",
    },
    footer: {
      message: `<a href="https://blog.yaoyao.io/">YaoYao’s Blog</a>.`,
      copyright: `Copyright © 2015-2023 <a href="https://github.com/yaoyaoio" target="_blank">@YaoYao</a>.<br/>
      `,
    },
    docFooter: {
      prev: "PREV",
      next: "NEXT",
    },
    search: {
      provider: "algolia",
      options: {
        appId: "CZDQHBIKSR",
        apiKey: "76af0cd40f7c0fc5f78456de2a842849",
        indexName: "yaoyao",
      }
    },
    personalInfo: {
      name: "YaoYao",
      avatar: "/img/logo/logo-card.png",
      description: "Have a nice day.",
    },
    giscus: {
      repo: "yaoyaoio/blog-comments",
      repoId: "R_kgDOHX02Ew",
      category: "Announcements",
      categoryId: "DIC_kwDOHX02E84CPN8T",
      mapping: "title",
      reactionsEnabled: "1",
      emitMetadata: "0",
      theme: "light",
      lang: "en",
    }
  },
});
