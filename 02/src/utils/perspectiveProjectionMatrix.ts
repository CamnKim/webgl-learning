import { Matrix4 } from 'threejs-math';
/* eslint-disable @typescript-eslint/naming-convention */
/**
 *
 * @param fov number: fov in radians
 * @param ratio number: aspect ratio (width/height)
 * @param near number: near clipping plane
 * @param far number: far clipping plane
 */
export const perspectiveProjection = (fov: number, ratio: number, near: number, far: number) => {
  const top = Math.tan(fov / 2) * near;
  const bottom = -top;
  const right = top * ratio;
  const left = bottom * ratio;

  const two_n_rl = (2 * near) / (right - left);
  const rl_rl = (right + left) / (right - left);

  const two_n_tb = (2 * near) / (top - bottom);
  const tb_tb = (top + bottom) / (top - bottom);

  const fn_fn = (far + near) / (far - near);
  const two_fn_fn = (2 * far * near) / (far - near);

  const projectionMatrix = [
    two_n_rl, 0, rl_rl, 0,
    0, two_n_tb, tb_tb, 0,
    0, 0, -fn_fn, -two_fn_fn,
    0, 0, -1, 0,
  ];

  return projectionMatrix;
};

export const t = (fov: number, ratio: number, near: number, far: number): Matrix4 => {
  const top = Math.tan(fov / 2) * near;
  const bottom = -top;
  const right = top * ratio;
  const left = bottom * ratio;

  const result = new Matrix4().makePerspective(left, right, top, bottom, near, far);
  return result;
};
