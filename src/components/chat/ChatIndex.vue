<template>
  <van-row> &nbsp;</van-row>
  <van-row>
    <van-col :span="8">
      <van-badge dot color="green">
        <van-image
          round
          width="4rem"
          height="4rem"
          :src="user_store.user.avatar"
        />
      </van-badge>
      <span>{{ user_store.user.nickname }}</span>
    </van-col>
  </van-row>
  <van-row>
    <van-col :span="24">
      <van-cell-group inset>
        <van-field
          v-model="value"
          left-icon="https://fastly.jsdelivr.net/npm/@vant/assets/icon-demo.png"
          placeholder="请输入昵称"
        />
      </van-cell-group>
    </van-col>
  </van-row>

  <UserItem v-for="user in online_user" :key="user.uid" :user="user" />

  <van-tabbar v-model="active">
    <van-tabbar-item badge="3">
      <span>自定义</span>
      <template #icon="props">
        <img :src="props.active ? icon.active : icon.inactive" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item icon="search">标签</van-tabbar-item>
    <van-tabbar-item icon="setting-o">标签</van-tabbar-item>
  </van-tabbar>
</template>
<script setup lang="ts">
import { userStore } from "@/store/userStore";
import useSocket from "@/socket/socket.js";
import { ref, onMounted } from "vue";
import { User } from "@/types/chat_type";
import UserItem from "@/components/chat/item/UserItem.vue";
const user_store = userStore();
const online_user = ref<Array<User>>([]);
onMounted(() => {
  initWebSocket();
});
const initWebSocket = () => {
  const socket = useSocket(localStorage.getItem("uid"));
  socket.value = socket;
  socket.on("ready", (data: User) => {
    user_store.user = data;
    if (data) {
      socket.emit("user_list", data.uid, (state: number, data: Array<User>) => {
        if (state) {
          online_user.value = data;
        }
      });
    }
  });
};

const value = ref(0);

const active = ref(0);
const icon = {
  active: "https://fastly.jsdelivr.net/npm/@vant/assets/user-active.png",
  inactive: "https://fastly.jsdelivr.net/npm/@vant/assets/user-inactive.png",
};
</script>
<style lang="less" scoped>
.chat-room {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: #f5f5f5;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.day-divider {
  margin: 16px 0;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
}

.message-item {
  margin: 8px 0;

  &__title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #333;
  }

  &__label {
    font-size: 16px;
    color: #666;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 12px;
    font-size: 16px;
    background-color: #f5f5f5;
    border-radius: 8px;
  }

  &__content--me {
    align-items: flex-end;
    background-color: #0084ff;
    color: #fff;
  }

  &__time {
    margin-left: 8px;
    color: #999;
  }
}

.send-button {
  margin: 16px;
}
</style>
