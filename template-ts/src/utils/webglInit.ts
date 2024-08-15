export const init = (): WebGL2RenderingContext => {
  const canvas = document.querySelector<HTMLCanvasElement>('#c');
  if (!canvas) {
    throw new Error('Could not find canvas');
  }

  const gl = canvas.getContext('webgl2');
  if (!gl) {
    throw new Error('Could not get webgl2 context');
  }

  return gl;
};
