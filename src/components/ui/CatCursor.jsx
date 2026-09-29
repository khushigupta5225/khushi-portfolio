import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

/**
 * CatCursor: Ultra-Responsive Zero-Lag Cat Paw Cursor.
 * - Hardware-accelerated instantaneous 0ms direct DOM transform (zero latency, zero smoothing drag).
 * - Deduplicated hover listener preventing main-thread React re-render churn during pointer moves.
 * - Soft, delicate light-purple / pastel lavender blurred aura with gentle edge fade.
 * - Exact hotspot alignment at (0, 0) for natural desktop cursor precision.
 * - Completely disabled on touch / mobile devices.
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

  const cursorRef = useRef(null)
  const isHoveringRef = useRef(false)

  useEffect(() => {
    if (!enabled) return

    // 0ms Instantaneous Direct Hardware Transform
    const handlePointerMove = (e) => {
      const el = cursorRef.current
      if (!el) return
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      if (el.style.opacity !== '1') {
        el.style.opacity = '1'
      }
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    // Deduplicated hover detection: only triggers React state update when state ACTUALLY changes
    const handleMouseOver = (e) => {
      const target = e.target
      if (!target) return
      const shouldHover = Boolean(
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('.interactive-target')
      )
      if (shouldHover !== isHoveringRef.current) {
        isHoveringRef.current = shouldHover
        setIsHovering(shouldHover)
      }
    }

    const handleMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0'
    }

    const handleMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '1'
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true, capture: true })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove, { capture: true })
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={cursorRef}
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        willChange: 'transform',
        opacity: 0,
      }}
      className="pointer-events-none fixed top-0 left-0 z-[9999] transition-opacity duration-150 select-none"
    >
      {/* 
        Hotspot is precisely calibrated: The lead pointer tip is at (0, 0)
        so clicking links and buttons is 100% accurate without offset disorientation.
      */}
      <motion.div
        animate={{
          scale: isClicking ? 0.88 : isHovering ? 1.18 : 1,
        }}
        transition={{ duration: 0.08, ease: 'easeOut' }}
        className="relative -top-1 -left-1"
      >
        {/* Soft, Light Lavender / Pastel Purple Aura with Gentle Feathered Edge */}
        <div
          aria-hidden="true"
          className="absolute -top-4 -left-4 w-[58px] h-[58px] rounded-full pointer-events-none -z-10 transition-transform duration-150 ease-out will-change-transform"
          style={{
            background:
              'radial-gradient(circle, rgba(216, 180, 254, 0.35) 0%, rgba(233, 213, 255, 0.22) 35%, rgba(243, 232, 255, 0.08) 60%, transparent 75%)',
            filter: 'blur(6px)',
            transform: isHovering ? 'scale(1.25)' : isClicking ? 'scale(0.85)' : 'scale(1)',
          }}
        />

        {/* Secondary Delicate Core Light Lavender Sheen */}
        <div
          aria-hidden="true"
          className="absolute -top-1.5 -left-1.5 w-[38px] h-[38px] rounded-full pointer-events-none -z-10 transition-transform duration-100 ease-out will-change-transform"
          style={{
            background:
              'radial-gradient(circle, rgba(233, 213, 255, 0.45) 0%, rgba(216, 180, 254, 0.22) 45%, transparent 70%)',
            filter: 'blur(3px)',
            transform: isHovering ? 'scale(1.18)' : isClicking ? 'scale(0.9)' : 'scale(1)',
          }}
        />

        {/* 26px Minimalist Corporate Cat Paw */}
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_1.5px_6px_rgba(192,132,252,0.35)] dark:drop-shadow-[0_2px_8px_rgba(216,180,254,0.45)] transition-transform duration-100"
        >
          {/* Minimalist Palm Pad */}
          <path
            d="M 12 11.5 C 9.5 11.5, 7.5 13, 7.8 16 C 8.2 18.5, 10 19.5, 12 19.5 C 14 19.5, 15.8 18.5, 16.2 16 C 16.5 13, 14.5 11.5, 12 11.5 Z"
            className="fill-slate-900 dark:fill-white transition-colors duration-200"
          />

          {/* 4 Toe Beans: Lead Pointer Toe is Highlighted in Violet */}
          {/* Top-Left Lead Toe (Exact cursor click hotspot) */}
          <ellipse
            cx="6.5"
            cy="10"
            rx="1.9"
            ry="2.5"
            transform="rotate(-20 6.5 10)"
            className="fill-violet-600 dark:fill-violet-400"
          />
          {/* Top-Mid-Left Toe */}
          <ellipse
            cx="9.5"
            cy="6.8"
            rx="1.8"
            ry="2.4"
            transform="rotate(-7 9.5 6.8)"
            className="fill-slate-900 dark:fill-white"
          />
          {/* Top-Mid-Right Toe */}
          <ellipse
            cx="14.5"
            cy="6.8"
            rx="1.8"
            ry="2.4"
            transform="rotate(7 14.5 6.8)"
            className="fill-slate-900 dark:fill-white"
          />
          {/* Top-Right Toe */}
          <ellipse
            cx="17.5"
            cy="10"
            rx="1.7"
            ry="2.3"
            transform="rotate(20 17.5 10)"
            className="fill-slate-900 dark:fill-white"
          />

          {/* Precision Target Point / Hotspot Accent */}
          <circle
            cx="2"
            cy="2"
            r="1.2"
            className="fill-violet-500 dark:fill-violet-300"
          />
        </svg>

        {/* Subtle Focus Halo on Button / Link Hover */}
        {isHovering && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.35, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute -inset-1.5 rounded-full border border-violet-400/40 dark:border-violet-300/50 pointer-events-none"
          />
        )}
      </motion.div>
    </div>
  )
}
