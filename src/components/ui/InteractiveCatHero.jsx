import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion, useMotionValue, animate } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

/**
 * InteractiveCatHero: Modern vector companion cat for the Hero section.
 * - Draggable anywhere across the screen with smooth physics and zero clipping.
 * - Smooth cursor eye & head orientation tracking (clamped & damped).
 * - Cute flight expression with sparkly dilated eyes and open mouth during dragging.
 * - Periodic natural blinking and subtle ear twitch idle animation.
 * - Reactive speech bubble triggered by hover over CTAs or during drag.
 * - Interactive click/tap feedback (purr / happy squint).
 * - Easy reset to original perch via double-click or subtle reset button.
 * - Fully accessible and responsive with graceful static fallback for reduced motion.
 */
export default function InteractiveCatHero({ reactionTarget = null }) {
  const shouldReduceMotion = useReducedMotion()
  const catRef = useRef(null)

  // Motion values for free drag & spring reset
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Cursor tracking coordinates (-1 to 1 normalized)
  const [lookPos, setLookPos] = useState({ x: 0, y: 0 })
  const [isBlinking, setIsBlinking] = useState(false)
  const [isHappy, setIsHappy] = useState(false)
  const [earTwitch, setEarTwitch] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [hasMoved, setHasMoved] = useState(false)

  // Mouse move tracking relative to cat center
  useEffect(() => {
    if (shouldReduceMotion) return

    function handlePointerMove(e) {
      if (!catRef.current) return
      if (isDragging) return // Eyes stay focused during drag flight

      const rect = catRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Calculate vector from cat to cursor
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY

      // Distance limit & normalization
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDist = 600

      const factor = Math.min(distance, maxDist) / maxDist
      const angle = Math.atan2(dy, dx)

      setLookPos({
        x: Math.cos(angle) * factor,
        y: Math.sin(angle) * factor,
      })
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [shouldReduceMotion, isDragging])

  // Periodic natural blinking
  useEffect(() => {
    if (shouldReduceMotion) return

    let timeoutId
    function scheduleBlink() {
      const delay = 3000 + Math.random() * 4000 // 3-7 seconds
      timeoutId = setTimeout(() => {
        setIsBlinking(true)
        setTimeout(() => {
          setIsBlinking(false)
          scheduleBlink()
        }, 180)
      }, delay)
    }

    scheduleBlink()
    return () => clearTimeout(timeoutId)
  }, [shouldReduceMotion])

  // Periodic subtle ear twitch
  useEffect(() => {
    if (shouldReduceMotion) return

    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        setEarTwitch(true)
        setTimeout(() => setEarTwitch(false), 300)
      }
    }, 6000)

    return () => clearInterval(interval)
  }, [shouldReduceMotion])

  // Click / Tap interaction (Happy Purr)
  const handleCatClick = () => {
    setIsHappy(true)
    setTimeout(() => setIsHappy(false), 2400)
  }

  // Reset cat back to original corner perch
  const handleResetPosition = (e) => {
    if (e) {
      e.stopPropagation()
      if (typeof e.preventDefault === 'function') e.preventDefault()
    }
    animate(x, 0, { type: 'spring', stiffness: 350, damping: 26 })
    animate(y, 0, { type: 'spring', stiffness: 350, damping: 26 })
    setHasMoved(false)
    setIsHappy(true)
    setTimeout(() => setIsHappy(false), 2000)
  }

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    if (Math.hypot(x.get(), y.get()) > 15) {
      setHasMoved(true)
    }
  }

  // Eye pupil offset based on lookPos (max 4.5px)
  const pupilX = isDragging ? 0 : lookPos.x * 4.5
  const pupilY = isDragging ? -1 : lookPos.y * 3.5

  // Head tilt angle based on lookPos.x (max 6.5deg)
  const headTilt = isDragging ? 2 : lookPos.x * 6.5

  // Speech bubble text based on state
  let speechBubble = null
  if (isDragging) {
    speechBubble = 'Wheeee! 🐾'
  } else if (isHappy) {
    speechBubble = hasMoved ? 'Purrr! 🐱' : 'purrr... 🐾'
  } else if (reactionTarget === 'resume') {
    speechBubble = 'Looking for credentials? 📄'
  } else if (reactionTarget === 'projects') {
    speechBubble = 'Check out what we built! 🚀'
  } else if (reactionTarget === 'contact') {
    speechBubble = "Let's build together! ✉️"
  }

  return (
    <motion.div
      ref={catRef}
      drag
      dragMomentum={false}
      dragElastic={0.08}
      style={{ x, y }}
      whileHover={{ scale: isDragging ? 1.12 : 1.05 }}
      whileDrag={{ scale: 1.12, cursor: 'grabbing', zIndex: 100 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTap={handleCatClick}
      onDoubleClick={handleResetPosition}
      className="relative flex flex-col items-center justify-center cursor-grab select-none group touch-none z-30"
      title={hasMoved ? 'Drag anywhere! Double-click to return to perch' : 'Drag me anywhere! (or click to pet)'}
    >
      {/* Speech / Reaction Bubble */}
      {speechBubble && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.2 }}
          className="absolute -top-12 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-900 text-xs font-medium shadow-xl border border-white/10 dark:border-slate-200 pointer-events-none whitespace-nowrap"
        >
          <span>{speechBubble}</span>
        </motion.div>
      )}

      {/* SVG Vector Interactive Cat Character */}
      <motion.svg
        width="110"
        height="110"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={
          isDragging
            ? { y: 0, rotate: [-2, 2, -2] }
            : { y: [0, -3, 0] }
        }
        transition={
          isDragging
            ? { duration: 0.4, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
        }
        className={`transition-shadow duration-300 ${
          isDragging
            ? 'drop-shadow-[0_16px_32px_rgba(124,92,255,0.45)]'
            : 'drop-shadow-[0_8px_20px_rgba(124,92,255,0.2)]'
        }`}
      >
        {/* Soft Ambient Shadow */}
        <ellipse
          cx="60"
          cy="112"
          rx={isDragging ? 32 : 42}
          ry={isDragging ? 4 : 6}
          className="fill-black/20 dark:fill-white/10 transition-all duration-300"
        />

        {/* Head & Body Container with subtle cursor tilt */}
        <g
          style={{
            transformOrigin: '60px 75px',
            transform: `rotate(${headTilt}deg)`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          {/* Left Ear */}
          <motion.path
            d="M 32 48 L 22 18 L 48 32 Z"
            className="fill-slate-800 stroke-slate-700 dark:fill-slate-900 dark:stroke-slate-800"
            strokeWidth="2"
            strokeLinejoin="round"
            animate={
              isDragging
                ? { rotate: [-6, 6, -6] }
                : earTwitch
                ? { rotate: [-4, 6, 0] }
                : {}
            }
            transition={{ duration: isDragging ? 0.3 : 0.3, repeat: isDragging ? Infinity : 0 }}
            style={{ transformOrigin: '35px 38px' }}
          />
          {/* Left Inner Ear Accent */}
          <path d="M 32 42 L 26 24 L 42 34 Z" className="fill-purple-400/40" />

          {/* Right Ear */}
          <motion.path
            d="M 88 48 L 98 18 L 72 32 Z"
            className="fill-slate-800 stroke-slate-700 dark:fill-slate-900 dark:stroke-slate-800"
            strokeWidth="2"
            strokeLinejoin="round"
            animate={
              isDragging
                ? { rotate: [6, -6, 6] }
                : earTwitch
                ? { rotate: [4, -6, 0] }
                : {}
            }
            transition={{ duration: isDragging ? 0.3 : 0.3, repeat: isDragging ? Infinity : 0 }}
            style={{ transformOrigin: '85px 38px' }}
          />
          {/* Right Inner Ear Accent */}
          <path d="M 88 42 L 94 24 L 78 34 Z" className="fill-purple-400/40" />

          {/* Cat Head Base */}
          <ellipse
            cx="60"
            cy="58"
            rx="38"
            ry="32"
            className="fill-slate-900 stroke-slate-700 dark:fill-[#0c0c14] dark:stroke-slate-800"
            strokeWidth="2.5"
          />

          {/* Cyber / Tech Collar Band */}
          <path
            d="M 36 84 C 44 90, 76 90, 84 84"
            className="stroke-violet-500/80 dark:stroke-violet-400"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Collar Bell / Tech Core */}
          <circle cx="60" cy="88" r="4.5" className="fill-cyan-400 animate-pulse" />

          {/* EYES */}
          {isHappy ? (
            /* Happy Closed Squint Eyes (^_^) */
            <g className="stroke-cyan-300 dark:stroke-cyan-200" strokeWidth="2.5" strokeLinecap="round">
              <path d="M 40 56 Q 47 49 54 56" />
              <path d="M 66 56 Q 73 49 80 56" />
            </g>
          ) : isBlinking ? (
            /* Blinking Line Eyes */
            <g className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2.5" strokeLinecap="round">
              <line x1="41" y1="56" x2="53" y2="56" />
              <line x1="67" y1="56" x2="79" y2="56" />
            </g>
          ) : isDragging ? (
            /* Excited Dragging Flight Eyes with sparkling pupils */
            <g>
              <ellipse cx="47" cy="55" rx="9" ry="8" className="fill-slate-950 stroke-slate-700 dark:fill-black dark:stroke-slate-800" strokeWidth="1.5" />
              <ellipse cx="73" cy="55" rx="9" ry="8" className="fill-slate-950 stroke-slate-700 dark:fill-black dark:stroke-slate-800" strokeWidth="1.5" />
              <ellipse cx="47" cy="55" rx="7" ry="6.5" className="fill-violet-600/40 dark:fill-violet-400/30" />
              <ellipse cx="73" cy="55" rx="7" ry="6.5" className="fill-violet-600/40 dark:fill-violet-400/30" />
              <ellipse cx="47" cy="54" rx="5" ry="6" className="fill-cyan-400 dark:fill-cyan-300" />
              <ellipse cx="73" cy="54" rx="5" ry="6" className="fill-cyan-400 dark:fill-cyan-300" />
              <circle cx="45" cy="52" r="2" className="fill-white" />
              <circle cx="48.5" cy="56.5" r="1" className="fill-white" />
              <circle cx="71" cy="52" r="2" className="fill-white" />
              <circle cx="74.5" cy="56.5" r="1" className="fill-white" />
            </g>
          ) : (
            /* Open Tracking Eyes */
            <g>
              {/* Eye Whites / Outer Sclera */}
              <ellipse cx="47" cy="55" rx="9" ry="8" className="fill-slate-950 stroke-slate-700 dark:fill-black dark:stroke-slate-800" strokeWidth="1.5" />
              <ellipse cx="73" cy="55" rx="9" ry="8" className="fill-slate-950 stroke-slate-700 dark:fill-black dark:stroke-slate-800" strokeWidth="1.5" />

              {/* Iris / Glowing Gradient */}
              <ellipse cx="47" cy="55" rx="7" ry="6.5" className="fill-violet-600/30 dark:fill-violet-400/20" />
              <ellipse cx="73" cy="55" rx="7" ry="6.5" className="fill-violet-600/30 dark:fill-violet-400/20" />

              {/* Left Eye Pupil (Tracks Cursor) */}
              <g style={{ transform: `translate(${pupilX}px, ${pupilY}px)`, transition: 'transform 0.08s ease-out' }}>
                <ellipse cx="47" cy="55" rx="4" ry="5.5" className="fill-cyan-400 dark:fill-cyan-300" />
                <circle cx="45.5" cy="53" r="1.5" className="fill-white" />
              </g>

              {/* Right Eye Pupil (Tracks Cursor) */}
              <g style={{ transform: `translate(${pupilX}px, ${pupilY}px)`, transition: 'transform 0.08s ease-out' }}>
                <ellipse cx="73" cy="55" rx="4" ry="5.5" className="fill-cyan-400 dark:fill-cyan-300" />
                <circle cx="71.5" cy="53" r="1.5" className="fill-white" />
              </g>
            </g>
          )}

          {/* Tiny Nose */}
          <polygon points="57,66 63,66 60,69" className="fill-pink-400" />

          {/* Mouth */}
          {isDragging ? (
            <ellipse cx="60" cy="73" rx="3" ry="2.2" className="fill-pink-400/90 stroke-slate-600 dark:stroke-slate-700" strokeWidth="1" />
          ) : (
            <path
              d="M 54 71 Q 60 75 60 71 Q 60 75 66 71"
              className="stroke-slate-400/80 dark:stroke-slate-500/80 fill-none"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          )}

          {/* Left Whiskers */}
          <line x1="34" y1="65" x2="16" y2="63" className="stroke-slate-500/50 dark:stroke-slate-400/40" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="34" y1="69" x2="18" y2="72" className="stroke-slate-500/50 dark:stroke-slate-400/40" strokeWidth="1.2" strokeLinecap="round" />

          {/* Right Whiskers */}
          <line x1="86" y1="65" x2="104" y2="63" className="stroke-slate-500/50 dark:stroke-slate-400/40" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="86" y1="69" x2="102" y2="72" className="stroke-slate-500/50 dark:stroke-slate-400/40" strokeWidth="1.2" strokeLinecap="round" />

          {/* Cute Cat Forepaws tucked forward */}
          <ellipse cx="44" cy="93" rx="7" ry="5" className="fill-slate-800 stroke-slate-700 dark:fill-slate-900 dark:stroke-slate-800" strokeWidth="1.5" />
          <ellipse cx="76" cy="93" rx="7" ry="5" className="fill-slate-800 stroke-slate-700 dark:fill-slate-900 dark:stroke-slate-800" strokeWidth="1.5" />
        </g>
      </motion.svg>

      {/* State Badge / Reset Control under the cat */}
      {!hasMoved ? (
        <span className="text-[10px] tracking-wider uppercase font-mono text-violet-600 dark:text-violet-300 mt-1 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 transition-all opacity-0 group-hover:opacity-100 shadow-sm pointer-events-none">
          🐾 Drag me anywhere
        </span>
      ) : (
        <button
          type="button"
          onClick={handleResetPosition}
          className="mt-1 inline-flex items-center gap-1 text-[10px] font-mono tracking-wider text-slate-700 dark:text-slate-200 px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-500 dark:hover:text-white transition-all cursor-pointer shadow-md"
          title="Return companion cat to perch"
        >
          <RotateCcw size={10} />
          <span>Reset spot</span>
        </button>
      )}
    </motion.div>
  )
}
