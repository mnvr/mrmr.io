/**
 * TypeScript d.ts type declarations for Strudel
 * https://github.com/tidalcycles/strudel
 *
 * By Manav Rathi (https://github.com/mnvr/mrmr.io)
 *
 * ## Strudel
 *
 * JavaScript port of TidalCycles.
 *
 * ## Installation
 *
 * Strudel is split into a number of small packages, all available under
 * `@strudel/*`. Here we cover the following:
 *
 * - `@strudel/core` - as it says on the tin
 * - `@strudel/webaudio` - to allow us to emit sounds using
 *   [WebAudio](https://www.w3.org/TR/webaudio/)
 * - `@strudel/mini` - to allow us to use the mini notation
 *
 * ### Core
 *
 * The heart of Tidal (and thus, Strudel) is the {@link Pattern} class. A
 * pattern is a function that can query to ask what all **events** happen over a
 * cycle (arc) of time.
 *
 * The core contains various primitive pattern (notes, silence etc), and ways to
 * combine them (concatenate them, stack them, add the values embedded in them,
 * etc).
 *
 * Control parameters act as FX chains, modifying patterns to create new ones
 * that incorporate the effects of the control parameter. The control parameter
 * itself can be parameterized by a pattern to change its value.
 *
 * ### WebAudio
 *
 * A pattern is something we can query to ask what all events happen over a
 * cycle (By convention, 1 cycle is 1 second). Events can be arbitrary things,
 * but the events we're dealing in the context of sound are things that can be
 * rendered as audio by the WebAudio renderer.
 *
 * To connect core to WebAudio, we need to import `getAudioContext`,
 * `webaudioOutput` from "@strudel.cycles/webaudio", and then pass those to the
 * core's `repl` object. Thereafter, communication between core and webaudio
 * happens implicitly via control parameters attached to events.
 *
 * The webaudio package also exports `initAudioOnFirstClick`, which we need to
 * call once. It also has a `samples` function, which can be used to load
 * samples.
 *
 * ### Mini
 *
 * The mini notation is syntax sugar to simplify writing patterns.
 *
 * ### Superdough
 *
 * Strudel also provides us access to its audio engine, _superdough_. The
 * `strudel/webaudio` package is in fact a thin wrapper around the standalone
 * `superdough` package.
 *
 * Superdough is useful for directly triggering sounds, e.g.
 *
 *      // superdough(value, time, duration)
 *      superdough({ note: 'g1', s: 'sawtooth', cutoff: 600 }, t, 0.125);
 *
 */
declare module "@strudel/core" {
    /**
     * Patterns are the core abstraction of TidalCycles (and thus Strudel).
     *
     * A Pattern is something that can be queried to ask it which Events (aka
     * {@link Hap}s) occur during a given Timespan. {@link Timespan}s are spans
     * of cycles. By convention, 1 cycle maps to 1 second of simulated time.
     *
     * Internally, patterns are just functions. Give it a starting cycle and an
     * ending cycle, and it'll give you back all the events that should happen
     * between those two points in time. This is what we mean by "querying" a
     * pattern.
     *
     * Surprisingly, all the abstractions that we see can be implemented by
     * combinations of this primitive.
     *
     * The {@link Pattern} class extends {@link Controls}, but that is just for
     * providing a convenient, chainable, interface to creating new patterns by
     * calling a function on an existing pattern. Conceptually, the
     * {@link Pattern} is the core primitive, while {@link Controls} can be
     * thought of as a way to augment it with frequently useful extensions.
     */
    export class Pattern extends Controls {
        /**
         * Ask the pattern what all events will happen between start and end.
         *
         * This is the fundamental operation in terms of the implementation, but
         * as a user of Strudel we'll (almost) never need to do this. As a user,
         * we just create patterns. Then, the implementation queries the top
         * level pattern what's up for the next cycle or so. This propogates
         * recursively, and the resultant stew is handed back to the
         * implementation.
         *
         * The implementation then renders the obtained events. In the main
         * context in which Strudel is used, the rendering takes those events
         * and maps those to an WebAudio orchestra to produce (hopefully
         * musical) sound.
         */
        queryArc: (start: Cycle, end: Cycle) => Hap[];

