<script setup lang="ts">
import VPHomeHero from './VPHomeHero.vue'
import VPHomeFeatures from 'vitepress/dist/client/theme-default/components/VPHomeFeatures.vue'
import HomePreview from "./HomePreview.vue";
</script>

<template>
  <div class="Home">
    <slot name="home-hero-before"/>
    <VPHomeHero>
      <template #home-hero-info>
        <slot name="home-hero-info"/>
      </template>
      <template #home-hero-image>
        <slot name="home-hero-image"/>
      </template>
    </VPHomeHero>
    <HomePreview/>
    <Content/>
  </div>
</template>

<style scoped>
.Home {
  padding-bottom: 96px;
}

@media (min-width: 768px) {
  .Home {
    padding-bottom: 128px;
  }
}
</style>
