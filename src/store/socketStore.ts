import { defineStore } from "pinia";
import { reactive } from "vue";
export const socketStore = defineStore("socket_store", {
  state: () => ({
    socket: {},
  }),
  getters: {},
  actions: {},
});
