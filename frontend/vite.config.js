import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgrPlugin from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgrPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  exports :{
    devServer: {
      hot: false,
      liveReload: false
    }
  },
  server: {
    host: "0.0.0.0",
    port: "80",
    hmr: {
      host: "localhost",
      protocol: "ws",      
    },
    proxy: {
      '/api': {
        target:'http://127.0.0.1:8000'
      }
    }
  },
});
