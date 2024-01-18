import { controls, stack } from "@strudel/core";
import { m } from "strudel/mini";
import type { StrudelSong } from "types";

export const song: StrudelSong = () => {
    const { note } = controls;

    const p1 = note(m`[d#5 c#5!2]/1.1`)
        .attack(0.01)
        .decay(0.04)
        .sustain(0.02)
        // The release doesn't seem to fully let go
        .release(0.1)
        .gain(m`[1 0.4!2]`)
        .s("triangle");

    /*
                [
            [<a5!2 [a5!2] a5> c6 a5]
            [<a5!2 [a5!2] a5!2> c6 a5]
            [<a5!3 [a5!2]> c6 a5]
            [<a5 [a5!2]> c6 ~]
        ]/4
        */
    const p2 = note(
        m`
        [

[[a5!2] c6 d6 d6 c6 a5 a5 c6 [d6!2]!2 d6 ~]/4

    ]/1
        `,
    )
        .slow(1.1)
        .attack(0.01)
        .decay(0.04)
        .sustain(0.3)
        // The release doesn't seem to fully let go
        .release(0.1)
        // .gain(m`[1 0.4 0.8]`)
        .s("triangle");

    return stack(p1.velocity(0.0), p2.velocity(0.2));
};
