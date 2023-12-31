import { type P5CanvasInstance, type Sketch } from "@p5-wrapper/react";

/**
 * A function that is called for drawing each cell.
 *
 * This will be called for each cell, passing it the p5 instance, the cell
 * specific data, and the overall grid shape. This is modeled somewhat similarly
 * to WebGL fragment shaders, although much (much) more coarse.
 */
export type CellShader = (params: CellShaderParams) => void;

/**
 * Data representing each cell.
 *
 * A cell has a fixed position in the grid, which can be read off from here.
 */
export interface Cell {
    /**
     * The vertical index of the cell
     *
     * This ranges from 0 to {@link Grid.n} across all the cells.
     */
    row: number;
    /**
     * The horizontal index of the cell
     *
     * This ranges from 0 to {@link Grid.n} across all the cells.
     */
    col: number;
}

/**
 * Parameters passed to the {@link CellShader} when invoking it during
 * {@link drawCell}.
 */
export interface CellShaderParams {
    /**
     * The p5 instance to use
     *
     * This is the same as the {@link P5CanvasInstance} passed to the actual
     * {@link Sketch} type that we'll be drawing on the screen.
     */
    p5: P5CanvasInstance;
    /**
     * X coordinate for the top left corner of the cell.
     *
     * Increases towards the right.
     */
    x: number;
    /**
     * Y coordinate for the top left corner of the cell.
     *
     * Increases as we go down.
     */
    y: number;
    /**
     * Size / dimension / width / height of the cell.
     *
     * The cells are all squares.
     */
    s: number;
    /**
     * Data about the cell itself.
     */
    cell: Cell;
}

/**
 * A function that is called once (per frame) for doing any background drawing
 * or clearing before we start drawing each cell.
 */
export type GridShader = (params: GridShaderParams) => void;

/**
 * Parameters passed to the {@link GridShader} when invoking it during
 * {@link drawGrid}.
 */
export interface GridShaderParams {
    /**
     * The p5 instance to use
     */
    p5: P5CanvasInstance;
}

/**
 * Parameters passed to {@link gridSketch}. See {@link defaultParams} for their
 * default values.
 */
export interface GridSketchParams {
    /**
     * The most important bit - a function to call for drawing each cell.
     *
     * See the documentation of {@link CellShader} for more info.
     */
    drawCell?: CellShader;

    /**
     * A function to prepare the grid before we start drawing each cell.
     *
     * See the documentation of {@link GridShader} for more info.
     *
     * The default implementation clears the canvas.
     */
    drawGrid?: GridShader;

    /**
     * Number of cells per axis
     *
     * This is the number of rows, and the number of columns, in the grid.
     *
     * We might not end up showing all of these - the sizing algorithm when
     * showing our sketch on the canvas is a "size to fill" (and we also require
     * some minimum overflow), which means that there may be that cells that lie
     * completely outside the canvas and do not get shown.
     *
     * We will also show one more than this on alternate rows when we're drawing
     * in the staggered configuration.
     *
     * Default is 13.
     */
    n?: number;

    /**
     * If true, then the grid will be drawn "staggered" by offsetting alternate
     * rows by half a cell width.
     *
     * This will cause the rectangular bounds of the cells to overlap, but if
     * the cells draw themselves in the "rotated" square area instead, they can
     * produce an isometric-grid like result.
     *
     * Default is `false`.
     */
    staggered?: boolean;
}

/**
 * A default implementation for {@link drawCell} that draws a square covering
 * the entire cell and fills it with a shade of gray. This square also has the
 * default p5 stroke.
 */
const defaultCellShader: CellShader = ({ p5, x, y, s }) => {
    p5.fill(170);
    p5.rect(x, y, s, s);
};

/**
 * A default implementation for {@link drawGrid} that clears the canvas.
 */
const defaultGridShader: GridShader = ({ p5 }) => {
    p5.clear();
};

export const defaultParams: Required<GridSketchParams> = {
    drawCell: defaultCellShader,
    drawGrid: defaultGridShader,
    n: 13,
    staggered: false,
};

/**
 * Create a new grid based sketch.
 *
 * The `gridSketch` function returns a new {@link Sketch} that uses the provided
 * params to draw on a p5 canvas by calling the {@link drawCell} function for
 * each cell in the grid. The other parameters in {@link GridSketchParams}
 * define the shape and size of the grid, and other customization options.
 *
 * @param param An instance of {@link GridSketchParams}. See the documentation
 * for the individual properties of {@link GridSketchParams} for more details.
 * All of them are optional.
 */
