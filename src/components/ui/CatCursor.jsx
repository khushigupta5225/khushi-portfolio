import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * CatCursor: Subtle, performant desktop cursor companion.
 * - Active ONLY on pointer:fine (mouse/trackpad) desktop devices.
 * - Completely disabled on mobile/touch screens and prefers-reduced-motion.
 * - Never blocks clicks or text selection (pointer-events: none).
 * - Expands gracefully when hovering interactive elements (buttons, links, inputs).
 */
export default function CatCursor() {
  const [enabled] = useState(() => {
    if (typeof window === 'undefined') return false
    const hasMouse = window.matchMedia('(pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return hasMouse && !reducedMotion
  })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Smooth damped spring for follower ring
  const springX = useSpring(cursorX, { stiffness: 450, damping: 28, mass: 0.35 })
  const springY = useSpring(cursorY, { stiffness: 450, damping: 28, mass: 0.35 })

  useEffect(() => {
    if (!enabled) return

    const handlePointerMove = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const handleMouseOver = (e) => {
      const target = e.target
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('.interactive-target')
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseover', handleMouseOver, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [enabled, cursorX, cursorY])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Follower Outer Ring / Cat Paw Halo */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.85 : isHovering ? 1.5 : 1,
          borderColor: isHovering
            ? 'rgba(124, 92, 255, 0.7)'
            : 'rgba(124, 92, 255, 0.35)',
        }}
        transition={{ duration: 0.15 }}
        className="h-8 w-8 rounded-full border border-violet-500/40 bg-violet-500/5 backdrop-blur-[0.5px]"
      />

      {/* Center Precision Point */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 1.4 : isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.12 }}
        className="h-1.5 w-1.5 rounded-full bg-violet-400"
      />
    </div>
  )
}
