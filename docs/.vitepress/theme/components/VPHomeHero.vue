<script setup lang="ts">
import { useData } from 'vitepress'
import VPHero from 'vitepress/dist/client/theme-default/components/VPHero.vue'

const { frontmatter: fm } = useData()
</script>

<template>
  <VPHero
    v-if="fm.hero"
    class="VPHomeHero"
    :name="fm.hero.name"
    :text="fm.hero.text"
    :tagline="fm.hero.tagline"
    :image="fm.hero.image"
    :actions="fm.hero.actions"
  >
    <template #home-hero-info><slot name="home-hero-info" /></template>
    <template #home-hero-image><slot name="home-hero-image" /></template>
  </VPHero>
</template>
