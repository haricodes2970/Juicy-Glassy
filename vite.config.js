import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { chromeExtension } from 'vite-plugin-chrome-extension'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    chromeExtension(),
    {
      name: 'copy-injector',
      writeBundle(options) {
        const outDir = options.dir || 'dist'
        const src = path.resolve('content', 'injector.js')
        const destDir = path.resolve(outDir, 'content')
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
        fs.copyFileSync(src, path.resolve(destDir, 'injector.js'))
      },
    },
  ],
  build: {
    rollupOptions: {
      input: 'manifest.json',
    },
  },
})
