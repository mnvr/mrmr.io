import { type ColorPalette } from "parsers/colors";
import { createGlobalStyle } from "styled-components";

/**
 * A set of color palettes - one default, and an optional dark one.
 *
 * This is a subset of the fields of a {@link Theme} or {@link Page} that we
 * care about.
 */
export interface ColorPaletteSet {
    colors: ColorPalette;
    /**
     * Optional dark mode overrides
     *
     * If these are not present, we'll use the light mode `colors` always.
     */
    darkColors?: ColorPalette;
}

export const PageColorStyle = createGlobalStyle<ColorPaletteSet>`
    body {
        --mrmr-background: ${(props) => props.colors.background};
        --mrmr-text: ${(props) => props.colors.text};
        --mrmr-title: ${(props) => props.colors.title};
        --mrmr-secondary: ${(props) => props.colors.secondary};
        --mrmr-tertiary: ${(props) => props.colors.tertiary};

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
interface MaybeColorPaletteSet {
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
