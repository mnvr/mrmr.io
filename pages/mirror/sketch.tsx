import type p5Types from "p5";
import { grid } from "p5/utils";

export const draw = (p5: p5Types) => {
    // This sketch is inspired by the cover of a notebook I have.
    p5.clear();

    grid(p5, { stroke: "white" });

    gridDots(p5);
    gridCircles(p5);
};

const gridDots = (p5: p5Types) => {
    p5.stroke(237);
    p5.strokeWeight(8);

    const gap = 40;
    for (let y = gap; y < p5.height; y += gap) {
        for (let x = gap; x < p5.width; x += gap) {
            p5.point(x, y);
        }
    }
};

const gridCircles = (p5: p5Types) => {
    p5.stroke(237);
    p5.strokeWeight(4);

    p5.noFill();

    const gap = 40;
    const offset = 20;
    for (let y = gap + offset; y < p5.height - offset; y += gap) {
        for (let x = gap + offset; x < p5.width - offset; x += gap) {
            const yi = y / gap;
            const xi = x / gap;

            p5.circle(x, y, 12);
        }
    }
};
