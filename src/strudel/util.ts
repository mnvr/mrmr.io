import { Pattern, timeCat, type Patternable } from "@strudel.cycles/core";

/**
 * Apply a gain envelope to the pattern
 *
 * It takes the same arguments as {@link timeCat}
 */
export const env = (p: Pattern, xs: [number, Patternable][]) =>
    p.gain(timeCat(...(xs as any)).slow(xs.reduce((s, t) => s + t[0], 0)));
