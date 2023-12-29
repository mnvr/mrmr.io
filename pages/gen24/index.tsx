import type { Sketch } from "@p5-wrapper/react";
import ReactP5Wrapper from "p5/ReactP5Wrapper";
import * as React from "react";
import styled from "styled-components";

export const Content: React.FC = () => {
    return (
        <Content_>
            <FirstFold>
                <Banner />
                <SketchContainer />
            </FirstFold>
        </Content_>
    );
};

const Content_ = styled.div`
    display: flex;
    flex-direction: column;
`;

const FirstFold = styled.div`
    min-height: 98svh;

    display: flex;
    flex-direction: column;
`;

const Banner: React.FC = () => {
    return (
        <Banner_>
            <BannerH />
        </Banner_>
    );
};

const Banner_ = styled.div`
    background-color: green;
    height: 67px;
`;

const SketchContainer: React.FC = () => {
    return (
        <SketchContainer_>
            <Sketch />
        </SketchContainer_>
    );
};

const SketchContainer_ = styled.div`
    background-color: #aac7e0;
    flex-grow: 1;

    display: flex;
    /* center horizontally */
    justify-content: center;
    /* center vertically */
    align-items: center;
`;

const BannerH: React.FC = () => {
    return <BannerH_>GEN 24</BannerH_>;
};

const BannerH_ = styled.h3`
    margin-inline: 1rem;
    color: var(--mrmr-color-3);
    font-weight: 200;
`;

const Sketch: React.FC = () => {
    return <ReactP5Wrapper sketch={sketch} />;
};

export const sketch: Sketch = (p5) => {
    /**
     * The last index determines the number of rows and columns in the grid.
     * This is the thing that is usually fixed for a grid.
     */
    let lastIndex = { x: 13, y: 13 };

    /**
     * The size (both width and height) of an individual cell in the grid.
     */
    let cellSize = 100;

    p5.setup = () => {
        p5.createCanvas(...sketchSize());
        updateSizes();
    };

    p5.windowResized = () => {
        p5.resizeCanvas(...sketchSize());
        updateSizes();
    };

    /**
     * Compute the size of the canvas.
     *
     * This is called both when initially creating the canvas, and also when the
     * window gets resized.
     *
     * Dynamically computing the size of the canvas with CSS queries by using
     * getComputedStyle etc introduces a perceptible delay until the first
     * layout. Maybe there is a way of doing it without that delay, but I
     * haven't found it yet.
     *
     * So our implementation uses only p5.windowWidth and p5.windowHeight
     * properties. This of course results in a size that is not a snug fit, but
     * we handle that by structuring our layout such that it admits a canvas of
     * sizes that are in the same ballpark but not exact.
     */
    const sketchSize = (): [width: number, height: number] => {
        let [w, h] = [p5.windowWidth, p5.windowHeight];
        // Account for the (fixed size) banner at the top, and the slight margin
        // at the bottom of the fold since it is 98svh, not 100vh.
        h -= 100;
        // Clamp
        h = p5.min(h, 300);
        w = p5.min(w, 300);
        return [w, h];
    };

    /**
     * Called whenever the width and height of the sketch is updated, including
     * the first time when the sketch is created.
     */
    const updateSizes = () => {
        const minDimension = p5.min(p5.width, p5.height);
        console.assert(lastIndex.x == lastIndex.y);
        cellSize = p5.ceil(minDimension / lastIndex.x);
    };

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
