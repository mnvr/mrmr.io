import { Pattern } from "@strudel.cycles/core";
import HydraRenderer, { type HydraSynth } from "hydra-synth";
import type p5Types from "p5";

/**
 * A function that renders a Hydra visualization
 */
export type HydraVis = ({ h }: HydraVisProps) => void;

/** Props passed to {@link HydraVis} */
export interface HydraVisProps {
    /** The HydraRenderer instance whose canvas we're rendering to */
    hr: HydraRenderer;
    /** A convenience alias for `hr.synth` */
    h: HydraSynth;
}

/**
 * A pattern describing a song written using TidalCycles (specifically, it's
 * JavaScript port, Strudel).
 */
export type StrudelSong = () => Pattern;

/**
 * A function that renders a P5 visualization
 *
 * A sketch can export either the vanilla 1-argument form or the extended 2-
 * argument form that also takes in an environment.
 */
export type P5Draw =
    | ((p5: p5Types) => void)
    | ((p5: p5Types, env: P5DrawEnv) => void);

/**
 * Environment in which the P5 visualization is being rendered
 *
 * These are bits and pieces of state that we attach and provide to the draw
 * method of P5 sketches.
 */
export interface P5DrawEnv {
    /**
     * If this is an audio enabled sketch, then this getter will return the
     * (highly accurate) timestamp counting seconds since audio started.
     *
     * Specifically, this'll be the `currentTime` of the `AudioContext` in which
     * audio is being played.
     *
     * This function should not be called in a sketch that does not have an
     * associated audio playback. Doing so will throw an exception.
     */
    audioTime: () => number;
    /**
     * Return the time (in seconds) since the page was loaded.
     *
     * This is useful as a an alternative for {@link audioTime} in sketches
     * which were designed with some (external) audio in mind. Since the audio
     * is not being played currently, there won't be an audioContext, nor an
     * audioTime. So to instead drive the animation forward, we can use this
     * replacement timestamp that counts the number of seconds since page load.
     */
    pageTime: () => number;
}
