import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/FarmSimulator/", // Base path for GitHub Pages
  build: {
    assetsInlineLimit: 0, // Ensure all assets are processed as files
    rollupOptions: {
      output: {
        manualChunks: undefined, // Disable code splitting for simpler output
      },
    },
  },
});
