import {
    ColorPalette,
    parseColorPalette,
    type ColorPaletteSet,
} from "parsers/colors";
import { createGlobalStyle } from "styled-components";
import { ensure } from "utils/ensure";

export const PageColorStyle = createGlobalStyle<ColorPaletteSet>`
    body {
        --mrmr-background-color-1: ${(props) => props.colors.backgroundColor1};
        --mrmr-color-1: ${(props) => props.colors.color1};
        --mrmr-color-2: ${(props) => props.colors.color2};
        --mrmr-color-3: ${(props) => props.colors.color3};
        --mrmr-color-4: ${(props) => props.colors.color4};
        --mrmr-background-color-1-transparent: ${(props) =>
            props.colors.backgroundColor1Transparent};
        --mrmr-color-1-transparent: ${(props) =>
            props.colors.color1Transparent};

        @media (prefers-color-scheme: dark) {
            --mrmr-background-color-1: ${(props) =>
                props.darkColors?.backgroundColor1 ??
                props.colors.backgroundColor1};
            --mrmr-color-1: ${(props) =>
                props.darkColors?.color1 ?? props.colors.color1};
            --mrmr-color-2: ${(props) =>
                props.darkColors?.color2 ?? props.colors.color2};
            --mrmr-color-3: ${(props) =>
                props.darkColors?.color3 ?? props.colors.color3};
            --mrmr-color-4: ${(props) =>
                props.darkColors?.color4 ?? props.colors.color4};
            --mrmr-background-color-1-transparent: ${(props) =>
                props.darkColors?.backgroundColor1Transparent ??
                props.colors.backgroundColor1Transparent};
            --mrmr-color-1-transparent: ${(props) =>
                props.darkColors?.color1Transparent ??
                props.colors.color1Transparent};
        }
    }
`;

/**
 * A type that might have the shape required by {@link ColorPaletteSet}, but
 * whose `colors` property might not be defined.
 */
export interface MaybeColorPaletteSet {
    colors?: ColorPalette;
    darkColors?: ColorPalette;
}

/**
 * Convenience method to construct a color palette set from the given palettes.
 *
 * Go through the arguments, each of which is an {@link MaybeColorPaletteSet}
 * until we find a palette set which has the defined its `colors`.
 *
 * If nothing is found, throw an error.
 */
export const paletteSetOrFallback = (
    ...paletteSets: readonly (MaybeColorPaletteSet | undefined)[]
) => {
    for (const set of paletteSets) {
        if (!set) continue;
        const { colors, darkColors } = set;
        if (colors) return { colors, darkColors };
    }
    throw new Error("None of the fallbacks defined the color palette");
};

/**
 * Return one of the {@link MaybeColorPaletteSet} defined below that corresponds
 * to the "theme" string mentioned in page's frontmatter.
 *
 * If no theme is specified, return {@link defaultColorPalettes}.
 */
export const colorPalettesForTheme = (
    theme: string | undefined,
): MaybeColorPaletteSet => {
    switch (theme) {
        case "text":
            return textColorPalettes;
        default:
            return defaultColorPalettes;
    }
};

/**
 * A default set of color palettes.
 *
 * Be calm, and readable. Supports both light/dark.
 */
const defaultColorPalettes = {
    colors: ensure(
        parseColorPalette([
            "hsl(0, 0%, 100%)",
            "hsl(0, 0%, 15%)",
            "hsl(0, 0%, 40%)",
            "hsl(0, 0%, 13%)",
            "hsl(0, 0%, 60%)",
        ]),
    ),
    darkColors: parseColorPalette([
        "hsl(0, 0%, 4%)",
        "hsl(0, 0%, 90%)",
        "hsl(0, 0%, 50%)",
        "hsl(0, 0%, 80%)",
    ]),
};

/**
 * A variant of basicColorPalettes for text heavy pages.
 *
 * To use, set "theme: text" in the YAML frontmatter.
 */
export const textColorPalettes = {
    colors: ensure(
        parseColorPalette([
            "hsl(0, 0%, 100%)",
            "hsl(0, 0%, 15%)",
            "hsl(0, 0%, 23%)",
            "hsl(0, 0%, 30%)",
            "hsl(0, 0%, 47%)",
        ]),
    ),
    darkColors: parseColorPalette([
        "hsl(0, 0%, 4%)",
        "hsl(0, 0%, 94%)",
        "hsl(0, 0%, 83%)",
        "hsl(0, 0%, 73%)",
        "hsl(0, 0%, 60%)",
    ]),
};
