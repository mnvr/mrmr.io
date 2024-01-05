import { P5CanvasInstance } from "@p5-wrapper/react";
import { ensure } from "utils/ensure";
import {
    Cell,
    CellShader,
    Grid,
    GridShader,
    GridSize,
    gridSketch,
} from "../grid";

const debug = true;

/**
 * Sketch Description
 * ------------------
 *
 * Consider the visible part of the grid as an array of pixels. Show a message
 * cycling between two possible two letter words: "Do", and "Be".
 */
const words = ["Be", "Do"];

/**
 * A Glyph is a multiline Unicode, dot-matrix, rendition of a character or
 * symbol that we want to display on the grid.
 */
type Glyph = string;

const glyphB = `
.●●●..
.●..●.
.●●●..
.●..●.
.●●●..
`;

/** Return the number of rows and columns spanned by the given {@link Glyph}. */
const glyphSize = (glyph: Glyph): GridSize => {
    const lines = glyph.split("\n");

    return {
        rowCount: lines.length,
        colCount: ensure(lines[0]).length,
    };
};

interface State {
    coloredCells: Set<Cell>;
    safeArea: CellRect;
    startCell?: Cell;
}

/**
 * A rectangular region of the grid, starting from (and including) the `topLeft`
 * cell and going up to (and including) the `bottomRight` one.
 */
interface CellRect {
    topLeft: Cell;
    bottomRight: Cell;
}

/**
 * Return the number of rows and columns spanned by the given {@link CellRect}.
 *
 * These values can be negative.
 */
const cellRectSize = ({ topLeft, bottomRight }: CellRect): GridSize => {
    return {
        rowCount: bottomRight.row - topLeft.row,
        colCount: bottomRight.col - topLeft.col,
    };
};

/** Return the cell that is the midpoint of a grid of the given size. */
const midpointCell = ({ rowCount, colCount }: GridSize): Cell => {
    return {
        row: Math.floor(rowCount / 2),
        col: Math.floor(colCount / 2),
    };
};

interface ContainsCellParams {
    rect: CellRect;
    cell: Cell;
}

/** Return true if the given {@link rect} contains the given {@link cell} */
const containsCell = ({
    rect: { topLeft, bottomRight },
    cell: { row, col },
}: ContainsCellParams) =>
    row >= topLeft.row &&
    col >= topLeft.col &&
    row <= bottomRight.row &&
    col <= bottomRight.col;

interface CanContainSizeParams {
    containerSize: GridSize;
    elementSize: GridSize;
}

/**
 * Return `true` if the {@link containerSize} large enough to contain a grid
 * rect of {@link elementSize}.
 */
const canContainSize = ({ containerSize, elementSize }: CanContainSizeParams) =>
    elementSize.rowCount <= containerSize.rowCount &&
    elementSize.colCount <= containerSize.colCount;

interface MultiplySizeParams {
    size: GridSize;
    scale: number;
}

/**
 * Multiply the components of `size` by the given `scale` factor.
 *
 * @returns The new, scaled, size (the original is not modified).
 */
const multiplySize = ({ size, scale }: MultiplySizeParams): GridSize => {
    return { rowCount: size.rowCount * scale, colCount: size.colCount * scale };
};

/**
 * Subtract the second parameter from the first parameter, componentwise.
 *
 * @returns The new size (the original is not modified).
 */
const subtractSize = (s1: GridSize, s2: GridSize): GridSize => {
    return {
        rowCount: s1.rowCount - s2.rowCount,
        colCount: s1.colCount - s2.colCount,
    };
};

interface RenderGlyphsParams {
    p5: P5CanvasInstance;
    grid: Grid;
}

/**
 * Try to figure out which cells in the grid should be lit up so as to render
 * the character patterns that we want to show on the grid.
 */
const renderGlyphs = ({ p5, grid }: RenderGlyphsParams): State => {
    const coloredCells = new Set<Cell>();

    // The safe area is the area consisting of grid cells that are fully
    // visible. We can light up these cells knowing for sure that they'll not
    // get clipped.
    //
    // The edges are always partially displayed, so don't consider them as part
    // of the safe area.

    const safeArea: CellRect = {
        topLeft: { row: 1, col: 1 },
        // -1 to convert from count to index, and another -1 to discount the edge.
        bottomRight: { row: grid.rowCount - 2, col: grid.colCount - 2 },
    };

    // If the safe area is too small, just draw a cell at the center to indicate
    // an error.
    //
    // This shouldn't really happen though - we should've set the number of
    // cells in the grid such that we always have enough space even in small
    // sized grids. So also log an error to the console.

    const minDisplaySize = glyphSize(glyphB);
    const safeAreaSize = cellRectSize(safeArea);

    let isEnough = canContainSize({
        containerSize: safeAreaSize,
        elementSize: minDisplaySize,
    });

    if (!isEnough) {
        console.error(
            `Safe area ${safeAreaSize} is not enough to contain the rendered display of size ${minDisplaySize}`,
        );

        coloredCells.add(midpointCell(grid));
        return { coloredCells, safeArea };
    }

    // Try to scale up the glyph the biggest it will go.

    let size: GridSize;
    let size2 = minDisplaySize;
    do {
        size = size2;
        size2 = multiplySize({ size: size, scale: 2 });
    } while (
        canContainSize({ containerSize: safeAreaSize, elementSize: size2 })
    );

    // Distribute the remaining space towards the edges so that the result looks
    // centered. Add a +1 to account for the borders (edge cells) that we did
    // not count in the safe area.

    const remainingSize = subtractSize(safeAreaSize, size);
    const offsetCell = {
        row: p5.floor(remainingSize.rowCount / 2) + 1,
        col: p5.floor(remainingSize.colCount / 2) + 1,
    };

    // Starting from this offset, color any cell which is lit up in the
    // corresponding glyph position.

    return { coloredCells, safeArea, startCell: offsetCell };
};

const drawGrid: GridShader<State> = ({ p5, grid, env, state }) => {
    const newState = state ?? renderGlyphs({ p5, grid });
    p5.clear();
    p5.fill(env.isDarkMode ? 220 : 0);
    return newState;
};

const drawCell: CellShader<State> = ({ p5, x, y, s, cell, grid, state }) => {
    const { row, col } = cell;
    const { safeArea } = ensure(state);

    if (debug) {
        p5.push();
        p5.textFont("monospace");
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.text(`${col} ${row}`, x, y);

        if (containsCell({ rect: safeArea, cell })) {
            p5.fill(240, 240, 0, 100);
            p5.rect(x, y, s, s);
        }
        // if (cell ==)
        p5.pop();
    }
};

export const sketch = gridSketch<State>({
    drawGrid: drawGrid,
    drawCell: drawCell,
    noLoop: true,
    showGuides: debug,
});
