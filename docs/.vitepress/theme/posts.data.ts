import {createContentLoader} from "vitepress";
import {formatShowDate} from "./utils";
import type {PostPageDate, PostPageFrontmatter} from "./types";

declare const data: PostPageFrontmatter[];

// 声明一个全局所有文章分类的数组,结构是 {name:"分类名",text:"分类单词",count:"分类文章数量"}
declare const categoriesMeta: { name: string; text: string; count: number }[];

export {data, categoriesMeta};

export default createContentLoader("/*/*.md", {
  excerpt: true,
  transform(raw): PostPageFrontmatter[] {
    return raw
      .filter(({frontmatter}) => !frontmatter.hide)
      .map(({url, frontmatter, excerpt}) => ({
        title: frontmatter.title,
        url: url,
        excerpt: excerpt,
        cover: frontmatter.headerImage || frontmatter.cover,
        date: formatDate(frontmatter.date),
        categories: frontmatter.categories,
        author: frontmatter.author,
        layout: frontmatter.layout,
        useHeaderImage: frontmatter.useHeaderImage,
        headerImage: frontmatter.headerImage,
        headerMask: frontmatter.headerMask,
        headerImageCredit: frontmatter.headerImageCredit,
        headerImageCreditLink: frontmatter.headerImageCreditLink,
        catalog: frontmatter.catalog || false,
        hide: frontmatter.hide || false,
        tags: frontmatter.tags || [],

      }))
      .sort((a, b) => b.date.time - a.date.time);
  },
});

function formatDate(raw: string): PostPageDate {
  const date = new Date(raw);
  date.setUTCHours(12);
  return {
    time: +date,
    formatShowDate: formatShowDate(date),
    string: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
}

