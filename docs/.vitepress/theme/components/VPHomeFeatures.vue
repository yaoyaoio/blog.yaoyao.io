<script setup lang="ts">
import {useData} from 'vitepress'
import VPFeatures from 'vitepress/dist/client/theme-default/components/VPFeatures.vue'
import type {Feature} from "../types";
import {useHomePosts} from "../post";
import {computed} from "vue";

const {frontmatter: fm} = useData()

const features = useHomePosts().map((post) => {
  const {title, description,} = post
  return {
    icon: "",
    title: title,
    details: description,
    link: `/`,
    linkText: "Read more",
  }
})

</script>

<template>
  <VPFeatures
      v-if="fm.features"
      class="VPHomeFeatures"
      :features="fm.features"
  />
</template>
