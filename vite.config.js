import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://skinsify-backend.onrender.com',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    },
    build: {
      outDir: 'build',
    },
    port: 3000,
    host: true
  }
});
