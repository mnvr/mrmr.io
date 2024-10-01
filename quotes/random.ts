/**
 * Return a random integer between [0, n)
 *
 * That is, the minimum 0 is inclusive and the maximum n is exclusive. This
 * structure is useful for, for example, indexing into an random index in an
 * array by specifying its length.
 *
 * Throws an error if n is zero.
 *
 * Not cryptographically secure.
 */
export const randomInt = (n: number) => {
  if (n === 0)
    throw new Error("Cannot generate a random number between [0, 0)");
  return Math.floor(Math.random() * n);
};

/**
 * Return a random item from an array.
 *
 * Return undefined if the array is empty.
 *
 * Not cryptographically secure.
 */
export const randomItem = <T>(xs: readonly T[]) => {
  const n = xs.length;
  return n == 0 ? undefined : xs[randomInt(n)];
};
