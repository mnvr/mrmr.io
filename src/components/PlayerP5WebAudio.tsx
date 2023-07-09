import { ExpandButton, PlayButton } from "components/Buttons";
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

    // If true, then we'll restrict the aspect ratio of the canvas to match
    // Instagram Reel sizes.
    //
    // Restricting the aspect ratio is useful when recording, and we'll always
    // do this when we're in the special record mode.
    //
    // And there might be some sketches that might not look great when expanded
    // to arbitrary ratios, so that's another reason why we might want to
    // restrict the aspect ratio.
    //
    // But these (relatively) edge cases aside, it'd have been a better default
    // to expand to the window, and only restrict the size for these special
    // cases.
    //
    // We don't do that though, because the 2d canvas performance is horrible on
    // Safari as of today. The same sketch renders smoothly on Chrome, even on a
    // full screen, whilst on Safari going beyond the restricted aspect ratio
    // size starts to stutter.
    //
    // So instead of unilaterally switching to the full screen on all browsers;
    // and instead, we introduce a new button that allows the user to expand the
    // canvas. Is this a better idea than doing a Chrome user agent check? I
    // don't quite know.
    let restrictAspectRatio = true;

    const [shouldExpand, setShouldExpand] = React.useState(false);
    const expandCanvas = () => {
        setShouldExpand(true);
        // This'll usually be called after the P5's setup method has already
        // been called, and the canvas has been created and sized. Modifying the
        // `expandCanvas` state, and transitively, the `restrictAspectRatio`
        // will thus not have any effect on the existing canvas.
        //
        // So we go ahead and resize that right now.
        const p5 = p5Ref.current;
        if (p5) {
            p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        }
    };
    if (shouldExpand) restrictAspectRatio = false;

    // Unconditionally restrict the aspect ratio if we're recording
    if (isRecording) restrictAspectRatio = true;

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
                    restrictAspectRatio={restrictAspectRatio}
                />
                {restrictAspectRatio &&
                    !isPlaying &&
                    !isLoading &&
                    !isRecording && (
                        <ExpandButtonContainer onClick={expandCanvas}>
                            <ExpandButton />
                        </ExpandButtonContainer>
                    )}
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

const ExpandButtonContainer = styled.div`
    /** Only show this on large enough windows */
    display: none;
    @media (min-width: 600px) {
        display: block;
    }

    /* Absolutely position to the bottom left of the nearest relatively
     * positioned container (which'll be the SketchContainer). */
    position: absolute;
    bottom: 0;
    right: 0;

    padding: 1rem;
    z-index: 2;
`;
