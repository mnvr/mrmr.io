// @ts-nocheck
import HydraRenderer from "hydra-synth";

/**
 * Add various extra methods and shaders to Hydra
 *
 * - .aspect: "fix" the aspect ratio so that squares appear as squares
 * - .hsl(h, s, l): specify a color in HSL notation (variation of `solid`)
 * - .debug: print the GLSL to console
 */
export const extendHydraRenderer = (hr: HydraRenderer) => {
    addAspect(hr);
    addHSL(hr);
    addDebug(hr);
};

const _proto = (hr: HydraRenderer) => hr.synth.osc().constructor.prototype;

/** Modify the aspect ratio to ensure that squares render as squares */
const addAspect = (hr: HydraRenderer) => {
    const h = hr.synth;
    // The rationale is explained here: https://hydra-book.glitch.me/#/textures
    //
    // In particular, this should be an function so that it adapts to changes in
    // the width and height of the canvas.
    _proto(hr).aspect = function () {
        return this.scale(1, 1, () => h.width / h.height);
    };
};

/**
 * Set a color specified using HSL.
 *
 * This behaves similar to the native `solid` function, except instead of taking
 * three "r", "g" and "b" floating point values, it takes three "h", "s" and "l"
 * floats (each [0,1]). They're interpreted similar as CSS HSL values.
 *
 * e.g. CSS color `hsl(248.2, 99.1%, 55.5%)` => `hsl(248.2/360, 0.991, 0.555)`.
 */
const addHSL = (hr: HydraRenderer) => {
    // This relies on the presence of an utility method (`_rgbToHsv`) defined
    // internally by Hydra.
    //
    // HSV to HSL conversion adapted from:
    // https://github.com/ritchse/hydra-extensions/blob/main/hydra-colorspaces.js
    hr.synth.setFunction({
        name: "hsl",
        type: "src",
        inputs: [
            {
                type: "float",
                name: "h",
                default: 1,
            },
            {
                type: "float",
                name: "s",
                default: 1,
            },
            {
                type: "float",
                name: "l",
                default: 1,
            },
        ],
        glsl: `  vec3 _hsv;
        _hsv.x = h;
        _hsv.z = l + (s*min(l,1.0-l));
        _hsv.y = 2.0*(1.0-(l/_hsv.z))*step(-_hsv.z,-0.000001);
        return vec4(_hsvToRgb(_hsv), 1);`,
    });
};

/** Print the generated GLSL fragment shader's code to console */
const addDebug = (hr: HydraRenderer) => {
    // The names etc taken from (though that does much more, we just log it):
    // https://github.com/ritchse/hydra-extensions/blob/main/hydra-debug.js
    _proto(hr).debug = function () {
        const passes = this.glsl();
        const code = passes[0].frag;
        console.info(code);
        return this;
    };
};
