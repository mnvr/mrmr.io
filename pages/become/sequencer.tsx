import { ensure } from "utils/ensure";
import { loadAudioBuffer } from "webaudio/audio";

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
            const cp = source(pad);
            cp.onended = (ev: Event) => {
                // Schedule the next to next one
                loop(at + 2 * d);
            };
            cp.start(at);
            source(drums).start(at);
            source(bass).start(at);
        };

        loop(2 * d);
        loop(3 * d);
    };
};

interface SequencerHelpers {
    /**
     * A function to load a sample into an audio buffer (async)
     *
     * @param name The name of the sample. This must be one of the keys in the
     * `mp3s` Record that is passed to {@link createHelpers}.
     */
    load: (name: string) => Promise<AudioBuffer>;
    /**
     * A mixer connected to the destination of the audio context passed to
     * {@link createHelpers}.
     *
     * Audio playback nodes created by other methods like {@link play} will
     * connect to this mixer. This thus acts as a funnel, so gain of this mixer
     * can thus be changed to effect the overall volume, or it can be fed into
     * an analyser node.
     */
    mixer: GainNode;
    /**
     * Create a node to play the given buffer, and connect it to the
     * {@link mixer}.
     */
    source: (buffer: AudioBuffer) => AudioBufferSourceNode;
}
/**
 * Create various routines that reduce the amount of code we've to write when
 * creating the audio graph in common types of sequencers.
 *
 * @param mp3s The URLs of the MP3 files associated with the page, indexed by
 * their name.
 *
 * @param ctx The {@link AudioContext} in which playback will occur.
 *
 * @returns SequencerHelpers
 */
const createHelpers = (
    mp3s: Record<string, string>,
    ctx: AudioContext
): SequencerHelpers => {
    const load = (name: string) => loadAudioBuffer(ctx, ensure(mp3s[name]));

    const mixer = new GainNode(ctx);
    mixer.connect(ctx.destination);

    const source = (b: AudioBuffer) => {
        const bufferSource = new AudioBufferSourceNode(ctx, {
            buffer: b,
        });
        bufferSource.connect(mixer);
        return bufferSource;
    };

    return { load, mixer, source };
};
