import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: "static-site",
  base: "/english-study/",
  publicDir: "../public",
  plugins: [react()],
  build: {
    outDir: "../pages-dist",
    emptyOutDir: true,
  },
});
