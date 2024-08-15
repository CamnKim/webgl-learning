const createProgram = (
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
) => {
  const program = gl.createProgram();

  if (!program) {
    throw new Error('failed to create GLSL program');
  }

  // Attach shaders
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    throw new Error(`program failed to link: ${gl.getProgramInfoLog(program)}`);
  }

  return program;
};

export default createProgram;
