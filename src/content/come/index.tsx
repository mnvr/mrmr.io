import { Column } from "components/Column";
import * as React from "react";
import styled from "styled-components";
import { HydraCanvas } from "../../components/HydraCanvas";
import { vis } from "./vis";

export const Page: React.FC = () => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    return (
        <Container>
            <Text />
            <CanvasGrid>
                <CanvasContainer>
                    <HydraCanvas {...{ vis, isPlaying, setIsPlaying }} />
                </CanvasContainer>
                <PlayButtonOverlay style={{ display: "none" }}>
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
    background-color: aliceblue;
`;

const CanvasContainer = styled.div`
    background-color: bisque;
    grid-area: 1/-1;

    /* The canvas itself is "position: absolute" */
    position: relative;
`;

const PlayButtonOverlay = styled.div`
    background-color: red;
    opacity: 0.1;
    grid-area: 1/-1;

    display: grid;
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
