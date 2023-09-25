import Color from "colorjs.io";
import type p5Types from "p5";
import { extractAudioMarkersAtTime } from "p5/audio";
import type { P5DrawEnv } from "types";
import { color, p5c, setAlpha } from "utils/colorsjs";
import { ensure } from "utils/ensure";

// This sketch is inspired by the cover of a notebook I have.
export const draw = (p5: p5Types, env: P5DrawEnv) => {
    p5.clear();

    const gap = 50;
    const audio = extractAudioMarkersAtTime(trackInfo, env.audioTime());

    const isIntro = audio.loop === 0;
    const isBeforeIntroDrums = isIntro && audio.bar < 8;

    // Pulse the colors to the beat (except during the first half of the intro)
    const strokeDots = color(
        isBeforeIntroDrums
            ? 235
            : Math.max(
                  235 + audio.nearOnBeat * 20,
                  235 + audio.nearOffBeat * 20,
              ),
    );
    const strokeStar = color(
        237 + (isBeforeIntroDrums ? 0 : audio.nearOnBeat * 11),
    );
    // Link to the pre-offbeat kick (the kick at the 6/16-th note).
    const strokeCircle = color(
        237 + (isBeforeIntroDrums ? 0 : audio.nearBeat(6 / 16) * 11),
    );

    // Offset the grid by a bit so that the initial row and column of dots is
    // not cut in half; just make things look a bit more pleasing to start with.
    p5.translate(4, 4);

    // Rotate the stars at a speed indexed by the bass note.
    // Don't do this during the intro.
    const rotateStar = isIntro ? 0 : bassNoteForBar(audio.bar);

    // Switch to black and jiggle the stars in the latter 3/10ths of some of the
    // 3rd bars (the one with the repeating snares).
    if (
        !isIntro &&
        [2, 14].includes(audio.bar) &&
        Math.floor(audio.barOffset * 10) >= 7
    ) {
        p5.background(0);
        p5.scale(1.02 + audio.bar / 100 + Math.random() * 0.005);
    }
    // Slow speed rotation around the origin
    p5.rotate(Math.sin(audio.loopOffset * Math.PI) / 2);

    gridDots(p5, { gap, stroke: strokeDots });
    gridCirclesAndStars(p5, { gap, strokeCircle, strokeStar, rotateStar });
};

// Extracted from "become.mp3"
const trackInfo = {
    duration: 39.272743,
    bpm: 110,
};

const bassNoteForBar = (bar: number) =>
    ensure(
        [
            6, // F1 - 2 bars
            6,
            5, // E1 - 1 bar
            3, // D1 - 4 bars
            3,
            3,
            3,
            0, // Rest - 2 bars
            0,
            1, // C1 - 2 bars
            1,
            3, // D1 - 2.x bars
            3,
            3,
            0,
            0,
            0,
            0,
        ][bar],
    );

interface DotsDrawOpts {
    gap: number;
    stroke: Color;
}

const gridDots = (p5: p5Types, o = {} as DotsDrawOpts) => {
    const { stroke, gap } = o;

    p5.stroke(p5c(stroke));
    p5.strokeWeight(8);

    // Draw beyond the edges so that we can still see the grid even after the
    // viewport has been rotated.
    const [h, w] = [p5.height, p5.width];
    for (let y = -(h + gap); y < 2 * h + gap; y += gap) {
        for (let x = -(w + gap); x < 2 * w + gap; x += gap) {
            p5.point(x, y);
        }
    }
};

interface CirclesAndStarsDrawOpts {
    gap: number;
    strokeCircle: Color;
    strokeStar: Color;
    rotateStar: number;
}

const gridCirclesAndStars = (
    p5: p5Types,
    o = {} as CirclesAndStarsDrawOpts,
) => {
    const { gap, strokeCircle, strokeStar, rotateStar } = o;

    p5.strokeWeight(4);

    p5.noFill();

    p5.rectMode(p5.CENTER);
    p5.angleMode(p5.RADIANS);

    const offset = gap / 2;
    // This radius was computed for a gap of 50
    const d = (gap / 50) * 12;

    // Draw beyond the edges so that we can still see the grid even after the
    // viewport has been rotated.
    const [h, w] = [p5.height, p5.width];

    let c = 0;

    for (let y = -(h + gap + offset); y < 2 * h + offset; y += gap) {
        let lineCount = 0;
        for (let x = -(w + gap + offset); x < 2 * w + offset; x += gap) {
            // Alternate between the circle and the star
            if (c++ % 2) {
                p5.stroke(p5c(strokeCircle));
                p5.circle(x, y, d);
            } else {
                // Use the note as a relative rotational velocity.
                //
                // The denominator should be 12, but use 11 for a better looking
                // sketch.
                let rotateBy = (Math.PI * rotateStar) / 11;
                curvedStar(p5, x, y, gap, gap, strokeStar, rotateBy);
            }
            lineCount++;
        }
        // If this line ended with an even number of items, increment the count
        // by 1 so that the next line starts with a a piece that retains the
        // alignment.
        if (lineCount % 2 === 0) c++;
    }
};

/**
 * Draw a curved star centered at (x, y) with a bounding box sized w x h
 *
 * @param stroke Stroke color.
 * @param rotateBy Rotate the star in place by the given radians.
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
    rotateBy: number,
    showOutlines = false,
) => {
    // The coordinates below were laid out for a 240 x 240 sized shape. We scale
    // them appropriately depending on the actual width and height passed to us.
    // Note that this will also scale the strokeWeight (which is mostly the
    // effect we want here).
    const [ow, oh] = [240, 240];

    p5.push();
    p5.translate(x, y);
    if (rotateBy > 0) p5.rotate(rotateBy);
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
        d: p5Types.Vector,
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
