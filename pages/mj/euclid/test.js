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
    const seqs = Array(n)
        .fill(0)
        .map((_, i) => (i < k ? [1] : [0]));

    const debug = true;

    const fold = (n, k, z, seqs) => {
        let result = [...seqs];

        // Description from the paper:
        //
        // > If there is more than one zero the algorithm moves zeros in stages.
        //   We begin by taking zeroes one-at-a-time (from right to left),
        //   placing a zero after each one (from left to right).
        //
        // The same stages happen but with the "remainder" right-most sequences
        // after the zeros have been exhausted. Then,
        //
        // > The process stops when the remainder consists of only one sequence,
        //   or we run out of zeros.
        while (z > 0 || k > 1) {
            const m = z > 0 && k > 1 ? Math.min(z, k) : z > 0 ? z : k;
            for (let i = 0; i < m; i++) {
                result[i] = [...result[i], ...result[result.length - 1 - i]];
            }
            result = result.slice(0, result.length - m);
            if (debug) console.log(`moved ${m}`, { n, k, z, result });
            const r = n - k;
            n = Math.max(k, r);
            k = Math.min(k, r);
            z = z - m;
            if (debug) console.log({ r, n, k, z });
        }

        return result;
    };

    const r = n - k;
    n = Math.max(k, r);
    k = Math.min(k, r);
    return fold(n, k, r, seqs).flat();
};

const test = (k, n, expected) => {
    const seq = JSON.stringify(E(k, n));
    const exp = JSON.stringify(expected);
    console.log(`E(${k},${n})\t${seq}`);
    if (seq != exp) {
        console.log(`Expectd\t${exp}`);
        console.assert(seq == exp, `Expected E(${k}, ${n}) to match ${exp}`);
    }
};

// Expected: [1,0,1,1,0,1,1,0,1,1]
// Out     : [1,0,1,0,1,0,1,1,1,1]
// test(7, 10, [1, 0, 1, 1, 0, 1, 1, 0, 1, 1]);

// ---

// Regular / periodic / "isochronous" rhythms
// test(4, 16, [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]);
// test(3, 12, [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]);

// // The three main examples from the paper illustrating the algorithm
test(5, 13, [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0]);
test(3, 8, [1, 0, 0, 1, 0, 0, 1, 0]);
// test(5, 8, [1, 0, 1, 1, 0, 1, 1, 0]);

// // The paper lists [1, 0, 1], we get a rotated version
// test(2, 3, [1, 1, 0]);
// test(1, 2, [1, 0]);
// test(1, 3, [1, 0, 0]);
// test(2, 5, [1, 0, 1, 0, 0]);
// // The paper lists [1, 0, 1, 1], we get a rotated version
// test(3, 4, [1, 1, 1, 0]);
// test(3, 5, [1, 0, 1, 0, 1]);
// test(3, 7, [1, 0, 1, 0, 1, 0, 0]);
// test(4, 7, [1, 0, 1, 0, 1, 0, 1]);
// test(4, 9, [1, 0, 1, 0, 1, 0, 1, 0, 0]);

// test(
//     13,
//     24,
//     [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
// );
