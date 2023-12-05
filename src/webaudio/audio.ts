import { ensure } from "utils/ensure";

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

/**
 * Construct a simple sequencer that downloads and loops a file.
 *
 * @param loopURL The URL to the MP3 file that should be looped.
 *
 * @returns a {@link Sequencer} that will download the audio file from
 * `loopURL`, decode it into an audio buffer and then construct and connect an
 * audio node to play that buffer indefinitely in the sequencer's audio context.
 */
export const createLoopSequencer = (loopURL: string) => {
    return async (audioContext: AudioContext) => {
        const audioBuffer = await loadAudioBuffer(audioContext, loopURL);
        loopAudioBuffer(audioContext, audioBuffer);
    };
};

export interface SequencerHelpers {
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
export const createHelpers = (
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

    return { load, mixer, source };
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
export const loadAudioBuffer = async (
    audioContext: AudioContext,
    url: string,
) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
};

/**
 * Create a source node to play an audio buffer in a loop.
 *
 * @param audioContext The AudioContext in which to play.
 * @param audioBuffer The AudioBuffer to play. See `createAudioBuffer` for
 * instance on how to load a file into a buffer.
 *
 * @returns The source AudioNode that will play the buffer. The node will be set
 * to loop, and will also be started. This source can then be subsequently
 * stopped.
 *
 * [Source - MDN](
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques#dial_up_—_loading_a_sound_sample)
 */
export const loopAudioBuffer = (
    audioContext: AudioContext,
    audioBuffer: AudioBuffer,
) => {
    const bufferSource = new AudioBufferSourceNode(audioContext, {
        buffer: audioBuffer,
    });
    bufferSource.connect(audioContext.destination);
    bufferSource.loop = true;
    bufferSource.start();
    return bufferSource;
};
