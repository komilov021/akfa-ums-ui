import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import { i18n } from "./i18n";
import AppTag from "@/components/common/AppTag.vue";
import "@/permissions";

// Styles
import "./assets/styles/main.scss";
import "./assets/styles/element/index.scss";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import { mask } from "vue-the-mask";

import App from "./App.vue";
import router from "./router";
import { registerIcons } from "./utils/common";

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

registerIcons(app);
app.component("app-tag", AppTag);

app.use(i18n);
app.use(createPinia());
app.use(ElementPlus);
app.use(router);

// Directives
app.directive("mask", mask as any);

app.mount("#app");
