// This file defines types that are useful when working with our schema in
// Gatsby's GraphQL layer.

/**
 * Defines the interface between a `page` template and `gatsby-node.ts`.
 *
 * @see {@link isPageTemplateContext} for the associated type guard.
 */
export type PageTemplateContext = {
    /** The ID of the page we're trying to render */
    readonly pageID: string;
    /**
     * The relative directory where we should look for the images.
     *
     * In particular, we look for a preview image at this path; such an image
     * might not exist at this path, but that's fine we'll fallback to the
     * default. This is just the path where it'd have existed had it existed.
     */
    readonly relativeDirectory: string;
};

/**
 * A type guard for {@link PageTemplateContext}.
 *
 * This is a type guard to see if an arbitrary context that we get is actually
 * one that looks like it is a page context. Using this to determine if a given
 * context is indeed a {@link PageTemplateContext} might give false positives if
 * in the future we add more contexts that have these fields as a subset.
 */
export const isPageTemplateContext = (
    c: Record<string, unknown>,
): c is PageTemplateContext => {
    const pageID = c["pageID"];
    if (typeof pageID === "string") return true;
    return false;
};
