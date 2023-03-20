import { Column } from "components/Column";
import { PageFooterLinks } from "components/PageFooterLinks";
import { Player } from "components/Player";
import * as React from "react";
import styled from "styled-components";
import { song } from "./song";
import { vis } from "./vis";

export const Page: React.FC = () => {
    return (
        <>
            <Player vis={vis} song={song}>
                <Heading />
            </Player>
            <PageFooterLinks iconOpacity={0.9} />
            <Column>
                <HomeContainer>
                    more by @<i className="username">mnvr</i>
                </HomeContainer>
            </Column>
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
            <P>the best is yet to be</P>
        </Column>
    );
};

const H1 = styled.h1`
    margin: 1.8rem;
    margin-block-end: 1.3rem;
    font-weight: 800;
    font-style: italic;
`;

const P = styled.p`
    margin: 1.8rem;
    margin-block-start: 1.3rem;
    margin-block-end: 2rem;
    font-weight: 300;
    letter-spacing: 0.025ch;
    color: var(--mrmr-color-2);
`;

const HomeContainer = styled.div`
    margin-inline: 0.3rem;
    margin-block-start: 0.6rem;
    margin-block-end: 6rem;
    font-size: 0.9rem;

    .username {
        font-family: serif;
        font-size: 0.97rem;
    }
`;
