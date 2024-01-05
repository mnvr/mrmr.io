import { P5CanvasInstance } from "@p5-wrapper/react";
import { every } from "p5/every";
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
    areEqualSizes,
    canContainSize,
    cellRectSize,
    containsCell,
    expandSize,
    makeRect,
    multiplySize,
    subtractSize,
    type CellRect,
} from "../grid-geometry";
import { isGlyphCoordinateLit, makeGlyph, type Glyph } from "../grid-glyph";

const debug = true;

/**
 * Sketch Description
 * ------------------
 *
 * Consider the visible part of the grid as an array of pixels. Show a message
 * cycling between two two-letter words: "DO", and "BE".
 */
const glyphs = [
    makeGlyph("B", "E"),
    makeGlyph("B", " "),
    makeGlyph("_", " "),
    makeGlyph("D", " "),
    makeGlyph("D", "O"),
    makeGlyph("D", " "),
    makeGlyph("_", " "),
    makeGlyph("B", " "),
];

/**
 * Ensure that all the given glyph are of the same size, and return this size.
 */
export const ensureEqualSizedGlyphs = (glyphs: Glyph[]) => {
    const glyphSize = ensure(glyphs[0]).size;
    for (const glyph of glyphs) {
        if (!areEqualSizes(glyph.size, glyphSize)) {
            const ss = JSON.stringify([glyph.size, glyphSize]);
            throw new Error(
                `Unequal glyph sizes are not supported. The sizes were ${ss}`,
            );
        }
    }
    return glyphSize;
};

/** The size of any (and all) of the glyphs that we cycle through. */
const glyphSize = ensureEqualSizedGlyphs(glyphs);
/**
 * The minimum grid size is obtained by expanding {@link glyphSize} size by 1
 * cell in each directions to ensure that we don't draw outside the safe area.
 */
const minimumGridSize = expandSize(glyphSize, 1);

interface State {
    /** One set of cell indices for each glyph in {@link glyphs} */
    glyphsCellIndices: Set<number>[];
    /**
     * The index of the glyph (from amongst {@link glyphs}) currently being
     * shown.
     */
    glyphIndex: number;
    /**
     * Some values that we compute when computing the glyphCellIndices. This is
     * not needed for the actual sketch, but we keep these around for debugging
     * purposes.
     */
    safeArea: CellRect;
    drawRect: CellRect;
    startCellIndex: number;
}

/**
 * Return the index of the next glyph, cycling back to the first one when we
 * reach the end of {@link glyphsCellIndices}.
 */
const nextGlyphIndexInState = ({ glyphsCellIndices, glyphIndex }: State) =>
    (glyphIndex + 1) % glyphsCellIndices.length;

interface RenderGlyphsParams {
    p5: P5CanvasInstance;
    grid: Grid;
}

/**
 * Try to figure out which cells in the grid should be lit up so as to render
 * the character patterns that we want to show on the grid.
 */
const renderGlyphs = ({ p5, grid }: RenderGlyphsParams): State => {
    const glyphsCellIndices = glyphs.map((_) => new Set<number>());

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

    // The safe area being too small to render the glyphs even at scale 1 should
    // not happen because we have passed an appropriate {@link minimumGridSize}
    // when creating the grid sketch. Check for it though, and throw an error.

    const safeAreaSize = cellRectSize(safeArea);

    if (
        !canContainSize({ containerSize: safeAreaSize, elementSize: glyphSize })
    ) {
        const sa = JSON.stringify(safeAreaSize);
        const md = JSON.stringify(glyphSize);
        throw new Error(
            `Safe area ${sa} is not enough to contain the rendered display of size ${md}`,
        );
    }

    // Try to scale up the glyph the biggest it will go.

    let size: GridSize;
    let scale = 1;
    let newSize = glyphSize;
    let newScale = 1;
    do {
        size = newSize;
        scale = newScale;
        newSize = multiplySize(size, 2);
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
    const { topLeft: startCell, bottomRight: endCell } = drawRect;
    for (let row = startCell.row; row <= endCell.row; row += 1) {
        for (let col = startCell.col; col <= endCell.col; col += 1) {
            // Translate the coordinate of the drawing area into a coordinate
            // suitable for indexing into the glyph.
            const gr = Math.floor((row - startCell.row) / scale);
            const gc = Math.floor((col - startCell.col) / scale);
            let i = 0;
            for (const glyph of glyphs) {
                if (isGlyphCoordinateLit(glyph, { row: gr, col: gc })) {
                    glyphsCellIndices[i]?.add(cellIndex({ row, col }, grid));
                }
                i += 1;
            }
        }
    }

    // Keep the starting cell index in state, useful for debugging.
    const startCellIndex = cellIndex(startCell, grid);

    // Start by showing the glyph at index 0
    const glyphIndex = 0;

    return {
        glyphsCellIndices,
        glyphIndex,
        safeArea,
        drawRect,
        startCellIndex,
    };
};

const drawGrid: GridShader<State> = ({ p5, grid, env, state }) => {
    const newState = state ?? renderGlyphs({ p5, grid });
    p5.clear();
    p5.fill(env.isDarkMode ? 220 : 0);
    every(p5, { seconds: 2.5 }, () => {
        newState.glyphIndex = nextGlyphIndexInState(newState);
    });
    return newState;
};

const drawCell: CellShader<State> = ({ p5, x, y, s, cell, state }) => {
    const { row, col, index } = cell;
    const {
        glyphsCellIndices,
        glyphIndex,
        safeArea,
        drawRect,
        startCellIndex,
    } = ensure(state);

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

    if (glyphsCellIndices[glyphIndex]?.has(index)) {
        p5.fill(20, 20, 240, 200);
        p5.rect(x, y, s, s);
    }
};

export const sketch = gridSketch<State>({
    drawGrid,
    drawCell,
    minimumGridSize,
    showGuides: debug,
});
