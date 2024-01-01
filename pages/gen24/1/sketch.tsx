import { type CellShader, gridSketch } from "../grid";

const drawCell: CellShader = ({p5, x, y}) => {
    const t = p5.millis() / 1000 / 40;
    const v = p5.floor(p5.abs(p5.sin(x**2 + y**2 + t)) * 100);
    p5.textFont("monospace");
    p5.textSize(16);
    p5.text(`${v}`, x, y);
};

export const sketch = gridSketch({
    drawCell,
});
