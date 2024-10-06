import { type Plugin, defineConfig } from "vite";
import { globSync } from "tinyglobby";

const entryPoints = globSync(["**/*.html", "!dist", "!node_modules"]);

const head = (): Plugin => {
  return {
    name: "vite-plugin-head",
    transformIndexHtml(_, ctx) {
      const preview =
        ctx.originalUrl == "/" ? "/preview/blue.png" : "/preview.png";
      return [
        // <meta name="og:image" content="/preview/blue.png">
        {
          tag: "meta",
          attrs: { name: "og:image", content: preview },
          injectTo: "head",
        },
        // <link rel="icon" href="/icon.png" type="image/png">
        {
          tag: "link",
          attrs: { rel: "icon", href: "/icon.png", type: "image/png" },
          injectTo: "head",
        },
      ];
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  appType: "mpa" /* disable the SPA 404 fallback in dev mode. */,
  plugins: [head()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(entryPoints.map((h) => [h, h])),
    },
  },
});
