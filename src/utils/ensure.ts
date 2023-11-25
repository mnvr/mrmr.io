/** Throw if the given value is null or undefined */
export const ensure = <T>(x: T | null | undefined): T => {
    if (x === undefined || x == null) {
        throw new Error(`Required value is missing`);
    }
    return x;
};

/** Throw if the given value is not a number */
export const ensureNumber = (x: any): number => {
    if (typeof x !== "number") {
        throw new Error(
            `Expected a number, but instead got a ${typeof x}: ${x}`,
        );
    }
    return x;
};

/** Throw if the given value is not a string */
export const ensureString = (x: any): string => {
    if (typeof x !== "string") {
        throw new Error(
            `Expected a string, but instead got a ${typeof x}: ${x}`,
        );
    }
    return x;
};
