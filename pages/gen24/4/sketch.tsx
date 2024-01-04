import { CellShader, gridSketch } from "../grid";

const debug = true;

/**
 * Sketch Description
 * ------------------
 *
 * Consider the visible part of the grid as an array of pixels. Show a message
 * cycling between two possible two letter words: "Do", and "Be".
 */
const words = ["Be", "Do"];

const drawCell: CellShader = ({ p5, x, y, cell }) => {
    const { row, col } = cell;

    if (debug) {
        p5.textFont("monospace");
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.text(`${col} ${row}`, x + 1, y + 2);
    }
};

export const sketch = gridSketch({
    drawCell: drawCell,
    noLoop: true,
});
