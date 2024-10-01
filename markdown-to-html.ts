// npx esbuild markdown-to-html.ts > markdown-to-html.js && node markdown-to-html.js

import markdownit from "markdown-it";
import fs from "node:fs/promises";

const main = async () => {
  const md = markdownit();
  const mdContents = await fs.readFile("hunger.md", "utf-8");
  const htmlContents = md.render(mdContents);
  await fs.writeFile("test.html", htmlContents);
};

void main();
