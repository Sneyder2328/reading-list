import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "icons/icon-192.svg",
        "icons/icon-512.svg",
      ],
      manifest: {
        name: "Reading List",
        short_name: "ReadingList",
        start_url: "/",
        display: "standalone",
        background_color: "#0b0c10",
        theme_color: "#111827",
        icons: [
          {
            src: "/icons/icon-192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "/icons/icon-512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "document" ||
              request.destination === "script",
            handler: "NetworkFirst",
            options: {
              cacheName: "app-shell",
            },
          },
          {
            urlPattern: ({ url }) =>
              url.hostname.includes("firestore.googleapis.com"),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "firestore-api",
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
