import { controls, mask, rand, saw, sine, stack } from "@strudel.cycles/core";
import { m } from "strudel/mini";
import type { TidalSong } from "types";

export const song: TidalSong = () => {
    const { note } = controls;

    const d1 = note(
        m`[c d f a]!7 [g!6 f g] [c d f a]!7 [g g g@2 g@2 f g]`
    ).slow(16);
    const d2 = note(m`[c d f a]!7 [g f d c]`)
        .slow(8)
        .sub(note(12));

    const d3 = note(
        m`[g!6 f g]!5 [f!6 g f]!2 [d!6 g f] [[c | d]!6 f d] [c@3!2 d@2]!2`
    )
        .slow(11)
        .add(note(12 + 7))
        .cutoff(sine.range(900, 20000).slow(30))
        .gain(0.5)
        .outside(20, mask(m`1 1!4`));

    const d4 = note(m`[c d f a]!7 [g!2 f!2 d@3 c]`)
        .add(note(12))
        .slow(8)
        .s("triangle")
        .cutoff(saw.range(700, 1200).slow(40))
        .resonance(rand.range(13, 26))
        .delay(0.5).delayfeedback(0.9).delaytime(1)
        .gain(0.62);

    const d5 = note(m`c2 d2@2 ~`)
        .s("sawtooth")
        .cutoff(saw.range(700, 1200).slow(40))
        .resonance(rand.range(13, 26))
        .gain(0.62);

    return stack(d1, d2, d3.hush(), d4, d5);
};
