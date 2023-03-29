<template>
  <div>
    <van-nav-bar
      :title="store.userInfo.userId"
      left-text="返回"
      @click-left="goBack"
    />
    <div v-if="loading">
      <van-skeleton>
        <template #template>
          <div :style="{ display: 'flex', width: '100%' }">
            <van-skeleton-image />
            <div :style="{ flex: 1, marginLeft: '16px' }">
              <van-skeleton-paragraph row-width="60%" />
              <van-skeleton-paragraph />
              <van-skeleton-paragraph />
              <van-skeleton-paragraph />
            </div>
          </div>
        </template>
      </van-skeleton>
    </div>
    <div class="chat-box">
      <chat-bubble :messsage="message" />
    </div>

    <van-row style="margin-top: 1rem">
      <van-col :span="3" align="center" style="margin-right: 1rem">
        <Uploader
          style="background-color: pink"
          preview-size="3rem"
          :before-read="checkFileType"
          :after-read="uploadVedio"
          upload-icon="video-o"
          accept="video/mp4"
        />
      </van-col>
      <van-col :span="3">
        <Uploader
          style="background-color: pink"
          preview-size="3rem"
          :before-read="checkFileType"
          :after-read="uploadVedio"
          accept="image/*"
        />
      </van-col>
    </van-row>
    <van-row align="center" style="height: 4rem; background-color: orange">
      <van-col :span="20">
        <van-cell-group inset>
          <van-field
            v-model="content"
            rows="1"
            left-icon="smile-o"
            autosize
            label="文本"
            type="textarea"
            placeholder="请输入..."
          />
        </van-cell-group>
      </van-col>
      <van-col :span="4"
        ><van-button type="success" @click="sendMessage"
          >发送</van-button
        ></van-col
      >
    </van-row>
  </div>
</template>
<script setup lang="ts">
import ChatBubble from "@/components/chat/bubble/ChatBubble.vue";
import { ref, reactive, onMounted, computed } from "vue";
import { uploadFile, DOMAIN } from "@/utils/qiniu";
import { useStore } from "@/store/chat/ChatPinia";
import { showNotify, Uploader, Progress } from "vant";
import socketClient from "@/socket/socket.js";
import { UploadProgress } from "qiniu-js/esm/upload";
const store = useStore();
interface User {
  userId: string;
  avatarImg?: string;
  nickname?: string;
  timestamp?: string;
  messages?: Array<string>;
}

interface Message {
  sendTime: number;
  contentType: string;
  content: any;
  receiverId: string;
  senderId: string;
}
const uploadPercent = ref<number>(0);
const loading = ref<boolean>(true);
let message = reactive<Message>({} as Message);
const content = ref<string>("");
const cacheFile = ref<File>();
onMounted(() => {
  loading.value = false;
});
const userId = computed(() => {
  return localStorage.getItem("userId");
});

const localUser = computed<User>(() => {
  return JSON.parse(localStorage.getItem("user")!);
});

const messageList = ref<Array<Message>>([]);
const goBack = () => {
  history.back();
};
const checkFileType = (file: any): boolean => {
  //TODO 上传文件前操作
  cacheFile.value = file;
  console.log(file.name);
  return true;
};
const uploadVedio = async (proxy: any) => {
  const observable = uploadFile(proxy["file"]);
  observable.subscribe(
    (value: UploadProgress) => {
      uploadPercent.value = value.total.percent;
    },
    null,
    (res: any) => {
      console.log(`${DOMAIN}${res["key"]}`);
    }
  );

  // message.contentType = "video/mp4";
  // message.content = file["content"].split(",")[1];
  // message.sendTime = Date.now();
  // message.senderId = localStorage.getItem("userId") ?? "";
  // message.receiverId = store.userInfo.userId;
  // socketClient.emit(
  //   "upload_video",
  //   [store.userInfo.userId, message],
  //   (state: any, data: any) => {
  //     if (state === 1) {
  //       showNotify({ type: "success", message: data });
  //     } else {
  //       showNotify({ type: "danger", message: data });
  //     }
  //   }
  // );
  // message.content = base64ToVedioUrl(message.content, message.contentType);
  // messageList.value.push(message);
  // message = {} as Message;
};
socketClient.on("receive_msg", (args: Message) => {
  if (args.contentType == "video/mp4") {
    const content = base64ToVedioUrl(args.content, args.contentType);
    args.content = content;
  }
  messageList.value.push(args);
});
const sendMessage = () => {
  message.senderId = localStorage.getItem("userId") ?? "";
  message.receiverId = store.userInfo.userId;
  message.content = content.value;
  message.contentType = "txt";
  message.sendTime = Date.now();
  let data = JSON.stringify(message);

  socketClient.emit("send_msg", data, (state: any, data: any) => {
    if (state === 1) {
      // 消息发送成功
      showNotify({ type: "success", message: data });
    } else {
      // 消息发送失败
      showNotify({ type: "danger", message: data });
    }
    messageList.value.push(message);
    message = {} as Message;

    content.value = "";
  });
};

const base64ToVedioUrl = (base64Str: string, type: string): string => {
  const binaryString = atob(base64Str);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i); // 将二进制字符串转换为字节数组
  }
  const videoBlog = new Blob([bytes], { type });
  return URL.createObjectURL(videoBlog);
};
</script>
<style scoped>
.chat-box {
  background-color: dimgrey;
  height: 30rem;
  overflow: hidden;
  overflow-y: scroll;
}
</style>
