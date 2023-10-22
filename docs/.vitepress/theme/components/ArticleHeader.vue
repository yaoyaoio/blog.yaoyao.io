<script setup lang="ts">
import {ref, computed, onMounted, watch, nextTick} from "vue";
import {useData, withBase, useRoute, useRouter} from "vitepress";

const {frontmatter} = useData()
const route = useRoute();
const router = useRouter();
const title = computed(() => frontmatter.value.title);
const date = computed(() => frontmatter.value.date);

const headerStyle = () => {
  const style = {} as { backgroundImage: string };
  // if (
  //     frontmatter.value.layout === "Post" &&
  //     frontmatter.value.useHeaderImage &&
  //     frontmatter.value.headerImage
  // ) {
  //   style.backgroundImage = `url(${withBase(frontmatter.value.headerImage)})`;
  // }
  // style.backgroundImage = `url(${withBase(frontmatter.value.headerImage)})`;
  return style;
};
</script>

<template>
  <div
      class="article-header"
      :style="headerStyle()"
      :class="{ 'use-image': frontmatter.useHeaderImage }"
  >
    <div
        v-if="frontmatter.useHeaderImage && frontmatter.headerMask"
        class="article-header-mask"
        :style="{ background: frontmatter.headerMask }"
    />

    <div class="article-header-content">
      <h1 class="article-title">
        {{ frontmatter.title }}
      </h1>
      <p v-if="frontmatter.subtitle" class="article-subtitle">
        {{ frontmatter.title }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.article-header.use-image {
  max-width: 100%;
  position: relative;
  padding-bottom: 6rem;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
