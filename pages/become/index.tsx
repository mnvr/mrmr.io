import type { P5CanvasInstance, Sketch } from "@p5-wrapper/react";
import { IconButton, PlayButton } from "components/Buttons";
import { ELink } from "components/ExternalLink";
import { Link } from "gatsby";
import type p5 from "p5";
import ReactP5Wrapper from "p5/ReactP5Wrapper";
import React, { useContext, useEffect, useRef, useState } from "react";
import { isChrome, isMobileSafari, isSafari } from "react-device-detect";
import { FaExpandAlt } from "react-icons/fa";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";
import { type Sequencer, createSequencer } from "./sequencer";
import { draw } from "./sketch";
import { useWebAudioPlayback } from "./use-web-audio-playback";

export const Content: React.FC = () => {
    const page = ensure(useContext(BuildTimePageContext));
    let { mp3s } = page;

    const sequencer = createSequencer(mp3s);

    return (
        <div>
            <PlayerP5WebAudio {...{ sequencer }} />
            <Description />
        </div>
    );
};

const Poem: React.FC = () => {
    return (
        <p>
            To all of you stuck in the words
            <br />
            of dead poets
            <br />
            Go out and find the living ones
            <br />
            <br />
            If you can’t find them
            <br />
            Become
            <br />
        </p>
    );
};

const Description: React.FC = () => {
    return (
        <>
            <PoemContainer>
                <Poem />
            </PoemContainer>
            <FooterContainer>
                <Footer />
            </FooterContainer>
        </>
    );
};

const PoemContainer = styled.div`
    display: grid;
    place-content: center start;
    min-height: 100svh;
    padding: 1.3rem;

    line-height: 1.5;
`;

const Footer: React.FC = () => {
    return (
        <FooterContents>
            <small>
                <p>
                    by <Link to="/">manav</Link> · july 2023
                </p>
                <p id="footer-description">
                    the song was composed in garageband, and the visuals were
                    generated using p5js. source code and stems are on{" "}
                    <ELink href="https://github.com/mnvr/mrmr.io/tree/main/pages/become">
                        github
                    </ELink>
                </p>
            </small>
        </FooterContents>
    );
};

const FooterContainer = styled.div`
    padding: 1.3rem;
    margin-block-end: 4rem;
`;

const FooterContents = styled.footer`
    color: oklch(99% 0 0 / 0.7);

    p#footer-description {
        max-width: 21rem;
        color: oklch(96% 0 0 / 0.6);
    }

    a {
        text-decoration: none;
        border-bottom: 1px solid currentColor;
    }

    a:hover {
        color: oklch(99% 0 0 / 1);
    }
`;

interface PlayerP5WebAudioProps {
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
const PlayerP5WebAudio: React.FC<
    React.PropsWithChildren<PlayerP5WebAudioProps>
> = ({ sequencer }) => {
    const p5Ref = useRef<p5 | undefined>();

    const { isPlaying, isLoading, audioContext, toggleShouldPlay } =
        useWebAudioPlayback(sequencer);

    // Switch to a special "recording" mode if the "#record" fragment is present
    // in the URL. This will:
    // 1. Disable the overlay and hide the play button so as to remove any extra
    //    animations when audio starts playing.
    const [isRecording, setIsRecording] = useState(false);
    useEffect(() => {
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

    const [shouldExpand, setShouldExpand] = useState(false);
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
    useEffect(() => {
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
                $showOverlay={showOverlay}
            >
                <ReelSizedP5SketchBox
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
    $showOverlay: boolean;
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

        display: ${(props) => (props.$showOverlay ? "block" : "none")};
    }

    /* Slot both the sketch and the (conditionally displayed) play button in the
       same grid position so that the play button appears on top (with the
       overlay behind it) when playback is stopped. */
    grid-area: 1/-1;
`;

const LoadingIndicator = styled.div`
    /* Same size as the IconButton components, in particular, PlayButton */
    width: 2rem;
    height: 2rem;

    /* Give it a thick rounded border, except at the bottom */
    border-radius: 50%;
    border: 3px white dotted;
    border-bottom-color: transparent;

    /* Rotate it, at 1 revolutions per second */
    animation: rotate 1s ease-out infinite;

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
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

interface P5SketchBoxProps {
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
const ReelSizedP5SketchBox: React.FC<ReelSizedP5SketchBoxProps> = (props) => {
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
const P5SketchBox: React.FC<P5SketchBoxProps> = ({
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

    const audioTime = () => audioContext?.currentTime ?? 0;

    const windowResized = (p5: P5CanvasInstance) => {
        const [width, height] = computeSize(p5);

        p5.resizeCanvas(width, height);
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
        p5.draw = () => draw(p5, audioTime);
        p5.windowResized = () => windowResized(p5);
    };

    return <ReactP5Wrapper sketch={sketch} />;
};
