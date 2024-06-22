// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  base: '/FireBanReplit/', // Add your repository name here
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: './src/index.jsx',
        css: './src/App.css'
      }
    }
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
});