declare module "hydra-synth" {
    export default HydraRenderer;

    /**
     * HydraRenderer is the default export for the hydra package.
     *
     * The renderer exposes a synth property, which is what we usually interact
     * with after the initial setup.
     */
    class HydraRenderer {
        /** Create a new HydraRenderer instance */
        constructor({
            autoLoop,
            canvas,
            detectAudio,
            enableStreamCapture,
            extendTransforms,
            height,
            makeGlobal,
            numOutputs,
            numSources,
            pb,
            precision,
            width,
        }?: {
            /** Control automatic looping
             *
             * If true (the default), Hydra will automatically loop using
             * requestAnimationFrame, updating the graphics. It'll also call the
             * `update` function for each animation frame.
             *
             * If you set this to false, then you'll need to implement your own
             * loop function and attach it to the `tick` method.
             *
             * - @default true
             */
            autoLoop?: boolean;
            /**
             * Canvas element to render to (optional).
             *
             * If not specified then a canvas will be created and appended to
             * the screen.
             */
            canvas?: HTMLCanvasElement;
            /**
             * Set the width of the canvas
             *
             * Defaults to the width of the `canvas` if specified, otherwise is
             * set to 1280.
             *
             * @see `setResolution`
             */
            width?: number;
            /**
             * Set the height of the canvas
             *
             * Defaults to the height of the `canvas` if specified, otherwise is
             * set to 720.
             *
             * @see `setResolution`
             */
            height?: number;
            /**
             * Set this to false to avoid asking for microphone permissions
             *
             * - @default true
             */
            detectAudio?: boolean;
            /**
             * Set this to false to disable the stream capture functionality.
             *
             * - @default true
             * */
            enableStreamCapture?: boolean;
            extendTransforms?: {};
            /**
             * Set this to false to run Hydra in non-global mode.
             *
             * By default, Hydra adds its various functions to the global
             * namespace. This can be disabled by running in non-global mode by
             * setting `makeGlobal` to false.
             *
             * In non-global mode, buffers and functions can be accessed via the
             * synth property of the hydra instance.
             *
             *     const h = new Hydra({ makeGlobal: false }).synth
             *     h.osc().diff(h.shape()).out()
             *     h.gradient().out(h.o1)
             *     h.render()
             *
             * This also allows for using multiple Hydra canvases at once.
             */
            makeGlobal?: boolean;
            numOutputs?: number;
            numSources?: number;
            pb?: any;
            precision?: any;
        });
        pb: any;
        width: number;
        height: number;
        renderAll: boolean;
        /**
         * By default, Hydra attempts to access the microphone to allow for the
         * audio reactive functionality.
         *
         * It is recommend setting this flag to false when creating a new
         * HydraRenderer to avoid asking for microphone
         */
        detectAudio: boolean;
        /**
         * The synth is what we'd usually consider to be "Hydra".
         *
         * In particular, in non-global mode, all Hydra functions and buffers
         * need to be access using this synth.
         */
        synth: {
            time: number;
            bpm: number;
            width: number;
            height: number;
            fps: any;
            stats: {
                fps: number;
            };
            speed: number;
            mouse: {
                element: any;
            };
            render: any;
            setResolution: any;
            /**
             * The `update` function is called each time a new frame is
             * rendered.
             *
             * @param dt time elapsed in milliseconds since the last update
             */
            update?: (dt: number) => void;
            hush: any;
            tick: any;
        };
        timeSinceLastUpdate: number;
        precision: any;
        extendTransforms: {};
        saveFrame: boolean;
        captureStream: any;
        generator: Generator;
        sandbox: Sandbox;
        eval(code: any): void;
        hush(): void;
        loadScript(url?: string): Promise<any>;
        /**
         * Update the canvas size and other internal state of Hydra to use the
         * given size.
         *
         * - @param `width` the new render width of Hydra's canvas
         * - @param `height` the new render height of Hydra's canvas
         *
         * The current values of the size can be read off the `width` and
         * `height` properties. Initial values for the canvas size can be
         * provided in the constructor.
         */
        setResolution(width: number, height: number): void;
        canvasToImage(callback: any): void;
        canvas: any;
        regl: any;
        renderFbo: any;
        o: any[];
        output: any;
        s: any[];
        createSource(i: any): Source;
        isRenderingAll: boolean;
        tick(dt: any, uniforms: any): void;
    }
}
