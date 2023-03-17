import tinycolor from "tinycolor2";
import { isDefined } from "utils/array";
import { ensure } from "utils/ensure";

/**
 * A set of colors, or as Picasso would say, a palette.
 *
 * Usually we don't need to specify these all out explicitly - we start with 2
 * colors – background/foreground – and then use various heuristics to generate
 * the rest. However, colors are not science, so these heuristics don't always
 * work, so there are ways to specify more of these out explicitly.
 */
export interface ColorPalette {
    backgroundColor1: string;
    color1: string;
    color2: string;
    color3: string;
    color1Transparent: string;
}

/** A set of color palettes - one default, and an optional dark one */
export interface ColorPaletteSet {
    colors: ColorPalette;
    /** Optional dark mode overrides */
    darkColors?: ColorPalette;
}

/**
 * Parse a array of colors into a {@link ColorPalette}.
 *
 * The first two values are the only required one, and they're used as the
 * primary background (`backgroundColor1`) and foreground (`color1`) colors.
 *
 * Rest everything can be heuristically computed from these two base colors. But
 * you can specify more values in the array to explicitly provide a shade you
 * like.
 *
 * Which array position maps to which color is a bit of a mish-mash currently.
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

    const backgroundColor1 = tc(all[0]);
    const color1 = tc(all[1]);
    const color2 = tc(all[2], color1);
    const color3 = tc(all[3], color2);

    const color1Transparent = color1.clone().setAlpha(0.3);

    // Return their string representations.
    return {
        backgroundColor1: backgroundColor1.toString(),
        color1: color1.toString(),
        color2: color2.toString(),
        color3: color3.toString(),
        color1Transparent: color1Transparent.toString(),
    };
};

/**
 * Convenience method to construct a tinycolor instance.
 *
 * @param cs Color string, a string specifying a color
 * @param fallback A color to use if `cs` is `undefined`.
 *
 * It'll also warn by printing on the console if something seems amiss.
 */
const tc = (cs?: string, fallback?: tinycolor.Instance) => {
    if (!cs) return ensure(fallback);
    let color = tinycolor(cs);
    if (!color.isValid()) console.warn("Invalid color string", cs);
    return color;
};
