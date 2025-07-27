import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src', // Source folder with index.html
  build: {
    outDir: '../dist', // Output to project root/dist
    emptyOutDir: true,
  },
});