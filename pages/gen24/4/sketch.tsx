import {
    CellShader,
    GridShader,
    gridSketch,
    isCoordinateInRect,
} from "../grid";

const debug = true;

/**
 * Sketch Description
 * ------------------
 *
 * Consider the visible part of the grid as an array of pixels. Show a message
 * cycling between two possible two letter words: "Do", and "Be".
 */
const words = ["Be", "Do"];

const drawGrid: GridShader = ({ p5, grid }) => {
    const { visibleRect } = grid;
    console.log(visibleRect);

    p5.clear();
};

const drawCell: CellShader = ({ p5, x, y, cell, grid }) => {
    const { row, col } = cell;
    const { visibleRect } = grid;

    if (debug) {
        p5.textFont("monospace");
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.fill(
            isCoordinateInRect({ x: col, y: row }, visibleRect)
                ? "red"
                : "black",
        );
        p5.text(`${col} ${row}`, x, y);
    }
};

export const sketch = gridSketch({
    drawGrid: drawGrid,
    drawCell: drawCell,
    noLoop: true,
    showGuides: debug,
});
