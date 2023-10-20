import type {DefaultTheme, Theme} from 'vitepress'

export interface PersonalConfig {
  name: string;
  avatar: string;
  description: string;
}

export declare interface OneThemeConfig extends DefaultTheme.Config {
  // define your custom config here
  personalInfo: PersonalConfig;
}
