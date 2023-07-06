import type p5Types from "p5";
import { grid } from "p5/utils";

export const draw = (p5: p5Types) => {
    // This sketch is inspired by the cover of a notebook I have.
    p5.clear();

    grid(p5, { stroke: "white" });

    p5.stroke(237);
    p5.strokeWeight(1);

    // gridDots(p5);
    // gridCircles(p5);

    // Round the dimension to the nearest of the grid size. Let the extra pixels
    // remain at the "end" of the sketch (to the right, and at the bottom).
    const gz = 20;
    const rw = floorToMultiple(p5.width, gz);
    const rh = floorToMultiple(p5.height, gz);
    // Add gz after rounding to make it look visually centered
    const rcx = floorToMultiple(rw / 2, gz) + gz;
    const rcy = floorToMultiple(rh / 2, gz) + gz;
    // Keep a margin at the edges
    const d = floorToMultiple(Math.min(rw, rh) - 3 * gz, gz);
    curvedStar(p5, rcx, rcy, d, d);
};

/** Floor the given number `x` to the nearest multiple of `n` */
const floorToMultiple = (x: number, n: number) => Math.floor(x / n) * n;

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
            else curvedStar(p5, x, y, 12, 12);
        }
    }
};

/** Draw a curved star centered at (x, y) with a bounding box sized w x h */
const curvedStar = (
    p5: p5Types,
    x: number,
    y: number,
    w: number,
    h: number
) => {
    p5.push();
    // Translate to the center so that the rotation happens around it
    //
    // From
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate:
    // > The rotation center point is always the canvas origin. To change the
    //   center point, you will need to move the canvas by using the
    //   `translate` method.
    p5.translate(x, y);
    // p5.rotate(p5.PI / 4);
    p5.rectMode(p5.CENTER);
    p5.noFill();
    p5.rect(0, 0, w, h);

    p5.strokeWeight(6);
    p5.point(0, 0);
    p5.point(0, -h / 2);
    p5.point(w / 2, 0);
    // p5.bezier(0, -h / 2, 0, 0, 0, 0, w / 2, 0);

    const gz = 20;

    const segment = (
        p1: p5Types.Vector,
        p2: p5Types.Vector,
        c1: p5Types.Vector
    ) => {
        p5.point(p1.x, p1.y);
        p5.point(p2.x, p2.y);

        p5.strokeWeight(1);
        p5.triangle(p1.x, p1.y, c1.x, c1.y, p2.x, p2.y);
        p5.strokeWeight(5);
        p5.bezier(p1.x, p1.y, c1.x, c1.y, c1.x, c1.y, p2.x, p2.y);
    };

    const p1 = p5.createVector(2 * gz, -2 * gz);
    const p2 = p5.createVector(2 * gz, +2 * gz);
    const p3 = p5.createVector(-2 * gz, +2 * gz);
    const p4 = p5.createVector(-2 * gz, -2 * gz);

    const c1 = p5.createVector(w / 2, 0);
    const c2 = p5.createVector(0, +h / 2);
    const c3 = p5.createVector(-w / 2, 0);
    const c4 = p5.createVector(0, -h / 2);

    segment(p1, p2, c1);
    segment(p2, p3, c2);
    segment(p3, p4, c3);
    segment(p4, p1, c4);

    p5.pop();
};
