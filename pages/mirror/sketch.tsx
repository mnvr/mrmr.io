import Color from "colorjs.io";
import type p5Types from "p5";
import { grid } from "p5/utils";
import { color, p5c, setAlpha } from "utils/colorsjs";

// This sketch is inspired by the cover of a notebook I have.
export const draw = (p5: p5Types) => {
    p5.clear();

    grid(p5, { stroke: "white" });

    const stroke = color(237);

    // gridDots(p5, stroke);
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
    const d = 100; //floorToMultiple(Math.min(rw, rh) - 3 * gz, gz) - 2 * gz;
    curvedStar(p5, rcx, rcy, d, d, stroke);
};

/** Floor the given number `x` to the nearest multiple of `n` */
const floorToMultiple = (x: number, n: number) => Math.floor(x / n) * n;

const gridDots = (p5: p5Types, stroke: Color) => {
    p5.stroke(p5c(stroke));
    p5.strokeWeight(8);

    const gap = 40;
    for (let y = gap; y < p5.height; y += gap) {
        for (let x = gap; x < p5.width; x += gap) {
            p5.point(x, y);
        }
    }
};

const gridCircles = (p5: p5Types, stroke: Color) => {
    p5.stroke(p5c(stroke));
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
            else curvedStar(p5, x, y, 12, 12, stroke);
        }
    }
};

/**
 * Draw a curved star centered at (x, y) with a bounding box sized w x h
 *
 * @param stroke Stroke color.
 * @param showOutlines If true, then the outlines / scaffolding and control
 *        points used to draw the shape are shown. This is useful for debugging.
 */
const curvedStar = (
    p5: p5Types,
    x: number,
    y: number,
    w: number,
    h: number,
    stroke: Color,
    showOutlines = false
) => {
    // The coordinates below were laid out for a 240 x 240 sized shape. We scale
    // them appropriately depending on the actual width and height passed to us.
    // Note that this will also scale the strokeWeight (which is mostly the
    // effect we want here).
    const [ow, oh] = [240, 240];

    p5.push();
    p5.translate(x, y);
    p5.scale(w / ow, h / oh);

    p5.noFill();

    if (showOutlines) {
        p5.rectMode(p5.CENTER);
        p5.strokeWeight(1);
        p5.stroke(p5c(setAlpha(stroke, 0.2)));
        p5.rect(0, 0, ow, oh);
        p5.strokeWeight(6);
        p5.point(0, 0);
    }

    const segment = (
        a: p5Types.Vector,
        b: p5Types.Vector,
        c: p5Types.Vector,
        d: p5Types.Vector
    ) => {
        if (showOutlines) {
            p5.stroke(p5c(setAlpha(stroke, 0.6)));
            p5.strokeWeight(6);
            p5.point(c.x, c.y);
            p5.point(d.x, d.y);
            p5.strokeWeight(1);
            p5.line(a.x, a.y, b.x, b.y);
        }

        p5.stroke(p5c(stroke));
        p5.strokeWeight(8);
        p5.bezier(a.x, a.y, c.x, c.y, d.x, d.y, b.x, b.y);
    };

    const quarter = () => {
        const beg = p5.createVector(0, -oh / 2);
        const mid = p5.createVector(45, -42);
        const end = p5.createVector(ow / 2, 0);

        segment(beg, mid, p5.createVector(33, -116), p5.createVector(18, -68));
        segment(end, mid, p5.createVector(116, -33), p5.createVector(68, -18));
    };

    for (let i = 0; i < 4; i++) {
        quarter();
        p5.rotate(p5.PI / 2);
    }

    p5.pop();
};
