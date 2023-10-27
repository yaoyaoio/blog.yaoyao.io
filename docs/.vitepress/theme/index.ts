import {Theme} from "vitepress";
import DefaultTheme from "vitepress/theme";
// @ts-ignore
import Layout from "./components/Layout.vue";
import Archives from "./components/Archives.vue";
import './styles/index.scss';
import {customConfigProvider} from "./configProvider";

export default {
  ...DefaultTheme,
  Layout: customConfigProvider(Layout),
  enhanceApp({app}) {
    app.component("Archives", Archives);
  },
} as Theme;
