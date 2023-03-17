import { randomItem } from "utils/random";

/**
 * Parse an array of flairs to extract a single one.
 *
 * Not much parsing going on here though, we just pick a one at random.
 */
export const parseFlair = (ss: readonly (string | undefined)[] | undefined) => {
    if (!ss) return;
    return randomItem(ss);
};