        /**
         * Render a visual representation of the pattern on the console.
         *
         * Intended for debugging; will break in ways more than one.
         *
         * Legend:
         * - "|" cycle
         * - "-" hold
         * - "." silence
         */
        drawLine: () => void;

        /**
         * Return a new pattern but with its events sorted by their onsets.
         *
         * This is useful when debugging.
         */
        sortHapsByPart(): Pattern;
    }

    /**
     * A pattern, or something which can be converted into a pattern.
     */
    export type Patternable<T = number> =
        | Pattern
        | Pattern[]
        | string
        | string[]
        | T
        | T[]
        | (T | T[] | Pattern)[];

    /**
     * A function with takes one or more pattern-like inputs, transforms it in
     * some way, and produces an output pattern.
     *
     * Note that if multiple Patternables are provided (either explicitly as an
     * array, or implicitly as multiple arguments to the function), then they're
     * {@link sequence}-d to produce a single Pattern. The resultant, sequenced
     * (fast-catted) Pattern is what the transformation function then acts on to
     * produce the output pattern.
     */
    export type PatternTransform<T = number> = (
        ...pats: Patternable<T>[]
    ) => Pattern;

    /**
     * An arbitrary precision rational number
     */
    interface IFraction {
        /** Sign */
        s: number;
        /** Numerator */
        n: number;
        /** Denominator */
        n: number;

        /*
         * The standard "Fraction" type that Strudel uses has been enhanced by
         * Strudel to add some functions that are convenient when dealing with
         * TimeSpans.
         */

        /**
         * The start of the current cycle.
         *
         * The name comes from Hindi सम, which denotes the first beat of a taal
         * (ताल).
         */
        sam: IFraction;

        /**
         * x < y === x.lt(y)
         *
         * @return true if we're less than the argument
         */
        lt: (IFraction) => boolean;
    }

    export const Fraction: (n: number | string) => IFraction;

    /**
     * A cycle, or a point in the midst of one.
     *
     * A cycle is a rotation over a unit circle. But not all rotations are the
     * same. Some phenomena, like a sine wave, can be completely described by
     * their behaviour over a single rotation. Other phenomena unfold over
     * multiple cycles.
     *
     * And not all phenomena are periodic, or deterministic. Like the digits of
     * an irrational number, or the {@link rand} pattern.
     */
    export type Cycle = number | IFraction;

    /** A duration in time; an arc of time. */
    export class TimeSpan {
        constructor(begin: Cycle, end: Cycle);
    }

    /**
     * Concatenate the patterns, one each per cycle.
     *
     * Concatenate the given patterns to form a new {@link Pattern} that cycles
     * through the given patterns one by one, with each pattern taking one
     * cycle.
     *
     * Constrast with {@link seq}, where all the patterns are squished into a
     * single cycle.
     *
     * @synonyms {@link slowcat}
     */
    export const cat: PatternTransform;
    /** @see {@link cat} */
    export const slowcat: PatternTransform;

    /**
     * Sequence the patterns subdividing a cycle equally between them.
     *
     * Sequence the given patterns to form a new {@link Pattern} that cycles
     * through the given patterns one by one, such that going through the
     * sequence of all of them together still takes one cycle.
     *
     * Contrast with {@link cat}, where each of the patterns individually takes
     * a single cycle.
     *
     * > A sequence is equivalent to writing an array of patterns. i.e. both
     *  `[1, 2]` and `sequence(1, 2)` describe the same phenomena.
     *
     * @synonyms {@link fastcat}, {@link seq}
     */
    export const sequence: PatternTransform;
    /** @see {@link sequence} */
    export const fastcat: PatternTransform;
    /** @see {@link sequence} */
    export const seq: PatternTransform;

    /**
     * Concatenate patterns whilst specifying the number of cycles they should
     * take (of the whole).
     *
     * e.g. `timeCat([1, "a"], [3, "b"])` is `abbb`, and is equivalent to `"a@1
     * b@3"` in mini notation.
     */
    export const timeCat: PatternTransform;

