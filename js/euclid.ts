/**
 * Euclidean rhythm E(k, n) where k is the number of 1's and n is the length of
 * the sequence. The property that such sequences have is that the 1's are
 * maximally spaced out (in a fractal sense).
 *
 * This is an implementation of Bjorklund's algorithm for calculating the
 * Euclidean rhythms, as described in the 2005 (extended) paper _The Euclidean
 * Algorithm Generates Traditional Musical Rhythms_ by Godfried Toussaint.
 *
 * @param {number} k The number of 1's in the sequence.
 * @param {number} n The length of the sequence.
 * @returns number[] A sequence of 1's and 0's with the 1's maximally spaced out
 * using Euclid's algorithm.
 *
 * @see `er.js` for a JavaScript version of this function with examples.
 */
export const E = (k: number, n: number): number[] => {
  let seqs = Array(n)
    .fill(0)
    .map((_, i) => (i < k ? [1] : [0]));

  // Description of Euclid's algorithm from the paper:
  //
  // > Repeatedly replace the larger of the two numbers by their difference
  //   until both are equal. This then is the GCD.
  //
  // > If the inputs m and k to Euclid's algorithm are equal to the number of
  //   zeros and ones respectively, then Bjorklund's algorithm (with n = m + k)
  //   has the same structure as the Euclidean algorithm. Indeed, Bjorklund's
  //   algorithm uses the repeated subtraction form of division just as Euclid
  //   did in his _Elements_.

  let d = n - k;
  n = Math.max(k, d);
  k = Math.min(k, d);
  let z = d;

  // Description of Bjorklund's algorithm the paper:
  //
  // > If there is more than one zero the algorithm moves zeros in stages. We
  //   begin by taking zeroes one-at-a-time (from right to left), placing a zero
  //   after each one (from left to right).
  //
  // The same stages happen but with the "remainder" right-most sequences after
  // the zeros have been exhausted. Then,
  //
  // > The process stops when the remainder consists of only one sequence, or we
  //   run out of zeros.

  while (z > 0 || k > 1) {
    for (let i = 0; i < k; i++) {
      seqs[i]?.push(...(seqs[seqs.length - 1 - i] ?? []));
    }
    seqs = seqs.slice(0, seqs.length - k);
    z = z - k;
    d = n - k;
    n = Math.max(k, d);
    k = Math.min(k, d);
  }

  return seqs.flat();
};
