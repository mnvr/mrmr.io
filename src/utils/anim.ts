/**
 * Convert an positive number to a linear oscillation between 0-1.
 *
 * This is intended to only work with (scaled) p5.millis values.
 */
export const linear = (t: number) => {
    t = t % 2;
    return t > 1 ? 2 - t : t;
};