    /**
     * Play two patterns in parallel
     *
     * They'll both take the same length.
     */
    export const stack: PatternTransform;

    /**
     * An Event
     *
     * Event is (practically) a reserved word is JS, so this is instead called
     * Hap. {@link Pattern}s produce events. Renderers like WebAudio query
     * patterns to obtain upcoming events and make sound.
     *
     * Events have 2 attached TimeSpans - a "whole" and a "part":
     *
     * - The "whole" is the timespan of the event.
     *
     * - The "part" is the timespan that is active. The part will be always
     *   contained within the whole.
     *
     * If the part is smaller than the whole, then it is a fragment. e.g. this
     * can happen if we query for part of a cycle.
     *
     * This separation is needed to get the triggering to work – if the onset is
     * missing (i.e. if the part starts later than the whole), then that event
     * won't trigger a sound.
     *
     * Events that come from continuous {@link signal}s don't have `whole`s.
     */
    export class Hap<T> {
        /**
         * Arbitrary data attached to the event.
         *
         * The Renderer will interpret this. e.g. this could be a note frequency
         * if we're trying to render audio.
         */
        value: T;

        /** A string representation of the event, intended for debugging. */
        show: () => string;
    }

    /**
     * Following are some V* ("pattern value") type aliases that serve as
     * documentation of the type / range of inputs driving a pattern.
     */

    /** A value in the range 20-20k Hz */
    export type Frequency = number;
    /** A "unipolar" value - [0, 1] */
    export type Level = number;
    /** A "bipolar" value - [-1, 1] */
    export type BipolarLevel = number;
    /** A time duration in Seconds */
    export type TSecond = number;

    /**
     * The best
     */
    export const silence: Pattern;

    /**
     * Continuous patterns are referred to as signals.
     *
     * These do not have any associated `whole`s; they're sampled at the
     * midpoint of their `part`s.
     *
     * This method is a used to construct signals by returning its value at the
     * midpoint of each cycle.
     *
     * @param f The function that is called at the midpoint of each cycle. It is
     * passed the midpoint `t`.
     *
     * @see {@link segment} to convert a continuous signal into a discrete
     * sequence of values by sampling it a given number of times.
     */
    export const signal = (f: (t: number) => Patternable) => Patternable;

    /**
     * A random number signal [0, 1)
     *
     * @see {@link rand2} - A Bipolar version of this
     */
    export const rand: Pattern;
    /**
     * A random number signal [-1, 1)
     *
     * @see {@link rand} - A unipolar version of this
     */
    export const rand2: Pattern;

    /** A sawtooth signal [0, 1] */
    export const saw: Pattern;
    /** Inverse {@link saw} that starts at 1 and goes to 0 */
    export const isaw: Pattern;
    /** A sine signal [0, 1] */
    export const sine: Pattern;
    /** A cosine signal [0, 1] */
    export const cosine: Pattern;
    /** A square signal [0, 1] */
    export const square: Pattern;
    /** A square signal [0, 1] */
    export const tri: Pattern;

    /**
     * Perlin (smooth) noise [0, 1]
     *
     * Perlin noise is a more "organic" feeling randomness. While the
     * distribution is still pseudorandom, it has the property that samples
     * change gradually instead of jumping all over the place. As a result, the
     * resultant output is much more "natural" looking.
     *
     * Consider a 2D noise. If we were to plot uniform randomness, the generated
     * image will look like TV static. Whilst with Perlin noise, it'll look more
     * amorphous and blobby, with smooth gradients between peaks etc.
     *
     * Nesting perlin noise within perlin noise results in more fractal, even
     * more natural, output.
     */
    export const perlin: Pattern;

    /**
     * A signal whose value is current cycle number (since we started playback).
     *
     * More specifically, it is a {@link IFraction} value indicating the midpoint
     * of each cycle, as this signal gets evaluated.
     *
     * e.g. `time.inspect()` would show
     *
     *     [ 0/1 → 1/1 | {"s":1,"n":1,"d":2} ]
     *     [ 1/1 → 2/1 | {"s":1,"n":3,"d":2} ]
     *
     * Here `{"s":1,"n":1,"d":2}` is what we get when we try to print out the
     * {@link IFraction} "1/2".
     */
    export const time: Pattern;

