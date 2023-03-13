/// Remove `undefined` values from an array
export const removeUndefineds = <T>(xs: readonly (T | undefined)[]): T[] => {
    return xs.filter(isNotUndefined);
};

/// A type guard to let the compiler know the type impact of the filter
const isNotUndefined = <T>(x: T | undefined): x is T => {
    return x !== undefined;
};
