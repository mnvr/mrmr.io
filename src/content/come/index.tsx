import { Scheduler } from "@strudel.cycles/core";
import { initAudioOnFirstClick } from "@strudel.cycles/webaudio";
import { IconButton } from "components/Buttons";
import { Column } from "components/Column";
import { HydraCanvas } from "components/HydraCanvas";
import * as React from "react";
import { BsPlayFill } from "react-icons/bs";
import { connectWebAudio } from "strudel/webaudio";
import styled from "styled-components";
import { ensure } from "utils/parse";
import { song } from "./song";
import { vis } from "./vis";

export const Page: React.FC = () => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const schedulerRef = React.useRef<Scheduler | null>(null);

    // Keep the canvas hidden until the first playback
    //
    // Hydra clears the canvas to a black color. This causes the black canvas to
    // be displayed until we render the first frame, which only happens if the
    // user starts playing.
    //
    // We could patch Hydra to instead clear to our background color. However,
    // it is perhaps simpler for now for us to just not show the canvas until
    // the first frame is rendered.
    const [shouldShowCanvas, setShouldShowCanvas] = React.useState(false);

    const handleClick: React.MouseEventHandler = (e) => {
        // Toggle the isPlaying state.
        setIsPlaying(!isPlaying);
        // Show the canvas (note that we never hide it again; see the comment
        // above `shouldShowCanvas` for more details).
        setShouldShowCanvas(true);
        e.preventDefault();
    };

    React.useEffect(() => {
        initAudioOnFirstClick();
    }, []);

    React.useEffect(() => {
        const scheduler = connectWebAudio();
        schedulerRef.current = scheduler;

        scheduler.setPattern(song());

        if (isPlaying) scheduler.start();

        // Destroy the current scheduler, we'll recreate a new one, when the
        // song changes.
        return () => scheduler.stop();
    }, [song]);

    React.useEffect(() => {
        const scheduler = ensure(schedulerRef.current);
        if (isPlaying) {
            scheduler.start();
        } else {
            scheduler.pause();
        }
    }, [isPlaying]);

    return (
        <Container>
            <Text />
            <CanvasGrid onClick={handleClick} title="">
                <CanvasContainer isVisible={shouldShowCanvas}>
                    <HydraCanvas {...{ vis, isPlaying }} />
                </CanvasContainer>
                <PlayButtonOverlay isVisible={!isPlaying}>
                    <PlayButton />
                </PlayButtonOverlay>
            </CanvasGrid>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100svh;
`;

const CanvasGrid = styled.div`
    flex-grow: 1;
    margin-bottom: 1.8rem;

    display: grid;
`;

interface CanvasContainerProps {
    isVisible: boolean;
}

const CanvasContainer = styled.div<CanvasContainerProps>`
    display: ${(props) => (props.isVisible ? "block" : "none")};
    grid-area: 1/-1;

    /* The canvas itself is "position: absolute" */
    position: relative;
`;

interface PlayButtonOverlayProps {
    isVisible: boolean;
}

const PlayButtonOverlay = styled.div<PlayButtonOverlayProps>`
    background-color: rgba(72, 65, 79, 0.15);
    backdrop-filter: blur(13px);

    grid-area: 1/-1;

    display: ${(props) => (props.isVisible ? "grid" : "none")};
    place-items: center;
`;

const Text: React.FC = () => {
    return (
        <Column>
            <H1>
                come dream
                <br />
                with me
            </H1>
            <P>the best is yet to be</P>
        </Column>
    );
};

const H1 = styled.h1`
    margin: 1.8rem;
    margin-bottom: 1.3rem;
    font-weight: 800;
    font-style: italic;
`;

const P = styled.p`
    margin: 1.8rem;
    margin-top: 1.3rem;
    margin-bottom: 2rem;
    font-weight: 300;
    letter-spacing: 0.025ch;
    color: hsl(0, 0%, 98%);
`;

const PlayButton: React.FC<React.HTMLAttributes<HTMLButtonElement>> = (
    props
) => {
    return (
        <IconButton hoverColor="hsl(0, 0%, 100%)" {...props}>
            <BsPlayFill size="2rem" title="Play" />
        </IconButton>
    );
};
