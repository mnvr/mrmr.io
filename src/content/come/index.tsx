import { IconButton } from "components/Buttons";
import { Column } from "components/Column";
import { HydraCanvas } from "components/HydraCanvas";
import * as React from "react";
import { BsPlayFill } from "react-icons/bs";
import styled from "styled-components";
import { vis } from "./vis";

export const Page: React.FC = () => {
    const [isPlaying, setIsPlaying] = React.useState(false);

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
    margin-top: 2rem;
    margin-bottom: 1.3rem;
    font-weight: 800;
    font-style: italic;
`;

const P = styled.p`
    margin: 1.8rem;
    margin-top: 1.3rem;
    margin-bottom: 1.8rem;
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
