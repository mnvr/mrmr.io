import { gridSketch, type CellShader, type GridShader } from "../grid";

const drawGrid: GridShader = ({ p5 }) => {
    p5.clear();
    p5.fill(160);
};

const drawCell: CellShader = ({ p5, x, y, s }) => {
    p5.quad(x, y, x + s / 2, y - s / 2, x + s, y, x + s / 2, y + s / 2);
};

export const sketch = gridSketch({
    drawGrid,
    drawCell,
    staggered: true,
    overdraw: { rowCount: 1, colCount: 0 },
    noLoop: true,
});
