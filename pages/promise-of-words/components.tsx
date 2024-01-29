import { Column } from "components/Column";
import { Link } from "gatsby";
import ReactP5Wrapper from "p5/ReactP5Wrapper";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";
import { sketch } from "./sketch";

export const Sketch1: React.FC = () => {
    const p = `
    ***
    -**
    **-
    -*-
    `;

    return (
        <Sketch1_>
            <ReactP5Wrapper sketch={sketch} pattern={p} />
        </Sketch1_>
    );
};

const Sketch1_ = styled.div`
    margin-block-start: 5.5rem;
    margin-block-end: 6.5rem;

    /**
     * Set a minimum height to prevent a layout shift when the page loads
     *
     * Preventing a layout shift is important for this sketch because it is
     * at the top of the page, and thus the layout shift is very in the face.
     *
     * The height of the sketch will be equal to its width. And the width is
     * determined by the width of Column, which is 24rem. Using the ch unit
     * here seems to get us the same value.
     */
    min-height: 24ch;
`;

export const Sketch2: React.FC = () => {
    const p = `
    ---
    -**
    **-
    -*-
    `;

    return (
        <Sketch2_>
            <ReactP5Wrapper sketch={sketch} pattern={p} animate={true} />
        </Sketch2_>
    );
};

const Sketch2_ = styled.div`
    margin-block: 4rem;
`;

export const EssayContainer: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    return (
        <Column>
            <EssayContainer_ id="essay-container">{children}</EssayContainer_>
        </Column>
    );
};

const EssayContainer_ = styled.div`
    font-family: monospace;
    font-size: 0.75rem;
    font-weight: 800;
    line-height: 1.5;

    /* Style all the canvas elements in the EssayContainer_ */
    canvas {
        /* Same padding as the text in the paragraphs */
        padding-inline: 0.5rem;
    }

    /* Style all the p elements created from the Markdown paragraphs within
       EssayContainer_ */
    p {
        padding-block: 0.3rem;
        padding-inline: 0.5rem;
        border-radius: 2pt;

        background-color: var(--mrmr-text-color);
        color: var(--mrmr-background-color);
    }

    p#poem {
        background-color: var(--mrmr-background-color);
        color: var(--mrmr-text-color);
    }
`;

export const Poem: React.FC = () => {
    return (
        <p id="poem">
            Every word is a promise
            <br />
            That binds me down
            <br />
            Ever so little
            <br />
            Until I can't move under
            <br />
            The weight of all the tales
            <br />
            I've told
            <br />
            <br />
            Every word
            <br />
            A promise
            <br />
            That holds me down
            <br />
            In a cage of my own making
            <br />
            Until I can't fly anymore
            <br />
            <br />
            Yet I write<Blinking>|</Blinking>
        </p>
    );
};

const Blinking = styled.span`
    animation: blink 900ms linear infinite alternate;

    @keyframes blink {
        0% {
            opacity: 0;
        }

        60% {
            opacity: 0;
        }

        100% {
            opacity: 0.9;
        }
    }
`;

export const Info: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { formattedDateMY } = page;

    return (
        <InfoContainer>
            <div>
                Manav Rathi
                <br />
                {formattedDateMY}
            </div>

            <NavContainer>
                <Link to={"/"}>Home</Link>
            </NavContainer>
        </InfoContainer>
    );
};

const InfoContainer = styled.div`
    color: var(--mrmr-title-color);

    margin-block: 6rem;

    /* Same padding as the text in the paragraphs */
    padding-inline: 0.5rem;
`;

const NavContainer = styled.div`
    margin-block-start: 1.7rem;

    a {
        text-decoration: none;
        opacity: 0.8;
    }

    a:hover {
        border-bottom: 1px solid currentColor;
        opacity: 1;
    }
`;
