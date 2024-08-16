/* eslint-disable no-plusplus */
import './style.css';
import { init } from './utils/webglInit';
import vertexShaderSource from './shaders/shader.vert?raw';
import fragShaderSource from './shaders/shader.frag?raw';
import { compileShader } from './utils/shaderUtils';
import { createProgram } from './utils/createProgram';
import { randomInt, resizeCanvasToDisplaySize } from './utils/utils';
import { setRectangle } from './utils/draw_random_rectangles';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="c"></canvas>
`;

const gl = init();
const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);

const program = createProgram(gl, vertexShader, fragmentShader);

const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');

const colorLocation = gl.getUniformLocation(program, 'u_color');

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);
gl.enableVertexAttribArray(positionAttributeLocation);

const size = 2; // 2 components per iteration
const type = gl.FLOAT; // the data is 32bit floats
const normalize = false; // don't normalize the data
const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
const offset = 0; // start at the beginning of the buffer
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear the canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Tell it to use our program (pair of shaders)
gl.useProgram(program);

// Pass in the canvas resolution so we can convert from pixels to clip space in the shader
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

// Bind the attribute/buffer set we want.
gl.bindVertexArray(vao);

for (let i = 0; i < 50; ++i) {
  // Setup Rect
  setRectangle(
    gl,
    randomInt(gl.canvas.width),
    randomInt(gl.canvas.height),
    randomInt(600),
    randomInt(600),
  );

  // Set random color
  gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);

  // Draw rect
  const primitaveType = gl.TRIANGLES;
  const count = 6;
  gl.drawArrays(primitaveType, offset, count);
}
