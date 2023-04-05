import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Vant from "vant";
import { createPinia } from "pinia";
import "vant/lib/index.css";
import piniaPlugin from "@/store/plugins/storage_plugn";
const pinia = createPinia();
const app = createApp(App);
pinia.use(
  piniaPlugin({
    key: "socket",
  })
);
app.use(pinia);
app.use(Vant);
app.use(router).mount("#app");
