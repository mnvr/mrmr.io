import { type P5CanvasInstance } from "@p5-wrapper/react";
import type * as P5 from "p5";
import { ensure } from "utils/ensure";
import { CellShader, gridSketch, type GridShader, Cell } from "../grid";

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

const makePhotons = ({ p5 }: { p5: P5CanvasInstance }): Photon[] => {
    return [
        { position: p5.createVector(2, 2), velocity: p5.createVector() },
        { position: p5.createVector(10, 8), velocity: p5.createVector() },
        { position: p5.createVector(5, 5), velocity: p5.createVector() },
    ];
};

const hasPosition = ({ position }: Photon, x: number, y: number) =>
    position.x === x && position.y == y;

let photons: Photon[] = [];

const drawGrid: GridShader = ({ p5 }) => {
    if (photons.length === 0) {
        photons = makePhotons({ p5 });
    }
    p5.clear();

    if (debug) {
        p5.textFont("monospace");
        p5.textSize(12);
        p5.textAlign(p5.LEFT, p5.TOP)
    }
};

const drawCell: CellShader = ({ p5, x, y, s, cell }) => {
    let { row, col } = cell;

    let rgb = [170, 170, 170];
    for (let i = 0; i < 3; i++) {
        if (hasPosition(ensure(photons[i]), col, row)) rgb[i] = 255;
    }

    p5.fill(rgb);
    p5.rect(x, y, s, s);

    if (debug) {
        print(p5, x, y, cell);
    }
};

const print = (p5: P5CanvasInstance, x: number, y: number, cell: Cell) => {
    let { row, col } = cell;

    p5.push();
    p5.fill("black");
    p5.textSize(12);
    p5.text(`${col} ${row}`, x + 1, y + 2);

    p5.textSize(8);

    const rp = ensure(photons[0]).position;
    p5.fill("red");
    p5.text(`${rp.x} ${rp.x}`, x + 1, y + 15);

    const gp = ensure(photons[1]).position;
    p5.fill("green");
    p5.text(`${gp.x} ${gp.x}`, x + 1, y + 23);

    const bp = ensure(photons[1]).position;
    p5.fill("blue");
    p5.text(`${bp.x} ${bp.x}`, x + 1, y + 31);

    p5.pop();
}

export const sketch = gridSketch({
    drawGrid,
    drawCell,
});
