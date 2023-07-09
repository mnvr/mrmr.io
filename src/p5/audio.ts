/**
 * Information about a track
 *
 * These fields are used by {@link extractAudioMarkersAtTime}
 */
interface TrackInfo {
    /**
     * Beats per minute of the track
     *
     * Note that {@link extractAudioMarkersAtTime} assumes that we're in a 4/4
     * regime.
     */
    bpm: number;
    /**
     * The duration (in seconds) of the track that is being looped.
     *
     * It is imperative to retain as accurate a value for this parameter as
     * possible, since inaccuracies will start compounding the longer the track
     * loops (since each time we'll be marking the track start at an offset
     * instead of the true value, and over time these will pile up).
     */
    duration: number;
}

/**
 * Various coordinates / measures that indicate the current position in the
 * audio track. These values help us in driving the sketch animation.
 *
 * In particular, this is the return value of {@link extractAudioMarkersAtTime}.
 */
export interface AudioMarkers {
    /**
     * We retain a reference to the track info that was passed to us in
     * {@link extractAudioMarkersAtTime}.
     */
    track: TrackInfo;
    /**
     * And also the original time (in seconds).
     */
    audioTime: number;
    /**
     * Time (in seconds).
     *
     * The time (in seconds) since the start of the current iteration of the
     * loop for the track.
     */
    time: number;
    /**
     * Time, normalized to the loop length
     *
     * A normalized representation of {@link time}. This will be a value between
     * [0, 1] indicating the offset within the current iteration of the loop.
     */
    loopOffset: number;
    /**
     * Time, in beats.
     *
     * We assume 4 / 4 beats - each bar contains 4 beats.
     */
    beats: number;
    /**
     * Time, in bars.
     */
    bars: number;
    /**
     * Bar number, integral.
     *
     * This is useful for indexing into various note maps.
     */
    bar: number;
    /**
     * Offset since the start of the current bar.
     *
     * This is a value between [0, 1].
     */
    barOffset: number;
    /**
     * Similarity index to the start of a bar. onset
     *
     * This is a sinusoidally varying version of barOffset. This value is
     * between [1, -1]. 1 at the onset of the bar, and -1 as we're just about to
     * loop back around. It can be used to drive smooth animations that come
     * into effect the closer we're to the onset of the first beat in a bar.
     */
    nearOnBeat: number;
    /**
     * A variation of {@link nearOnBeat}, but for the off beat (the mid point of
     * the bar).
     */
    nearOffBeat: number;
    /**
     * A generalization of {@link nearOnBeat} and {@link nearOffBeat} that
     * computes the sinusoidal similarity to the onset of an arbitrary offset
     * since the start of a bar.
     */
    nearBeat: (offset: number) => number;
}

/**
 * Obtain various measures and numbers that allow us to locate ourselves within
 * the given track by using the current time provided by the AudioContext.
 *
 * We retain various bits of information about an audio track when creating a
 * sketch. This data is passed to this function as the `trackInfo` parameter.
 *
 * At runtime, we pass the current `audioTime` in each draw call to to locate
 * ourselves at a specific point in the audio track which we're analyzing, and
 * then use that point to emit various numbers / measures that can then be used
 * to animate the sketch.
 *
 * @param trackInfo Static information about the track in which we wish to
 * locate ourselves.
 * @param audioTime The current time reported by the audio context.
 */
export const extractAudioMarkersAtTime = (
    track: TrackInfo,
    audioTime: number
): AudioMarkers => {
    // Time, in seconds
    const time = audioTime % track.duration;
    // Time, normalized to the loop length
    const loopOffset = time / track.duration;
    // We have a beat every 60 / bpm seconds. Divide by this value to obtain the
    // time in units of beats.
    const beats = time / (60 / track.bpm);
    // A bar is 4 beats – this is not always true, but we operate under the
    // assumption that this is true in the cases of the track which we're
    // analyzing.
    //
    // We have a bar every 4 * (60 / bpm) seconds. Divide by this value to
    // obtain the time in units of bars.
    const bars = beats / 4;
    // How far are we away from a bar.
    //
    // This is a number [0, 1].
    const barOffset = bars % 1;
    // Bar number, integral
    // Useful for indexing notes
    const bar = Math.floor(bars - barOffset);

    // We already have a number, bars, whose fractional value indicates how far
    // we're from the start of the onset of the bar. Generalize this concept,
    // but with a sinusoidal decay, and supporting similarity to arbitrary
    // points in the bar.
    //
    // - Add an offset (cycling back if needed to ensure we don't go negative)
    // - Smoothen this number by using a cosine
    // - Scale this number to [0, π] so that the cosine is between [1, -1]
    //
    const nearBeat = (offset: number) =>
        Math.cos(((1 + bars - offset) % 1) * Math.PI);

    const nearOnBeat = nearBeat(0);
    const nearOffBeat = nearBeat(1 / 2);

    return {
        track,
        audioTime,
        time,
        loopOffset,
        beats,
        bars,
        barOffset,
        bar,
        nearOnBeat,
        nearOffBeat,
        nearBeat,
    };
};
