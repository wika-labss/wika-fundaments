import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// El puerto lo fija scripts/wika-dev.mjs (PORT asignado por WIKA Studio).
export default defineConfig({
  plugins: [react()],
  publicDir: "assets",
  server: {
    strictPort: true,
    allowedHosts: true,
  },
});
