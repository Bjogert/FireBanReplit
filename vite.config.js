import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  base: '/FireBanReplit/',  // Ensure the base path is set correctly
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
      usePolling: true,  // Necessary for some environments
    },
    host: '0.0.0.0',  // Ensure the Vite server is accessible from outside the container
    port: 8080,  // Set the port to 8080
  },
});
