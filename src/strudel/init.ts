import { controls, Pattern, sequence } from "@strudel.cycles/core";
import { initAudioOnFirstClick } from "@strudel.cycles/webaudio";

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
 * Control parameters act as FX chains, modifying patterns to create new ones
 * that incorporate the effects of the control parameter. The control parameter
 * itself can be parameterized by a pattern to change its value.
 *
 * ### Mini
 *
 * The mini notation is syntax sugar to simplify writing patterns.
 *
 * ### WebAudio
 *
 * A pattern is something you can query to ask what all events happen over a
 * cycle (By convention, 1 cycle is 1 second). Events can be arbitrary things,
 * but the ones we're dealing with are things that can be rendered as audio by
 * the WebAudio renderer.
 *
 */
export const test = () => {
    initAudioOnFirstClick();

    const pattern = sequence("a", ["b", "f5"]);
    console.log("pattern", pattern);
    pattern.drawLine();
    const events = pattern.queryArc(0, 2);
    events.forEach((e) => console.log(e.show()));

    // @ts-ignore
    debugPrint(controls.note(pattern));

    console.log(controls);

    const { note } = controls;
    debugPrint(note("a"));

    // new Pattern().
    debugPrint(note("f").cutoff(sequence(500, 900)), "prefix");
    debugPrint(sequence(1).note("f").cutoff(sequence(500, 900)), "inline");
};

const debugPrint = (pattern: Pattern, preamble?: string) => {
    const events = pattern.queryArc(0, 1);
    if (preamble) console.log(preamble);
    events.forEach((e) => console.log(e.show()));
};
