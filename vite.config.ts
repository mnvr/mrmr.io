import { type HtmlTagDescriptor, type Plugin, defineConfig } from "vite";
import { globSync } from "tinyglobby";
import { readFile } from "node:fs/promises";

const entryPoints = globSync(["**/*.html", "!dist", "!node_modules"]);

const head = async (): Promise<Plugin> => {
  return {
    name: "vite-plugin-head",
    transformIndexHtml: {
      order: "pre",
      async handler(html, ctx) {
        const paperCss = `<link rel="stylesheet" href="./paper.css">`;
        if (html.includes(paperCss)) {
          const css = await readFile("paper.css", "utf-8");
          html = html.replace(paperCss, `<style>${css}</style>`);
        }
        const preview =
          ctx.originalUrl == "/" ? "/preview/blue.png" : "/preview.png";
        const tags: HtmlTagDescriptor[] = [
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
        return { html, tags };
      },
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
