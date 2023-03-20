import type { GatsbySSR } from "gatsby";

// These need to be a relative paths (similar to how we need to use relative
// paths in `gatsby-node.ts`).
import { wrapPageElementImpl } from "./src/gatsby/wrap";

export const wrapPageElement: GatsbySSR["wrapPageElement"] = (args) => {
    return wrapPageElementImpl(args);
};
