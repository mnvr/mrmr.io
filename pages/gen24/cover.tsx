import { gridSketch, type CellShader, type GridShader } from "./grid";

const drawGrid: GridShader = ({ p5 }) => {
    p5.clear();
    p5.noStroke();
    p5.background(255, 0, 0);
};

const drawCell: CellShader = ({ p5, x, y, s }) => {
    // We use s, and not h, for drawing vertically. Thus we will draw outside
    // our bounds (height). That's intentional so that we tile the grid.
    const p = s / 2;
    const q = p / 2;
    p5.fill(215, 252, 0);
    p5.quad(x, y, x + p, y - p + q, x + s, y, x + p, y + p - q);
    p5.fill(20, 122, 20);
    p5.quad(x, y, x + p, y + p - q, x + p, y + p + q, x, y + p);
};

export const sketch = gridSketch({
    drawGrid,
    drawCell,
    staggered: true,
    noLoop: true,
    cellAspectRatio: 1.33,
});
