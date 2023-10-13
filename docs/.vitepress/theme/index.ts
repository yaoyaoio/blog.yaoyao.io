import {Theme} from "vitepress";
import DefaultTheme from "vitepress/theme";
import './styles/index.scss'
// @ts-ignore
import Layout from "./components/Layout.vue";
import {customConfigProvider} from "./configProvider";

export default {
  ...DefaultTheme,
  Layout: customConfigProvider(Layout),
  enhanceApp({app}) {
  },
} as Theme;
