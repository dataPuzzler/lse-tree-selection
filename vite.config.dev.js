import * as path from 'path'
import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser'


export default defineConfig({
  root: "src",
  server: {
    port: 3003,
    host: 'localhost',
    strictPort: true
  },

  build: {
    lib: {
      entry: path.resolve(__dirname, 'src', 'lse_tree_select.js'), // entry point for your library
      name: 'lse-tree-select', 
      formats: ['es', 'umd'], 
    },
    sourcemap: true,
    emptyOutDir: true,
    outDir: "../dist",
    rollupOptions: {
      external: [],
      output : {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            // Return an empty string to exclude CSS files
            return '';
          }
          return '[name][extname]';
        },
      },
      plugins: [
        babel(
          {
          babelHelpers: 'bundled',
          exclude: 'node_modules/**', // Exclude node_modules from Babel transpilation
          presets: ['@babel/preset-env'],
          }
        ),
        terser(
          {
            compress: {
              drop_console: true,  // Remove console logs
            }
          }
        )
      ]
    },
  },
});
