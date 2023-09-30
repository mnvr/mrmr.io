import p5Types from "p5";
import Sketch from "p5/Sketch";
import * as React from "react";
import type { P5Draw } from "types";

export interface P5SketchBoxProps {
    /**
     * The draw function to render the P5 sketch.
     */
    draw: P5Draw;

    /**
     * A function that is called to determine the size of the sketch.
     *
     * It should return a pair of numbers, representing the width and the height
     * of the box.
     */
    computeSize: (p5: p5Types) => [number, number];

    /**
     * A ref to the P5 instance that'll be set by {@link P5SketchBox} when setup
     * is first called.
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
     * The audio context in which audio is being (or will be) played.
     *
     * This will be undefined both (a) if the sketch does not have any
     * associated audio, or (b) if the sketch does indeed have audio, but
     * playback has not started at least once.
     */
    audioContext?: AudioContext;

    /**
     * If true, restrict the canvas to the Reel aspect ratio. Otherwise let it
     * expand to fill the window.
     */
    restrictAspectRatio?: boolean;
}

/**
 * A container showing a P5 sketch
 *
 * This is meant to be an relatively generic component, and usually you'd want
 * to use one which handles the sizing for you. e.g. a `ReelSizedP5SketchBox`
 * or a `SquareP5Sketch`.
 *
 * It however has various hooks and controls to allow us to synchronize with an
 * audio source.
 */
export const P5SketchBox: React.FC<P5SketchBoxProps> = ({
    draw,
    computeSize,
    p5Ref,
    shouldDisableLooping,
    audioContext,
}) => {
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
        pageTime: () => {
            // `performance.now` is in milliseconds. convert it to seconds so
            // that we have the same external interface as `audioTime` above.
            return performance.now() / 1000;
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
