import type { P5CanvasInstance } from "@p5-wrapper/react";
import { ensure } from "utils/ensure";
import type { CellShader, Grid, GridShader } from "../grid";
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

    const randomCellState = (): CellState | undefined => {
        // Index beyond the array size, we don't want all cells to be filled.
        const ri = p5.floor(p5.random(allCellStates.length + 1));
        return allCellStates[ri];
    };

    const cellState: Record<number, CellState> = {};

    for (let row = startRow; row < grid.rowCount - 1; row += 1) {
        for (let col = 2; col < grid.colCount - 2; col += 1) {
            let cs = randomCellState();
            if (cs) {
                // We don't want two opposite facing triangles to join up and
                // form a square. So if we find that we're facing the opposite
                // direction of the cell exactly above us, don't use this cell.

                // Which cell to check depends on if we're staggered
                const pc = isStaggeredRow(row) ? col - 1 : col;
                let pi = maybeCellIndex({ row: row - 1, col: pc }, grid);
                if (pi !== undefined) {
                    const ps = cellState[pi];
                    if (ps !== undefined) {
                        if (ps.direction !== cs.direction) {
                            cs = undefined;
                        }
                    }
                }
                if (cs || false) {
                    pi = maybeCellIndex({ row: row - 1, col: col - 1 }, grid);
                    if (pi !== undefined) {
                        const ps = cellState[pi];
                        if (ps !== undefined) {
                            if (ps.direction !== cs.direction) {
                                cs = undefined;
                            }
                        }
                    }
                }
            }
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