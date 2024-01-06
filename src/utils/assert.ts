/**
 * An arbitrary assertion that Typescript can use in its code flow analysis
 *
 * Note that this cannot be an arrow function, it needs to be a regular
 * function, otherwise we get the error "Assertions require every name in the
 * call target to be declared with an explicit type annotation". See
 * https://github.com/microsoft/TypeScript/issues/34523
 */
export function assert(condition: unknown): asserts condition {
    if (!condition) {
        // Could do with a better message, but don't want to make it more
        // onerous for the callers too.
        throw new Error(`Assertion failed: ${condition}`);
    }
}
