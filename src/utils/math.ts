/**
 * Modulo
 *
 * @return the arithmetic modulo
 *
 * JavaScript has a `%` operator, but that computes the remainder, not the
 * modulo. The difference between the two is that:
 *
 * - The remainder has the same sign as the dividend.
 *
 * - The modulo has the same sign as the divisor.
 *
 * This makes a difference when, for example, we're trying to wrap around an
 * array's bounds. If i can be negative, `i % n` would return a negative number,
 * whilst `mod(i, n)` would return the wrapped index.
 *
 * Technically, the modulo is defined `k = n - d * q` where q is the integer
 * closest to zero such that k has the same sign as the divisor d.
 *
 * Examples:
 *
 * - `mod(-1, 3) === 2`
 * - `mod(-1, -3) === -1`
 */
export const mod = (n: number, d: number) => ((n % d) + d) % d;

/** Floor the given number `n` to the nearest multiple of `d` */
export const floorToMultiple = (n: number, d: number) => Math.floor(n / d) * d;
