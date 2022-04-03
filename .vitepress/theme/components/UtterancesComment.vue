<script setup lang="ts">
import { onMounted, watch} from 'vue';
import { useRoute } from 'vitepress';

const route = useRoute();

let comment = $ref<HTMLElement>();

watch(route, () => {
  if (comment) {
    comment.innerHTML = "";
  }
  setTimeout(() => {
    load();
  }, 500);
});

onMounted(load);

const storageKey = 'vue-theme-appearance';

function load() {
  let userPreference = localStorage.getItem(storageKey) || 'auto';
  const query = window.matchMedia(`(prefers-color-scheme: dark)`);
  const classList = document.documentElement.classList;
  let isDark = userPreference === 'auto' ? query.matches : userPreference === 'dark';

  // script tag 생성
  const utterances = document.createElement('script');
  utterances.type = 'text/javascript';
  utterances.async = true;
  utterances.crossorigin = 'anonymous';
  utterances.src = 'https://utteranc.es/client.js';
  
  utterances.setAttribute('issue-term', 'pathname');
  utterances.setAttribute('theme', isDark ? 'github-dark' : 'github-light');
  utterances.setAttribute('repo',`subicura/devops`);

  // script tag 삽입
  comment.appendChild(utterances);
}
</script>

<template>
  <div ref="comment" class="ut-comment-wrapper"></div>
</template>

<style scoped>
.ut-comment-wrapper {
  max-width: 920px;
  margin: 0 auto;
  padding: 0.5rem 0 1.5rem;
  margin: 0 auto;
  z-index: 1;
}
</style>

