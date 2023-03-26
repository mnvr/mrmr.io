import { controls, rand, saw, stack } from "@strudel.cycles/core";
import { m } from "strudel/mini";
import { fadeIn } from "strudel/util";
import type { TidalSong } from "types";

export const song: TidalSong = () => {
    const { note } = controls;

    const p1 = note(
        m`[c d f a]!7 [g!6 f g] [c d [f@2 f] a]!6 [c d [f@2 f] a] [g g g@2 g@2 f g]`
    ).slow(16);

    const p2 = note(m`[c d f a]!7 [g f d c]`)
        .slow(8)
        .sub(note(12));

    const p3 = note(m`c2 d2@2 ~`)
        .s("sawtooth")
        .cutoff(saw.range(700, 1200).slow(40))
        .resonance(rand.range(13, 26))
        .velocity(0.65);

    const p4 = note(m`[c5 d5] [<c6 g#5 g5> ~] ~ ~`)
        .velocity(m`1 0.9 0 0`)
        .decay(0.1)
        .sustain(m`0.5 0.7 0 0`)
        .release(m`0 2.3 0 0`)
        .hcutoff(5000)
        .add(note(12 + 4))
        .s("triangle")
        .gain(0.3)
        .slow(16);

    return stack(
        p1.velocity(0.5),
        p2.velocity(0.8),
        p3.velocity(fadeIn(5)),
        p4.velocity(fadeIn(15))
    );
};
