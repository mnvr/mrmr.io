import HydraRenderer from "hydra-synth";
import { extendHydraRenderer } from "hydra/extend";
import { resizeIfNeeded } from "hydra/resize";
import * as React from "react";
import styled from "styled-components";
import { ensure } from "utils/parse";

interface HydraCanvasProps {
    vis: (hr: HydraRenderer) => void;
}

/** A HTML5 canvas that renders the `vis`, passing it a Hydra instance */
export const HydraCanvas: React.FC<HydraCanvasProps> = ({ vis }) => {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const hydraRendererRef = React.useRef<HydraRenderer | null>(null);

    React.useEffect(() => {
        const canvas = ensure(canvasRef.current);
        // Create a new Hydra renderer, asking it to use our canvas.
        const hr = new HydraRenderer({
            // `canvas` element to render to
            canvas,
            // Non-global mode
            //
            // Buffers and functions can be accessed via the `synth` property of
            // the `HydraRenderer` instance. Note that this is known to be a bit
            // buggy still.
            makeGlobal: false,
            // Do not ask for microphone permissions, we currently don't even
            // need them anyways since we don't process incoming audio.
            detectAudio: false,
            // We're not using this, so might as well turn it off
            enableStreamCapture: false,
        });
        hydraRendererRef.current = hr;
        hr.synth.update = () => {
            resizeIfNeeded(hr);
        };
        extendHydraRenderer(hr);
        vis(hr);
    }, [vis]);

    return <Canvas ref={canvasRef} />;
};

const Canvas = styled.canvas`
    /* Our container needs to have position relative for this to work */
    position: absolute;
    width: 100%;
    height: 100%;

    /* Despite its name, this does effect the drawing of graphics primitives
       too. Pixelated is the value that Hydra also uses by default on its web
       version - it leads to sharp, less blurry, edges. */
    image-rendering: pixelated;
`;
