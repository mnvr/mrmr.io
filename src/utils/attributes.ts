/* Convenience matchers for some attributes */

interface PageLike {
    attributes: string[];
}

/**
 * Return true if the content is in Hindi.
 *
 * This looks to see if the page has the "hindi" attribute.
 */
export const isHindiContent = ({ attributes }: PageLike) =>
    attributes.includes("hindi");

/**
 * Return true if this is a poem.
 *
 * This looks to see if the page has the "poem" attribute.
 */
export const isPoem = ({ attributes }: PageLike) => attributes.includes("poem");
