import ReactP5Wrapper from "p5/ReactP5Wrapper";
import * as React from "react";
import styled from "styled-components";
import { sketch } from "./sketch";

export const Sketch: React.FC = () => {
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
    min-height: 300px;
    margin-block-start: 2.9rem;
    margin-block-end: 2.5rem;
`;
