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
  },
  build: {
  rolldownOptions: {
    output: {
      codeSplitting: {
        includeDependenciesRecursively: false,
        groups: [
          {
            name: 'vue-common-lib',
            test: /node_modules[\\/](vue|@vue|vue-router|pinia)[\\/]/,
            priority: 50
          },
          {
            name: 'vue-flow',
            test: /node_modules[\\/]@vue-flow[\\/]/,
            priority: 40
          },
          {
            name: 'echarts',
            test: /node_modules[\\/](echarts|zrender|vue-echarts)[\\/]/,
            priority: 20
          },
          {
            name: 'validate',
            test: /node_modules[\\/]vee-validate[\\/]/,
            priority: 10
          }
        ]
      }
    }
  }
}
})
