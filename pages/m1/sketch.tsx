import p5Types from "p5";

const x1w = 50;
let x1start = -x1w / 2;
let x1end = x1w / 2;
let part = 0;

export const draw = (p5: p5Types) => {
    p5.clear();

    p5.stroke("white");

    p5.strokeWeight(x1w);
    p5.line(x1start, p5.height - 200, x1end, p5.height - 200);

    p5.line(
        p5.width - x1end,
        p5.height - 100,
        p5.width - x1start,
        p5.height - 100
    );

    if (part === 0) {
        x1end = x1end + 4;
        if (x1end > p5.width + x1w / 2) {
            part = 1;
        }
    }
    if (part === 1) {
        x1start = x1start + 4;
        if (x1start >= x1end) {
            part = 2;
        }
    }
    if (part === 2) {
        p5.scale(2, 2);
    }
};