    /**
     * The controls object defines various control parameters.
     *
     * Control parameters are functions that modify patterns to attach various
     * bits of "control" information to each event generated by the pattern. For
     * example, the "cutoff" control parameter attaches a "cutoff" key-value
     * pair to each event's value.
     *
     *     original pattern => control parameter =>  modified pattern
     *         event                cutoff                event
     *       value {...}              42          value {..., cutoff: 42 }
     *
     * It is up to the renderer to interpret this attached bit of state. e.g. in
     * case of cutoff, if the pattern ultimately gets delivered to a WebAudio
     * synth, then the presence of the "cutoff" in the event's value would
     * inform the synth to set the frequency of the filter accordingly.
     *
     * The value of the control parameter itself can be a pattern. This way, we
     * can have the value attached by the control parameter change with time.
     * Such recursive patterning is not a special case but the primary effector
     * offered by TidalCycles (and Strudel).
     *
     * The built-in control parameters are surfaced in two ways:
     *
     * 1. As functions in the `controls` object
     *
     * 2. As functions on pattern objects
     *
     * Typically, the controls object is destructured to get at the special
     * control parameter "note" (the first way), whilst the rest of the control
     * parameters are expressed as chain notation (the second way).
     *
     *     const { note } = controls;
     *     note("f").cutoff(sequence(500, 900))
     *
     * > d.ts note: this is more of an interface than an abstract class.
     * > However, tsc doesn't seem to infer that all methods in Controls would
     * > also be part of Pattern if we make this an interface.
     */
    export abstract class Controls {
        /**
         * Set the synth or sample to use.
         *
         * Synth can be specified as one of the enum values in {@link Synth}.
         *
         * Otherwise it is taken to be the name of a {@link SampleName} (with
         * optional ":n:gain" suffixes when using mini-notation).
         *
         * @default `"triangle"`
         */
        s: PatternTransform<Synth | SampleSpecifier>;

        /**
         * Convert the pattern elements into musical notes.
         *
         * Notes can be specified as strings (e.g. "a#6") or MIDI numbers. "a4"
         * is MIDI 69.
         *
         * Note that c is the "first note" so to say, and b / e don't have
         * sharps, so it goes
         *
         *     a -> a# -> b -> c<next-octave> -> c# -> d -> d# -> e -> f -> f# -> g -> g# -> ...
         */
        note: PatternTransform;

        /**
         * Binary arithmentic operations for pattern streams.
         *
         * If the arguments are notes (e.g `note("a5").add(note(4)))`, this has
         * the effect of increasing pitch by adding semitones.
         */
        add: PatternTransform;
        sub: PatternTransform;
        mul: PatternTransform;
        div: PatternTransform;

        /**
         * Silence the pattern
         *
         * Useful during live coding.
         */
        hush: PatternTransform;

        /**
         * Speed up the pattern by repeating it `n` times.
         *
         * Inverse of {@link slow}.
         *
         * e.g. `"a b".fast(7.5).slow(7.5)` is equivalent to `"a b"`.
         */
        fast: PatternTransform<number>;

        /**
         * Slow down the pattern
         *
         * Useful for spreading signals over multiple cycles.
         */
        slow: PatternTransform<number>;

        /**
         * Equivalent to `slow(n).f().fast(n)`
         *
         * Perform an operation inside a cycle.
         *
         * @param n Chunk factor
         * @param f The function / operation to apply.
         */
        inside: PatternTransform;

        /**
         * Equivalent to `fast(n).f().slow(n)`
         *
         * Perform an operation outside a cycle.
         *
         * @param n Chunk factor
         * @param f The function / operation to apply.
         */
        outside: PatternTransform;

        /**
         * Repeat each event the given number of times
         */
        ply: PatternTransform<number>;

