<script setup lang="ts">
import type {DefaultTheme} from 'vitepress/theme'
import VPImage from './VPImage.vue'
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue'
import VPIconArrowRight from 'vitepress/dist/client/theme-default/components/icons/VPIconArrowRight.vue'
import {PostPageFrontmatter} from "../types";
import {withBase} from "vitepress";

defineProps<{
  post: {
    icon?: DefaultTheme.FeatureIcon
    title: string
    details?: string
    link?: string
    linkText?: string
    rel?: string
    target?: string
    frontmatter?: PostPageFrontmatter
  }
}>()


</script>

<template>
  <div class="post-item">
    <article class="box">
      <div class="post-item-cover left">
        <img :src="withBase(post.frontmatter?.headerImage)" alt="post-item-cover"/>
      </div>
      <div class="post-item-info right">
        <h3 style="color: black">{{ post.title }}</h3>
      </div>
    </article>
  </div>
</template>

<style scoped>
.post-item {
  position: relative;
  margin: 80px auto 100px;
  padding: 0 40px;
  //display: block;
  //border: 1px solid var(--vp-c-bg-soft);
  //border-radius: 12px;
  //height: 340px;
  //background-color: var(--vp-c-bg-soft);
  //transition: border-color 0.25s, background-color 0.25s;
}

.post-item.link:hover {
  border-color: var(--vp-c-brand-1);
}

.post-item-cover {
  display: inline-block;
  height: 340px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  cursor: pointer;
  border-radius: 5px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: "";
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
  }

  &:hover img {
    @include transform(scale(1.1));
  }

  &:nth-child(odd) {
    text-align: left;

    .else {
      left: 620px;
    }
  }

  &:nth-child(even) {
    text-align: right;

    .else {
      right: 620px;
    }
  }
}

.post-item-info {
  width: 58%;
  position: absolute;
  text-align: left;
  top: 20px;
  height: 360px;
  border-radius: 5px;
  overflow-y: hidden;
  &__date {
    color: var(--c-text-sub);
    font-size: 12px;
    margin: 80px 0 0 80px;
  }

  &__title {
    color: var(--c-text);

    &:hover,
    &:focus {
      text-decoration: none;
      color: var(--c-text-accent);
    }

    h2 {
      font-size: 30px;
      font-weight: normal;
      line-height: 1.1;
      margin: 10px 100px 0 80px;
    }

    h3 {
      font-size: 16px;
      font-weight: normal;
      margin: 10px 100px 0 80px;
      line-height: 1.8;
    }
  }

  &__content p {
    line-height: 1.8;
    font-size: 14px;
    margin: 10px 100px 0 80px;
  }
}

</style>
