import { defineConfig } from "vite";
export default defineConfig({
  root: ".",
  appType: "spa",
  server: { host: "0.0.0.0", port: 5500, strictPort: false },
  build: { outDir: "dist", emptyOutDir: true }
});