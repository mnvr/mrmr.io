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
    /**
     * The set of colors to use for filling each shape
     *
     * This is mode dependent (i.e. it'll change depending on whether we're in
     * light or dark mode.
     */
    shapeColors: ShapeColors;
}

type Shape = "circle" | "triangle" | "square";
const allShapes: Shape[] = ["circle", "triangle", "square"];

/** Anything that p5 recognizes as a color */
type Color = string | number[];

type ShapeColors = Record<Shape, Color>;

const lightModeShapeColors: ShapeColors = {
    triangle: [255, 224, 5] /* yellow */,
    circle: [2, 121, 181] /* blue */,
    square: "red", //[255, 0, 0] /* red */
};

const darkModeShapeColors: ShapeColors = {
    // triangle: [255, 224, 5] /* yellow */,
    triangle: "yellow", //[255, 255, 0] /* yellow */,
    circle: [2, 121, 255] /* blue */,
    square: "red", //[255, 0, 0] /* red */
};

const drawGrid: GridShader<State> = ({ p5, grid, env, state }) => {
    type OnlyShape = Omit<State, "shapeColors">;
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

    let newState: OnlyShape = state ?? makeState();

    const shapeColors = env.isDarkMode
        ? darkModeShapeColors
        : lightModeShapeColors;

    p5.clear();
    p5.strokeWeight(0);

    return { ...newState, shapeColors };
};

const drawCell: CellShader<State> = ({ p5, x, y, s, cell, state }) => {
    const { cellShape, shapeColors } = ensure(state);
    const shape = ensure(cellShape[cell.index]);

    // TypeScript currently does not recognize that our union type is matching
    // one of the overloads.
    // https://github.com/microsoft/TypeScript/issues/14107
    p5.fill(shapeColors[shape]);

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
