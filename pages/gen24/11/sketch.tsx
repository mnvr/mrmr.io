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
 * and in what color (black or grey) are properties of each cell.
 */
interface State {
    /** The state of each cell (index) */
    cellState: Record<number, CellState>;
}

const color = {
    background: [215, 204, 180],
    fillBlack: [20, 20, 17],
    fillWarm: [196, 184, 163],
};

type CellState = "none" | "black-down" | "black-up" | "grey-down" | "grey-up";

const allCellStates: CellState[] = [
    "none",
    "black-down",
    "black-up",
    "grey-down",
    "grey-up",
];

const makeState = (p5: P5CanvasInstance, grid: Grid): State => {
    p5.randomSeed(5348);
    const randomCellState = () => {
        const ri = p5.floor(p5.random() * allCellStates.length);
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
    // p5.background(...color.background);
    p5.background(...[215, 204, 180]);

    return newState;
};

const drawCell: CellShader<State> = ({ p5, x, y, s, cell, state }) => {
    const { cellState } = ensure(state);

    const fill = cellState[cell.index];
    if (fill === undefined) {
        p5.fill("blue");
    }
    switch (fill) {
        case "black-down":
            p5.fill([20, 20, 17]);
            break;
        default:
            p5.fill("trasparent");
    }
    p5.rect(x, y, s, s);
};

export const sketch = gridSketch({
    drawCell,
    drawGrid,
});
