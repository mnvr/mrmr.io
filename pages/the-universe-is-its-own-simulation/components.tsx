import ReactP5Wrapper from "p5/ReactP5Wrapper";
import * as React from "react";
import { sketch } from "./sketch";

export const Content: React.FC = () => {
    return <div />; //<P5Layout draw={draw} />;
};

export const Sketch: React.FC = () => {
    return <ReactP5Wrapper sketch={sketch} />;
};
