<template>
  <van-row> &nbsp;</van-row>
  <van-row>
    <van-col :span="8">
      <van-badge dot color="green">
        <van-image
          round
          width="4rem"
          height="4rem"
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
        />
      </van-badge>
      <span>李登祥</span>
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

  <chat-item v-for="user in userList" :key="user.userId" :user="user" />

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
import ChatItem from "@/components/chat/item/chat-item.vue";
import { showNotify, showToast } from "vant";
import { ref, reactive, onMounted } from "vue";
import socketClient from "@/socket/socket.js";
const value = ref(0);
const token = ref("");

interface User {
  userId: string;
  avatarImg?: string;
  nickname?: string;
  timestamp?: string;
  messages?: Array<string>;
}
const active = ref(0);
const icon = {
  active: "https://fastly.jsdelivr.net/npm/@vant/assets/user-active.png",
  inactive: "https://fastly.jsdelivr.net/npm/@vant/assets/user-inactive.png",
};
const menuVisible = ref<boolean>(false);

const messageInput = ref<string>("");

onMounted(() => {
  initWebSocket();
});
const userList = ref<Array<User>>([]);

// const sendMessage = () => {
//   showNotify({ message: `发送消息给${message.sender}成功` });
//   socket.value.send(JSON.stringify(message));
// };
const initWebSocket = () => {
  socketClient.on("error", () => {
    console.log("链接出现错误");
  });
  socketClient.on("disconnect", () => {
    console.log(`- disconnect`);
  });
  socketClient.io.on("reconnect_attempt", () => {
    console.log("重新尝试链接");
    socketClient.io.opts.extraHeaders = {
      token: token.value,
    };
  });
  socketClient.io.on("reconnect_failed", () => {
    console.warn("重新链接失败");
  });
  socketClient.io.on("reconnect", () => {
    console.log("重新链接成功");
  });
  socketClient.on("connect", (data: any) => {
    console.log("链接成功");
  });
  socketClient.on("ready", listenerReady);
};
const listenerReady = (data: any) => {
  localStorage.setItem("user", JSON.stringify(data));

  // 获取所有在线的人信息
  socketClient.emit(
    "user_list",
    localStorage.getItem("userId"),
    (state: any, data: any) => {
      console.log("查询所有在线人的信息");
      if (state) {
        userList.value = data;
      } else {
        console.log("获取在线人列表出现错误", data);
      }
    }
  );
};
const updateContactUser = (value: any) => {
  console.log("value", value);
};
const goBack = () => {
  history.back;
};
const showMenu = (e: MouseEvent) => {
  console.log(e.target);
  // menuVisible = !menuVisible
};
const onMenuItemClick = (item: any) => {
  switch (item.name) {
    case "Profile":
      showToast("Go to profile page.");
      break;
    case "Settings":
      showToast("Go to settings page.");
      break;
    case "Log out":
      showToast("Log out.");
      break;
  }
  menuVisible.value = false;
};
const sendMessage = () => {
  if (messageInput.value.trim() === "") {
    showToast("Please enter a message.");
    return;
  }
  const message = {
    sender: "Me",
    content: messageInput.value.trim(),
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
  const toPrivateChat = () => {
    console.log("asdas");
  };
  messageInput.value = "";
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
