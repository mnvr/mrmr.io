import { type P5CanvasInstance, type Sketch } from "@p5-wrapper/react";

/**
 * A function that is called for drawing each cell.
 *
 * This will be called for each cell, passing it the p5 instance, the cell
 * specific data, and the overall grid shape. This is modeled somewhat similarly
 * to WebGL fragment shaders, although much (much) more coarse.
 *
 * @param p5 an instance of {@link P5CanvasInstance}. This is the same as the p5
 * instance passed to the actual {@link Sketch} type that we'll be drawing on
 * the screen.
 *
 */
export type CellShader = (p5: P5CanvasInstance) => never;

export interface GridSketchParams {
    /**
     * The most important bit - a function to call for drawing each cell.
     *
     * See the documentation of {@link CellShader} for more info.
     */
    drawCell?: CellShader;

    /**
     * The number of cells per axis
     *
     * This is the number of rows, and the number of columns, in the grid.
     *
     * Note that we might not end up showing all of these - the sizing algorithm
     * when showing our sketch on the canvas is a "size to fill" (and we also
     * require some minimum overflow), which means that at least some, if not
     * many, cells will be outside the canvas viewport and not get shown.
     * However, the {@link drawCell} method will still be called for all the
     * cells - this is to ensure that they get to update their state in sync
     * with the other cells.
     *
     * Default is 13.
     */
    cellsPerAxis?: number;
}

/**
 * Create a new grid based sketch
 *
 * The `gridSketch` function returns a new {@link Sketch} that uses the provided
 * params to draw on a p5 canvas by calling the {@link drawCell} function for
 * each cell in the grid. The other parameters in {@link GridSketchParams}
 * define the shape and size of the grid.
 *
 * @param param An instance of {@link GridSketchParams}. See the documentation
 * for the individual properties of {@link GridSketchParams} for more details.
 * All of them are optional.
 */
export const gridSketch = (params?: GridSketchParams): Sketch => {
    /**
     * The number of rows and columns in the grid.
     *
     * This is the thing that is usually fixed for a grid. At runtime, we then
     * distribute the available width and height and compute the size of the
     * individual cells ({@link cellSize}).
     */
    let cellCount = { x: 13, y: 13 };

    /**
     * The size (both width and height) of an individual cell in the grid.
     *
     * This value will be computed based on the actual canvas size and
     * {@link cellCount}. The starting value 100 below is just a placeholder.
     */
    let cellSize = 100;

    /**
     * Offset (usually negtive) after which we should start drawing the first
     * cell in a row (ditto for the first cell in a column).
     *
     * `cellSize * cellCount` will generally not cover the entire canvas.
     * This'll be for two reasons:
     *
     * - `cellSize` is integral, but the width (or height) divided by the
     *   cellCount might not be integral.
     *
     * - The width and height of the canvas might be different, in which case
     *   the `cellSize` is computed such that we get a "size-to-fill" sort of
     *   behaviour. This means that on one of the axes, the last drawn cell
     *   might not be actually the last cell, and it might not even be drawn
     *   fully.
     *
     * To make things aesthetically more pleasing without having a more
     * complicated sizing algorithm, what we do is that we start drawing from an
     * offset, so that there is a similar half-drawn cell at both ends, and the
     * grid overall looks (uniformly) clipped and centered.
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
        const minDimension = p5.max(p5.width, p5.height);
        // Currently we support only cells that are sized the same both in width
        // and height. To keep things simple, we also require that the number of
        // expected rows and columns is the same.
        console.assert(cellCount.x == cellCount.y);
        cellSize = p5.ceil(minDimension / cellCount.x);

        // This'll be negative, which is what we want.
        let remainingX = p5.width - cellSize * cellCount.x;
        let remainingY = p5.height - cellSize * cellCount.y;
        cellOffset = { x: remainingX / 2, y: remainingY / 2 };
    };

    const draw = (p5: P5CanvasInstance) => {
        p5.background(40);

        for (let y = 0; y < cellCount.y; y++) {
            for (let x = 0; x < cellCount.x; x++) {
                let px = x * cellSize + cellOffset.x;
                let py = y * cellSize + cellOffset.y;
                p5.fill(170);
                p5.rect(px, py, cellSize, cellSize);
            }
        }
    };

    return (p5) => {
        p5.setup = () => setup(p5);
        p5.windowResized = () => windowResized(p5);
        p5.draw = () => draw(p5);
    };
};
