import { signal } from "@strudel/core";

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
        Math.min(
            n === 0 ? Math.max(0, t - wait) : Math.max(0, t - wait) / n,
            1,
        ),
    );
