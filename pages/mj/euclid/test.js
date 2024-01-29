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
const euclid = (n, m) => {
    if (n < m) return euclid(m, n);
    const startSeq = Array(n)
        .fill(0)
        .map((_, i) => (i < m ? [1] : [0]));

    const fold = (n, m, seq) => {
        if (m < 2) return seq;
        const sm = Math.min(m, seq.length - m);
        const leading = seq.slice(0, seq.length - sm);
        const trailing = seq.slice(-1 * sm);
        const llen = leading.length;
        const tlen = trailing.length;

        let result = [];
        for (let i = 0; i < Math.max(llen, tlen); i++) {
            let r = [];
            if (i < llen) {
                r.push(...leading[i]);
            }
            if (i < tlen) {
                r.push(...trailing[i]);
            }
            result.push(r);
        }

        // console.log({ n, m, seq, leading, trailing, result });

        return fold(m, n % m, result);
    };

    return fold(n, m, startSeq).flat();
};

const test = (n, m, expected) => {
    const seq = JSON.stringify(euclid(n, m));
    const exp = JSON.stringify(expected);
    console.log(`E(${n},${m})\t${seq}`);
    console.assert(seq == exp, `Expected E(${n}, ${m}) to match ${exp}`);
};

// Fails:
// test(16, 4, [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]);

test(5, 13, [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0]);
test(3, 8, [1, 0, 0, 1, 0, 0, 1, 0]);

// Fails:
// The paper lists [1, 0, 1, 1, 0, 1, 0, 1]
// Our algorithm produces a rotated version
// [1, 0, 1, 1, 0, 1, 1, 0]
//test(5, 8, [1, 0, 1, 1, 0, 1, 1, 0]);

test(2, 3, [1, 0, 1]);
