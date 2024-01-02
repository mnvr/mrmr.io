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
}

const movePhotons = ({ p5, grid }: MovePhotonsParams) => {
    const isOutOfBounds = (vec: P5.Vector) => {
        const [x, y] = [vec.x, vec.y];
        return x < 0 || y < 0 || x >= grid.colCount || y >= grid.rowCount;
    };

    for (let i = 0; i < 3; i++) {
        let pi = ensure(photons[i]);
        pi.position.add(pi.velocity);
        if (isOutOfBounds(pi.position)) {
            pi.velocity.mult(-1);
            pi.position.add(pi.velocity);
        }
    }
};

const hasPosition = ({ position }: Photon, x: number, y: number) =>
    position.x === x && position.y == y;

let photons: Photon[] = [];
let maxDist = 0;

const drawGrid: GridShader = ({ p5, grid }) => {
    if (photons.length === 0) {
        photons = makePhotons({ p5 });

        let { rowCount, colCount } = grid;

        const gv = p5.createVector(colCount, rowCount);
        // TODO: Need to update this too
        maxDist = gv.dist(p5.createVector(0, 0));
    }
    p5.clear();

    if (debug) {
        p5.textFont("monospace");
        p5.textSize(12);
        p5.textAlign(p5.LEFT, p5.TOP);
    }

    every(p5, { seconds: 1 }, () => {
        movePhotons({ p5, grid });
    });
};

const drawCell: CellShader = ({ p5, x, y, s, cell }) => {
    let { row, col } = cell;

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
