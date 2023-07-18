import { controls, perlin, stack } from "@strudel.cycles/core";
import { m } from "strudel/mini";
import type { TidalSong } from "types";

export const song: TidalSong = () => {
    const { note } = controls;

    const p1 = note(m`a4!3`)
        .attack(m`[0.005 0.005 0.005]`)
        .decay(0.02)
        .gain(m`[1 0.5 0.5]`)
        .s("sine")
        .sustain(0);

    const p2 = note(m`<[a3 c4 a3 f#3 f3 f#3] [c4 e4 e4 e4 c4 a3]>/2`)
        .attack(m`[0.01 0.01 0.01]`)
        .decay(0.2)
        .gain(m`[0.6 0.4 0.6]`)
        .s("sawtooth")
        .cutoff(perlin.range(500, 700))
        .sustain(0.1)
        .release(0.5);

    const p3 = note(m`[[a3 c4 a3 f#3 f3 f#3] [c4 e4 e4 e4 c4 a3]]/4`)
        .attack(m`[0.01 0.01 0.01]`)
        .decay(0.2)
        .gain(m`[0.6 0.4 0.6]`)
        .s("triangle")
        .sustain(0.1)
        .release(0.5);

    const p4 = note(m`<[a5 c6 a5] ~ [g#5 c6 g#5] ~ g5 ~ f5 ~>`)
        .slow(3)
        .attack(0.005)
        .decay(0.2)
        .sustain(m`<0.5 0.3>/12`)
        .release(m`<1.5 1.5 2 1.5>/6`)
        .s("square")
        .cutoff(perlin.range(1000, 2000))
        .resonance(perlin.range(10, 15))
        .velocity(0.3)
        .room(2);

    return stack(
        p1.velocity(0.6),
        p2.velocity(0.2),
        p3.velocity(0.2),
        p4.velocity(0.2)
    );
};
