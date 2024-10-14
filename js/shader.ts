const dpr = () => Math.floor(Math.max(devicePixelRatio, 2));

const makeShader = (
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) => {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};

const makeProgram = (
  gl: WebGLRenderingContext,
  fs: WebGLShader,
  vs: WebGLShader,
) => {
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  gl.detachShader(p, vs);
  gl.detachShader(p, fs);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(p, gl.LINK_STATUS))
    console.error(gl.getProgramInfoLog(p));

  return p;
};

export const renderFragment = (canvas: HTMLCanvasElement, fragment: string) => {
  canvas.width = canvas.clientWidth * dpr();
  canvas.height = canvas.clientHeight * dpr();

  const gl = canvas.getContext("webgl")!;
  gl.clearColor(0, 0.5, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const vs = makeShader(
    gl,
    gl.VERTEX_SHADER,
    `
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0., 1.);
    }`,
  );

  const fs = makeShader(
    gl,
    gl.FRAGMENT_SHADER,
    `
    precision highp float;
    uniform vec2 size;
    uniform float t;
    void main() {
        ${fragment}
    }`,
  );

  const p = makeProgram(gl, vs, fs);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  gl.useProgram(p);

  // These are clip space coordinates. (-1, -1) is bottom left, (1, 1) is the
  // top right. We draw 2 triangles (top left half, then bottom right half) to
  // cover the entire square.
  const verts = [-1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, -1];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

  const isz = gl.getUniformLocation(p, "size");
  const it = gl.getUniformLocation(p, "t");

  gl.uniform2f(isz, canvas.width, canvas.height);

  const draw = (now: number) => {
    gl.uniform1f(it, now / 1e3);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
};
