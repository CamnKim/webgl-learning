let canvas = document.querySelector("#c")

let gl = canvas?.getContext("webgl2")
if (!gl) {
  console.log("no gl")
}

const vertexShaderSource = `#version 300 es
in vec4 a_position;

void main() {
  gl_Position = a_position;
}
`

const fragmentShaderSource = `#version 300 es

precision highp float;

out vec4 outColor;

void main() {
  outColor = vec4(1, 0, 0.5, 1);
}
`

function resizeCanvasToDisplaySize(canvas) {
  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const displayWidth  = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
 
  // Check if the canvas is not the same size.
  const needResize = canvas.width  !== displayWidth ||
                     canvas.height !== displayHeight;
 
  if (needResize) {
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
 
  return needResize;
}

// Function to create shaders
const createShader = (gl, type, source) => {
  let shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }
  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

// Create our two shaders
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

// Function to create program and attach shaders to program
const createProgram = (gl, vertexShader, fragmentShader) => {
  let program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }

  console.log(gl.getProgramInfoLog(program))
  gl.deleteShader(program)
}

let program = createProgram(gl, vertexShader, fragmentShader)

// Setup position attribute to supply data to GPU
let positionAttributeLocation = gl.getAttribLocation(program, "a_position") // a_position corosponds to a_position in the vertex shader
// Create a buffer for the position attribute
let positionBuffer = gl.createBuffer();
// Bind position buffer 
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

// Copy position data into position buffer
const positions = [
  0, 0,
  0, 0.5,
  0.7, 0,
]
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

// Create vertex array to access attribute data
const vao = gl.createVertexArray()
gl.bindVertexArray(vao)
// Tell WebGL that we want to get data out of a buffer
gl.enableVertexAttribArray(positionAttributeLocation)

// Specify how to pull out data
const size = 2          // 2 components per iteration
const type = gl.FLOAT   // data type is 32bit floats
const normalize = false // dont normalize data
const stride = 0        // move forward size * sizeOf(type) each iteration to get next position
const offset = 0        // start at the beginning of the buffer
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset) // Also binds the current array_buffer to the attribute

resizeCanvasToDisplaySize(gl.canvas)
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.clearColor(0, 0, 0, 0)
gl.clear(gl.COLOR_BUFFER_BIT)

gl.useProgram(program)
gl.bindVertexArray(vao)

const primativeType = gl.TRIANGLES
const count = 3
gl.drawArrays(primativeType, offset, count)