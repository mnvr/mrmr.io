/// Remove `undefined` values from an array
export function removeUndefineds<T>(xs: (T | undefined)[]): T[] {
    return xs.filter(isNotUndefined);
}

/// A type guard to let the compiler know the type impact of the filter
function isNotUndefined<T>(x: T | undefined): x is T {
    return x !== undefined;
}
