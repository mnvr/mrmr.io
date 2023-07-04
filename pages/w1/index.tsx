import { PlayButton } from "components/Buttons";
import { LoadingIndicator } from "components/LoadingIndicator";
import { Link } from "gatsby";
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
    // Track the user's intent (whether or not they've pressed the play button).
    // Whether or not we're actually playing right now (`isPlaying` below)
    // depends on if the audio buffer has been loaded.
    const [shouldPlay, setShouldPlay] = React.useState(false);

    // Creating the audio context here is permitted – the audio context will
    // start off in the suspended state, but we'll resume it later on user
    // interaction (when the user taps the play button).
    //
    // However, creating the audio context here (instead of on first user
    // interaction) causes Chrome to print a spurious warning on the console.
    // *Shrug*
    const audioContextRef = React.useRef(new AudioContext());

    // The audio buffer into which our audio file is loaded into.
    const [audioBuffer, setAudioBuffer] = React.useState<
        AudioBuffer | undefined
    >();

    // An AudioNode that is / was playing `audioBuffer`.
    //
    // This source audio node will be created on first load. Subsequent user
    // toggles will pause / resume the same node.
    const [audioSourceNode, setAudioSourceNode] = React.useState<
        AudioBufferSourceNode | undefined
    >();

    // Load the audio file immediately on page load
    React.useEffect(() => {
        // React runs hooks twice during development, so only do the load if it
        // hasn't already happened.
        if (audioBuffer) {
            return;
        }

        const audioContext = audioContextRef.current;
        createAudioBuffer(audioContext, "/w1.m4a")
            .then((ab) => {
                setAudioBuffer(ab);
                console.log("Audio buffer loaded");

                // Create an audio source node from the buffer.
                setAudioSourceNode(createLoopedAudioNode(audioContext, ab));
            })
            .catch((e) => {
                console.warn(e);
            });
    }, []);

    const toggleShouldPlay = () => {
        const audioContext = audioContextRef.current;
        // Appease the browser's autoplay policy by resuming the audio context
        // on user interaction.
        // https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        setShouldPlay(!shouldPlay);
    };

    // Start or stop audio depending on the user's actions and the audio
    // buffer's loaded status.
    React.useEffect(() => {
        if (shouldPlay) {
            // Start playing the audio, if we've managed to load it so far.
            audioSourceNode?.start();
        } else {
            // Stop playback (if we have a node, that is)
            audioSourceNode?.stop();
        }
    }, [shouldPlay, audioSourceNode]);

    const isPlaying = shouldPlay && !!audioBuffer;
    const isLoading = shouldPlay && !audioBuffer;

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

/**
 * Fetch and decode an audio file into a AudioBuffer
 *
 * @param audioContext The AudioContext` to use for decoding
 * @param URL The (absolute or relative) URL to the audio file. To reduce
 * cross-browser codec compatibility concerns, use MP3 files.
 *
 * [Source - MDN](
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques#dial_up_—_loading_a_sound_sample)
 */
const createAudioBuffer = async (audioContext: AudioContext, url: string) => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
};

/**
 * Create a source node to play an audio buffer in a loop.
 *
 * @param audioContext The AudioContext in which to play.
 * @param audioBuffer The AudioBuffer to play. See `createAudioBuffer` for
 * instance on how to load a file into a buffer.
 *
 * @returns The source AudioNode that will play the buffer. The node will be set
 * to loop. This source can then be subsequently started / stopped.
 *
 * [Source - MDN](
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques#dial_up_—_loading_a_sound_sample)
 */
const createLoopedAudioNode = (
    audioContext: AudioContext,
    audioBuffer: AudioBuffer
) => {
    const bufferSource = new AudioBufferSourceNode(audioContext, {
        buffer: audioBuffer,
    });
    bufferSource.connect(audioContext.destination);
    bufferSource.loop = true;
    return bufferSource;
};
