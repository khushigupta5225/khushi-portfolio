import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, FolderGit2 } from 'lucide-react'
import { SiGithub } from 'react-icons/si'

/**
 * ProjectCard: Matching the exact interactive card deck aesthetics from p2.mp4:
 * - Inactive mode: Compact preview with rounded image and clean title below.
 * - Active mode: Expanded signature card with Client, Categories, Year metadata and action buttons.
 * - Grid mode (Projects page): Full rich showcase card.
 */
export default function ProjectCard({
  project,
  isCarousel = false,
  isActive = true,
  onActivate,
  onSelect,
}) {
  const [imageError, setImageError] = useState(false)

  // Card click handler
  const handleClick = () => {
    if (isCarousel && !isActive) {
      onActivate?.()
    } else {
      onSelect?.(project)
    }
  }

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border transition-all duration-300 select-none cursor-pointer w-full ${
        isCarousel
          ? isActive
            ? 'bg-white dark:bg-[#121320] border-black/10 dark:border-white/15 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.16)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.65)]'
            : 'bg-white/95 dark:bg-[#11121d]/90 border-black/5 dark:border-white/10 p-4 shadow-md hover:shadow-xl hover:scale-[1.02]'
          : 'bg-white dark:bg-[#121320] border-black/10 dark:border-white/15 p-5 shadow-xl hover:shadow-2xl'
      }`}
    >
      {/* Top Image Preview */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 shadow-inner">
        {!imageError ? (
          <img
            src={project.image}
            alt={project.name}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600">
            <FolderGit2 size={40} />
          </div>
        )}

        {/* Live Indicator Badge on Image (Active or Grid mode) */}
        {((isCarousel && isActive) || !isCarousel) && project.demo && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/75 backdrop-blur-md px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-emerald-400 border border-white/15 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live App</span>
            </span>
          </div>
        )}
      </div>

      {/* Card Body Content */}
      {isCarousel && !isActive ? (
        /* INACTIVE COMPACT VIEW: Clean Title matching p2.mp4 */
        <div className="flex flex-col items-center justify-center py-3 text-center">
          <h3 className="text-sm sm:text-base font-semibold tracking-tight text-neutral-800 dark:text-neutral-200 truncate max-w-full px-1">
            {project.shortTitle || project.name}
          </h3>
          <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 mt-0.5 group-hover:text-blue-500 transition-colors">
            Click to inspect →
          </span>
        </div>
      ) : (
        /* ACTIVE EXPANDED VIEW: Exact matching Client, Categories, Year from p2.mp4 */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col justify-between pt-3 sm:pt-4"
        >
          {/* Title */}
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white truncate">
              {project.shortTitle || project.name}
            </h3>
            <span className="text-xs font-mono font-medium text-neutral-400 dark:text-neutral-500 shrink-0">
              {project.year || '2026'}
            </span>
          </div>

          {/* Metadata Block matching p2.mp4 frame */}
          <div className="mt-3 space-y-1.5 text-xs border-t border-black/5 dark:border-white/10 pt-2.5">
            <div className="flex items-start gap-2">
              <span className="w-20 sm:w-24 shrink-0 font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500 text-[10px] sm:text-[11px]">
                Client
              </span>
              <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                {project.client || 'Engineering Showcase'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-20 sm:w-24 shrink-0 font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500 text-[10px] sm:text-[11px]">
                Categories
              </span>
              <span className="font-medium text-neutral-700 dark:text-neutral-300 truncate">
                {project.categories || project.tech?.slice(0, 3).map((t) => `#${t}`).join(' ')}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-20 sm:w-24 shrink-0 font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500 text-[10px] sm:text-[11px]">
                Year
              </span>
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                {project.year || '2026'}
              </span>
            </div>
          </div>

          {/* Interactive Action Controls */}
          <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 dark:bg-white px-3 py-1.5 text-xs font-semibold text-white dark:text-neutral-950 transition-transform duration-200 hover:scale-105 shadow-sm focus-ring"
                >
                  <span>Live App</span>
                  <ArrowUpRight size={13} />
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="View source code on GitHub"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 dark:border-white/15 text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus-ring"
                  title="GitHub Repository"
                >
                  <SiGithub size={14} />
                </a>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onSelect?.(project)
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors focus-ring rounded py-1 px-1.5"
            >
              <span>Full Details</span>
              <ArrowUpRight size={12} />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
