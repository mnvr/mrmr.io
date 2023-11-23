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

/**
 * Return all the unique values in the array.
 *
 * This converts the array into a set, and back again.
 */
export const unique = <T>(xs: Array<T>): Array<T> => [...new Set(xs)];
