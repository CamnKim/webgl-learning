/* eslint-disable no-plusplus */
import './style.css';
import { init } from './utils/webglInit';
import vertexShaderSource from './shaders/shader.vert?raw';
import fragShaderSource from './shaders/shader.frag?raw';
import { compileShader } from './utils/shaderUtils';
import { createProgram } from './utils/createProgram';
import monkePath from '../public/monke.jpg';
import { setRectangle } from './utils/draw_random_rectangles';
import { resizeCanvasToDisplaySize } from './utils/utils';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="c"></canvas>
`;

const gl = init();
const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);

const program = createProgram(gl, vertexShader, fragmentShader);

const render = (image: HTMLImageElement) => {
  // Look up where vertex data attributes
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const texCoordAttribLocation = gl.getAttribLocation(program, 'a_texCoord');

  // Lookup uniforms
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  const imageLocation = gl.getUniformLocation(program, 'u_image');

  // Create vertex array object
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // Create a position buffer to put rectagle in
  const positionBuffer = gl.createBuffer();

  // Turn on attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const size = 2; // 2 components per iteration
  const type = gl.FLOAT; // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

  // Provide texture coords for rect
  const textCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,
  ]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordAttribLocation);
  gl.vertexAttribPointer(texCoordAttribLocation, size, type, normalize, stride, offset);

  const texture = gl.createTexture();

  // make unit 0 the active texture unit
  gl.activeTexture(gl.TEXTURE0 + 0);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Upload the image into the texture.
  const mipLevel = 0; // the largest mip
  const internalFormat = gl.RGBA; // format we want in the texture
  const srcFormat = gl.RGBA; // format of data we are supplying
  const srcType = gl.UNSIGNED_BYTE; // type of data we are supplying
  gl.texImage2D(
    gl.TEXTURE_2D,
    mipLevel,
    internalFormat,
    srcFormat,
    srcType,
    image,
  );

  resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  // eslint-disable-next-line no-bitwise
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Pass in the canvas resolution so we can convert from
  // pixels to clip space in the shader
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

  // Tell the shader to get the texture from texture unit 0
  gl.uniform1i(imageLocation, 0);

  // Bind the position buffer so gl.bufferData that will be called
  // in setRectangle puts data in the position buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Set a rectangle the same size as the image.
  setRectangle(gl, 0, 0, image.width, image.height);

  // Draw the rectangle.
  const primitiveType = gl.TRIANGLES;
  const count = 6;
  gl.drawArrays(primitiveType, offset, count);
};

const main = () => {
  const image = new Image();
  image.src = monkePath;
  image.onload = () => { render(image); };
};

main();
