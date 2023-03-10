import { Column } from "components/Column";
import * as React from "react";
import styled from "styled-components";
import { HydraCanvas } from "../../components/HydraCanvas";
import { vis } from "./vis";

export const Page: React.FC = () => {
    return (
        <Container>
            <Text />
            <CanvasContainer>
                {/* <HydraCanvas vis={vis} /> */}
                <Placeholder />
                <Placeholder2 />
            </CanvasContainer>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100svh;
`;

const CanvasContainer = styled.div`
    flex-grow: 1;
    margin-bottom: 1.8rem;

    display: grid;
    background-color: aliceblue;
`;

const Placeholder = styled.div`
    background-color: bisque;
    grid-area: 1/-1;
`;

const Placeholder2 = styled.div`
    background-color: red;
    grid-area: 1/-1;
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
