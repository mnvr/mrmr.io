import { removeUndefineds } from "./array";

/** Throw if the given value is null undefined */
export function ensure<T>(x: T | null | undefined): T {
    if (x === undefined || x == null) {
        throw new Error(`Required value is missing`);
    }
    return x;
}

/**
 * Parse a colors array specified in the MDX frontmatter of a file that is
 * meant to be rendered with the default template.
 */
export const parseDefaultTemplateColors = (
    colors: readonly (string | undefined)[] | undefined
) => {
    const validColors = removeUndefineds(ensure(colors));
    if (validColors.length < 2) {
        throw new Error(
            "At least 2 colors are required by the default template"
        );
    }

    const backgroundColor = validColors[0];
    const color = validColors[1];

    return { backgroundColor, color };
};
