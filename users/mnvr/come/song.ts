import { controls, stack } from "@strudel.cycles/core";
import { m } from "strudel/mini";
import type { TidalSong } from "types";

export const song: TidalSong = () => {
    const { note } = controls;

    const p1 = note(m`c <a ~ ~ [f e]>`);
    const p2 = note(m`c <a ~ ~ [f e]>`)
        .add(12)
        .s("sawtooth")
        .gain(0.1);
    return stack(p1, p2);
};
