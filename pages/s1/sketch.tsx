import p5Types from "p5";
import { color, p5c } from "utils/colorsjs";
import { ensure } from "utils/ensure";
import { randomInt } from "utils/random";

interface SketchState {
    /** Number of cell rows */
    rows: number;
    /** Number of cell columns */
    cols: number;
    /**
     * Each cell tracks whether or not a particular location is "alive"
     *
     * We're doing a "game of life" simulation here.
     */
    cells: boolean[][];
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

export const initState = (p5: p5Types) => {
    const cols = Math.floor(p5.width / cellD);
    const rows = Math.floor(p5.height / cellD);

    const cells = [...Array(rows)].map(() => Array(cols).fill(false));

    setInitialPattern(cells);

    return { cols, rows, cells };
};

export const setInitialPattern = (cells: boolean[][]) => {
    const safeSet = (x: number, y: number) => {
        const row = cells[y];
        if (!row) return;
        if (y <= row.length) {
            row[x] = true;
        }
    };

    const rows = cells.length;
    const cols = cells[0]?.length ?? 0;

    // Randomly fill some positions
    [...Array(70)].forEach(() => safeSet(randomInt(cols), randomInt(rows)));
};

/**
 * Simulate a game of life.
 */
export const draw = (p5: p5Types) => {
    if (!state) state = initState(p5);
    const s = ensure(state);

    p5.clear();

    // Starting position [x, y] of the first cell
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

    p5.translate(offset(p5.width, s.cols), offset(p5.height, s.rows));

    p5.strokeWeight(5);

    s.cells.forEach((row, j) => {
        row.forEach((isAlive, i) => {
            // Coordinates of the starting corner of the rectangle that covers
            // the drawing area we have for the cell.
            const x = i * cellD;
            const y = j * cellD;
            // This is apparently causing a FPS drop, but that's fine, we won't
            // need it later on.
            // p5.rect(x, y, cellD, cellD);
            p5.stroke(isAlive ? aliveColorP5 : inactiveColorP5);
            p5.point(x + cellD / 2, y + cellD / 2);
        });
    });
};

const offset = (availableSpace: number, count: number) => {
    const extra = availableSpace - count * cellD;
    if (extra <= 0) return 0;
    return extra / 2;
};
