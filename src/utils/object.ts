/**
 * Return the value for the only key in the given object
 *
 * If the object has 1 and only 1 key, return the value associated with it.
 * Otherwise (both if the object is empty, or has more than 1 key), return
 * undefined.
 */
export const onlyValue = <T>(o: Record<string, T>) => {
    const keys = Object.keys(o);
    const onlyKey = keys.length === 1 ? keys[0] : undefined;
    return onlyKey ? o[onlyKey] : undefined;
};

/**
 * A type guard to verify that some arbitrary object has a value with the given
 * key.
 */
export const hasKey = <T extends string | number | symbol>(
    obj: unknown,
    key: string,
): obj is { [key in T]: unknown } => {
    if (!obj) return false;
    if (typeof obj !== "object") return false;
    return key in obj;
};
