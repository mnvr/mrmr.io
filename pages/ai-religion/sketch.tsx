import type { Sketch } from "@p5-wrapper/react";
import p5 from "p5";

const vertexShader = `
attribute vec3 aPosition;

void main() {
    gl_Position = vec4(aPosition, 1.0);
}`;

const fragmentShader = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 uv = (2. * gl_FragCoord.xy - u_resolution) / min(u_resolution.x, u_resolution.y);
    // A circle of radius 0.8
    float sdf = length(uv) - 0.8;
    float d = abs(sdf);
    // Use the reciprocal to give a neon vibe.
    float r = 0.02 + sin(u_time / 2.5) * 0.007;
    float c = r / (d + 0.001);

    // c = 1.0 - c;
    c = 1.0 - smoothstep(c, 0.01, 0.02);

    gl_FragColor = vec4(c, c, c, 1.0);
}`;

export const sketch: Sketch = (p5) => {
    let shader: p5.Shader;

    p5.setup = () => {
        p5.createCanvas(300, 300, p5.WEBGL);

        shader = p5.createShader(vertexShader, fragmentShader);
        p5.shader(shader);
    };

    p5.draw = () => {
        const pd = p5.pixelDensity();
        shader.setUniform("u_resolution", [p5.width * pd, p5.height * pd]);
        shader.setUniform("u_time", p5.millis() / 1000);

        p5.quad(-1, -1, 1, -1, 1, 1, -1, 1);
    };
};
