import type p5Types from "p5";
import Sketch from "p5/Sketch";
import { VideoRecorder } from "p5/VideoRecorder";
import * as React from "react";
import styled from "styled-components";
import { isDevelopment } from "utils/debug";
import { draw, setup } from "./sketch";

export const Content: React.FC = () => {
    return (
        <Grid>
            <SketchBox />
        </Grid>
    );
};

const Grid = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100svh;
`;

const enableTestRecording = false;

const SketchBox: React.FC = () => {
    const [recorder, _] = React.useState(new VideoRecorder());

    // Instagram's recommended Reel size is 1080x1920 pixels (9:16 aspect ratio)
    // For @3x devices, that'll translate to 1920/3 = 640 points, and we use
    // that as the height. However, if the window is smaller than that, we limit
    // to the window's height.
    const defaultHeight = 640;
    const aspectRatio = 9 / 16;

    const wrappedSetup = (p5: p5Types, canvasParentRef: Element) => {
        const height = Math.min(defaultHeight, p5.windowHeight);
        const width = height * aspectRatio;

        // Use the `parent` method to ask p5 render to the provided canvas ref
        // instead of creating and rendering to a canvas of its own.
        p5.createCanvas(width, height).parent(canvasParentRef);

        if (isDevelopment() && enableTestRecording) {
            setTimeout(() => {
                recorder.start();
            }, 5000);

            setTimeout(() => {
                recorder.stopAndSave();
            }, 10000);
        }

        setup(p5);
    };

    return <Sketch setup={wrappedSetup} draw={draw} />;
};
