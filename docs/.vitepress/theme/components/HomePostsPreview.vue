<script setup lang="ts">
import {computed, ref, watch, onMounted, nextTick, watchEffect} from "vue";
import {useData, withBase, useRoute, useRouter} from "vitepress";
import PostCard from "./PostCard.vue";
import {usePosts} from "../post";

const grid = computed(() => {
  return "grid-1";
})

const filteredPosts = computed(() => {
  return usePosts();
});
const posts = computed(() => {
  return filteredPosts.value;
});

</script>

<template>
  <div class="mx-auto relative max-w-6xl">
    <div v-if="posts" class="home-posts-preview grid gap-3 grid-cols-1 sm:grid-cols-3 sm:gap-6">
      <PostCard v-for="post in posts" :post="post"/>
    </div>
  </div>
</template>
<style scoped>
</style>
