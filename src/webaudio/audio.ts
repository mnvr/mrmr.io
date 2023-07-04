/**
 * Load (Fetch and decode) an audio file into a AudioBuffer
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
    url: string
) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    console.log("Audio buffer loaded", url);
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
    audioBuffer: AudioBuffer
) => {
    const bufferSource = new AudioBufferSourceNode(audioContext, {
        buffer: audioBuffer,
    });
    bufferSource.connect(audioContext.destination);
    bufferSource.loop = true;
    bufferSource.start();
    return bufferSource;
};
