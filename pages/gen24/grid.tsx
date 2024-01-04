import {
    SketchProps,
    type P5CanvasInstance,
    type Sketch,
} from "@p5-wrapper/react";
import { ensure } from "utils/ensure";

type DefaultState = undefined;

/**
 * A function that is called for drawing each cell.
 *
 * This will be called for each cell, passing it the p5 instance, the cell
 * specific data, and the overall grid shape. This is modeled somewhat similarly
 * to WebGL fragment shaders, although much (much) more coarse.
 */
export type CellShader<S = DefaultState> = (
    params: CellShaderParams<S>,
) => void;

/**
 * Data representing each cell.
 *
 * A cell has a fixed position in the grid, which can be read off from here.
 */
export interface Cell {
    /**
     * The vertical index of the cell
     *
     * This ranges from 0 to {@link Grid.rowCount}` - 1` across all the cells.
     */
    row: number;
    /**
     * The horizontal index of the cell
     *
     * This ranges from 0 to {@link Grid.colCount}` - 1` across all the cells.
     */
    col: number;
}

/**
 * Parameters passed to the {@link CellShader} when invoking it during
 * {@link drawCell}.
 *
 * The generic type variable `S` parameterizes the state threaded through the
 * {@link gridSketch}.
 */
export interface CellShaderParams<S> {
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
     * "Side" of the cell.
     *
     * If cells are is a square (i.e. the {@link cellAspectRatio} is 1), then
     * this value will be set to the width and the height (both are the same).
     *
     * If the aspect ratio is not 1, then this value will be the larger of the
     * two dimensions. This is useful when drawing outside the alloted cell
     * bounds.
     *
     * Note: We also have separate access to the cell width ({@link w}) and
     * height ({@link h}).
     */
    s: number;
    /**
     * Width of the cell.
     */
    w: number;
    /**
     * Height of the cell.
     */
    h: number;
    /**
     * Data about the cell being drawn.
     */
    cell: Cell;
    /**
     * Data about the entire grid.
     */
    grid: Grid;
    /**
     * Arbitrary, sketch dependent state passed to all the drawCall calls.
     *
     * The {@link drawGrid} function can change this state when needed.
     *
     * While this value is typed as `undefined` to make it easier to create
     * sketches that don't have any state, for sketches that do create and
     * return a state from {@link drawGrid}, this value is guaranteed to be
     * present. It is a pending improvement to make the types reflect this
     * guarantee.
     */
    state?: S;
}

/** A two tuple represeting a location */
export interface Coordinate {
    x: number;
    y: number;
}

/**
 * A 4 tuple representing a rectangular area.
 *
 * By convention, the bounds are inclusive.
 */
export interface CoordinateRect {
    topLeft: Coordinate;
    bottomRight: Coordinate;
}

/**
 * Return true if the given `coordinate` falls within `rect`.
 *
 * The bounds of the rect are considered inclusive.
 */
export const isCoordinateInRect = (
    { x, y }: Coordinate,
    rect: CoordinateRect,
) =>
    x >= rect.topLeft.x &&
    y >= rect.topLeft.y &&
    x <= rect.bottomRight.x &&
    y <= rect.bottomRight.y;

/**
 * Data representing the grid itself.
 *
 * A grid has `cols` * `rows` {@link Cell}s.
 */
export interface Grid {
    /**
     * The number of rows in the grid (vertical indexes).
     *
     * Note that not all the cells might be fully visible. At the edges, some of
     * them might even be completely occluded.
     */
    rowCount: number;
    /**
     * The number of columns in the grid (horizontal indexes).
     *
     * Note that not all the cells might be fully visible. At the edges, some of
     * them might even be completely occluded.
     */
    colCount: number;
    /**
     * The visible area of the grid
     *
     * This is a rectangle covering the area from the first (fully) visible cell
     * to the last (fully) visible one.
     */
    visibleRect: CoordinateRect;
}

/**
 * A function that is called once (per frame) for doing any background drawing
 * or clearing before we start drawing each cell.
 *
 * It will be passed a arbitrary, sketch specific state (of type `S`) as part of
 * the parameters. This value will be undefined initially, so this function
 * should use that as a cue to make and return the initial state.
 *
 * The state will also be reset again to undefined if the size of the canvas
 * changes, so this function should be prepared to initialize it again.
 *
 * The state return by it will be saved, and then be passed on to subsequent
 * {@link drawCell} calls, and then to the next drawGrid invocation itself.
 */
