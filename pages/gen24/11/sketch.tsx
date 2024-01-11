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
 * square, half of which is drawn. Which half (upper, lower, or none) is drawn,
 * and in what color (black or cream) are properties of each cell.
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
    direction: "up" | "down";
    color: number[];
}

const allCellStates: CellState[] = [
    { direction: "up", color: color.black },
    { direction: "down", color: color.black },
    { direction: "up", color: color.cream },
    { direction: "down", color: color.cream },
];

const makeState = (p5: P5CanvasInstance, grid: Grid): State => {
    /* DRXVII */
    p5.randomSeed(17);

    const randomCellState = () => {
        const ri = p5.floor(p5.random(allCellStates.length));
        return ensure(allCellStates[ri]);
    };

    const cellState: Record<number, CellState> = {};

    for (let row = 2; row < grid.rowCount - 1; row += 1) {
        for (let col = 2; col < grid.colCount - 2; col += 1) {
            let cs = randomCellState();
            // Increase the probability of facing the same direction as one of
            // the cells (diagonally) above us.
            // TODO: Remove this?
            if (p5.random() < 0.0) {
                const ul = maybeCellIndex({ row: row - 1, col: col + 1 }, grid);
                if (ul) {
                    const upLeft = cellState[ul];
                    if (upLeft) {
                        cs.direction = upLeft.direction;
                    }
                }
            }
            cellState[cellIndex({ row, col }, grid)] = cs;
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

    p5.fill(cs.color);

    if (cs.direction === "up") {
        p5.triangle(x, y, x + w / 2, y - h / 2, x + w, y);
    } else if (cs.direction === "down") {
        p5.triangle(x, y, x + w, y, x + w / 2, y + h / 2);
    }
};

export const sketch = gridSketch({
    drawCell,
    drawGrid,
    staggered: true,
    // rug cells are 65 x 71
    cellAspectRatio: 0.91,
    noLoop: true,
});
