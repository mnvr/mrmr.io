import type { Sketch } from "@p5-wrapper/react";
import ReactP5Wrapper from "p5/ReactP5Wrapper";
import * as React from "react";
import styled from "styled-components";

export const Content: React.FC = () => {
    return (
        <Content_>
            <h3>GEN24</h3>
            <Sketch />
        </Content_>
    );
};

const Content_ = styled.div`
    margin: 1rem;
`;

const Sketch: React.FC = () => {
    return (
        <Sketch_>
            <ReactP5Wrapper sketch={sketch} />
        </Sketch_>
    );
};

const Sketch_ = styled.div`
    border: 1px solid tomato;
`;

export const sketch: Sketch = (p5) => {};
