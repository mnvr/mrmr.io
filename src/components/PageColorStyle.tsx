import { type ColorPalette } from "parsers/colors";
import { createGlobalStyle } from "styled-components";

/**
 * A set of color palettes - one default, and an optional dark one.
 *
 * This is a subset of the fields of a {@link Theme} or {@link Page} that we
 * care about.
 */
export interface ColorPaletteSet {
    /**
     * The colors that form the palette.
     */
    colors: ColorPalette;
    /**
     * Optional dark mode overrides.
     *
     * If these are not present, we'll use the light mode `colors` always.
     */
    darkColors?: ColorPalette;
    /**
     * Optional override for the highlight color.
     *
     * By default, the highlight color is taken as the fifth color in the array
     * of colors that define a palette. However, sometimes it is convenient for
     * a page to keep the rest of the colors the same (say, use a predefined
     * color palette from a theme) but just add a bit of color (pun intended) by
     * using a custom highlight color.
     *
     * Thus we allow customizing the highlight color in isolation.
     */
    highlightColor?: string;
    /**
     * Optional override for the dark mode highlight color.
     *
     * If this is not specified, but a {@link highlightColor} is specified, then
     * {@link highlightColor} will also be used in dark mode.
     */
    highlightColorDark?: string;
}

export const PageColorStyle = createGlobalStyle<ColorPaletteSet>`
    body {
        --mrmr-background: ${(props) => props.colors.background};
        --mrmr-text: ${(props) => props.colors.text};
        --mrmr-title: ${(props) => props.colors.title};
        --mrmr-secondary: ${(props) => props.colors.secondary};
        --mrmr-tertiary: ${(props) => props.colors.tertiary};
        --mrmr-highlight: ${(props) => props.highlightColor ?? props.colors.highlight};

        @media (prefers-color-scheme: dark) {
            --mrmr-background: ${(props) =>
                props.darkColors?.background ?? props.colors.background};
            --mrmr-text: ${(props) =>
                props.darkColors?.text ?? props.colors.text};
            --mrmr-title: ${(props) =>
                props.darkColors?.title ?? props.colors.title};
            --mrmr-secondary: ${(props) =>
                props.darkColors?.secondary ?? props.colors.secondary};
            --mrmr-tertiary: ${(props) =>
                props.darkColors?.tertiary ?? props.colors.tertiary};
            --mrmr-highlight: ${(props) =>
                props.highlightColorDark ??
                props.highlightColor ??
                props.darkColors?.highlight ??
                props.colors.highlight};
        }
    }
`;

/**
 * A type that might have the shape required by {@link ColorPaletteSet}, but
 * whose `colors` property might not be defined.
 *
 * In practice, this refers to a {@link Page}. Thus, this type allows us to pass
 * either a {@link Page} or a {@link Theme} to {@link paletteSetOrFallback}
 * function.
 */
type MaybeColorPaletteSet = Partial<ColorPaletteSet>;

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
    // It is not necessary that both the overrides and the colors come from the
    // same set (e.g. the highlight-color might be specified on the page, but
    // the rest of the colors might come from the theme).
    //
    // So first find the overrides, then merge them into the colors in a second
    // pass.
    let highlightColor: string | undefined;
    let highlightColorDark: string | undefined;

    for (const set of paletteSets) {
        if (!set) continue;
        if (set.highlightColor) {
            highlightColor = set.highlightColor;
            highlightColorDark = set.highlightColorDark;
            break;
        }
    }

    for (const set of paletteSets) {
        if (!set) continue;
        const { colors, darkColors } = set;
        if (colors)
            return { colors, darkColors, highlightColor, highlightColorDark };
    }

    throw new Error("None of the fallbacks defined the color palette");
};
