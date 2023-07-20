import p5Types from "p5";
import { ensure } from "utils/ensure";

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
        if (row.length <= y) {
            row[x] = true;
        }
    };
    safeSet(4, 4);
};

/**
 * Simulate a game of life.
 */
export const draw = (p5: p5Types) => {
    if (!state) state = initState(p5);
    const s = ensure(state);

    p5.clear();
    p5.background(250);

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

    s.cells.forEach((row, j) => {
        row.forEach((cell, i) => {
            // Coordinates of the starting corner of the rectangle that covers
            // the drawing area we have for the cell.
            const x = i * cellD;
            const y = j * cellD;
            // This is apparently causing a FPS drop, but that's fine, we won't
            // need it later on.
            p5.rect(x, y, cellD, cellD);
            dot(p5, x + cellD / 2, y + cellD / 2);
        });
    });
};

const offset = (availableSpace: number, count: number) => {
    const extra = availableSpace - count * cellD;
    if (extra <= 0) return 0;
    return extra / 2;
};

const dot = (p5: p5Types, x: number, y: number) => {
    p5.push();
    p5.stroke(0);
    p5.strokeWeight(5);
    p5.point(x, y);
    p5.pop();
};
