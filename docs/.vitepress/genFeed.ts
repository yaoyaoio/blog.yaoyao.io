import path from "path";
import {writeFileSync} from "fs";
import {Feed} from "feed";
import {
  type ContentData,
  createContentLoader,
  type SiteConfig,
} from "vitepress";
import {ThemeConfig} from "./theme/config";

// 限制只抓取最新15篇文章,防止rss文件过大
const MAX_FEED_ITEMS = 15;
const ID: string = "yaoyao";
const baseUrl: string = `https://blog.yaoyao.io`;

type RssGenerator = (config: SiteConfig<ThemeConfig>) => Promise<void>;

export const rss: RssGenerator = async (config) => {
  const feed: Feed = new Feed({
    title: `YaoYao’s Blog`,
    description: "My Personal Blog",
    id: baseUrl,
    link: baseUrl,
    language: "zh-CN",
    image: `${baseUrl}/logo.jpg`,
    favicon: `${baseUrl}/favicon.svg`,
    copyright: `Copyright (c) 2023 ${ID}`,
  });

  const posts: ContentData[] = await createContentLoader("/*.md", {
    excerpt: false,
    render: true,
    transform: (rawData) => {
      return rawData.sort((a, b) => {
        return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date);
      });
    },
  }).load();

  const latestPosts = posts.slice(0, MAX_FEED_ITEMS);

  for (const {url, excerpt, frontmatter, html} of latestPosts) {
    feed.addItem({
      title: frontmatter.title as string,
      id: `${baseUrl}${url}`,
      link: `${baseUrl}${url}`,
      description: excerpt as string,
      content: html as string,
      author: [{name: `${ID}`}],
      date: frontmatter.date,
    });
  }

  writeFileSync(path.join(config.outDir, "rss.xml"), feed.rss2());
};
