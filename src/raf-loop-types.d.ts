declare module "raf-loop" {
    import { EventEmitter } from "events";

    export default Engine;

    /**
     * Engine is the default export for the raf-loop package.
     *
     * It exposes methods to start and stop a RAF (requestAnimationFrame) loop.
     */
    class Engine extends EventEmitter {
        /**
         * Creates a new loop with an optional function to receive tick events.
         * The function will be called with delta time as the first parameter,
         * in milliseconds.
         *
         * @param fn the function to call for each RAF frame. This tick function
         * will be passed `dt` (milliseconds since last update).
         */
        constructor(fn?: (dt: number) => void);
        /** Starts the render loop and returns this engine, for chaining. */
        start: () => void;
        /**
         * Stops the render loop and cancels the currently requested animation
         * frame.
         */
        stop: () => void;
    }
}
