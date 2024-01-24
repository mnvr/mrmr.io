import type { CellShader, GridShader } from "../grid";
import { gridSketch } from "../grid";

/**
 * Sketch Description
 * ------------------
 *
 * The tablecloth has chains of white bulbous circles running down its length.
 */
interface State {}

const drawGrid: GridShader<State> = ({ p5, grid, env, state }) => {
    p5.clear();
    // p5.strokeWeight(0);
    p5.background(199, 25, 31);
    p5.background(215, 40, 14);
    p5.background(212, 52, 52);
    p5.background(220, 60, 70);
    p5.fill("white");

    return {};
};

// A simple implementation that gets the basic gist right
const drawCell0: CellShader<State> = ({ p5, x, y, s }) => {
    p5.beginShape();
    p5.vertex(x + s / 2, y);
    p5.bezierVertex(x, y + s / 2, x, y + s / 2, x + s / 2, y + s);
    p5.bezierVertex(x + s, y + s / 2, x + s, y + s / 2, x + s / 2, y);
    p5.endShape();
};

type P = [number, number];

/**
 * Return a new point that is the result of introducing a random jitter to the
 * given point.
 *
 * @param pt The point to jitter.
 * @param onlyHoriz If true, there is no vertical jitter added.
 */
const jiggle = (pt: P, onlyHoriz = false): P => {
    const jx = Math.floor(Math.random() * 4);
    const jy = onlyHoriz ? 0 : Math.floor(Math.random() * 4);
    return [pt[0] + jx, pt[1] + jy];
};

const drawCell: CellShader<State> = ({ p5, x, y, s, cell, state }) => {
    // Draw four bezier curves, roughly approximating a diamond horizontally
    // centered in the cell and running along its entire height. The anchor
    // points (a*) and the control points (c*) below are chosen so as to give a
    // bit of a bulge to the "bulby" shape that we draw.

    // Top anchor point 1
    const a1: P = [x + s / 2, y];
    // Control points
    const c1: P = [x + s / 2, y + s / 2 - s / 4];
    const c2: P = [x + s / 8, y + s / 8];

    // Left anchor point
    const a2: P = [x + s / 8, y + s / 2];

    // Almost mirror of c2
    const c3: P = [x + s / 8, y + s - s / 8];
    // Similar to c1
    const c4: P = [x + s / 2, y + s - s / 4];

    // Bottom anchor point 1
    const a3: P = [x + s / 2, y + s];

    // Now let's draw the other side.

    // Bottom anchor point 2
    const a4: P = [x + s / 2, y + s];

    // Control points, following a similar pattern as the left side.
    // Inexact mirror of c4
    const c5: P = [x + s / 2, y + s - s / 4];
    // Inexact mirror of c3
    const c6: P = [x + s - s / 8, y + s - s / 8];

    // Right anchor point, an inexact mirror of the left one.
    const a5: P = [x + s - s / 8, y + s / 2];

    // Almost mirror of c6
    const c7: P = [x + s - s / 8, y + s / 8];
    // Inexact mirror of c1
    const c8: P = [x + s / 2, y + s / 2 - s / 4];

    // Top anchor point 2
    const a6: P = [x + s / 2, y];

    p5.beginShape();
    p5.vertex(...a1);
    p5.bezierVertex(...c1, ...c2, ...a2);
    p5.bezierVertex(...c3, ...c4, ...a3);
    p5.vertex(...a4);
    p5.bezierVertex(...c5, ...c6, ...a5);
    p5.bezierVertex(...c7, ...c8, ...a6);
    p5.endShape(p5.CLOSE);

    p5.push();
    p5.fill("cyan");
    p5.circle(...c1, 5);
    p5.circle(...c2, 5);
    p5.circle(...c3, 5);
    p5.circle(...c4, 5);
    p5.circle(...c5, 5);
    p5.circle(...c6, 5);
    p5.circle(...c7, 5);
    p5.circle(...c8, 5);

    p5.fill("green");
    p5.circle(...a1, 5);
    p5.circle(...a2, 5);
    p5.circle(...a3, 5);
    p5.circle(...a4, 5);
    p5.circle(...a5, 5);
    p5.circle(...a6, 5);
    p5.pop();
};

export const sketch = gridSketch({
    drawGrid,
    drawCell,
    noLoop: true,
    n: 2,
    showGuides: true,
});
