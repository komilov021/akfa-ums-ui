import { fileURLToPath, URL } from "node:url";
import { resolve, dirname } from "node:path";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import svgLoader from "vite-svg-loader";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { svgBuilder } from "./src/components/icon/svg/index";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    svgBuilder("./src/assets/svgs/"),
    VueI18nPlugin({
      include: resolve(
        dirname(fileURLToPath(import.meta.url)),
        "./src/assets/locales/**"
      ),
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "vue-i18n": "vue-i18n/dist/vue-i18n.runtime.esm-bundler.js",
    },
  },
});
