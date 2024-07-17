/**
 * Parse an array obtained from GraphQL.
 *
 * The typed arrays we obtain from Gatsby's GraphQL layer have a type that has
 * undefined both for the array itself, and its individual elements. This
 * function discard the undefined values in the array, and replace an undefined
 * array with an empty array, to result in a value of a type that is more
 * convenient to work with.
 */
export const filterDefined = <T>(xs?: readonly (T | undefined)[]): T[] =>
    xs?.filter((t): t is Exclude<typeof t, undefined> => t !== undefined) ?? [];

/**
 * Return all the unique values in the array.
 *
 * This converts the array into a set, and back again.
 */
export const unique = <T>(xs: Array<T>): Array<T> => [...new Set(xs)];
