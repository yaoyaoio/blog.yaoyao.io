import type {DefaultTheme, Theme} from 'vitepress'

export interface PersonalConfig {
  name: string;
  avatar: string;
  description: string;
}

export interface GiscusConfig {
  repo: string;
  repoId?: string;
  category?: string;
  categoryId?: string;
  mapping?: string;
  reactionsEnabled?: string;
  emitMetadata?: string;
  theme?: string;
  lang?: string;
  loading?: string;
  crossorigin?: string;
}


export declare interface ThemeConfig extends DefaultTheme.Config {
  // define your custom config here
  personalInfo: PersonalConfig;
  giscus?: GiscusConfig;
}
