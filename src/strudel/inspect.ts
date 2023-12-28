import { Pattern, register } from "@strudel.cycles/core";
import { isDevelopment } from "utils/debug";

/** Inspect the first 7 cycles of the pattern `pat` */
export const inspect = register("inspect", function (pat) {
    // Couldn't get registering a function with an integer argument to work.
    // let _n = ensure(typeof n == "number" ? n : undefined);
    pat.drawLine();
    return debugPrint(pat, 7);
});

/**
 * Print out the first 10 bars of the pattern to the console.
 *
 * Useful for debugging; it only prints when running under `yarn dev`.
 *
 * @param n Number of bars to print (default 10)
 * @returns The original pattern (useful for chaining)
 */
const debugPrint = (pattern: Pattern, n = 10, preamble?: string) => {
    if (!isDevelopment()) return pattern;

    const events = pattern.sortHapsByPart().queryArc(0, n);
    if (preamble) console.info(preamble);
    events.forEach((e) => console.info(e.show()));
    return pattern;
};
