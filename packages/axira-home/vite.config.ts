import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // allow external access (needed for ngrok)
    port: 5174, // your desired local port
    allowedHosts: [
      'unexpectant-overfluently-carolann.ngrok-free.dev',
    ],
    proxy: {
      '/graphql': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/orchestration': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/conversations': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/api/evidence-packs': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/api/evidence': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/api/subjects': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
    },
  },
});
