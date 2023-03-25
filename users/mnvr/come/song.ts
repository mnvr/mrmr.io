import {
    controls,
    isaw,
    mask,
    Pattern,
    rand,
    saw,
    sine,
    stack,
    timeCat,
    tri,
} from "@strudel.cycles/core";
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

    const d3 = note(m`[c d f a]!7 [g!2 f!2 d@3 c]`)
        .add(note(12))
        .slow(8)
        .s("triangle")
        .cutoff(tri.range(700, 1200).slow(40))
        .resonance(rand.range(13, 26))
        // .delay(0.5)
        // .delayfeedback(0.9)
        // .delaytime(1)
        .gain(0.9);

    const d4 = note(m`c2 d2@2 ~`)
        .s("sawtooth")
        .cutoff(saw.range(700, 1200).slow(40))
        .resonance(rand.range(13, 26))
        .gain(0.62);

    const ramp4 = (p: Pattern) =>
        p.gain(
            timeCat(
                [1, 0],
                [30, saw.range(0, 0.62)],
                [90, sine.range(0.62, 0.66)],
                [20, isaw.range(0, 0.62)],
                [5, 0]
            ).slow(1 + 30 + 90 + 20 + 5)
        );

    return stack(
        d1,
        d2,
        d2.outside(100, mask(m`0!8 1!16 0!76`)),
        // d3.outside(200, mask(m`0!30 1!170`)),
        ramp4(d4)
    );
};
