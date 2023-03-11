import HydraRenderer from "hydra-synth";
import { extendHydraRenderer } from "hydra/extend";
import { resizeIfNeeded } from "hydra/resize";
import * as React from "react";
import styled from "styled-components";
import { ensure } from "utils/parse";
import Engine from "raf-loop";

interface HydraCanvasProps {
    /**
     * The Hydra visualization to render on the canvas.
     *
     * @param `hr` the {@link HydraRenderer} instance attached to the canvas.
     */
    vis: (hr: HydraRenderer) => void;
    /**
     * Animate the Hydra visualization.
     *
     * If `true`, we start a requestAnimationFrame loop to advance the frames of
     * the Hydra visualization.
     *
     * - @default `false`
     */
    isPlaying: boolean;
}

/**
 * A HTML5 canvas that renders a Hydra visualization
 *
 * A new instance of HydraRenderer will be automatically created and attached to
 * the (newly created) canvas.
 *
 * The canvas will resize itself to cover 100% of its nearest relatively
 * positioned parent. The render size of the canvas will also be updated to
 * match its display size.
 */
export const HydraCanvas: React.FC<HydraCanvasProps> = ({ vis, isPlaying }) => {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const hydraRendererRef = React.useRef<HydraRenderer | null>(null);
    const rafLoopRef = React.useRef<Engine | null>(null);

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
            // We will loop ourselves (so that we can play / pause on user
            // demand).
            autoLoop: false,
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

        rafLoopRef.current = new Engine(hr.synth.tick);
    }, []);

    React.useEffect(() => {
        const hr = ensure(hydraRendererRef.current);
        vis(hr);
    }, [vis]);

    React.useEffect(() => {
        const rafLoop = ensure(rafLoopRef.current);
        isPlaying === true ? rafLoop.start() : rafLoop.stop();
    }, [isPlaying]);

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
