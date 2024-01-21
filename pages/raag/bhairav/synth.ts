/**
 * @file Yet Another Synth, yes.
 *
 * This file begins with the types. The actual synth, {@link Synth} follows.
 */

/**
 * Frequency expressed as the MIDI note
 *
 * Even though we don't use MIDI, this is a convenient way of specifying musical
 * notes because integral MIDI notes correspond to semitones.
 *
 * Integral values correspond to semitones. It is totally fine to specify
 * fractional values too to get arbitrary frequencies - even then, specifying
 * notes this way is convenient because of the implicit logarithmic nature (we
 * get a new octave every thirteenth MIDI note).
 *
 * For example, MIDI note 69 corresponds to A4, 440 Hz.
 *
 * This value should be between 21 (A0, 27.5 Hz) and 108 (C8, 4186 Hz),
 * inclusive.
 *
 * If you're new to seeing MIDI numbers, the following might be helpful:
 *
 * - An octave is a ratio of 2:1. Two notes, where one is double the frequency
 *   of the other, are an octave apart.
 *
 * - An octave is divided into 12 equal semitones (this is controversial, but
 *   that's how it gets done de facto). So the difference between two notes that
 *   are just one semitone apart is 1/12th of an octave. However, human hearing,
 *   and musical notes, are logarithmic - which means that instead of linear
 *   differences we perceive ratios (and thus in music use ratios). So a more
 *   accurate statement is that the _ratio_ between two notes that are just one
 *   semitone apart is 1/12th of an octave.
 *
 * - So we need to find a ratio r such that if we multiply by it 12 times (once
 *   each for the 12 notes in an octave), we get back 2. This is 2 ^ (1/12), the
 *   12th root of 2.
 *
 *         $ python -c 'print(2 ** (1/12))'
 *         1.0594630
 *
 * - So each semitone has the ratio 1.059.
 *
 * - Conveniently, each MIDI number corresponds to a semitone. Two common
 *   reference points are MIDI 60, which corresponds to "middle C", C4, 261.3
 *   Hz; and MIDI 69, which corresponds to musical note A4, 440 Hz.
 *
 * - The range of MIDI numbers is conventionally capped to match a hypothetical
 *   piano that ranges from note A0 (MIDI 21, 27.5 Hz) to C8 (MIDI 108, 4186
 *   Hz).
 *
 * - To convert MIDI notes to frequencies, 69 is taken as the reference value.
 *   Then we just multiply (or divide) by 1.059 (i.e. 2^(1/12)) as many times as
 *   is needed to get from 69 to the given note.
 *
 * There are other good explanations too available online. e.g. this one from
 * UNSW: [Note names, MIDI numbers and
 * frequencies](https://newt.phys.unsw.edu.au/jw/notes.html).
 */
export type MIDINote = number;

/** A unipolar level value, between 0 and 1 (inclusive) */
export type Level = number;

/** A bipolar value between -1 and 1 (inclusive) */
export type Bipolar = number;

/** A time value, in seconds */
export type TSecond = number;

/**
 * The waveform to sound as the sound source
 *
 * This specifies the shape of the wave produced by the oscillator that acts as
 * our sound source. Available options are:
 *
 * - "sine" - A sine wave.
 * - "square" - A square wave with a duty cycle of 0.5 (i.e. the signal is high
 *   for 50% of the period)
 * - "sawtooth" - A sawtooth wave.
 * - "triangle" - A triangle wave.
 *
 * Each of these waveforms provide different harmonic content.
 *
 * The simplest, in the sense of having no harmonics, is the sine wave - it is
 * just the wave itself, at the given frequency.
 *
 * The other waveforms, while visually and computationally easier to describe,
 * are more complicated because they are effectively a harmonic series of sine
 * waves, starting with a sine wave at the given frequency, but also having a
 * subset of the harmonics / partials. As such, these provide more fodder for
 * any filters down the line to shape. This is subtractive synthesis (start
 * with a waveform that contains a lot of harmonics, and filter them in a
 * musical, time varying, manner).
 */
