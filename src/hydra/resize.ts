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
 */
export const handleUpdateResizingIfNeeded = (hr: HydraRenderer) => {
    hr.synth.update = (dt: number) => {
        resizeIfNeeded(hr);
    };
};

const resizeIfNeeded = (hr: HydraRenderer) => {
    const { canvas, width, height } = hr;

    const devicePixelRatio = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth * devicePixelRatio;
    const displayHeight = canvas.clientHeight * devicePixelRatio;

    if (width != displayWidth || height != displayHeight) {
        hr.setResolution(displayWidth, displayHeight);
    }
};
