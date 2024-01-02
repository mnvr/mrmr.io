import { P5CanvasInstance } from "@p5-wrapper/react";

/**
 * Specify the time between actions perform by {@link every}.
 *
 * All the values are optional. When specifying durations, specify using only
 * one unit (the behaviour is undefined otherwise).
 */
export interface EveryOptions {
    /** Alias for {@link seconds} */
    s?: number;
    /** Do the action every `seconds` second. */
    seconds?: number;
    /**
     * Do the action every `ms` milliseconds.
     *
     * The accuracy for this is limited by the frame rate. e.g. at 60 FPS
     * (generally the default), the lowest applicable value we can hit for this
     * is 16.6 ms, below which it'll get rounded up to the nearest frame. But
     * around those time scale, you might not actually be needing this - why not
     * just do the action every frame!
     */
    ms?: number;
}

/**
 * Perform an action once per second (customizable).
 *
 * The `options` parameter allows us to specify the time duration between
 * invocations of the function `action` that is passed to us. By default, the
 * action is triggered once every second.
 */
export const every = (
    p5: P5CanvasInstance,
    options: EveryOptions,
    action: () => void,
) => {
    let s = 1;
    if (options.s) s = options.s;
    if (options.seconds) s = options.seconds;
    if (options.ms) s = options.ms / 1000;

    // Note: [Using getTargetFrameRate instead of frameRate]
    //
    // frameRate is not suitable for our purpose here.
    //
    // Firstly, frameRate doesn't return a value until the first frame is drawn.
    // This could be worked around by having a default value.
    //
    // But the bigger issue is that frameRate is the actually realized frame
    // rate, and so it is a non-integral continuously changing value. What we
    // actually need is the integral frame rate that P5 is trying to achieve.
    //
    // Luckily for us, p5 provides that value, as `getTargetFrameRate`.
    const fps = p5.getTargetFrameRate();

    // Find the nearest frame.
    //
    // The simple case is when seconds is 1. Then, every 1 second, the
    // frameCount is a multiple of the fps (this is by their definitions - fps
    // is frames per second, so after 1 second, the frameCount will be an exact
    // multiple of the fps. `frameCount % fps == 0` is true once every second.
    //
    // Now what if seconds is more than 1. Let us say 2. If we take the modulo
    // of frameCount with (2 * fps), it'll now take twice as long for this to
    // cycle back to 0.
    //
    // The same thing works even if seconds is less than 1? Let us say seconds
    // is 0.5. So if we take the modulo of frameCount under (0.5 * fps), it will
    // now become 0 twice a second.
    //
    // Thus, in both cases, we can scale up the fps by multiplying it with the
    // seconds value, and then use this scaled FPS when taking the modulo of the
    // frame count. Whenever the modulo becomes 0, that's our cue to trigger the
    // action.
    //
    // To handle floating point results of `fps * s`, we take its floor.

    const scaledFPS = p5.floor(fps * s);
    if (p5.frameCount % scaledFPS === 0) {
        action();
    }
};
