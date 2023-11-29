import ReactP5Wrapper from "p5/ReactP5Wrapper";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";
import { FooterHomePageLink } from "./FooterHomePageLink";
import { sketch } from "./sketch";

export const Sketch: React.FC = () => {
    return (
        <Sketch_>
            <ReactP5Wrapper sketch={sketch} />
            <MoreContentIndicator />
        </Sketch_>
    );
};

const Sketch_ = styled.div`
    /** Provide a minimum height to prevent a layout shift on load */
    min-height: 100vh;
    margin-bottom: 4rem;
`;

/**
 * Show an arrow pointing downwards to indicate the presence of more content
 * below the fold.
 */
const MoreContentIndicator: React.FC = () => {
    return (
        <Overlay>
            <Arrow />
        </Overlay>
    );
};

const Overlay = styled.div`
    position: absolute;
    text-align: center;
    width: 100%;
    top: 94vh;

    opacity: 0;
    animation: fade-away 4s ease-out;
    @keyframes fade-away {
        0% {
            opacity: 0.6;
        }
        100% {
            opacity: 0;
        }
    }
`;

const Arrow: React.FC = () => {
    return (
        <div>
            <svg width="50" height="20">
                <g stroke="currentColor" strokeWidth={5} strokeLinecap="round">
                    <path d="M 4 4 L 25 18 L 46 4" fill="transparent" />
                </g>
            </svg>
        </div>
    );
};

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
    color: var(--mrmr-color-2);
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

    line-height: 1.3;

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
        <Footer_>
            <FooterHomePageLink />
        </Footer_>
    );
};

const Footer_ = styled.div`
    margin-block-start: 4rem;
    margin-block-end: 5rem;
`;
