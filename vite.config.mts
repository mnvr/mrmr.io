import glob from "fast-glob";
import { defineConfig } from "vite";

const entryPoints = glob.sync([
    "**/*.html",
    "!dist",
    "!node_modules",
    "!public",
]);

// https://vitejs.dev/config/
export default defineConfig({
    // TODO
    publicDir: "static",
    appType: "mpa" /* disable the SPA 404 fallback in dev mode. */,
    build: {
        rollupOptions: {
            input: Object.fromEntries(
                entryPoints.map((h) => [h, h]),
            ),
        },
    },
});
