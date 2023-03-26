import { controls, rand, saw, sine, stack } from "@strudel.cycles/core";
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

    const p4 = note(m`<[e6 f#6]!3 [f#6 b6]> [<e7 <c7 c#7> b6 f#6> ~] ~ ~`)
        .velocity(m`[0.8 1] 0.9 0 0`)
        .decay(0.1)
        .sustain(0.5)
        .release(m`0 2.3 0 0`)
        .hcutoff(sine.range(2000, 3000).slow(16))
        .velocity(0.4)
        .slow(16);

    return stack(
        p1.velocity(0.5),
        p2.velocity(0.8).velocity(fadeIn(2)),
        p3.velocity(0.9).gain(fadeIn(5, 5)),
        p4.gain(fadeIn(0, 64))
    );
};
