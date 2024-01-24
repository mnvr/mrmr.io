import type { CellShader, GridShader } from "../grid";
import { gridSketch } from "../grid";

/**
 * Sketch Description
 * ------------------
 *
 * The tablecloth has chains of white bulbous circles running down its length.
 */
interface State {}

const drawGrid: GridShader<State> = ({ p5, grid, env, state }) => {
    p5.clear();

    return {};
};

const drawCell: CellShader<State> = ({ p5, x, y, s, cell, state }) => {
    p5.beginShape();
    p5.vertex(x + s / 2, y);
    p5.bezierVertex(x, y + s / 2, x, y + s / 2, x + s / 2, y + s);
    p5.bezierVertex(x + s, y + s / 2, x + s, y + s / 2, x + s / 2, y);
    p5.endShape();
};

export const sketch = gridSketch({
    drawGrid,
    drawCell,
    noLoop: true,
});
