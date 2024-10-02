import { type Plugin } from "vite";

export const mrmr = (): Plugin => {
  console.log("mrmr/init");

  return {
    name: "mrmr",

    buildStart(options) {
      console.log("buildStart", options);
    },

    resolveId(source, importer, options) {
      console.log("resolveId", source, importer, options);
      if (source == "hunger.md") return "hunger.html";
      if (source == "hunger.html") return "hunger.html";
    },

    load(id: string) {
      console.log("load", id);
      if (id == "hunger.html") {
        return `<h1>hello world</h1>`;
      }
    },
  };
};
