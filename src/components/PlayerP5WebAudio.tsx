import { PlayButton } from "components/Buttons";
import { useWebAudioFilePlayback } from "hooks/use-web-audio-playback";
import p5Types from "p5";
import { VideoRecorder } from "p5/VideoRecorder";
import * as React from "react";
import Sketch from "react-p5";
import styled from "styled-components";
import type { P5Draw } from "types";
import { isDevelopment } from "utils/debug";
import { LoadingIndicator } from "./LoadingIndicator";

interface PlayerP5WebAudioProps {
    /**
     * The P5 visualization to render
     *
     * Specifically, this is the draw function that is rendered by P5 for each
     * frame. Whilst we can also support the setup function too, in practice
     * using split setup / draw functions causes problems with hot-reload, and
     * it is easier just to redraw everything in draw and not do anything in
     * setup at all; that way, hot reloading (when the draw function changes)
     * doesn't need to bother running setup again to reset the canvas state.
     */
    draw: P5Draw;
    /**
     * The URL of the audio file to play
     *
     * This file will be played, in an infinite loop, using WebAudio.
     */
    songURL: string;
}

/**
 * Show a full screen with a reel sized P5 sketch, and a play button that
 * controls the playback of the provided MP3 file.
 *
 * The player takes up at least the first screen height.
 */
export const PlayerP5WebAudio: React.FC<
    React.PropsWithChildren<PlayerP5WebAudioProps>
> = ({ draw, songURL, children }) => {
    const [isPlaying, isLoading, toggleShouldPlay] =
        useWebAudioFilePlayback(songURL);

    return (
        <Grid>
            <SketchContainer onClick={toggleShouldPlay} isPlaying={isPlaying}>
                <SketchBox draw={draw} />
            </SketchContainer>
            {!isPlaying && (
                <PlayButtonContainer onClick={toggleShouldPlay}>
                    {isLoading ? <LoadingIndicator /> : <PlayButton />}
                </PlayButtonContainer>
            )}
        </Grid>
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

interface SketchBoxProps {
    draw: P5Draw;
}

const SketchBox: React.FC<SketchBoxProps> = ({ draw }) => {
    const [recorder, _] = React.useState(new VideoRecorder());

    // Instagram's recommended Reel size is 1080x1920 pixels (9:16 aspect ratio)
    // For @3x devices, that'll translate to 1920/3 = 640 points, and we use
    // that as the height. However, if the window is smaller than that, we limit
    // to the window's height.
    const defaultHeight = 640;
    const aspectRatio = 9 / 16;

    const setup = (p5: p5Types, canvasParentRef: Element) => {
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
    };

    return <Sketch setup={setup} draw={draw} />;
};
