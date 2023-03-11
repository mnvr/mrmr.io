import { sequence } from "@strudel.cycles/core";

/**
 * ## Strudel
 *
 * Tidal for JavaScript.
 *
 * ### Installation
 *
 * Strudel is split into a number of small packages. For our purposes, we need
 * the following:
 * - `@strudel.cycles/core` - as it says on the tin
 * - TODO `@strudel.cycles/mini` - to allow us to use the mini notation
 * - TODO `@strudel.cycles/webaudio` - to allow us to emit sounds using
 *   [WebAudio](https://www.w3.org/TR/webaudio/)
 *
 * ### Core
 *
 * The heart of Tidal is the {@link Pattern} class. The core contains various
 * primitive pattern (notes, silence etc), and ways to combine them (concatenate
 * them, stack them, add them etc).
 *
 * ### Mini
 *
 * The mini notation is syntax sugar to simplify writing patterns.
 *
 * ### WebAudio
 *
 * A pattern is something you can query to ask what all events happen over a
 * cycle (By convention, 1 cycle is 1 second). Events are arbitrary things, but
 * particularly are things that can be rendered as audio using WebAudio.
 *
 */
export const test = () => {
    const pattern = sequence("a", ["b", "c"]);
    console.log("pattern", pattern);
};
