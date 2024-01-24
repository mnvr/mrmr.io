import type { CellShader, GridShader } from "../grid";
import { gridSketch } from "../grid";

/**
 * Sketch Description
 * ------------------
 *
 */
interface State {}

const drawGrid: GridShader<State> = ({ p5, grid, env, state }) => {
    return {};
};

const drawCell: CellShader<State> = ({ p5, x, y, s, cell, state }) => {};

export const sketch = gridSketch({
    drawGrid,
    drawCell,
    noLoop: true,
});
