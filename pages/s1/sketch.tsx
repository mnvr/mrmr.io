import p5Types from "p5";
import { color, p5c } from "utils/colorsjs";
import { ensure } from "utils/ensure";
import { mod } from "utils/math";

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
     * Thus, the cell at row j and col i is at `j * cols + i`.
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
const inactiveColor = color("oklch(96.5% 0.242 151.39)");

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
 * @param cols The conceptual number of cols in the cells matrix.
 */
const setCell = (cells: boolean[], cols: number, j: number, i: number) => {
    ensure(cells[j * cols + i]);
    cells[j * cols + i] = true;
};

const setInitialPattern = (cells: boolean[], rows: number, cols: number) => {
    // Start with an R-Pentomino, where the capital X indicates the center most
    // cell of the board.
    //
    //       xx
    //      xX
    //       x
    //
    const [cj, ci] = [Math.floor(rows / 2), Math.floor(cols / 2)];
    setCell(cells, cols, cj - 1, ci + 0);
    setCell(cells, cols, cj - 1, ci + 1);
    setCell(cells, cols, cj + 0, ci - 1);
    setCell(cells, cols, cj + 0, ci + 0);
    setCell(cells, cols, cj + 1, ci + 0);
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
            const c = aliveNeighbourCount(cells, rows, cols, j, i);

            const isAlive = ensure(cells[j * cols + i]);
            let nextIsAlive = false;

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

            if (nextIsAlive) setCell(next, cols, j, i);

            // Coordinates of the starting corner of the rectangle that covers
            // the drawing area we have for the cell.
            const x = i * cellD;
            const y = j * cellD;

            // This is apparently causing a FPS drop, but that's fine, we won't
            // need it later on.
            // p5.rect(x, y, cellD, cellD);
            p5.stroke(isAlive ? aliveColorP5 : inactiveColorP5);
            p5.strokeWeight(5);
            if (isAlive) {
                p5.strokeWeight(2 * c);
            } else {
                p5.stroke(isAlive ? aliveColorP5 : inactiveColorP5);
            }
            p5.point(x + cellD / 2, y + cellD / 2);
        }
    }

    if (advance) {
        advance = false;
        state.cells = next;
    }

    if (p5.frameCount % 1 === 15) state.cells = next;
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
    cols: number,
    j: number,
    i: number
) => {
    // Neighbouring indices. Initializing this separately so that we can provide
    // a type annotation and make the TypeScript compiler happy about the [j, i]
    // destructuring later on.
    const ni: [number, number][] = [
        [j - 1, i - 1],
        [j - 1, i],
        [j - 1, i + 1],
        [j + 0, i - 1],
        [j + 0, i + 1],
        [j + 1, i - 1],
        [j + 1, i],
        [j + 1, i + 1],
    ];
    // console.log(cells.length);
    // console.log(
    //     ni.map(([j, i]) => [
    //         j,
    //         i,
    //         rows,
    //         cols,
    //         mod(j, rows),
    //         mod(i, cols),
    //         mod(j, rows) * rows + mod(i, cols),
    //     ])
    // );
    const c = ni.filter(([j, i]) =>
        ensure(cells[mod(j, rows) * cols + mod(i, cols)])
    ).length;

    let c2 = 0;
    ni.forEach(([j, i]) => {
        if (j < 0) j = rows + j;
        if (j >= rows) j = j % rows;
        if (i < 0) i = cols + i;
        if (i >= cols) i = i % cols;
        const v = ensure(cells[j * cols + i]);
        if (v) c2++;
    });

    if (c !== c2) throw new Error(`Mismatch ${c} ${c2}`);

    return c;
};