        /**
         * Squeeze cycles from the pattern on the right (the argument) into the
         * events on the left (the pattern on which `squeeze` is called).
         *
         * e.g.
         * - `x`.squeeze(`a b`) results in "a b".
         * - `x@3 x`.squeeze(`a b`) results in "a@3 b@3 a b"
         */
        squeeze: PatternTransform;

        /**
         * Mute the (left) pattern when the control (right) pattern is 0 or "~"
         */
        mask: PatternTransform;

        /**
         * Reverse a pattern
         */
        rev: PatternTransform<void>;

        /**
         * Play a pattern backwards, then forwards, and repeat this
         * ping-ponging.
         *
         * Note that `"a b".palindrome()` produces `"ba|ab|ba|ab", i.e. the
         * reverse is played first, then the forward and then so on. This might
         * be a bit unexpected, and can be fixed by putting a {@link rev} before
         * calling palindrome.
         */
        palindrome: PatternTransform<void>;

        /**
         * Loop the pattern starting a position `m` for `n` cycles.
         *
         * e.g. `p.ribbon(3, 100)` will loop the pattern `p`'s contents starting
         * at cycle 3 for 100 cycles.
         */
        ribbon: PatternTransform;

        /**
         * Superimpose a copy of the pattern after applying `f`
         *
         * @param f The {@link PatternTransform} function to apply on the
         * pattern to create the new superimposed one.
         */
        superimpose: PatternTransform;

        /**
         * Like superimpose, but offset the copy first
         *
         * This might work be not the way you expect if the offset is more than
         * 1 cycle.
         *
         * @param n The number of cycles to offset
         * @param f The {@link PatternTransform}
         */
        off: PatternTransform;

        /**
         * Superimpose and offset multiple copies of the pattern.
         *
         * @param times The number of times to echo
         * @param d The time (in cycles) between each echo
         * @param fb The level multiplier of each echo
         */
        echo: PatternTransform;

        /**
         * Sample a continuous pattern n times per cycle, turning it into a
         * discrete one.
         *
         * @param n The number of samples to take per cycle
         */
        segment: PatternTransform<number>;

        /**
         * Playback level, exponential.
         *
         * While usually this is between [0, 1], this can be an arbitrary
         * multiplier outside this range too.
         *
         * Note that gains cannot be chained – the last one wins. So if you wish
         * to tweak the gain after setting the base level, use {@link velocity}
         * which acts the (linear) multiplier for the gain.
         */
        gain: PatternTransform<Level>;

        /**
         * Playback level, linear [0 1].
         *
         * It is multiplied with the gain.
         *
         * Note that unlike gains, velocity can be be chained, each will
         * multiply the previous value (apparently the behaviour is different
         * because velocity is a pattern modifier, while gain is a control
         * parameter: so for gain, the last value wins, whilst for velocity
         * there is explicit `(existingVelocity || 1) * newVelocity` handling.
         */
        velocity: PatternTransform<Level>;

        /**
         * Attack time in seconds of the amplitude ADSR envelope.
         */
        attack: PatternTransform<TSecond>;

        /**
         * Decay time in seconds of amplitude ADSR envelope.
         *
         * Only has an effect is sustain is less than 1.
         */
        decay: PatternTransform<TSecond>;

        /**
         * Sustain level [0, 1] of the amplitude ADSR envelope.
         */
        sustain: PatternTransform<Level>;

        /**
         * Release time in seconds of the amplitude ADSR envelope.
         */
        release: PatternTransform<TSecond>;

        /**
         * Waveshaping distortion level [0, 1]
         *
         * Be careful with large values, might get loud.
         */
        shape: PatternTransform<Level>;

        /**
         * Detune the oscillator
         *
         * - Only supported by SuperDirt synths.
         */
        detune: PatternTransform<Level>;

        /**
         * Low-pass filter cutoff frequency, and an optional ":resonance"
         */
        cutoff: PatternTransform<Frequency>;
        /**
         * Resonance for the low-pass filter [0, 50]
         *
         * @default 1
         */
        resonance: PatternTransform<number>;

