import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // When Django runs on port 8000, requests to /api/... are forwarded to it.
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
});
