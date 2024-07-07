/** Zero pad the given number to 2 digits. */
export const zeroPad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