        /**
         * High-pass filter cutoff frequency, and an optional ":hresonance"
         */
        hcutoff: PatternTransform<Frequency>;
        /**
         * Resonance for the high-pass filter [0, 50]
         */
        hresonance: PatternTransform<number>;

        /**
         * Band-pass filter center frequency, and an optional ":bandq"
         */
        bandf: PatternTransform<Frequency>;
        /**
         * Resonance for the band-pass filter
         */
        bandq: PatternTransform<number>;

        /**
         * Formant filter frequency.
         *
         * Can be one of the vowels - "a", "e", "i", "o", "u", or patterns
         * thereof.
         */
        vowel: PatternTransform;

        /**
         * Delay level, and optional ":delaytime:delayfeedback"
         */
        delay: PatternTransform<Level>;

        /**
         * Delay time, in seconds
         *
         * Currently Strudel supports only a maxDelayTime of 1 second. This is
         * not an inherent WebAudio limitation, rather just things are not
         * currently wired up to support times more than 1.
         */
        delaytime: PatternTransform<TSecond>;

        /** Delay feedback level */
        delayfeedback: PatternTransform<Level>;

        /**
         * Reverb level, and optional ":roomsize".
         *
         * roomsize is between 0 and 10.
         */
        room: PatternTransform<Level>;

        /**
         * Convert a unipolar pattern [0, 1] into a bipolar one [-1, 1].
         */
        toBipolar: PatternTransform;

        /**
         * Scale up a unipolar pattern [0, 1] into the given [m, n] range.
         *
         * @param m Lower bound
         * @param n Upper bound
         */
        range: PatternTransform;
        /**
         * Exponential {@link range}.
         *
         * Note: Don't pass 0 or negative values to this method.
         */
        rangex: PatternTransform;

        /*****         Pattern functions registered by us            *****/
        /*                                                               */
        /*    These are not part of the standard Strudel distribution    */
        /*                                                               */

        /**
         * Print a debug representation of the pattern onto the console
         *
         * @param n is the number of cycles to print.
         */
        inspect: PatternTransform<number>;
    }

    export const controls: Controls;

    /**
     * Supported built-in synths that can be passed to {@link s}
     *
     * These are DSP generated (as opposed to playing a sample).
     *
     * These need to be registered before they can be used. {@see SynthSound}.
     */
    type Synth = SynthSound;

    /**
     * The primitive synth types supported by Strudel.
     *
     * To use these we need to call {@link registerSynthSounds} once beforehand.
     */
    const SynthSound = SynthSoundWaveform | SynthSoundNoise;

    /**
     * The primitive "oscillators"-type synths supported by Strudel.

     * These are the same as the `OscillatorType` supported by WebAudio's
     * {@link AudioContext.createOscillator} method (except "custom").
     */
    const SynthSoundWaveform = "sine" | "square" | "triangle" | "sawtooth";

    /**
     * The primitive noise types supported by Strudel.
     */
    const SynthSoundNoise = "pink" | "white" | "brown" | "crackle";

    /**
     * A sample can be specified as name (e.g. when passing it as an argument to
     * {@link s}).
     *
     * In the mini notation, optionally an ":n" can be specified to choose a
     * particular variation of the sample. Further, ":gain" can be specified to
     * set the sample's gain.
     *
     * @example "bd:0", "bd:1:1.4"
     */
    type SampleSpecifier = string;

    /**
     * Start a loop, connecting {@link Pattern} to some output.
     *
     * @see {@link webaudioOutput} and {@link getAudioContext}
     */
    export const repl = ({ defaultOutput: StrudelOutput, getTime: any }) => ({
        scheduler: Scheduler,
    });

    type StrudelOutput = any;

    export interface Scheduler {
        setPattern: (Pattern) => void;
        start: () => void;
        stop: () => void;
        pause: () => void;
    }

    /**
     * Register a new pattern function.
     *
     * This method then becomes available on the {@link Pattern} class (the last
     * argument will be the pattern instance on which this method is called).
     *
     * A function suitable for use as a global {@link PatternTransform} is also
     * returned.
     */
    export const register = (
        name: string,
        f: (...args: Pattern[]) => Patternable,
    ) => PatternTransform;

