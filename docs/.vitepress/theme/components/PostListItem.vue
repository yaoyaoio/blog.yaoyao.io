<script setup lang="ts">
import {nextTick, ref, onMounted, computed} from "vue";
import {withBase, useRouter} from "vitepress";
import type {PropType} from "vue";
import type {PostData} from "../types";
import {getPreviewImage} from "../utils";

const router = useRouter();

const props = defineProps(
    {
      item: {
        type: Object as PropType<PostData>,
        required: true
      }
    }
)

let timeoutHandle: number = 0;

const imgRef = ref<HTMLImageElement | null>(null);

const imageLoaded = ref(false);
const imageError = ref(false);

const onImageLoad = () => {
  imageError.value = false;
  imageLoaded.value = true;
};

const onImageError = () => {
  imageError.value = true;
  imageLoaded.value = true; // 也设置图片为已加载，隐藏加载动画
};

const previewImageUrl = computed(() => {
  if (!props.item.cover) {
    console.error("Cover image URL is not provided!");
    return "";
  }
  return getPreviewImage(props.item.cover);
});

const retryLoadImage = () => {
  // 清除旧的超时句柄
  clearTimeout(timeoutHandle);
  // 设置超时逻辑
  timeoutHandle = setTimeout(() => {
    if (!imageLoaded.value) {
      onImageError();
    }
  }, 15000);
};

const goCategory = (category: string) => {
  router.go(`?category=${category}`);
};

onMounted(() => {
  // 当组件被挂载后
  nextTick(() => {
    if (imgRef.value?.complete) {
      imageLoaded.value = true;
    }
    retryLoadImage();
  });
});
</script>

<template>
  <div class="post-item">
    <div class="post-item-cover">
      <a :href="withBase(item.url)">
        <img
            ref="imgRef"
            :src="previewImageUrl"
            @load="onImageLoad"
            @error="onImageError"
            :class="{
            'opacity-0': !imageLoaded,
            'opacity-100': imageLoaded && !imageError,
            'opacity-0 delay-0': imageLoaded && imageError,
          }"
            class="post-item-cover-img" alt=""/>
      </a>
    </div>
    <div class="post-item-info">
      <p
          class="post-item-info-title">
        {{ item.title }}
      </p>
    </div>
    <div class="post-item-info-more">
      <p
          class="text-gray-400 dark:text-slate-400 text-sm sd:text-sm md:text-sm">
        {{ item.date.formatShowDate }}
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>
