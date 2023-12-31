import { gridSketch, type CellShader } from "../grid";

const staggered = true;

const drawCell: CellShader = ({ p5, x, y, s }) => {
    p5.fill(160);
    p5.quad(x, y, x + s / 2, y - s / 2, x + s, y, x + s / 2, y + s / 2);
};

export const sketch = gridSketch({
    drawCell,
    staggered,
});
