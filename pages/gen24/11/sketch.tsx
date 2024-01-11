import type { P5CanvasInstance } from "@p5-wrapper/react";
import { assert } from "utils/assert";
import { ensure } from "utils/ensure";
import type { CellCoordinate, CellShader, Grid, GridShader } from "../grid";
import { cellIndex, gridSketch, maybeCellIndex } from "../grid";

/**
 * Sketch description
 * ------------------
 *
 * A recreation of Anni Albers' DRXVII.
 *
 * The grid is a staggered one, and each cell can be thought of as a rotated
 * square, in half of which a triangle is drawn. Each cell has 2 primary
 * properties - the direction it facing in direction (up, down), and in what
 * color (black or cream) is it filled.
 *
 * The properties of the cells are randomly picked but with a fixed seed. We
 * also increase the chances of a cell facing the same direction as one of the
 * cells above it.
 */
interface State {
    /** The state of each cell, indexed by the cell's index */
    cellState: Record<number, CellState>;
}

const color = {
    background: [215, 204, 180],
    black: [20, 20, 17],
    cream: [196, 184, 163],
};

interface CellState {
    /** Which direction is the triangle pointing at */
    direction: Direction;
    /** The color to fill the triangle in (one of {@link color} values) */
    color: number[];
}

type Direction = "up" | "down";
const allDirections: Direction[] = ["up", "down"];

const allCellStates: CellState[] = (() => {
    let result: CellState[] = [];
    for (const d of allDirections) {
        for (const c of [color.black, color.cream]) {
            result.push({ direction: d, color: c });
        }
    }
    return result;
})();

/**
 * Instead of a fixed staggering pattern where we stagger alternate rows, do a
 * more unpredictable staggering.
 *
 * These (zero-based) indexes are is taken from the rug itself, and need to be
 * adjusted for the fact that we don't start drawing from the edges, but leave
 * some initial rows empty.
 */
const staggeredRows = [1, 6, 9, 11, 13, 17, 19, 22, 25];

const startRow = 2;
const isStaggeredRow = (row: number) => staggeredRows.includes(row - startRow);

const makeState = (p5: P5CanvasInstance, grid: Grid): State => {
    /* DRXVII */
    p5.randomSeed(17);

    /**
     * Return a randomly initialized cell
     *
     * We always return a cell state from here, and leave it to the direction
     * pruning rules to create the gaps.
     */
    const randomCellState = (): CellState => {
        const ri = p5.floor(p5.random(allCellStates.length));
        return ensure(allCellStates[ri]);
    };

    const cellState: Record<number, CellState> = {};

    /**
     * Return `true` if the (already filled-in) cell state corresponding to the
     * given `cell` has the opposite to the given `direction`, and would
     * therefore cause a clash.
     *
     * We don't want two opposite facing triangles to join up and form a square.
     * So this check is used to find if we're facing the opposite direction of
     * the cell above us. In such cases we'll not create a new cell then, to
     * avoid the clash.
     */
    const isClashing = (cell: CellCoordinate, direction: Direction) => {
        let i = maybeCellIndex(cell, grid);
        if (i === undefined) return false;
        const s = cellState[i];
        if (s === undefined) return false;
        // They clash if they have opposite directions. Since there are only two
        // directions, we can just check for inequality.
        return s.direction !== direction;
    };

    for (let row = startRow; row < grid.rowCount - 1; row += 1) {
        // true if the current row is staggered.
        const sc = isStaggeredRow(row);
        // true if the previous row is staggered.
        const sp = isStaggeredRow(row - 1);

        for (let col = 2; col < grid.colCount - 2; col += 1) {
            let cs: CellState | undefined = randomCellState();
            const d = cs.direction;

            // We don't want two opposite facing triangles to join up.

            // A convenience function to avoid specifying parameters in full.
            const skip = (c: number) => isClashing({ row: row - 1, col: c }, d);

            // Which cells to check for a clash (due to an opposite facing
            // triangle) depends on if we're staggered or our predecessor is
            // staggered. No fancy insight here, just enumerate the scenarios.

            // If neither of us nor previous is staggered, check only for the
            // exact cell above us.
            if (!sc && !sp) {
                if (skip(col)) cs = undefined;
            }

            // If we staggered, but the previous one is not staggered, check for
            // the cells to our left (which'll have the same col as us) and to
            // our right (which'll have col + 1).
            if (sc && !sp) {
                if (skip(col)) cs = undefined;
                if (skip(col + 1)) cs = undefined;
            }

            // If we're not staggered, but the previous one is staggered, check
            // for the cells to our left (which'll have col - 1) and to our
            // right (which'll have the same col as us).
            if (!sc && sp) {
                if (skip(col - 1)) cs = undefined;
                if (skip(col)) cs = undefined;
            }

            // Both of us being staggered is not going to happen in the current
            // setup, as we manually specify the staggered rows and none of them
            // are contiguous.
            assert(!(sc && sp));

            if (cs) cellState[cellIndex({ row, col }, grid)] = cs;
        }
    }

    return { cellState };
};

const drawGrid: GridShader<State> = ({ p5, grid, state }) => {
    var newState = state ?? makeState(p5, grid);

    p5.clear();
    p5.strokeWeight(0);
    p5.background(color.background);

    return newState;
};

const drawCell: CellShader<State> = ({ p5, x, y, s, w, h, cell, state }) => {
    const { cellState } = ensure(state);

    const cs = cellState[cell.index];
    if (cs === undefined) return;

    // Adjust the x value for all cells on a staggered row, shifting them by
    // half a cell width to the right.
    const ax = isStaggeredRow(cell.row) ? x + w / 2 : x;

    console.log(s, w, h);
    const { direction, color } = cs;
    p5.fill(color);

    if (direction === "up") {
        p5.triangle(ax, y + h, ax + w / 2, y, ax + w, y + h);
    }

    if (direction === "down") {
        p5.triangle(ax, y, ax + w / 2, y + h, ax + w, y);
    }
};

export const sketch = gridSketch({
    drawCell,
    drawGrid,
    // staggered: true,
    // Cells on the rug are (around, not exactly) 66 x 33
    cellAspectRatio: 2,
    noLoop: true,
    // showGuides: true,
});
