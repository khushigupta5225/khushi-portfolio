import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react'
import { SiGithub } from 'react-icons/si'

/**
 * ProjectModal: Deep-dive modal presenting authentic architecture and engineering achievements.
 * Fully accessible with Escape key dismiss and scroll lock.
 */
export default function ProjectModal({ project, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/20 bg-[#0c0d14] text-slate-100 shadow-2xl max-h-[92vh] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-project-title"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white/80 backdrop-blur-md transition-colors hover:bg-black/90 hover:text-white border border-white/15 focus-ring"
            >
              <X size={20} />
            </button>

            {/* Modal Content Scrollable Container */}
            <div className="overflow-y-auto p-6 sm:p-8 flex flex-col gap-6">
              {/* Project Image Frame */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-black/60 border border-white/10 shadow-inner">
                <img
                  src={project.image}
                  alt={project.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>

              {/* Title & Metadata */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-300 border border-violet-500/30">
                    <Calendar size={13} />
                    {project.year || '2026'}
                  </span>
                  {project.livePlatform && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {project.livePlatform}
                    </span>
                  )}
                </div>

                <h3
                  id="modal-project-title"
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1"
                >
                  {project.name}
                </h3>
              </div>

              {/* Overview */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Overview
                </h4>
                <p className="text-base leading-relaxed text-slate-300">
                  {project.description}
                </p>
              </div>

              {/* Architectural Highlights (from resume) */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    Key Architecture & Engineering Highlights
                  </h4>
                  <ul className="flex flex-col gap-2.5">
                    {project.highlights.map((highlight, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm sm:text-base leading-relaxed text-slate-200"
                      >
                        <CheckCircle2
                          size={18}
                          className="text-cyan-400 shrink-0 mt-0.5"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack Pills */}
              <div className="flex flex-col gap-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-xl border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition-transform duration-200 hover:scale-105 shadow-md focus-ring"
                  >
                    <span>Launch Live Demo</span>
                    <ExternalLink size={16} />
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus-ring"
                  >
                    <SiGithub size={18} />
                    <span>View Repository</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
