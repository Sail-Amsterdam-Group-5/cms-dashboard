import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  server: {
    proxy: {
      "/api": {
        target: "http://nginx-service-oscar-dev.apps.inholland.hcs-lab.nl", // Gateway URL
        changeOrigin: true, // Ensures the host header matches the target
        secure: true, // If the API uses HTTPS
        rewrite: (path) => path.replace(/^\/api/, ""), // Removes the /api prefix
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
