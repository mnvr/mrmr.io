import { P5CanvasInstance } from "@p5-wrapper/react";
import { gridSketch, type CellShader } from "../grid";

/**
 * An arbitrary, smoothly varying value between 0 and 100 ([0, 100)) for the
 * cell at the given x and y coordinate.
 *
 * There is no randomness, but the returned value does depend on the current
 * time.
 */
const cellV = (p5: P5CanvasInstance, x: number, y: number) => {
    const t = p5.millis() / 1000 / 40;
    return p5.floor(p5.abs(p5.sin(x ** 2 + y ** 2 + t)) * 100);
};

const drawCell: CellShader = ({ p5, x, y, s }) => {
    const m = s / 2;
    const v = cellV(p5, x, y);
    const vp = cellV(p5, x - 1, y);
    p5.textFont("monospace");
    p5.textSize(16);
    p5.text(`${v}`, x, y);


    p5.line(x, y + m, x + m, y + m)
    p5.line(x + m, y + m, x + s, y + m)
    p5.line(x + m, y, x + m, y + m)
    p5.line(x + m, y + m, x + m, y + s)
};

export const sketch = gridSketch({
    drawCell,
    showGuides: true,
});
