import { defineConfig } from 'vite';


export default defineConfig({
  root: "src",
  server: {
    port: 3003,
    host: 'localhost',
    strictPort: true
  }
});
