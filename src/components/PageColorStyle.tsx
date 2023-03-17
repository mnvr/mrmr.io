import {
    ColorPalette,
    parseColorPalette,
    type ColorPaletteSet,
} from "parsers/colors";
import { createGlobalStyle } from "styled-components";
import { isDefined } from "utils/array";
import { ensure } from "utils/ensure";

export const PageColorStyle = createGlobalStyle<ColorPaletteSet>`
    body {
        --mrmr-background-color-1: ${(props) => props.colors.backgroundColor1};
        --mrmr-color-1: ${(props) => props.colors.color1};
        --mrmr-color-2: ${(props) => props.colors.color2};
        --mrmr-color-3: ${(props) => props.colors.color3};
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
            --mrmr-color-1-transparent: ${(props) =>
                props.darkColors?.color1Transparent ??
                props.colors.color1Transparent};
        }
    }
`;

/**
 * Convenience method to construct a color palette set from the given palettes.
 *
 * If the default/light palette is specified, then we return a palette set using
 * that light and the (optional) dark one. Otherwise we use the fallback palette
 * set.
 *
 * The light and dark palettes are specified in array form. The first entry is
 * taken as the light one.
 *
 * If even the fallback is not present, then we use {@link defaultColorPalettes}.
 */
export const paletteSetOrFallback = (
    palettes: readonly (ColorPalette | undefined)[],
    fallback?: ColorPaletteSet
) => {
    const [colors, darkColors] = palettes?.filter(isDefined);
    return colors ? { colors, darkColors } : fallback ?? defaultColorPalettes;
};

/**
 * A default set of color palettes.
 *
 * Be calm, and readable. Supports both light/dark.
 */
export const defaultColorPalettes = {
    colors: ensure(
        parseColorPalette([
            "hsl(0, 0%, 100%)",
            "hsl(0, 0%, 15%)",
            "hsl(0, 0%, 15%)",
            "hsl(0, 0%, 13%)",
        ])
    ),
    darkColors: parseColorPalette([
        "hsl(198, 13%, 8%)",
        "hsl(0, 0%, 87%)",
        "hsl(0, 0%, 87%)",
        "hsl(0, 0%, 87%)",
    ]),
};
