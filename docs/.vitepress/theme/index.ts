import {Theme} from "vitepress";
import DefaultTheme from "vitepress/theme";
// @ts-ignore
import Layout from "./components/Layout.vue";
import Archives from "./components/Archives.vue";
import Comment from "./components/Comment.vue";
import {customConfigProvider} from "./configProvider";
import './styles/index.scss';

export default {
  ...DefaultTheme,
  Layout: customConfigProvider(Layout),
  enhanceApp({app}) {
    app.component("Archives", Archives);
    app.component("Comment", Comment);
  },
} as Theme;
