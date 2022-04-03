<script setup lang="ts">
const { emoji, count } = defineProps<{
  emoji: string,
  count: string,
}>();

const content = emoji;
let number = $ref(parseInt(count, 10));

function increment() {
  number++
}
</script>

<template>
  <div class="slack-emoji" @click="increment">
    <span>{{ content }}</span>
    <span class="slack-count">{{ number }}</span>
  </div>
</template>

<style scoped>
.slack-emoji {
	display: inline-flex;
	align-items: center;
	margin-left: 44px;
	border-radius: 20px;
	background: rgba(29, 28, 29, 0.04);
	padding: 3px 9px 3px 7px;
	font-size: 14px;
	margin-top: -2px;
	margin-bottom: 3px;
	cursor: pointer;
	line-height: 20px;
  user-select: none;
}

.slack-emoji .slack-count {
	color: rgb(29, 28, 29);
	font-size: 12px;
	margin-left: 3px;
	font-weight: bold;
}
</style>