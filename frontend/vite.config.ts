import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Frontend dev server port
    proxy: {
      // Proxy API requests to the backend to avoid CORS issues during development
      '/api': {
        target: 'http://localhost:8080', // Your Spring Boot backend address
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
