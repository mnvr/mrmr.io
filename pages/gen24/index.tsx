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
     * See Note: [Extra height at bottom of ReactP5Wrapper]
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
    min-height: 500px;

    border: 1px solid tomato;
`;

export const sketch: Sketch = (p5) => {
    let lastIndex = { x: 13, y: 13 };
    let cellSize = 100;

    p5.setup = () => p5.createCanvas(500, 500);

    p5.draw = () => {
        p5.background(40);

        for (let y = 0; y <= lastIndex.y; y++) {
            for (let x = 0; x <= lastIndex.x; x++) {
                let px = x * cellSize;
                let py = y * cellSize;
                p5.fill(170);
                p5.rect(px, py, cellSize, cellSize);
            }
        }
        p5.noLoop();
    };
};
