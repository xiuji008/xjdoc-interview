import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    // 构建时将 docs/ 复制到 dist/docs/，确保 .md 文件可被前端 fetch
    {
      name: 'copy-docs',
      closeBundle() {
        const src = path.resolve('docs')
        const dest = path.resolve('dist/docs')
        if (fs.existsSync(src)) {
          fs.cpSync(src, dest, { recursive: true, force: true })
          console.log(`[copy-docs] ${src} → ${dest}`)
        }
      },
    },
  ],
  base: './',
  build: {
    outDir: 'dist',
  },
})
