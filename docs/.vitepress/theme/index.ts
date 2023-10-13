import {Theme} from "vitepress";
import DefaultTheme from "vitepress/theme";
// @ts-ignore
import Layout from "./components/Layout.vue";
import "./style/style.css";
import "./style/index.css"
import "./style/default.css"

import {customConfigProvider} from "./configProvider";

export default {
  ...DefaultTheme,
  Layout: customConfigProvider(Layout),
  enhanceApp({app}) {
  },
} as Theme;
