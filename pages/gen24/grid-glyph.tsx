import { ensure } from "utils/ensure";
import { type CellCoordinate, type GridSize } from "./grid";

/**
 * A {@link Glyph} is a multiline dot-matrix rendition of a character or symbol
 * that we want to display on the grid.
 *
 * Its string representation of it has a line per row, and a character per
 * column. The period / dot ('.') character is blank space, and everything else
 * causes the cell to be filled.
 */
export type GlyphString = string;

export const glyphStringB = `
.●●●..
.●..●.
.●●●..
.●..●.
.●●●..
`;

/** A parsed representation of a {@link GlyphString} for fast indexing */
export interface Glyph {
    /**
     * The size of the grid (i.e. the number of rows and columns) spanned by the
     * {@link GlyphString} at its original scale (1).
     */
    size: GridSize;
    /**
     * The {@link GlyphString} itself, but split into lines for faster indexing.
     */
    lines: string[];
}

export const parseGlyph = (glyphString: GlyphString): Glyph => {
    const lines = glyphString.split("\n").filter((s) => !!s);

    const size = {
        rowCount: lines.length,
        colCount: ensure(lines[0]).length,
    };

    return { lines, size };
};

/** Return true if the matrix position at the given glyph coordinate is lit */
export const isGlyphCoordinateLit = ({ lines }: Glyph, { row, col }: CellCoordinate) =>
    lines[row]![col] !== ".";
