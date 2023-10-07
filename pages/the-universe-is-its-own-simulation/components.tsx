import { Link } from "gatsby";
import ReactP5Wrapper from "p5/ReactP5Wrapper";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";
import { sketch } from "./sketch";

export const Sketch: React.FC = () => {
    return (
        <Sketch_>
            <ReactP5Wrapper sketch={sketch} />
        </Sketch_>
    );
};

const Sketch_ = styled.div`
    /** Provide a minimum height to prevent a layout shift on load */
    min-height: 100vh;
    margin-bottom: 4rem;
`;

export const Title: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { formattedDateMY } = page;

    return (
        <TitleContainer>
            <h1>
                The Universe Is
                <br />
                Its Own Simulation
            </h1>
            <div>
                <Caption>
                    Manav Rathi
                    <br />
                    {formattedDateMY}
                </Caption>
            </div>
        </TitleContainer>
    );
};

const TitleContainer = styled.div`
    margin-inline: auto;
    text-align: center;
`;

const Caption = styled.small`
    color: oklch(93.58% 0.12 151);
`;

export const Poem: React.FC = () => {
    return (
        <PoemP>
            The universe is its own simulation
            <br />
            The universe shines in its own light
            <br />
            There is nothing else that could be
            <br />
            There is nothing else as bright
            <br />
        </PoemP>
    );
};

const PoemP = styled.p`
    margin-block-start: 3rem;
    margin-block-end: 2rem;
    text-align: center;
    font-family: serif;
    font-style: italic;
    font-size: 1.03rem;
    color: white;
`;

export const EssayContainer = styled.div`
    margin-block-start: 3rem;
    margin-inline: auto;
    max-width: 24rem;
    background-color: oklch(90% 0.1 148 / 0.5);
    color: darkgreen;
    padding-inline: 1.5rem;
    padding-block: 12px;
    border-radius: 12px;

    line-height: 1.3rem;

    hr {
        width: 30%;
        margin-block: 3rem;
        height: 2px;
        color: var(--mrmr-background-color-1);
    }

    blockquote {
        font-family: serif;
        font-size: 1.05rem;
    }
`;

export const QuoteSpan = styled.span`
    font-family: serif;
    font-style: italic;
    font-size: 1.05rem;
`;

export const MutedSpan = styled.span`
    opacity: 0.8;
`;

export const Footer: React.FC = () => {
    return (
        <FooterContainer>
            <Caption>
                <Link to={"/"}>More</Link>
            </Caption>
        </FooterContainer>
    );
};

const FooterContainer = styled.div`
    margin-block-start: 4rem;
    margin-block-end: 4rem;

    text-align: center;

    a {
        text-decoration: none;
        opacity: 0.8;
    }

    a:hover {
        border-bottom: 1px solid currentColor;
        opacity: 1;
    }
`;
