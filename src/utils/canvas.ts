/**
 * Snap HTML5 canvas to the nearest pixel boundary to remove blurriness.
 *
 * https://www.khronos.org/webgl/wiki/HandlingHighDPI
 */
export const snapToPixels = (e: HTMLCanvasElement) => {
    const e_rect: Record<string, any> = e.getBoundingClientRect();
    const DPR = window.devicePixelRatio;

    const device_rect: Record<string, any> = {};
    for (const k in e_rect) {
        if (k == "toJSON") continue;
        device_rect[k] = Math.round(e_rect[k] * DPR);
    }

    e.style.position = "fixed";
    e.style.top = device_rect.top / DPR + "px";
    e.style.left = device_rect.left / DPR + "px";
    e.style.width = device_rect.width / DPR + "px";
    e.style.height = device_rect.height / DPR + "px";

    return device_rect;
};
