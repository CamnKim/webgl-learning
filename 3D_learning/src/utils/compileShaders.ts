const compileShader = (gl: WebGL2RenderingContext, shaderSource: string, shaderType: GLenum) => {
  // Create shader obj
  const shader = gl.createShader(shaderType);

  if (!shader) {
    throw new Error('could not create shader');
  }

  // Set shader source code
  gl.shaderSource(shader, shaderSource);

  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    throw new Error(`could not compile shader: ${gl.getShaderInfoLog(shader)}`);
  }

  return shader;
};

export default compileShader;
