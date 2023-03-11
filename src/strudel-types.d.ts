declare module "@strudel.cycles/core" {
    /**
     * Patterns are the core abstraction of Tidal(Cycles).
     *
     * A Pattern is something that can be queried to ask it which Events (aka
     * {@link Hap}s) occur during a given Timespan. {@link Timespan}s are spans
     * of cycles. By convention, 1 cycle maps to 1 second of simulated time.
     */
    export class Pattern {}

    /**
     * A pattern, or something which can be converted into a pattern.
     */
    export type Patternable = Pattern | string;

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
    export const cat: (...pats: Patternable[]) => Pattern;
    /** @see {@link cat} */
    export const slowcat: (...pats: Patternable[]) => Pattern;

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
     * @synonyms {@link fastcat}, {@link seq}
     */
    export const sequence: (...pats: Patternable[]) => Pattern;
    /** @see {@link sequence} */
    export const fastcat: (...pats: Patternable[]) => Pattern;
    /** @see {@link sequence} */
    export const seq: (...pats: Patternable[]) => Pattern;
}
