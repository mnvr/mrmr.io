import * as React from "react";
import { Column } from "components/Column";
import styled from "styled-components";
import HydraRenderer from "hydra-synth";
import { extendHydraRenderer } from "hydra/extend";

import { vis } from "./vis";

export const Page: React.FC = () => {
    return (
        <Container>
            <Text />
            <HydraCanvas vis={vis} />
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    height: 100svh;
`;

const Text: React.FC = () => {
    return (
        <Column>
            <H1>
                come dream
                <br />
                with me
            </H1>
            <P>the best is yet to be</P>
        </Column>
    );
};

const H1 = styled.h1`
    margin: 1.8rem;
    margin-top: 2rem;
    margin-bottom: 1.3rem;
    font-weight: 800;
    font-style: italic;
`;

const P = styled.p`
    margin: 1.8rem;
    margin-top: 1.3rem;
    margin-bottom: 1.5rem;
    font-weight: 300;
    letter-spacing: 0.025ch;
    color: hsl(0, 0%, 98%);
`;

interface HydraCanvasProps {
    vis: (hr: HydraRenderer) => void;
}

const HydraCanvas: React.FC<HydraCanvasProps> = ({ vis }) => {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const hydraRendererRef = React.useRef<HydraRenderer | null>(null);

    React.useEffect(() => {
        // Create a new Hydra renderer, asking it to use our canvas.
        const hr = new HydraRenderer({
            // `canvas` element to render to
            canvas: canvasRef.current,
            // Non-global mode
            //
            // Buffers and functions can be accessed via the `synth` property of
            // the `HydraRenderer` instance. Note that this is known to be a bit
            // buggy still.
            makeGlobal: false,
            // Do not ask for microphone permissions, we currently don't even
            // need them anyways since we don't process incoming audio.
            detectAudio: false,
            // width: 1920,
            // height: 1920,
        });
        hydraRendererRef.current = hr;
        extendHydraRenderer(hr);
        vis(hr);
    }, []);

    return <Canvas ref={canvasRef} />;
};

const Canvas = styled.canvas`
    /* width: 100%; */
    /* height: 100%; */
    /* width: 1920px; */
    /* height: 60svh; */
    /* margin-bottom: 1.5rem; */
`;
