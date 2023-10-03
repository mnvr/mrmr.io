import { Column } from "components/Column";
import { Link } from "gatsby";
import ReactP5Wrapper from "p5/ReactP5Wrapper";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";
import { sketch } from "./sketch";

interface SketchProps {
    /**
     * An identifier for each sketch.
     *
     * This is used to modulate the draw function.
     */
    n: number;
}

export const Sketch: React.FC<SketchProps> = ({ n }) => {
    const s = `
    -**
    **-
    -*-
    `;

    const s2 = `
    ---
    -**
    **-
    -*-
    `;

    return <ReactP5Wrapper sketch={sketch} n={n} pattern={n === 0 ? s : s2} />;
};

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
    margin-block: 1rem;

    font-family: monospace;
    font-size: 0.75rem;
    font-weight: 800;

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

        background-color: var(--mrmr-color-2);
        color: var(--mrmr-background-color-1);
    }

    p#poem {
        background-color: var(--mrmr-background-color-1);
        color: var(--mrmr-color-2);
    }
`;

export const Poem: React.FC = () => {
    return (
        <p id="poem">
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
            Yet I write
        </p>
    );
};

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
                <Link to={"/"}>More</Link>
            </NavContainer>
        </InfoContainer>
    );
};

const InfoContainer = styled.div`
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
