import * as React from "react";
import { Column } from "components/Column";
import styled from "styled-components";
import { ensure } from "utils/parse";
import HydraRenderer, * as Hyd from "hydra-synth";
// import { Hydra } from "hydra-ts";

export const Page: React.FC = () => {
    return (
        <div>
            {/* <Text /> */}
            <HydraCanvas />
        </div>
    );
};

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
    font-weight: 300;
    letter-spacing: 0.025ch;
    color: hsl(0, 0%, 98%);
`;

const HydraCanvas: React.FC = () => {
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
            makeGlobal: true,
            // Do not ask for microphone permissions, we currently don't even
            // need them anyways since we don't process incoming audio.
            detectAudio: false,
        });
        hydraRendererRef.current = hr;

        const h = hr.synth;
        // @ts-ignore
        h.osc().out();
    }, []);

    return <canvas ref={canvasRef} />;
};
