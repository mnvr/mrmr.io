import { Column } from "components/Column";
import { PageFooterA } from "components/PageFooterA";
import { PlayerA } from "components/PlayerA";
import * as React from "react";
import styled from "styled-components";
import { song } from "./song";
import { vis } from "./vis";

export const Content: React.FC = () => {
    return (
        <>
            <PlayerA vis={vis} song={song}>
                <Heading />
            </PlayerA>
            <Text />
            <PageFooterA />
        </>
    );
};

const Heading: React.FC = () => {
    return (
        <Column>
            <H1>
                come dream
                <br />
                with me
            </H1>
            <Caption>the stars are yet to be</Caption>
        </Column>
    );
};

const H1 = styled.h1`
    margin: 1.8rem;
    margin-block-end: 1.3rem;
    font-weight: 800;
    font-style: italic;
`;

const Caption = styled.p`
    margin: 1.8rem;
    margin-block-start: 1.3rem;
    margin-block-end: 2rem;
    font-weight: 300;
    letter-spacing: 0.025ch;
    color: var(--mrmr-color-2);
`;

const Text: React.FC = () => {
    return (
        <Column>
            <P>
                You've been dreaming of you
                <br />
                I've been dreaming of me
                <br />
                We've been dreaming of time
                <br />
                Endlessly
            </P>
        </Column>
    );
};

const P = styled.p`
    margin: 1.8rem;
    line-height: 1.7rem;
    font-size: 1.2rem;
    font-style: italic;
    font-weight: 300;
    letter-spacing: 0.025ch;
    color: var(--mrmr-color-1);
`;
