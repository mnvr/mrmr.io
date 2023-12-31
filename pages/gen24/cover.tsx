import { gridSketch, type CellShader, type GridShader } from "./grid";

const drawGrid: GridShader = ({ p5 }) => {
    p5.clear();
    p5.noStroke();
    p5.background(255, 0, 0);
};

const drawCell: CellShader = ({ p5, x, y, w, h }) => {
    p5.fill(225, 242, 84);
    p5.quad(
        x,
        y,
        x + w / 2,
        y - h / 2 + h / 4,
        x + w,
        y,
        x + w / 2,
        y + h / 2 - h / 4,
    );
    p5.fill(57, 112, 78);
    p5.quad(
        x,
        y,
        x + w / 2,
        y + h / 2 - h / 4,
        x + w / 2,
        y + h - h / 4,
        x,
        y + h / 2,
    );
};

export const sketch = gridSketch({
    drawGrid,
    drawCell,
    staggered: true,
    noLoop: true,
    cellAspectRatio: 1,//.25,
    showGuides: true,
});
