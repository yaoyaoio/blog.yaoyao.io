<script setup lang="ts">
import VPHomeHero from './VPHomeHero.vue'
import HomePreview from "./HomePreview.vue";
import Comment from "./Comment.vue";
</script>

<template>
  <div class="home">
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
.home {
  padding-bottom: 96px;
}

@media (min-width: 768px) {
  .home {
    padding-bottom: 128px;
  }
}
</style>
