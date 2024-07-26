import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "./src/shared/styles/app.scss" as *;',
      },
    },
  },
  build: {
    outDir: 'dist',
  },
  // server: {
  //   host: true,
  //   port: 3000,
  // },
})
