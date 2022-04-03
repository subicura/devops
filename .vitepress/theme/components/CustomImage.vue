<script setup lang="ts">
import { withBase } from 'vitepress';

const { src, alt } = defineProps<{
  src: String
  alt?: String
}>();
const original = `/build${src}`;
const webp = `/build${src}`.replace(".png", ".webp").replace(".jpg", ".webp");
const imageType = src.indexOf(".png") > -1 ? "image/png" : "image/jpeg";
const altText = alt;
</script>

<template>
  <picture>
    <source :srcset="withBase(webp)" type="image/webp">
    <source :srcset="withBase(original)" :type="imageType">
    <img :src="withBase(original)" :alt="altText" loading="lazy"></picture>
</template>
