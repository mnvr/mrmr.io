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

export const glyphStringD = `
.●●●..
.●..●.
.●..●.
.●..●.
.●●●..
`;

const glyphStringE = `
.●●●..
.●....
.●●●..
.●....
.●●●..
`;

const glyphStringO = `
..●●..
.●..●.
.●..●.
.●..●.
..●●..
`;

const glyphStringSpace = `
......
......
......
......
......
`;

const glyphStringUnderscore = `
......
......
......
......
.●●●●.
`;

/**
 * A mapping of characters to {@link GlyphString}s representing them
 *
 * This is far from exhaustive, it only contains mappings for the characters
 * that we've needed so far.
 */
const glyphStringForCharacter: Record<string, GlyphString> = {
    B: glyphStringB,
    D: glyphStringD,
    E: glyphStringE,
    O: glyphStringO,
    " ": glyphStringSpace,
    _: glyphStringUnderscore,
};

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

/** Parse a {@link GlyphString} into an easier to use representation */
export const parseGlyph = (glyphString: GlyphString): Glyph => {
    const lines = glyphString.split("\n").filter((s) => !!s);

    const size = {
        rowCount: lines.length,
        colCount: ensure(lines[0]).length,
    };

    return { lines, size };
};

/**
 * Combine two {@link Glyph}s into a single {@link Glyph}.
 *
 * The glyphs being combined should have the same height (i.e same number of
 * rows). This function will return throw an error if that is not the case.
 *
 * @returns a new {@link Glyph} that is the concatenation of the provided
 * glyphs.
 */
export const combineGlyphs = (g1: Glyph, g2: Glyph): Glyph => {
    const rowCount = g1.size.rowCount;
    if (rowCount !== g2.size.rowCount) {
        const gs = JSON.stringify([g1, g2]);
        throw new Error(
            `Attempting to combine two glyphs that do not have the same height. The glyphs were ${gs}`,
        );
    }

    const lines: string[] = [];
    for (let row = 0; row < rowCount; row += 1) {
        const l1 = ensure(g1.lines[row]);
        const l2 = ensure(g2.lines[row]);
        lines.push(l1 + l2);
    }

    return {
        lines,
        size: {
            rowCount,
            colCount: ensure(lines[0]).length,
        },
    };
};

/**
 * Create and return a new combined glyph that represents the given two
 * characters.
 *
 * It is an error to pass a character which does not yet have an entry in the
 * `glyphStringForCharacter` table.
 */
export const makeGlyph = (c1: string, c2: string): Glyph =>
    combineGlyphs(
        parseGlyph(ensure(glyphStringForCharacter[c1])),
        parseGlyph(ensure(glyphStringForCharacter[c2])),
    );

/** Return true if the matrix position at the given glyph coordinate is lit */
export const isGlyphCoordinateLit = (
    { lines }: Glyph,
    { row, col }: CellCoordinate,
) => lines[row]![col]! !== ".";
