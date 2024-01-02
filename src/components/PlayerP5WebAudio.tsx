import { IconButton, PlayButton } from "components/Buttons";
import { LoadingIndicator } from "components/LoadingIndicator";
import { ReelSizedP5SketchBox } from "components/ReelSizedP5SketchBox";
import { useWebAudioPlayback } from "hooks/use-web-audio-playback";
import type p5 from "p5";
import * as React from "react";
import { isChrome, isMobileSafari, isSafari } from "react-device-detect";
import { FaExpandAlt } from "react-icons/fa";
import styled from "styled-components";
import type { P5Draw } from "types";
import { ensure } from "utils/ensure";
import { type Sequencer } from "webaudio/audio";

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
     * A function to construct the WebAudio graph to play audio in the page.
     */
    sequencer: Sequencer;
}

/**
 * Show a full screen with a reel sized P5 sketch, and a play button that
 * controls the playback of the provided MP3 file.
 *
 * The player takes up at least the first screen height.
 */
export const PlayerP5WebAudio: React.FC<
    React.PropsWithChildren<PlayerP5WebAudioProps>
> = ({ draw, sequencer }) => {
    const p5Ref = React.useRef<p5 | undefined>();

    const { isPlaying, isLoading, audioContext, toggleShouldPlay } =
        useWebAudioPlayback(sequencer);

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

    // Workaround for Safari not using the backdrop-filter on initial page load.
    //
    // We overlay a frosted glass effect on top of the sketch when playback is
    // paused. This effect is implemented using the CSS backdrop-filter.
    //
    // This works fine in Chrome. But it only works in Safari the next time
    // after the page has been loaded – on initial page load, the backdrop
    // filter doesn't show up.
    //
    // This is a functional issue, since without the frosted glass overlay the
    // play / expand buttons get lost amongst the sketch elements themselves.
    //
    // As a workaround, I tried reducing the opacity of the sketch when the
    // overlay is shown. This worked in Safari, but this now caused the overlay
    // to look incorrect in Chrome.
    //
    // Hence, this hackier workaround. This essentially forces a repaint, which
    // is apparently enough for Safari to notice the backdrop filter.
    //
    // Source for this workaround:
    // https://stackoverflow.com/questions/65450735/backdrop-filter-doesnt-work-on-safari-most-of-the-times
    React.useEffect(() => {
        // We need this workaround only on Safari
        if (!(isSafari || isMobileSafari)) return;
        setTimeout(() => {
            const el = ensure(
                window.document.getElementById("sketch-container"),
            );
            el.style.display = "table";
            el.offsetHeight;
            el.style.display = "block";
        }, 500);
    }, []);

    return (
        <Grid>
            <SketchContainer
                id="sketch-container"
                onClick={toggleShouldPlay}
                showOverlay={showOverlay}
            >
                <ReelSizedP5SketchBox
                    draw={draw}
                    p5Ref={p5Ref}
                    isPaused={!isPlaying}
                    audioContext={audioContext}
                    restrictAspectRatio={restrictAspectRatio}
                />
                {restrictAspectRatio &&
                    /* Show the expand button only on Chrome where the expanded
                       animation runs at full FPS. On other browsers (I tested
                       Safari) the user might expand it initially and then
                       suffer through the horribly laggy animation and go away
                       thinking that was the only option */
                    isChrome &&
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
    &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        /* Safari doesn't cover the entire sketch, and a bit of the pixels on
           the left and right show right through the ::after pseudo-element
           overlay. I don't know or understand why, though my best guess is that
           it has something to do with fractional pixel positions of the sketch.

           Adding a tranparent border fixes the issue on the right hand side
           (and right hand side only). So this is half a workaround, and the
           problem still persists on the left hand side, but hey, the glass now
           contains less poison than before. */
        border: 1px solid transparent;

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

const ExpandButton: React.FC = () => {
    return (
        <IconButton>
            <FaExpandAlt title="Expand" />
        </IconButton>
    );
};
