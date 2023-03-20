import type { GatsbySSR } from "gatsby";
import * as React from "react";

// These need to be a relative paths (similar to how we need to use relative
// paths in `gatsby-node.ts`.
import {
    BuildTimePageContext,
    parsePageIgnoringTypeSafety,
} from "../templates/page";
import { isPageTemplateContext } from "../types/gatsby";

export const wrapPageElementImpl: GatsbySSR["wrapPageElement"] = (
    args,
    opts
) => {
    const { element, props } = args;
    const { data, pageContext } = props;

    // If the context we receive looks like a `PageTemplateContext`, then assume
    // we're trying to render `templates/page.tsx`. This is liable to break.
    if (isPageTemplateContext(pageContext)) {
        // The data that is passed to `templates/page.tsx` when rendering a
        // `PageTemplateContext` is of type `Queries.PageTemplateQuery`.
        //
        // However, there apparently isn't a way to get visibility into the TS
        // types defined in `gatsby-types.d.ts` here, so we'll need to bypass
        // the type system.
        const page = parsePageIgnoringTypeSafety(data);
        const name = "wrapPageElement";
        console.log({ name, args, opts, props });

        return (
            <BuildTimePageContext.Provider value={page}>
                {element}
            </BuildTimePageContext.Provider>
        );
    }

    // Not the page we were looking for. Return it unchanged.
    return element;
};
