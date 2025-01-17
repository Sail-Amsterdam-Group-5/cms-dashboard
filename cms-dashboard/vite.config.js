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
        target: "http://nginx-service-oscar-dev.apps.inholland.hcs-lab.nl", // Redirect all /api requests
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Removes /api prefix when forwarding to the target
      },
      "/login": {
        target: "http://nginx-service-oscar-dev.apps.inholland.hcs-lab.nl", // Redirect to /login
        changeOrigin: true,
        secure: true,
      },
      "/faqs": {
        target: "http://nginx-service-oscar-dev.apps.inholland.hcs-lab.nl/faq",
        changeOrigin: true, // Ensures the host header matches the target
        secure: true, // If the API uses HTTPS
      },
      "/locations": {
        // Target for Users API
        target: "http://sail-map-api-route-oscar-dev.apps.inholland.hcs-lab.nl",
        changeOrigin: true,
        secure: true,
      },
      "/utilities": {
        // Target for Users API
        target: "http://sail-map-api-route-oscar-dev.apps.inholland.hcs-lab.nl",
        changeOrigin: true,
        secure: true,
      },
      "/user/users": {
        // Target for Users API
        target: "http://nginx-service-oscar-dev.apps.inholland.hcs-lab.nl",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
