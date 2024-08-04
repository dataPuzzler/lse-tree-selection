import path from 'path';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export default {
  input: path.resolve(__dirname, 'src', 'lse_tree_select.js'), 
  output: [
    {
      file: path.resolve(__dirname, 'dist/lse_tree_select.esm.js'),
      format: 'es',
      sourcemap: true,
    },
    {
        file: path.resolve(__dirname, 'test-dist/lse_tree_select.esm.js'),
        format: 'es',
      }
  ],
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
};
