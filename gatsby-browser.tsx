import type { GatsbyBrowser } from "gatsby";

// This enables us to use
//
//     body {
//         font-family: 'Fira Mono', monospace;
//     }
//
// References:
// - https://fontsource.org/fonts/fira-mono/install
// - https://www.gatsbyjs.com/docs/how-to/styling/using-web-fonts/
import "@fontsource/fira-mono";

// These need to be a relative paths (similar to how we need to use relative
// paths in `gatsby-node.ts`).
import { wrapPageElementImpl } from "./src/gatsby/wrap";

export const wrapPageElement: GatsbyBrowser["wrapPageElement"] = (args) => {
    return wrapPageElementImpl(args);
};
