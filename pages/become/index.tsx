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
            And if you can’t find them
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
                <FooterContents>
                    <small>
                        <span className="link-prelude">
                            music, words and art by{" "}
                        </span>
                        <Link to="/">manav</Link>
                    </small>
                </FooterContents>
            </FooterContainer>
        </>
    );
};

const PoemContainer = styled.main`
    display: grid;
    place-content: center start;
    min-height: 80svh;
    padding: 1.3rem;

    line-height: 1.4rem;
`;

const FooterContainer = styled.footer`
    padding: 1.3rem;
    margin-block-end: 4rem;
`;

const FooterContents = styled.div`
    .link-prelude {
        opacity: 0.7;
    }

    a {
        text-decoration: none;
        opacity: 0.7;
        border-bottom: 1px solid currentColor;
    }

    a:hover {
        opacity: 1;
    }
`;
