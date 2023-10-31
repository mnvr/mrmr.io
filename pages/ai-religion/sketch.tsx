import type { Sketch } from "@p5-wrapper/react";

const vertexShader = `
attribute vec3 aPosition;

void main() {
  gl_Position = vec4(aPosition, 1.0);
}`;

const fragmentShader = `
precision mediump float;

void main() {
  vec2 uv = gl_FragCoord.xy / 600.0;

  gl_FragColor = vec4(uv.xy, 0.0, 1.0);
}`;

export const sketch: Sketch = (p5) => {
    p5.setup = () => {
        p5.createCanvas(300, 300, p5.WEBGL);
        p5.shader(p5.createShader(vertexShader, fragmentShader));
    };

    p5.draw = () => {
        p5.quad(-1, -1, 1, -1, 1, 1, -1, 1);
    };
};
