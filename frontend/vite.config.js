import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgrPlugin from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgrPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: "0.0.0.0",
    port: "80",
    hmr: {
      clientPort: 9000,
    },
  }
})
