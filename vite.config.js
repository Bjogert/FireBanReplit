import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
  ],
  build: {
    rollupOptions: {
      input: './src/index.jsx'
    }
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
});