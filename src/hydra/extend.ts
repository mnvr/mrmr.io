// @ts-nocheck
import HydraRenderer from "hydra-synth";

/**
 * Add various extra methods and shaders to Hydra
 *
 * - .square: "fix" the aspect ratio
 * - .debug: print the GLSL to console
 **/
export const extendHydraRenderer = (hr: HydraRenderer) => {
    addSquare(hr);
    addDebug(hr);
};

const _proto = (hr: HydraRenderer) => hr.synth.osc().constructor.prototype;

/** Modify the aspect ratio to ensure that squares render as squares */
const addSquare = (hr: HydraRenderer) => {
    const h = hr.synth;
    // https://hydra-book.glitch.me/#/textures
    _proto(hr).square = function () {
        // TODO: Doesn't work yet, need the size here
        // const that = this.synth;
        return this.scale(1, 1, () => {
            console.log(h);
            return h.width / h.height;
        });
    };
};

/** Print the generated GLSL fragment shader's code to console */
const addDebug = (hr: HydraRenderer) => {
    // https://github.com/ritchse/hydra-extensions/blob/main/hydra-debug.js
    _proto(hr).debug = function () {
        const passes = this.glsl();
        const code = passes[0].frag;
        console.log(code);
        return this;
    };
};
