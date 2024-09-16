import Color from "colorjs.io";
import type p5 from "p5";
import { color, p5c, setAlpha } from "utils/colorsjs";
import { ensure } from "utils/ensure";

export const sketch = (p5) => {
    // Use a 9:16 aspect ratio. For @3x devices, that's 1920/3 = 640 points, and
    // we use that as the height. However, if the window is smaller than that,
    // we limit to the window's height.
    const defaultHeight = 640;
    const aspectRatio = 9 / 16;

    const computeSize = (p5: p5): [number, number] => {
        if (true) {
            // Let it expand to use the first screenful
            return [p5.windowWidth, p5.windowHeight];
        } else {
            // Compute the sizes based on the aspect ratios
            const height = Math.min(defaultHeight, p5.windowHeight);
            const width = height * aspectRatio;
            return [width, height];
        }
    };

    const setup = (p5: p5) => {
        const [width, height] = computeSize(p5);

        // Create and return a new canvas that'll be used by the ReactP5Wrapper
        // library that we're using.
        const canvas = p5.createCanvas(width, height);

        // Save a reference to the p5 instance if we were asked to.
        // if (p5Ref) p5Ref.current = p5;

        // Calling noLoop will ask P5 to call draw once, and then stop. So we'll
        // still see the rendered sketch, but animations will be stopped since
        // no subsequent draw calls will happen (until isPaused is set to true).
        // if (isPaused)
        p5.noLoop();

        return canvas;
    };

    const audioTime = () => 0; //audioContext?.currentTime ?? 0;

    const windowResized = (p5: any) => {
        const [width, height] = computeSize(p5);

        p5.resizeCanvas(width, height);
    };

    // const sketch: Sketch = (p5) => {
    //     if (isPaused) {
    //         p5.noLoop();
    //     } else {
    //         // Calling p5.loop also calls draw() immediately. So we do an
    //         // isLooping check beforehand so as to no unnecessarily call draw
    //         // (since that would cause the frameCount to get out of sync).
    //         if (!p5.isLooping) p5.loop();
    //     }

    p5.setup = () => setup(p5);
    p5.draw = () => draw(p5, audioTime);
    p5.windowResized = () => windowResized(p5);

    // if (isPaused) {
    // p5.noLoop();
    // } else {
    //     // Calling p5.loop also calls draw() immediately. So we do an
    //     // isLooping check beforehand so as to no unnecessarily call draw
    //     // (since that would cause the frameCount to get out of sync).
    //     if (!p5.isLooping) p5.loop();
    // }
};

// This sketch is inspired by the cover of a notebook I have.
export const draw = (p5: p5, audioTime: () => number) => {
    p5.clear();

    const gap = 50;
    const audio = extractAudioMarkersAtTime(trackInfo, audioTime());

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
    if (!isIntro && audio.bar == 2 && Math.floor(audio.barOffset * 10) >= 7) {
        p5.background(0);
        p5.scale(1.02 + audio.bar / 100 + Math.random() * 0.005);
    }
    // Slow speed rotation around the origin
    p5.rotate(Math.sin(audio.loopOffset * Math.PI) / 2);

    gridDots(p5, { gap, stroke: strokeDots });
    gridCirclesAndStars(p5, { gap, strokeCircle, strokeStar, rotateStar });
};

// Extracted from the song.
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

