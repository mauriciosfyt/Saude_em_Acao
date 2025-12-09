import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://54.144.210.178'),
  },
  server: {
    // Proxy /api requests to the backend to avoid CORS during development
    proxy: {
      '/api': {
        target: 'http://54.144.210.178',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
