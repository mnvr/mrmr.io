/**
 * Capitalize a string by making its first letter uppercased.
 *
 * Naive implementation that only works with strings of Latin characters, and
 * won't work with arbitrary Unicode strings.
 */
export const capitalize = (s: string) => {
    return s.slice(0, 1).toUpperCase() + s.slice(1);
};

/** Zero pad the given number to 2 digits. */
export const zeroPad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