export type Waveform = "sine" | "square" | "sawtooth" | "triangle";

/** Parameters for the {@link Synth}'s {@link play} method. */
export interface PlayParams {
    /**
     * Frequency expressed as a {@link MIDINote}.
     *
     * e.g. 69 is A4, 440 Hz.
     *
     * @default 69.
     */
    note?: MIDINote;
    /**
     * The waveform to use.
     *
     * @default "sine"
     */
    waveform?: Waveform;
    /**
     * Duration of the note.
     *
     * This sets the combined duration of the ADS phases of the ADSR envelope,
     * so the _actual_ duration of the note is this + release (time).
     *
     * In practice, the attack/decay are quite short, and that we think of as
     * the duration is usually the part of the note that sustains.
     *
     * It might seem quite arbitrary, treating sustain differently this way:
     *
     * (a) the sustain parameter in the ADSR {@link Envelope} is a level, unlike
     *     the other three ADSR parameters which are durations
     *
     * (b) instead of specifying the sustain duration there, we specify it here
     *     in a roundabout way, outside the envelope.
     *
     * However, such specification does map better to how we (musically) want
     * the synth notes to behave.
     *
     * @default 0.1 (100 ms)
     */
    duration?: TSecond;
    /**
     * Amplitude level
     *
     * This sets maximum level that the amplitude envelope ({@link env} reaches
     * – i.e. its level after the attack phase. If the envelope also has a
     * {@link sustain} (level), then the sustain level is multiplied with this
     * level to obtain the level of the sound during the sustain phase.
     *
     * Note that as a safety measure, there is a hardcoded attenuation (a gain
     * of 0.3) applied to the final signal before sending it to the destination.
     * The level (gain) specified here acts prior to it.
     *
     * In practice, setting this to 1 sounds loud (even after the safety
     * attenuation), so a value of 1 here should be taken as a loud extreme (and
     * a value of 0 as the other extreme of silence).
     *
     * In between is a linear range. The default here is meant as something that
     * is audible even if the user's speakers are set to a low volume, but not
     * too loud if the speakers are turned all the way up (so as to not startle
     * them). But this is more of a prayer than a guarantee, and may not apply
     * based on the user's setup.
     *
     * @default 0.7
     */
    level?: Level;
    /**
     * Amplitude envelope
     *
     * The sound produced by the synth grows and wanes in amplitude as defined
     * by this amplitude envelope, which is an ADSR {@link Envelope}.
     *
     * The levels in the envelope are scaled by the {@link level} property.
     *
     * - After the attack phase, the envelope reaches 1. The actual sound level
     *   at this point will be `level * 1`.
     *
     * - During the sustain phase, the envelope holds at `sustain`. So the
     *   actual sound level during this time will be `level * sustain`.
     *
     * @default @see {@link defaultAmplitudeEnvelope}
     */
    env?: Envelope;
}

/**
 * An ADSR envelope
 *
 * An ADSR envelope goes through 4 phases:
 *
 * - Attack: A linear ramp from 0 to the 1. This ramp happens over `attack`
 *   seconds.
 *
 * - Decay: An exponential ramp from 1 to `sustain`. This ramp happens over
 *   `decay` seconds.
 *
 * - Sustain: Keep the value constant at `sustain` for the remaining duration of
 *   the phenomena. For instance, when this envelope is used to control the
 *   amplitude of a note, this sustain duration is remaining time left in the
 *   {@link duration} property of {@link PlayParams} (after subtracting the
 *   `attack` and `decay` durations).
 *
 * - Release: An exponential ramp from `sustain` to 0 over `release` seconds.
 *
 * There is nothing fundamental about an ADSR envelope as described above, but
 * in practice these four phases seem to capture how many natural, and musical,
 * sounds grow and fade in time.
 *
 * @see {@link defaultAmplitudeEnvelope} for the default values.
 */
