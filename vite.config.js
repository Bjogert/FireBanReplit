import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  base: '/FireBanReplit/',
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html'
    }
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
});