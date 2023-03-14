// This file defines types that are useful when working with our schema in
// Gatsby's GraphQL layer.

/** Known template types */
export type TemplateName = "user" | "page";

/** Type guard to verify that a string to one of our known template types */
export const isTemplateName = (s: string): s is TemplateName => {
    return s == "user" || s == "page";
};

/**
 * Convenience method to wrap the {@link isTemplateName} type guard and throw an
 * error if it fails.
 */
export const ensureTemplateName = (s: string) => {
    if (!isTemplateName(s)) throw new Error(`Unknown template name: ${s}`);
    return s;
};

/** Defines the interface between the `user` template and `gatsby-node.ts` */
export type UserTemplateContext = {
    readonly username: string;
};

/** Defines the interface between the `page` template and `gatsby-node.ts` */
export type PageTemplateContext = {
    readonly id: string;
};
