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

const shapeColor: Record<Shape, string> = {
    triangle: "yellow",
    circle: "red",
    square: "blue",
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

    // x and y are the top left coordinates
    switch (shape) {
        case "triangle":
            p5.triangle(x, y + s, x + s / 2, y, x + s, y + s);
        case "circle":
            p5.circle(x + s / 2, y + s / 2, s);
        case "square":
            p5.rect(x, y, s, s);
    }
};

export const sketch = gridSketch({
    drawGrid,
    drawCell,
    noLoop: true,
});
