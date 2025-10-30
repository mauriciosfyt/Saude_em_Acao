import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy /api requests to the backend to avoid CORS during development
    proxy: {
      '/api': {
        target: 'http://34.205.11.57',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
