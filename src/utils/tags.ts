import { type Page } from "templates/page";

/* Convenience matchers for some tags */

/**
 * Return true if the content is in Hindi.
 *
 * This looks to see if the page has the "hindi" tag.
 */
export const isHindiContent = ({ tags }: Page) => tags.includes("hindi");

/**
 * Return true if this is a poem.
 *
 * This looks to see if the page has the "poem" tag.
 */
export const isPoem = ({ tags }: Page) => tags.includes("poem");
