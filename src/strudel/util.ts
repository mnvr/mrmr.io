import {
    Pattern,
    signal,
    timeCat,
    type Patternable,
} from "@strudel.cycles/core";

/**
 * A fade-in envelope
 *
 * @param n The number of cycles to take for the fade in.
 */
export const fadeIn = (n: number) => signal((t) => Math.min(t / n, 1));

/**
 * Apply a gain envelope to the pattern
 *
 * It takes the same arguments as {@link timeCat}
 *
 * @unused
 */
export const env = (p: Pattern, xs: [number, Patternable][]) =>
    p.gain(timeCat(...(xs as any)).slow(xs.reduce((s, t) => s + t[0], 0)));
