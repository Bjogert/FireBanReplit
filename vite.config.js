import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  base: '/FireBanReplit/',  // Ensure correct base path for GitHub Pages
  plugins: [
    react(),
    cssInjectedByJsPlugin()
  ],
  build: {
    rollupOptions: {
      input: './src/index.jsx'  // Define the main entry point
    }
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
});