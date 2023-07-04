import { PlayButton } from "components/Buttons";
import { LoadingIndicator } from "components/LoadingIndicator";
import { Link } from "gatsby";
import { useWebAudioFilePlayback } from "hooks/use-web-audio-playback";
import type p5Types from "p5";
import Sketch from "p5/Sketch";
import { VideoRecorder } from "p5/VideoRecorder";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { isDevelopment } from "utils/debug";
import { ensure } from "utils/ensure";
import { draw, setup } from "./sketch";

export const Content: React.FC = () => {
    const [isPlaying, isLoading, toggleShouldPlay] =
        useWebAudioFilePlayback("/w1.m4a");

    return (
        <div>
            <Grid>
                <SketchContainer
                    onClick={toggleShouldPlay}
                    isPlaying={isPlaying}
                >
                    <SketchBox />
                </SketchContainer>
                {!isPlaying && (
                    <PlayButtonContainer onClick={toggleShouldPlay}>
                        {isLoading ? <LoadingIndicator /> : <PlayButton />}
                    </PlayButtonContainer>
                )}
            </Grid>
            <Footer />
        </div>
    );
};

const Grid = styled.div`
    display: grid;
    place-items: center;
    min-height: 100svh;
`;

const enableTestRecording = false;

interface SketchContainerProps {
    isPlaying: boolean;
}

const SketchContainer = styled.div<SketchContainerProps>`
    position: relative;

    /* Show an overlay on top of the sketch when the user is not playing */
    &&::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        /* Frosted glass effect */
        backdrop-filter: blur(8px) saturate(100%) contrast(60%) brightness(130%);
        /* Safari wants its own prefix */
        -webkit-backdrop-filter: blur(8px) saturate(100%) contrast(60%)
            brightness(130%);

        display: ${(props) => (props.isPlaying ? "none" : "block")};
    }

    /* Slot both the sketch and the (conditionally displayed) play button in the
       same grid position so that the play button appears on top (with the
       overlay behind it) when playback is stopped. */
    grid-area: 1/-1;
`;

const PlayButtonContainer = styled.div`
    grid-area: 1/-1;

    display: grid;
    z-index: 1;
`;

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

const Footer: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { title } = page;

    return (
        <FooterContainer>
            <FooterContents>
                <div>
                    <big>
                        <b>{title}</b>
                    </big>
                </div>
                <div>
                    <small>
                        <span className="link-prelude">by </span>
                        <Link to="/">Manav</Link>
                    </small>
                </div>
            </FooterContents>
        </FooterContainer>
    );
};

const FooterContainer = styled.footer`
    display: grid;
    place-items: center;
    min-height: 100svh;
`;

const FooterContents = styled.div`
    text-align: center;

    .link-prelude {
        opacity: 0.7;
    }

    a {
        text-decoration: none;
        opacity: 0.7;
        border-bottom: 1px solid currentColor;
    }

    a:hover {
        opacity: 1;
    }
`;
