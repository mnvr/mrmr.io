import { ensure } from "utils/ensure";

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

/**
 * An async function to construct the WebAudio graph
 *
 * @param audioContext The {@link AudioContext} in which playback will take
 * place.
 *
 * The {@link useWebAudioFilePlayback} hook uses a sequencer to construct an
 * audio graph when the page is opened.
 *
 * - It starts off in a loading state, and invokes the sequencer passed to it.
 *
 * - The sequencer is async so that it can download / decode various audio
 *   buffers if needed.
 *
 * - Once the sequencer finishes, the audio graph is assumed (if no errors were
 *   thrown) to have been connected to the destination of the given audio
 *   context.
 */
export type Sequencer = (audioContext: AudioContext) => Promise<void>;

interface SequencerHelpers {
    /**
     * A function to load a sample into an audio buffer (async)
     *
     * @param name The name of the sample. This must be one of the keys in the
     * `mp3s` Record that is passed to {@link createHelpers}.
     */
    load: (name: string) => Promise<AudioBuffer>;
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
    ctx: AudioContext,
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

    return { load, source };
};

/**
 * Load (Fetch and decode) an audio file into an AudioBuffer
 *
 * @param audioContext The AudioContext` to use for decoding
 * @param URL The (absolute or relative) URL to the audio file. To reduce
 * cross-browser codec compatibility concerns, use MP3 files.
 *
 * [Source - MDN](
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques#dial_up_—_loading_a_sound_sample)
 *
 * Audio Codec
 * -----------
 *
 * tl;dr; use MP3
 * https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs
 *
 * Audio files can be converted to MP3 with the following FFMPEG incantation
 *
 *     ffmpeg -i in.m4a -c:a libmp3lame -q:a 2 out.mp3
 *
 * where:
 *
 * - "-c:a libmp3lame" is short for "-codec[:stream specifier] codec". This
 *   option selects an encoder (when used before an output file) or a decoder
 *   (wher used before an input file) for one or more streams.
 *
 * - "-q:a 2" is short for "-qscale[:stream specifier] q". This option tells
 *   FFMPEG to use a fixed quality scale (VBR). The meaning of q/qscale is
 *   codec-dependent. For LAME, lower numbers mean higher quality. 4 is the
 *   default. 0-3 should be transparent. We use 2, as recommended on the FFMPEG
 *   wiki (https://trac.ffmpeg.org/wiki/Encode/MP3), which gives an average
 *   190kbit/s VBR stream.
 *
 * Note that exporting directly to MP3 from GarageBand causes GarageBand to
 * insert a bit of silence at the end, causing the file to stop perfectly
 * looping. The workaround is to export to an uncompressed wav.
 *
 * This way though, the ID3 tags are lost. We will need to ask FFMPEG to add
 * them again when converting the WAV to MP3 by using the `-metadata artist=""
 * and `-metadata album=""`.
 */
const loadAudioBuffer = async (audioContext: AudioContext, url: string) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
};
