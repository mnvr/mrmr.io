import { type CellCoordinate, type GridSize } from "./grid";

/**
 * A rectangular region of the grid, starting from (and including) the `topLeft`
 * cell coordinate and going up to (and including) the `bottomRight` one.
 */
export interface CellRect {
    topLeft: CellCoordinate;
    bottomRight: CellCoordinate;
}

/**
 * Return the number of rows and columns spanned by the given {@link CellRect}.
 *
 * These values can be negative.
 */
export const cellRectSize = ({ topLeft, bottomRight }: CellRect): GridSize => {
    return {
        rowCount: bottomRight.row - topLeft.row,
        colCount: bottomRight.col - topLeft.col,
    };
};

/**
 * Return the cell coordinate that lies at the midpoint of a grid with the given
 * size.
 */
export const midpointCell = ({
    rowCount,
    colCount,
}: GridSize): CellCoordinate => {
    return {
        row: Math.floor(rowCount / 2),
        col: Math.floor(colCount / 2),
    };
};

export interface ContainsCellParams {
    rect: CellRect;
    cell: CellCoordinate;
}

/** Return true if the given {@link rect} contains the given {@link cell} */
export const containsCell = ({
    rect: { topLeft, bottomRight },
    cell: { row, col },
}: ContainsCellParams) =>
    row >= topLeft.row &&
    col >= topLeft.col &&
    row <= bottomRight.row &&
    col <= bottomRight.col;

export interface CanContainSizeParams {
    containerSize: GridSize;
    elementSize: GridSize;
}

/**
 * Return `true` if the {@link containerSize} large enough to contain a grid
 * rect of {@link elementSize}.
 */
export const canContainSize = ({
    containerSize,
    elementSize,
}: CanContainSizeParams) =>
    elementSize.rowCount <= containerSize.rowCount &&
    elementSize.colCount <= containerSize.colCount;

export interface MultiplySizeParams {
    size: GridSize;
    scale: number;
}

/**
 * Multiply the components of `size` by the given `scale` factor.
 *
 * @returns The new, scaled, size (the original is not modified).
 */
export const multiplySize = ({ size, scale }: MultiplySizeParams): GridSize => {
    return { rowCount: size.rowCount * scale, colCount: size.colCount * scale };
};

/**
 * Subtract the second parameter from the first parameter, componentwise.
 *
 * @returns The new size (the original is not modified).
 */
export const subtractSize = (s1: GridSize, s2: GridSize): GridSize => {
    return {
        rowCount: s1.rowCount - s2.rowCount,
        colCount: s1.colCount - s2.colCount,
    };
};
