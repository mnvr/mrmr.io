import Color from "colorjs.io";

/**
 * Convenience method to construct a Color ("colorjs.io") instance.
 *
 * @param cs Color string, a string specifying a color.
 *
 * If the color string is invalid, it'll warn by printing on the console and
 * rethrow the exception.
 */
export const color = (cs: string) => {
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
 * Output the color as a string that P5 can understand.
 *
 * colorjs knows how to output colors as RGB(A) too. However, the default format
 * for toString uses the CSS 4 syntax ("rgb(R G B / A)") that P5 cannot yet
 * understand. So instead, we output as the hex format which P5 happily consumes
 * (it works fine even with the fourth alpha component).
 */
export const p5c = (c: Color) => c.toString({ format: "hex" });
