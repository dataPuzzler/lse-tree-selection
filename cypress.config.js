import { defineConfig } from 'cypress';

export default defineConfig({
  video: true,
  e2e: {
    baseUrl: 'http://localhost:5000', // Change this to your Vite server's port
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
    },
  },
});
