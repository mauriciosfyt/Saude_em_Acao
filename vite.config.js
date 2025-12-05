import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build configuration
  build: {
    // Otimizar para SPA
    rollupOptions: {
      input: 'index.html',
    },
    // Melhorar performance
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  
  server: {
    // Proxy /api requests to the backend to avoid CORS during development
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://23.22.153.89:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
