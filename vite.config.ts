import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: { exclude: ["@babylonjs/havok"] },
  server : {
    port : 3000
  }
});
