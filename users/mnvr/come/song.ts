import { controls, rand, saw, stack } from "@strudel.cycles/core";
import { m } from "strudel/mini";
import type { TidalSong } from "types";

export const song: TidalSong = () => {
    const { note } = controls;

    const p1 = note(m`c <a ~ ~ [f e]>`).gain(0.5);
    const p2 = note(m`c <a ~ ~ [f e]>`)
        .add(12)
        .s("tri")
        .gain(0.3);
    const p3 = stack(p1, p2);

    const c1 = note(m`[c5*5 d5*7] <c6 g#6 g6 c7>`)
        .cutoff(m`1500 3000 400 1000 9000`)
        .sustain(m`1.3 0.7 1.6`)
        .delay([0.4, 0.9, 0])
        .gain(0.7);

    const d1 = note(m`c2 d2@2 ~`)
        .s("sawtooth")
        .cutoff(saw.range(700, 1200).slow(40))
        .resonance(rand.range(13, 26))
        .gain(0.62);

    const p4 = stack(c1, d1);
    rand.range(0, 30);

    return p4;
};
