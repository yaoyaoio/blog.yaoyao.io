<script setup lang="ts">
import {withBase} from "vitepress";
import type {PostPageFrontmatter} from "../types";
import PostCover from "./PostCover.vue";

defineProps<{
  post: PostPageFrontmatter
}>()

</script>

<template>
  <a
      class="rounded-2xl flex flex-col items-center group relative border sm:hover:bg-hover transition-all hover:opacity-100"
      :href="withBase(post.url)"
  >
    <PostCover :post="post"/>
    <div class="px-3 py-2 w-full min-w-0 flex flex-col text-sm
                space-y-2 sm:px-5 sm:py-4 h-auto sm:h-[163px]">
      <!--标题-->
      <div class="space-y-2 line-clamp-3 h-[75px]">
        <h2 class="font-bold text-zinc-700 text-base dark:text-zinc-300">
          {{ post.title }}
        </h2>
        <div class="text-zinc-500 line-clamp-3" style="word-break:break-word">
          {{ post.excerpt || "这是描述。。。" }}
        </div>
      </div>
      <!--元数据-->
      <div class="h-[20px]"></div>
      <!--作者和发布时间-->
      <div class="flex items-center space-x-1 text-xs sm:text-sm overflow-hidden">
        <span>{{ post.author }}</span>
        <span class="text-zinc-400 hidden sm:inline-block">·</span>
        <time datetime="{{ post.date.defaultDate }}"
              class="post-date whitespace-nowrap text-zinc-400 hidden sm:inline-block">
          {{ post.date.defaultDate }}
        </time>
      </div>
    </div>
  </a>

</template>

<style scoped>

</style>
