import p5Types from "p5";
import Sketch from "p5/Sketch";
import * as React from "react";
import type { P5Draw } from "types";

interface ReelSizedP5SketchBoxProps {
    /**
     * The draw function to render the P5 sketch
     */
    draw: P5Draw;

    /**
     * A ref to the P5 instance that'll be set by {@link ReelSizedP5SketchBox}
     * when setup is first called.
     *
     * This ref can then subsequently be used to perform actions on the P5
     * object externally. e.g. it can be used to resume looping.
     */
    p5Ref?: React.MutableRefObject<p5Types | undefined>;

    /**
     * If true, then disable looping the draw function by calling the P5
     * `noLoop` function during setup.
     *
     * This is useful for sketches that are linked to audio. For such sketches,
     * the animations can be initially disabled, and re-enabled (using
     * {@link p5Ref}) when the user starts the audio so that the frameCount
     * moves in a deterministic sync with the audio being played.
     */
    shouldDisableLooping?: boolean;

    /**
     * If true, set up the canvas for recording. This'll result in a canvas
     * that's sized more than the viewport so that the recording can be of a
     * higher quality.
     */
    shouldRecord?: boolean;

    /**
     * The audio context in which audio is being (or will be) played.
     *
     * This will be undefined both (a) if the sketch does not have any
     * associated audio, or (b) if the sketch does indeed have audio, but
     * playback has not started at least once.
     */
    audioContext?: AudioContext;
}

export const ReelSizedP5SketchBox: React.FC<ReelSizedP5SketchBoxProps> = ({
    draw,
    p5Ref,
    shouldDisableLooping,
    shouldRecord,
    audioContext,
}) => {
    // Instagram's recommended Reel size is 1080x1920 pixels (9:16 aspect ratio)
    // For @3x devices, that'll translate to 1920/3 = 640 points, and we use
    // that as the height. However, if the window is smaller than that, we limit
    // to the window's height. Also, 640 is a bit too small for some screens, so
    // we use 800 as our limit (moving in increments of 160: 640 => 800 => 960
    // => ... => 1920).
    //
    // Note about recording
    // --------------------
    //
    // When recording the canvas using our `CanvasRecorder`, we can record at a
    // higher size to account for the fact that the MediaRecorder API produces
    // compressed videos that have compression artifacts. Since the recording is
    // capturing the canvas and not the part we see on screen, we can
    // arbitrarily increase the canvas size, e.g. by setting the `defaultHeight`
    // to 1920.
    const defaultHeight = 800;
    const aspectRatio = 9 / 16;

    const computeSize = (p5: p5Types): [number, number] => {
        const height = shouldRecord
            ? 1920
            : Math.min(defaultHeight, p5.windowHeight);
        const width = height * aspectRatio;
        return [width, height];
    };

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        const [width, height] = computeSize(p5);

        // Use the `parent` method to ask p5 render to the provided canvas ref
        // instead of creating and rendering to a canvas of its own.
        p5.createCanvas(width, height).parent(canvasParentRef);

        // Save a reference to the p5 instance if we were asked to.
        if (p5Ref) p5Ref.current = p5;

        // Calling noLoop will ask P5 to call draw once, and then stop. So we'll
        // still see the rendered sketch, but animations (or more generally,
        // subsequent draw calls) will be stopped.
        if (shouldDisableLooping === true) p5.noLoop();
    };

    const windowResized = (p5: p5Types) => {
        const [width, height] = computeSize(p5);

        p5.resizeCanvas(width, height);
    };

    const env = {
        audioTime: () => {
            return audioContext?.currentTime ?? 0;
        },
    };

    const wrappedDraw = (p5: p5Types) => {
        draw(p5, env);
    };

    return (
        <Sketch
            setup={setup}
            draw={wrappedDraw}
            windowResized={windowResized}
        />
    );
};
