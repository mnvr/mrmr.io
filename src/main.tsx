import React from "react";
import ReactDOM from "react-dom/client";
import styled from "styled-components";
import { sketch } from "../pages/universe-is-its-own-simulation/sketch";
import ReactP5Wrapper from "./p5/ReactP5Wrapper";

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
    /** Provide a minimum height to prevent a layout shift on load */
    min-height: 100vh;
    margin-bottom: 4rem;
`;

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
