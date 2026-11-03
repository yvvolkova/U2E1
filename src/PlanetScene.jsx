import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function PlanetScene() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    )
    camera.position.set(0, 0, 7)

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const planet = new THREE.Group()
    planet.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(1.45, 48, 48),
        new THREE.MeshStandardMaterial({
          color: '#6441e8',
          roughness: 0.7,
          metalness: 0.15,
        }),
      ),
    )

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.1, 0.06, 16, 100),
      new THREE.MeshStandardMaterial({ color: '#c084fc', metalness: 0.7, roughness: 0.3 }),
    )
    ring.rotation.x = Math.PI / 2.8
    planet.add(ring)
    scene.add(planet)

    scene.add(new THREE.AmbientLight('#ffffff', 1.2))
    const light = new THREE.DirectionalLight('#b9a3ff', 3)
    light.position.set(4, 3, 4)
    scene.add(light)

    const stars = new THREE.BufferGeometry()
    const positions = new Float32Array(450)
    for (let index = 0; index < positions.length; index += 3) {
      positions[index] = (Math.random() - 0.5) * 18
      positions[index + 1] = (Math.random() - 0.5) * 12
      positions[index + 2] = -Math.random() * 10
    }
    stars.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    scene.add(
      new THREE.Points(
        stars,
        new THREE.PointsMaterial({ color: '#c4b5fd', size: 0.035 }),
      ),
    )

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', resize)

    let frameId
    const animate = () => {
      planet.rotation.y += 0.003
      ring.rotation.z += 0.002
      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      stars.dispose()
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="planet-scene" aria-hidden="true" />
}

export default PlanetScene
