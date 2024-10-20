import { mod } from "../mod.ts";

/** Dimensions of the (covering) rectangle used by each cell. */
const cellD = 10;
/** The color to use for drawing alive cells. */
const aliveColor = "#00db5e";
/** The color to use for drawing inactive cells. */
const inactiveColor = "#cbffd820";

const dpr = () => Math.floor(Math.max(devicePixelRatio, 2));

/**
 * Simulate a game of life.
 */
export const sketch = (canvas: HTMLCanvasElement) => {
  /** Number of rows ("y" or "j" values)  in `cells` */
  let rows: number;
  /** Number of columns ("x" or "i") in `cells` */
  let cols: number;

  /**
   * Each cell tracks whether or not a particular location is "alive"
   *
   * We're doing a "game of life" simulation here, and this is the state of
   * the game, tracking which cells are currently alive.
   *
   * For ease of coding (and possibly better runtime performance), this is
   * kept as a 1D array in row-major order instead of as the 2D matrix that it
   * conceptually is.
   *
   * Thus, the cell at row j and col i is at `j * cols + i`.
   */
  let cells: boolean[];

  /** Return a cells array initialized to all false values */
  const makeCells = (): boolean[] => Array(rows * cols).fill(false);

  /**
   * Set the cell at row j and col i in the given cells array to true.
   *
   * nb: The `cells` variable shadows the `cells` in the environment above,
   * allowing us to pass a different cells array that we want to modify.
   */
  const setCell = (cells: boolean[], j: number, i: number) =>
    (cells[j * cols + i] = true);

  /**
   * Add an R-pentomino at the given coordinates (indicated by the capital X
   * below):
   *
   *       xx
   *      xX
   *       x
   *
   */
  const addRPentomino = (j: number, i: number) => {
    setCell(cells, j - 1, i + 0);
    setCell(cells, j - 1, i + 1);
    setCell(cells, j + 0, i - 1);
    setCell(cells, j + 0, i + 0);
    setCell(cells, j + 1, i + 0);
  };

  /**
   * Introduce another R-pentomino when the user clicks the sketch.
   *
   * It will be added centered on the cell that is nearest to the location of
   * the click.
   */
  // TODO
  // p5.mouseClicked = () => addRPentomino(...nearestCell(p5.mouseX, p5.mouseY));

  let skip = 0;

  const draw = () => {
    requestAnimationFrame(draw);

    if (skip++ != 7) return;
    skip = 0;

    const ctx = canvas.getContext("2d")!;

    const expectedWidth = canvas.clientWidth * dpr();
    const expectedHeight = canvas.clientHeight * dpr();

    // Handle window resizes.
    if (canvas.width != expectedWidth || canvas.height != expectedHeight) {
      canvas.width = expectedWidth;
      canvas.height = expectedHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const [ox, oy] = translatedOrigin();

    const next = makeCells();

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const c = aliveNeighbourCount(j, i);

        const isAlive = cells[j * cols + i]!;
        let nextIsAlive = false;

        if (isAlive) {
          // Staying alive
          //
          // If a cell is alive and has exactly 2 or 3 live
          // neighbours, it stays alive.
          if (c === 2 || c === 3) nextIsAlive = true;
        } else {
          // Birth
          //
          // If a cell is inactive, it'll become alive if it has
          // exactly 3 live neighbours.
          if (c === 3) nextIsAlive = true;
        }

        if (nextIsAlive) setCell(next, j, i);

        // Coordinates of the starting corner of the rectangle that
        // covers the drawing area we have for the cell.
        const x = ox + i * cellD;
        const y = oy + j * cellD;

        ctx.fillStyle = isAlive ? aliveColor : inactiveColor;
        const d = isAlive ? 2 * c : 3;
        ctx.beginPath();
        ctx.arc(x, y, d, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
      }
    }

    cells = next;
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
   */
  const translatedOrigin = () => [
    offset(canvas.width, cols),
    offset(canvas.height, rows),
  ];

  const offset = (availableSpace: number, count: number) => {
    const extra = availableSpace - count * cellD;
    if (extra <= 0) return 0;
    return extra / 2;
  };

  /**
   * Find the indices ([j, i] values) for the cell that is nearest to the
   * given coordinate (x, y value) on the canvas.
   */
  /*
  const nearestCell = (x: number, y: number): [j: number, i: number] => {
    // Subtract the coordinate of cell [0, 0] (see translateOrigin above).
    x -= offset(p5.width, cols);
    y -= offset(p5.height, rows);
    // Clamp the values to the area occupied by the cells (the canvas can be
    // bigger, e.g. if it gets resized).
    x = p5.constrain(x, 0, cols * cellD);
    y = p5.constrain(y, 0, rows * cellD);
    // Divide by cellD to get the cell index
    x = Math.floor(x / cellD);
    y = Math.floor(y / cellD);
    return [y, x];
  };
  */

  /**
   * Return a count of the number of neighbours of the cell at row j and col i
   * that are alive.
   */
  const aliveNeighbourCount = (j: number, i: number) => {
    // Neighbouring indices. Initializing this separately so that we can provide
    // a type annotation and make the TypeScript compiler happy about the [j, i]
    // destructuring later on.
    const ni: [number, number][] = [
      [j - 1, i - 1],
      [j - 1, i],
      [j - 1, i + 1],
      [j + 0, i - 1],
      [j + 0, i + 1],
      [j + 1, i - 1],
      [j + 1, i],
      [j + 1, i + 1],
    ];
    return ni.filter(([j, i]) => cells[mod(j, rows) * cols + mod(i, cols)])
      .length;
  };

  canvas.width = canvas.clientWidth * dpr();
  canvas.height = canvas.clientHeight * dpr();

  rows = Math.floor(canvas.height / cellD);
  cols = Math.floor(canvas.width / cellD);

  cells = makeCells();

  // Start with a R-pentomino at the center of the board.
  const [cj, ci] = [Math.floor(rows / 2), Math.floor(cols / 2)];
  addRPentomino(cj, ci);

  draw();
};
