export interface PostPageDate {
  raw: string;
  time: number; // 1609459200000
  defaultDate: string; // 2023-01-01
}

export interface PostPageFrontmatter {
  title: string; // 标题
  url: string; // 路径
  date: PostPageDate; // 日期
  cover?: string; // 封面图
  subtitle?: string; // 副标题
  path?: string; // 路径
  categories?: string[]; // 分类
  excerpt: string | undefined; // 摘要
  description: string | undefined; // 描述
  author?: string; // 作者
  layout?: string; // 布局类型
  useHeaderImage?: boolean; // 是否使用
  headerImage?: string; // 封面
  headerMask?: string; // 遮罩
  headerImageCredit?: string; // 图片来源
  headerImageCreditLink?: string; // 图片来源链接
  aside?: boolean; // 是否显示侧边栏
  tags?: string[]; // 标签
  hide?: boolean; // 是否隐藏
}

export interface PostPage {
  id?: string;
  title?: string;
  url?: string;
  frontmatter: PostPageFrontmatter;
  next?: PostPage | null;
  prev?: PostPage | null;
}
