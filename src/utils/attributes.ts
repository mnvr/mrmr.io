/* Convenience matchers for some attributes */

interface PageLike {
    slug: string;
    attributes: string[];
}

/**
 * Return true if the content is in Hindi.
 *
 * This looks to see if the page has the "hindi" attribute.
 */
export const isHindiContent = ({ attributes }: PageLike) =>
    attributes.includes("hindi");

