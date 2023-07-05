import type p5Types from "p5";
import { grid } from "p5/utils";

export const draw = (p5: p5Types) => {
    // Using clear instead background here because clear clears out the canvas
    // to a transparent background. This way, we do not need to specify the
    // background color as a p5.Color, and can use a more vibrant color
    // specified e.g. using OKLCH.
    p5.clear();

    grid(p5, { stroke: "#ed033f" });

    gridDots(p5);
    gridCircles(p5);
};

const gridDots = (p5: p5Types) => {
    // The stroke controls the color and size of the point
    p5.stroke("#ed033f");
    p5.strokeWeight(8);

    const gap = 40;
    for (let y = gap; y < p5.height; y += gap) {
        for (let x = gap; x < p5.width; x += gap) {
            p5.point(x, y);
        }
    }
};

const gridCircles = (p5: p5Types) => {
    // The stroke controls the color and thickness of the border
    p5.stroke("#ed033f");
    p5.strokeWeight(4);

    // The circle itself is filled with the fill color
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
