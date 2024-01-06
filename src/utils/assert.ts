/** An arbitrary assertion that Typescript can use in its code flow analysis */
export const assert = (condition: unknown): asserts condition => {
    if (!condition) {
        // Could do with a better message, but don't want to make it more
        // onerous for the callers too.
        throw new Error(`Assertion failed: ${condition}`);
    }
};
