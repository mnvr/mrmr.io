import { controls, stack } from "@strudel.cycles/core";
import { m } from "strudel/mini";
import type { TidalSong } from "types";

export const song: TidalSong = () => {
    const { note } = controls;

    const p1 = note(m`d#5 c#5!2`)
        .attack(0.01)
        .decay(0.04)
        .sustain(0.02)
        // The release doesn't seem to fully let go
        .release(0.1)
        .gain(m`[1 0.4!2]`)
        .s("triangle");

    return stack(p1.velocity(0.5));
};
