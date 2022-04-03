<template>
  <div class="slack-room">
    <slot></slot>
  </div>
</template>

<style scoped>
.slack-room {
	border: 1px solid #efefef;
	padding: 10px 10px 5px 10px;
	background-color: #fff;
	max-width: 450px;
	margin: 0 auto 1.2em;
	line-height: 1.1;
}
</style>