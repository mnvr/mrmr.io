import { removeUndefineds } from "utils/array";
import { ensure } from "utils/ensure";

/** A structure that wraps the colors parsed from the frontmatter of pages */
export interface PageColors {
    /**
     * The first color specified in the frontmatter.
     *
     * Meant for use as the background of the page.
     */
    background: string;
    /**
     * The second color specified in the frontmatter.
     *
     * Meant for use as the foreground of the page.
     */
    color1: string;
    /**
     * An alternative foreground color, with a fallback to the foreground color
     * if only 2 colors are specified in the frontmatter.
     */
    color2: string;
    /**
     * An alternative foreground color, with a fallback to the previous
     * foreground color(s) if it is not specified.
     *
     * Useful for foreground elements like hover states that need higher
     * contrast to be distinguished from the main content.
     */
    color3: string;

    /** The underlying colors (without any implicit fallbacks) */
    all: string[];
}

/**
 * Parse a colors array specified in the MDX frontmatter of a file that is
 * meant to be rendered with the default template.
 */
export const parsePageColors = (
    colors: readonly (string | undefined)[] | undefined
) => {
    const all = removeUndefineds(ensure(colors));
    if (all.length < 2) {
        throw new Error(
            "At least 2 colors are required by the default template"
        );
    }

    const background = all[0];
    const color1 = all[1];
    const color2 = all.length > 2 ? all[2] : color1;
    const color3 = all.length > 3 ? all[3] : color2;

    return { background, color1, color2, color3, all };
};
