<template>
  <van-row class="chat-item" @click="toPrivateChat">
    <van-col :span="6" class="horizontal-center">
      <van-image
        width="4rem"
        height="4rem"
        fit="contain"
        src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
      />
    </van-col>
    <van-col :span="18" class="horizontal-center">
      <div>{{ user.userId }}</div>
    </van-col>
  </van-row>
</template>
<script setup lang="ts">
import { ref, reactive, defineProps } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store/chat/ChatPinia";
const store = useStore();
const props = defineProps(["user"]);
const router = useRouter();
const toPrivateChat = () => {
  console.log(props.user);

  router.push({
    name: "private-chat",
  });
  store.userInfo = props.user;
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
