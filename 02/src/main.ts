/* eslint-disable no-multi-spaces */
/* eslint-disable no-bitwise */
import './style.css';
import { glMatrix, mat4 } from 'gl-matrix';
import vertexShaderFile from './shaders/vertexShader.vert?raw';
import fragShaderFile from './shaders/fragShader.frag?raw';

const initWebGL = () => {
  // INIT
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas');
  if (!canvas) {
    throw new Error('could not find canvas element');
  }

  const gl = canvas.getContext('webgl');
  if (!gl) {
    throw new Error('could not get webgl context');
  }

  const dispWidth = canvas.clientWidth;
  const dispHeight = canvas.clientHeight;
  if (dispWidth !== canvas.width || dispHeight !== canvas.height) {
    canvas.width = dispWidth;
    canvas.height = dispHeight;
  }
  gl.viewport(0, 0, canvas.width, canvas.height);

  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);

  // SHADERS
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragShader = gl.createShader(gl.FRAGMENT_SHADER);

  if (!vertexShader || !fragShader) {
    throw new Error('could not create shaders');
  }

  gl.shaderSource(vertexShader, vertexShaderFile);
  gl.shaderSource(fragShader, fragShaderFile);

  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    throw new Error(`error compiling vertex shader: ${gl.getShaderInfoLog(vertexShader)}`);
  }

  gl.compileShader(fragShader);
  if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
    throw new Error(`error compiling fragment shader: ${gl.getShaderInfoLog(fragShader)}`);
  }

  const program = gl.createProgram();
  if (!program) {
    throw new Error('error creating webgl program');
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragShader);

  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`error linking program: ${gl.getProgramInfoLog(program)}`);
  }

  // position buffers
  const boxVerts = new Float32Array([
    // x, y, z,       r, g, b
    // Top
    -1.0, 1.0, -1.0,        0.5, 0.5, 0.5,
    -1.0, 1.0, 1.0,         0.5, 0.5, 0.5,
    1.0, 1.0, 1.0,          0.5, 0.5, 0.5,
    1.0, 1.0, -1.0,         0.5, 0.5, 0.5,

    // Left
    -1.0, 1.0, 1.0,        0.75, 0.25, 0.5,
    -1.0, -1.0, 1.0,       0.75, 0.25, 0.5,
    -1.0, -1.0, -1.0,      0.75, 0.25, 0.5,
    -1.0, 1.0, -1.0,       0.75, 0.25, 0.5,

    // Right
    1.0, 1.0, 1.0,         0.25, 0.25, 0.75,
    1.0, -1.0, 1.0,        0.25, 0.25, 0.75,
    1.0, -1.0, -1.0,       0.25, 0.25, 0.75,
    1.0, 1.0, -1.0,        0.25, 0.25, 0.75,

    // Front
    1.0, 1.0, 1.0,         1.0, 0.0, 0.15,
    1.0, -1.0, 1.0,        1.0, 0.0, 0.15,
    -1.0, -1.0, 1.0,       1.0, 0.0, 0.15,
    -1.0, 1.0, 1.0,        1.0, 0.0, 0.15,

    // Back
    1.0, 1.0, -1.0,        0.0, 1.0, 0.15,
    1.0, -1.0, -1.0,       0.0, 1.0, 0.15,
    -1.0, -1.0, -1.0,      0.0, 1.0, 0.15,
    -1.0, 1.0, -1.0,       0.0, 1.0, 0.15,

    // Bottom
    -1.0, -1.0, -1.0,      0.5, 0.5, 1.0,
    -1.0, -1.0, 1.0,       0.5, 0.5, 1.0,
    1.0, -1.0, 1.0,        0.5, 0.5, 1.0,
    1.0, -1.0, -1.0,       0.5, 0.5, 1.0,
  ]);

  const boxIndices = [
    // Top
    0, 1, 2,
    0, 2, 3,

    // Left
    5, 4, 6,
    6, 4, 7,

    // Right
    8, 9, 10,
    8, 10, 11,

    // Front
    13, 12, 14,
    15, 14, 12,

    // Back
    16, 17, 18,
    16, 18, 19,

    // Bottom
    21, 20, 22,
    22, 20, 23,
  ];

  const boxVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, boxVerts, gl.STATIC_DRAW);

  const boxIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

  const positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition');
  const colorAttributeLocation = gl.getAttribLocation(program, 'vertColor');

  gl.useProgram(program);

  gl.vertexAttribPointer(
    positionAttributeLocation, // location
    3, // Size: number of elements per attribute (3: x, y, z)
    gl.FLOAT, // type
    false, // normalized?
    6 * Float32Array.BYTES_PER_ELEMENT, // Stride: size of individual vertex (size * sizeof(type))
    0, // Offset: offset from beginning of single vertex
  );

  gl.vertexAttribPointer(
    colorAttributeLocation, // location
    3, // Size: number of elements per attribute (3: r, g, b)
    gl.FLOAT, // type
    false, // normalized?
    6 * Float32Array.BYTES_PER_ELEMENT, // Stride: size of individual vertex (size * sizeof(type))
    3 * Float32Array.BYTES_PER_ELEMENT, // Offset: offset from beginning of single vertex
  );

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.enableVertexAttribArray(colorAttributeLocation);

  const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
  const matViewUniformLocation = gl.getUniformLocation(program, 'mView');
  const matProjectionUniformLocation = gl.getUniformLocation(program, 'mProjection');

  const worldMatrix = new Float32Array(16);
  const viewMatrix = new Float32Array(16);
  const projMatrix = new Float32Array(16);
  mat4.identity(worldMatrix);
  mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
  mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000);

  gl.uniformMatrix4fv(matWorldUniformLocation, false, new Float32Array(worldMatrix));
  gl.uniformMatrix4fv(matViewUniformLocation, false, new Float32Array(viewMatrix));
  gl.uniformMatrix4fv(matProjectionUniformLocation, false, new Float32Array(projMatrix));

  const xRotationMatrix = new Float32Array(16);
  const yRotationMatrix = new Float32Array(16);

  const identityMatrix = new Float32Array(16);
  mat4.identity(identityMatrix);
  // Main render loop
  let angle = 0;
  const loop = () => {
    angle = (performance.now() / 1000 / 6) * 2 * Math.PI;

    mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
    mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
    mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);

    gl.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
};

initWebGL();
