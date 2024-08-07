import type { Sketch, SketchProps } from "@p5-wrapper/react";
import { color, p5c } from "utils/colorsjs";
import { ensure } from "utils/ensure";

type SketchProps_ = SketchProps & {
    /**
     * If true, animate this sketch. Otherwise this is a static sketch, we draw
     * it once and then stop re-rendering.
     */
    animate?: boolean;
    /**
     * The pattern to render.
     *
     * The pattern should consist of lines. Each line should have the character
     * '*' to indicate a filled-in cell, and the character '-' to indicate an
     * empty one. The number of lines becomes the number of rows, and the number
     * of characters in each line become the number of colums.
     *
     * It is an error to have lines with different number of characters.
     */
    pattern: string;
};

/** The color to use for drawing set cells, at its maximum alpha. */
const setCellColorMax = color("oklch(54% 0.22 29)");

/** The color to use for drawing unset cells, at its maximum alpha. */
const unsetCellColorMax = color("oklch(97% 0.09 105)");

/**
 * Draw pieces on a chessboard.
 */
export const sketch: Sketch<SketchProps_> = (p5) => {
    /**
     * Number of rows ("y" or "j" values) on the checker-board / chess-board.
     */
    let rows: number;
    /**
     * Number of columns ("x" or "i") on the checker-board / chess-board.
     */
    let cols: number;

    /**
     * Dimensions of the (covering) rectangle used by each cell.
     */
    let cellD: number;

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
    let cells: boolean[];

    /** Animate the sketch if this is true. Comes from props. */
    let animate = false;

    /**
     * Cached P5 representations of some of the fixed colors that we use to
     * avoid recreating them each loop.
     */
    const setCellColorP5 = p5c(setCellColorMax);

    p5.setup = () => p5.createCanvas(...sketchSize());

    /**
     * Create a squared sized sketch with the same dimension as the horizontal
     * span of the text in the paragraphs of EssayContainer.
     */
    const sketchSize = (): [number, number] => {
        // Select the first paragraph in essay-container.
        const para = ensure(
            window.document.querySelector("#essay-container p"),
        );
        // We cannot use the p5.select().size() method to obtain the width
        // because it needs to account for the padding.
        //
        // Both the paragraphs, and the canvas elements that host these
        // sketches, have an (the same) inline padding. So we need to use the
        // getComputedStyle method to take that into account.
        //
        // Unfortunately, this seems to introduce a perceptible delay before the
        // canvas initially gets rendered.
        const style = window.getComputedStyle(para); // e.g. "378px"
        const width = parseFloat(style.width);

        const d = width / 2;

        return [d, d];
    };

    p5.windowResized = () => {
        p5.resizeCanvas(...sketchSize());
        updateDimensions();
        if (!animate) p5.redraw();
    };

    const updateDimensions = () => {
        cellD = Math.min(
            Math.floor(p5.height / rows),
            Math.floor(p5.width / cols),
        );
    };

    p5.updateWithProps = (props) => {
        animate = props.animate === true;
        parsePattern(props.pattern);
        updateDimensions();
    };

    /**
     * Parse the given string to initialize `cells` (a 1D representation of a
     * grid, with each cell indicating a boolean on/off state).
     *
     * Also set `rows` and `cols`.
     *
     * See the {@link pattern} property in {@link SketchProps_} for a detailed
     * description of the format that this pattern string should adhere to.
     */
    const parsePattern = (pat: string) => {
        const lines = pat.split(/\s+/).filter((line) => line.length > 0);

        rows = lines.length;
        cols = ensure(lines[0]).length;

        cells = makeCells();

        for (let j = 0; j < rows; j++) {
            const line = ensure(lines[j]);
            if (line.length !== cols)
                throw new Error(`Invalid pattern with unequal lines: ${pat}`);

            for (let i = 0; i < cols; i++) {
                if (line[i] === "*") setCell(j, i);
            }
        }
    };

    /** Return a cells array initialized to all false values */
    const makeCells = (): boolean[] => Array(rows * cols).fill(false);

    /** Set the cell at row j and col i of the cells array to true. */
    const setCell = (j: number, i: number) => (cells[j * cols + i] = true);

    p5.draw = () => {
        p5.clear();
        p5.strokeWeight(0);

        const d = linear(p5.millis() / (1000 * 32));
        const unsetCellColor = unsetCellColorMax.clone();
        unsetCellColor.darken(1 - d);
        const unsetCellColorP5 = p5c(
            animate ? unsetCellColor : unsetCellColorMax,
        );

        translateOrigin();

        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                // The state of the cell.
                const cs = ensure(cells[j * cols + i]);

                // Coordinates of the starting corner of the rectangle that
                // covers the drawing area we have for the cell.
                const y = j * cellD;
                const x = i * cellD;

                const rs = cornerRadii(2, cs, j, i);

                p5.fill(cs ? setCellColorP5 : unsetCellColorP5);
                p5.rect(x, y, cellD, cellD, ...rs);
            }
        }

        if (!animate) p5.noLoop();
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
     *
     * For this sketch, the contents are left aligned, so the offset is only
     * applied in the vertical direction.
     */
    const translateOrigin = () => p5.translate(0, offset(p5.height, rows));

    const offset = (availableSpace: number, count: number) => {
        const extra = availableSpace - count * cellD;
        if (extra <= 0) return 0;
        return extra / 2;
    };

    /**
     * Return the corner radii to use when drawing the rectangle representing
     * this cell. The corner radii is set to the default value, unless there is
     * a neighbouring cell that has the same state as us.
     *
     * @param r The default corner radius to use.
     * @param state The state of the cell.
     * @param j The row of the cell under consideration.
     * @param i The column of the cell under consideration.
     * */
    const cornerRadii = (r: number, state: boolean, j: number, i: number) => {
        // If any of the neighbouring cells has the same state as this cell then
        // turn off the corner radius for edges on that side to create a smooth,
        // single figure for each neighbourhood.
        //
        // * The radii start with the top-left and move clockwise.
        let rs = [r, r, r, r];

        // * Previous row
        if (hasState(state, j - 1, i)) rs[0] = rs[1] = 0;
        // * Next column
        if (hasState(state, j, i + 1)) rs[1] = rs[2] = 0;
        // * Next row
        if (hasState(state, j + 1, i)) rs[2] = rs[3] = 0;
        // * Previous column
        if (hasState(state, j, i - 1)) rs[3] = rs[0] = 0;

        return rs;
    };

    /**
     * Return true if the cell at row j and col i of the cells array is set to
     * `state`.
     *
     * For out of bounds cells, return false.
     *
     * @param state The cell state to compare to.
     */
    const hasState = (state: boolean, j: number, i: number) => {
        if (j < 0 || j >= rows) return false; // out of bounds
        if (i < 0 || i >= cols) return false; // out of bounds
        return cells[j * cols + i] === state;
    };
};

/**
 * Convert an positive number to a linear oscillation between 0-1.
 *
 * This is intended to only work with (scaled) p5.millis values.
 */
const linear = (t: number) => {
    t = t % 2;
    return t > 1 ? 2 - t : t;
};
