<script setup lang="ts">
import {withBase} from "vitepress";
import type {PostPageFrontmatter} from "../types";

defineProps<{
  post: PostPageFrontmatter
}>()
</script>

<template>
  <div class="xlog-post-cover rounded-t-2xl overflow-hidden flex items-center relative w-full aspect-video border-b">
    <span class="inline-flex justify-center w-full h-full overflow-hidden">
      <span class="inline-flex justify-center relative w-full h-full">
        <img alt="cover" loading="lazy" width="624" height="351" decoding="async" data-nimg="1"
             class="object-cover w-full sm:group-hover:scale-105 sm:transition-transform sm:duration-400 sm:ease-in-out"
             style="color:transparent"
             :src="withBase(post.headerImage)">
      </span>
    </span>
  </div>
</template>

<style scoped>

</style>
