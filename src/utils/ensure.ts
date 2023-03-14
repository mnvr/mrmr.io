/** Throw if the given value is null or undefined */
export const ensure = <T>(x: T | null | undefined): T => {
    if (x === undefined || x == null) {
        throw new Error(`Required value is missing`);
    }
    return x;
};
