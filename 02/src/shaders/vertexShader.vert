precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertColor;

varying vec3 fragColor;

uniform mat4 mWorld; // world matrix
uniform mat4 mView; // camera matrix
uniform mat4 mProjection; // projection matrix

void main() {
  fragColor = vertColor;
  gl_Position = mProjection * mView * mWorld * vec4(vertPosition, 1.0); // mult position by world to rotate in world space,
                                                                               // then mult world matrix by view to get view from camera
                                                                               // then mult view by projection to project view into 2d screen space
}