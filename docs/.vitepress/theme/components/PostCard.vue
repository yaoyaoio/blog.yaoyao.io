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
      class="rounded-2xl flex flex-col items-center group relative
  border sm:hover:bg-hover transition-all hover:opacity-100"
      :href="withBase(post.url)"
  >
    <PostCover :post="post"/>
    <div class="px-3 py-2 w-full min-w-0 flex flex-col text-sm
                space-y-2 sm:px-5 sm:py-4 h-auto sm:h-[163px]">
      <div class="space-y-2 line-clamp-3 h-[75px]">
        <h2 class="font-bold text-zinc-700 text-base">
          {{ post.title }}
        </h2>
        <!--        <div class="text-zinc-500 line-clamp-3" style="word-break:break-word">-->

        <!--        </div>-->
      </div>
      <!--      <div class="xlog-post-meta text-zinc-400 flex items-center text-[13px] truncate space-x-2">-->
      <!--            <span class="xlog-post-views inline-flex items-center">-->
      <!--              <i class="icon-[mingcute&#45;&#45;eye-line] mr-[2px] text-base"></i><span>14</span></span>-->
      <!--        <span class="xlog-post-word-count sm:inline-flex items-center hidden"><i class="icon-[mingcute&#45;&#45;sandglass-line] mr-[2px] text-sm">-->

      <!--            </i><span style="word-spacing:-.2ch"></span></span></div>-->
      <!--      <div class="flex items-center space-x-1 text-xs sm:text-sm overflow-hidden">-->
      <!--        <time datetime="2023-10-26T08:50:56.983Z" class="xlog-post-date whitespace-nowrap text-zinc-400 hidden sm:inline-block">-->
      <!--          {{ post.frontmatter.date.defaultDate }}</time>-->
    </div>
    <!--    </div>-->
  </a>

</template>

<style scoped>

</style>
