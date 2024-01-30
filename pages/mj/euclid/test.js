/**
 * An implementation of Bjorklund's algorithm for calculating the Euclidean
 * rhythms, as described in the 2005 (extended) paper _The Euclidean //
 * Algorithm Generates Traditional Musical Rhythms_ by Godfried Toussaint.
 *
 * This is a standalone JavaScript program  meant as a test bed for our
 * algorithm.  It is in JavaScript so that it can directly be invoked without
 * needing transpilation:
 *
 *     node pages/mj/euclid/test.js
 *
 * It will then generate some Euclidean Rhythms, and compare them against the
 * examples given in Toussaint's paper.
 */

/**
 * Euclidean rhythm E(k, n) where k is the number of 1's and n is the length of
 * the sequence. The property that such sequences have is that the 1's are
 * maximally spaced out (in a fractal sense).
 */
const E = (k, n) => {
    let seqs = Array(n)
        .fill(0)
        .map((_, i) => (i < k ? [1] : [0]));

    // Description of Euclid's algorithm from the paper:
    //
    // > Repeatedly replace the larger of the two numbers by their difference
    //   until both are equal. This then is the GCD.
    //
    // > If the inputs m and k to Euclid's algorithm are equal to the number of
    //   zeros and ones respectively, then Bjorklund's algorithm (with n = m +
    //   k) has the same structure as the Euclidean algorithm. Indeed,
    //   Bjorklund's algorithm uses the repeated subtraction form of division
    //   just as Euclid did in his _Elements_.

    let d = n - k;
    n = Math.max(k, d);
    k = Math.min(k, d);
    let z = d;

    // Description of Bjorklund's algorithm the paper:
    //
    // > If there is more than one zero the algorithm moves zeros in stages. We
    //   begin by taking zeroes one-at-a-time (from right to left), placing a
    //   zero after each one (from left to right).
    //
    // The same stages happen but with the "remainder" right-most sequences
    // after the zeros have been exhausted. Then,
    //
    // > The process stops when the remainder consists of only one sequence, or
    //   we run out of zeros.

    while (z > 0 || k > 1) {
        for (let i = 0; i < k; i++) {
            seqs[i].push(...seqs[seqs.length - 1 - i]);
        }
        seqs = seqs.slice(0, seqs.length - k);
        z = z - k;
        d = n - k;
        n = Math.max(k, d);
        k = Math.min(k, d);
    }

    return seqs.flat();
};

const test = (k, n, expected) => {
    const seq = JSON.stringify(E(k, n));
    const exp = JSON.stringify(expected);
    console.log(`E(${k},${n}) ${seq}`);
    if (seq != exp) {
        console.log(`Expected ${exp}`);
        console.assert(seq == exp, `Expected E(${k}, ${n}) to match ${exp}`);
    }
};

// Regular / periodic / "isochronous" rhythms
test(4, 16, [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]);
test(3, 12, [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]);

// The three main examples from the paper illustrating the algorithm
test(5, 13, [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0]);
test(3, 8, [1, 0, 0, 1, 0, 0, 1, 0]);
test(5, 8, [1, 0, 1, 1, 0, 1, 1, 0]);

test(2, 3, [1, 0, 1]);
test(1, 2, [1, 0]);
test(1, 3, [1, 0, 0]);
// The paper lists [1, 0, 1, 0, 0], and also the rotated variant starting on the
// second onset which our implementation produces.
test(2, 5, [1, 0, 0, 1, 0]);
test(3, 4, [1, 0, 1, 1]);
test(3, 5, [1, 0, 1, 0, 1]);
// The paper lists [1, 0, 1, 0, 1, 0, 0], and the rotated variant starting on
// the third onset which our implementation produces.
test(3, 7, [1, 0, 0, 1, 0, 1, 0]);
test(4, 7, [1, 0, 1, 0, 1, 0, 1]);

test(7, 10, [1, 0, 1, 1, 0, 1, 1, 0, 1, 1]);
test(
    13,
    24,
    [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
);
