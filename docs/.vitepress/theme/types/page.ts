export interface PostData {
  url: string;
  title: string;
  cover: string;
  date: PostPageDate;
  categories: string[];
  hit: number;
  isArticleListHitsFetched: boolean;
}

export interface PostPageDate {
  time: number;
  string: string;
  formatShowDate: string;
}

export interface PostPageFrontmatter {
  title: string; // 标题
  url: string; // 路径
  date: PostPageDate; // 日期
  cover: string; // 封面图
  categories: string[]; // 分类
  excerpt: string | undefined; // 摘要
  author?: string; // 作者
  layout?: string; // 布局
  useHeaderImage?: boolean; // 是否使用
  headerImage: string;
  headerMask?: string;
  headerImageCredit?: string;
  headerImageCreditLink?: string;
  catalog?: boolean;
  tags?: string[];
  hide?: boolean;

}
