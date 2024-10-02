export const mrmr = () => {
  console.log("mrmr/init");
  return {
    name: "mrmr",
    resolveId(id: string) {
      console.log("resolveId", id);
      if (id == "hunger.md") return "hunger.html"
    },
    load(id: string) {
      console.log("load", id);
      if (id == "hunger.html") {
        return `<h1>hello world</h1>`;
      }
    },
  };
};
