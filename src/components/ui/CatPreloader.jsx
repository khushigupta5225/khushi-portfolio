import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CatPreloader({ onComplete }) {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const alreadySeen = sessionStorage.getItem('portfolio_preloader_seen')
    return !prefersReducedMotion && !alreadySeen
  })
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!visible) {
      onComplete?.()
      return
    }

    const startTime = performance.now()
    const duration = 1200 // 1.2 seconds max

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime
      const currentProgress = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(currentProgress)

      if (currentProgress >= 100) {
        clearInterval(interval)
        sessionStorage.setItem('portfolio_preloader_seen', 'true')
        setTimeout(() => {
          setVisible(false)
          onComplete?.()
        }, 250)
      }
    }, 20)

    return () => clearInterval(interval)
  }, [visible, onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cat-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#08080c] text-white select-none pointer-events-auto"
        >
          <div className="relative flex flex-col items-center justify-center gap-6 px-6 w-full max-w-sm">
            {/* Animated Cat Silhouette / Line Art */}
            <div className="relative h-16 w-16">
              <svg
                viewBox="0 0 64 64"
                className="w-full h-full text-violet-400 stroke-current fill-none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Cat Head with Ears */}
                <path d="M 18 36 L 14 18 L 26 26 L 38 26 L 50 18 L 46 36" />
                {/* Cat Cheeks and Chin */}
                <path d="M 18 36 C 16 46, 26 52, 32 52 C 38 52, 48 46, 46 36" />
                {/* Eyes (Blinking animation) */}
                <motion.circle
                  cx="24"
                  cy="36"
                  r="2.5"
                  className="fill-current stroke-none"
                  animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, times: [0, 0.4, 0.45, 0.5, 1] }}
                />
                <motion.circle
                  cx="40"
                  cy="36"
                  r="2.5"
                  className="fill-current stroke-none"
                  animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, times: [0, 0.4, 0.45, 0.5, 1] }}
                />
                {/* Cute Nose */}
                <polygon points="30,42 34,42 32,44" className="fill-current stroke-none" />
                {/* Whiskers */}
                <line x1="12" y1="38" x2="2" y2="36" />
                <line x1="12" y1="42" x2="3" y2="43" />
                <line x1="52" y1="38" x2="62" y2="36" />
                <line x1="52" y1="42" x2="61" y2="43" />
              </svg>

              {/* Paw Prints trail */}
              <motion.div
                className="absolute -bottom-2 -left-3 text-xs opacity-70"
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 0.8] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.1 }}
              >
                🐾
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -right-3 text-xs opacity-70"
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 0.8] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
              >
                🐾
              </motion.div>
            </div>

            {/* Minimal Progress Bar */}
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 via-cyan-400 to-pink-500 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            {/* Subtle Brand Tagline */}
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-white/50 uppercase">
              <span>Initializing</span>
              <span className="w-8 text-right font-medium text-white/80">{progress}%</span>
            </div>

            {/* Quick skip trigger for power users */}
            <button
              type="button"
              onClick={() => {
                setVisible(false)
                onComplete?.()
              }}
              className="text-[11px] text-white/40 hover:text-white/80 transition-colors underline underline-offset-2"
            >
              Skip
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
