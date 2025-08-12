import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1366,
  viewportHeight: 768,
  e2e: {
    baseUrl:'http://localhost:4173',
    setupNodeEvents(on, config) {
    },

    experimentalStudio: true,
  },
});
