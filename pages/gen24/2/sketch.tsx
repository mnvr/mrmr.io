import { type P5CanvasInstance } from "@p5-wrapper/react";
import type * as P5 from "p5";
import { every } from "p5/every";
import { ensure } from "utils/ensure";
import { mod } from "utils/math";
import {
    Cell,
    CellShader,
    gridSketch,
    type Grid,
    type GridShader,
} from "../grid";

const debug = true;

/**
 * Sketch description
 * ------------------
 *
 * Draw three bouncing photons. Each photon is either pure red, pure blue, or
 * pure green energy. The color of a cell is determined by which photons are on
 * that cell at the same time, just by adding them up as rgb values.
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
    p5: P5CanvasInstance;
    grid: Grid;
    state: State;
}

const movePhotons = ({ p5, grid, state }: MovePhotonsParams) => {
    const { photons, boundsVec } = state;

    for (let i = 0; i < 3; i++) {
        let pi = ensure(photons[i]);
        pi.position.add(pi.velocity);
        pi.position = vecMod(p5, pi.position, boundsVec);
    }
};

/**
 * Return the modulo `mod(v, q)` component-wise on the given vectors.
 *
 * This uses the {@link mod} function that returns the arithmetic modulo.
 */
const vecMod = (p5: P5CanvasInstance, v: P5.Vector, q: P5.Vector): P5.Vector =>
    p5.createVector(mod(v.x, q.x), mod(v.y, q.y));

const hasPosition = ({ position }: Photon, x: number, y: number) =>
    position.x === x && position.y == y;

interface State {
    photons: Photon[];
    boundsVec: P5.Vector;
    maxDist: number;
}

interface MakeStateParams {
    p5: P5CanvasInstance;
    grid: Grid;
}

const makeState = ({ p5, grid }: MakeStateParams) => {
    let { rowCount, colCount } = grid;

    const photons = makePhotons({ p5 });
    const boundsVec = p5.createVector(colCount, rowCount);

    const maxDist = boundsVec.dist(p5.createVector(0, 0));

    return { photons, boundsVec, maxDist };
};

const drawGrid: GridShader<State> = ({ p5, grid, state }) => {
    const newState = state ?? makeState({ p5, grid });

    p5.clear();

    if (debug) {
        p5.textFont("monospace");
        p5.textSize(12);
        p5.textAlign(p5.LEFT, p5.TOP);
    }

    every(p5, { seconds: 1 }, () => {
        movePhotons({ p5, grid, state: newState });
    });

    return newState;
};

const drawCell: CellShader<State> = ({ p5, x, y, s, cell, state }) => {
    let { row, col } = cell;
    const { photons, maxDist } = ensure(state);

    let cv = p5.createVector(col, row);

    const rp = ensure(photons[0]).position;
    const rd = cv.dist(rp) / maxDist;

    const gp = ensure(photons[1]).position;
    const gd = cv.dist(gp) / maxDist;

    const bp = ensure(photons[2]).position;
    const bd = cv.dist(bp) / maxDist;

    const photonDist = [rd, gd, bd];

    p5.strokeWeight(0);
    let rgb = [0, 0, 0];

    for (let i = 0; i < 3; i++) {
        if (hasPosition(ensure(photons[i]), col, row)) rgb[i] = 255;
    }

    p5.fill(rgb);
    p5.fill(photonDist.map((c) => c * 255));
    p5.rect(x, y, s, s);

    if (debug) {
        debugCell({ p5, x, y, cell, photonDist });
    }
};

interface DebugCellProps {
    p5: P5CanvasInstance;
    x: number;
    y: number;
    cell: Cell;
    photonDist: number[];
}

const debugCell = ({ p5, x, y, cell, photonDist }: DebugCellProps) => {
    let { row, col } = cell;

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
