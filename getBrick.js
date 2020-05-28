global.THREE = require('three')

const lerp = (a, b, t) => a * (1 - t) + b * t

export const getBrick = (index, number, space, depth) => {
  const detail = 100
  const angle1 = index * 2 * Math.PI / number + space
  const angle2 = (index + 1) * 2 * Math.PI / number - space
  const r1 = 1, r2 = 1 - depth
  const dots = []

  for (let i = 0; i < detail; i++) {
    dots.push([
      r2 * Math.sin(lerp(angle1, angle2, i / detail)),
      r2 * Math.cos(lerp(angle1, angle2, i / detail))
    ])
  }
  for (let i = 0; i < detail; i++) {
    dots.push([
      r1 * Math.sin(lerp(angle2, angle1, i / detail)),
      r1 * Math.cos(lerp(angle2, angle1, i / detail))
    ])
  }

  const shape = new THREE.Shape()
  shape.moveTo(dots[0][0], dots[0][1])
  dots.forEach(dot => shape.lineTo(dot[0], dot[1]))
  const geometry = new THREE.ExtrudeGeometry(shape, {
    steps: 2,
    depth,
    bevelEnabled: false
  })
  geometry.rotateX(Math.PI / 2)
  const material = new THREE.MeshLambertMaterial()
  const mesh = new THREE.Mesh(geometry, material)

  return mesh
}
