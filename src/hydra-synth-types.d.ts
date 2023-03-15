declare module "hydra-synth" {
    export default HydraRenderer;

    /**
     * HydraRenderer is the default export for the hydra package.
     *
     * The renderer exposes a {@link synth} property (a {@link HydraSynth}),
     * which is what we usually interact with after the initial setup.
     */
    class HydraRenderer {
        /**
         * Create a new {@link HydraRenderer} instance.
         *
         * To create multiple of these, enable non-global mode (
         * {@link makeGlobal}).
         */
        constructor(opts?: {
            /** Control automatic looping
             *
             * If `true` (the default), Hydra will automatically loop using
             * requestAnimationFrame, updating the graphics. It'll also call the
             * `update` function for each animation frame.
             *
             * You can use your own render loop for triggering hydra updates,
             * instead of the automatic looping. To use, set `autoLoop` to
             * false, and call
             *
             *     synth.tick(dt)
             *
             * where `dt` is the time elapsed in milliseconds since the last
             * update.
             *
             * * @default true
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
             * @see {@link setResolution}
             */
            width?: number;
            /**
             * Set the height of the canvas
             *
             * Defaults to the height of the `canvas` if specified, otherwise is
             * set to 720.
             *
             * @see {@link setResolution}
             */
            height?: number;
            /**
             * Set this to `false` to avoid asking for microphone permissions
             *
             * - @default true
             */
            detectAudio?: boolean;
            /**
             * Set this to `false` to disable the stream capture functionality.
             *
             * - @default true
             */
            enableStreamCapture?: boolean;
            extendTransforms?: {};
            /**
             * Set this to `false` to run Hydra in non-global mode.
             *
             * By default, Hydra adds its various functions to the global
             * namespace. This can be disabled by running in non-global mode by
             * setting `makeGlobal` to `false`.
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
        /**
         * Current width.
         *
         * @see {@link setResolution}
         */
        width: number;
        /**
         * Current height.
         *
         * @see {@link setResolution}
         */
        height: number;
        renderAll: boolean;
        /**
         * By default, Hydra attempts to access the microphone to allow for the
         * audio reactive functionality.
         *
         * When not using the audio FFTs, it  is recommend setting this flag to
         * `false` when creating a new HydraRenderer to avoid asking for
         * microphone permissions.
         */
        detectAudio: boolean;
        /**
         * The synth is what we'd usually consider to be "Hydra".
         *
         * In particular, in non-global mode, all Hydra functions and buffers
         * need to be access using this synth.
         */
        synth: HydraSynth;
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
         * @param `width` The new render width of Hydra's canvas
         * @param `height` The new render height of Hydra's canvas
         *
         * The current values of the size can be read off the {@link width} and
         * {@link height} properties. Initial values for the canvas size can be
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
    }

    /**
     * The synth is what we'd usually consider to be "Hydra".
     *
     * In particular, in non-global mode, all Hydra functions and buffers need
     * to be accessed using this synth.
     *
     * The {@link HydraRenderer} (the default export of the library) will create
     * a new instance of `HydraSynth`, and store it as its `synth` property.
     *
     * In global mode, it'll also add all the methods of this `synth` to the
     * global namespace; so you can do e.g. `osc()` instead of `synth.osc()`. If
     * you would like to keep the same syntax in non-global mode, you can
     * destructure the object further:
     *
     *     const { src, osc, gradient, shape, voronoi, noise, s0, s1, s2, s3, o0, o1, o2, o3, render } = hydra
     *     shape(4).diff(osc(2, 0.1, 1.2)).out()
     *
     */
    export interface HydraSynth {
        time: number;
        bpm: number;
        /** unused, instead @see {@link HydraRenderer.width} */
        width: number;
        /** unused, instead @see {@link HydraRenderer.height} */
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
        /** Alias for {@link HydraRenderer.setResolution} */
        setResolution: any;
        /**
         * User defined update function.
         *
         * The `update` function is called each time a new frame is rendered. It
         * is passed the time elapsed (in milliseconds) since the last update.
         *
         * @param `dt` Milliseconds since the last update
         */
        update?: (dt: number) => void;
        hush: any;
        /**
         * An individual Hydra tick.
         *
         * The renderer will automatically call this once per frame using
         * requestAnimationFrame, passing it the milliseconds since the last
         * update.
         *
         * However, if you wish to manually control the looping you can pass
         * `autoLoop` as false when creating the HydraRenderer, and then invoke
         * this to advance the frame.
         *
         * @param `dt` Milliseconds since last update.
         */
        tick(dt: number): void;
    }
}
