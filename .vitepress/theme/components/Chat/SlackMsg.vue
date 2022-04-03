<script setup lang="ts">
const { avatar, msg, user } = defineProps<{
  avatar?: String,
  msg: String,
  user?: String
}>();

const avatarStyle = `background: url('/devops/imgs/${avatar}.png') no-repeat center center; background-size: cover;`;
const userName = user;
const message = msg;
</script>

<template>
  <div class="slack-msg">
    <div class="msg-wrapper">
      <div class="avatar" v-bind:style="avatarStyle" />
      <div class="msg-info">
        <div class="user">
          {{ userName }}
        </div>
        <div class="msg">
          {{ message }}
        </div>
      </div>
      <div class="msg-empty" />
    </div>
  </div>    
</template>

<style scoped>
.slack-msg .msg-wrapper {
	display: flex;
}

.slack-msg .avatar {
	flex-shrink: 0;
	width: 36px;
	height: 36px;
	border-radius: 5px;
	background-color: #eee;
	margin-right: 8px;
	border: 1px solid #efefef;
}

.slack-msg .msg-info {
	display: flex;
	flex-direction: column;
}

.slack-msg .user {
	font-size: 13px;
	color: #1d1c1d;
	margin-bottom: 3px;
	font-weight: bold;
}

.slack-msg .msg-empty {
	width: 60px;
	flex-shrink: 0;
}

.slack-msg .msg {
	color: #000;
	font-size: 14px;
	margin-bottom: 8px;
	line-height: 1.5;
	word-break: keep-all;
}
</style>