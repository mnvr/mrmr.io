import { defineConfig } from "vite";
import { globSync } from "tinyglobby";
import { mrmr } from "./vite-plugin-mrmr.ts";

// const entryPoints = globSync(["**/*.html", "!dist", "!node_modules"]);
const entryPoints = globSync(["index.html"]);

const mdEntryPoints = ["hunger.md"];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [mrmr()],
  appType: "mpa" /* disable the SPA 404 fallback in dev mode. */,
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        entryPoints
          .map((h) => [h, h])
          .concat(mdEntryPoints.map((m) => [m, m.replace(".md", ".html")])),
      ),
    },
  },
});
