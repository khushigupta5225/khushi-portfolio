import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * ScrollProgress: Subtle top progress indicator with glowing gradient
 * and miniature paw progress marker.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none">
      <motion.div
        style={{ scaleX, transformOrigin: 'left' }}
        className="h-full w-full bg-gradient-to-r from-violet-500 via-cyan-400 to-pink-500 shadow-[0_0_8px_rgba(124,92,255,0.6)]"
      />
    </div>
  )
}
