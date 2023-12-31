import { gridSketch, type CellShader, type GridShader } from "../grid";

const drawGrid: GridShader = ({ p5 }) => {
    p5.clear();
    p5.fill(160);
}
const drawCell: CellShader = ({ p5, x, y, s }) => {
    const h = s / 2;
    p5.quad(x, y, x + h, y - h, x + s, y, x + h, y + h);
    p5.quad(x, y, x + h, y + h, x + h, y + s, x, y + h);
};

export const sketch = gridSketch({
    drawGrid,
    drawCell,
    staggered: true,
    noLoop: true,
});