export interface Envelope {
    /**
     * The duration of the attack phase in seconds.
     *
     * The attack phase is a linear ramp from 0 to 1 over `attack` seconds.
     *
     * @default 0.001 (1 ms)
     *
     * For reference, at a sample rate of 44100 Hz, each sample takes 22.67 us.
     * So a ramp of 1 ms would take effect over 44.1 samples.
     */
    attack?: TSecond;
    /**
     * The duration of the decay phase in seconds.
     *
     * The decay phase is an exponential ramp from 1 to `sustainLevel` over
     * `decay` seconds.
     *
     * @default 0.050 (50 ms)
     */
    decay?: TSecond;
    /**
     * The level during the sustain phase.
     *
     * Note that both this, and the implicit attackLevel (1) is multiplied by
     * the some external (to the envelope) {@link level} parameter when the
     * applying this envelope and figuring out the actual gain values to use.
     *
     * The duration of the sustain phase of the envelope is externally
     * specified. For instance, if an ADSR envelope is used to control the
     * amplitude of a note, then the sustain duration will be equal to the the
     * {@link duration} value in {@link PlayParams}, minus the {@link attack}
     * and {@link decay} time.
     *
     * @default 0.6
     */
    sustain?: Level;
    /**
     * The duration of the release phase in seconds.
     *
     * The release phase is an exponential ramp from `sustainLevel` to 0.
     *
     * @default 0.02 (20 ms)
     */
    release?: TSecond;
}

type PlayParamsOrDefault = Required<
    Omit<PlayParams, "env"> & { env: Required<Envelope> }
>;

export const defaultAmplitudeEnvelope: Required<Envelope> = {
    attack: 0.001,
    decay: 0.05,
    sustain: 0.6,
    release: 0.02,
};

export const defaultPlayParams: PlayParamsOrDefault = {
    note: 69,
    duration: 0.1,
    level: 0.7,
    waveform: "sine",
    env: defaultAmplitudeEnvelope,
};

/**
 * Return new {@link PlayParams} that have everything set to default, and then
 * overridden with the provided parameters.
 *
 * This can be conceptually be though of as a expanded version of
 *
 *     { ...defaultPlayParams, ...params }
 *
 * This more elaborate version is needed to handle nested objects.
 */
const mergeIntoDefaultPlayParams = (
    params?: PlayParams,
): PlayParamsOrDefault => {
    if (!params) return defaultPlayParams;
    return {
        ...defaultPlayParams,
        ...params,
        env: { ...defaultPlayParams.env, ...params.env },
    };
};

/**
 * We use type aliases to annotate some of the parameters, e.g. the type of the
 * {@link level} param in {@link PlayParams} is {@link Level}.
 *
 * However, these are just type aliases, and bring no runtime safety. For that,
 * we pass the parameters through this function that raises an exception if any
 * of the values passed don't quite look right.
 *
 * @return the passed in parameters.
 */
const validateParams = (params: PlayParamsOrDefault) => {
    const { note, duration, level, env } = params;

    validateMIDINote(note);
    validateTSecond(duration);
    validateLevel(level);
    validateEnvelope(env);

    return params;
};

/** Throw if the given value does not look like a {@link MIDINote} */
const validateMIDINote = (v: MIDINote) => {
    if (v < 21 || v > 108)
        throw new Error(
            `Invalid MIDI note ${v}. MIDI note values are expected to be in the range 21 and 108 (inclusive).`,
        );
};

/** Throw if the given value does not look like a {@link Level} */
const validateLevel = (v: Level) => {
    if (v < 0 || v > 1)
        throw new Error(
            `Invalid level ${v}. Level values are expected to be in the range 0 and 1 (inclusive).`,
        );
};

/** Throw if the given value does not look like a {@link TSecond} */
const validateTSecond = (v: TSecond) => {
    if (v < 0)
        throw new Error(
            `Invalid time (in second) ${v}. Second values are expected to be positive.`,
        );
};

