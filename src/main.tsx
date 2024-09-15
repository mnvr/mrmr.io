import React from "react";
import ReactDOM from "react-dom/client";
import styled from "styled-components";
import ReactP5Wrapper from "./p5/ReactP5Wrapper";
import { sketch } from "./univ-sketch.jsx";

const App = () => {
    return (
        <div>
            <UnivApp />
        </div>
    );
    // return <div>Hello</div>;
};

const UnivApp = () => {
    return <Sketch></Sketch>;
};

export const Sketch: React.FC = () => {
    return (
        <Sketch_>
            <ReactP5Wrapper sketch={sketch} />
        </Sketch_>
    );
};

const Sketch_ = styled.div`
    // background-color: oklch(77% 0.242 151.39);
    // color: oklch(97% 0 0);
    // --mr-c-c2: oklch(93.58% 0.12 151);

    /** Provide a minimum height to prevent a layout shift on load */
    min-height: 100vh;
    margin-bottom: 4rem;
`;

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
