import { ensure } from "utils/ensure";
import type { CellShader, GridShader } from "../grid";
import { cellIndex, gridSketch } from "../grid";

/**
 * Sketch Description
 * ------------------
 *
 * Randomly fill each square in one of the three primary forms (as taught in the
 * Preliminary course on Form and Color at the Bauhaus school): Triangle, Circle
 * and Square.
 *
 * Color each of the three primary forms in the color that Vassily Kandinksky
 * believed they corresponded to (Vassily was a synaesthese).
 */
interface State {
    /** The shape for each cell, indexed by the cell index */
    cellShape: Record<number, Shape>;
}

type Shape = "circle" | "triangle" | "square";
const allShapes: Shape[] = ["circle", "triangle", "square"];

/** Anything that p5 recognizes as a color */
type Color = string | number[];

const shapeColor: Record<Shape, Color> = {
    // triangle: [255, 224, 5] /* yellow */,
    triangle: "yellow", //[255, 255, 0] /* yellow */,
    circle: [2, 121, 255] /* blue */,
    square: "red", //[255, 0, 0] /* red */,
};

const drawGrid: GridShader<State> = ({ p5, grid, state }) => {
    const makeState = () => {
        p5.randomSeed(1919);

        // Randomly pick a shape for each cell
        const cellShape: Record<number, Shape> = {};
        const { rowCount, colCount } = grid;
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < colCount; col++) {
                const i = cellIndex({ row, col }, grid);
                const shape = p5.random(allShapes);
                console.log(shape);
                cellShape[i] = shape;
            }
        }

        return { cellShape };
    };

    const newState = state ?? makeState();

    p5.clear();
    p5.strokeWeight(0);

    return newState;
};

const drawCell: CellShader<State> = ({ p5, x, y, s, cell, state }) => {
    const { cellShape } = ensure(state);
    const shape = ensure(cellShape[cell.index]);

    p5.fill(shapeColor[shape]);

    const r = p5.max(s - 10, 10);

    // x and y are the top left coordinates
    switch (shape) {
        case "triangle":
            p5.triangle(x, y + r, x + r / 2, y, x + r, y + r);
            break;
        case "circle":
            p5.circle(x + r / 2, y + r / 2, r);
            break;
        case "square":
            p5.rect(x, y, r, r);
            break;
    }
};

export const sketch = gridSketch({
    drawGrid,
    drawCell,
    noLoop: true,
});
