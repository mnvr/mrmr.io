import { assert } from "utils/assert";
import { ensure } from "utils/ensure";
import {
    cellIndex,
    gridSketch,
    type CellShader,
    type GridShader,
} from "../grid";

/**
 * Sketch description
 * ------------------
 *
 * Iterate over a simple equation that exhibits chaotic behaviour, and render
 * the numbers we get on the grid. The attempt is to try to convey the
 * "systematic yet random" behaviour that arises from a deterministic system.
 *
 * For this sketch, we take (probably) the simplest such equation - the so
 * called logistic map:
 *
 *     x' = r * x * (1 - x)
 *
 * This non-linear equation arose in Biology where it was intended as a simple
 * model of a biological system. x denotes the population of a species. The
 * equation pulls in two opposite directions (as does the biological system it
 * is trying to emulate):
 *
 * - The population increases by some reproduction rate "r" at every step, and
 *   the actual increase will be proportional to the current population. The
 *   term `r * x` captures this.
 *
 * - However, if the more the number of individuals, the harder it is to survive
 *   (e.g. there will be increased competition for food). The `(1 - x)` term
 *   captures this.
 *
 * The behaviour of this equation depends on the value of r:
 *
 * - For r < 3, the population obtained from this equation settles down to some
 *   fixed value.
 * - For r between 3 and ~3.44, it oscillates between two values.
 * - For r between 3.44 and ~3.54, it oscillates between three values.
 * - Increasing r this way, this equation keeps oscillating between an
 *   increasing number of values.
 * - At r = ~3.56, there is onset of chaotic behaviour.
 */
interface State {
    /**
     * The last value we obtained from the iterated application of the equation
     * `z' = r * z * (1 - z)`.
     *
     * This number is guaranteed to be between 0 and 1 (inclusive).
     */
    z: number;
    /**
     * The last 50 z values, most recent one first.
     */
    zs: number[];
    /**
     * The (index of the) cell which should be lit to show `z`.
     */
    zIndex: number;
    /**
     * The indicies of the cell which should be lit, mapped to the intensity
     * with which they should be lit.
     *
     * There is one entry for each item in `zs`.
     *
     * Each intensity is between 0 and 1.
     */
    cellIntensity: Record<number, number>;
}

const makeState = (): Omit<State, "zIndex" | "cellIntensity"> => {
    // Arbitrary starting value
    //
    // It doesn't matter for the chaotic behaviour where we start. I just picked
    // something here - this can be thought of as the seed for our sketch
    // (alongwith the grid size).
    const z = 0.4;
    return { z, zs: [z] };
};

const nextZ = (z: number) => {
    // We can pick any r > ~3.56 to witness the chaotic behaviour. However, not
    // all values span the entire space from 0-1. This value I picked, 3.93, is
    // the first one I found (by randomly flittering about) that covers the
    // entire region 0-1 (not uniformly, but it does visit them all the buckets
    // between 0 and 1).
    const r = 3.93;

    return r * z * (1 - z);
};

const drawGrid: GridShader<State> = ({ p5, grid, state }) => {
    const cellIndexForZ = (z: number) => {
        assert(z >= 0 && z <= 1);
        // Draw only in the safe area (i.e. exclude 1 cell from each boundary).
        const row = p5.floor(p5.map(z, 0, 1, 1, grid.rowCount - 1));
        const col = p5.floor(
            p5.map(p5.fract(z * 10), 0, 1, 1, grid.colCount - 1),
        );
        return cellIndex({ row, col }, grid);
    };

    let { z, zs } = state ?? makeState();

    if (p5.frameCount % 4 === 1) {
        z = nextZ(z);
        zs = [z, ...zs.slice(0, 50)];
    }

    const zIndex = cellIndexForZ(z);
    let cellIntensity: Record<number, number> = {};
    zs.forEach((z, i) => {
        cellIntensity[cellIndexForZ(z)] = i / 10;
    });

    p5.clear();
    p5.strokeWeight(0);

    return { z, zs, zIndex, cellIntensity };
};

const drawCell: CellShader<State> = ({ p5, x, y, s, cell, state }) => {
    const { zIndex, cellIntensity } = ensure(state);

    if (zIndex === cell.index) {
        p5.fill(255);
        // Comment the next line for a calmer behaviour
        p5.rect(x, y, s, s);
    }

    const op = cellIntensity[cell.index];
    if (op) {
        // console.log(op);
        p5.fill(255 * op);
        p5.rect(x, y, s, s);
    }
};

export const sketch = gridSketch({
    drawCell,
    drawGrid,
});
