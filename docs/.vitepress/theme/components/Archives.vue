<template>
  <div style="padding-top: 10px;">
    <div v-for="articleSet in filteredPosts">
      <div class="year">
        {{ articleSet.year }}
      </div>
      <a :href="withBase(article.url)" v-for="(article, index) in articleSet.data" :key="index" class="article">
        <div class="titleDiv">
          <div class="title-o"></div>
          {{ article.title }}
        </div>
<!--        <div class="date">{{ article.date.string}}</div>-->
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {getPostsByYear} from "../utils";
import {computed} from "vue";
import {withBase, useData} from "vitepress";
import {usePosts} from "../post";


const filteredPosts = computed(() => {
  return getPostsByYear(usePosts());
});
</script>

<style scoped>
.year {
  padding: 16px 0 8px 0;
  font-size: 1.5rem;
  font-weight: 600;
  font-family: var(--date-font-family);
}
</style>
