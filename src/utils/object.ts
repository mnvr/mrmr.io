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
