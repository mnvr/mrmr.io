import { ColorPalette, parseColorPalette } from "parsers/colors";
import { ensure } from "utils/ensure";

/**
 * A theme is a named set of color palettes.
 *
 * These can be specified by name in the MDX frontmatter by setting the "theme"
 * field. Or these can be directly imported into the tsx source. For more
 * details about importing and using these objects, see the documentation in
 * `PageColorStyle.tsx`.
 */
export interface Theme {
    /**
     * The name of the theme (this string can then be used to specify the theme
     * by setting the "theme" in the MDX frontmatter).
     */
    name: string;
    /**
     * The light set of colors.
     *
     * Whilst the interpretation of colors is up to the markup in each page, a
     * usual factoring is to have the following meaning to the list of colors:
     *
     * 1. background (--mrmr-background-color-1)
     * 2. text (--mrmr-color-1)
     * 3. title (--mrmr-color-2)
     * 4. secondary text (--mrmr-color-3)
     * 5. arbitrary uses (--mrmr-color-4)
     */
    colors: ColorPalette;
    /**
     * An optional dark variant of colors.
     *
     * If these are not specified, then the light colors will be used.
     */
    darkColors?: ColorPalette;
}

/**
 * The default set of colors.
 *
 * It has a pure white background, with neutral gray colors.
 */
export const defaultTheme: Theme = {
    name: "default",
    colors: ensure(
        parseColorPalette([
            "hsl(0, 0%, 100%)", // background
            "hsl(0, 0%,  24%)", // text
            "hsl(0, 0%,  15%)", // title
            "hsl(0, 0%,  47%)", // secondary text
        ]),
    ),
    darkColors: parseColorPalette([
        "hsl(0, 0%, 4%)",
        "hsl(0, 0%, 90%)",
        "hsl(0, 0%, 100%)",
        "hsl(0, 0%, 73%)",
    ]),
};

/**
 * The theme used by the front page.
 */
export const frontPageTheme: Theme = {
    name: "front-page",
    colors: ensure(
        parseColorPalette([
            "oklch(100.0% 0 0)", // background
            "oklch(41.84% 0 0)", // text
            "oklch(    0% 0 0)", // title
            "oklch(44.64% 0 0)", // secondary text
        ]),
    ),
    darkColors: parseColorPalette([
        "oklch(31.14% 0.021 285.75)",
        "oklch(90.00% 0.008 286.75)",
        "oklch(100.0% 0.008 286.75)",
        "oklch(78.61% 0.021 285.75)",
        "oklch(78.17% 0.021 260.75)", // section headers
    ]),
};

/**
 * A neutralish color palette for text posts.
 *
 * The initial departure from the "default" theme is that the background is not
 * pure white / black. The rest of the shades of gray follow from the choice of
 * the background, with text legibility being the primary concern.
 */
export const paperTheme: Theme = {
    name: "paper",
    colors: ensure(
        parseColorPalette([
            "oklch(99.24% 0 0)", // background
            "oklch(41.28% 0 0)", // text
            "oklch(24.78% 0 0)", // title
            "oklch(59.65% 0 0)", // secondary text
        ]),
    ),
    darkColors: parseColorPalette([
        "oklch(31.14% 0.021 285.75)",
        "oklch(90.00% 0.008 286.75)",
        "oklch(100.0% 0.008 286.75)",
        "oklch(78.61% 0.021 285.75)",
    ]),
};

/**
 * A variation of "paper" with a darker background in dark mode.
 *
 * The light mode is unchanged
 */
export const paperDarkTheme: Theme = {
    name: "paper-dark",
    colors: ensure(
        parseColorPalette([
            "oklch(99.24% 0 0)", // background
            "oklch(41.28% 0 0)", // text
            "oklch(24.78% 0 0)", // title
            "oklch(59.65% 0 0)", // secondary text
        ]),
    ),
    darkColors: parseColorPalette([
        "oklch(18.67% 0.02 251)",
        "oklch(86.89% 0 0)",
        "oklch(95.42% 0 0)",
        "oklch(75.94% 0 0)",
    ]),
};

/** All themes, indexed by their name */
export const allThemes = [
    defaultTheme,
    frontPageTheme,
    paperTheme,
    paperDarkTheme,
].reduce(
    (map, theme) => ((map[theme.name] = theme), map),
    {} as Record<string, Theme>,
);
