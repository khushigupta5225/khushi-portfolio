import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Hero3DCanvas: Floating 3D Geometric Core + Particle Nebula
 * Adds a 3D centerpiece behind the Hero mascot card:
 * - Central 3D wireframe icosahedron with glowing inner core
 * - Orbital particle satellites that react with smooth mouse inertia
 * - Fully GPU-optimized, auto-pauses off-screen
 */
export default function Hero3DCanvas() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
    camera.position.z = 95

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    renderer.setPixelRatio(dpr)
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    container.appendChild(renderer.domElement)

    // Core Wireframe 3D Icosahedron
    const geoOuter = new THREE.IcosahedronGeometry(26, 1)
    const matOuter = new THREE.MeshBasicMaterial({
      color: 0x7c5cff,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    })
    const meshOuter = new THREE.Mesh(geoOuter, matOuter)
    scene.add(meshOuter)

    // Inner Radiant Octahedron
    const geoInner = new THREE.OctahedronGeometry(15, 0)
    const matInner = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    })
    const meshInner = new THREE.Mesh(geoInner, matInner)
    scene.add(meshInner)

    // Ambient floating orbital particles
    const particleCount = 45
    const pGeo = new THREE.BufferGeometry()
    const pPos = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = 38 + Math.random() * 20
      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pPos[i * 3 + 2] = r * Math.cos(phi)
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0x7c5cff,
      size: 2.4,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    })
    const orbitalParticles = new THREE.Points(pGeo, pMat)
    scene.add(orbitalParticles)

    // Mouse Tracking with smooth inertia
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    function onPointerMove(e) {
      if (prefersReducedMotion) return
      mouseX = (e.clientX - window.innerWidth / 2) * 0.04
      mouseY = (e.clientY - window.innerHeight / 2) * 0.04
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })

    function onResize() {
      if (!container) return
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', onResize, { passive: true })

    // Animation Loop
    let animationFrameId
    let isVisible = true

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting
      },
      { threshold: 0.1 }
    )
    observer.observe(container)

    const clock = new THREE.Clock()

    function animate() {
      animationFrameId = requestAnimationFrame(animate)
      if (!isVisible) return

      const time = clock.getElapsedTime()

      if (!prefersReducedMotion) {
        targetX += (mouseX - targetX) * 0.05
        targetY += (mouseY - targetY) * 0.05

        // Central core rotation
        meshOuter.rotation.x = time * 0.3 + targetY * 0.01
        meshOuter.rotation.y = time * 0.4 + targetX * 0.01

        meshInner.rotation.x = -time * 0.5 + targetY * 0.01
        meshInner.rotation.z = time * 0.45 + targetX * 0.01

        // Orbiting particles
        orbitalParticles.rotation.y = time * 0.18 + targetX * 0.005
        orbitalParticles.rotation.z = time * 0.12
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      observer.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animationFrameId)
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
      geoOuter.dispose()
      matOuter.dispose()
      geoInner.dispose()
      matInner.dispose()
      pGeo.dispose()
      pMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 -z-0 h-full w-full overflow-hidden"
    />
  )
}
