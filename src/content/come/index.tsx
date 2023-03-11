import { Column } from "components/Column";
import * as React from "react";
import styled from "styled-components";
import { HydraCanvas } from "../../components/HydraCanvas";
import { vis } from "./vis";

export const Page: React.FC = () => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    const handleClick: React.MouseEventHandler = (e) => {
        // Toggle the isPlaying state.
        setIsPlaying(!isPlaying);
        e.preventDefault();
    };

    return (
        <Container>
            <Text />
            <CanvasGrid onClick={handleClick} title="">
                <CanvasContainer>
                    <HydraCanvas {...{ vis, isPlaying }} />
                </CanvasContainer>
                <PlayButtonOverlay isVisible={!isPlaying} title="Play | Pause">
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

const CanvasContainer = styled.div`
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

const PlayButton: React.FC = () => {
    return <span>Play</span>;
};
