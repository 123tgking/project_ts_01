import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  test: {
    // 启用全局 API（如 describe、it 无需手动导入）
    globals: true,
    // 使用 jsdom 模拟浏览器环境
    environment: 'jsdom',
    // 测试文件匹配规则
    include: ['**/*.test.ts', '**/*.spec.ts'],
    // 排除不需要测试的目录
    exclude: ['node_modules', 'dist']
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      "/local_api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/local_api/, "")
      }
    }
  }
})
