import { Column } from "components/Column";
import { PlayerHydraStrudel } from "components/PlayerHydraStrudel";
import { Link } from "gatsby";
import * as React from "react";
import { RxSlash } from "react-icons/rx";
import styled from "styled-components";
import { song } from "./song";
import { vis } from "./vis";

export const Content: React.FC = () => {
    return (
        <>
            <PlayerHydraStrudel vis={vis} song={song}>
                <Heading />
            </PlayerHydraStrudel>
            <Text />
            <Footer />
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
            <P>
                Come dream with me
                <br />
                The stars are yet to be
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

const Footer: React.FC = () => {
    return (
        <Column>
            <FooterContents>
                <DetailsContainer>
                    Manav Rathi
                    <br />
                    <small>Feb 2023</small>
                </DetailsContainer>
                <HomeLinkContainer>
                    <Link to="/">
                        <RxSlash title="Home" />
                    </Link>
                </HomeLinkContainer>
            </FooterContents>
        </Column>
    );
};

const FooterContents = styled.div`
    margin-block-end: 6rem;
    font-size: 0.9rem;
`;

const DetailsContainer = styled.div`
    margin: 1.8rem;
    opacity: 0.5;
`;

const HomeLinkContainer = styled.div`
    /* Slightly less margin than the 1.8 above, to visually align the slash */
    margin-inline: 1.7rem;

    a {
        text-decoration: none;
        opacity: 0.5;
    }

    a:hover {
        opacity: 1;
    }
`;
