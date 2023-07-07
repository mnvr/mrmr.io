import Color from "colorjs.io";
import type p5Types from "p5";
import { showFrameCount } from "p5/utils";
import { color, lighten, p5c, setAlpha } from "utils/colorsjs";

// This sketch is inspired by the cover of a notebook I have.
export const draw = (p5: p5Types) => {
    p5.clear();

    // Frame rate keeps changing!
    console.log(p5.frameRate());
    const f = p5.frameCount % frame(p5, tois.duration);

    const stroke = color(237);
    const gap = 50;

    p5.push();

    // p5.translate(0, 0);
    // p5.rotate(0.5 * Math.sin(p5.frameCount / 600));
    // p5.translate((p5.frameCount / 600) % 100, 0);

    // Offset the grid by a bit so that the initial row and column of dots is
    // not cut in half; just make things look a bit more pleasing to start with.
    p5.translate(4, 4);

    gridDots(p5, { gap, stroke });

    let strokeStar = stroke;
    const fb1 = frame(p5, tois.bass1);
    const fb2 = frame(p5, tois.bass2);
    console.log({ fb1, fb2, fc: p5.frameRate(), d: frame(p5, tois.duration) });
    if (f > fb1 && f < fb2) {
        const l = 1 - (f - fb1) / (fb2 - fb1);
        console.log("lighten", l);
        strokeStar = lighten(stroke, l * 0.5);
    }

    gridCirclesAndStars(p5, { gap, stroke, strokeStar });

    p5.pop();

    showFrameCount(p5, { stroke: "blue" });
};

// These times of interests are in seconds, extracted from "become.mp3".
const tois = {
    bass1: 1, // Basoon note-1 decay start
    bass2: 3, // Basoon note-2 onset
    duration: 39.31, // Song duration
};

/**
 * Transform timings of interest into units of frameCount
 *
 * This conversion will not be exact because of inaccurancies of transcription
 * and floating point math.
 * Further, and especially, in the case of the song duration itself, this will
 * manifest itself as the animation timing drifting away the longer the song
   loops.
 *
 * Note that we cannot use the p5 `millis()` function to synchronize with the
 * music because, unlike `frameCount`, the `millis` keep ticking away even when
 * noLoop has been called.
 */
const frame = (p5: p5Types, t: number) => Math.floor(t * p5.frameRate());

interface DotsDrawOpts {
    gap: number;
    stroke: Color;
}

const gridDots = (p5: p5Types, o = {} as DotsDrawOpts) => {
    const { stroke, gap } = o;

    p5.stroke(p5c(stroke));
    p5.strokeWeight(8);

    for (let y = -gap; y < p5.height + gap; y += gap) {
        for (let x = -gap; x < p5.width + gap; x += gap) {
            p5.point(x, y);
        }
    }
};

interface CirclesAndStarsDrawOpts {
    gap: number;
    stroke: Color;
    strokeStar: Color;
}

const gridCirclesAndStars = (
    p5: p5Types,
    o = {} as CirclesAndStarsDrawOpts
) => {
    const { gap, stroke, strokeStar } = o;

    p5.strokeWeight(4);

    p5.noFill();

    let c = 0;

    p5.rectMode(p5.CENTER);
    p5.angleMode(p5.RADIANS);

    const offset = gap / 2;
    // This radius was computed for a gap of 50
    const d = (gap / 50) * 12;
    for (let y = -(gap + offset); y < p5.height + offset; y += gap) {
        for (let x = -(gap + offset); x < p5.width + offset; x += gap) {
            // Alternate between the circle and the star
            if (c++ % 2) {
                p5.stroke(p5c(stroke));
                p5.circle(x, y, d);
            } else {
                curvedStar(p5, x, y, gap, gap, strokeStar);
            }
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
    }

    p5.stroke(p5c(stroke));
    p5.strokeWeight(40);
    p5.point(0, 0);

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
        p5.strokeWeight(20);
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
