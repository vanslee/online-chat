import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/app-index.vue"),
  },
  {
    path: "/private-chat",
    name: "private-chat",
    component: () => import("@/components/chat/private/PrivateChat.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
