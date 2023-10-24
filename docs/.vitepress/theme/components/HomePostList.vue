<script setup lang="ts">
import {computed, ref, watch, onMounted, nextTick, watchEffect} from "vue";
import {useData} from 'vitepress'
import VPFeatures from './VPFeatures.vue'
import PostItem from "./PostItem.vue";
import type {Feature} from "../types";
import {usePosts} from "../post";
import VPFeature from "./VPFeature.vue";

const {frontmatter: fm} = useData()

const grid = computed(() => {
  return "grid-2";
})

const filteredPosts = computed(() => {
  let s = usePosts().map((post) => (
      {
        icon: " 📖",
        title: post.title,
        details: post.excerpt,
        link: post.url,
        linkText: "Read more",
      }
  ))
  console.log(s)
  return (s);
});
const features = computed(() => {
  return filteredPosts.value;
});
</script>

<template>
    <div v-if="features" class="VPFeatures home-post-list">
      <div class="container">
        <div class="items">
          <div
              v-for="feature in features"
              :key="feature.title"
              class="item post-item"
              :class="[grid]"
          >
            <VPFeature
                :icon="feature.icon"
                :title="feature.title"
                :details="feature.details"
                :link="feature.link"
                :link-text="feature.linkText"
                :rel="feature.rel"
                :target="feature.target"
            />
          </div>
        </div>
      </div>
    </div>
</template>
<style scoped>
.VPFeatures {
  position: relative;
  padding: 0 24px;
}

@media (min-width: 640px) {
  .VPFeatures {
    padding: 0 48px;
  }
}

@media (min-width: 960px) {
  .VPFeatures {
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
  padding: 8px;
  width: 100%;
}

@media (min-width: 640px) {
  .item.grid-2,
  .item.grid-4,
  .item.grid-6 {
    width: calc(100% / 2);
  }
}

@media (min-width: 768px) {
  .item.grid-2,
  .item.grid-4 {
    width: calc(100% / 2);
  }

  .item.grid-3,
  .item.grid-6 {
    width: calc(100% / 3);
  }
}

@media (min-width: 960px) {
  .item.grid-4 {
    width: calc(100% / 4);
  }
}
</style>
