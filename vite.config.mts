// TODO
// import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const mrmr = () => {
    return {
        name: "mrmr",

        resolveId(id) {
            console.log(arguments);
            if (id.startsWith("utils/")) {
                return import.meta.dirname + "/src/" + id + ".ts";
            }
        },
    };
};

// Relative paths to HTML files (sans .html) to build.
const entryPoints = ["index", "404", "a"];

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [mrmr()],
    // TODO
    publicDir: "static",
    appType: "mpa" /* disable the SPA 404 fallback in dev mode. */,
    build: {
        rollupOptions: {
            input: Object.fromEntries(
                entryPoints.map((h) => [h, `import.meta.dirname/${h}.html`]),
            ),
        },
    },
});
