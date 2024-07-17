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
 * Return true if this is a note.
 *
 * A note is something that appears in the "/notes" feed.
 */
export const isNote = ({ feed }: PageLike) => feed === "/notes";
