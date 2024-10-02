import { type Plugin } from "vite";

export const mrmr = (): Plugin => {
  console.log("mrmr/init");

  return {
    name: "mrmr",
    // enforce: "pre",

    configureServer(server) {
      console.log("configureServer", server);
      server.middlewares.use(async (req, res, next) => {
        const url = req.originalUrl;
        console.log("middleware", url); //, res, next);
        if (url == "/hunger") {
          const md = render(url.slice(1));
          const z = await server.transformIndexHtml(url, md);
          console.log(z);
          res.setHeader("Content-Type", "text/html")
          res.end(z);
        } else {
          next();
        }
      });
    },

    buildStart(options) {
      console.log("buildStart", options);
    },

    resolveId(source, importer, options) {
      this.warn("resolveId: " + source);
      console.log("resolveId", source, importer, options);
      if (source == "/hunger") return "hunger.html";
      if (source == "/hunger.md") return "hunger.html";
      if (source == "/hunger.html") return "hunger.html";
      if (source == "hunger.html") return "hunger.html";
    },

    load(id: string) {
      console.log("load", id);
      if (id == "hunger.html" || id == "/hunger.html") {
        return render("hunger.md");
      }
    },

    transformIndexHtml(html) {
      console.log("transformIndexHtml", html);
    },
  };
};

const render = (mdFileName: string) => {
  console.log("render", mdFileName);
  return `<h1>hello world</h1>`;
};