export type GridShader<S = DefaultState> = (
    params: GridShaderParams<S>,
) => S | undefined;

/**
 * Parameters passed to the {@link GridShader} when invoking it during
 * {@link drawGrid}.
 *
 * The generic type variable `S` parameterizes the state threaded through the
 * {@link gridSketch}.
 */
export interface GridShaderParams<S> {
    /**
     * The p5 instance to use
     */
    p5: P5CanvasInstance;
    /**
     * Data about the grid itself.
     */
    grid: Grid;
    /**
     * The environment in which the grid is being shown.
     */
    env: Env;
    /**
     * The current value of the state threaded through the {@link gridSketch}.
     *
     * This will be `undefined` for the first call to `drawGrid`. It will also
     * become `undefined` again if the size of the canvas changes.
     *
     * The value returned by `drawGrid` becomes the new state that will then be
     * passed to the next invocation.
     */
    state?: S;
}

/**
 * Data about the environment in which the grid sketch is being rendered.
 */
export interface Env {
    /** True if `@media (prefers-color-scheme: dark)` is true.  */
    isDarkMode: boolean;
}

/**
 * Parameters passed to {@link gridSketch}. See {@link defaultParams} for their
 * default values.
 *
 * The generic parameter S parameterizes the grid state that is threaded through
 * the {@link drawGrid} and {@link drawCell} calls, and can be modified by
 * {@link drawGrid} by returning a new value.
 */
export interface GridSketchParams<S> {
    /**
     * The most important bit - a function to call for drawing each cell.
     *
     * See the documentation of {@link CellShader} for more info.
     */
    drawCell?: CellShader<S>;

    /**
     * A function to prepare the grid before we start drawing each cell.
     *
     * See the documentation of {@link GridShader} for more info.
     *
     * The default implementation clears the canvas.
     */
    drawGrid?: GridShader<S>;

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

    /**
     * If true, then we disable animations. The cells don't update after being
     * drawn once (unless the canvas is resized).
     *
     * For static grids, turning animations off reduces CPU load for the page.
     *
     * Default is `false`. Apologies for the double negation, but that means
     * that by default, animations are enabled.
     */
    noLoop?: boolean;

    /**
     * The aspect ratio of each cell.
     *
     * This is the ratio between width and height of each cell.
     *
     * - If it is less than 1, then the width of the cell, w = h * 0.x, is less
     *   than its height (i.e., the cell is in "portrait mode").
     *
     * - If it is 1, then the width and the height are the same.
     *
     * - If it is more than 1, then the width of the cell, w = h * 1.x, is more
     *   than the height (i.e., the cell is in "landscape mode").
     *
     * Default is 1.
     */
    cellAspectRatio?: number;

    /**
     * If true, overlay the guidelines and the center point of each cell on top
     * of the final result. This is useful when working on a sketch.
     *
     * Default is `false`.
     */
    showGuides?: boolean;
}

/**
 * A default implementation for {@link drawCell} that draws a square covering
 * the entire cell and fills it with a shade of gray. This square also has the
 * default p5 stroke.
 */
function defaultCellShader<S>({ p5, x, y, s }: CellShaderParams<S>) {
    // const defaultCellShader: CellShader = ({ p5, x, y, s }) => {
    p5.fill(160);
    p5.rect(x, y, s, s);
}

/**
 * A default implementation for {@link drawGrid} that clears the canvas.
 */
function defaultGridShader<S = DefaultState>({ p5 }: GridShaderParams<S>) {
    // function defaultGridShader<S>: GridShader = ({ p5 }) => {
    p5.clear();
    return undefined;
}

/**
 * Properties (browser state etc) passed to the Sketch by the the React
 * component that contains it.
 *
 * These will be passed to the Sketch that is _returned_ by the `gridSketch`
 * function.
 */
type GridSketchProps = SketchProps & {
    /** True if ``@media (prefers-color-scheme: dark)` is true */
    isDarkMode?: boolean;
};

