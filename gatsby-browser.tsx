import type { GatsbyBrowser } from "gatsby";

// This enables us to use
//
//     body {
//         font-family: 'Fira Mono', monospace;
//     }
//
// [Note: Variable width monospace font]
//
// We currently only import the static 'Fira Mono' typespace with the default
// weight of 400. This file is 16KB. However, this means that the font looks
// ugly at other font-weights. There are two easy fixes for this:
//
// 1. Either import the (additional 16KB) of the 500 weight variant
//    https://fontsource.org/fonts/fira-mono/install
//
//        import '@fontsource/fira-mono/500.css';
//
// 2. Or better, just import the variable font that supports the whole range of
//    font-weights (this is 32 KB).
//    https://fontsource.org/fonts/fira-code/install
//
//        import '@fontsource-variable/fira-code';
//
// Option 2 is likely the direction we'll take eventually, but currently there
// is only one place where a bold weight monospace font is needed, and that too
// not urgently, so we stay with the static single variant for now.
//
// References:
// - https://fontsource.org/fonts/fira-mono/install
// - https://www.gatsbyjs.com/docs/how-to/styling/using-web-fonts/
//
import "@fontsource/fira-mono";

// These need to be a relative paths (similar to how we need to use relative
// paths in `gatsby-node.ts`).
import { wrapPageElementImpl } from "./src/gatsby/wrap";

export const wrapPageElement: GatsbyBrowser["wrapPageElement"] = (args) => {
    return wrapPageElementImpl(args);
};
