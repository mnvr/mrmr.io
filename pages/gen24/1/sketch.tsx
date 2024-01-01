import { type P5CanvasInstance } from "@p5-wrapper/react";
import { gridSketch, type CellShader, type GridShader } from "../grid";

const debug = false;

const drawGrid: GridShader = ({ p5, env }) => {
    p5.clear();
    p5.stroke(env.isDarkMode ? 255 : 20);
};

/**
 * An arbitrary, smoothly varying value between 0 and 100 ([0, 100)) for the
 * cell at the given x and y coordinate.
 *
 * There is no randomness, but the returned value does depend on the current
 * time.
 */
const cellV = (p5: P5CanvasInstance, x: number, y: number) => {
    const t = p5.millis() / 1000 / 400;
    return p5.floor(p5.abs(p5.sin(x ** 2 + y ** 2 + t)) * 100);
};

const drawCell: CellShader = ({ p5, x, y, s }) => {
    const m = s / 2;
    const v = cellV(p5, x, y);

    if (debug) {
        p5.textFont("monospace");
        p5.textSize(16);
        p5.text(`${v}`, x, y);
    }

    const vl = cellV(p5, x - 1, y);
    const vr = cellV(p5, x + 1, y);
    const vu = cellV(p5, x, y - 1);
    const vd = cellV(p5, x, y + 1);

    const ps = p5.sin(vl + vr + vu + vd + v) + 2 * 4;
    p5.strokeWeight(ps);

    const th = 15; /* threshold */
    if (p5.abs(v - vl) < th) p5.line(x, y + m, x + m, y + m);
    if (p5.abs(v - vr) < th) p5.line(x + m, y + m, x + s, y + m);
    if (p5.abs(v - vu) < th) p5.line(x + m, y, x + m, y + m);
    if (p5.abs(v - vd) < th) p5.line(x + m, y + m, x + m, y + s);
};

export const sketch = gridSketch({
    drawCell,
    drawGrid,
    showGuides: debug,
});
