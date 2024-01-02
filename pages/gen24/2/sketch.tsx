import { type P5CanvasInstance } from "@p5-wrapper/react";
import type * as P5 from "p5";
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

const collidePhotons = ({ p5, grid }: MovePhotonsParams) => {
    const randomishVelocity = () =>
        p5.createVector(
            p5.random() > 0.5 ? 1 : 0,
            p5.floor(p5.random() * 2 + 1),
        );

    const nearBounds = (vec: P5.Vector) => {
        const [x, y] = [vec.x, vec.y];
        return (
            x < 2 || y < 2 || x >= grid.colCount - 2 || y >= grid.rowCount - 2
        );
    };

    for (let i = 0; i < 3; i++) {
        for (let j = i; j < 3; j++) {
            let pi = ensure(photons[i]);
            let ppi = pi.position;
            let pj = ensure(photons[j]);
            let ppj = pj.position;
            if (nearBounds(ppi)) continue;
            if (nearBounds(ppj)) continue;
            const th = 1;
            if (
                p5.abs(ppi.x - ppj.x) < th &&
                p5.abs(ppi.y - ppj.y) < th &&
                p5.random() < 0.3
            ) {
                // Collide always
                let v = pi.velocity;
                pj.velocity = pi.velocity;
                pj.velocity = randomishVelocity();
                //  = p5.createVector(1, -1 * pj.velocity.y);
                // i = 3;
                // j = 3;
                // photons[i]?.velocity = photons[j]?.velocity?.mult(-1);
            }
            // pi.position.add(pi.velocity);
            // if (isOutOfBounds(pi.position)) {
            //     pi.velocity.mult(-1);
            //     pi.position.add(pi.velocity);
            // }
        }
    }
};

const hasPosition = ({ position }: Photon, x: number, y: number) =>
    position.x === x && position.y == y;

let photons: Photon[] = [];
let maxDist = 0;

let n = 0;

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
        collidePhotons({ p5, grid });
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
    if (rd < 0.4) rgb[0] = 25;
    if (rd < 0.3) rgb[0] = 50;
    if (rd < 0.2) rgb[0] = 100;
    if (rd < 0.15) rgb[0] = 120;
    if (rd < 0.1) rgb[0] = 180;

    if (gd < 0.4) rgb[1] = 25;
    if (gd < 0.3) rgb[1] = 50;
    if (gd < 0.2) rgb[1] = 100;
    if (gd < 0.15) rgb[1] = 120;
    if (gd < 0.1) rgb[1] = 180;

    if (bd < 0.4) rgb[2] = 25;
    if (bd < 0.3) rgb[2] = 50;
    if (bd < 0.2) rgb[2] = 100;
    if (bd < 0.15) rgb[2] = 120;
    if (bd < 0.1) rgb[2] = 180;

    // rgb[0] = rgb[0] * (1 - rd);
    // rgb[1] = rgb[1] * (1 - gd);
    // rgb[2] = rgb[2] * (1 - bd);
    // for (let i = 0; i < 3; i++) {
    // if (hasPosition(ensure(photons[i]), col, row)) rgb[i] = 255;
    // rgb[i] *= 1;//photonDist[i];
    // }

    rgb = rgb.map((c) => 255 - c);

    p5.fill(rgb);
    p5.rect(x, y, s, s);

    for (let i = 0; i < 3; i++) {
        // if (hasPosition(ensure(photons[i]), col, row)) rgb[i] = 280;
        if (hasPosition(ensure(photons[i]), col, row)) {
            rgb = rgb.map((c) => 255);
            rgb[i] = 200;
            p5.fill(rgb);
            // p5.circle(x + s / 2, y + s / 2, s / 2)
            // p5.rect(x + s / 4, y + s / 4, s / 4, s / 4);
        }
    }

    // p5.fill(rgb);
    // p5.rect(x, y, s, s);

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
    let cv = p5.createVector(col, row);

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
    /**
     * Do the action every `ms` milliseconds.
     *
     * The accuracy for this is limited by the frame rate. e.g. at 60 FPS
     * (generally the default), the lowest applicable value we can hit for this
     * is 16.6 ms, below which it'll get rounded up to the nearest frame. But at
     * that point, why not just do the action every frame! So you might not be
     * needing this.
     */
    ms?: number;
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
    let s = 1;
    if (options.s) s = options.s;
    if (options.seconds) s = options.seconds;
    if (options.ms) s = options.ms / 1000;

    // Note: [Using getTargetFrameRate instead of frameRate]
    //
    // frameRate is not suitable for our purpose here.
    //
    // Firstly, frameRate doesn't return a value until the first frame is drawn.
    // This could be worked around by having a default value.
    //
    // But the bigger issue is that frameRate is the actually realized frame
    // rate, and so it is a non-integral continuously changing value. What we
    // actually need is the integral frame rate that P5 is trying to achieve.
    //
    // Luckily for us, p5 provides that value, as `getTargetFrameRate`.
    //
    // Unfortunately though, it seems that there isn't a type definition for
    // this method yet.
    const fps = p5.getTargetFrameRate() ?? 60;

    // Find the nearest frame.
    //
    // The simple case is when seconds is 1. Then, every 1 second, the
    // frameCount is a multiple of the fps (this is by their definitions - fps
    // is frames per second, so after 1 second, the frameCount will be an exact
    // multiple of the fps. `frameCount % fps == 0` is true once every second.
    //
    // Now what if seconds is more than 1. Let us say 2. If we take the modulo
    // of frameCount with (2 * fps), it'll now take twice as long for this to
    // cycle back to 0.
    //
    // The same thing works even if seconds is less than 1? Let us say seconds
    // is 0.5. So if we take the modulo of frameCount under (0.5 * fps), it will
    // now become 0 twice a second.
    //
    // Thus, in both cases, we can scale up the fps by multiplying it with the
    // seconds value, and then use this scaled FPS when taking the modulo of the
    // frame count. Whenever the modulo becomes 0, that's our cue to trigger the
    // action.
    //
    // To handle floating point results of `fps * s`, we take its floor.

    const scaledFPS = p5.floor(fps * s);
    if (p5.frameCount % scaledFPS === 0) {
        action();
    }
};
