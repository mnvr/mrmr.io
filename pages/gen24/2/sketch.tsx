import { type P5CanvasInstance } from "@p5-wrapper/react";
import type * as P5 from "p5";
import { ensure } from "utils/ensure";
import { Cell, CellShader, gridSketch, type GridShader } from "../grid";

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
        { position: p5.createVector(2, 2), velocity: p5.createVector(1, 0) },
        { position: p5.createVector(10, 8), velocity: p5.createVector() },
        { position: p5.createVector(5, 5), velocity: p5.createVector() },
    ];
};

const movePhotons = ({ p5 }: { p5: P5CanvasInstance }) => {
    for (let i = 0; i < 3; i++) {
        let pi = ensure(photons[i]);
        pi.position.add(pi.velocity);
    }
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
        p5.textAlign(p5.LEFT, p5.TOP);
    }

    every(p5, { seconds: 1 }, () => {
        movePhotons({ p5 });
    });
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
};

export const sketch = gridSketch({
    drawGrid,
    drawCell,
});

// --- Move out

/**
 * Specify the time between actions perform by {@link every}.
 *
 * All the values are optional. When specifying durations, specify using only
 * one unit (the behaviour is undefined otherwise).
 */
interface EveryOptions {
    /** Alias for {@link seconds} */
    s?: number;
    /** Do the action every `seconds` second. */
    seconds?: number;
}

/**
 * Perform an action once per second (customizable).
 *
 * The `options` parameter allows us to specify the time duration between
 * invocations of the function `action` that is passed to us.
 */
const every = (
    p5: P5CanvasInstance,
    options: EveryOptions,
    action: () => void,
) => {
    // frameRate doesn't return a value until the first frame is drawn
    // const fps = p5.frameRate() ?? 60;
    // frameRate is the actual frame rate, and is non-integral. What we actually
    // need is the integral frame rate that P5 is trying to achieve.
    //
    // Unfortunately, it seems that there isn't a type definition for this
    // method yet.
    const fps = p5.getTargetFrameRate() ?? 60;
    if (p5.frameCount % fps === 0) action();

    // TODO: Handle arbitrary seconds
    // let s = 1;
    // if (options.s) s = options.s;
    // if (options.seconds) s = options.seconds;

    // if (p5.abs(t - s) < 0.1) action();
};
