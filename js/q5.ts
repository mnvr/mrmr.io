/** Load Q5 from CDN, and draw our sketch using it. */
export const loadQ5 = async (
  sketch: (q5: any, parent: HTMLElement) => void,
  parentID: string,
) => {
  await loadJS("https://q5js.org/q5.js");
  // @ts-expect-error TS doesn't know about Q5 since we load it dynamically.
  const q5: any = new Q5();

  // The Q5 constructor takes an optional parent argument, but I was not able
  // to get it to work (Sep 2024). As an alternative, move it there ourselves.
  const parent = document.getElementById(parentID)!;

  sketch(q5, parent);
  setTimeout(() => parent.appendChild(q5.canvas), 0);
};

/** Load a non-ESM script from the given {@link src} URL. */
const loadJS = async (src: string) =>
  new Promise<void>((resolve) => {
    const scriptTag = document.createElement("script");
    scriptTag.src = src;
    scriptTag.onload = () => resolve();
    document.getElementsByTagName("head")[0].appendChild(scriptTag);
  });
