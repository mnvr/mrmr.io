import { Column } from "components/Column";
import { P5SketchBox } from "components/P5SketchBox";
import { Link } from "gatsby";
import p5 from "p5";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";
import { draw } from "./sketch";

interface SketchProps {
    /**
     * An identifier for each sketch.
     *
     * This is used to modulate the draw function.
     */
    n: number;
}

export const Sketch: React.FC<SketchProps> = ({ n }) => {
    return (
        <P5SketchBox
            draw={(p5: p5) => draw(p5, n)}
            computeSize={essaySketchSize}
        />
    );
};

/**
 * Return the size of the sketches we put in the EssayContainer.
 *
 * We'll use the size of the EssayContainer (obtainable at runtime by using
 * getComputedSize on an element with ID "essay-container") to determine the
 * width. The height will be set as per the square (1:1) aspect ratio.
 */
const essaySketchSize = (p5: p5): [number, number] => {
    const w = essayContainerWidthOrDefault(p5);
    return [w, w];
};

const essayContainerWidthOrDefault = (p5: p5) => {
    let result = 396;

    const essayContainer = p5.select("#essay-container");
    if (essayContainer) {
        const { width } = essayContainer.size() as { width: number };
        result = width;
    }

    // As a sanity check, set minimum and maximum bounds on the size.
    return p5.constrain(result, 100, p5.windowWidth);
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

    /* Style all the canvas elements in the EssayContainer_ */
    canvas {
        /* Asymmetric margins so that visually they look centered */
        margin-block-start: -1.5rem;
        margin-block-end: -1rem;
    }

    /* Style all the p elements created from the Markdown paragraphs within
       EssayContainer_ */
    p {
        padding-block: 0.3rem;
        padding-inline: 0.5rem;
        border-radius: 2pt;

        font-family: monospace;
        font-size: 0.75rem;
        font-weight: 800;

        background-color: var(--mrmr-color-2);
        color: var(--mrmr-background-color-1);
    }

    p#poem {
        background-color: var(--mrmr-background-color-1);
        color: var(--mrmr-color-2);
    }

    p#info {
        background-color: var(--mrmr-background-color-1);
        color: var(--mrmr-color-1);
        margin-block-start: 8rem;
        margin-block-end: 6rem;
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
        <p id="info">
            <div>
                Manav Rathi
                <br />
                {formattedDateMY}
            </div>
            <br />
            <br />
            <NavContainer>
                <Link to={"/"}>More</Link>
            </NavContainer>
        </p>
    );
};

const NavContainer = styled.div`
    a {
        text-decoration: none;
        opacity: 0.8;
    }

    a:hover {
        border-bottom: 1px solid currentColor;
        opacity: 1;
    }
`;
