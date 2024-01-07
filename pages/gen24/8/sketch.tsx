import { assert } from "utils/assert";
import { ensure } from "utils/ensure";
import {
    cellIndex,
    gridSketch,
    type CellShader,
    type GridShader,
} from "../grid";

const debug = false;

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
     * `z' = z * (1 - z)`.
     *
     * This number is guaranteed to be between 0 and 1 (inclusive).
     */
    z: number;
    /**
     * Previous 10 z values, most recent one first.
     */
    zs: number[];
    /**
     * The (index of the) cell which should be lit to show `z`.
     */
    cellIndex: number;
    /**
     * The indicies of the cell which should be lit, mapped to the intensity
     * (opacity) with which they should be lit.
     */
    cellOpacity: Record<number, number>;
}

const makeState = (): Omit<State, "cellIndex" | "cellOpacity"> => {
    const z = 0.4;
    return { z: z, zs: [z] };
};

const nextZ = (z: number) => {
    console.log(z);
    const r = 3.93;
    if (z < 0.0001) return Math.random();
    let nz = r * z * (1 - z);
    return nz;
};

const drawGrid: GridShader<State> = ({ p5, grid, state }) => {
    const cellIndexForZ = (z: number) => {
        assert(z >= 0 && z <= 1);
        // Draw only in the safe area (i.e. exclude 1 cell from each boundary).
        const row = Math.floor(p5.map(z, 0, 1, 1, grid.rowCount - 1));
        let col = Math.floor(
            p5.map(p5.fract(z * 10), 0, 1, 1, grid.colCount - 1),
        );
        // col = row;
        return cellIndex({ row, col }, grid);
    };

    const { z, zs } = state ?? makeState();

    let nz = z;
    let nzs = zs;
    if (p5.frameCount % 4 === 1) {
        nz = nextZ(z);
        nzs = [nz, ...zs.slice(0, 50)];
    }
    const nci = cellIndexForZ(nz);
    let cellOpacity: Record<number, number> = {};
    for (let i = 0; i < nzs.length; i += 1) {
        const ci = cellIndexForZ(ensure(nzs[i]));
        cellOpacity[ci] = i / 10;
    }
    const newState = {
        z: nz,
        zs: nzs,
        cellIndex: nci,
        cellOpacity,
    };

    p5.clear();
    p5.strokeWeight(0);

    return newState;
};

const drawCell: CellShader<State> = ({ p5, x, y, s, cell, state }) => {
    const { cellIndex, cellOpacity } = ensure(state);

    if (cellIndex === cell.index) {
        p5.rect(x, y, s, s);
    }

    const op = cellOpacity[cell.index];
    if (op) {
        p5.push();
        p5.fill(255 * op);
        p5.rect(x, y, s, s);
        p5.pop();
    }
};

export const sketch = gridSketch({
    drawCell,
    drawGrid,
});
