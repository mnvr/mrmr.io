/**
 * TypeScript d.ts type declarations for Hydra (Visual) Synth
 * https://github.com/hydra-synth/hydra
 *
 * By Manav Rathi (https://github.com/mnvr/mrmr.io)
 */

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
        /*
         * Book keeping
         * ------------
         */

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

        /*
         * Source functions
         * ----------------
         *
         * A source function (abbreviated as "src") starts of the fragment
         * shader pipeline by introducing one of the {@link GLSLSource}
         * functions.
         *
         * Each function takes different types of parameters (in JS land), but
         * all produce the same output (in GLSL land) - the color for each pixel
         * in the canvas. In JS land, the output is the {@link HydraSynth}
         * instance itself, to allow chaining - i.e. given `h.someSrc()`, we get
         * back the original {@link HydraSynth} as the result of the expression,
         * which allows us to tack on further transformations at the end, say
         * `h.someSrc().someOtherTransform()`.
         *
         * In GLSL land, the input is the (normalized) coordinate of each pixel
         * that we're asking the color of from the shader. But we don't need to
         * worry about passing that input – all that is taken care of by Hydra
         * for us.
         *
         * Hydra comes with some built-in src functions, listed below. It is
         * also possible for us to define our own src functions by specifying
         * their GLSL source as a string.
         */

        /**
         * Render waves of color.
         *
         * While not the most basic – that'd probably be {@link solid} – the
         * {@link osc} function is the most emblematic of Hydra functions.
         *
         * Implementation
         * --------------
         *
         * `osc` is a source function. This means that it gets passed the
         * normalized coordinates (x between 0 and 1, y between 0 and 1) of a
         * pixel on the canvas, and it should return the color for that pixel.
         *
         * The above description is imprecise though, because it conflates
         *
         * 1. the Hydra (JavaScript) `osc` function (that we're currently
         *    documenting), and
         *
         * 2. the generated GLSL function that runs at runtime.
         *
         * So a longer but more precise description is that `osc` (1) is a
         * function that generates a so called "source" GLSL function (2). These
         * are GLSL functions that take normalized ([0-1]) canvas coordinates,
         * and are expected to return the color of the pixel at that coordinate.
         *
         * At runtime, the browser will run the WebGL pipeline, which'll run the
         * GLSL fragment shader for each pixel on the canvas. This GLSL fragment
         * shader will be generated by Hydra (3). Calling the `osc` function (1)
         * in our JavasScript code causes the corresponding GLSL `osc` function
         * (2) to be inserted in the chain of functions in the generated
         * fragment shader (3).
         *
         * Generated Code
         * --------------
         *
         * The generated GLSL code looks like this:
         *
         * ```glsl
         * vec4 osc(vec2 st, float frequency, float sync, float offset) {
         *   ...
         * }
         * ```
         * - The `osc` GLSL function gets passed the normalized coordinates
         *   ([0-1]) of the pixel as a `vec2`. Then, it also gets passed the
         *   arguments that we provided to the Hydra `osc` function.
         *
         * - It must return the color of the pixel. The color has four
         *   components - RGBA - so it is returned as a `vec4`. The alpha value
         *   is not used though, and is always set to 1
         *
         * Let us now look at how the GLSL function is implemented. Remember, it
         * needs to output the color of the pixel `st`. The RGB color will have
         * three components - Red, Green and Blue.
         *
         * The red component depends on the x coordinate of the pixel. Ignoring
         * time for a second (pun intended), let us consider how we might
         * generate a red that increases in "redness" as we go from left to
         * right on the canvas (let us also ignore the other two GB components
         * for a bit).
         *
         * We can set the red component to be equal to the x coordinate. Since
         * the coordinates are already normalized, so directly returning the x
         * value will result in a color that goes from black (r = 0) at the left
         * of the canvas to a pure red (r = 1) at the right of the canvas.
         *
         * ```glsl
         * vec4 osc(vec2 st, float frequency, float sync, float offset) {
         *   return vec4(st.x, 0, 0, 1);
         * }
         * ```
         *
         * (The last value is the alpha, which is 1 to mean a fully opaque
         * color. Hydra doesn't use transparency here).
         *
         * Alright. So we have half a cycle (darkness to redness). The full
         * cycle would go back to darkness. We could do the math to compute the
         * other half, but there's already an easier way (that'll also help us
         * later when we consider time and motion): we can use the `sin`
         * function.
         *
         * The sin function takes a value between 0 and 2 pi, and returns a
         * value between -1 and 1. We want a value between 0 and 1, so we can
         * half the output of the sin function, and then shift it by 0.5 to get
         * it in the 0-1 range.
         *
         * ```glsl
         * vec4 osc(vec2 st, float frequency, float sync, float offset) {
         *   float r = sin(st.x) * 0.5 + 0.5;
         *   return vec4(r, 0, 0, 1);
         * }
         * ```
         *
         * @param frequency
         * @param speed
         * @param offset
         */
        osc();
    }

    /**
     * ## Theory of Operation
     *
     * - We write Hydra code by chaining together various JavaScript functions.
     *
     * - Hydra (the program) converts these into snippets of GLSL code which are
     *   chained together to result in a full GLSL fragment shader that provides
     *   a color for each pixel on the canvas. This is our Hydra visualization.
     *
     * Hydra provides a few housekeeping guarantees:
     *
     * - It sets up the GLSL vertex shader such that that fragment shader runs
     *   for each point on the canvas.
     *
     * - It passes normalized x and y coordinates to the GLSL functions in the
     *   generated code. The original non-normalized coordinates are also
     *   available as the `uv` global variable, were you to need them.
     *
     * - In GLSL land, a "uniform" is a variable that does not change for the
     *   duration of a frame. Hydra injects the following uniforms to the GLSL
     *   world, and they're available for use in GLSL code that Hydra generates
     *   or any custom GLSL snippets / functions that we may write:
     *
     *   - Time: `uniform float time`.
     *
     *   - Canvas size: `uniform vec2 resolution`. This contains the current
     *     width and height of the canvas.
     */
    type Dummy = Int;

    /**
     * ## Source GLSL shader
     *
     * A "src" (source) function in Hydra compiles down to a GLSL fragment
     * shader function that takes as input the 2D coordinate of a pixel (`vec2`)
     * and outputs the color (`vec4`) for that pixel. It runs for each pixel on
     * the render surface on the GPU.
     *
     * The pixel input is provided in normalized coordinates, where the x
     * position is divided by the x resolution, and the y position is divided by
     * the y resolution of the render surface. The GLSL code to compute the
     * input `st` is infact just
     *
     *     vec2 st = gl_FragCoord.xy / resolution.xy;
     *
     * The output of the source function is a `vec4` RGBA color of that
     * corresponding pixel.
     *
     * > This type is defined here for illustrative purposes but it isn't
     *   directly used by the Hydra code. The Hydra code _generates_ a GLSL
     *   shader function that has a shape similar to this, but that's the
     *   generated GLSL code. The shape of the Hydra (JS) function is arbitrary.
     *
     * For an in-context example and description, see the documentation of the
     * {@link osc} source function.
     */
    type GLSLSource = (
        st: [number, number],
    ) => [r: number, g: number, b: number, a: number];
}
