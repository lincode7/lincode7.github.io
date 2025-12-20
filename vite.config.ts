import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "offline.html",
        "posts-index.json",
        "interests-index.json",
      ],
      manifestFilename: "manifest.json",
    }),
  ],
  // GitHub Pages 需要的基础路径
  base: "/",
  build: {
    outDir: "dist",
    sourcemap: false,
    // 代码分割优化
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          markdown: ["marked", "marked-highlight", "highlight.js"],
          utils: ["gray-matter"],
        },
      },
    },
  },
});
