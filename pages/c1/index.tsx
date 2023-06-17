import { Script } from "gatsby";
import Sketch from "gatsby/Sketch";
import type p5Types from "p5";
import * as React from "react";
import styled from "styled-components";
import { isDevelopment } from "utils/debug";

declare const P5Capture: any;

export const Content: React.FC = () => {
    return (
        <Grid>
            <SketchContainer>
                <SketchBox />
            </SketchContainer>
        </Grid>
    );
};

const Grid = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100svh;
`;

const SketchContainer = styled.div`
    width: 400px;
    height: 400px;
    background-color: antiquewhite;
`;

const SketchBox: React.FC = () => {
    const [loaded, setLoaded] = React.useState(false);

    // In development mode, load p5.capture
    // (https://github.com/tapioca24/p5.capture).
    //
    // This script shows a recording overlay that allows us to save the p5
    // animation on the canvas into a video.
    const recordingScript =
        "https://cdn.jsdelivr.net/npm/p5.capture@1.4.1/dist/p5.capture.umd.min.js";
    // Easily enable/disable the overlay by toggling this variable.
    const showOverlay = false;
    // p5.capture needs to be told about the p5 instance, so hold onto the
    // reference that we get back from p5-react in the setup method.
    const [p5Instance, setP5Instance] = React.useState<p5Types | undefined>(
        undefined
    );

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        // Use the `parent` method to ask p5 render to the provided canvas ref
        // instead of creating and rendering to a canvas of its own.
        p5.createCanvas(400, 400).parent(canvasParentRef);
        p5.background("lightblue");
        setLoaded(true);
        setP5Instance(p5);
    };

    const draw = (p5: p5Types) => {
        p5.ellipse(100, 100, 70, 70);
        p5.ellipse(110, 100, 70, 70);
    };

    return (
        <>
            <Sketch {...{ setup, draw }} />;
            {showOverlay && isDevelopment() && loaded && (
                <Script
                    src={recordingScript}
                    onLoad={() =>
                        (P5Capture as any).getInstance().initialize(p5Instance)
                    }
                />
            )}
        </>
    );
};
