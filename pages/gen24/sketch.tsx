import { gridSketch, type CellShader, type GridShader } from "./grid";

const drawGrid: GridShader = ({ p5 }) => {
    p5.clear();
    p5.noStroke();
    p5.background(255, 0, 0);
}

const drawCell: CellShader = ({ p5, x, y, s }) => {
    const h = s / 2;
    const o = h / 2;
    p5.fill(255, 255, 0);
    p5.quad(x, y, x + h, y - h + o, x + s, y, x + h, y + h - o);
    p5.fill(0, 255, 0);
    p5.quad(x, y, x + h, y + h - o, x + h, y + s - o, x, y + h);
};

export const sketch = gridSketch({
    drawGrid,
    drawCell,
    staggered: true,
    noLoop: true,
    cellAspectRatio: 0.8,
});
