import { defineConfig } from "vite";
import glob from "fast-glob";

const entryPoints = glob.sync(["**/*.html", "!dist", "!node_modules"]);

// https://vitejs.dev/config/
export default defineConfig({
  appType: "mpa" /* disable the SPA 404 fallback in dev mode. */,
  build: {
    rollupOptions: {
      input: Object.fromEntries(entryPoints.map((h) => [h, h])),
    },
  },
});
