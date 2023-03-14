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
    foreground: string;
    /**
     * An alternative foreground color, with a fallback to the foreground color
     * if only 2 colors are specified in the frontmatter.
     *
     * Useful for foreground elements like hover states that need to be
     * distinguished from the main text.
     */
    foreground2: string;

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
    const foreground = all[1];
    const foreground2 = all.length > 2 ? all[2] : foreground;

    return { background, foreground, foreground2, all };
};
