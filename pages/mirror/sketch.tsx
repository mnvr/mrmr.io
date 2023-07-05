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

    let c = 0;

    p5.rectMode(p5.CENTER);
    p5.angleMode(p5.RADIANS);

    const gap = 40;
    const offset = 20;
    for (let y = gap + offset; y < p5.height - offset; y += gap) {
        for (let x = gap + offset; x < p5.width - offset; x += gap) {
            // Alternate between the circle and the star
            if (c++ % 2) p5.circle(x, y, 12);
            else curvedStar(p5, x, y);
        }
    }
};

const curvedStar = (p5: p5Types, x: number, y: number) => {
    p5.push();
    // Translate to the center so that the rotation happens around it
    //
    // From
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate:
    // > The rotation center point is always the canvas origin. To change the
    //   center point, you will need to move the canvas by using the
    //   `translate` method.
    p5.translate(x, y);
    p5.rotate(p5.PI / 4);
    p5.rect(0, 0, 20, 20);
    p5.pop();
};
