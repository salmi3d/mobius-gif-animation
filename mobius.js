global.THREE = require('three')
require('three/examples/js/controls/OrbitControls')
const canvasSketch = require('canvas-sketch')

import { getBrick } from './getBrick'

const settings = {
  animate: true,
  context: 'webgl',
  attributes: { antialias: true },
  duration: 10,
  dimensions: [512, 512]
}

const sketch = ({ context, width, height }) => {
  const renderer = new THREE.WebGLRenderer({ context })

  renderer.setClearColor("#000", 1)
  renderer.setScissorTest(true)

  const frustumSize = 3
  const aspect = 0.5 * width / height
  const camera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    frustumSize / -2,
    -1000,
    1000
  )
  camera.position.set(0, 2, 2)
  camera.lookAt(new THREE.Vector3())

  const controls = new THREE.OrbitControls(camera, context.canvas)

  const scene1 = new THREE.Scene()
  const scene2 = new THREE.Scene()

  scene1.position.y = scene2.position.y = 0.2

  const group1 = new THREE.Group()
  const group2 = new THREE.Group()

  const sCount = 1
  const num = 100
  const depth = 0.25
  const space = 0.05
  const margin = 0.3

  scene1.add(group1)
  scene2.add(group2)

  group2.rotation.x = Math.PI / 2
  group2.position.y = -depth + margin * (sCount - 1)

  group1.position.x = aspect * frustumSize / 2
  group2.position.x = -aspect * frustumSize / 2

  const anim1 = [], anim2 = []

  for (let k = 0; k < sCount; k++) {
    for (let i = 0; i < num; i++) {
      const mesh = getBrick(i, num, space, depth)
      mesh.position.setY(margin * k)
      group1.add(mesh)
      anim1.push({
        mesh,
        y: margin * k
      })
    }

    for (let i = 0; i < num; i++) {
      const mesh = getBrick(i, num, space, depth)
      mesh.position.setY(margin * k)
      group2.add(mesh)
      anim2.push({
        mesh,
        y: margin * k
      })
    }
  }

  scene1.add(new THREE.AmbientLight('#59314f'))
  scene2.add(new THREE.AmbientLight('#59314f'))

  const light1 = new THREE.DirectionalLight('#45caf7', 1)
  const light2 = new THREE.DirectionalLight('#45caf7', 1)

  light1.position.set(0, 1, 0)
  light2.position.set(0, 1, 0)

  scene1.add(light1)
  scene2.add(light2)

  // draw each frame
  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio)
      renderer.setSize(viewportWidth, viewportHeight)
      camera.aspect = viewportWidth / viewportHeight
      camera.updateProjectionMatrix()
    },
    render({ time, width, height, playhead }) {
      anim1.forEach((m, idx) => {
        m.mesh.position.y = m.y + 0.9 * Math.sin(playhead * 2 * Math.PI + 2 * Math.PI * idx / num)
      })
      anim2.forEach((m, idx) => {
        m.mesh.position.y = m.y - 0.9 * Math.sin(playhead * 2 * Math.PI + 2 * Math.PI * idx / num)
      })

      group1.rotation.y = Math.PI * 2 * playhead
      group2.rotation.y = Math.PI * 2 * playhead

      renderer.setViewport(0, 0, width / 2, height)
      renderer.setScissor(0, 0, width / 2, height)
      renderer.render(scene1, camera)

      renderer.setViewport(width / 2, 0, width / 2, height)
      renderer.setScissor(width / 2, 0, width / 2, height)
      renderer.render(scene2, camera)

      controls.update()
    },
    unload() {
      controls.dispose()
      renderer.dispose()
    }
  }
}

canvasSketch(sketch, settings)
