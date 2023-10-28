<template>
  <div class="page">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-4xl xl:px-0">
      <div class="divide-y divide-gray-200 dark:divide-slate-200/5">
        <div v-for="item in filteredPosts">
          <div class="year pt-8 pb-4 text-2xl font-bold">
            <h1>{{ item.year }}</h1>
          </div>
          <ul class="divide-y divide-gray-200 dark:divide-slate-200/5">
            <li class="py-4" v-for="subItem in item.data" :key="subItem">
              <div class="flex gap-4">
                <dl class="min-w-[130px]">
                  <dd class="text-base leading-6 font-semibold text-gray-500">
                    <time datetime="{{subItem.date.defaultDate}}">{{ subItem.date.defaultDate }}</time>
                  </dd>
                </dl>
                <a class="break-all font-medium hover:text-sky-500"
                   :href="withBase(subItem.url)">
                  {{ subItem.title }}
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import {withBase} from "vitepress";
import {getPostsByYear, PostDataWithDate} from "../utils";
import {usePosts} from "../post";


const filteredPosts = computed(() => {
  return getPostsByYear(usePosts());
});
</script>

<style scoped>
</style>
