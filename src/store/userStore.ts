import { reactive } from "vue";
import { defineStore } from "pinia";
import { User } from "@/types/chat_type";
export const userStore = defineStore("user_store", {
  state: () => ({
    private_chat_user: reactive<User>({} as User),
    user: reactive<User>({} as User),
  }),
  getters: {},
  actions: {
    updateUserInfo(user: User) {
      this.user = user;
    },
    getUserInfo(): User {
      return this.user;
    },
  },
});
