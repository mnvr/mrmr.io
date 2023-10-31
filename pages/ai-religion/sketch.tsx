import type { Sketch } from "@p5-wrapper/react";

const vertexShader = `
attribute vec3 aPosition;

void main() {
    gl_Position = vec4(aPosition, 1.0);
}`;

const fragmentShader = `
precision mediump float;

uniform vec2 u_resolution;

void main() {
    vec2 uv = (2. * gl_FragCoord.xy - u_resolution) / min(u_resolution.x, u_resolution.y);
    // A circle of radius 0.8
    float sdf = length(uv) - 0.8;
    float d = abs(sdf);
    // Use the reciprocal to give a neon vibe.
    float c = 0.01 / (d + 0.01);

    gl_FragColor = vec4(c, c, c, 1.0);
}`;

export const sketch: Sketch = (p5) => {
    p5.setup = () => {
        p5.createCanvas(300, 300, p5.WEBGL);

        const shader = p5.createShader(vertexShader, fragmentShader);
        p5.shader(shader);
        // Since the sketch dimensions don't change, we can set it once and for
        // all here in setup instead of updating it in draw.
        const pd = p5.pixelDensity();
        shader.setUniform("u_resolution", [p5.width * pd, p5.height * pd]);
    };

    p5.draw = () => {
        p5.quad(-1, -1, 1, -1, 1, 1, -1, 1);
    };
};
