<script setup lang="ts">
const { avatar, msg, isMe, user } = defineProps<{
  avatar?: String,
  msg: String,
  isMe?: String,
  user?: String
}>();

const avatarStyle = avatar ? `background: url('/devops/build/imgs/${avatar}.png') no-repeat center center; background-size: cover;` : 'visibility: hidden;';
const userName = user;
const className = isMe === "true" ? "kakao-msg is-me" : "kakao-msg";
const message = msg;
</script>

<template>
  <div v-bind:class="className">
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
.kakao-msg .msg-wrapper {
	display: flex;
}

.kakao-msg.is-me .msg-wrapper {
	flex-direction: row-reverse;
}

.kakao-msg .avatar {
	flex-shrink: 0;
	width: 40px;
	height: 40px;
	border-radius: 12px;
	background-color: #eee;
	margin-right: 8px;
	filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1)) drop-shadow(0 1px 1px rgba(0, 0, 0, 0.06));
}

.kakao-msg.is-me .avatar {
	display: none;
}

.kakao-msg .msg-info {
	display: flex;
	flex-direction: column;
}

.kakao-msg .user {
	font-size: 13px;
	color: #666;
	margin-bottom: 3px;
}

.kakao-msg .msg-empty {
	width: 60px;
	flex-shrink: 0;
}

.kakao-msg .msg {
	padding: 6px 8px;
	border-radius: 4px;
	background-color: #fff;
	color: #000;
	font-size: 14px;
	filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.06)) drop-shadow(0 1px 1px rgba(0, 0, 0, 0.02));
	margin-bottom: 7px;
	line-height: 1.5;
	word-break: keep-all;
}

.kakao-msg.is-me .msg {
	background-color: #fbe54d;
}
</style>