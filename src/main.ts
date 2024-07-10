import { createApp } from "vue";
import "./style.css";
import App from "./1_app/App.vue";
import router from "./1_app/router";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";

const app = createApp(App);

app.use(router);
app.use(VueQueryPlugin);
app.mount("#app");