/** Throw if any of the the fields in the given envelope look fishy */
const validateEnvelope = (e: Required<Envelope>) => {
    validateTSecond(e.attack);
    validateTSecond(e.decay);
    validateLevel(e.sustain);
    validateTSecond(e.release);
};

/**
 * Convert a MIDI note `m` to a frequency (Hz) value.
 *
 * @see {@link MIDINote} for a detailed explanation of what this formula does.
 *
 * @param m A MIDI Note
 * @returns A frequency in Hz.
 */
const convertMIDINoteToFrequency = (m: MIDINote) => {
    return 440 * (2 ** (1 / 12)) ** (m - 69);
};

/**
 * Yet Another Synth, yes.
 *
 * yes uses the WebAudio API, specifically audio worklets, to dynamically
 * generate and play sounds in a browser.
 */
export class Synth {
    ctx?: AudioContext;

    /**
     * Set this to true to emit debugging messages to the console.
     */
    #debug = false;

    /**
     * Count of outstanding playbacks.
     *
     * When we start playing in response to a call of `play()`, this value is
     * incremented. When the corresponding node ends, this value is decremented.
     *
     * It is used to then suspend the audio context if there is nothing
     * remaining to be played.
     */
    #activePlaybackCount = 0;

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

            if (this.#debug) {
                ctx.addEventListener("statechange", () => {
                    this.log(`AudioContext state changed to ${ctx?.state}`);
                });
            }
        }
        return ctx;
    }

    log(msg: string) {
        const t = (this.ctx?.currentTime ?? 0).toFixed(6);
        console.info(`[yes] ${t} ${msg}`);
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
     * @param onEnded A callback that is fired when the note ends playing.
     */
    async play(params?: PlayParams, onEnded?: () => void) {
        // WebAudio spec:
        // https://webaudio.github.io/web-audio-api/

        const vParams = validateParams(mergeIntoDefaultPlayParams(params));
        const { note, waveform, duration, level, env } = vParams;

        const ctx = this.init();

        // Always resume the context
        //
        // Ideally, this would need to be done only once. However, on iOS Safari
        // the audio context switches to an "interrupted" state if we navigate
        // away from the page for an extended time. If we were to then come back
        // and play, no sound would be emitted until the context is resumed.
        //
        // I've empirically observed this. For more details, see
        // https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/state#resuming_interrupted_play_states_in_ios_safari
        //
        // Also, it seems that iOS will only allow the audioContext to be
        // resumed if it is running within the call-stack of the a UI event
        // handler.
        //
        // Note that we never suspend the audio context. An earlier version of
        // this code did indeed try to be a good citizen and suspend the audio
        // context when the note was done playing. However, doing that caused
        // stuttery audio. So we just let it be. The browser automatically stops
        // showing the "playing"/"speaker" icon next to our tab in the tab bar
        // even if we don't explicitly suspend it, so not suspending doesn't
        // have any functional impact that I can tell of.

        await ctx.resume();

        const t = ctx.currentTime;

        const freq = convertMIDINoteToFrequency(note);

        // Play a pure tone of type `type` at `freq` Hz.
        const osc = new OscillatorNode(ctx, {
            type: waveform,
            frequency: freq,
        });

        // Apply the ADSR envelope to the amplitude.
        const amp = new GainNode(ctx);
        osc.connect(amp);

        // Start at 0
        amp.gain.setValueAtTime(0, 0);

        // Linear ramp to level over `attack` seconds.
        amp.gain.linearRampToValueAtTime(level, t + env.attack);

        // Exponential ramp from `level * 1` to `sustainLevel * level` over
        // `decay` seconds.
        //
        // The third parameter to setTargetAtTime is a `timeConstant`, which is
        // the time it takes to reach 1 - e⁻¹ = 63% of the target (the first
        // parameter).
        //
        // To see where the 63% comes from, notice that 1/e = 0.367. So
        // 1-(e**-1) is 0.632, ~63%. MDN, excellent as always, has a longer
        // [explanation](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime#description):
        //
        // > The change starts at the time specified in `startTime` (second
        //   parameter) and exponentially moves towards the value given by the
        //   `target` parameter (the first parameter to setTargetAtTime). The
        //   decay rate as defined by the `timeConstant` parameter (the third
        //   parameter) is exponential; therefore the value will never reach
        //   `target` completely, but after each timestep of length
        //   `timeConstant`, the value will have approach the `target` by
        //   another 1 - e⁻¹ ≃ 63%.
        //
        // Multiplying the time constant by some n is equivalent to having n
        // timesteps, and each timestep will further get 1 - e⁻¹ closer to the
        // target, i.e.
        //
        //       (1 - e⁻¹)ⁿ
        //     = 1ⁿ - (1/e)ⁿ
        //     = 1  - e⁻ⁿ
        //
        // So multiplying by 3 gives us 1  - e⁻³ ≃ 0.95, i.e a value that is 95%
        // of the target. Since we already know the time interval we have at our
        // disposal, we can divide it by 3 to a timeConstant that gets us the
        // equivalent effect. MDN corraborates:
        //
        // > Depending on your use case, getting 95% toward the target value may
        //   already be enough; in that case, you could set `timeConstant` to
        //   one third of the desired duration.
        amp.gain.setTargetAtTime(
            env.sustain * level,
            t + env.attack,
            env.decay / 3,
        );

        // Exponential ramp from `sustainLevel * level` to `0` over `release`
        // seconds, after waiting out the duration of the note.
        //
        // This time we scale the timeConstant by 5, to get 99% to the target
        // value. This is needed because we'll remove the node from the audio
        // graph at this point, so having it effectively be silent is necessary
        // so as to not cause clicks.
        amp.gain.setTargetAtTime(0, t + duration, env.release / 5);

        // Apply a relatively strong attentuation to the output always, to avoid
        // accidentally emitting loud noises, both during development, and for
        // people who might have their speakers unknowingly turned on too loud.
        //
        // About Gain
        // ----------
        //
        // The gain is a unitless value, that each sample is multiplied with. An
        // instanteously applied gain causes clicks in the audio and so in
        // practice we need to use ramps / envelopes when applying them (this is
        // actually true of almost all audio parameters to a certain extent, but
        // is especially true of the output level).
        //
        // So when applying a gain it is better to use a envelope instead.
        // However, since this audio node is meant to serve as a pseudo
        // brick-wall limiter, we start with (and remain at) the constant
        // attenuation, and rely on one of the nodes before us in the chain to
        // apply an envelope to prevent clicks.
        const out = new GainNode(ctx, {
            gain: 0.3,
        });
        out.connect(ctx.destination);

        amp.connect(out);
        osc.start();

        // Stop the source (osc) after the requested duration has passed.
        //
        // WebAudio automatically does "garbage collection" for the entire chain
        // of nodes that were reachable from the source node that we stop. This
        // is described in the (non-normative) "Dynamic Lifetime" section of the
        // WebAudio spec:
        // https://webaudio.github.io/web-audio-api/#DynamicLifetime
        //
        // > The audio system automatically deals with tearing-down the part of
        //   the routing graph for individual "note" events.
        //
        // > A "note" is represented by an AudioBufferSourceNode (nb:
        //   OscillatorNodes inherit from AudioBufferSourceNode), which can be
        //   directly connected to other processing nodes. When the note has
        //   finished playing, the context will automatically release the
        //   refernce to the AudioBufferSourceNode, which in turn will release
        //   references to any nodes it is connected to, and so on. The nodes
        //   will automatically get disconnected from the graph and will be
        //   deleted when they have no more references.
        osc.stop(t + duration + env.release);

        this.#activePlaybackCount += 1;
        if (this.#debug) {
            this.log(`note ${Math.round(freq)} hz: ${JSON.stringify(vParams)}`);
        }
        osc.onended = () => {
            this.#activePlaybackCount -= 1;
            if (this.#debug) {
                this.log(`note ${Math.round(freq)} hz done`);
            }
            if (onEnded !== undefined) onEnded();
        };
    }
}
