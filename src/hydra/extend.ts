// @ts-nocheck
import HydraRenderer from "hydra-synth";

/**
 * Add various extra methods and shaders to Hydra
 **/
export const extendHydraRenderer = (hr: HydraRenderer) => {
    addDebug(hr);
};

/** Print the generated GLSL fragment shader's code to console */
const addDebug = (hr: HydraRenderer) => {
    // https://github.com/ritchse/hydra-extensions/blob/main/hydra-debug.js
    hr.synth.osc().constructor.prototype.debug = function () {
        const passes = this.glsl();
        const code = passes[0].frag;
        console.log(code);
        return this;
    };
};
