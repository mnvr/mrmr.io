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
        html = await inlineCSS("paper", html);
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

// This is likely too slow, but I haven't found a simpler way. Not inlining the
// CSS effectively doubles our page load time, since that's the only blocking
// load these pages usually make.
const inlineCSS = async (name: string, html: string) => {
  const link = `<link rel="stylesheet" href="./${name}.css">`;
  if (html.includes(link)) {
    const css = await readFile(`${name}.css`, "utf-8");
    html = html.replace(link, `<style>${css}</style>`);
  }
  return html;
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
