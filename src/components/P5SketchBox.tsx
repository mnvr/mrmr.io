import type { P5CanvasInstance, Sketch } from "@p5-wrapper/react";
import type p5 from "p5";
import ReactP5Wrapper from "p5/ReactP5Wrapper";
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
    computeSize: (p5: p5) => [number, number];

    /**
     * A ref to the P5 instance that'll be set by {@link P5SketchBox} when setup
     * is first called.
     *
     * This ref can then subsequently be used to perform actions on the P5
     * object externally. e.g. it can be used to resume looping.
     */
    p5Ref?: React.MutableRefObject<P5CanvasInstance | undefined>;

    /**
     * If true, then pause the draw function by calling P5 `noLoop`.
     *
     * This is useful for sketches that are linked to audio. For such sketches,
     * the animations can be initially disabled, and re-enabled by setting this
     * prop to false when the user starts the audio. This way, the frameCount
     * moves in a deterministic sync with the audio being played.
     */
    isPaused?: boolean;

    /**
     * The audio context in which audio is being (or will be) played.
     *
     * This will be undefined both (a) if the sketch does not have any
     * associated audio, or (b) if the sketch does indeed have audio, but
     * playback has not started at least once.
     */
    audioContext?: AudioContext;
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
    isPaused,
    audioContext,
}) => {
    const setup = (p5: p5) => {
        const [width, height] = computeSize(p5);

        // Create and return a new canvas that'll be used by the ReactP5Wrapper
        // library that we're using.
        const canvas = p5.createCanvas(width, height);

        // Save a reference to the p5 instance if we were asked to.
        if (p5Ref) p5Ref.current = p5;

        // Calling noLoop will ask P5 to call draw once, and then stop. So we'll
        // still see the rendered sketch, but animations will be stopped since
        // no subsequent draw calls will happen (until isPaused is set to true).
        if (isPaused) p5.noLoop();

        return canvas;
    };

    const windowResized = (p5: P5CanvasInstance) => {
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

    const sketch: Sketch = (p5) => {
        if (isPaused) {
            p5.noLoop();
        } else {
            // Calling p5.loop also calls draw() immediately. So we do an
            // isLooping check beforehand so as to no unnecessarily call draw
            // (since that would cause the frameCount to get out of sync).
            if (!p5.isLooping) p5.loop();
        }

        p5.setup = () => setup(p5);
        p5.draw = () => draw(p5, env);
        p5.windowResized = () => windowResized(p5);
    };

    return <ReactP5Wrapper sketch={sketch} />;
};

interface ReelSizedP5SketchBoxProps
    extends Omit<P5SketchBoxProps, "computeSize"> {
    /**
     * If true, restrict the canvas to the Reel aspect ratio. Otherwise let it
     * expand to fill the window.
     */
    restrictAspectRatio?: boolean;
}

/**
 * A specialization of {@link P5SketchBox} that implements the
 * {@link computeSize} function, creating a reel sized container.
 */
export const ReelSizedP5SketchBox: React.FC<ReelSizedP5SketchBoxProps> = (
    props,
) => {
    // Instagram's recommended Reel size is 1080x1920 pixels (9:16 aspect ratio)
    // For @3x devices, that'll translate to 1920/3 = 640 points, and we use
    // that as the height. However, if the window is smaller than that, we limit
    // to the window's height.
    const defaultHeight = 640;
    const aspectRatio = 9 / 16;

    const computeSize = (p5: p5): [number, number] => {
        if (props.restrictAspectRatio) {
            // Compute the sizes based on the aspect ratios
            const height = Math.min(defaultHeight, p5.windowHeight);
            const width = height * aspectRatio;
            return [width, height];
        } else {
            // Let it expand to use the first screenful
            return [p5.windowWidth, p5.windowHeight];
        }
    };

    const ourProps = { computeSize };
    const mergedProps = { ...ourProps, ...props };

    return <P5SketchBox {...mergedProps} />;
};
