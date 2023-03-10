import HydraRenderer from "hydra-synth";

/**
 * Resize the Hydra canvas to match the display size.
 *
 * The HTML canvas has two sizes:
 *
 * - Render size (`canvas.width`, `canvas.height`)
 * - Display size (`canvas.style.width`, `canvas.style.height`)
 *
 * Naively setting the size of the canvas using CSS causes the display size to
 * be changed, but the render size remains the same. Done that way, the canvas
 * resizes according to the CSS but will appear blurry since it is still
 * rendering as per the default render size.
 *
 * Apparently, one does not simply resize the canvas
 * https://github.com/KhronosGroup/WebGL/issues/2460
 *
 * The current best recommendation is to ask the browser what size the canvas is
 * displayed and using that to set the size of the drawing buffer (they go on
 * further about snapping to nearest pixels, we skip that for now).
 * https://www.khronos.org/webgl/wiki/HandlingHighDPI
 *
 *     const devicePixelRatio = window.devicePixelRatio || 1;
 *     canvas.width = canvas.clientWidth * devicePixelRatio;
 *     canvas.height = canvas.clientHeight * devicePixelRatio;
 *
 * This would need to be done whenever the canvas is resized. Packages like
 * react-three-fiber use a third party package for it:
 * https://github.com/pmndrs/react-three-fiber/blob/master/packages/fiber/src/web/Canvas.tsx
 * https://github.com/pmndrs/react-use-measure/blob/master/src/web/index.ts
 *
 * Such a package would handle 2 things that we'd also need:
 * - attaching resize-observers
 * - debouncing
 *
 * In our case, since Hydra already does a RAF loop, we don't need to attach
 * separate observers and can just hook into the requestAnimationFrame and fix
 * up the sizes to match if needed.
 *
 * ### Pixel snapping
 *
 * As mentioned in the WebGL WG links above, the canvas can appear blurry if it
 * ends up being positioned in the CSS at a non-pixel boundary. There is some
 * sample code to also snap it to the nearest pixel boundary in the Khronos
 * wiki. In our case, this might not be needed since the canvas is always edge
 * to edge horizontally. It still might be needed vertically though, but might
 * have a performance impact if we do it here.
 *
 * So we let that be for now. If this seems to be a problem in the future, we
 * can switch to resize observers which are now supposed to provide the physical
 * device pixels in the callback (unfortunately not supported in Safari as of
 * today, March 2023). For more about this, see
 * https://web.dev/device-pixel-content-box/
 */
export const resizeIfNeeded = (hr: HydraRenderer) => {
    const { canvas, width, height } = hr;

    const devicePixelRatio = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth * devicePixelRatio;
    const displayHeight = canvas.clientHeight * devicePixelRatio;

    if (width != displayWidth || height != displayHeight) {
        hr.setResolution(displayWidth, displayHeight);
    }
};
