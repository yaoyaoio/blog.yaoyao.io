<script setup lang="ts">
import ArticleHeader from "./ArticleHeader.vue";
import BaseLayout from "./BaseLayout.vue";
import DefaultTheme from "vitepress/theme";

</script>

<template>
    <BaseLayout>
      <template #doc-before>
        <ArticleHeader/>
      </template>
    </BaseLayout>
</template>

<style scoped>

</style>
