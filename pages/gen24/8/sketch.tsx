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
 * called linear map:
 *
 *     x' = x * (1 - x)
 *
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
     * The (index of the) cell which should be lit to show `z`.
     */
    cellIndex: number;
}

const makeState = (): Omit<State, "cellIndex"> => {
    return { z: 0.4 };
};

const nextZ = (z: number) => {
    console.log(z);
    if (z < 0.0001) return Math.random();
    let nz = z * (1 - z) + 0.5;
    return nz;
};

const drawGrid: GridShader<State> = ({ p5, grid, state }) => {
    const cellIndexForZ = (z: number) => {
        assert(z >= 0 && z <= 1);
        const row = Math.floor(p5.map(z, 0, 1, 0, grid.rowCount));
        const col = Math.floor(p5.map(z, 0, 1, 0, grid.colCount));
        return cellIndex({ row, col }, grid);
    };

    const { z } = state ?? makeState();

    let nz = z;
    if (p5.frameCount % 60 === 1) {
        nz = nextZ(z);
    }
    const newState = {
        z: nz,
        cellIndex: cellIndexForZ(nz),
    };

    p5.clear();

    return newState;
};

const drawCell: CellShader<State> = ({ p5, x, y, s, cell, state }) => {
    const { cellIndex } = ensure(state);

    if (cellIndex === cell.index) {
        p5.rect(x, y, s, s);
    }
};

export const sketch = gridSketch({
    drawCell,
    drawGrid,
});
