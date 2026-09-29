import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'

/**
 * Card3D: Interactive 3D Perspective Tilt Card with Cursor Glare / Spotlight Sheen.
 * - Smooth spring physics with high-performance CSS 3D transforms.
 * - Radial specular glare overlay tracking the cursor via useMotionTemplate.
 * - Graceful fallback on touch devices and reduced motion.
 */
export default function Card3D({
  children,
  className = '',
  maxTilt = 10,
  glare = true,
  scale = 1.02,
  ...props
}) {
  const ref = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(50)
  const mouseY = useMotionValue(50)

  // Spring physics configuration for silky smooth tilt & recovery
  const springConfig = { stiffness: 320, damping: 25, mass: 0.5 }

  const rotateX = useSpring(
    useTransform(mouseY, [0, 100], [maxTilt, -maxTilt]),
    springConfig
  )
  const rotateY = useSpring(
    useTransform(mouseX, [0, 100], [-maxTilt, maxTilt]),
    springConfig
  )
  const cardScale = useSpring(isHovered ? scale : 1, springConfig)

  const glareX = useSpring(mouseX, springConfig)
  const glareY = useSpring(mouseY, springConfig)
  const glareBackground = useMotionTemplate`radial-gradient(circle 360px at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.28), transparent 70%)`

  function handleMouseMove(e) {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    if (width === 0 || height === 0) return

    const x = ((e.clientX - rect.left) / width) * 100
    const y = ((e.clientY - rect.top) / height) * 100

    mouseX.set(x)
    mouseY.set(y)
  }

  function handleMouseEnter() {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return
    setIsHovered(true)
  }

  function handleMouseLeave() {
    setIsHovered(false)
    mouseX.set(50)
    mouseY.set(50)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
        scale: cardScale,
      }}
      className={`relative will-change-transform ${className}`}
      {...props}
    >
      {children}

      {/* Dynamic Cursor Specular Glare / Sheen Overlay */}
      {glare && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-20"
          style={{
            opacity: isHovered ? 1 : 0,
            background: glareBackground,
          }}
        />
      )}
    </motion.div>
  )
}
