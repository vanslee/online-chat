<template>
  <div>
    <van-nav-bar
      :title="user_store.private_chat_user.nickname"
      left-text="返回"
      @click-left="goBack"
    />
    <div v-if="message_list.length === 0">
      <van-skeleton style="height: 30rem">
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
    <div v-else class="chat-box">
      <template v-for="message in message_list" :key="message.id">
        <RenderBubble v-bind:message="message" />
      </template>
    </div>

    <van-row style="margin-top: 1rem">
      <van-col :span="3" style="margin-right: 1rem">
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
        ><van-button
          type="success"
          @click="sendMessage"
          :disabled="isContentEmpty"
          >发送</van-button
        ></van-col
      >
    </van-row>
  </div>
</template>
<script setup lang="ts">
import RenderBubble from "@/components/chat/views/RenderBubble.vue";
import { reactive, computed, ref, toRefs } from "vue";
import { userStore } from "@/store/userStore";
import { Uploader, showNotify } from "vant";
import { Message } from "@/types/chat_type";
import { uploadFile, DOMAIN } from "@/utils/qiniu";
import useSocket from "@/socket/socket.js";
const socket = useSocket(localStorage.getItem("uid"));
const data = reactive({
  message_list: [] as Array<Message>,
  message: {} as Message,
  content: "" as string,
});
const isContentEmpty = computed<boolean>(() => {
  if (!content.value || content.value.length === 0) {
    return true;
  } else {
    return false;
  }
});
const { message, message_list, content } = toRefs(data);
const cacheFile = ref<File>();
const user_store = userStore();
const current_private_user = user_store.private_chat_user;
const current_user = user_store.user;
const uploadVedio = async (file: any) => {
  const observable = uploadFile(file["file"]);
  observable.subscribe(null, null, (res: any) => {
    if (res["key"]) {
      showNotify({ type: "success", message: "文件上传成功" });
      message.value.content = `${DOMAIN}${res["key"]}`;
      console.log(`${DOMAIN}${res["key"]}`);
    } else {
      showNotify({ type: "danger", message: "文件上传失败" });
    }
  });
};
const goBack = () => {
  history.back();
};
const checkFileType = (file: any): boolean => {
  //TODO 上传文件前操作
  cacheFile.value = file;
  console.log(file.name);
  return true;
};
const sendMessage = () => {
  message.value.rid = current_private_user.uid;
  message.value.sid = current_user.uid;
  message.value.content = content.value;
  message.value.contentType = 1;
  socket.emit("send_msg", message.value, (state: number) => {
    if (state) {
      message_list.value.push(message.value);
      showNotify({ type: "success", message: "消息发送成功" });
    } else {
      showNotify({ type: "danger", message: "消息发送失败" });
    }
    message.value = {} as Message;
    content.value = "";
  });
};
socket.on("receive_msg", (data: Message) => {
  console.log("监听到消息", data);
  message_list.value.push(data);
});
</script>
<style scoped>
.chat-box {
  background-color: black;
  height: 30rem;
  overflow: hidden;
  overflow-y: scroll;
}
</style>
