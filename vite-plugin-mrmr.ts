export const mrmr = () => {
  console.log("mrmr/init");
  return {
    name: "mrmr",
    resolveId(id: string) {
      console.log(id);
    },
  };
};