export const gridSketch = (params?: GridSketchParams): Sketch => {
    const paramsOrDefault: Required<GridSketchParams> = {
        ...defaultParams,
        ...params,
    };

    const { drawCell, drawGrid, n, staggered } = paramsOrDefault;

    /**
     * The number of rows and columns in the grid.
     *
     * This is the thing that is usually fixed for a grid. At runtime, we then
     * distribute the available width and height and compute the size of the
     * individual cells ({@link cellSize}).
     */
    let cellCount = { x: n + (staggered ? 1 : 0), y: n };

    /**
     * The size (both width and height) of an individual cell in the grid.
     *
     * This value will be computed based on the actual canvas size and
     * {@link cellCount}.
     */
    let cellSize = 0;

    /**
     * Offset (negative) from the canvas edge to where we start drawing cells.
     *
     * `cellSize * cellCount` will generally not cover the entire canvas, for a
     * few reasons:
     *
     * - `cellSize` is integral, but the width (or height) divided by the
     *   cellCount might not be integral.
     *
     * - The width and height of the canvas might be different, in which case
     *   the `cellSize * cellCount` will exceed the smaller dimension.
     *
     * - When drawing in the staggered configuration, we draw one extra cell per
     *   row so that the grid doesn't have any empty space at the corners even
     *   when we're starting every alternate row half a cell ahead.
     *
     * To account for all these factors, we start drawing from an offset that is
     * half of the extra space. This way, there is a similar half-drawn cell at
     * both ends, and the grid overall looks (uniformly) clipped and centered.
     */
    let cellOffset = { x: 0, y: 0 };

    /**
     * Note: [Handling "spurious" window resizes on mobile browsers]
     *
     * On mobile browsers (I can observe this on Safari, but it also apparently
     * happens on Chrome), the frame of the browser gets adjusted as we scroll.
     * e.g. on Safari initially there is a big navigation bar at the bottom, but
     * as we scroll along the page, this navigation bar collapses down to a
     * smaller one in the safe area.
     *
     * This is all expected, that's why the concept of svh and lvh were added in
     * addition of vh to capture this varying window size.
     * https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units
     *
     * The problem is - this also causes the `windowResized` event below to
     * fire. From our current perspective, this is a "spurious" resize, and it
     * causes the canvas cell sizes to shift around a bit disorientingly.
     *
     * Now, maybe there is a more principled way of filtering these out, but
     * since I don't have immediate access to the other mobile browsers and
     * can't test things out there, I'll go with a more hammer-on approach that
     * should work in all such situations - just ignore any new window sizes
     * that have the same width as the previous window size we encountered.
     */
    let previousWindowSize = { width: 0 };

    const setup = (p5: P5CanvasInstance) => {
        previousWindowSize.width = p5.windowWidth;
        p5.createCanvas(...sketchSize(p5));
        updateSizes(p5);
    };

    const windowResized = (p5: P5CanvasInstance) => {
        if (shouldIgnoreWindowResizedEvent(p5)) return;
        p5.resizeCanvas(...sketchSize(p5));
        updateSizes(p5);
    };

    /** See: [Handling "spurious" window resizes on mobile browsers] */
    const shouldIgnoreWindowResizedEvent = (p5: P5CanvasInstance) => {
        const width = p5.windowWidth;
        if (width === previousWindowSize.width) return true;
        previousWindowSize.width = width;
        return false;
    };

    /**
     * Compute the size of the canvas.
     *
     * This is called both when initially creating the canvas, and also when the
     * window gets resized.
     *
     * Dynamically computing the size of the canvas with CSS queries by using
     * getComputedStyle etc introduces a perceptible delay until the first
     * layout. Maybe there is a way of doing it without that delay, but I
     * haven't found it yet.
     *
     * So our implementation uses only p5.windowWidth and p5.windowHeight
     * properties. This of course results in a size that is not a snug fit, but
     * we handle that by structuring our layout such that it admits a canvas of
     * sizes that are in the same ballpark but not exact.
     */
    const sketchSize = (
        p5: P5CanvasInstance,
    ): [width: number, height: number] => {
        let [w, h] = [p5.windowWidth, p5.windowHeight];
        // Account for the (fixed size) banner at the top, and the slight margin
        // at the bottom of the fold since it is 98svh, not 100vh.
        h -= 90;
        // Don't risk a scrollbar
        w -= 2;
        // Clamp
        h = p5.min(h, 900);
        w = p5.min(w, 900);
        return [w, h];
    };

    /**
     * Called whenever the width and height of the sketch is updated, including
     * the first time when the sketch is created.
     */
    const updateSizes = (p5: P5CanvasInstance) => {
        // See the documentation of cellOffset for more details about what we're
        // trying to do here.

        const minDimension = p5.max(p5.width, p5.height);
        cellSize = p5.ceil(minDimension / n);

        let remainingX = p5.width - cellSize * cellCount.x;
        let remainingY = p5.height - cellSize * cellCount.y;
        cellOffset = { x: remainingX / 2, y: remainingY / 2 };
    };

    const draw = (p5: P5CanvasInstance) => {
        drawGrid({ p5 });

        let py = cellOffset.y;
        for (let y = 0; y < cellCount.y; y++) {
            let px = cellOffset.x;
            if (staggered && y % 2 === 0) px -= cellSize / 2;
            for (let x = 0; x < cellCount.x; x++) {
                const cell = { row: y, col: x };
                drawCell({ p5, x: px, y: py, s: cellSize, cell });
                px += cellSize;
            }
            py += cellSize;
        }
    };

    return (p5) => {
        p5.setup = () => setup(p5);
        p5.windowResized = () => windowResized(p5);
        p5.draw = () => draw(p5);
    };
};
