/**
 * A type guard that returns false for `undefined` values.
 *
 * This is useful e.g. for removing undefined values from an array:
 *
 *     xs?.filter(isDefined)
 */
export const isDefined = <T>(x: T | undefined): x is T => {
    return x !== undefined;
};
