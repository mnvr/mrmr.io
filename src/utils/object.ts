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
 *
 * @see also {@link hasBooleanKey}, {@link hasArrayKey}.
 */
export const hasKey = <T extends string | number | symbol>(
    obj: unknown,
    key: string,
): obj is { [key in T]: unknown } => {
    if (!obj) return false;
    if (typeof obj !== "object") return false;
    return key in obj;
};

/**
 * Specialization of the {@link hasKey} type guard that additionally verifies
 * that the value corresponding to the key is a boolean.
 */
export const hasBooleanKey = <T extends string | number | symbol>(
    obj: unknown,
    key: string,
): obj is { [key in T]: boolean } => {
    if (!hasKey(obj, key)) return false;
    return typeof obj[key] === "boolean";
};

/**
 * Specialization of the {@link hasKey} type guard that additionally verifies
 * that the value corresponding to the key is an Array.
 * that the value corresponding to the key is an {@link Array}.

 */
export const hasArrayKey = <T extends string | number | symbol>(
    obj: unknown,
    key: string,
): obj is { [key in T]: unknown[] } => {
    if (!hasKey(obj, key)) return false;
    return Array.isArray(obj[key]);
};
