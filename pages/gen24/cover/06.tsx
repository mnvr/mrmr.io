import { gridSketch, type CellShader, type GridShader } from "../grid";

const drawGrid: GridShader = ({ p5 }) => {
    p5.clear();
    p5.fill(160);
    p5.rectMode(p5.CENTER);
};

const drawCell: CellShader = ({ p5, x, y, s }) => {
    const t = p5.millis() / 1000 / 4;
    p5.push();
    p5.translate(x + s / 2, y + s / 2);
    p5.rotate(t);
    p5.rect(0, 0, s, s);
    p5.pop();
};

export const sketch = gridSketch({
    drawGrid,
    drawCell,
    staggered: true,
    overdraw: { rowCount: 1, colCount: 0 },
});
