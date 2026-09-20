import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * ThreeCanvas: High-performance 3D ambient particle background canvas.
 * - Starry particle constellation with depth drift and subtle mouse parallax.
 * - DPR capped to 1.5, auto-paused when off-screen.
 * - Complete WebGL memory disposal on unmount.
 */
export default function ThreeCanvas() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 140

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

    // Particle constellation data
    const isMobile = window.innerWidth < 768
    const particleCount = isMobile ? 45 : 85
    const pGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 240
      positions[i * 3 + 1] = (Math.random() - 0.5) * 240
      positions[i * 3 + 2] = (Math.random() - 0.5) * 140
    }

    pGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // Soft radial particle texture
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
    grad.addColorStop(0.4, 'rgba(124, 92, 255, 0.65)')
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(16, 16, 16, 0, Math.PI * 2)
    ctx.fill()

    const particleTexture = new THREE.CanvasTexture(canvas)

    const particleMaterial = new THREE.PointsMaterial({
      size: 3.5,
      map: particleTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particles = new THREE.Points(pGeometry, particleMaterial)
    scene.add(particles)

    // Mouse Tracking
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

    // Animation loop
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

      const elapsedTime = clock.getElapsedTime()

      if (!prefersReducedMotion) {
        targetX += (mouseX - targetX) * 0.04
        targetY += (mouseY - targetY) * 0.04

        particles.rotation.y = elapsedTime * 0.03 + targetX * 0.005
        particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05 + targetY * 0.005
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
      pGeometry.dispose()
      particleMaterial.dispose()
      particleTexture.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-hidden"
    />
  )
}
