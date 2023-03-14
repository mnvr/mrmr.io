import { Pattern } from "@strudel.cycles/core";
import HydraRenderer, { type HydraSynth } from "hydra-synth";

export type Context = {
    readonly id: string;
};

export interface HydraVisProps {
    /** The HydraRenderer instance whose canvas we're rendering to */
    hr: HydraRenderer;
    /** A convenience alias for `hr.synth` */
    h: HydraSynth;
}

/** A function that renders a Hydra visualization */
export type HydraVis = ({ h }: HydraVisProps) => void;

/**
 * A pattern describing a song written using Tidal (specifically, it's
 * JavaScript port, Strudel).
 */
export type TidalSong = () => Pattern;
