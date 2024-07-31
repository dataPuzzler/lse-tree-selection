// vite.config.js
import * as path from 'path'
import { defineConfig } from 'vite';
import terser from '@rollup/plugin-terser' // Import terser plugin for minification

export default defineConfig({
  root: "src",
  test:{
    environment: 'happy-dom', // or 'jsdom' if 'happy-dom' isn't suitable
    globals: true,
    // setupFiles: './test/setup.js', // global setup
    include: ['*.test.js'], // Adjust if needed
  },

  build: {
    lib: {
      entry: path.resolve(__dirname, 'src', 'lse_tree_select.js'), // entry point for your library
      name: 'lse-tree-select', // name of your library
      formats: ['es', 'umd'], // desired formats (ES module and UMD)
    },
    outDir: "../dist",
    rollupOptions: {
      external: [],
      plugins: [
        terser()
      ]
    },
  },
});
