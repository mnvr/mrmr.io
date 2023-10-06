import type { Sketch } from "@p5-wrapper/react";
import { color, p5c } from "utils/colorsjs";
import { ensure } from "utils/ensure";
import { mod } from "utils/math";

/**
 * Dimensions of the (covering) rectangle used by each cell.
 */
const cellD = 10;

/**
 * The color to use for drawing alive cells.
 */
const aliveColor = color("oklch(97% 0.242 151.39)");

/**
 * The color to use for drawing inactive cells.
 */
const inactiveColor = color("oklch(77% 0.242 151.39 / 0.75)");

/**
 * Cache P5 representations of some of the fixed colors that we use to avoid
 * recreating them each loop.
 */
const aliveColorP5 = p5c(aliveColor);
const inactiveColorP5 = p5c(inactiveColor);

/**
 * Simulate a game of life.
 */
export const sketch: Sketch = (p5) => {
    /** Number of rows ("y" or "j" values)  in `cells` */
    let rows: number;
    /** Number of columns ("x" or "i") in `cells` */
    let cols: number;
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
    let cells: boolean[];

    p5.setup = () => {
        p5.createCanvas(...sketchSize());

        p5.frameRate(25);

        rows = Math.floor(p5.height / cellD);
        cols = Math.floor(p5.width / cellD);

        cells = makeCells();

        // Start with a R-pentomino at the center of the board.
        const [cj, ci] = [Math.floor(rows / 2), Math.floor(cols / 2)];
        addRPentomino(cj, ci);
    };

    /**
     * Create a sketch that fills the entire window (the first screenful of it).
     */
    const sketchSize = (): [number, number] => {
        return [p5.windowWidth, p5.windowHeight];
    };

    p5.windowResized = () => p5.resizeCanvas(...sketchSize());

    /** Return a cells array initialized to all false values */
    const makeCells = (): boolean[] => Array(rows * cols).fill(false);

    /**
     * Set the cell at row j and col i in the given cells array to true.
     *
     * nb: The `cells` variable shadows the `cells` in the environment above,
     * allowing us to pass a different cells array that we want to modify.
     */
    const setCell = (cells: boolean[], j: number, i: number) =>
        (cells[j * cols + i] = true);

    /**
     * Add an R-pentomino at the given coordinates (indicated by the capital X
     * below):
     *
     *       xx
     *      xX
     *       x
     *
     */
    const addRPentomino = (j: number, i: number) => {
        setCell(cells, j - 1, i + 0);
        setCell(cells, j - 1, i + 1);
        setCell(cells, j + 0, i - 1);
        setCell(cells, j + 0, i + 0);
        setCell(cells, j + 1, i + 0);
    };

    /** Introduce another R-pentomino when the user clicks the sketch */
    p5.mouseClicked = () => {
        console.log(p5.mouseX, p5.mouseY);
        const [cj, ci] = [Math.floor(rows / 2), Math.floor(cols / 2)];
        addRPentomino(cj, ci);
    };

    p5.draw = () => {
        p5.clear();

        const next = makeCells();

        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                const c = aliveNeighbourCount(j, i);

                const isAlive = ensure(cells[j * cols + i]);
                let nextIsAlive = false;

                if (isAlive) {
                    // Staying alive
                    //
                    // If a cell is alive and has exactly 2 or 3 live
                    // neighbours, it stays alive.
                    if (c === 2 || c === 3) nextIsAlive = true;
                } else {
                    // Birth
                    //
                    // If a cell is inactive, it'll become alive if it has
                    // exactly 3 live neighbours.
                    if (c === 3) nextIsAlive = true;
                }

                if (nextIsAlive) setCell(next, j, i);

                // Coordinates of the starting corner of the rectangle that
                // covers the drawing area we have for the cell.
                const x = i * cellD;
                const y = j * cellD;

                p5.stroke(isAlive ? aliveColorP5 : inactiveColorP5);
                if (isAlive) {
                    p5.strokeWeight(2 * c);
                } else {
                    p5.strokeWeight(4);
                }
                p5.point(x + cellD / 2, y + cellD / 2);
            }
        }

        cells = next;
    };

    /**
     * Translate to the starting position of the first cell
     *
     * Offsetting (translating) the origin is needed for 2 cases:
     *
     * - If the number of rows and cols don't exactly cover the width and height
     *   of the canvas – the leftover would cause the cells not to appear "off"
     *   if we'd start drawing them from 0, 0. In such cases, we'll offset to
     *   half of the remaining space, so that the cells that are visible are
     *   centered within the available space.
     *
     * - The canvas might get resized since we began. There are multiple ways to
     *   handle this: the approach we take is that our cols and rows (and the
     *   cells matrix) stay fixed, but we center them within the new area (if
     *   the canvas got larger) or just let the tails clip (if the canvas got
     *   smaller).
     *
     * This translation takes care of both these scenarios.
     */
    const translateOrigin = () =>
        p5.translate(offset(p5.width, cols), offset(p5.height, rows));

    const offset = (availableSpace: number, count: number) => {
        const extra = availableSpace - count * cellD;
        if (extra <= 0) return 0;
        return extra / 2;
    };

    /**
     * Return a count of the number of neighbours of the cell at row j and col i
     * that are alive.
     */
    const aliveNeighbourCount = (j: number, i: number) => {
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
        return ni.filter(([j, i]) => cells[mod(j, rows) * cols + mod(i, cols)])
            .length;
    };
};
