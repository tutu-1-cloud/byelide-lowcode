import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import visualizer from 'rollup-plugin-visualizer'



export default defineConfig({
  plugins: [react(), vue(), VueDevTools(), visualizer({ filename: './bundle-analysis.html', gzipSize: true })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
