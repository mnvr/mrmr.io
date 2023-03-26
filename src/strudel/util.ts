import {
    Pattern,
    signal,
    timeCat,
    type Patternable,
} from "@strudel.cycles/core";

/**
 * A fade-in envelope
 *
 * @param n The number of cycles to take for the fade in. Specify 0 to omit the
 * fade in, just offset the onset using `wait`.
 * @param wait The number of cycles to wait before starting the fade in.
 * Optional, default 0.
 */
export const fadeIn = (n: number, wait: number = 0) =>
    signal((t) =>
        Math.min(n === 0 ? Math.max(0, t - wait) : Math.max(0, t - wait) / n, 1)
    );

/**
 * Apply a gain envelope to the pattern
 *
 * It takes the same arguments as {@link timeCat}
 *
 * @unused
 */
export const env = (p: Pattern, xs: [number, Patternable][]) =>
    p.gain(timeCat(...(xs as any)).slow(xs.reduce((s, t) => s + t[0], 0)));
