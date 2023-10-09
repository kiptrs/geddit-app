import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import pwaIcons from "./icons.json";

const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  root: path.resolve(__dirname, "src"),
  server: {
    port: 8000,
    hot: true,
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: "prompt",
      injectRegister: "auto",
      manifest: {
        name: "Geddit",
        short_name: "Geddit",
        id: "/",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        description: "TBD",
        lang: "en",
        scope: "/",
        icons: pwaIcons,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      bootstrap: path.resolve(__dirname, "node_modules/bootstrap"),
      hammerjs: path.resolve(__dirname, "node_modules/hammerjs"),
      showdown: path.resolve(__dirname, "node_modules/showdown"),
      "@capacitor/core": path.resolve(
        __dirname,
        "node_modules/@capacitor/core"
      ),
    },
  },
});
