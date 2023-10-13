<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import ArticleHeader from "./ArticleHeader.vue";

const {Layout} = DefaultTheme;
</script>

<template>
  <Layout>
    <template #doc-before>
      <ArticleHeader/>
    </template>
  </Layout>
</template>

<style scoped>

</style>
