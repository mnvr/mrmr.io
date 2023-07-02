import Color from "colorjs.io";
import { isDefined } from "utils/array";
import { ensure } from "utils/ensure";

/**
 * A set of colors, or as Picasso would say, a palette.
 *
 * The two important ones are the main background - foreground color pair
 * `backgroundColor1` and `color1`. Rest of them are more like accents with
 * rather specific and arbitrary uses.
 */
export interface ColorPalette {
    backgroundColor1: string;
    color1: string;
    color2: string;
    color3: string;
    color4: string;

    backgroundColor1Transparent: string;
    color1Transparent: string;
}

/** A set of color palettes - one default, and an optional dark one */
export interface ColorPaletteSet {
    colors: ColorPalette;
    /**
     * Optional dark mode overrides
     *
     * If these are not present, we'll use the light mode `colors` always.
     */
    darkColors?: ColorPalette;
}

/**
 * Parse a array of colors into a {@link ColorPalette}.
 *
 * The first two values are the only required ones, and they're used as the
 * primary background (`backgroundColor1`) and foreground (`color1`) colors.
 *
 * Rest everything either
 * - falls back to these two if not explicitly specified,
 * - or is heuristically computed from these two base colors.
 *
 * Which array position maps to which color is a bit of a (as yet) undocumented
 * mish-mash.
 */
export const parseColorPalette = (
    colors: readonly (string | undefined)[] | undefined
) => {
    if (!colors) return;

    const all = colors.filter(isDefined);
    if (all.length < 2) {
        throw new Error(
            "At least 2 colors are required to construct a palette"
        );
    }

    const backgroundColor1 = ensure(c(all[0]));
    const color1 = ensure(c(all[1]));
    const color2 = c(all[2]) ?? color1;
    const color3 = c(all[3]) ?? color2;
    const color4 = c(all[4]) ?? setAlpha(color3, 0.7);

    const backgroundColor1Transparent = setAlpha(backgroundColor1, 0.3);
    const color1Transparent = setAlpha(color1, 0.3);

    // Return their string representations.
    return {
        backgroundColor1: backgroundColor1.toString(),
        color1: color1.toString(),
        color2: color2.toString(),
        color3: color3.toString(),
        color4: color4.toString(),
        backgroundColor1Transparent: backgroundColor1Transparent.toString(),
        color1Transparent: color1Transparent.toString(),
    };
};

/**
 * Convenience method to construct a Color ("colorjs.io") instance.
 *
 * @param cs Color string, a string specifying a color.
 *
 * If the color string is invalid, it'll warn by printing on the console and
 * rethrow the exception.
 *
 * If cs is not provided, then this function returns `undefined`.
 */
const c = (cs?: string) => {
    if (!cs) return undefined;
    try {
        return new Color(cs);
    } catch (e) {
        console.warn(`Failed to parse color string "${cs}"`, e);
        throw e;
    }
};

/**
 * Convenience method to return a new Color instance with its alpha component
 * set to the provided value.
 *
 * @param c A Color ("colorjs.io") instance
 * @param alpha The alpha value to use
 */
const setAlpha = (c: Color, alpha: number) => {
    const c2 = c.clone();
    c2.alpha = alpha;
    return c2;
};
