<template>
  <van-row v-if="is_sender" class="box">
    <avatar-view />
    <span style="margin-left: 1rem" class="bubble-text">{{
      message.content
    }}</span>
  </van-row>
  <van-row v-else justify="space-between" align="center" class="box">
    <van-col />
    <van-col>
      <div class="bubble">
        <span class="bubble-text">{{ message.content }}</span>
        <avatar-view />
      </div>
    </van-col>
  </van-row>
</template>
<script setup lang="ts">
import { defineProps, computed } from "vue";
import { userStore } from "@/store/userStore";
import AvatarView from "@/components/chat/avatar/AvatarView.vue";
const props = defineProps(["message"]);
const user_store = userStore();
const is_sender = computed<boolean>(() => {
  return user_store.user.uid !== props.message.sid;
});
</script>
<style scoped>
.box {
  margin: 1rem 0rem 0rem 0rem;
}
.bubble {
  display: flex;
  align-items: center;
}
.bubble-text {
  display: inline-block;
  background-color: white;
  align-items: center;
  border-radius: 1rem;
  padding: 1rem 1rem 1rem 1rem;
  margin-right: 1rem;
}
</style>
