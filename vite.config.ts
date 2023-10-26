import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import VueMacros from "unplugin-vue-macros";
import Inspect from "vite-plugin-inspect";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueMacros.vite({
      definePropsRefs: false,
      setupComponent: false,
      setupSFC: false,
      namedTemplate: false,
      exportProps: false,

      plugins: {
        vue: Vue({
          include: [/\.vue$/, /\.setup\.[cm]?[jt]sx?$/],
          reactivityTransform: true,
        }),
      },
    }),

    // Inspect({
    //   build: true,
    // }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 8090,
  },
});
