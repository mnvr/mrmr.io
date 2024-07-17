import { createHelpers } from "webaudio/audio";

export const createSequencer = (mp3s: Record<string, string>) => {
    return async (ctx: AudioContext) => {
        const { load, source } = createHelpers(mp3s, ctx);

        const [pad, drumsIntro, drums, bass] = await Promise.all([
            load("stem-pad"),
            load("stem-drums-intro"),
            load("stem-drums"),
            load("stem-bass"),
        ]);

        // Duration of one loop (all our samples are of the same duration).
        const d = pad.duration;

        // intro
        source(pad).start();
        source(drumsIntro).start();

        // loop 1
        source(pad).start(d);
        source(drums).start(d);

        // loop...
        const loop = (at: number) => {
            const sp = source(pad);
            sp.onended = () => {
                // Schedule the next to next one.
                loop(at + 2 * d);
            };
            sp.start(at);
            source(drums).start(at);
            source(bass).start(at);
        };

        loop(2 * d);
        loop(3 * d);
    };
};
