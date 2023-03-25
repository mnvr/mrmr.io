import { controls, stack } from "@strudel.cycles/core";
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

    const d3 = note(m`g!6 f g`)
        .add(note(12 + 7))
        .gain(0.5)
        .fast(40)
        .mask(m`0 1!3`)
        .slow(40);

    return stack(d1.hush(), d2.hush(), d3);
};
