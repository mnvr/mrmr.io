// This file defines types that are useful when working with our schema in
// Gatsby's GraphQL layer.

/** Known page types */
export type PageType = "user" | "page";

/** Type guard to verify that a string to one of our known page types */
export const isPageType = (s: string): s is PageType => {
    return s == "user" || s == "page";
};

/**
 * Convenience method to wrap the {@link isPageType} type guard and throw an
 * error if it fails.
 *
 * On success, it returns the input, but now TypeScript knows that it is a
 * {@link PageType}.
 */
export const ensureIsPageType = (s: string) => {
    if (!isPageType(s)) throw new Error(`Unknown page type: ${s}`);
    return s;
};

/** Defines the interface between a `user` template and `gatsby-node.ts` */
export type UserTemplateContext = {
    /** The username of the user whose home page we're trying to render */
    readonly username: string;
};

/**
 * Defines the interface between a `page` template and `gatsby-node.ts`.
 *
 * @see {@link isPageTemplateContext} for the associated type guard.
 */
export type PageTemplateContext = {
    /** The username of the user whose page we're trying to render */
    readonly username: string;
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
    c: Record<string, unknown>
): c is PageTemplateContext => {
    const username = c["username"];
    const pageID = c["pageID"];
    if (typeof username === "string" && typeof pageID === "string") return true;
    return false;
};
