import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * CatFooterScene: 5 Distinct Hand-Drawn Cats with 3D Vision & Calming Natural Movement.
 * 
 * The 5 Cats:
 * 1. Cat 1 (The Scout / Tail-Wagger): Upright, confident walk with an active wagging S-curve tail.
 * 2. Cat 2 (The Sneak / Loaf-Walker): Low center of gravity, soft creeping paws, pauses to tuck into a cozy loaf.
 * 3. Cat 3 (The Pensive Thinker): Measured slow steps, sits down to "think about something", turns late!
 * 4. Cat 4 (The Playful Acrobat / Roller): Bouncy kitten steps, rolls onto back with happy (^_^) eyes & play-bows.
 * 5. Cat 5 (The Graceful Lounger): Slow, majestic strides, flowing tail, pauses to wash face/paw.
 *
 * Movement & 3D:
 * - Slow, soothing, calming pace with thoughtful pauses (sit -> think -> turn late in 3D -> walk).
 * - Staggered 3D turnarounds: Cats turn one by one with delays rather than all at once.
 * - Guaranteed spacing: Mathematical convoy formula ensures cats never overlap or crowd each other.
 * - All 5 cats stand/sit directly ON the single horizontal footer line.
 */

const catStyle = {
  body: 'fill-[#fafafc] dark:fill-[#f1f2f6] stroke-[#1c1c24] dark:stroke-[#18181f]',
  detail: 'fill-[#1c1c24] dark:fill-[#18181f]',
  subtle: 'stroke-[#1c1c24]/50 dark:stroke-[#18181f]/60',
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export default function CatFooterScene() {
  const shouldReduceMotion = useReducedMotion()
  const containerRef = useRef(null)
  const [stageWidth, setStageWidth] = useState(900)

  // Simulation state
  const [scene, setScene] = useState({
    walkProgress: 0, // 0 to 1
    direction: 1, // 1 = right, -1 = left
    isWalking: true,
    turnAngles: [0, 0, 0, 0, 0], // individual 3D turnaround angles for the 5 cats
    playPose: 'none', // 'none' | 'right-pause' | 'left-pause'
    thinkingCat: null, // 'cat1' | 'cat5' | null
  })

  // 3D Mouse Parallax Tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const targetTilt = useRef({ x: 0, y: 0 })

  // Hovered cat tooltip state
  const [hoveredCat, setHoveredCat] = useState(null)

  // Measure stage width
  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        setStageWidth(containerRef.current.clientWidth)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Mouse move handler for 3D perspective tilt
  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    targetTilt.current = {
      x: nx * 8, // subtle 3D tilt
      y: -ny * 5,
    }
  }

  const handleMouseLeave = () => {
    targetTilt.current = { x: 0, y: 0 }
    setHoveredCat(null)
  }

  // Animation Timeline Loop - Slow, Calming, and Thoughtful
  useEffect(() => {
    if (shouldReduceMotion) return

    // Phase timings (ms) - snappy, smooth stroll & quick turnaround
    const WALK_MS = 10000   // 10s smooth walk across
    const SETTLE_MS = 300   // 0.3s quick arrive
    const THINK_MS = 1200   // 1.2s thinking pause (Cat 1 at right, Cat 5 at left)
    const TURN_MS = 550     // 0.55s crisp, fast turnaround
    const HALF_CYCLE = WALK_MS + SETTLE_MS + THINK_MS + TURN_MS // 12.05s
    const FULL_CYCLE = HALF_CYCLE * 2 // 24.1s total loop

    let animId
    const startTime = performance.now()

    function tick(now) {
      const elapsed = (now - startTime) % FULL_CYCLE

      // Smooth tilt lerp
      setTilt((prev) => ({
        x: prev.x + (targetTilt.current.x - prev.x) * 0.08,
        y: prev.y + (targetTilt.current.y - prev.y) * 0.08,
      }))

      if (elapsed < WALK_MS) {
        // 1. Walking Right (Left to Right)
        const p = easeInOutCubic(elapsed / WALK_MS)
        setScene({
          walkProgress: p,
          direction: 1,
          isWalking: true,
          turnAngles: [0, 0, 0, 0, 0],
          playPose: 'none',
          thinkingCat: null,
        })
      } else if (elapsed < WALK_MS + SETTLE_MS) {
        // 2. Arrived at Right edge: sitting down gradually
        setScene({
          walkProgress: 1,
          direction: 1,
          isWalking: false,
          turnAngles: [0, 0, 0, 0, 0],
          playPose: 'right-pause',
          thinkingCat: null,
        })
      } else if (elapsed < WALK_MS + SETTLE_MS + THINK_MS) {
        // 3. Right edge: RIGHTMOST CAT (Cat 1) THINKS!
        setScene({
          walkProgress: 1,
          direction: 1,
          isWalking: false,
          turnAngles: [0, 0, 0, 0, 0],
          playPose: 'right-pause',
          thinkingCat: 'cat1', // Rightmost cat thinks!
        })
      } else if (elapsed < HALF_CYCLE) {
        // 4. Turnaround to face Left (0° -> 180°) - clean, quick
        const turnElapsed = elapsed - (WALK_MS + SETTLE_MS + THINK_MS)
        // Stagger delays
        const delays = [150, 100, 60, 30, 0]
        const turnDuration = 350

        const angles = delays.map((d) => {
          if (turnElapsed < d) return 0
          const localP = Math.min(1, (turnElapsed - d) / turnDuration)
          return easeInOutCubic(localP) * 180
        })

        setScene({
          walkProgress: 1,
          direction: -1,
          isWalking: false,
          turnAngles: angles,
          playPose: 'none',
          thinkingCat: null,
        })
      } else if (elapsed < HALF_CYCLE + WALK_MS) {
        // 5. Walking Left (Right to Left)
        const p = 1 - easeInOutCubic((elapsed - HALF_CYCLE) / WALK_MS)
        setScene({
          walkProgress: p,
          direction: -1,
          isWalking: true,
          turnAngles: [180, 180, 180, 180, 180],
          playPose: 'none',
          thinkingCat: null,
        })
      } else if (elapsed < HALF_CYCLE + WALK_MS + SETTLE_MS) {
        // 6. Arrived at Left edge: sitting down
        setScene({
          walkProgress: 0,
          direction: -1,
          isWalking: false,
          turnAngles: [180, 180, 180, 180, 180],
          playPose: 'left-pause',
          thinkingCat: null,
        })
      } else if (elapsed < HALF_CYCLE + WALK_MS + SETTLE_MS + THINK_MS) {
        // 7. Left edge: LEFTMOST CAT (Cat 5) THINKS!
        setScene({
          walkProgress: 0,
          direction: -1,
          isWalking: false,
          turnAngles: [180, 180, 180, 180, 180],
          playPose: 'left-pause',
          thinkingCat: 'cat5', // Leftmost cat thinks!
        })
      } else {
        // 8. Turnaround to face Right (180° -> 0°) - clean, quick
        const turnElapsed = elapsed - (HALF_CYCLE + WALK_MS + SETTLE_MS + THINK_MS)
        // Stagger delays
        const delays = [0, 30, 60, 100, 150]
        const turnDuration = 350

        const angles = delays.map((d) => {
          if (turnElapsed < d) return 180
          const localP = Math.min(1, (turnElapsed - d) / turnDuration)
          return 180 - easeInOutCubic(localP) * 180
        })

        setScene({
          walkProgress: 0,
          direction: 1,
          isWalking: false,
          turnAngles: angles,
          playPose: 'none',
          thinkingCat: null,
        })
      }

      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [shouldReduceMotion])

  // Guaranteed safe spacing math for 5 cats - responsive for mobile, tablet & desktop
  const isMobile = stageWidth < 640
  const margin = isMobile
    ? Math.max(18, Math.min(40, stageWidth * 0.05))
    : Math.max(70, Math.min(120, stageWidth * 0.1))
  const usableWidth = Math.max(180, stageWidth - margin * 2)
  // Distance between each of the 5 cats (4 intervals)
  const gap = isMobile
    ? Math.max(30, Math.min(55, (usableWidth - 20) / 4.2))
    : Math.max(48, Math.min(130, usableWidth * 0.15))
  const packSpan = 4 * gap
  const travelSpan = Math.max(15, usableWidth - packSpan)

  // Positions along the line (strictly ordered Cat 1 > Cat 2 > Cat 3 > Cat 4 > Cat 5)
  const xCat1 = margin + 4 * gap + scene.walkProgress * travelSpan
  const xCat2 = margin + 3 * gap + scene.walkProgress * travelSpan
  const xCat3 = margin + 2 * gap + scene.walkProgress * travelSpan
  const xCat4 = margin + 1 * gap + scene.walkProgress * travelSpan
  const xCat5 = margin + scene.walkProgress * travelSpan

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden select-none translate-y-[1px]"
      style={{ perspective: '1200px' }}
    >
      {/* Dynamic CSS Keyframes for the 5 distinct walking gaits & calming motions */}
      <style>{`
        /* CAT 1: Scout / Tail-Wagger Gait */
        @keyframes cat1StepFront {
          0% { transform: rotate(-18deg); }
          50% { transform: rotate(18deg); }
          100% { transform: rotate(-18deg); }
        }
        @keyframes cat1TailWag {
          0% { transform: rotate(-16deg); }
          50% { transform: rotate(16deg); }
          100% { transform: rotate(-16deg); }
        }

        /* CAT 2: Sneaking / Loaf-Walker Gait (low, soft steps) */
        @keyframes cat2StepCreep {
          0% { transform: rotate(-11deg); }
          50% { transform: rotate(11deg); }
          100% { transform: rotate(-11deg); }
        }
        @keyframes cat2LowBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-1px); }
        }

        /* CAT 3: Pensive Thinker Gait (steady, slow cadence) */
        @keyframes cat3StepCalm {
          0% { transform: rotate(-14deg); }
          50% { transform: rotate(14deg); }
          100% { transform: rotate(-14deg); }
        }
        @keyframes cat3ThinkFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(-3deg); }
        }

        /* CAT 4: Playful Kitten Gait (bouncy steps) */
        @keyframes cat4StepKitten {
          0% { transform: rotate(-20deg); }
          50% { transform: rotate(20deg); }
          100% { transform: rotate(-20deg); }
        }
        @keyframes cat4BouncyBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2.2px); }
        }

        /* CAT 5: Graceful Lounger Gait (slow, flowing steps) */
        @keyframes cat5StepGraceful {
          0% { transform: rotate(-13deg); }
          50% { transform: rotate(13deg); }
          100% { transform: rotate(-13deg); }
        }
        @keyframes cat5TailFlow {
          0% { transform: rotate(0deg); }
          30% { transform: rotate(8deg); }
          70% { transform: rotate(-6deg); }
          100% { transform: rotate(0deg); }
        }

        .cat1-walk-front-near { animation: cat1StepFront 0.8s infinite ease-in-out; }
        .cat1-walk-front-far  { animation: cat1StepFront 0.8s infinite ease-in-out reverse; }
        .cat1-tail-wag        { animation: cat1TailWag 0.9s infinite ease-in-out; }

        .cat2-walk-front-near { animation: cat2StepCreep 0.75s infinite ease-in-out; }
        .cat2-walk-front-far  { animation: cat2StepCreep 0.75s infinite ease-in-out reverse; }
        .cat2-torso-creep     { animation: cat2LowBob 0.375s infinite ease-in-out; }

        .cat3-walk-front-near { animation: cat3StepCalm 0.85s infinite ease-in-out; }
        .cat3-walk-front-far  { animation: cat3StepCalm 0.85s infinite ease-in-out reverse; }

        .cat4-walk-front-near { animation: cat4StepKitten 0.7s infinite ease-in-out; }
        .cat4-walk-front-far  { animation: cat4StepKitten 0.7s infinite ease-in-out reverse; }
        .cat4-torso-bounce    { animation: cat4BouncyBob 0.35s infinite ease-in-out; }

        .cat5-walk-front-near { animation: cat5StepGraceful 0.9s infinite ease-in-out; }
        .cat5-walk-front-far  { animation: cat5StepGraceful 0.9s infinite ease-in-out reverse; }
        .cat5-tail-flow       { animation: cat5TailFlow 1.8s infinite ease-in-out; }
      `}</style>

      {/* 3D Perspective Stage */}
      <div
        className="relative mx-auto h-20 sm:h-24 w-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: shouldReduceMotion
            ? (isMobile ? 'scale(0.82)' : 'none')
            : `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) ${isMobile ? 'scale(0.82)' : ''}`,
          transformOrigin: 'bottom center',
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* ============================================================ */}
        {/* CAT 1: THE TAIL-WAGGER (Upright Scout, actively wags tail)    */}
        {/* ============================================================ */}
        <div
          onMouseEnter={() => setHoveredCat('cat1')}
          onMouseLeave={() => setHoveredCat(null)}
          className="absolute bottom-0 cursor-pointer"
          style={{
            left: `${xCat1}px`,
            transform: 'translate3d(-50%, 0, 18px)',
          }}
        >
          {/* Thinking bubble: Outside rotateY wrapper, so it NEVER mirrors! Anchored right-0 so it extends inwards and NEVER overflows right edge! */}
          {(scene.thinkingCat === 'cat1' || hoveredCat === 'cat1') && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-8 right-0 flex items-center gap-1 rounded-full bg-black/85 px-2.5 py-0.5 text-[11px] font-medium text-white shadow-md dark:bg-white/95 dark:text-black whitespace-nowrap pointer-events-none z-30"
              style={{
                animation: 'cat3ThinkFloat 2.8s infinite ease-in-out',
              }}
            >
              <span>💭</span>
              <span>{scene.thinkingCat === 'cat1' ? 'thinking...' : '(=^･ω･^=) Leader ♪'}</span>
            </motion.div>
          )}

          {/* Inner SVG wrapper with rotateY turnaround */}
          <div
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${scene.turnAngles[0]}deg)`,
              transition: 'transform 0.05s linear',
            }}
          >
            <svg
              width="52"
              height="56"
              viewBox="0 0 52 56"
              fill="none"
              className="block drop-shadow-[0_2px_4px_rgba(0,0,0,0.04)] dark:drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-transform duration-200 hover:scale-105"
            >
              {/* Active Wagging Tail */}
              <g
                className="cat1-tail-wag"
                style={{ transformOrigin: '14px 32px' }}
              >
                <path
                  d="M 14 32 C 8 24, 4 10, 10 6 C 13 4, 15 7, 13 10 C 9 15, 12 24, 18 34 Z"
                  className={`${catStyle.body} stroke-[1.8]`}
                  strokeLinejoin="round"
                />
              </g>

              {/* Far Legs */}
              <g className={catStyle.subtle}>
                <line
                  x1="15"
                  y1="34"
                  x2="13"
                  y2="54"
                  className={`stroke-[1.8] ${scene.isWalking ? 'cat1-walk-front-far' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '15px 34px' }}
                />
                <line
                  x1="39"
                  y1="34"
                  x2="37"
                  y2="54"
                  className={`stroke-[1.8] ${scene.isWalking ? 'cat1-walk-front-far' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '39px 34px' }}
                />
              </g>

              {/* Body */}
              <path
                d="M 15 32 C 13 24, 23 20, 36 22 C 42 23, 45 26, 46 32 C 45 40, 38 43, 26 43 C 17 43, 14 38, 15 32 Z"
                className={`${catStyle.body} stroke-[1.8]`}
                strokeLinejoin="round"
              />

              {/* Head with Pensive Tilt when thinking */}
              <g
                style={{
                  transformOrigin: '43px 18px',
                  transform: scene.thinkingCat === 'cat1' ? 'rotate(-10deg) translateY(-1px)' : 'none',
                  transition: 'transform 0.4s ease',
                }}
              >
                <path
                  d="M 37 14 L 39 5 L 44 11 M 46 11 L 51 5 L 52 14"
                  className={`${catStyle.body} stroke-[1.8]`}
                  strokeLinejoin="round"
                />
                <ellipse cx="44" cy="16" rx="8.5" ry="7.5" className={`${catStyle.body} stroke-[1.8]`} />
                <circle cx="42" cy="15" r="1.1" className={catStyle.detail} />
                <circle cx="47" cy="15" r="1.1" className={catStyle.detail} />
                <line x1="35" y1="16" x2="30" y2="15" className="stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.1]" strokeLinecap="round" />
                <line x1="35" y1="18" x2="30" y2="19" className="stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.1]" strokeLinecap="round" />
                <line x1="50" y1="16" x2="55" y2="15" className="stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.1]" strokeLinecap="round" />
                <line x1="50" y1="18" x2="55" y2="19" className="stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.1]" strokeLinecap="round" />
              </g>

              {/* Near Legs */}
              <g>
                <line
                  x1="21"
                  y1="34"
                  x2="23"
                  y2="54"
                  className={`stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.8] ${scene.isWalking ? 'cat1-walk-front-near' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '21px 34px' }}
                />
                <line
                  x1="45"
                  y1="34"
                  x2="47"
                  y2="54"
                  className={`stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.8] ${scene.isWalking ? 'cat1-walk-front-near' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '45px 34px' }}
                />
              </g>
            </svg>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CAT 2: THE SNEAK / LOAF-WALKER (Low creeping steps, loafs)   */}
        {/* ============================================================ */}
        <div
          onMouseEnter={() => setHoveredCat('cat2')}
          onMouseLeave={() => setHoveredCat(null)}
          className="absolute bottom-0 cursor-pointer"
          style={{
            left: `${xCat2}px`,
            transform: 'translate3d(-50%, 0, 6px)',
          }}
        >
          {hoveredCat === 'cat2' && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-black/85 px-2.5 py-0.5 text-[11px] font-medium text-white shadow-md dark:bg-white/95 dark:text-black whitespace-nowrap pointer-events-none z-30"
            >
              ( -.-)zZ cozy loaf...
            </motion.div>
          )}

          <div
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${scene.turnAngles[1]}deg)`,
              transition: 'transform 0.05s linear',
            }}
          >
            <svg
              width="56"
              height="46"
              viewBox="0 0 56 46"
              fill="none"
              className="block drop-shadow-[0_2px_4px_rgba(0,0,0,0.04)] dark:drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-transform duration-200 hover:scale-105"
              style={{
                transformOrigin: 'bottom center',
                transform: scene.playPose !== 'none' ? 'scaleY(0.92)' : 'none',
                transition: 'transform 0.6s ease',
              }}
            >
              {/* Low Curled Tail */}
              <path
                d="M 14 36 C 6 36, 4 26, 10 24 C 13 23, 14 26, 12 28 C 8 30, 9 34, 18 35"
                className="stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.8] fill-none"
                strokeLinecap="round"
              />

              {/* Far Legs (soft creeping) */}
              <g className={catStyle.subtle}>
                <line
                  x1="16"
                  y1="32"
                  x2="14"
                  y2="45"
                  className={`stroke-[1.8] ${scene.isWalking ? 'cat2-walk-front-far' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '16px 32px' }}
                />
                <line
                  x1="39"
                  y1="32"
                  x2="37"
                  y2="45"
                  className={`stroke-[1.8] ${scene.isWalking ? 'cat2-walk-front-far' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '39px 32px' }}
                />
              </g>

              {/* Low-Profile Body */}
              <g className={scene.isWalking ? 'cat2-torso-creep' : ''}>
                <path
                  d="M 14 34 C 12 24, 24 18, 39 20 C 46 21, 50 25, 51 32 C 50 38, 44 41, 32 41 C 21 41, 15 39, 14 34 Z"
                  className={`${catStyle.body} stroke-[1.8]`}
                  strokeLinejoin="round"
                />

                {/* Head with sleepy/calm eyes */}
                <g style={{ transformOrigin: '47px 18px' }}>
                  <path
                    d="M 40 16 L 42 8 L 46 14 M 48 14 L 52 8 L 54 16"
                    className={`${catStyle.body} stroke-[1.8]`}
                    strokeLinejoin="round"
                  />
                  <ellipse cx="47" cy="18" rx="8" ry="7" className={`${catStyle.body} stroke-[1.8]`} />
                  {/* Peaceful half-lidded eyes */}
                  <path d="M 44 18 Q 45 17 46 18" className="stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.2] fill-none" strokeLinecap="round" />
                  <path d="M 49 18 Q 50 17 51 18" className="stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.2] fill-none" strokeLinecap="round" />
                  <line x1="39" y1="18" x2="34" y2="18" className="stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1]" strokeLinecap="round" />
                  <line x1="53" y1="18" x2="58" y2="18" className="stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1]" strokeLinecap="round" />
                </g>
              </g>

              {/* Near Legs */}
              <g>
                <line
                  x1="22"
                  y1="32"
                  x2="24"
                  y2="45"
                  className={`stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.8] ${scene.isWalking ? 'cat2-walk-front-near' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '22px 32px' }}
                />
                <line
                  x1="45"
                  y1="32"
                  x2="47"
                  y2="45"
                  className={`stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.8] ${scene.isWalking ? 'cat2-walk-front-near' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '45px 32px' }}
                />
              </g>
            </svg>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CAT 3: THE PENSIVE THINKER (Steady cadence, turns late!)      */}
        {/* ============================================================ */}
        <div
          onMouseEnter={() => setHoveredCat('cat3')}
          onMouseLeave={() => setHoveredCat(null)}
          className="absolute bottom-0 cursor-pointer"
          style={{
            left: `${xCat3}px`,
            transform: 'translate3d(-50%, 0, -4px)',
          }}
        >
          {hoveredCat === 'cat3' && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.75 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-black/90 px-2.5 py-0.5 text-[11px] font-medium text-white shadow-lg dark:bg-white/95 dark:text-black whitespace-nowrap pointer-events-none z-30"
              style={{
                animation: 'cat3ThinkFloat 3s infinite ease-in-out',
              }}
            >
              <span>💭</span>
              <span>The Philosopher</span>
            </motion.div>
          )}

          <div
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${scene.turnAngles[2]}deg)`,
              transition: 'transform 0.05s linear',
            }}
          >
            <svg
              width="52"
              height="54"
              viewBox="0 0 52 54"
              fill="none"
              className="block drop-shadow-[0_2px_4px_rgba(0,0,0,0.04)] dark:drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-transform duration-200 hover:scale-105"
            >
              {/* Thoughtful Tail */}
              <path
                d="M 14 34 C 8 28, 6 16, 12 12 C 14 10, 16 12, 14 15 C 10 19, 12 26, 18 36 Z"
                className={`${catStyle.body} stroke-[1.8]`}
                strokeLinejoin="round"
              />

              {/* Far Legs */}
              <g className={catStyle.subtle}>
                <line
                  x1="16"
                  y1="34"
                  x2="14"
                  y2="53"
                  className={`stroke-[1.8] ${scene.isWalking ? 'cat3-walk-front-far' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '16px 34px' }}
                />
                <line
                  x1="39"
                  y1="34"
                  x2="37"
                  y2="53"
                  className={`stroke-[1.8] ${scene.isWalking ? 'cat3-walk-front-far' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '39px 34px' }}
                />
              </g>

              {/* Rounded Thinker Body */}
              <path
                d="M 15 32 C 14 24, 23 20, 36 22 C 42 23, 45 27, 46 33 C 45 40, 38 43, 27 43 C 18 43, 15 38, 15 32 Z"
                className={`${catStyle.body} stroke-[1.8]`}
                strokeLinejoin="round"
              />

              {/* Head with Curious Wide Eyes */}
              <g
                style={{
                  transformOrigin: '44px 18px',
                  transform: scene.thinkingCat === 'cat3' ? 'rotate(-10deg) translateY(-1px)' : 'none',
                  transition: 'transform 0.5s ease',
                }}
              >
                <path
                  d="M 38 14 L 40 5 L 45 11 M 47 11 L 52 5 L 53 14"
                  className={`${catStyle.body} stroke-[1.8]`}
                  strokeLinejoin="round"
                />
                <ellipse cx="45" cy="16" rx="8.5" ry="7.5" className={`${catStyle.body} stroke-[1.8]`} />
                {/* Curious Wide Eyes */}
                <circle cx="43" cy="15" r="1.2" className={catStyle.detail} />
                <circle cx="48" cy="15" r="1.2" className={catStyle.detail} />
                <line x1="36" y1="16" x2="31" y2="15" className="stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1]" strokeLinecap="round" />
                <line x1="36" y1="18" x2="31" y2="19" className="stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1]" strokeLinecap="round" />
                <line x1="51" y1="16" x2="56" y2="15" className="stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1]" strokeLinecap="round" />
                <line x1="51" y1="18" x2="56" y2="19" className="stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1]" strokeLinecap="round" />
              </g>

              {/* Near Legs */}
              <g>
                <line
                  x1="22"
                  y1="34"
                  x2="24"
                  y2="53"
                  className={`stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.8] ${scene.isWalking ? 'cat3-walk-front-near' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '22px 34px' }}
                />
                <line
                  x1="45"
                  y1="34"
                  x2="47"
                  y2="53"
                  className={`stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.8] ${scene.isWalking ? 'cat3-walk-front-near' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '45px 34px' }}
                />
              </g>
            </svg>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CAT 4: THE PLAYFUL AKROBAT (Bouncy kitten, rolls & stretches) */}
        {/* ============================================================ */}
        <div
          onMouseEnter={() => setHoveredCat('cat4')}
          onMouseLeave={() => setHoveredCat(null)}
          className="absolute bottom-0 cursor-pointer"
          style={{
            left: `${xCat4}px`,
            transform: 'translate3d(-50%, 0, 12px)',
          }}
        >
          {hoveredCat === 'cat4' && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-black/85 px-2.5 py-0.5 text-[11px] font-medium text-white shadow-md dark:bg-white/95 dark:text-black whitespace-nowrap pointer-events-none z-30"
            >
              🐾 roll & play! ✨
            </motion.div>
          )}

          <div
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${scene.turnAngles[3]}deg)`,
              transition: 'transform 0.05s linear',
            }}
          >
            <svg
              width="50"
              height="48"
              viewBox="0 0 50 48"
              fill="none"
              className="block drop-shadow-[0_2px_4px_rgba(0,0,0,0.04)] dark:drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-transform duration-200 hover:scale-105"
              style={{
                transformOrigin: 'bottom center',
                transform:
                  scene.playPose === 'right-pause'
                    ? 'rotate(-14deg) translateY(-2px)'
                    : scene.playPose === 'left-pause'
                    ? 'rotate(10deg) translateY(-1px)'
                    : 'none',
                transition: 'transform 0.5s ease',
              }}
            >
              {/* Playful Hooked Tail */}
              <path
                d="M 13 28 C 9 18, 15 10, 21 12 C 23 13, 22 16, 20 15 C 16 14, 14 20, 17 30 Z"
                className={`${catStyle.body} stroke-[1.8]`}
                strokeLinejoin="round"
              />

              {/* Far Legs */}
              <g className={catStyle.subtle}>
                <line
                  x1="13"
                  y1="30"
                  x2="11"
                  y2="47"
                  className={`stroke-[1.8] ${scene.isWalking ? 'cat4-walk-front-far' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '13px 30px' }}
                />
                <line
                  x1="35"
                  y1="30"
                  x2="33"
                  y2="47"
                  className={`stroke-[1.8] ${scene.isWalking ? 'cat4-walk-front-far' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '35px 30px' }}
                />
              </g>

              {/* Bouncy Kitten Body */}
              <g className={scene.isWalking ? 'cat4-torso-bounce' : ''}>
                <path
                  d="M 13 28 C 12 20, 21 16, 33 18 C 39 19, 42 23, 42 28 C 41 34, 35 37, 25 37 C 16 37, 13 33, 13 28 Z"
                  className={`${catStyle.body} stroke-[1.8]`}
                  strokeLinejoin="round"
                />

                {/* Head with Perky Ears */}
                <g style={{ transformOrigin: '39px 15px' }}>
                  <path
                    d="M 33 13 L 35 5 L 39 11 M 41 11 L 45 5 L 47 13"
                    className={`${catStyle.body} stroke-[1.8]`}
                    strokeLinejoin="round"
                  />
                  <ellipse cx="40" cy="15" rx="7.5" ry="7" className={`${catStyle.body} stroke-[1.8]`} />
                  {/* Happy curved eyes (^_^) */}
                  {scene.playPose !== 'none' ? (
                    <>
                      <path d="M 37 14 Q 38 12 39 14" className="stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.2] fill-none" strokeLinecap="round" />
                      <path d="M 41 14 Q 42 12 43 14" className="stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.2] fill-none" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <circle cx="38" cy="14" r="1" className={catStyle.detail} />
                      <circle cx="42" cy="14" r="1" className={catStyle.detail} />
                    </>
                  )}
                  <line x1="32" y1="15" x2="28" y2="14" className="stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1]" strokeLinecap="round" />
                  <line x1="45" y1="15" x2="49" y2="14" className="stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1]" strokeLinecap="round" />
                </g>
              </g>

              {/* Near Legs */}
              <g>
                <line
                  x1="19"
                  y1="30"
                  x2="21"
                  y2="47"
                  className={`stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.8] ${scene.isWalking ? 'cat4-walk-front-near' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '19px 30px' }}
                />
                <line
                  x1="40"
                  y1="30"
                  x2="42"
                  y2="47"
                  className={`stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.8] ${scene.isWalking ? 'cat4-walk-front-near' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '40px 30px' }}
                />
              </g>
            </svg>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CAT 5: THE GRACEFUL LOUNGER (Slow, regal, leads going Left)  */}
        {/* ============================================================ */}
        <div
          onMouseEnter={() => setHoveredCat('cat5')}
          onMouseLeave={() => setHoveredCat(null)}
          className="absolute bottom-0 cursor-pointer"
          style={{
            left: `${xCat5}px`,
            transform: 'translate3d(-50%, 0, -16px)',
          }}
        >
          {/* Thinking bubble: Outside rotateY wrapper, so it NEVER mirrors! Anchored left-0 so it extends inwards and NEVER overflows left edge! */}
          {(scene.thinkingCat === 'cat5' || hoveredCat === 'cat5') && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-8 left-0 flex items-center gap-1 rounded-full bg-black/85 px-2.5 py-0.5 text-[11px] font-medium text-white shadow-md dark:bg-white/95 dark:text-black whitespace-nowrap pointer-events-none z-30"
              style={{
                animation: 'cat3ThinkFloat 2.8s infinite ease-in-out',
              }}
            >
              <span>💭</span>
              <span>{scene.thinkingCat === 'cat5' ? 'thinking...' : 'purrr... ♥'}</span>
            </motion.div>
          )}

          <div
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${scene.turnAngles[4]}deg)`,
              transition: 'transform 0.05s linear',
            }}
          >
            <svg
              width="54"
              height="54"
              viewBox="0 0 54 54"
              fill="none"
              className="block drop-shadow-[0_2px_4px_rgba(0,0,0,0.04)] dark:drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-transform duration-200 hover:scale-105"
            >
              {/* Long Flowing Tail */}
              <g
                className={scene.isWalking ? 'cat5-tail-flow' : ''}
                style={{ transformOrigin: '14px 32px' }}
              >
                <path
                  d="M 14 32 C 8 26, 4 18, 9 12 C 11 9, 14 11, 12 14 C 9 18, 12 24, 18 34 Z"
                  className={`${catStyle.body} stroke-[1.8]`}
                  strokeLinejoin="round"
                />
              </g>

              {/* Far Legs */}
              <g className={catStyle.subtle}>
                <line
                  x1="15"
                  y1="34"
                  x2="13"
                  y2="53"
                  className={`stroke-[1.8] ${scene.isWalking ? 'cat5-walk-front-far' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '15px 34px' }}
                />
                <line
                  x1="40"
                  y1="34"
                  x2="38"
                  y2="53"
                  className={`stroke-[1.8] ${scene.isWalking ? 'cat5-walk-front-far' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '40px 34px' }}
                />
              </g>

              {/* Regal Body */}
              <path
                d="M 15 32 C 14 24, 23 20, 36 22 C 42 23, 45 27, 46 32 C 45 39, 38 42, 27 42 C 17 42, 14 37, 15 32 Z"
                className={`${catStyle.body} stroke-[1.8]`}
                strokeLinejoin="round"
              />

              {/* Head with tilt when thinking */}
              <g
                style={{
                  transformOrigin: '44px 17px',
                  transform: scene.thinkingCat === 'cat5' ? 'rotate(-10deg) translateY(-1px)' : 'none',
                  transition: 'transform 0.4s ease',
                }}
              >
                <path
                  d="M 38 13 L 40 4 L 45 11 M 47 11 L 52 4 L 53 13"
                  className={`${catStyle.body} stroke-[1.8]`}
                  strokeLinejoin="round"
                />
                <ellipse cx="45" cy="16" rx="8.5" ry="7.5" className={`${catStyle.body} stroke-[1.8]`} />
                <circle cx="43" cy="15" r="1.1" className={catStyle.detail} />
                <circle cx="48" cy="15" r="1.1" className={catStyle.detail} />
                <line x1="36" y1="16" x2="31" y2="15" className="stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.1]" strokeLinecap="round" />
                <line x1="51" y1="16" x2="56" y2="15" className="stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.1]" strokeLinecap="round" />
              </g>

              {/* Near Legs */}
              <g>
                <line
                  x1="21"
                  y1="34"
                  x2="23"
                  y2="53"
                  className={`stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.8] ${scene.isWalking ? 'cat5-walk-front-near' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '21px 34px' }}
                />
                <line
                  x1="46"
                  y1="34"
                  x2="48"
                  y2="53"
                  className={`stroke-[#1c1c24] dark:stroke-[#18181f] stroke-[1.8] ${scene.isWalking ? 'cat5-walk-front-near' : ''}`}
                  strokeLinecap="round"
                  style={{ transformOrigin: '46px 34px' }}
                />
              </g>
            </svg>
          </div>
        </div>

      </div>
    </div>
  )
}