const gridDots = (p5: p5, o = {} as DotsDrawOpts) => {
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

const gridCirclesAndStars = (p5: p5, o = {} as CirclesAndStarsDrawOpts) => {
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
        // by 1 so that the next line starts with a piece that retains the
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
    p5: p5,
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
        a: p5.Vector,
        b: p5.Vector,
        c: p5.Vector,
        d: p5.Vector,
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

/**
 * Information about a track
 *
 * These fields are used by {@link extractAudioMarkersAtTime}
 */
interface TrackInfo {
    /**
     * Beats per minute of the track
     *
     * Note that {@link extractAudioMarkersAtTime} assumes that we're in a 4/4
     * regime.
     */
    bpm: number;
    /**
     * The duration (in seconds) of the track that is being looped.
     *
     * It is imperative to retain as accurate a value for this parameter as
     * possible, since inaccuracies will start compounding the longer the track
     * loops (since each time we'll be marking the track start at an offset
     * instead of the true value, and over time these will pile up).
     */
    duration: number;
}

/**
 * Various coordinates / measures that indicate the current position in the
 * audio track. These values help us in driving the sketch animation.
 *
 * In particular, this is the return value of {@link extractAudioMarkersAtTime}.
 */
export interface AudioMarkers {
    /**
     * We retain a reference to the track info that was passed to us in
     * {@link extractAudioMarkersAtTime}.
     */
    track: TrackInfo;
    /**
     * And also the original time (in seconds).
     */
    audioTime: number;
    /**
     * Time (in seconds).
     *
     * The time (in seconds) since the start of the current iteration of the
     * loop for the track.
     */
    time: number;
    /**
     * Loop / iteration number
     *
     * We continuously loop audio in `track.duration` chunks. Each loop counts
     * as one iteration, and this is the integral counter signifying the
     * iteration number.
     */
    loop: number;
    /**
     * Time, normalized to the loop length
     *
     * A normalized representation of {@link time}. This will be a value between
     * [0, 1] indicating the offset within the current iteration of the loop.
     */
    loopOffset: number;
    /**
     * Time, in beats.
     *
     * We assume 4 / 4 beats - each bar contains 4 beats.
     */
    beats: number;
    /**
     * Time, in bars.
     */
    bars: number;
    /**
     * Bar number, integral.
     *
     * This is useful for indexing into various note maps.
     */
    bar: number;
    /**
     * Offset since the start of the current bar.
     *
     * This is a value between [0, 1].
     */
    barOffset: number;
    /**
     * Similarity index to the start of a bar. onset
     *
     * This is a sinusoidally varying version of barOffset. This value is
     * between [1, -1]. 1 at the onset of the bar, and -1 as we're just about to
     * loop back around. It can be used to drive smooth animations that come
     * into effect the closer we're to the onset of the first beat in a bar.
     */
    nearOnBeat: number;
    /**
     * A variation of {@link nearOnBeat}, but for the off beat (the mid point of
     * the bar).
     */
    nearOffBeat: number;
    /**
     * A generalization of {@link nearOnBeat} and {@link nearOffBeat} that
     * computes the sinusoidal similarity to the onset of an arbitrary offset
     * since the start of a bar.
     */
    nearBeat: (offset: number) => number;
}

/**
 * Obtain various measures and numbers that allow us to locate ourselves within
 * the given track by using the current time provided by the AudioContext.
 *
 * We retain various bits of information about an audio track when creating a
 * sketch. This data is passed to this function as the `trackInfo` parameter.
 *
 * At runtime, we pass the current `audioTime` in each draw call to to locate
 * ourselves at a specific point in the audio track which we're analyzing, and
 * then use that point to emit various numbers / measures that can then be used
 * to animate the sketch.
 *
 * @param trackInfo Static information about the track in which we wish to
 * locate ourselves.
 * @param audioTime The current time reported by the audio context.
 */
export const extractAudioMarkersAtTime = (
    track: TrackInfo,
    audioTime: number,
): AudioMarkers => {
    // Time, in seconds
    const time = audioTime % track.duration;
    // Loop number
    const loop = Math.floor(audioTime / track.duration);
    // Time, normalized to the loop length
    const loopOffset = time / track.duration;
    // We have a beat every 60 / bpm seconds. Divide by this value to obtain the
    // time in units of beats.
    const beats = time / (60 / track.bpm);
    // A bar is 4 beats – this is not always true, but we operate under the
    // assumption that this is true in the cases of the track which we're
    // analyzing.
    //
    // We have a bar every 4 * (60 / bpm) seconds. Divide by this value to
    // obtain the time in units of bars.
    const bars = beats / 4;
    // How far are we away from a bar.
    //
    // This is a number [0, 1].
    const barOffset = bars % 1;
    // Bar number, integral
    // Useful for indexing notes
    const bar = Math.floor(bars - barOffset);

    // We already have a number, bars, whose fractional value indicates how far
    // we're from the start of the onset of the bar. Generalize this concept,
    // but with a sinusoidal decay, and supporting similarity to arbitrary
    // points in the bar.
    //
    // - Add an offset (cycling back if needed to ensure we don't go negative)
    // - Smoothen this number by using a cosine
    // - Scale this number to [0, π] so that the cosine is between [1, -1]
    //
    const nearBeat = (offset: number) =>
        Math.cos(((1 + bars - offset) % 1) * Math.PI);

    const nearOnBeat = nearBeat(0);
    const nearOffBeat = nearBeat(1 / 2);

    return {
        track,
        audioTime,
        time,
        loop,
        loopOffset,
        beats,
        bars,
        barOffset,
        bar,
        nearOnBeat,
        nearOffBeat,
        nearBeat,
    };
};
