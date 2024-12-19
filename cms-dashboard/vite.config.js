import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  server: {
    proxy: {
      "/faqs": {
        //target: 'https://faq-fastapi-api-oscar-dev.apps.inholland.hcs-lab.nl', // Target API
        target: "https://sail-faq-api-route-oscar-dev.apps.inholland.hcs-lab.nl",
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
      }
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
