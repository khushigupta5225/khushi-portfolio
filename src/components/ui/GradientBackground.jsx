import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import ThreeCanvas from '@/components/ui/ThreeCanvas'

/**
 * Subtle animated background used behind the Hero and Contact sections.
 * - A few slow-moving blurred gradient blobs (transform-only, GPU friendly).
 * - A faint fixed grid for depth.
 * - A very light grain overlay for a premium, non-flat feel.
 * - On pointer-capable devices, blobs drift slightly toward the cursor (parallax).
 * Respects prefers-reduced-motion by freezing all motion.
 */
export default function GradientBackground({ className = '' }) {
  const containerRef = useRef(null)
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  )

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20, mass: 0.6 })
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20, mass: 0.6 })

  const blobOneX = useTransform(springX, [-1, 1], [-24, 24])
  const blobOneY = useTransform(springY, [-1, 1], [-16, 16])
  const blobTwoX = useTransform(springX, [-1, 1], [18, -18])
  const blobTwoY = useTransform(springY, [-1, 1], [14, -14])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMediaChange = (e) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleMediaChange)

    const el = containerRef.current
    if (!el || mediaQuery.matches) return

    function handlePointerMove(e) {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange)
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [mouseX, mouseY])

  const loopTransition = (duration, delay = 0) =>
    reducedMotion
      ? { duration: 0 }
      : { duration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Blob 1 */}
      <motion.div
        animate={
          reducedMotion
            ? {}
            : { scale: [1, 1.08, 1], opacity: [0.55, 0.7, 0.55] }
        }
        transition={loopTransition(10)}
        className="absolute -top-40 left-[8%] h-[420px] w-[420px] rounded-full blur-[110px]"
        style={{
          background:
            'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
          x: blobOneX,
          y: blobOneY,
        }}
      />

      {/* Blob 2 */}
      <motion.div
        animate={
          reducedMotion
            ? {}
            : { scale: [1, 1.12, 1], opacity: [0.4, 0.55, 0.4] }
        }
        transition={loopTransition(13, 1)}
        className="absolute top-1/3 right-[6%] h-[380px] w-[380px] rounded-full blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, var(--color-accent-2) 0%, transparent 70%)',
          x: blobTwoX,
          y: blobTwoY,
        }}
      />

      {/* Blob 3 */}
      <motion.div
        animate={
          reducedMotion
            ? {}
            : { scale: [1, 1.06, 1], opacity: [0.3, 0.42, 0.3] }
        }
        transition={loopTransition(16, 2)}
        className="absolute bottom-[-10%] left-1/3 h-[460px] w-[460px] rounded-full blur-[130px]"
        style={{
          background:
            'radial-gradient(circle, var(--color-accent-3) 0%, transparent 70%)',
        }}
      />

      {/* Faint depth grid */}
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse 60% 50% at 50% 40%, black 40%, transparent 90%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 50% at 50% 40%, black 40%, transparent 90%)',
        }}
      />

      {/* Three.js 3D Ambient Particle Constellation */}
      <ThreeCanvas />

      {/* Grain */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-overlay">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  )
}
