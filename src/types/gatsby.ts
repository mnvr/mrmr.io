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
    readonly username: string;
};

/** Defines the interface between a `page` template and `gatsby-node.ts` */
export type PageTemplateContext = {
    readonly id: string;
};
