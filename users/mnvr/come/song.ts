import {
    cat,
    controls,
    isaw,
    Pattern,
    rand,
    saw,
    silence,
    sine,
    stack,
    timeCat,
} from "@strudel.cycles/core";
import { m } from "strudel/mini";
import type { TidalSong } from "types";

export const song1: TidalSong = () => {
    const { note } = controls;

    const d1 = note(
        m`[c d f a]!7 [g!6 f g] [c d [f@2 f] a]!6 [c d f a] [g g g@2 g@2 f g]`
    ).slow(16);

    const d2 = note(m`[c d f a]!7 [g f d c]`)
        .slow(8)
        .sub(note(12));

    const d3 = note(m`[c@2 ~ ~]!7 [g!2 f!2 d@3 c]`)
        .add(note(7))
        .slow(8)
        .s("triangle")
        .decay(0.01)
        .sustain(0.5)
        .release(0.05)
        .cutoff(sine.range(500, 3000).slow(20))
        .resonance(rand.range(13, 16))
        .echo(5, 0.5, 0.1)
        .gain(cat(0, saw.range(0, 1), 1, isaw.range(0, 1)).slow(70))
        .velocity(0.9);

    const d4 = note(m`c2 d2@2 ~`)
        .s("sawtooth")
        .cutoff(saw.range(700, 1200).slow(40))
        .resonance(rand.range(13, 26))
        .velocity(0.65);

    const d4b = d4
        .velocity(0.2)
        .cutoff(saw.range(700, 12000).slow(m`<40@40 5@5>`));

    const ramp4 = (p: Pattern) =>
        p.gain(
            timeCat(
                [1, 0.01],
                [30, saw.range(0, 0.62)],
                [70, sine.range(0.62, 0.66)],
                [30, isaw.range(0, 0.62)],
                [15, 0.01]
            ).slow(1 + 30 + 70 + 30 + 15)
        );

    const ramp4b = (p: Pattern) =>
        p.gain(
            timeCat(
                [1 + 30 + 70 + 30 + 15, 0.01],
                [1, 0.01],
                [30, saw.range(0, 0.62)],
                [70, sine.range(0.62, 0.66)],
                [30, isaw.range(0, 0.62)],
                [15, 0.01]
            ).slow((1 + 30 + 70 + 30 + 15) * 2)
        );

    const ramp4_inv = (p: Pattern) =>
        p.gain(
            timeCat(
                [1, 1],
                [30, isaw.range(0.8, 1)],
                [70, 0.8],
                [45, isaw.range(0.8, 1)]
            ).slow(1 + 30 + 70 + 30 + 15)
        );

    return stack(
        ramp4_inv(d1.velocity(0.5)),
        ramp4_inv(d2.velocity(0.8)),
        d3,
        ramp4(d4),
        ramp4b(d4b)
    ).velocity(0.4);
};

export const song: TidalSong = () => {
    const { note } = controls;

    const p1 = note(m`<[c3 a2] ~ ~>`).sub(note(12));

    const p2 = note(m`[c3 d3] <g5 c5 d5 e5>`).s("sine");

    const p3 = timeCat([1, silence], [2, p2], [1, silence]);

    return stack(p1, p3);
};