/**
 * Create a new grid based sketch.
 *
 * The `gridSketch` function returns a new {@link Sketch} that uses the provided
 * params to draw on a p5 canvas by calling the {@link drawCell} function for
 * each cell in the grid. The other parameters in {@link GridSketchParams}
 * define the shape and size of the grid, and other customization options.
 *
 * The generic type variable `S` parameterizes the state threaded through the
 * {@link gridSketch}.
 *
 * @param param An instance of {@link GridSketchParams}. See the documentation
 * for the individual properties of {@link GridSketchParams} for more details.
 * All of them are optional.
 */
export function gridSketch<S = DefaultState>(
    params: GridSketchParams<S>,
    initialState?: S,
): Sketch<GridSketchProps> {
    const defaultParams: Required<GridSketchParams<S>> = {
        drawCell: defaultCellShader,
        drawGrid: defaultGridShader,
        n: 13,
        staggered: false,
        noLoop: false,
        cellAspectRatio: 1,
        showGuides: false,
    };

    const paramsOrDefault: Required<GridSketchParams<S>> = {
        ...defaultParams,
        ...params,
    };

    const {
        drawCell,
        drawGrid,
        n,
        staggered,
        noLoop,
        cellAspectRatio,
        showGuides,
    } = paramsOrDefault;

    /**
     * The sketch specific state.
     */
    let state = initialState;

    /**
     * The number of rows and columns in the grid.
     *
     * This is the thing that is usually fixed for a grid. At runtime, we then
     * distribute the available width and height and compute the size of the
     * individual cells ({@link cellSize}).
     *
     * While conceputally this is a fixed value, {@link n}, but because of
     * {@link staggered} and {@link cellAspectRatio}, the number of rows or the
     * number of colums may be more than {@link n}. So this value is also
     * computed at the same time when we're computing the cell sizes, in the
     * `updateSizes` function below.
     */
    let gridSize = { rowCount: 0, colCount: 0 };

    /**
     * The size of an individual cell in the grid.
     *
     * This value will be computed based on the actual canvas size and
     * {@link gridSize}.
     */
    let cellSize = { w: 0, h: 0 };

    /**
     * Offset (negative) from the canvas edge to where we start drawing cells.
     *
     * `cellSize * gridSize` will generally not cover the entire canvas, for a
     * few reasons:
     *
     * - `cellSize` is integral, but the width (or height) divided by the
     *   gridSize might not be integral.
     *
     * - The width and height of the canvas might be different, in which case
     *   the `cellSize * gridSize` will exceed the smaller dimension.
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
     *
     * This unfortunately leaves the case where someone is genuinely resizing
     * the window on a desktop browser. One option is to disregard this case: it
     * ain't happening too frequently, and any cleverness we do might cause the
     * mobile workaround to stop working (which is a bigger issue in practice).
     * For now, we consider any height changes of more than 150 px "real".
     */
    let previousWindowSize = { width: 0, height: 0 };

    /**
     * The environment.
     *
     * This is read-in from {@link GridSketchProps}.
     */
    let env: Env = { isDarkMode: false };

    /**
     * Update our local state when the custom props passed to the sketch change.
     */
    const updateWithProps = (p5: P5CanvasInstance, props: GridSketchProps) => {
        env.isDarkMode = props.isDarkMode ?? false;
    };

    const setup = (p5: P5CanvasInstance) => {
        previousWindowSize.width = p5.windowWidth;
        previousWindowSize.height = p5.windowHeight;
        p5.createCanvas(...sketchSize(p5));
        updateSizes(p5);
        if (noLoop) p5.noLoop();
    };

    const windowResized = (p5: P5CanvasInstance) => {
        if (shouldIgnoreWindowResizedEvent(p5)) return;
        p5.resizeCanvas(...sketchSize(p5));
        updateSizes(p5);
        state = undefined;
        if (noLoop) p5.redraw();
    };

    /** See: [Handling "spurious" window resizes on mobile browsers] */
    const shouldIgnoreWindowResizedEvent = (p5: P5CanvasInstance) => {
        const width = p5.windowWidth;
        const height = p5.windowHeight;
        if (width === previousWindowSize.width) {
            // If width is the same, and height change is less than 150, ignore
            // this "spurious" resize.
            if (p5.abs(height - previousWindowSize.height) < 150) return true;
        }
        previousWindowSize.width = width;
        previousWindowSize.height = height;
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
        // First compute the number of rows and colums. Then use that to
        // determine the size of cells.
        //
        // See the documentation of `gridSize` and `cellOffset` for more
        // details about what we're trying to do here.

        const r = cellAspectRatio;
        let [nx, ny] = [n, n];
        let [sw, sh] = [1, 1];
        let [cx, cy] = [n, n];

        // Deal with non-unit aspect ratios.
        if (r < 1) {
            // cell w < cell h, portrait cells, so we'll need more per row.
            nx = p5.floor(n / r);
            sh = 1 / r;
            cx = nx;
        } else if (r > 1) {
            // cell w >= cell h, landscape cells, so we'll need more per column.
            ny = p5.floor(n * r);
            // Because I'm doing math I don't understand, I need to add an extra
            // row here, otherwise on certain sketch sizes there is empty space
            // at the bottom.
            //
            // It has something to do with me using `p5.floor`, but `p5.ceil`
            // has the other issue - there is extra leftover space to the right.
            // Hence, for time being, we just duct tape a +1 to fend off any
            // potential leftover areas at the bottom.
            cy = ny + 1;
            sw = r;
        }

        const maxDimension = p5.max(p5.width, p5.height);
        const s = p5.ceil(maxDimension / p5.max(nx, ny));

        gridSize = { rowCount: cy, colCount: cx + (staggered ? 1 : 0) };
        cellSize = { w: s * sw, h: s * sh };

        let remainingX = p5.width - cellSize.w * gridSize.colCount;
        let remainingY = p5.height - cellSize.h * gridSize.rowCount;
        cellOffset = { x: remainingX / 2, y: remainingY / 2 };
    };

    const drawGuides = (p5: P5CanvasInstance) => {
        p5.push();

        p5.stroke(240, 200 /* alpha, 0 - 255 */);
        p5.strokeWeight(1);

        const { w, h } = cellSize;

        for (let y = cellOffset.y; y < p5.height; y += h) {
            p5.line(0, y, p5.width, y);
        }
        for (let x = cellOffset.x; x < p5.width; x += w) {
            p5.line(x, 0, x, p5.height);
        }

        p5.stroke("blue");
        p5.strokeWeight(4);

        for (let y = cellOffset.y + h / 2; y < p5.height; y += h) {
            for (let x = cellOffset.x + w / 2; x < p5.width; x += w) {
                p5.point(x, y);
            }
        }

        p5.pop();
    };

    const computeVisibleRect = (p5: P5CanvasInstance): CoordinateRect => {
        let firstVisible: Coordinate | undefined;
        let lastVisible: Coordinate | undefined;

        const { w, h } = cellSize;
        const gridRect = {
            topLeft: { x: 0, y: 0 },
            bottomRight: { x: p5.width - w, y: p5.height - h },
        };

        let py = cellOffset.y;
        for (let y = 0; y < gridSize.rowCount; y++, py += h) {
            let px = cellOffset.x;
            if (staggered && y % 2 === 0) px -= w / 2;
            for (let x = 0; x < gridSize.colCount; x++, px += w) {
                const pixelCoordinate = { x: px, y: py };
                if (isCoordinateInRect(pixelCoordinate, gridRect)) {
                    const cellCoordinate = { x: x, y: y };
                    if (firstVisible === undefined)
                        firstVisible = cellCoordinate;
                    lastVisible = cellCoordinate;
                }
            }
        }

        return {
            topLeft: ensure(firstVisible),
            bottomRight: ensure(lastVisible),
        };
    };

    const draw = (p5: P5CanvasInstance) => {
        const grid = { ...gridSize, visibleRect: computeVisibleRect(p5) };

        state = drawGrid({ p5, env, grid, state });

        // Achtung.
        //
        // Changes to this nested loop might also require changes to the
        // `computeVisibleRect` function.

        const { w, h } = cellSize;
        let py = cellOffset.y;
        for (let y = 0; y < gridSize.rowCount; y++, py += h) {
            let px = cellOffset.x;
            if (staggered && y % 2 === 0) px -= w / 2;
            for (let x = 0; x < gridSize.colCount; x++, px += w) {
                const cell = { row: y, col: x };
                const s = p5.max(w, h);
                drawCell({ p5, x: px, y: py, s, w, h, cell, grid, state });
            }
        }

        if (showGuides) drawGuides(p5);
    };

    return (p5) => {
        p5.updateWithProps = (props) => updateWithProps(p5, props);
        p5.setup = () => setup(p5);
        p5.windowResized = () => windowResized(p5);
        p5.draw = () => draw(p5);
    };
}
