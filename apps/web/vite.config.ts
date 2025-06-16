import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repository = process.env.GITHUB_REPOSITORY?.split('/')?.[1]
const base = repository ? `/${repository}/` : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        notFound: path.resolve(__dirname, '404.html'),
      },
    },
  },
})
