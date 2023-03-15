import { Pattern } from "@strudel.cycles/core";
import { isDevelopment } from "utils/debug";
import { m } from "./mini";

/**
 * **Strudel**
 *
 * Tidal for JavaScript.
 *
 * ## Installation
 *
 * Strudel is split into a number of small packages. For our purposes, we need
 * the following:
 *
 * - `@strudel.cycles/core` - as it says on the tin
 * - `@strudel.cycles/webaudio` - to allow us to emit sounds using
 *   [WebAudio](https://www.w3.org/TR/webaudio/)
 * - `@strudel.cycles/mini` - to allow us to use the mini notation
 *
 * ### Core
 *
 * The heart of Tidal is the {@link Pattern} class. The core contains various
 * primitive pattern (notes, silence etc), and ways to combine them (concatenate
 * them, stack them, add them etc).
 *
 * Control parameters act as FX chains, modifying patterns to create new ones
 * that incorporate the effects of the control parameter. The control parameter
 * itself can be parameterized by a pattern to change its value.
 *
 * ### WebAudio
 *
 * A pattern is something you can query to ask what all events happen over a
 * cycle (By convention, 1 cycle is 1 second). Events can be arbitrary things,
 * but the ones we're dealing with are things that can be rendered as audio by
 * the WebAudio renderer.
 *
 * To connect core to WebAudio, we need to import `getAudioContext`,
 * `webaudioOutput` from "@strudel.cycles/webaudio", and then pass those to the
 * core's `repl` object. Thereafter, communication between core and webaudio
 * happens implicitly via control parameters attached to events.
 *
 * The webaudio package also exports `initAudioOnFirstClick`, which we need to
 * call once. And a `samples` function, which can be used to load samples.
 *
 * ### Mini
 *
 * The mini notation is syntax sugar to simplify writing patterns.
 *
 * ## Extensions
 *
 * ### m``
 *
 * @see {@link m}.
 */
export const documentationPlaceholder = () => {};

/**
 * Print out the first 10 bars of the pattern to the console.
 *
 * Useful for debugging; it only prints when running under `yarn dev`.
 *
 * @param n Number of bars to print (default 10)
 * @returns The original pattern (useful for chaining)
 */
export const debugPrint = (pattern: Pattern, n = 10, preamble?: string) => {
    if (!isDevelopment()) return;

    const events = pattern.queryArc(0, n);
    if (preamble) console.log(preamble);
    events.forEach((e) => console.log(e.show()));
};
