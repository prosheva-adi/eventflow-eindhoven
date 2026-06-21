import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    historyApiFallback: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor'
            }
            if (id.includes('leaflet') || id.includes('react-leaflet')) {
              return 'map'
            }
            if (id.includes('sockjs') || id.includes('stompjs')) {
              return 'websocket'
            }
            return 'deps'
          }
        }
      }
    },
    sourcemap: true,
  },
})