    /**
     * Below are repeated, duplicate, definitions of operations copy pasted from
     * above.
     *
     * These are useful when needing the standalone version. For documentation,
     * see the corresponding method inside {@link Controls}.
     */
    export const add: PatternTransform;
    export const mask: PatternTransform;
}

declare module "@strudel/webaudio" {
    import type { StrudelOutput } from "@strudel/core";

    /**
     * Initialize WebAudio on first user initiated interaction.
     *
     * Trying to use audio otherwise makes the browser unhappy, and it'll refuse
     * to play any sounds.
     */
    export const initAudioOnFirstClick: () => void;

    /**
     * Pass this to the core's {@link repl} to get it to render patterns using
     * [WebAudio](https://www.w3.org/TR/webaudio/).
     *
     * > We probably don't need to care about the internals yet, so this is
     *   effectively untyped, we just are saying that this exists.
     */
    export const webaudioOutput: StrudelOutput;

    /**
     * Pass this to the core's {@link repl} to get it to pick the current time
     * from the WebAudio's AudioContext.
     *
     * > We probably don't need to care about the internals yet, so this is
     *   untyped, we just are saying that this exists.
     */
    export const getAudioContext: () => {
        currentTime: any;
    };

    /**
     * Call this on startup to register support for the built-in {@link Synth}s.
     *
     * In particular, this enables us to use {@link StrudelSynth} values as the
     * {@link s} parameter.
     */
    export const registerSynthSounds: () => void;

    /**
     * A direct reference to the underlying "superdough" audio engine.
     *
     * The webaudio package for Strudel is a thin-binding over the superdough
     * package, which is also published independently of Strudel.
     *
     * This function forms the heart of superdough. We give it a rendered event,
     * the time after which the event should be played, and the duration for
     * which to play that event. It then generates audio for us.
     *
     * This function is what ultimately gets called when we use Strudel's
     * pattern functions. The various pattern chains we build are queried to get
     * the next set of events, and these events are then rendered down to
     * JavaScript objects with a known set of key-value pairs that superdough
     * knows how to interpret. For example,
     *
     *       superdough({ note: 'g1', s: 'sawtooth', cutoff: 600 }, 0.1, 0.5)
     *
     * The benefit of directly accessing superdough is that it gives us the
     * ability to trigger on-off sounds. Also, since it doesn't involve the
     * learning the concepts behind patterns/events etc, this is simpler to use
     * when the intent is to make a specific sound and not generate a
     * time-varying soundscape of them. We can use it just a function that we
     * pass key value pairs describing the sound, and the length of the sound.
     * Taken this way, it ends up being a nicer to use API than raw WebAudio.
     *
     * @param value The key value pairs that tell superdough what sound to make.
     * @param after Time (in seconds) after which to play the sound. Pass 0 to
     * trigger the sound immediately.
     * @param duration How long the sound should last, in seconds. This is
     * optional if playing a sample, and required if playing a synth.
     */
    export const superdough: (
        value: SuperdoughValue,
        after: TSecond,
        duration: TSecond,
    ) => void;

    /**
     * Parameters that Superdough uses to decide what to play.
     *
     *  SuperdoughValue really is an arbitrary untyped key-value pair
     *
     *     type SuperdoughValue = Record<string, string | number>
     *
     * because it is passed to the individual synths, and they can expect
     * arbitrary values from in it.
     *
     * However, the set of synths is fixed, so here we try to make it explicitly
     * typed by adding annotations for the keys that we use. Just keep in mind
     * that there are more, potentially.
     *
     * Most (all?) of these have equivalent control functions / methods. e.g.
     * the value `s` below is the same value that gets passed to the {@link s}
     * method of the {@link Controls} class in `@strudel/core`.
     */
    interface SuperdoughValue {
        /**
         * The synth, or sample, to play
         *
         * @default `"triangle"`
         */
        s: Synth | SampleSpecifier;

