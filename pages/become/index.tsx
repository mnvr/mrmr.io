import { PlayerP5WebAudio } from "components/PlayerP5WebAudio";
import { Link } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";
import { onlyValue } from "utils/object";
import { draw } from "./sketch";

export const Content: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { mp3s } = page;

    return (
        <div>
            <PlayerP5WebAudio draw={draw} songURL={ensure(onlyValue(mp3s))} />
            <Description />
        </div>
    );
};

const Poem: React.FC = () => {
    return (
        <p>
            To all of you stuck in the words
            <br />
            of dead poets
            <br />
            Go out and find the living ones
            <br />
            <br />
            If you can’t find them
            <br />
            Become
            <br />
        </p>
    );
};

export const Description: React.FC = () => {
    return (
        <>
            <PoemContainer>
                <Poem />
            </PoemContainer>
            <FooterContainer>
                <Footer />
            </FooterContainer>
        </>
    );
};

const PoemContainer = styled.div`
    display: grid;
    place-content: center start;
    min-height: 100svh;
    padding: 1.3rem;

    line-height: 1.5rem;
`;

const Footer: React.FC = () => {
    return (
        <FooterContents>
            <small>
                <p>
                    music, words and art by <Link to="/">manav</Link>
                </p>
                <p id="footer-description">
                    the song was composed in garageband, and the visuals were
                    generated using p5js. the source code for the sketch is open
                    - you can download both the garageband file and the p5 code
                    from my{" "}
                    <Link to="https://github.com/mnvr/mrmr.io/tree/main/pages/become">
                        github
                    </Link>
                </p>
            </small>
        </FooterContents>
    );
};
const FooterContainer = styled.div`
    padding: 1.3rem;
    margin-block-end: 4rem;
`;

const FooterContents = styled.footer`
    color: oklch(99% 0 0 / 0.7);

    p#footer-description {
        max-width: 21rem;
        color: oklch(96% 0 0 / 0.6);
    }

    a {
        text-decoration: none;
        border-bottom: 1px solid currentColor;
    }

    a:hover {
        color: oklch(99% 0 0 / 1);
    }
`;
