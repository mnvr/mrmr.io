import { gridSketch, type CellShader } from "../../grid";

const staggered = true;

const drawCell: CellShader = ({ p5, x, y, s }) => {
    p5.fill(160);
    p5.rect(x, y, s, s);
};

export const sketch = gridSketch({
    drawCell,
    staggered,
});
