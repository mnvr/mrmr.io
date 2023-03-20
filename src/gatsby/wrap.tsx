import type { WrapPageElementNodeArgs } from "gatsby";
import * as React from "react";
import {
    BuildTimePageContext,
    parsePageIgnoringTypeSafety,
} from "templates/page";
import { isPageTemplateContext } from "types/gatsby";

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
 * This same code needs to exist in both `gatsby-ssr.tsx` and
 * `gatsby-browser.tsx`, so to avoid repeating ourselves we've extracted it out
 * here.
 */
export const wrapPageElementImpl = (args: WrapPageElementNodeArgs) => {
    const { element, props } = args;
    const { data, pageContext } = props;

    // If the context we receive looks like a `PageTemplateContext`, then assume
    // we're trying to render `templates/page.tsx`.
    //
    // This is liable to break.
    if (isPageTemplateContext(pageContext)) {
        // The data that is passed to `templates/page.tsx` when rendering a
        // `PageTemplateContext` is of type `Queries.PageTemplateQuery`.
        //
        // However, there apparently isn't a way to get visibility into the TS
        // types defined in `gatsby-types.d.ts` here, so we'll need to bypass
        // the type system.
        const page = parsePageIgnoringTypeSafety(data);

        return (
            <BuildTimePageContext.Provider value={page}>
                {element}
            </BuildTimePageContext.Provider>
        );
    }

    // Not the page we were looking for. Return it unchanged.
    return element;
};
