import { reactive } from "vue";
import { defineStore } from "pinia";

interface User {
  userId: string;
  avatarImg?: string;
  nickname?: string;
  timestamp?: string;
  messages?: Array<string>;
}
export const useStore = defineStore("private-chat", {
  state: () => ({
    userInfo: reactive<User>({} as User),
    client: reactive<any>({}),
  }),
  getters: {},
  actions: {},
});
