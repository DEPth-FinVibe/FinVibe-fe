import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import svgr from "vite-plugin-svgr";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "https://finvibe.space",
        changeOrigin: true,
        ws: true,
      },
    },
  },
  // 프로덕션 번들에서만 디버그 로그를 제거한다 (dev에서는 그대로 동작).
  // console.error / console.warn 은 남겨 장애 추적이 가능하도록 한다.
  esbuild: {
    pure: ["console.log", "console.debug", "console.info"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ["lightweight-charts"],
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});

