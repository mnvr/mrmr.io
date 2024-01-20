/**
 * Yet Another Synth, yes.
 *
 * yes uses the WebAudio API, specifically audio worklets, to dynamically
 * generate and play sounds in a browser.
 */
class Synth {
    ctx?: AudioContext;

    /**
     * Call this method in response to a user action, like a tap.
     *
     * The browsers autoplay policy prevents JavaScript code from unilaterally
     * starting audio playback. Trying to create and use an audio context
     * without user interaction results in the browser printing a warning on the
     * console. Worse, it (and this might be undefined behaviour) enqueues any
     * existing events, and then plays them all at once when we do actually
     * trigger an audio context event in response to a user event.
     *
     * To get around this, call trigger in response to a user event, e.g. by
     * attaching a window "click" listener . This init is needed only once.
     *
     * @see {@link canAutoplay}
     */
    init() {
        let ctx = this.ctx;
        if (ctx === undefined) {
            ctx = new AudioContext();
            this.ctx = ctx;
        }
        return ctx;
    }

    /**
     * The {@link canAutoplay} property can be used to see if we're in a state
     * where {@link play} can be called without needing user interaction.
     */
    get canAutoplay() {
        return this.ctx !== undefined;
    }

    /**
     * Play a sound using the given parameters
     *
     * It is up to the caller to ensure that either one of the following two
     * conditions hold:
     *
     * 1. This method is being called in response to a user action like tap, or
     *
     * 2. There has been at least one tap before, and in the global handler for
     *    that tap we have called {@link init} explicitly. We can check for this
     *    case by querying {@link canAutoplay}.
     *
     * If you call play without one of the above being true, bad™ things will
     * happen.
     *
     * @param params The {@link PlayParams}
     */
    async play({ midiNote }: PlayParams) {
        const ctx = this.init();

        /**
         * Always resume the context
        *
        * Ideally, this would need to be done only once. However, on iOS Safari
        * the audio context switches to an "interrupted" state if we navigate
        * away from the page for an extended time. If we were to then come back
        * and play, no sound would be emitted until the context is resumed.
        *
        * https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/state#resuming_interrupted_play_states_in_ios_safari
        * */
       await ctx.resume();

       /** Play a sine tone at 440 Hz for 0.125 seconds */
    }
}

interface PlayParams {
    /**
     * Frequency expressed as the MIDI note
     *
     * Even though we don't use MIDI, this is a convenient way of specifying
     * musical notes because integral MIDI notes correspond to semitones.
     *
     * 69 is A4, 440 Hz.
     *
     * @default 69.
     */
    midiNote: number;
}
