import { motion } from 'framer-motion'

/**
 * WhiskerDivider: Sophisticated whisker-inspired divider between major sections.
 * Clean, subtle vector line with tapered whisker paths and a center geometric motif.
 */
export default function WhiskerDivider({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center w-full py-4 sm:py-6 overflow-hidden select-none pointer-events-none ${className}`}
    >
      <div className="relative flex items-center justify-center max-w-4xl w-full px-6 opacity-30 dark:opacity-40">
        {/* Left Whisker Lines */}
        <div className="flex-1 flex flex-col gap-1 items-end pr-4">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-[200px] h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-cyan-400 origin-right"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="w-3/4 max-w-[150px] h-[1px] bg-gradient-to-r from-transparent via-violet-400 to-transparent origin-right"
          />
        </div>

        {/* Center Geometric Cat-Nose / Diamond Accent */}
        <div className="relative flex items-center justify-center shrink-0">
          <div className="h-2 w-2 rotate-45 border border-cyan-400 bg-violet-600/60 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
        </div>

        {/* Right Whisker Lines */}
        <div className="flex-1 flex flex-col gap-1 items-start pl-4">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-[200px] h-[1px] bg-gradient-to-l from-transparent via-violet-500 to-cyan-400 origin-left"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="w-3/4 max-w-[150px] h-[1px] bg-gradient-to-l from-transparent via-violet-400 to-transparent origin-left"
          />
        </div>
      </div>
    </div>
  )
}
