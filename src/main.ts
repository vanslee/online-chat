import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Vant from "vant";
import { createPinia } from "pinia";
const pinia = createPinia();
import "vant/lib/index.css";
import piniaPlugin from "@/store/plugins/storage_plugn";
const app = createApp(App);
pinia.use(
  piniaPlugin({
    key: "socket",
  })
);
app.use(createPinia());
app.use(Vant);
app.use(router).mount("#app");
