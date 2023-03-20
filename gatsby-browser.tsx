import type { GatsbyBrowser } from "gatsby";

// These need to be a relative paths (similar to how we need to use relative
// paths in `gatsby-node.ts`.
import { wrapPageElementImpl } from "./src/gatsby/wrap";

/**
 * Add a {@link BuildTimePageContext}.Provider
 *
 * The Gatsby documentation seems to be telling us to use `wrapRootElement` to
 * setup contexts. However, we don't seem to have a direct way to access the
 * PageProps there. So we set up our context here instead.
 *
 * This seems to be what other folks also seem to be doing
 * ([ref](https://github.com/gatsbyjs/gatsby/issues/23239#issuecomment-615488235)):
 *
 * > If you want to dispatch the same action on every page, you could use
 *   `wrapPageElement`. It receives all of the same props your pages do, so it
 *   has access to `pageContext` and `data`.
 *
 * The same code also exists in `gatsby-browser.tsx`. To avoid repeating
 * ourselves, it has been extracted out to `src/gatsby/wrap.tsx`.
 */
export const wrapPageElement: GatsbyBrowser["wrapPageElement"] = (
    args,
    opts
) => {
    return wrapPageElementImpl!(args, opts);
};
