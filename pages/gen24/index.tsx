import type { Sketch } from "@p5-wrapper/react";
import ReactP5Wrapper from "p5/ReactP5Wrapper";
import * as React from "react";
import styled from "styled-components";

export const Content: React.FC = () => {
    return (
        <Content_>
            <h3>GEN 24</h3>
            <Sketch />
        </Content_>
    );
};

const Content_ = styled.div`
    margin: 1rem;
    h3 {
        color: var(--mrmr-color-3);
        font-weight: 200;
    }
`;

const Sketch: React.FC = () => {
    return (
        <Sketch_>
            <ReactP5Wrapper sketch={sketch} />
        </Sketch_>
    );
};

const Sketch_ = styled.div`
    /**
     * Note: [Extra height at bottom of ReactP5Wrapper]
     *
     * For an unknown reason, the react-p5-wrapper div has an extra 4 pixels of
     * height. Setting the display to flex fixes that discrepancy (I don't know
     * why either).
     */
    display: flex;
    /**
     * Center the sketch within the container.
     */
    justify-content: center;
    /**
     * Provide a minimum height to prevent a layout shift on load
     *
     * This is the same value is that in sketch.tsx.
     */
    min-height: 200px;
    border: 1px solid tomato;
`;

const Sketch2_ = styled.div`
    border: 1px solid tomato;
    /**
     * Note: [Extra height at bottom of ReactP5Wrapper]
     *
     * For an unknown reason, the react-p5-wrapper div has an extra 4 pixels of
     * height. Setting the display to flex fixes that discrepancy (I don't know
     * why either).
     */
    display: flex;
`;

export const sketch: Sketch = (p5) => {
    p5.setup = () => p5.createCanvas(500, 500);

    p5.draw = () => {
        p5.background(40);
        p5.noLoop();
    };
};
