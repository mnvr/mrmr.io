import { isDefined } from "utils/array";
import { color, setAlpha } from "utils/colorsjs";
import { ensure, ensureString } from "utils/ensure";

/**
 * A set of colors, or as Picasso would say, a palette.
 *
 * The two important ones are the main background - foreground color pair
 * `background` and `text`. Rest of them are more like accents with specific and
 * sometimes arbitrary uses.
 *
 * Color pickers
 * -------------
 *
 * - https://oklch.com/
 *
 *
 * LCH Colors
 * ----------
 *
 * Some notes for specifying specifying LCH colors (taken from
 * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/lch). LCH colors
 * can represent the full range of colors that the human eye can see, though
 * they'll indeed be truncated when displaying on a monitor depending upon what
 * the monitor / display can support.
 *
 * - L (Lightness) is a number between 0 and 100, or a percentage between 0% and
 *   100% that specifies the CIE lightness where the number 0 corresponds to 0%
 *   (black) and the number 100 corresponds to 100% (white).
 *
 * - C (Chroma) is a number or a percentage where 0% is 0 and 100% is 150. It is
 *   a measure of the chroma (roughly representing the amount of color"). Its
 *   minimum useful value is 0, while its maximum is theoretically unbounded
 *   (but in practice does not exceed 230).
 *
 * - H (Hue) is a number or an angle representing the hue angle.
 *
 * The LCH axes describe the same color space as the LAB axes and has the same L
 * axis, but uses polar coordinates C (Chroma) and H (Hue) instead of the a/b
 * axes in LAB.
 *
 *
 * OKLCH Colors
 * ------------
 *
 * OKLCH is a tweak on LCH which fixes a bug around a sudden shift in the blue
 * hue region. In addition, the Chroma axes is specified in a nicer,
 * semi-normalized fashion. For more details about why OKLCH vs LCH, see
 * https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
 *
 * - L ((perceived) Lightness) between 0 - 1 (or 0% - 100%)
 *
 * - C (Chroma, roughly a measure of "amount of color"). Either a number or
 *   percentage, where 0 corresponds to 0% and 0.4 corresponds to 100%. Whilst
 *   theoretically unbounded, in practice it depends on a screen's color gamut
 *   (P3 colors will have bigger values than sRGB) and each hue has a different
 *   maximum chroma. For both P3 and sRGB the value will always be below 0.37.
 *
 * - H (Hue angle). red / 20, yellow / 90, green / 140, blue / 220, purple / 360
 *
 * - Alpha (0-1 or 0-100%) can be specified as oklch(L C H / a). e.g. a
 *   transparent yellow would be "oklch(80% 0.12 100 / 50%)"
 *
 *
 * Gamut correction
 * ----------------
 *
 * (This section taken from
 * https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
 *
 * LCH / OKLCH colors are device independent, and are not created just for
 * current monitors / displays. If the color being specified is "out of gamut"
 * (the colors supported by the display), browsers will render the closest
 * possible color. This process – finding the closest color in another gamut -
 * is called "gamut mapping" or "gamut correction".
 *
 * There are 2 ways to gamut map:
 *
 * - Convert the color to RGB (or P3) and clip values above 100% or below 0%.
 *   e.g. rgb(150% -20% 30%) -> rgb(100% 0 30%). This is fast (and what browsers
 *   use in practice currently), but it can result in a change in the color's
 *   hue.
 *
 * - Convert the color to OKLCH and reduce the chroma and lightness.
 *
 * To manually map, we can use a media query
 *
 *     .color {
 *         background: oklch(...);
 *     }
 *
 *     @media (color-gamut: p3) {
 *         .color {
 *             background: oklch(...);
 *         }
 *     }
 *
 */
export interface ColorPalette {
    /**
     * Each of these is a a string representation of the colors that CSS can
     * understand.
     */
    background: string;
    text: string;
    title: string;
    secondary: string;
    tertiary: string;
}

/**
 * Parse an array of colors into a {@link ColorPalette}.
 *
 * The first two values are the only required ones, and they're used as the
 * text background (`background`) and foreground (`text`) colors.
 *
 * Rest everything either
 * - falls back to these two if not explicitly specified,
 * - or is heuristically computed from these two base colors.
 *
 * A common interpretation of the colors in the various positions is described
 * in the documentation for {@link Theme} (background / text / title /
 * secondary / tertiary), but really is up to the markup in each page to decide
 * what to do with this list and use them in a way appropriate to its content.
 */
export const parseColorPalette = (
    colors: readonly (string | undefined)[] | undefined,
) => {
    if (!colors) return;

    const all = colors.filter(isDefined);
    if (all.length < 2) {
        throw new Error(
            "At least 2 colors are required to construct a palette",
        );
    }

    // A temporary alias
    const c = (cs?: string) => (cs ? color(cs) : undefined);

    const background = ensure(c(all[0]));
    const text = ensure(c(all[1]));
    const title = c(all[2]) ?? text;
    const secondary = c(all[3]) ?? title;
    const tertiary = c(all[4]) ?? setAlpha(secondary, 0.7);

    // Return their string representations.
    return {
        background: background.toString(),
        text: text.toString(),
        title: title.toString(),
        secondary: secondary.toString(),
        tertiary: tertiary.toString(),
    };
};

/**
 * Convenience method to verify that a color string indeed represents a color
 * that CSS can understand by doing a round-trip through the colorjs.io library.
 *
 * As another convenience, it accepts undefined values, and just returns them
 * back as it is: this makes it simpler to chain.
 */
export const parseColor = (c: unknown): string | undefined => {
    if (typeof c === "undefined") return c;
    return color(ensureString(c)).toString();
};
