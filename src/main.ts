import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import globalComponents from "./components";
import utils from "./utils";
import "./assets/css/app.css";

import http from '@/services/http-common';
import { AxiosKey } from "@/services/symbols";

// import signalRHub from "./plugin/signalR/connection";
// import printerHub from "./plugin/signalR/printerHub";
// import webserial from "./plugin/webserial";

const app = createApp(App).use(router).use(createPinia());

globalComponents(app);
utils(app);
// app.use(signalRHub);
// // app.use(printerHub);
// app.use(webserial);
app.mount("#app");

app.provide(AxiosKey, http)
// app.provide('signalrhub', signalRHub.install(app));
// // app.provide('printerHub', printerHub.install(app));
// app.provide('webserial', webserial.install(app));
