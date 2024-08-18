/* eslint-disable no-bitwise */
import './style.css';
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
  const triangleVerts = new Float32Array([
    // X, y, r, g, b
    0.0, 0.5, 1.0, 0.0, 0.0,
    -0.5, -0.5, 0.0, 1.0, 0.0,
    0.5, -0.5, 0.0, 0.0, 1.0,
  ]);

  const triangleVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, triangleVerts, gl.STATIC_DRAW);

  const positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition');
  const colorAttributeLocation = gl.getAttribLocation(program, 'vertColor');

  gl.vertexAttribPointer(
    positionAttributeLocation, // location
    2, // Size: number of elements per attribute (2: x, y)
    gl.FLOAT, // type
    false, // normalized?
    5 * Float32Array.BYTES_PER_ELEMENT, // Stride: size of individual vertex (size * sizeof(type))
    0, // Offset: offset from beginning of single vertex
  );
  gl.vertexAttribPointer(
    colorAttributeLocation, // location
    3, // Size: number of elements per attribute (2: x, y)
    gl.FLOAT, // type
    false, // normalized?
    5 * Float32Array.BYTES_PER_ELEMENT, // Stride: size of individual vertex (size * sizeof(type))
    2 * Float32Array.BYTES_PER_ELEMENT, // Offset: offset from beginning of single vertex
  );

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.enableVertexAttribArray(colorAttributeLocation);

  // Main render loop
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

initWebGL();
