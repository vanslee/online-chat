<template>
  <VanImage
    style="flex-shrink: 0"
    round
    src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
    fit="fill"
    width="3rem"
    height="3rem"
  />
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { Image as VanImage } from "vant";
</script>
<style scoped></style>
