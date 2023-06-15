import tinycolor from "tinycolor2";

/**
 * Convert a CSS color string into an `[r, g, b]` array that Hydra expects.
 *
 * The input color string should be able to accept all forms of CSS-like colors
 * that we can throw it at. For the full list of ways in which the color string
 * can be specified, see the documentation of the
 * [library](https://github.com/bgrins/TinyColor) that we use for parsing these
 * strings.
 */
export const rgb = (cs: string) => {
    let color = tinycolor(cs);
    if (!color.isValid()) console.warn("Invalid color", color);
    // These are 0-255
    const { r, g, b } = color.toRgb();
    // Hydra wants 0-1
    return [r / 255.0, g / 255.0, b / 255.0];
};
