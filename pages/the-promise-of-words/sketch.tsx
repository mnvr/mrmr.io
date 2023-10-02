import type p5 from "p5";
import { color, p5c } from "utils/colorsjs";
import { ensure } from "utils/ensure";

interface SketchState {
    /**
     * Number of rows ("y" or "j" values) on the checker-board / chess-board.
     */
    rows: number;
    /**
     * Number of colums ("x" or "i") on the checker-board / chess-board.
     */
    cols: number;
    /**
     * Dimensions of the (covering) rectangle used by each cell.
     */
    cellD: number;
    /**
     * Each cell tracks whether or not a particular location is set.
     *
     * Our universe here is a chess board. Here we keep track of which of the
     * positions on the checkerboard are set.
     *
     * For ease of coding (and possibly better runtime performance), this is
     * kept as a 1D array in row-major order instead of as the 2D matrix that it
     * conceptually is.
     *
     * Thus, the cell at row j and col i is at `j * cols + i`.
     */
    cells: boolean[];
}

let state: SketchState | undefined;

/**
 * The color to use for drawing set cells.
 */
const setCellColor = color("oklch(54% 0.22 29)");

/**
 * The color to use for drawing unset cells.
 */
const unsetCellColor = color("oklch(97% 0.09 105)");

/**
 * Cache P5 representations of some of the fixed colors that we use to avoid
 * recreating them each loop.
 */
const setCellColorP5 = p5c(setCellColor);
const unsetCellColorP5 = p5c(unsetCellColor);

const initState = (p5: p5) => {
    const [rows, cols] = [3, 3];

    const cellD = Math.min(
        Math.floor(p5.height / rows),
        Math.floor(p5.width / cols),
    );

    const cells = makeCells(rows, cols);

    setInitialCells(cells, rows, cols);

    return { rows, cols, cellD, cells };
};

/** Return a cells array initialized to all false values */
const makeCells = (rows: number, cols: number): boolean[] =>
    Array(rows * cols).fill(false);

/**
 * Set the cell at row j and col i of the cells array to true.
 *
 * @param cells The 1D array representation of the cells matrix.
 */
const setCell = (cells: boolean[], cols: number, j: number, i: number) => {
    cells[j * cols + i] = true;
};

const setInitialCells = (cells: boolean[], rows: number, cols: number) => {
    const [cj, ci] = [Math.floor(rows / 2), Math.floor(cols / 2)];
    setCell(cells, cols, cj - 1, ci + 0);
    setCell(cells, cols, cj - 1, ci + 1);
    setCell(cells, cols, cj + 0, ci - 1);
    setCell(cells, cols, cj + 0, ci + 0);
    setCell(cells, cols, cj + 1, ci + 0);
};

/**
 * Draw pieces on a chessboard.
 */
export const draw = (p5: p5) => {
    if (!state) state = initState(p5);
    const { rows, cols, cellD, cells } = ensure(state);

    p5.clear();
    p5.strokeWeight(0);

    // Translate to the starting position of the first cell
    //
    // An offset would be needed in 2 cases:
    //
    // - During the normal course of things, we'll usually end up with number of
    //   rows and cols that don't exactly cover the width and height of the
    //   canvas – the leftover would cause the cells not to appear "off" if we'd
    //   start drawing them from 0, 0. In these cases, the offset will be set to
    //   the half of the remainder space, so that the cells that are visible
    //   seem centered within the available space.
    //
    // - The canvas might get resized since we began. There are multiple ways to
    //   handle this: the approach we take is that our cols and rows (and the
    //   cells matrix) stay fixed, but we center them within the new area (if
    //   the canvas got larger) or just let the tails clip (if the canvas got
    //   smaller).
    //
    // This offset computation handles both cases.

    p5.translate(offset(p5.width, cols, cellD), offset(p5.height, rows, cellD));

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            // The state of the cell.
            const s = ensure(cells[j * cols + i]);

            // Coordinates of the starting corner of the rectangle that covers
            // the drawing area we have for the cell.
            const y = j * cellD;
            const x = i * cellD;

            const rs = cornerRadii(state, 2, j, i, s);

            p5.fill(s ? setCellColorP5 : unsetCellColorP5);
            p5.rect(x, y, cellD, cellD, ...rs);
        }
    }
};

const offset = (availableSpace: number, count: number, cellD: number) => {
    const extra = availableSpace - count * cellD;
    if (extra <= 0) return 0;
    return extra / 2;
};

/**
 * Return the corner radii to use when drawing the rectangle representing this
 * cell. The corner radii is set to the default value, unless there is a
 * neighbouring cell that has the same state as us.
 *
 * @param state The state of the sketch.
 * @param r The default corner radius to use.
 * @param j The row of the cell under consideration.
 * @param i The column of the cell under consideration.
 * @param cellState The state of the cell.
 * */
const cornerRadii = (
    state: SketchState,
    r: number,
    j: number,
    i: number,
    cellState: boolean,
) => {
    // If any of the neighbouring cells has the same state as this cell
    // then turn off the corner radius for edges on that side to create
    // a smooth, single figure for each neighbourhood.
    //
    // * The radii start with the top-left and move clockwise.
    let rs = [r, r, r, r];

    // A shorter alias
    const s = cellState;

    // * Previous row
    if (hasState(state, j - 1, i, s)) rs[0] = rs[1] = 0;
    // * Next column
    if (hasState(state, j, i + 1, s)) rs[1] = rs[2] = 0;
    // * Next row
    if (hasState(state, j + 1, i, s)) rs[2] = rs[3] = 0;
    // * Previous column
    if (hasState(state, j, i - 1, s)) rs[3] = rs[0] = 0;

    return rs;
};

/**
 * Return true if the cell at row j and col i of the cells array is set to
 * `state`.
 *
 * For out of bounds cells, return false.
 *
 * @param state The state of the sketch. In particular, this contains the state
 * of all cells.
 * @param cellState The state to compare to.
 */
const hasState = (
    state: SketchState,
    j: number,
    i: number,
    cellState: boolean,
) => {
    const { cells, cols, rows } = state;
    if (j < 0 || j >= cols) return false; // out of bounds
    if (i < 0 || i >= rows) return false; // out of bounds
    return cells[j * cols + i] === cellState;
};
