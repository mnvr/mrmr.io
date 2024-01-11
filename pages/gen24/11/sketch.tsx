import type { P5CanvasInstance } from "@p5-wrapper/react";
import { ensure } from "utils/ensure";
import {
    cellIndex,
    gridSketch,
    type CellShader,
    type Grid,
    type GridShader,
} from "../grid";

/**
 * Sketch description
 * ------------------
 *
 * A recreation of Anni Albers' DRXVII.
 *
 * The grid is a staggered one, and each cell can be thought of as a rotated
 * square, half of which is drawn. Which half (upper, lower, or none) is drawn,
 * and in what color (black or cream) are properties of each cell.
 */
interface State {
    /** The state of each cell (index) */
    cellState: Record<number, CellState>;
}

const color = {
    background: [215, 204, 180],
    black: [20, 20, 17],
    cream: [196, 184, 163],
};

type CellState = "none" | "black-down" | "black-up" | "cream-down" | "cream-up";

const allCellStates: CellState[] = [
    "black-down",
    "black-up",
    "cream-down",
    "cream-up",
];

const makeState = (p5: P5CanvasInstance, grid: Grid): State => {
    p5.randomSeed(5348);
    const randomCellState = () => {
        const ri = p5.floor(p5.random(allCellStates.length));
        return ensure(allCellStates[ri]);
    };
    const cellState: Record<number, CellState> = {};
    for (let row = 0; row < grid.rowCount; row += 1)
        for (let col = 0; col < grid.colCount; col += 1)
            cellState[cellIndex({ row, col }, grid)] = randomCellState();
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
    if (cell.index === 0) {
        console.log(s, w, h);
    }

    /* turtle */
    const black = () => p5.fill(color.black);
    const cream = () => p5.fill(color.cream);
    // const up = () => p5.triangle(x, y, x + s / 2, y - s / 2, x + s, y);
    const up = () => p5.triangle(x, y, x + w / 2, y - h / 2, x + w, y);
    const down = () => p5.triangle(x, y, x + w, y, x + w / 2, y + h / 2);

    switch (cs) {
        case "black-up":
            black();
            up();
            break;
        case "black-down":
            black();
            down();
            break;
        case "cream-up":
            cream();
            up();
            break;
        case "cream-down":
            cream();
            down();
            break;
    }
};

export const sketch = gridSketch({
    drawCell,
    drawGrid,
    staggered: true,
    cellAspectRatio: 0.9,
    noLoop: true,
});
