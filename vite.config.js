import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        catalogue: resolve(__dirname, 'src/catalogue.html'),
        'add-product': resolve(__dirname, 'src/add-product.html'),
      },
    },
  },
  server: {
    open: '/index.html',
  },
});