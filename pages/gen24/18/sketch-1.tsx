import { ensure } from "utils/ensure";
import type { CellShader, GridShader } from "../grid";
import { gridSketch, maybeCellIndex } from "../grid";

/**
 * Sketch Description
 * ------------------
 *
 * This sketch is a reproduction of a Study by Erch Mrozek for Vassily
 * Kandinsky's Farbenlehre (Course on color), circa 1929, at the Bauhaus.
 */
interface State {
    /** The indices of the 3x3 cells that form the inner square */
    innerSquare: Set<number>;
}

const blue = [21, 56, 152];
const orange = [254, 78, 55];

const drawGrid: GridShader<State> = ({ p5, state, grid }) => {
    const makeState = () => {
        // We hardcode the cell indices here to be somewhere on the top left.
        // These indices _might_ possibly be out of bounds too, but that's
        // unlikely to happen in most window dimensions, so we handle that case
        // by just ignoring out of bound indices.
        const innerSquare: Set<number> = new Set([]);
        for (let row = 2; row <= 4; row += 1) {
            for (let col = 2; col <= 4; col += 1) {
                const i = maybeCellIndex({ row, col }, grid);
                if (i !== undefined) {
                    innerSquare.add(i);
                }
            }
        }
        return { innerSquare };
    };

    const newState = state ?? makeState();

    p5.clear();
    p5.background(blue);
    p5.strokeWeight(0);
    p5.fill(orange);

    return newState;
};

const drawCell: CellShader<State> = ({ p5, x, y, s, cell, state }) => {
    const { innerSquare } = ensure(state);
    if (!innerSquare.has(cell.index)) return;

    p5.rect(x, y, s, s);
};

export const sketch = gridSketch({
    drawGrid,
    drawCell,
    noLoop: true,
});
