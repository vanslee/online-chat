<template>
  <van-row class="chat-item" @click="toPrivateChat">
    <van-col :span="6" class="horizontal-center">
      <van-image width="4rem" height="4rem" fit="contain" :src="user.avatar" />
    </van-col>
    <van-col :span="18">
      <van-row justify="center" align="center">
        <div>{{ user.nickname }}</div>
      </van-row>
      <van-row
        justify="center"
        align="center"
        style="font-size: 2rem; color: gray"
      >
        <div>{{ user.introduction }}</div>
      </van-row>
    </van-col>
  </van-row>
</template>
<script setup lang="ts">
import { defineProps, toRefs } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "@/store/userStore";
const user_store = userStore();
const props = defineProps(["user"]);
const { user } = toRefs(props);

const router = useRouter();
const toPrivateChat = () => {
  user_store.private_chat_user = user?.value;
  router.push({
    name: "private-chat",
  });
};
</script>
<style scoped>
.chat-item {
  padding: 1rem 0 1rem 1rem;
  border: 1px solid dark;
}

.horizontal-center {
  display: flex;
  align-items: center;
}
</style>
