<template>
  <div>
    <text-view v-if="message.contentType === 1" v-bind:message="message" />
    <image-view v-else-if="message.contentType === 2" />
    <video-view v-else-if="message.contentType === 3" />
  </div>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
import VideoView from "@/components/chat/views/video/VideoView.vue";
import TextView from "@/components/chat/views/text/TextView.vue";
import ImageView from "@/components/chat/views/image/ImageView.vue";
const props = defineProps(["message"]);
</script>
<style scoped></style>
