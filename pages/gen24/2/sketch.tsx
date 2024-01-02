import { type P5CanvasInstance } from "@p5-wrapper/react";
import type * as P5 from "p5";
import { every } from "p5/every";
import { ensure } from "utils/ensure";
import {
    Cell,
    CellShader,
    gridSketch,
    type Grid,
    type GridShader,
} from "../grid";

const debug = false;

/**
 * Sketch description
 * ------------------
 *
 * Three bouncing photons. Each photon is either pure red, pure blue, or pure
 * green energy. The color of a cell is determined by which photons are near
 * that cell at that time, just by adding them up their energies as rgb values.
 *
 * The photons bounce off the edge of the grid.
 */

interface Photon {
    position: P5.Vector;
    velocity: P5.Vector;
}

interface MakePhotonsParams {
    p5: P5CanvasInstance;
}

const makePhotons = ({ p5 }: MakePhotonsParams): Photon[] => {
    return [
        { position: p5.createVector(2, 2), velocity: p5.createVector(1, 0) },
        { position: p5.createVector(10, 8), velocity: p5.createVector(0, 1) },
        { position: p5.createVector(5, 5), velocity: p5.createVector(1, 1) },
    ];
};

interface MovePhotonsParams {
    grid: Grid;
    state: State;
}

const movePhotons = ({ grid, state }: MovePhotonsParams) => {
    const { photons } = state;

    const isOutOfBounds = (vec: P5.Vector) => {
        const [x, y] = [vec.x, vec.y];
        return x < 0 || y < 0 || x >= grid.colCount || y >= grid.rowCount;
    };

    for (const p of photons) {
        p.position.add(p.velocity);
        if (isOutOfBounds(p.position)) {
            p.velocity.mult(-1);
            p.position.add(p.velocity);
        }
    }
};

interface State {
    photons: Photon[];
    maxDist: number;
}

interface MakeStateParams {
    p5: P5CanvasInstance;
    grid: Grid;
}

const makeState = ({ p5, grid }: MakeStateParams) => {
    const photons = makePhotons({ p5 });

    const { rowCount, colCount } = grid;
    const boundsVec = p5.createVector(colCount, rowCount);
    const maxDist = boundsVec.dist(p5.createVector(0, 0));

    return { photons, maxDist };
};

const drawGrid: GridShader<State> = ({ p5, grid, state }) => {
    const newState = state ?? makeState({ p5, grid });

    p5.clear();
    p5.strokeWeight(0);

    if (debug) {
        p5.textFont("monospace");
        p5.textSize(12);
        p5.textAlign(p5.LEFT, p5.TOP);
    }

    every(p5, { seconds: 1 }, () => {
        movePhotons({ grid, state: newState });
    });

    return newState;
};

const drawCell: CellShader<State> = ({ p5, x, y, s, cell, state }) => {
    const { row, col } = cell;
    const { photons, maxDist } = ensure(state);

    const cv = p5.createVector(col, row);

    const photonDist = photons.map((p) => cv.dist(p.position) / maxDist);
    const color = photonDist.map((c) => c * 255);
    p5.fill(color);

    p5.rect(x, y, s, s);

    if (debug) debugCell({ p5, x, y, cell, photonDist });
};

interface DebugCellProps {
    p5: P5CanvasInstance;
    x: number;
    y: number;
    cell: Cell;
    photonDist: number[];
}

const debugCell = ({ p5, x, y, cell, photonDist }: DebugCellProps) => {
    const { row, col } = cell;

    p5.push();
    p5.fill("white");
    p5.textSize(12);
    p5.text(`${col} ${row}`, x + 1, y + 2);

    p5.textSize(8);

    const rd = photonDist[0];
    p5.fill("red");
    p5.text(`${rd}`, x + 1, y + 15);

    const gd = photonDist[1];
    p5.fill("green");
    p5.text(`${gd}`, x + 1, y + 23);

    const bd = photonDist[2];
    p5.fill("blue");
    p5.text(`${bd}`, x + 1, y + 31);

    p5.pop();
};

export const sketch = gridSketch({
    drawGrid,
    drawCell,
});
