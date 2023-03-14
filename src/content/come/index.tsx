import { Column } from "components/Column";
import { Player } from "components/Player";
import * as React from "react";
import styled from "styled-components";
import { song } from "./song";
import { vis } from "./vis";

export const Page: React.FC = () => {
    return (
        <Player vis={vis} song={song}>
            <Heading />
        </Player>
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
