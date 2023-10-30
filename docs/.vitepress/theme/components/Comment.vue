<script lang="ts" setup>
import {reactive, ref, watch, nextTick, computed} from "vue";
import {useData, useRoute} from "vitepress";
import GiscusComment, {type GiscusProps} from '@giscus/vue'
import type {GiscusConfig, ThemeConfig} from "../config";

const route = useRoute();
const {isDark} = useData();
const {theme} = useData<ThemeConfig>();
const giscusConfig = computed(() => theme.value.giscus);


const showComment = ref(true);
watch(
    () => route.path,
    () => {
      showComment.value = false;
      nextTick(() => {
        showComment.value = true;
      })
    },
    {
      immediate: true,
    }
);

</script>
<template>
  <div class="mx-auto relative max-w-6xl">
    <GiscusComment
        v-if="showComment"
        :repo="giscusConfig.repo"
        :repo-id="giscusConfig.repoId"
        :category="giscusConfig.category"
        :category-id="giscusConfig.categoryId"
        :mapping="giscusConfig.mapping"
        :reactions-enabled="giscusConfig.reactionsEnabled"
        :emit-metadata="giscusConfig.emitMetadata"
        :input-position="giscusConfig.inputPosition"
        :theme="isDark ? 'dark' : 'light'"
        :lang="giscusConfig.lang"
        :loading="giscusConfig.loading"
    />
  </div>
</template>
<style>
</style>
