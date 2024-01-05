import { P5CanvasInstance } from "@p5-wrapper/react";
import { ensure } from "utils/ensure";
import {
    cellIndex,
    gridSketch,
    type CellShader,
    type Grid,
    type GridShader,
    type GridSize,
} from "../grid";
import {
    canContainSize,
    cellRectSize,
    containsCell,
    makeRect,
    midpointCell,
    multiplySize,
    subtractSize,
    type CellRect,
} from "../grid-geometry";
import { glyphStringB, isGlyphCoordinateLit, parseGlyph } from "../grid-glyph";

const debug = true;

/**
 * Sketch Description
 * ------------------
 *
 * Consider the visible part of the grid as an array of pixels. Show a message
 * cycling between two possible two letter words: "Do", and "Be".
 */
const words = ["Be", "Do"];

interface State {
    coloredCellIndices: Set<number>;
    safeArea: CellRect;
    drawRect?: CellRect;
    startCellIndex?: number;
}

interface RenderGlyphsParams {
    p5: P5CanvasInstance;
    grid: Grid;
}

/**
 * Try to figure out which cells in the grid should be lit up so as to render
 * the character patterns that we want to show on the grid.
 */
const renderGlyphs = ({ p5, grid }: RenderGlyphsParams): State => {
    const coloredCellIndices = new Set<number>();

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

    // Parse the glyph we want to show.
    const glyph = parseGlyph(glyphStringB);

    // If the safe area is too small, just draw a cell at the center to indicate
    // an error.
    //
    // This shouldn't really happen though - we should've set the number of
    // cells in the grid such that we always have enough space even in small
    // sized grids. So also log an error to the console.

    const minDisplaySize = glyph.size;
    const safeAreaSize = cellRectSize(safeArea);

    let isEnough = canContainSize({
        containerSize: safeAreaSize,
        elementSize: minDisplaySize,
    });

    if (!isEnough) {
        console.error(
            `Safe area ${safeAreaSize} is not enough to contain the rendered display of size ${minDisplaySize}`,
        );

        coloredCellIndices.add(cellIndex(midpointCell(grid), grid));
        return { coloredCellIndices, safeArea };
    }

    // Try to scale up the glyph the biggest it will go.

    let size: GridSize;
    let scale = 1;
    let newSize = minDisplaySize;
    let newScale = 1;
    do {
        size = newSize;
        scale = newScale;
        newSize = multiplySize({ size: size, scale: 2 });
        newScale *= 2;
    } while (
        canContainSize({ containerSize: safeAreaSize, elementSize: newSize })
    );

    // Distribute the remaining space towards the edges so that the result looks
    // centered. Add a +1 to account for the borders (edge cells) that we did
    // not count in the safe area.

    const remainingSize = subtractSize(safeAreaSize, size);
    const offsetCell = {
        row: p5.ceil(remainingSize.rowCount / 2) + 1,
        col: p5.ceil(remainingSize.colCount / 2) + 1,
    };

    const drawRect = makeRect({ topLeft: offsetCell, size });
    for (
        let row = drawRect.topLeft.row;
        row <= drawRect.bottomRight.row;
        row += 1
    ) {
        for (
            let col = drawRect.topLeft.col;
            col <= drawRect.bottomRight.col;
            col += 1
        ) {
            // Translate the coordinate of the drawing area into a coordinate
            // suitable for indexing into the glyph.
            console.assert(
                scale === 1,
                "Currently only implemented for scale 1",
            );
            const gr = row - drawRect.topLeft.row;
            const gc = col - drawRect.topLeft.col;
            if (isGlyphCoordinateLit(glyph, { row: gr, col: gc })) {
                coloredCellIndices.add(cellIndex({ row, col }, grid));
            }
        }
    }

    // Starting from this offset, color any cell which is lit up in the
    // corresponding glyph position.

    const startCellIndex = cellIndex(offsetCell, grid);
    return { coloredCellIndices, safeArea, drawRect, startCellIndex };
};

const drawGrid: GridShader<State> = ({ p5, grid, env, state }) => {
    const newState = state ?? renderGlyphs({ p5, grid });
    p5.clear();
    p5.fill(env.isDarkMode ? 220 : 0);
    return newState;
};

const drawCell: CellShader<State> = ({ p5, x, y, s, cell, grid, state }) => {
    const { row, col, index } = cell;
    const { coloredCellIndices, safeArea, drawRect, startCellIndex } =
        ensure(state);

    if (debug) {
        p5.push();
        p5.textFont("monospace");
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.text(`${col} ${row}`, x, y);

        if (containsCell({ rect: safeArea, cell })) {
            p5.fill(240, 240, 0, 80);
            p5.rect(x, y, s, s);
        }

        if (drawRect && containsCell({ rect: drawRect, cell })) {
            p5.fill(0, 240, 240, 80);
            p5.rect(x, y, s, s);
        }

        if (index == startCellIndex) {
            p5.fill("pink");
            p5.rect(x, y, s, s);
        }

        p5.pop();
    }

    if (coloredCellIndices.has(index)) {
        p5.fill(20, 20, 240, 200);
        p5.rect(x, y, s, s);
    }
};

export const sketch = gridSketch<State>({
    drawGrid: drawGrid,
    drawCell: drawCell,
    noLoop: true,
    showGuides: debug,
});
