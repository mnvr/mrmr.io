/**
 * Yet Another Synth, yes.
 *
 * yes uses the WebAudio API, specifically audio worklets, to dynamically
 * generate and play sounds in a browser.
 */
export class Synth {
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
    async play(params?: PlayParams) {
        const { midiNote, gain } = validateParams({
            ...params,
            ...defaultPlayParams,
        });

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

        const t = ctx.currentTime;

        /** Play a sine tone at 440 Hz for 0.125 seconds */
        const osc = new OscillatorNode(ctx, {
            type: "sine",
            frequency: 440,
        });

        const oscOut = new GainNode(ctx, {
            gain,
        });
        osc.connect(oscOut);

        /**
         * Apply a relatively strong attentuation to the output always, to avoid
         * accidentally emitting loud noises, both during development, and for
         * people who might have their speakers unknowingly turned on too loud.
         */
        const out = new GainNode(ctx, {
            gain: 0.3,
        });
        out.connect(ctx.destination);

        oscOut.connect(out);
        osc.start();
    }
}

/** A unipolar level value, between 0 and 1 (inclusive) */
type Level = number;

/** A bipolar value between -1 and 1 (inclusive) */
type Bipolar = number;

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
    midiNote?: number;
    /**
     * Multiplier for the level of the output.
     *
     * Note that as a safety measure, there is a hardcoded attenuation (gain of
     * 0.3) applied to the final signal before sending it to the destination.
     * The gain specified here is independent of that.
     *
     * @default 0.3.
     */
    gain: Level;
}

const defaultPlayParams: Required<PlayParams> = {
    midiNote: 69,
    gain: 0.3,
};

/**
 * We use type aliases to annotate some of the parameters, e.g. the type of the
 * {@link gain} param is {@link Level}.
 *
 * However, these are just type aliases, and bring no runtime safety. For that,
 * we pass the parameters through this function that raises an exception if any
 * of the values passed don't quite look right.
 *
 * @return the passed in parameters.
 */
const validateParams = (params: Required<PlayParams>) => {
    const { midiNote, gain } = params;

    ensureLevel(gain);

    return params;
};

/** Throw if the given value does not look like a {@link Level} */
const ensureLevel = (v: Level) => {
    if (v < 0 || v > 1)
        throw new Error(
            `Invalid level ${v}. Level values are expected to be in the range 0 and 1 (inclusive).`,
        );
};
