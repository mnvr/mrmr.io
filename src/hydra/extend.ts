// @ts-nocheck
import HydraRenderer from "hydra-synth";

/**
 * Add various extra methods and shaders to Hydra
 *
 * - .aspect: "fix" the aspect ratio so that squares appear as squares
 * - .debug: print the GLSL to console
 */
export const extendHydraRenderer = (hr: HydraRenderer) => {
    addAspect(hr);
    addDebug(hr);
};

const _proto = (hr: HydraRenderer) => hr.synth.osc().constructor.prototype;

/** Modify the aspect ratio to ensure that squares render as squares */
const addAspect = (hr: HydraRenderer) => {
    const h = hr.synth;
    // https://hydra-book.glitch.me/#/textures
    _proto(hr).aspect = function () {
        return this.scale(1, 1, () => h.width / h.height);
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
