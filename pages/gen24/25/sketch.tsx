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
    p5.background(196, 28, 40);
    p5.fill("white");

    return {};
};

type P = [number, number];
const drawCell: CellShader<State> = ({ p5, x, y, s, cell, state }) => {
    const r1 = 10;
    const r2 = 10;
    const r3 = 10;
    const r4 = 10;
    const r5 = 10;
    const r6 = 10;

    // anchor point
    const a1: P = [x + s / 2 - r1, y];
    const a2: P = [x + s / 8 - r1, y + s / 2];
    // control point
    const c1: P = [x + s / 2, y + s / 4 + r3]
    const c2: P = [x + s / 8 - r1, y + s / 4 + r4];

    // mirror of c2
    const c3: P = [x + s / 8 - r1, y + s/2 + s/4 - r4];
    const c4: P = [x + s / 2 - r5, y + s / 2];

    const a3: P = [x + s / 2 - r6, y + s];

    p5.beginShape();
    // p5.vertex(x + s / 2 - r1, y);
    p5.vertex(...a1);
    p5.bezierVertex(...c1, ...c2, ...a2);
    p5.bezierVertex(...c3, ...c4, ...a3);
    // p5.bezierVertex(x, y + s / 2, x, y + s / 2, x + s / 2, y + s);
    // p5.bezierVertex(x + s, y + s / 2, x + s, y + s / 2, x + s / 2, y);
    p5.endShape();

    p5.push();
    p5.fill("cyan");
    p5.circle(...c1, 5);
    p5.circle(...c2, 5);
    p5.circle(...c3, 5);
    p5.circle(...c4, 5);
    p5.pop();

};

export const sketch = gridSketch({
    drawGrid,
    drawCell,
    noLoop: true,
    n: 2,
    showGuides: true,
});
