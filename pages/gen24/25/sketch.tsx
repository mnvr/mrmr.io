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

const drawCell: CellShader<State> = ({ p5, x, y, s, cell, state }) => {
    // Move the top anchor point 1 towards the left
    const r1 = 4; // [1, 4]
    // Offset c1 from the center (positive values move it leftwards)
    const r2 = 4; // [4, -4]
    // Offset c2 downward from its standard position (1/8 of s from the top).
    const r3 = 4; // [-4, 4]
    const r4 = 0;
    const r5 = 0;
    const r6 = 0;
    const r7 = 5;

    // Draw four bezier curves, roughly approximating a diamond horizontally
    // centered in the cell and running along its entire height. The anchor
    // points (a*) and the control points (c*) below are chosen so as to give a
    // bit of a bulge to the "bulby" shape that we draw.

    // Top anchor point 1
    const a1: P = [x + s / 2 - r1, y];
    // Left anchor point
    const a2: P = [x + s / 8, y + s / 2];
    // Control points
    const c1: P = [x + s / 2 - r2, y + s / 2 - s / 4];
    const c2: P = [x + s / 8, y + s / 8 + r3];

    // Exact mirror of c2
    const c3: P = [x + s / 8, y + s / 2 + s / 4];
    const c4: P = [x + s / 2, y + s / 2];

    // Bottom anchor point 1
    const a3: P = [x + s / 2, y + s];

    // Now let's draw the other side.

    // Bottom anchor point 2
    const a4: P = [x + s / 2, y + s];
    // Right anchor point, an inexact mirror of the left one.
    const a5: P = [x + s - s / 8, y + s / 2];

    // Control points, following a similar pattern as the left side.
    // Inexact mirror of c4
    const c5: P = [x + s / 2, y + s / 2];
    // Inexact mirror of c3
    const c6: P = [x + s - s / 8, y + s / 2 + s / 4];
    // Mirror of c6
    const c7: P = [x + s - s / 8, y + s / 2 - s / 4];
    // Inexact mirror of c1
    const c8: P = [x + s / 2, y + s / 2];

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

    p5.fill("green");
    p5.circle(...a1, 5);
    p5.circle(...a2, 5);
    p5.circle(...a3, 5);
    p5.circle(...a4, 5);
    p5.pop();
};

export const sketch = gridSketch({
    drawGrid,
    drawCell,
    noLoop: true,
    n: 2,
    showGuides: true,
});
