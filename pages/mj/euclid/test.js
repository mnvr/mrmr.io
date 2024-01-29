/**
 * A JavaScript CLI program to generate Euclidean Rhythms
 *
 * This is meant as a test bed for our algorithm. It is in JavaScript so that it
 * can directly be invoked without needing transpilation:
 *
 *     node pages/mj/euclid/test.js
 *
 * It will then generate some Euclidean Rhythms, and compare them against the
 * examples given in Toussaint's paper, _The Euclidean Algorithm Generates
 * Traditional Musical Rhythms_.
 */

/**
 * Euclidean rhythm E(k, n) where k is the number of 1's and n is the length of
 * the sequence.
 */
const E = (k, n) => {
    const startSeq = Array(n)
        .fill(0)
        .map((_, i) => (i < k ? [1] : [0]));

    // const fold = (n, k, seq) => {
    //     if (k <= 2) return seq;
    //     const sm = Math.min(k, seq.length - k);
    //     const leading = seq.slice(0, seq.length - sm);
    //     const trailing = seq.slice(-1 * sm);
    //     const llen = leading.length;
    //     const tlen = trailing.length;

    //     let result = [];
    //     for (let i = 0; i < Math.max(llen, tlen); i++) {
    //         let r = [];
    //         if (i < llen) {
    //             r.push(...leading[i]);
    //         }
    //         if (i < tlen) {
    //             r.push(...trailing[i]);
    //         }
    //         result.push(r);
    //     }

    //     // console.log({ n, k, seq, leading, trailing, result });

    //     return fold(k, n % k, result);
    // };

    const fold = (n, k, seq) => {
        if (k < 2) return seq;

        let result = [...seq];
        // console.log({ n, k, result });
        for (let i = 0; i < k; i++) {
            result[i] = [...result[i], ...result[result.length - i - 1]];
            // console.log({ i, k, result });
        }
        result = result.slice(0, -k);
        // console.log("after slicing", result);

        return fold(k, n % k, result);
    };

    if (k > n - k) {
        return fold(k, n - k, startSeq).flat();
    }
    return fold(n, k, startSeq).flat();
};

const test = (k, n, expected) => {
    const seq = JSON.stringify(E(k, n));
    const exp = JSON.stringify(expected);
    console.log(`E(${k},${n})\t${seq}`);
    console.assert(seq == exp, `Expected E(${k}, ${n}) to match ${exp}`);
};

// Fails:
// test(4, 16, [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]);

test(5, 13, [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0]);
test(3, 8, [1, 0, 0, 1, 0, 0, 1, 0]);
test(5, 8, [1, 0, 1, 1, 0, 1, 1, 0]);

// The paper lists [1, 0, 1], we get a rotated version
test(2, 3, [1, 1, 0]);
test(1, 2, [1, 0]);
test(1, 3, [1, 0, 0]);
test(2, 5, [1, 0, 1, 0, 0]);
// The paper lists [1, 0, 1, 1], we get a rotated version
test(3, 4, [1, 1, 1, 0]);
test(3, 5, [1, 0, 1, 0, 1]);
test(3, 7, [1, 0, 1, 0, 1, 0, 0]);
test(4, 7, [1, 0, 1, 0, 1, 0, 1]);
test(4, 9, [1, 0, 1, 0, 1, 0, 1, 0, 0]);

test(7, 10, [1, 0, 1, 1, 0, 1, 1, 0, 1, 1]);

// test(
//     13,
//     24,
//     [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
// );
