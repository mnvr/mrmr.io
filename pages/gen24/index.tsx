import { type Sketch } from "@p5-wrapper/react";
import { ExternalLink } from "components/ExternalLink";
import { LinkStyleUnderlined } from "components/LinkStyles";
import ReactP5WrapperWithFade from "p5/ReactP5WrapperWithFade";
import * as React from "react";
import styled from "styled-components";

export const Content: React.FC = () => {
    return (
        <Content_>
            <FirstFold>
                <Banner />
                <SketchContainer />
            </FirstFold>
            <LinkStyleUnderlined>
                <Description />
            </LinkStyleUnderlined>
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
    return <ReactP5WrapperWithFade sketch={sketch} />;
};

export const sketch: Sketch = (p5) => {
    /**
     * The number of rows and columns in the grid.
     *
     * This is the thing that is usually fixed for a grid. At runtime, we then
     * distribute the available width and height and compute the size of the
     * individual cells ({@link cellSize}).
     */
    let cellCount = { x: 13, y: 13 };

    /**
     * The size (both width and height) of an individual cell in the grid.
     */
    let cellSize = 100;

    /**
     * Offset (usually negtive) after which we should start drawing the first
     * cell in a row (ditto for the first cell in a column).
     *
     * `cellSize * cellCount` will generally not cover the entire canvas.
     * This'll be for two reasons:
     *
     * - `cellSize` is integral, but the width (or height) divided by the
     *   cellCount might not be integral.
     *
     * - The width and height of the canvas might be different, in which case
     *   the `cellSize` is computed such that we get a "size-to-fill" sort of
     *   behaviour. This means that on one of the axes, the last drawn cell
     *   might not be actually the last cell, and it might not even be drawn
     *   fully.
     *
     * To make things aesthetically more pleasing without having a more
     * complicated sizing algorithm, what we do is that we start drawing from an
     * offset, so that there is a similar half-drawn cell at both ends, and the
     * grid overall looks (uniformly) clipped and centered.
     */
    let cellOffset = { x: 0, y: 0 };

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
        // Don't risk a scrollbar
        w -= 2;
        // Clamp
        h = p5.min(h, 900);
        w = p5.min(w, 900);
        return [w, h];
    };

    /**
     * Called whenever the width and height of the sketch is updated, including
     * the first time when the sketch is created.
     */
    const updateSizes = () => {
        const minDimension = p5.max(p5.width, p5.height);
        // Currently we support only cells that are sized the same both in width
        // and height. To keep things simple, we also require that the number of
        // expected rows and columns is the same.
        console.assert(cellCount.x == cellCount.y);
        cellSize = p5.ceil(minDimension / cellCount.x);

        // This'll be negative, which is what we want.
        let remainingX = p5.width - cellSize * cellCount.x;
        let remainingY = p5.height - cellSize * cellCount.y;
        cellOffset = { x: remainingX / 2, y: remainingY / 2 };
    };

    p5.draw = () => {
        p5.background(40);

        for (let y = 0; y < cellCount.y; y++) {
            for (let x = 0; x < cellCount.x; x++) {
                let px = x * cellSize + cellOffset.x;
                let py = y * cellSize + cellOffset.y;
                p5.fill(170);
                p5.rect(px, py, cellSize, cellSize);
            }
        }
    };
};

const Description: React.FC = () => {
    return (
        <Description_>
            <p>
                Genuary is an month-long online art fair (that's one way of
                putting it!) that happens every year, in, you guessed it,
                January. This year I thought I'll do remixes of the other
                Genuary art that I come across and find particularly inspiring.
            </p>
            <p>
                Additionally, I've constrained myself to use only grids. So this
                is like a Griduary too.
            </p>
            <p>
                I'm using p5.js to make these sketches, and the{" "}
                <ExternalLink href="https://github.com/mnvr/mrmr.io/tree/main/pages/gen24">
                    source code for all of these is available on GitHub
                </ExternalLink>
                . The one you see above is not a remix, it is a cover I made to
                kickstart things off. The remixes are below. Tap on any of them
                to view a live version.
            </p>
            <p>Have a great and inspiring 2024.</p>
        </Description_>
    );
};

const Description_ = styled.div`
    margin-block: 1rem;
    margin-inline: 1rem;

    max-width: 30rem;

    p {
        line-height: 1.5rem;
    }

    a {
        font-weight: normal;
    }
`;
