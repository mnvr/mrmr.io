/* Convenience matchers for some attributes */

interface PageLike {
    slug: string;
    feed?: string;
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

/**
 * Return true if this is a note.
 *
 * A note is something that either exists under "/notes" or has the "playground"
 * attribute.
 */
export const isNote = ({ feed }: PageLike) => feed === "/notes";

/**
 * Return true if this page should be kept at the top of groupings in listings.
 *
 * This looks to see if the page has the "bumped" attribute.
 */
export const isBumped = ({ attributes }: PageLike) =>
    attributes.includes("bumped");
