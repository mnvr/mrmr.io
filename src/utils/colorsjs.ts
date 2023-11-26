import Color from "colorjs.io";

export type Colorish = string | number | Color;

/**
 * Convenience method to construct a Color ("colorjs.io") instance.
 *
 * @param cs Color string (a string specifying a color), or a number indicating
 * the grayscale lightness (see {@link grayscale}). Alternatively, a color value
 * can also be passed here, which'll be returned as it is; this allows using the
 * same method without checking for the datatype of the color we have.
 *
 * If the color string is invalid, it'll warn by printing on the console and
 * rethrow the exception.
 */
export const color = (cs: Colorish) => {
    if (typeof cs === "number") return grayscale(cs);
    if (typeof cs !== "string") return cs;
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
export const setAlpha = (c: Color, alpha: number) => {
    const c2 = c.clone();
    c2.alpha = alpha;
    return c2;
};

/**
 * Reduce the lightness of the given color by the provided value.
 *
 * @param c A Color ("colorjs.io") instance
 * @param amount The amount (between 0-1) by which to reduce the lightness.
 */
export const lighten = (c: Color, amount: number) => {
    const c2 = c.clone();
    // The lighten / darken methods in colorjs are currently undocumented
    // https://github.com/LeaVerou/color.js/issues/269
    c2.lighten(amount);
    return c2;
};

/**
 * Output the color as a string that P5 can understand.
 *
 * First, we need to convert the colors to a color space that P5 can understand.
 * We have two options here - (s)RGB and HSL. We go with SRGB.
 *
 * colorjs knows how to output colors as RGB(A) too. However, the default format
 * for toString uses the CSS 4 syntax ("rgb(R G B / A)") that P5 cannot yet
 * understand. So instead, we output as the hex format which P5 happily consumes
 * (it works fine even with the fourth alpha component).
 */
export const p5c = (c: Color) => c.to("srgb").toString({ format: "hex" });
/**
 * Return the hex representation of the given color.
 *
 * This is an alias for {@link p5c}.
 */
export const hex = p5c;

/**
 * Create a grayscale color from a value 0-255
 *
 * This is similar to how P5 allows specifying colors using a single number
 * 0-255 that denotes the grayscale component of the RGB color. This function
 * allows us to create colorjs.io {@link Color} objects in the same manner.
 */
export const grayscale = (l: number) => {
    const n = l / 255;
    return new Color("srgb", [n, n, n]);
};
