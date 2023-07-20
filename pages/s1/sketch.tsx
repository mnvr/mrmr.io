import p5Types from "p5";
import { atEvery } from "p5/utils";

export const draw = (p5: p5Types) => {
    p5.clear();
    p5.background(250);

    // A tight grid of dots
    atEvery(p5, 10, () => {
        dot(p5, 0, 0);
    });
};

const dot = (p5: p5Types, x: number, y: number) => {
    p5.push();
    p5.stroke(0);
    p5.strokeWeight(5);
    p5.point(x, y);
    p5.pop();
};
