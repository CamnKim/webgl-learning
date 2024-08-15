const initWebGL = (): WebGL2RenderingContext => {
  const canvas = document.querySelector<HTMLCanvasElement>('#c');
  if (!canvas) {
    throw new Error('cannot find canvas element');
  }
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    throw new Error('cannot init webgl2');
  }
  return gl;
};

export default initWebGL;
