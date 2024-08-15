import './style.css'
import initWebGL from './utils/initWebGL'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="c"></canvas>
`

const gl = initWebGL();
