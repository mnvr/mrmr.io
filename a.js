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
            let r = []
            if (i < llen) {
                r.push(...leading[i]);
            }
            if (i < tlen) {
                r.push(...trailing[i]);
            }
            result.push(r);
        }

        console.log({n, m, seq, leading, trailing, result});

        return fold(m, n % m, result);
    }
    
    return fold(n, m, startSeq).flat();
};


//console.log(euclid(3, 8))
//console.log(euclid(13, 5))
console.log(euclid(5, 8))
