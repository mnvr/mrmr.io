import { PlayButton } from "components/Buttons";
import { LoadingIndicator } from "components/LoadingIndicator";
import { ReelSizedP5SketchBox } from "components/ReelSizedP5SketchBox";
import { useWebAudioFilePlayback } from "hooks/use-web-audio-playback";
import type p5Types from "p5";
import * as React from "react";
import styled from "styled-components";
import type { P5Draw } from "types";

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
> = ({ draw, songURL }) => {
    const p5Ref = React.useRef<p5Types | undefined>();

    const { isPlaying, isLoading, audioContext, toggleShouldPlay } =
        useWebAudioFilePlayback(songURL, (isPlaying) => {
            const p5 = p5Ref.current;
            if (isPlaying) p5?.loop();
            else p5?.noLoop();
        });

    // Switch to a special "recording" mode if the "#record" fragment is present
    // in the URL. This will:
    // 1. Disable the overlay and hide the play button so as to remove any extra
    //    animations when audio starts playing.
    const [isRecording, setIsRecording] = React.useState(false);
    React.useEffect(() => {
        if (window.location.hash === "#record") setIsRecording(true);
    }, []);

    let showOverlay = !isPlaying;
    if (isRecording) showOverlay = false;

    return (
        <Grid>
            <SketchContainer
                onClick={toggleShouldPlay}
                showOverlay={showOverlay}
            >
                <ReelSizedP5SketchBox
                    draw={draw}
                    p5Ref={p5Ref}
                    shouldDisableLooping={true}
                    audioContext={audioContext}
                />
            </SketchContainer>
            {!isPlaying && (
                <PlayButtonContainer onClick={toggleShouldPlay}>
                    {isLoading ? (
                        <LoadingIndicator />
                    ) : (
                        !isRecording && <PlayButton />
                    )}
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

interface SketchContainerProps {
    showOverlay: boolean;
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

        display: ${(props) => (props.showOverlay ? "block" : "none")};
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
