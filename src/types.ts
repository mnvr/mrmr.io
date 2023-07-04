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
 * A pattern describing a song written using Tidal (specifically, it's
 * JavaScript port, Strudel).
 */
export type TidalSong = () => Pattern;

/**
 * A function that renders a P5 visualization
 */
export type P5Draw = (p5: p5Types) => void;
