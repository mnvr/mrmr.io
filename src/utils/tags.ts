/* Convenience matchers for some tags */

interface PageLike {
    tags: string[];
}

/**
 * Return true if the content is in Hindi.
 *
 * This looks to see if the page has the "hindi" tag.
 */
export const isHindiContent = ({ tags }: PageLike) => tags.includes("hindi");

/**
 * Return true if this is a poem.
 *
 * This looks to see if the page has the "poem" tag.
 */
export const isPoem = ({ tags }: PageLike) => tags.includes("poem");
