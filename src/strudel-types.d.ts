declare module "@strudel.cycles/core" {
    /**
     * Patterns are the core abstraction of Tidal(Cycles).
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
     */
    export class Pattern extends Controls {
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
     * {@link sequence}-d to produce a single Pattern. This is the Pattern that
     * this function then acts on to produce the output pattern
     */
    export type PatternTransform<T = number> = (
        ...pats: Patternable<T>[]
    ) => Pattern;

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
    export type Cycle = number;

    /** A duration in time */
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
     * Following are some PV* type aliases that serve as documentation of the
     * type / range of inputs driving a pattern.
     */

    /** A value in the range 20-20k Hz */
    export type PVFrequency = number;
    /** A "unipolar" value - [0, 1] */
    export type PVLevel = number;
    /** A "bipolar" value - [-1, 1] */
    export type PVLevel2 = number;
    /** A time duration in Seconds */
    export type PVSeconds = number;

    /**
     * A new continuous pattern of random numbers [0, 1)
     *
     * > Continuous patterns are also referred to as signals.
     *
     * @see {@link rand2} - a bipolar version of this
     */
    export const rand: Pattern;
    /**
     * A new continuous pattern of random numbers [-1, 1)
     *
     * @see {@link rand} - a unipolar version of this
     */
    export const rand2: Pattern;

    /** A sawtooth signal [0, 1] */
    export const saw: Pattern;
    /** A sine signal [0, 1] */
    export const sine: Pattern;
    /** A cosine signal [0, 1] */
    export const cosine: Pattern;
    /** A square signal [0, 1] */
    export const square: Pattern;
    /** A square signal [0, 1] */
    export const tri: Pattern;

    /**
     * Perlin noise [0, 1]
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
     * A signal whose value is current cycle number (since we started playback)
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
     *     original pattern => control parameter x => modified pattern
     *         event                cutoff                event
     *       value {...}              42           value {..., foo: 42 }
     *
     * It is up to the renderer to interpret this attached bit of state. e.g. in
     * case of cutoff, if the pattern ultimately gets chained to a WebAudio
     * synth, then the presence of the "cutoff" in the event's value would
     * inform the synth to set the frequency of the filter accordingly.
     *
     * The value of the control parameter itself can be a pattern to have the
     * value attached by the control parameter change with time. Indeed, it is
     * patterns all the way down.
     *
     * The built-in control parameters are surfaced in two ways:
     * - As functions in the `controls` object
     * - As functions on pattern objects
     *
     * Typically, the cutoff object is destructured to get at the special
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
         * Add the given number to each item in the pattern.
         *
         * When used with vanilla notes, this has the effect of increasing pitch
         * by adding semitones.
         */
        add: PatternTransform;
        /** Modify pitch by subtracting semitones (usually, @see {@link add}) */
        sub: PatternTransform;

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
         * Loop the pattern starting a position `m` for `n` cycles.
         *
         * e.g. `p.ribbon(3, 100)` will loop the pattern `p`'s contents starting
         * at cycle 3 for 100 cycles.
         */
        ribbon: PatternTransform;

        /**
         * Silence the pattern
         *
         * Useful during live coding.
         */
        hush: PatternTransform;

        /**
         * Slow down the pattern
         *
         * Useful for spreading signals over multiple cycles.
         */
        slow: PatternTransform<Number>;

        /**
         * Sample a continuous pattern n times per cycle, turning it into a
         * discrete one.
         *
         * @param n The number of samples to take per cycle
         */
        segment: PatternTransform<Number>;

        /**
         * Set the synth or sample to use
         *
         * Synth can be specified as one of the enum values in
         * {@link SynthType}.
         *
         * Otherwise it is taken to be the name of a {@link Sample} (with
         * optional ":n:gain" suffixes when using mini-notation).
         *
         * - @default `triangle`.
         */
        s: PatternTransform<SynthType | SampleSpecifier>;

        /**
         * Playback level, exponential.
         *
         * While usually this is between [0, 1], this can be an arbitrary
         * multiplier outside this range too.
         */
        gain: PatternTransform<PVLevel>;

        /**
         * Attack time in seconds of the amplitude ADSR envelope.
         */
        attack: PatternTransform<PVSeconds>;
        /**
         * Decay time in seconds of amplitude ADSR envelope.
         *
         * Only has an effect is sustain is less than 1.
         */
        decay: PatternTransform<PVSeconds>;
        /**
         * Sustain level [0, 1] of the amplitude ADSR envelope.
         */
        sustain: PatternTransform<PVLevel>;
        /**
         * Release time in seconds of the amplitude ADSR envelope.
         */
        release: PatternTransform<PVSeconds>;

        /**
         * Detune the oscillator
         *
         * - Only supported by SuperDirt synths.
         */
        detune: PatternTransform<PVLevel>;

        /**
         * Low-pass filter cutoff frequency, and an optional ":resonance"
         */
        cutoff: PatternTransform<PVFrequency>;
        /**
         * Resonance for the low-pass filter [0, 50]
         *
         * @default 1
         */
        resonance: PatternTransform<Number>;

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
        delay: PatternTransform<PVLevel>;
        /** Delay time, in seconds */
        delaytime: PatternTransform<PVSeconds>;
        /** Delay feedback level */
        delayfeedback: PatternTransform<PVLevel>;

        /**
         * Reverb level, and optional ":roomsize".
         *
         * roomsize is between 0 and 10.
         */
        room: PatternTransform<PVLevel>;

        /**
         * Convert a unipolar pattern [0, 1] into a bipolar one [-1, 1].
         */
        toBipolar: PatternTransform;

        /**
         * Scale up a unipolar pattern [0, 1] into the given [m, n] range.
         */
        range: PatternTransform;
    }

    export const controls: Controls;

    /**
     * Supported synth types that can be passed to {@link s}
     *
     * Currently, these are the same as the `OscillatorType` supported by
     * WebAudio's {@link AudioContext.createOscillator} method (except the type
     * "custom", which is not supported yet).
     */
    type SynthType = "sawtooth" | "sine" | "square" | "triangle";

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
}

declare module "@strudel.cycles/webaudio" {
    import type { StrudelOutput } from "@strudel.cycles/core";

    /**
     * Initialize WebAudio on first user initiated interaction.
     *
     * Trying to use audio otherwise makes the browser unhappy.
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
}

declare module "@strudel.cycles/mini" {
    // As of v3.2.2, the Prettier plugin to organize imports is removing this
    // line (incorrectly?). So disable the plugin for this file (can't be done
    // on a line-basis).
    // See: https://github.com/simonhaenisch/prettier-plugin-organize-imports
    //
    // organize-imports-ignore
    import { Patternable } from "@strudel.cycles/core";

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
     * https://strudel.tidalcycles.org/learn/mini-notation
     */
    export const mini = (...strings) => Patternable;
}
