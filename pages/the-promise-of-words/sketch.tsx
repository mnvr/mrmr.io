import type p5 from "p5";
import { color, p5c } from "utils/colorsjs";
import { ensure } from "utils/ensure";

interface SketchState {
    /**
     * Dimensions of the (covering) rectangle used by each cell
     */
    cellD: number;
    /**
     * Each cell tracks whether or not a particular location is occupied.
     *
     * Our universe here is a chess board. Here we keep track of which of the
     * positions on the checkerboard are occupied.
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
 * Number of rows ("y" or "j" values) and colums ("x" or "i") on the
 * checker-board / chess-board.
 */
const [rows, cols] = [3, 3];

/**
 * Dimensions of the (covering) rectangle used by each cell
 */
const cellD = 10;

/**
 * The color to use for drawing alive cells.
 */
const aliveColor = color("white"); //color("oklch(54% 0.22 29)");

/**
 * The color to use for drawing inactive cells.
 */
const inactiveColor = color("oklch(7% 0.242 151.39 / 0.75)");

/**
 * Cache P5 representations of some of the fixed colors that we use to avoid
 * recreating them each loop.
 */
const aliveColorP5 = p5c(aliveColor);
const inactiveColorP5 = p5c(inactiveColor);

const initState = (p5: p5) => {
    const cellD = Math.min(
        Math.floor(p5.height / rows),
        Math.floor(p5.width / cols),
    );

    const cells = makeCells();

    setInitialPattern(cells);

    return { cellD, cells };
};

/** Return a cells array initialized to all false values */
const makeCells = () => Array(rows * cols).fill(false);

/**
 * Set the cell at row j and col i of the cells array to true.
 *
 * @param cells The 1D array representation of the cells matrix.
 */
const setCell = (cells: boolean[], j: number, i: number) => {
    cells[j * cols + i] = true;
};

const setInitialPattern = (cells: boolean[]) => {
    const [cj, ci] = [Math.floor(rows / 2), Math.floor(cols / 2)];
    setCell(cells, cj - 1, ci + 0);
    setCell(cells, cj - 1, ci + 1);
    setCell(cells, cj + 0, ci - 1);
    setCell(cells, cj + 0, ci + 0);
    setCell(cells, cj + 1, ci + 0);
};

/**
 * Draw pieces on a chessboard.
 */
export const draw = (p5: p5) => {
    if (!state) state = initState(p5);
    const { cellD, cells } = ensure(state);

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

    const next = makeCells();

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            let c = 2;
            const isAlive = ensure(cells[j * cols + i]);
            let nextIsAlive = true;

            if (isAlive) {
                // Staying alive
                //
                // If a cell is alive and has exactly 2 or 3 live neighbours, it
                // stays alive.
                if (c === 2 || c === 3) nextIsAlive = true;
            } else {
                // Birth
                //
                // If a cell is inactive, it'll become alive if it has exactly 3
                // live neighbours.
                if (c === 3) nextIsAlive = true;
            }

            if (nextIsAlive) setCell(next, j, i);

            // Coordinates of the starting corner of the rectangle that covers
            // the drawing area we have for the cell.
            const x = i * cellD;
            const y = j * cellD;

            // p5.point(x + cellD / 2, y + cellD / 2);
            p5.fill(isAlive ? aliveColorP5 : inactiveColorP5);
            p5.rect(x, y, cellD, cellD);
        }
    }

    // if (p5.frameCount % 15 === 0)
    // state.cells = next;
};

const offset = (availableSpace: number, count: number, cellD: number) => {
    const extra = availableSpace - count * cellD;
    if (extra <= 0) return 0;
    return extra / 2;
};