        /**
         * Overall gain (last one wins).
         *
         * @default 0.8
         */
        gain: Level;
        /**
         * Velocity of the note (A linear multiplier for the gain).
         *
         * @default 1.
         */
        velocity: Level;

        /**** Amplitude ADSR envelope ****/

        /**
         * Attack time in seconds of the amplitude ADSR envelope.
         *
         * The amplitude ADSR envelope is linear.
         *
         * @default 0.001 (1 ms)
         */
        attack: TSecond;

        /**
         * Decay time in seconds of amplitude ADSR envelope.
         *
         * Only has an effect is sustain is less than 1.
         *
         * @default 0.05 (50 ms)
         */
        decay: TSecond;

        /**
         * Sustain level [0, 1] of the amplitude ADSR envelope.
         *
         * Note that the overall envelope is further impacted by gain (and
         * Strudel has its own internal attentuation it performs too).
         *
         * @default 0.6
         */
        sustain: Level;

        /**
         * Release time in seconds of the amplitude ADSR envelope.
         *
         * @default 0.01 (10 ms)
         */
        release: TSecond;

        /**
         * Noise density.
         *
         * Only applicable if {@link s} is one of {@link SynthSoundNoise}.
         */
        density: number;

        /**** LPF (Low pass filter) ****/

        /** LPF cutoff */
        cutoff: Frequency;

        /**
         * LPF resonance
         *
         * @default 1
         */
        resonance: number;

        /**
         * The depth of the filter modulation by its envelope.
         *
         * If non-zero, then an exponential ADSR envelope (specified by the
         * various lp* values below) is applied to the cutoff value of the
         * filter. By increasing this depth, we get more modulation of the
         * filter.
         */
        lpenv: number;

        /**
         * Attack time in seconds of the LPF ADSR envelope.
         *
         * @default 0.005 (5 ms)
         */
        lpattack: TSecond;

        /**
         * Decay time in seconds of LPF ADSR envelope.
         *
         * Only has an effect is sustain is less than 1.
         *
         * @default 0.14 (140 ms)
         */
        lpdecay: TSecond;

        /**
         * Sustain level [0, 1] of the LPF ADSR envelope.
         *
         * @default 0
         */
        lpsustain: Level;

        /**
         * Release time in seconds of the LPF ADSR envelope.
         *
         * @default 0.1 (100 ms)
         */
        lprelease: TSecond;

        /**
         * Waveshaping distortion level [0, 1]
         *
         * Be careful with large values, might get loud.
         */
        shape: Level;

        /**** Delay ****/

        /** Delay level */
        delay: Level;

        /**
         * Delay feedback level
         *
         * This sets how much of the signal is fed back into the delay.
         *
         * @default 0.5 (applicable when {@link delay} is non-zero)
         */
        delayfeedback: PatternTransform<Level>;

        /**
         * Delay time, in seconds
         *
         * @default 0.25 (applicable when {@link delay} is non-zero)
         */
        delaytime: TSecond;

        /**** Reverb ****/

        /** Reverb level */
        room: Level;
        /** Reverb roomsize (between 0 and 10) */
        roomsize: number;
    }
}

declare module "@strudel/mini" {
    // As of v3.2.2, the Prettier plugin to organize imports is removing this
    // line (incorrectly?). So disable the plugin for this file (can't be done
    // on a line-basis).
    // See: https://github.com/simonhaenisch/prettier-plugin-organize-imports
    //
    // organize-imports-ignore
    import { Patternable } from "@strudel/core";

    /**
     * Parse a string specified in the "mini" notation into a Strudel pattern.
     *
     * The "mini" notation is a subset of the OG Tidal notation. In particular,
     * it makes it easier to specify notes. e.g. `c <a ~ ~ [f e]>` instead of
     * `sequence("c", cat("a", silence, silence, sequence("f", "e"))`.
     *
     * Multiple strings can be passed, and each will be individually converted
     * into patterns.
     *
     * For more mini-notation syntax, see:
     * https://strudel.cc/learn/mini-notation/
     */
    export const mini = (...strings) => Patternable;
}
