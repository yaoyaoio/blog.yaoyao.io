<script setup lang="ts">
import {computed, ref, watch, onMounted, nextTick, watchEffect} from "vue";
import {useData, withBase, useRoute, useRouter} from "vitepress";
import VPFeature from "vitepress/dist/client/theme-default/components/VPFeature.vue"
import PostItem from "./PostItem.vue";
import {usePosts} from "../post";

const grid = computed(() => {
  return "grid-1";
})

const filteredPosts = computed(() => {
  return usePosts().map((post) => (
      {
        icon: " 📖",
        title: post.title,
        details: post.excerpt,
        link: post.url,
        linkText: "Read more",
        frontmatter: post,
      }
  ))
});
const posts = computed(() => {
  return filteredPosts.value;
});

</script>

<template>
  <div class="mx-auto relative container">
    <div v-if="posts" class="home-posts-preview grid gap-3 grid-cols-1 sm:grid-cols-3 sm:gap-6">
      <a class="rounded-2xl flex flex-col items-center group relative border sm:hover:bg-hover transition-all hover:opacity-100" v-for="post in posts" :key="post.title" :href="post.link">
        <div class="xlog-post-cover rounded-t-2xl overflow-hidden flex items-center relative w-full aspect-video border-b">
        <span class="inline-flex justify-center w-full h-full overflow-hidden">
          <span class="inline-flex justify-center relative w-full h-full">
            <img alt="cover" loading="lazy" width="624" height="351" decoding="async" data-nimg="1"
                 class="object-cover w-full sm:group-hover:scale-105 sm:transition-transform sm:duration-400 sm:ease-in-out"
                 style="color:transparent"
                 :src="withBase(post.frontmatter?.headerImage)">
          </span>
        </span>
        </div>
        <div class="px-3 py-2 w-full min-w-0 flex flex-col text-sm space-y-2 sm:px-5 sm:py-4 h-auto sm:h-[163px]">
          <div class="space-y-2 line-clamp-3 h-[75px]">
            <h2 class="font-bold text-zinc-700 text-base">
            {{ post.title }}
            </h2>
            <div class="text-zinc-500 line-clamp-3" style="word-break:break-word">

            </div>
          </div>
          <div class="xlog-post-meta text-zinc-400 flex items-center text-[13px] truncate space-x-2">
            <span class="xlog-post-views inline-flex items-center">
              <i class="icon-[mingcute--eye-line] mr-[2px] text-base"></i><span>14</span></span>
            <span class="xlog-post-word-count sm:inline-flex items-center hidden"><i class="icon-[mingcute--sandglass-line] mr-[2px] text-sm">

            </i><span style="word-spacing:-.2ch">1<!-- --> <!-- -->min</span></span></div>
          <div class="flex items-center space-x-1 text-xs sm:text-sm overflow-hidden">
            <time datetime="2023-10-26T08:50:56.983Z" class="xlog-post-date whitespace-nowrap text-zinc-400 hidden sm:inline-block">a day ago</time>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>
<style scoped>
.HomePostsPreview {
  position: relative;
  padding: 0 24px;
}

@media (min-width: 640px) {
  .HomePostsPreview {
    padding: 0 48px;
  }
}

@media (min-width: 960px) {
  .HomePostsPreview {
    padding: 0 64px;
  }
}

.container {
  margin: 0 auto;
  max-width: 1152px;
}

.items {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
}

.item {
  height: 235px;
  padding: 8px;
  width: 100%;
}

@media (min-width: 640px) {
  .item.grid-2 {
    width: calc(100% / 2);
  }
}

@media (min-width: 768px) {
  .item.grid-2 {
    width: calc(100% / 2);
  }
}

@media (min-width: 960px) {
  .item.grid-2 {
    width: calc(100% / 2);
  }
}
</style>
