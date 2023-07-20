import p5Types from "p5";
import { color, p5c } from "utils/colorsjs";
import { ensure } from "utils/ensure";

interface SketchState {
    /** Number of rows (y/j values) in `cells` */
    rows: number;
    /** Number of columns (x/i values) in `cells` */
    cols: number;
    /**
     * Each cell tracks whether or not a particular location is "alive"
     *
     * We're doing a "game of life" simulation here, and this is the state of
     * the game, tracking which cells are currently alive.
     *
     * For ease of coding (and possibly better runtime performance), this is
     * kept as a 1D array in row-major order instead of as the 2D matrix that it
     * conceptually is.
     *
     * Thus, the cell at row j and col i is at `j * rows + i`.
     */
    cells: boolean[];
}

let state: SketchState | undefined;

/**
 * Dimensions of the (covering) rectangle used by each cell
 */
const cellD = 10;

/**
 * The color to use for drawing alive cells.
 */
const aliveColor = color("oklch(77% 0.242 151.39)");

/**
 * The color to use for drawing inactive cells.
 */
const inactiveColor = color("oklch(97% 0.242 151.39)");

/**
 * Cache P5 representations of some of the fixed colors that we use to avoid
 * recreating them each loop.
 */
const aliveColorP5 = p5c(aliveColor);
const inactiveColorP5 = p5c(inactiveColor);

const initState = (p5: p5Types) => {
    const rows = Math.floor(p5.height / cellD);
    const cols = Math.floor(p5.width / cellD);

    const cells = makeCells(rows, cols);

    setInitialPattern(cells, rows, cols);

    return { cols, rows, cells };
};

/** Return a cells array initialized to all false values */
const makeCells = (rows: number, cols: number): boolean[] =>
    Array(rows * cols).fill(false);

/**
 * Set the cell at row j and col i of the cells array to true.
 *
 * @param cells The 1D array representation of the cells matrix.
 * @param rows The conceptual number of rows in the cells matrix.
 */
const setCell = (cells: boolean[], rows: number, j: number, i: number) => {
    cells[j * rows + i] = true;
};

const setInitialPattern = (cells: boolean[], rows: number, cols: number) => {
    // Start with an R-Pentomino, where the capital X indicates the center most
    // cell of the board.
    //
    //       xx
    //      xX
    //       x
    //
    const [cj, ci] = [Math.floor(cols / 2), Math.floor(rows / 2)];
    setCell(cells, rows, ci - 1, cj + 0);
    setCell(cells, rows, ci - 1, cj + 1);
    setCell(cells, rows, ci + 0, cj - 1);
    setCell(cells, rows, ci + 0, cj + 0);
    setCell(cells, rows, ci + 1, cj + 0);
};

let advance = false;

/**
 * Simulate a game of life.
 */
export const draw = (p5: p5Types) => {
    if (!state) p5.mouseClicked = () => (advance = true);
    if (!state) state = initState(p5);
    const { rows, cols, cells } = ensure(state);

    p5.clear();

    // Translate to the starting position of the first cell
    //
    // An offset would be needed in 2 cases:
    //
    // - During the normal course of things, we'll usually end up with number of
    //   rows and cols that don't exactly cover the width and height of the
    //   canvas – the leftover would be less that `cellD`, but still large
    //   enough to cause the cells not to appear "off" if we'd start drawing
    //   them from 0, 0. In these cases, the offset will be set to the half of
    //   the remainder space, so that the cells that are visible seem centered
    //   within the available space.
    //
    // - The canvas might get resized since we began. There are multiple ways to
    //   handle this: the approach we take is that our cols and rows (and the
    //   cells matrix) stay fixed, but we center them within the new area
    //   (if the canvas got larger) or just let the tails clip (if the canvas
    //   got smaller).
    //
    // This offset computation handles both cases.

    p5.translate(offset(p5.width, cols), offset(p5.height, rows));

    p5.strokeWeight(5);

    const next = makeCells(rows, cols);

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            const c = aliveNeighbourCount(cells, rows, j, i);
            if (c === 4) setCell(next, rows, j, i);

            const isAlive = cells[j * rows + i] === true;

            // Coordinates of the starting corner of the rectangle that covers
            // the drawing area we have for the cell.
            const x = i * cellD;
            const y = j * cellD;

            // This is apparently causing a FPS drop, but that's fine, we won't
            // need it later on.
            // p5.rect(x, y, cellD, cellD);
            p5.stroke(isAlive ? aliveColorP5 : inactiveColorP5);
            p5.point(x + cellD / 2, y + cellD / 2);
        }
    }

    if (p5.mouseIsPressed) {
    }

    if (advance) {
        advance = false;
        state.cells = next;
    }
    // if (p5.frameCount % 700) state.cells = next;
};

const offset = (availableSpace: number, count: number) => {
    const extra = availableSpace - count * cellD;
    if (extra <= 0) return 0;
    return extra / 2;
};

/**
 * Return a count of the number of neighbours of the cell at row j and col i
 * that are alive.
 */
const aliveNeighbourCount = (
    cells: boolean[],
    rows: number,
    j: number,
    i: number
) => {
    // Neighbouring indices. Initializing this separately so that we can provide
    // a type annotation and make the TypeScript compiler happy about the [x, y]
    // destructuring later on.
    const ni: [number, number][] = [
        [j - 1, i - 1],
        [j - 1, i],
        [j - 1, i + 1],
        [j + 0, i - 1],
        [j + 0, i],
        [j + 0, i + 1],
        [j + 1, i - 1],
        [j + 1, i],
        [j + 1, i + 1],
    ];
    return ni.reduce((s, [j, i]) => {
        return s + (cells[j * rows + i] === true ? 1 : 0);
    }, 0);
};
