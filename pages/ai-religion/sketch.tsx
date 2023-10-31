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
    // A circle of some radius
    float sdf = length(uv) - 0.8;
    float d = abs(sdf);
    // Use the reciprocal to give a neon vibe.
    float r = 0.02 + sin(u_time / 2.5) * 0.007;
    float c = r / (d + 0.001);

    c = smoothstep(0.01, 0.1 - sin(u_time / 2.7) * 0.01, c);

    gl_FragColor = vec4(c, c, c, 1.0);
}`;

export const sketch: Sketch = (p5) => {
    let shader: p5.Shader;

    p5.setup = () => {
        p5.createCanvas(...sketchSize(), p5.WEBGL);

        shader = p5.createShader(vertexShader, fragmentShader);
        p5.shader(shader);
    };

    const sketchSize = (): [number, number] => [
        p5.min(p5.windowWidth, 600),
        300,
    ];

    p5.windowResized = () => p5.resizeCanvas(...sketchSize());

    p5.draw = () => {
        const pd = p5.pixelDensity();
        shader.setUniform("u_resolution", [p5.width * pd, p5.height * pd]);
        shader.setUniform("u_time", p5.millis() / 1000);

        p5.quad(-1, -1, 1, -1, 1, 1, -1, 1);
    };
};
