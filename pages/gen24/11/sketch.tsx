import { ensure } from "utils/ensure";
import { gridSketch, type CellShader, type GridShader } from "../grid";

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

type CellState = "none" | "black-down" | "black-up" | "grey-down" | "grey-up";

const makeState = (): State => {
    return { cellState: {} };
};

const drawGrid: GridShader<State> = ({ p5, grid, state }) => {
    var newState = state ?? makeState();

    p5.clear();
    p5.strokeWeight(0);

    return newState;
};

const drawCell: CellShader<State> = ({ p5, x, y, s, cell, state }) => {
    const { cellState } = ensure(state);

    const fill = cellState[cell.index];
    if (fill === undefined) {
        p5.fill("blue");
        p5.rect(x, y, s, s);
    }
};

export const sketch = gridSketch({
    drawCell,
    drawGrid,
});
