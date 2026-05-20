import { defineConfig } from 'vite';

export default defineConfig({
  root: 'demo',
  base: '/replace-rtl-detect/',
  build: {
    outDir: '../dist-demo',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    open: true
  }
});
